"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="pinned lg:pl-10">
      <div className="flex h-16 items-center justify-between gap-4 border-b border-line lg:h-24">
        <nav
          aria-label="Main"
          className="flex flex-1 items-center justify-between gap-4 sm:justify-around"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className="nav-link text-sm font-medium tracking-wide sm:text-base"
            >
              {label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
