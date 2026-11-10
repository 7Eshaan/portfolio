import { FiArrowUpRight, FiStar } from "react-icons/fi";
import type { Project } from "@/lib/github";
import { site } from "@/lib/site";

function Language({ project }: { project: Project }) {
  if (!project.language) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="size-2.5 rounded-full"
        style={{ background: project.languageColor ?? "#a020f0" }}
      />
      {project.language}
    </span>
  );
}

export function EmptyProjects() {
  return (
    <p className="text-muted">
      Couldn&apos;t load pinned projects right now —{" "}
      <a
        href={`https://github.com/${site.githubUsername}`}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-link text-fg"
      >
        see them on GitHub
      </a>
      .
    </p>
  );
}

/** Compact numbered rows, used on the home page. */
export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <EmptyProjects />;

  return (
    <ol className="border-t border-line">
      {projects.map((project, i) => (
        <li key={project.url}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="sweep group flex items-baseline gap-4 border-b border-line px-3 py-5"
          >
            <span className="font-mono text-sm text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-4">
              <span className="sheen-text block shrink-0 text-lg font-extrabold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                {project.name}
              </span>
              <span className="mt-1 block text-sm text-muted sm:mt-0 sm:truncate">
                {project.description || "No description yet."}
              </span>
            </span>
            <FiArrowUpRight className="size-5 shrink-0 self-center text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Fuller cards, used on the projects page. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <EmptyProjects />;

  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {projects.map((project) => (
        <li key={project.url}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="grad-border lift group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="sheen-text text-xl font-extrabold tracking-tight break-words">
                {project.name}
              </h2>
              <FiArrowUpRight className="mt-1 size-5 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
              {project.description || "No description yet."}
            </p>
            <div className="mt-6 flex items-center gap-5 text-xs text-muted">
              <Language project={project} />
              <span className="inline-flex items-center gap-1.5">
                <FiStar className="size-3.5" />
                {project.stars}
              </span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
