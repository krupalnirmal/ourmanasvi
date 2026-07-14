"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Slim top progress bar shown during page navigations, so it's obvious that
 * something is loading. Starts on internal link clicks, completes when the
 * route (path or query) changes.
 */
export default function TopProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const done = useRef<ReturnType<typeof setTimeout> | null>(null);

  function start() {
    if (done.current) clearTimeout(done.current);
    setVisible(true);
    setWidth(8);
    if (trickle.current) clearInterval(trickle.current);
    trickle.current = setInterval(() => {
      setWidth((w) => (w < 90 ? Math.min(w + Math.random() * 12, 90) : w));
    }, 300);
  }

  function complete() {
    if (trickle.current) clearInterval(trickle.current);
    setWidth(100);
    done.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 300);
  }

  // Start on same-origin link clicks that change the page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || a.target === "_blank" || a.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Also start on form submits (e.g. the search bar).
  useEffect(() => {
    const onSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (form?.method?.toLowerCase() === "get" && form.getAttribute("action")) start();
    };
    document.addEventListener("submit", onSubmit, true);
    return () => document.removeEventListener("submit", onSubmit, true);
  }, []);

  // Complete when the route settles.
  useEffect(() => {
    complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]">
      <div
        className="h-full rounded-r-full bg-gradient-to-r from-soft-pink-deep via-rose-deep to-lavender-deep shadow-[0_0_8px_rgba(194,77,114,0.6)] transition-[width] duration-300 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
