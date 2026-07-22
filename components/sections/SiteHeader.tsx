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
  { href: "/funny", label: "Funny" },
  { href: "/family", label: "Family" },
  { href: "/about", label: "About" },
];

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-lavender/30 bg-white/90 backdrop-blur-md">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Hamburger — mobile only */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink hover:bg-cream lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span className="text-2xl leading-none">{open ? "✕" : "☰"}</span>
        </button>

        {/* Logo — centred on mobile, left on desktop */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="group absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5 lg:static lg:translate-x-0"
        >
          <span className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-soft-pink/30 text-soft-pink-deep transition-transform group-hover:scale-105 lg:flex">
            <HeartIcon className="h-5 w-5" />
          </span>
          <span className="flex flex-col items-center leading-none lg:items-start">
            <span className="font-hand text-2xl font-bold text-ink sm:text-3xl lg:text-2xl">
              Manasvi
            </span>
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
                  isActive(l.href) ? "text-soft-pink-deep" : "text-ink-soft hover:text-soft-pink-deep"
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

        {/* Right: heart on mobile, search + pill on desktop */}
        <Link
          href="/favorites"
          aria-label="My Favorites"
          className="flex h-10 w-10 items-center justify-center text-soft-pink-deep transition-transform hover:scale-110 lg:hidden"
        >
          <HeartIcon />
        </Link>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
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
            className="inline-flex items-center gap-1.5 rounded-full bg-soft-pink-deep px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105"
          >
            <HeartIcon className="h-4 w-4" />
            My Favorites
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="border-t border-lavender/30 bg-white/95 px-4 py-3 lg:hidden">
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
              href="/search"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-cream"
            >
              Search
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
