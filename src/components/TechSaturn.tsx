"use client";

import { useEffect, useRef, useState } from "react";
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
import { techStack } from "@/lib/site";

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
  Firebase: SiFirebase,
  React: SiReact,
  "Next.js": SiNextdotjs,
  Svelte: SiSvelte,
  "Tailwind CSS": SiTailwindcss,
  Git: SiGit,
  Docker: SiDocker,
  Postman: SiPostman,
};

/**
 * Each tool's own brand colour, used for its glow on hover. Next.js is
 * black-and-white, so it follows the theme (see --brand-next in globals.css).
 */
const brand: Record<string, string> = {
  Java: "#E8392E",
  Go: "#00ADD8",
  Python: "#4B8BBE",
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  "C++": "#659AD2",
  "Node.js": "#5FA04E",
  PostgreSQL: "#4169E1",
  MongoDB: "#47A248",
  Redis: "#FF4438",
  Supabase: "#3FCF8E",
  Firebase: "#FFCA28",
  React: "#61DAFB",
  "Next.js": "var(--brand-next)",
  Svelte: "#FF3E00",
  "Tailwind CSS": "#38BDF8",
  Git: "#F05032",
  Docker: "#2496ED",
  Postman: "#FF6C37",
};

/** Rings from the planet outwards. Bigger groups sit further out. */
const RING_ORDER = ["Tools & DevOps", "Frontend", "Backend", "Languages"];
const rings = RING_ORDER.map((title) => {
  const group = techStack.find((g) => g.title === title);
  return { title, items: group ? [...group.items] : [] };
});

/* Geometry, as fractions of the stage width. */
const PLANET = 0.13; // planet radius
const RADII = [0.2, 0.28, 0.37, 0.46]; // ring radii (horizontal)
/** Narrow screens tip the rings further towards us so icons don't pile up. */
function shape(w: number) {
  return w < 520
    ? { aspect: 0.74, flatten: 0.44 } // stage height / width, ring squash
    : { aspect: 0.54, flatten: 0.3 };
}
const TILT = (-12 * Math.PI) / 180; // the whole system leans a little
const BAND = 0.034; // ring band thickness
/** Radians per second; alternating directions so it never looks mechanical. */
const SPEEDS = [0.3, -0.2, 0.14, -0.095];
const START = [0.4, 1.9, 3.1, 4.6];

export function TechSaturn() {
  const stage = useRef<HTMLDivElement>(null);
  const orbs = useRef<(HTMLSpanElement | null)[][]>(rings.map(() => []));
  const angles = useRef([...START]);
  const hovered = useRef<number | null>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  // Track the stage width so everything scales with the column.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Orbit loop: positions are written straight to the DOM, not React state,
  // so 60 fps costs no re-renders. Stops while the section is off screen.
  useEffect(() => {
    if (!width) return;
    const w = width;
    const { aspect, flatten } = shape(w);
    const cx = w / 2;
    const cy = (w * aspect) / 2;
    const cos = Math.cos(TILT);
    const sin = Math.sin(TILT);

    function place() {
      rings.forEach((ring, i) => {
        const rx = RADII[i] * w;
        const ry = rx * flatten;
        ring.items.forEach((_, j) => {
          const el = orbs.current[i][j];
          if (!el) return;
          const a = angles.current[i] + (j / ring.items.length) * Math.PI * 2;
          const x0 = rx * Math.cos(a);
          const y0 = ry * Math.sin(a);
          const depth = Math.sin(a); // > 0: lower half, in front of the planet
          const x = cx + x0 * cos - y0 * sin;
          const y = cy + x0 * sin + y0 * cos;
          const scale = 0.78 + 0.22 * ((depth + 1) / 2);
          el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
          el.style.zIndex = depth > 0 ? "4" : "1";
          el.style.opacity = String(0.55 + 0.45 * ((depth + 1) / 2));
        });
      });
    }

    place();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = 0;
    function tick(now: number) {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      SPEEDS.forEach((speed, i) => {
        if (hovered.current !== i) angles.current[i] += speed * dt;
      });
      place();
      raf = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    if (stage.current) io.observe(stage.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [width]);

  const w = width || 1;
  const { aspect, flatten } = shape(width || 1000);
  const h = w * aspect;
  const cx = w / 2;
  const cy = h / 2;
  const tiltDeg = (TILT * 180) / Math.PI;
  const orbSize = Math.round(Math.min(52, Math.max(32, w * 0.068)));

  function ringClass(i: number) {
    if (active === null) return "saturn-ring";
    return active === i ? "saturn-ring is-active" : "saturn-ring is-dim";
  }

  // Back halves of the rings go behind the planet, front halves over it.
  function ringLayer(front: boolean) {
    return (
      <svg
        className="saturn-rings"
        style={{ zIndex: front ? 3 : 0 }}
        viewBox={`0 0 ${w} ${h}`}
        aria-hidden="true"
      >
        {!front && (
          <defs>
            {/* The headings' white-to-silver, run from the back of each ring
                (silver) to the front (white). */}
            {rings.map((ring, i) => {
              const ry = RADII[i] * w * flatten;
              return (
                <linearGradient
                  key={ring.title}
                  id={`saturn-silver-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={cx}
                  y1={cy - ry}
                  x2={cx}
                  y2={cy + ry}
                >
                  <stop offset="0" className="saturn-silver-a" />
                  <stop offset="0.55" className="saturn-silver-b" />
                  <stop offset="1" className="saturn-silver-c" />
                </linearGradient>
              );
            })}
          </defs>
        )}
        {rings.map((ring, i) => {
          const rx = RADII[i] * w;
          const ry = rx * flatten;
          const d = front
            ? `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`
            : `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx - rx} ${cy}`;
          return (
            <g
              key={ring.title}
              className={ringClass(i)}
              transform={`rotate(${tiltDeg} ${cx} ${cy})`}
            >
              <path
                d={d}
                className="saturn-band"
                stroke={`url(#saturn-silver-${i})`}
                strokeWidth={BAND * w}
              />
              <path
                d={d}
                className="saturn-line"
                stroke={`url(#saturn-silver-${i})`}
              />
            </g>
          );
        })}
      </svg>
    );
  }

  const shown = active === null ? null : rings[active];

  return (
    <div>
      <div
        ref={stage}
        className={`saturn ${width ? "is-ready" : ""}`}
        style={{ aspectRatio: `1 / ${aspect}` }}
        aria-hidden="true"
      >
        {ringLayer(false)}

        <div
          className="saturn-planet"
          style={{
            width: PLANET * 2 * w,
            height: PLANET * 2 * w,
            left: cx - PLANET * w,
            top: cy - PLANET * w,
          }}
        >
          <span className="saturn-bands" />
        </div>

        {ringLayer(true)}

        {rings.map((ring, i) =>
          ring.items.map((item, j) => {
            const Icon = icons[item];
            const state =
              active === null ? "" : active === i ? "is-active" : "is-dim";
            return (
              <span
                key={item}
                ref={(el) => {
                  orbs.current[i][j] = el;
                }}
                className="saturn-orb"
                onPointerEnter={() => (hovered.current = i)}
                onPointerLeave={() => (hovered.current = null)}
                onClick={() => setActive(active === i ? null : i)}
              >
                <span
                  className={`saturn-orb-face ${state}`}
                  style={
                    {
                      width: orbSize,
                      height: orbSize,
                      "--brand": brand[item] ?? "var(--ring-b)",
                    } as React.CSSProperties
                  }
                >
                  {Icon && <Icon style={{ width: "48%", height: "48%" }} />}
                  <span className="saturn-tip">{item}</span>
                </span>
              </span>
            );
          }),
        )}
      </div>

      {/* Ring picker */}
      <div
        role="group"
        aria-label="Highlight a ring"
        className="mt-6 flex flex-wrap justify-center gap-2"
      >
        {[null, 3, 1, 2, 0].map((i) => {
          const on = active === i;
          const label = i === null ? "All" : rings[i].title;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(i)}
              className={`grad-border lift inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors ${
                on ? "is-on text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {label}
              {i !== null && (
                <span className="font-mono text-xs text-muted">
                  {rings[i].items.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* What's on the highlighted ring, as text. */}
      <p
        aria-live="polite"
        className="mt-5 min-h-[1.5rem] text-center text-sm text-pretty text-muted"
      >
        {shown && (
          <>
            <span className="font-medium text-fg">{shown.title}:</span>{" "}
            {shown.items.join(" · ")}
          </>
        )}
      </p>

      {/* The full list for screen readers and search engines. */}
      <dl className="sr-only">
        {rings.map((ring) => (
          <div key={ring.title}>
            <dt>{ring.title}</dt>
            <dd>{ring.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
