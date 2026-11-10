import type { Metadata } from "next";
import { FiArrowUpRight } from "react-icons/fi";
import { ProjectGrid } from "@/components/ProjectViews";
import { getPinnedProjects } from "@/lib/github";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Projects" };

export default async function Projects() {
  const projects = await getPinnedProjects(site.githubUsername);

  return (
    <>
      <section className="pb-10">
        <p className="mb-5 text-sm font-medium tracking-[0.2em] text-muted uppercase">
          Projects
        </p>
        <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
          Things I&apos;ve <span className="gradient-text">built</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Pulled live from my pinned repositories on GitHub.
        </p>
      </section>

      <ProjectGrid projects={projects} />

      <a
        href={`https://github.com/${site.githubUsername}?tab=repositories`}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-link group mt-10 inline-flex items-center gap-2 text-sm font-medium"
      >
        Everything else on GitHub
        <FiArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </>
  );
}
