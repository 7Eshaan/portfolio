"use client";

import { useEffect, useRef } from "react";

/** How long the thumb stays visible after the last scroll, in ms. */
const HIDE_AFTER = 900;
/** Gap kept above and below the thumb, in px. */
const INSET = 4;
const MIN_THUMB = 40;

/**
 * The site's scrollbar: a gradient thumb that floats over the right edge,
 * fades in while the page is scrolling and fades out when it stops.
 * The browser's own scrollbar is hidden in globals.css ("Scrollbar").
 * It only shows position; scrolling itself is unchanged.
 */
export function ScrollIndicator() {
  const thumb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = thumb.current;
    if (!el) return;

    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;

    function place() {
      frame = 0;
      if (!el) return;
      const view = window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const scrollable = total - view;
      if (scrollable <= 0) {
        el.classList.remove("is-visible");
        return;
      }
      const track = view - INSET * 2;
      const height = Math.max(MIN_THUMB, (view / total) * track);
      const top = INSET + (window.scrollY / scrollable) * (track - height);
      el.style.height = `${height}px`;
      el.style.transform = `translateY(${top}px)`;
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(place);
      if (document.documentElement.scrollHeight > window.innerHeight) {
        el?.classList.add("is-visible");
      }
      clearTimeout(hideTimer);
      hideTimer = setTimeout(
        () => el?.classList.remove("is-visible"),
        HIDE_AFTER,
      );
    }

    place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", place);
      clearTimeout(hideTimer);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={thumb} className="scroll-thumb" aria-hidden="true" />;
}
