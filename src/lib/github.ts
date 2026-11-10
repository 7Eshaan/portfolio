import { cacheLife } from "next/cache";

export type Project = {
  name: string;
  owner: string;
  url: string;
  description: string;
  language: string | null;
  languageColor: string | null;
  stars: string;
};

const HEADERS = { "User-Agent": "portfolio-site" };

/**
 * Pinned repositories for a GitHub user, refreshed roughly hourly.
 *
 * - With a GITHUB_TOKEN env var set, uses the official GraphQL API.
 * - Without one, reads the pinned section of the public profile page.
 * - If both fail, falls back to the most recently pushed public repos.
 */
export async function getPinnedProjects(username: string): Promise<Project[]> {
  "use cache";
  cacheLife("hours");

  const sources = [fromGraphQL, fromProfilePage, fromRestApi];
  for (const source of sources) {
    try {
      const projects = await source(username);
      if (projects.length > 0) return projects;
    } catch {
      // try the next source
    }
  }
  return [];
}

async function fromGraphQL(username: string): Promise<Project[]> {
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
              stargazerCount
              owner { login }
              primaryLanguage { name color }
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
    stargazerCount: number;
    owner: { login: string };
    primaryLanguage: { name: string; color: string | null } | null;
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
    languageColor: n.primaryLanguage?.color ?? null,
    stars: String(n.stargazerCount),
  }));
}

async function fromProfilePage(username: string): Promise<Project[]> {
  const res = await fetch(`https://github.com/${username}`, {
    headers: HEADERS,
  });
  if (!res.ok) return [];
  const html = await res.text();

  const projects: Project[] = [];
  const blocks = html.split("pinned-item-list-item-content").slice(1);

  for (const raw of blocks) {
    const block = raw.split("</li>")[0];
    const link = block.match(/href="\/([^"/]+)\/([^"/]+)"/);
    if (!link) continue; // e.g. a pinned gist

    const desc = block.match(/pinned-item-desc[^>]*>([\s\S]*?)<\/p>/);
    const lang = block.match(/itemprop="programmingLanguage">([^<]+)</);
    const color = block.match(
      /repo-language-color"\s+style="background-color:\s*([^";]+)/,
    );
    const stars = block.match(/\/stargazers"[\s\S]*?<\/svg>\s*([\d.,k]+)/);

    projects.push({
      owner: link[1],
      name: link[2],
      url: `https://github.com/${link[1]}/${link[2]}`,
      description: desc ? cleanText(desc[1]) : "",
      language: lang ? cleanText(lang[1]) : null,
      languageColor: color ? color[1].trim() : null,
      stars: stars ? stars[1] : "0",
    });
  }
  return projects;
}

async function fromRestApi(username: string): Promise<Project[]> {
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
    stargazers_count: number;
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
      languageColor: null,
      stars: String(r.stargazers_count),
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
