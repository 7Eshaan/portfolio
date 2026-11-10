import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { ProjectList } from "@/components/ProjectViews";
import { getPinnedProjects } from "@/lib/github";
import { site } from "@/lib/site";

export default async function Home() {
  const projects = await getPinnedProjects(site.githubUsername);

  return (
    <>
      <section className="pb-14">
        <h1 className="sheen-text text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
          {site.home.greeting}{" "}
          <span className="gradient-text">{site.name}</span>.
        </h1>
        <div className="mt-6 max-w-2xl space-y-5 text-lg leading-relaxed text-pretty text-muted spotlight-copy">
          {site.home.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Link
          href="/about"
          className="nav-link group mt-8 inline-flex items-center gap-2 text-sm font-medium"
        >
          More about me
          <FiArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </section>

      <section aria-labelledby="projects" className="border-t border-line pt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="projects" className="sheen-text text-3xl font-extrabold tracking-tight">
            Projects
          </h2>
          <Link
            href="/projects"
            className="nav-link group inline-flex items-center gap-2 text-sm font-medium"
          >
            View all
            <FiArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <ProjectList projects={projects} />
      </section>
    </>
  );
}
