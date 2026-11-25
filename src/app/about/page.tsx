import type { Metadata } from "next";
import { TechSaturn } from "@/components/TechSaturn";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

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
        <h2
          id="stack"
          className="sheen-text text-3xl font-extrabold tracking-tight"
        >
          Tech stack
        </h2>

        <p className="mt-3 text-muted">
          Everything I build with, orbiting in its own ring.
        </p>

        <div className="mt-8">
          <TechSaturn />
        </div>
      </section>
    </>
  );
}
