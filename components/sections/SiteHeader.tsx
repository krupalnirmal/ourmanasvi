"use client";

import { useState } from "react";
import Link from "next/link";
import { cld } from "@/lib/cld";

const LOGO =
  "https://res.cloudinary.com/dt1zpdsy1/image/upload/v1784023832/ourmanasvi/logo.png";

const NAV = [
  { href: "/#timeline", label: "Journey" },
  { href: "/family", label: "Family" },
  { href: "/places", label: "Places" },
  { href: "/events", label: "Events" },
];
const MORE = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function SearchBar({ big = false }: { big?: boolean }) {
  return (
    <form action="/search" className={big ? "w-full" : "hidden flex-1 md:flex md:max-w-md lg:max-w-lg"}>
      <div className="flex w-full items-center rounded-full bg-white/90 py-1 pl-4 pr-1 shadow-sm ring-1 ring-lavender/50 focus-within:ring-lavender-deep">
        <input
          name="q"
          placeholder="Search memories, months, family…"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-ink outline-none placeholder:text-ink-soft/70"
        />
        <span className="mr-1 hidden items-center gap-1 border-l border-lavender/50 pl-3 text-xs font-medium text-ink-soft sm:flex">
          All
          <span className="text-[10px]">▾</span>
        </span>
        <button
          type="submit"
          aria-label="Search"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-soft-pink-deep text-white transition-transform hover:scale-105"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </div>
    </form>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-lavender/40 bg-cream/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group shrink-0" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cld(LOGO, "h_110,c_limit,q_auto,f_auto")}
            alt="OurManasvi"
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-105 sm:h-11"
          />
        </Link>

        {/* Search (desktop) */}
        <SearchBar />

        {/* Desktop nav */}
        <ul className="ml-auto hidden items-center gap-6 lg:flex">
          {NAV.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-medium text-ink-soft transition-colors hover:text-soft-pink-deep">
                {l.label}
              </a>
            </li>
          ))}
          {/* More dropdown */}
          <li className="relative">
            <button
              onClick={() => setMoreOpen((o) => !o)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className="flex items-center gap-1 text-sm font-medium text-ink-soft transition-colors hover:text-soft-pink-deep"
            >
              More <span className="text-[10px]">▾</span>
            </button>
            {moreOpen && (
              <ul className="absolute right-0 top-8 w-40 overflow-hidden rounded-2xl border border-lavender/40 bg-white py-1 shadow-lg">
                {MORE.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block px-4 py-2 text-sm text-ink-soft hover:bg-cream hover:text-soft-pink-deep">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        {/* Right actions (desktop) */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <Link href="/contact" className="text-sm font-medium text-ink-soft hover:text-ink">
            Guestbook
          </Link>
          <Link
            href="/admin/login"
            className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Log in
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl text-ink hover:bg-lavender/40 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span className="text-2xl leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-lavender/40 bg-cream/95 px-4 py-3 lg:hidden">
          <SearchBar big />
          <ul className="mt-3 space-y-1">
            {[...NAV, ...MORE].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-lavender/30 hover:text-soft-pink-deep"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-ink px-5 py-2.5 text-center text-sm font-semibold text-white"
          >
            Log in
          </Link>
        </div>
      )}
    </header>
  );
}
