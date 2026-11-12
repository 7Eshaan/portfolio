import { cacheLife } from "next/cache";

export type Project = {
  name: string;
  owner: string;
  url: string;
  description: string;
  language: string | null;
  /** The repo's "website" link on GitHub, if it has one. */
  demo: string | null;
  /** Languages GitHub detects in the repo, biggest first. */
  tech: string[];
};

type BaseProject = Omit<Project, "demo" | "tech">;

const HEADERS = { "User-Agent": "portfolio-site" };

function apiHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  return token ? { ...HEADERS, Authorization: `Bearer ${token}` } : HEADERS;
}

/**
 * Pinned repositories for a GitHub user, refreshed roughly hourly.
 *
 * - With a GITHUB_TOKEN env var set, uses the official GraphQL API.
 * - Without one, reads the pinned section of the public profile page.
 * - If both fail, falls back to the most recently pushed public repos.
 *
 * Only the first `limit` are kept; each of those is then topped up with its
 * live-demo link and language list.
 */
export async function getPinnedProjects(
  username: string,
  limit: number,
): Promise<Project[]> {
  "use cache";
  cacheLife("hours");

  const sources = [fromGraphQL, fromProfilePage, fromRestApi];
  for (const source of sources) {
    try {
      const projects = await source(username);
      if (projects.length > 0) {
        return Promise.all(projects.slice(0, limit).map(withDetails));
      }
    } catch {
      // try the next source
    }
  }
  return [];
}

/** Languages that make up less than this share of a repo are left out. */
const MIN_LANGUAGE_SHARE = 0.002;

const LANGUAGE_NAMES: Record<string, string> = { Dockerfile: "Docker" };

async function withDetails(project: BaseProject): Promise<Project> {
  const api = `https://api.github.com/repos/${project.owner}/${project.name}`;
  const [demo, tech] = await Promise.all([
    fetchJson<{ homepage?: string | null }>(api).then((repo) => {
      const url = repo?.homepage?.trim();
      return url && /^https?:\/\//.test(url) ? url : null;
    }),
    fetchJson<Record<string, number>>(`${api}/languages`).then((bytes) => {
      const entries = Object.entries(bytes ?? {}).filter(
        ([, n]) => typeof n === "number",
      );
      const total = entries.reduce((sum, [, n]) => sum + n, 0);
      return entries
        .filter(([, n]) => n / total >= MIN_LANGUAGE_SHARE)
        .sort((a, b) => b[1] - a[1])
        .map(([name]) => LANGUAGE_NAMES[name] ?? name);
    }),
  ]);

  return {
    ...project,
    demo,
    // If the language list couldn't be fetched, fall back to the main language.
    tech: tech.length > 0 ? tech : project.language ? [project.language] : [],
  };
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: apiHeaders() });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

async function fromGraphQL(username: string): Promise<BaseProject[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];

  const query = `
    query ($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              url
              description
              owner { login }
              primaryLanguage { name }
            }
          }
        }
      }
    }`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...HEADERS, Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables: { login: username } }),
  });
  if (!res.ok) return [];

  type Node = {
    name: string;
    url: string;
    description: string | null;
    owner: { login: string };
    primaryLanguage: { name: string } | null;
  };
  const json = (await res.json()) as {
    data?: { user?: { pinnedItems: { nodes: Node[] } } };
  };

  return (json.data?.user?.pinnedItems.nodes ?? []).map((n) => ({
    name: n.name,
    owner: n.owner.login,
    url: n.url,
    description: n.description ?? "",
    language: n.primaryLanguage?.name ?? null,
  }));
}

async function fromProfilePage(username: string): Promise<BaseProject[]> {
  const res = await fetch(`https://github.com/${username}`, {
    headers: HEADERS,
  });
  if (!res.ok) return [];
  const html = await res.text();

  const projects: BaseProject[] = [];
  const blocks = html.split("pinned-item-list-item-content").slice(1);

  for (const raw of blocks) {
    const block = raw.split("</li>")[0];
    const link = block.match(/href="\/([^"/]+)\/([^"/]+)"/);
    if (!link) continue; // e.g. a pinned gist

    const desc = block.match(/pinned-item-desc[^>]*>([\s\S]*?)<\/p>/);
    const lang = block.match(/itemprop="programmingLanguage">([^<]+)</);

    projects.push({
      owner: link[1],
      name: link[2],
      url: `https://github.com/${link[1]}/${link[2]}`,
      description: desc ? cleanText(desc[1]) : "",
      language: lang ? cleanText(lang[1]) : null,
    });
  }
  return projects;
}

async function fromRestApi(username: string): Promise<BaseProject[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=pushed&per_page=6`,
    { headers: HEADERS },
  );
  if (!res.ok) return [];

  type Repo = {
    name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    fork: boolean;
    owner: { login: string };
  };
  const repos = (await res.json()) as Repo[];

  return repos
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name,
      owner: r.owner.login,
      url: r.html_url,
      description: r.description ?? "",
      language: r.language,
    }));
}

function cleanText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
