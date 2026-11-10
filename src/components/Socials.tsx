"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import { FaDiscord, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FiCheck } from "react-icons/fi";
import { SiGmail } from "react-icons/si";
import { site } from "@/lib/site";

const buttonClass =
  "social grid size-9 cursor-pointer place-items-center text-muted sm:size-10";

const links: { label: string; href: string; Icon: IconType }[] = [
  { label: "GitHub", href: site.socials.github, Icon: FaGithub },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: FaLinkedinIn },
  { label: "X", href: site.socials.x, Icon: FaXTwitter },
  { label: "Gmail", href: `mailto:${site.socials.email}`, Icon: SiGmail },
];

/**
 * Two stacked copies of the icon: the plain one, and a gradient-filled one
 * that wipes in over it on hover (see `.social` in globals.css).
 */
function WipeIcon({ Icon }: { Icon: IconType }) {
  return (
    <>
      <Icon className="size-[1.15rem]" />
      <Icon className="social-fill size-[1.15rem]" aria-hidden="true" />
    </>
  );
}

export function Socials() {
  const [copied, setCopied] = useState(false);

  async function copyDiscord() {
    try {
      await navigator.clipboard.writeText(site.socials.discord);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked — the username is still in the tooltip
    }
  }

  return (
    <>
      {/* Gradient the icons are filled with on hover. */}
      <svg aria-hidden="true" className="absolute size-0">
        <defs>
          <linearGradient id="social-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" style={{ stopColor: "var(--icon-from)" }} />
            <stop offset="0.55" style={{ stopColor: "var(--icon-via)" }} />
            <stop offset="1" style={{ stopColor: "var(--icon-to)" }} />
          </linearGradient>
        </defs>
      </svg>

      <ul className="flex items-center justify-between border-y border-line py-3">
        {links.map(({ label, href, Icon }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className={buttonClass}
            >
              <WipeIcon Icon={Icon} />
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={copyDiscord}
            aria-label={
              copied ? "Discord username copied" : "Copy Discord username"
            }
            title={`Discord: ${site.socials.discord} (click to copy)`}
            className={buttonClass}
          >
            <WipeIcon Icon={copied ? FiCheck : FaDiscord} />
          </button>
        </li>
      </ul>
    </>
  );
}
