import type { Metadata } from "next";
import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa6";
import {
  SiCplusplus,
  SiDocker,
  SiFirebase,
  SiGit,
  SiGo,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiRedis,
  SiSupabase,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { site, techStack } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

const icons: Record<string, IconType> = {
  Java: FaJava,
  Go: SiGo,
  Python: SiPython,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  "C++": SiCplusplus,
  "Node.js": SiNodedotjs,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Redis: SiRedis,
  Supabase: SiSupabase,
  Docker: SiDocker,
  Postman: SiPostman,
  React: SiReact,
  "Next.js": SiNextdotjs,
  Svelte: SiSvelte,
  "Tailwind CSS": SiTailwindcss,
  Firebase: SiFirebase,
  Git: SiGit,
};

export default function About() {
  return (
    <>
      <section className="pb-14">
        <p className="mb-5 text-sm font-medium tracking-[0.2em] text-muted uppercase">
          About
        </p>
        <h1 className="sheen-text text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
          A bit more <span className="gradient-text">about me</span>.
        </h1>
        <div className="mt-6 max-w-2xl space-y-5 text-lg leading-relaxed text-pretty text-muted spotlight-copy">
          {site.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section aria-labelledby="stack" className="border-t border-line pt-10">
        <h2 id="stack" className="sheen-text text-3xl font-extrabold tracking-tight">
          Tech stack
        </h2>

        <dl className="mt-8 space-y-8">
          {techStack.map((group) => (
            <div
              key={group.title}
              className="grid gap-3 sm:grid-cols-[11rem_1fr] sm:items-start sm:gap-6"
            >
              <dt className="pt-2 text-sm font-medium tracking-wide text-muted">
                {group.title}
              </dt>
              <dd className="flex flex-wrap gap-3">
                {group.items.map((item) => {
                  const Icon = icons[item];
                  return (
                    <span
                      key={item}
                      className="grad-border lift group inline-flex cursor-default items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium backdrop-blur-sm"
                    >
                      {Icon && (
                        <Icon className="size-4 text-muted transition-all duration-300 group-hover:scale-110 group-hover:text-fg" />
                      )}
                      {item}
                    </span>
                  );
                })}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
