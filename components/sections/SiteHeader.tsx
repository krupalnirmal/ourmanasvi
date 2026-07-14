"use client";

import { useState } from "react";
import Link from "next/link";
import { cld } from "@/lib/cld";

const LOGO =
  "https://res.cloudinary.com/dt1zpdsy1/image/upload/v1784023832/ourmanasvi/logo.png";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/#timeline", label: "Journey" },
  { href: "/family", label: "Family" },
  { href: "/places", label: "Places" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-lavender/40 bg-cream/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
        <Link href="/" className="group inline-flex items-center" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cld(LOGO, "h_120,c_limit,q_auto,f_auto")}
            alt="OurManasvi"
            className="h-11 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-soft-pink-deep"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink hover:bg-lavender/40 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span className="text-2xl leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="border-t border-lavender/40 bg-cream/95 px-5 py-3 md:hidden">
          {NAV.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-lavender/30 hover:text-soft-pink-deep"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
