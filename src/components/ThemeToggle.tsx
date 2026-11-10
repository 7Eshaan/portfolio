"use client";

import { FiMoon, FiSun } from "react-icons/fi";

/**
 * Flips the `dark` class on <html> and remembers the choice.
 * The initial class is set by the inline script in the root layout,
 * so there is no flash and no state to hydrate here.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage unavailable — the toggle still works for this visit
    }
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
