"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/journey", label: "Timeline" },
  { href: "/gallery", label: "Gallery" },
  { href: "/events", label: "Events" },
  { href: "/milestones", label: "Milestones" },
  { href: "/places", label: "Trips" },
  { href: "/family", label: "Family" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-lavender/40 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)} className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-soft-pink/30 text-soft-pink-deep transition-transform group-hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-hand text-2xl font-bold text-ink">Manasvi</span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-soft">
              Forever Memories
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
          {NAV.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(l.href)
                    ? "text-soft-pink-deep"
                    : "text-ink-soft hover:text-soft-pink-deep"
                }`}
              >
                {l.label}
                {isActive(l.href) && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-soft-pink-deep" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <Link
            href="/favorites"
            className="hidden items-center gap-1.5 rounded-full bg-soft-pink-deep px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 sm:inline-flex"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            My Favorites
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink hover:bg-cream lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span className="text-2xl leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="border-t border-lavender/40 bg-white/95 px-4 py-3 lg:hidden">
          {NAV.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(l.href)
                    ? "bg-soft-pink/25 text-soft-pink-deep"
                    : "text-ink-soft hover:bg-cream"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/favorites"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-soft-pink-deep px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              ♥ My Favorites
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
