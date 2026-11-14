"use client";

import { FiMoon, FiSun } from "react-icons/fi";

/**
 * Flips the `dark` class on <html> and remembers the choice.
 * The initial class is set by the inline script in the root layout,
 * so there is no flash and no state to hydrate here.
 *
 * Where the browser supports view transitions, the new theme sweeps in along
 * the backdrop gradient (see "Theme sweep" in globals.css). Elsewhere, and for
 * people who prefer reduced motion, it switches instantly.
 */
export function ThemeToggle() {
  function apply() {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage unavailable — the toggle still works for this visit
    }
  }

  function toggle() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!document.startViewTransition || reduceMotion) {
      apply();
      return;
    }
    // If the animation can't run (e.g. the tab is in the background) the theme
    // still switches; only the sweep is skipped.
    document.startViewTransition(apply).ready.catch(() => {});
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="grad-border lift group relative grid size-9 cursor-pointer place-items-center rounded-full border border-line text-muted hover:text-fg"
    >
      <FiSun className="absolute size-4 scale-100 rotate-0 transition-transform duration-500 dark:scale-0 dark:-rotate-90" />
      <FiMoon className="absolute size-4 scale-0 rotate-90 transition-transform duration-500 dark:scale-100 dark:rotate-0" />
    </button>
  );
}
