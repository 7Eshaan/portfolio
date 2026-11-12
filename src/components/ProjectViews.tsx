import Image from "next/image";
import type { IconType } from "react-icons";
import { FaGithub, FaJava } from "react-icons/fa6";
import { FiArrowRight, FiArrowUpRight, FiExternalLink } from "react-icons/fi";
import {
  SiCplusplus,
  SiCss,
  SiDocker,
  SiGnubash,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiKotlin,
  SiPython,
  SiRust,
  SiSvelte,
  SiSwift,
  SiTypescript,
} from "react-icons/si";
import type { Project } from "@/lib/github";
import { projectDetails, site } from "@/lib/site";

/** Tech chips shown before the rest collapse into "+N". */
const MAX_TECH = 4;

const techIcons: Record<string, IconType> = {
  Go: SiGo,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  CSS: SiCss,
  HTML: SiHtml5,
  Docker: SiDocker,
  Shell: SiGnubash,
  Python: SiPython,
  Java: FaJava,
  "C++": SiCplusplus,
  Rust: SiRust,
  Svelte: SiSvelte,
  Kotlin: SiKotlin,
  Swift: SiSwift,
};

const buttonClass =
  "grad-border lift group/btn inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium backdrop-blur-sm";

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

function ProjectCard({ project }: { project: Project }) {
  const details = projectDetails[project.name.toLowerCase()];
  const title = details?.title ?? project.name;
  const description = details?.description ?? project.description;
  const image = details?.image;
  const tech = project.tech.slice(0, MAX_TECH);
  const moreTech = project.tech.length - tech.length;

  return (
    <article
      className={`project-card grad-border grid gap-7 rounded-3xl border border-line bg-surface p-6 backdrop-blur-sm sm:p-8 ${
        image ? "md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-9" : ""
      }`}
    >
      {image && (
        <div className="shot-stage">
          <div className="shot aspect-[16/10] overflow-hidden rounded-xl">
            <Image
              src={image.src}
              alt={`Screenshot of ${title}`}
              width={image.width}
              height={image.height}
              sizes="(min-width: 768px) 340px, 90vw"
              className="size-full object-cover"
              style={{ objectPosition: image.position ?? "top" }}
            />
          </div>
        </div>
      )}

      <div className="min-w-0">
        <h3 className="sheen-text text-2xl font-extrabold tracking-tight break-words sm:text-3xl">
          {title}
        </h3>
        <p className="mt-3 leading-relaxed text-pretty text-muted">
          {description || "No description yet."}
        </p>

        {tech.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Built with">
            {tech.map((name) => {
              const Icon = techIcons[name];
              return (
                <li
                  key={name}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium"
                >
                  {Icon && <Icon className="size-3.5 text-muted" />}
                  {name}
                </li>
              );
            })}
            {moreTech > 0 && (
              <li
                className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted"
                title={project.tech.slice(MAX_TECH).join(", ")}
              >
                +{moreTech}
              </li>
            )}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-6">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClass} is-on`}
            >
              <FiExternalLink className="size-4" />
              Live Demo
              <FiArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </a>
          )}
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
          >
            <FaGithub className="size-4" />
            View Source
            <FiArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </a>
        </div>
      </div>
    </article>
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

/** One card per project, stacked. Used on the projects page. */
export function ProjectCards({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <EmptyProjects />;

  return (
    <ul className="space-y-6">
      {projects.map((project) => (
        <li key={project.url}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}
