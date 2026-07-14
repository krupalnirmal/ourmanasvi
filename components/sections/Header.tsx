"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-cream/80 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center px-6 py-3.5">
        <Link href="/" className="group flex items-center gap-3">
          {/* Emblem — gradient heart badge (visible on any background) */}
          <span
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-lg text-white shadow-md ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
            style={{
              background:
                "linear-gradient(135deg, var(--color-soft-pink-deep), var(--color-lavender-deep))",
            }}
            aria-hidden
          >
            ♥
          </span>

          {/* Wordmark + tiny tagline */}
          <span
            className="flex flex-col leading-none"
            style={{ textShadow: "0 1px 10px rgba(255,248,240,0.7)" }}
          >
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              Our<span className="text-soft-pink-deep">Manasvi</span>
            </span>
            <span className="mt-0.5 font-hand text-base leading-none text-ink-soft">
              a year of firsts
            </span>
          </span>
        </Link>
      </nav>
    </header>
  );
}
