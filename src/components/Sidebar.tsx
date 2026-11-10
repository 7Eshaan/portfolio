import Image from "next/image";
import Link from "next/link";
import { FaSpotify } from "react-icons/fa6";
import { site } from "@/lib/site";
import { Socials } from "./Socials";

/** Top-left cell: the name, aligned with the navbar row. */
export function SiteName() {
  return (
    <div className="flex h-16 items-end lg:h-24 lg:items-center lg:justify-center lg:pr-10">
      <Link
        href="/"
        className="text-3xl font-semibold tracking-tight transition-opacity duration-300 hover:opacity-80"
      >
        <span className="gradient-text">{site.name}</span>
      </Link>
    </div>
  );
}

const headingClass = "mb-3 text-lg font-semibold tracking-tight";

/** Enough copies that one half of a belt is always wider than its container. */
const REPEAT = 4;

function ListeningTo() {
  const { title, artist, album, cover, url } = site.listening;

  const half = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined}>
      {Array.from({ length: REPEAT }, (_, i) => (
        <span key={i} className="pr-8 text-sm whitespace-nowrap">
          <span className="font-medium text-fg">{title}</span>
          <span className="px-2 text-muted">·</span>
          <span className="text-muted">{artist}</span>
          <span className="px-2 text-muted">·</span>
          <span className="text-muted">{album}</span>
        </span>
      ))}
    </div>
  );

  return (
    <section aria-label="Listening to">
      <h2 className="mb-2 flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-muted uppercase">
        <span className="eq" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        Listening to
      </h2>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${title} by ${artist} — open in Spotify`}
        className="grad-border lift group flex items-center gap-3 rounded-xl border border-line bg-surface p-2 backdrop-blur-sm"
      >
        <Image
          src={cover}
          alt={`${album} album cover`}
          width={44}
          height={44}
          className="size-11 shrink-0 rounded-lg transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-3"
        />
        <div
          className="marquee min-w-0 flex-1"
          style={
            {
              "--marquee-duration": "32s",
              "--marquee-fade": "7%",
            } as React.CSSProperties
          }
        >
          <div className="marquee-track">
            {half(false)}
            {half(true)}
          </div>
        </div>
        <FaSpotify className="mr-1 size-4 shrink-0 text-muted transition-colors duration-300 group-hover:text-fg" />
      </a>
    </section>
  );
}

function Apps() {
  const half = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {Array.from({ length: REPEAT }, (_, i) =>
        site.apps.map((app) => (
          <li key={`${i}-${app.name}`} className="pr-5">
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${app.name} — ${app.note}`}
              aria-label={`${app.name}, ${app.note}`}
              tabIndex={hidden || i > 0 ? -1 : undefined}
              className="block opacity-75 saturate-[0.85] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-110 hover:opacity-100 hover:saturate-100"
            >
              <Image
                src={app.icon}
                alt=""
                width={40}
                height={40}
                className={`size-10 drop-shadow-[0_4px_10px_rgb(0_0_0/0.25)] ${"fullBleed" in app ? "scale-[0.84]" : ""}`}
              />
            </a>
          </li>
        )),
      )}
    </ul>
  );

  return (
    <section aria-labelledby="apps-heading">
      <h2 id="apps-heading" className={headingClass}>
        Apps I like to use
      </h2>
      <div
        className="marquee marquee-reverse border-y border-line py-3"
        style={{ "--marquee-duration": "60s" } as React.CSSProperties}
      >
        <div className="marquee-track">
          {half(false)}
          {half(true)}
        </div>
      </div>
    </section>
  );
}

/** Profile picture, socials and the two belts. Beside the content on desktop, below it on mobile. */
export function Sidebar() {
  return (
    <aside className="sidebar-sticky order-last min-w-0 space-y-8 border-t border-line py-10 lg:order-none lg:self-start lg:border-t-0 lg:pt-8 lg:pr-10 lg:pb-10">
      <div className="flex items-center gap-6 lg:block">
        <div className="pfp w-28 shrink-0 sm:w-40 lg:mx-auto lg:w-full lg:max-w-60">
          <div className="relative aspect-square overflow-hidden rounded-[inherit] border border-line">
            <Image
              src="/pfp.webp"
              alt={`${site.name}'s profile picture`}
              fill
              priority
              sizes="480px"
              className="origin-[50%_25%] scale-[1.4] object-cover transition-transform duration-700 ease-out hover:scale-[1.55]"
            />
          </div>
        </div>

        <section
          aria-labelledby="socials-heading"
          className="min-w-0 flex-1 lg:mt-8"
        >
          <h2 id="socials-heading" className={headingClass}>
            Socials
          </h2>
          <Socials />
        </section>
      </div>

      <ListeningTo />
      <Apps />
    </aside>
  );
}
