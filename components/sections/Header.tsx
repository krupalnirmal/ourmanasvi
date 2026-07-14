"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cld } from "@/lib/cld";

const LOGO =
  "https://res.cloudinary.com/dt1zpdsy1/image/upload/v1784023832/ourmanasvi/logo.png";

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
      <nav className="mx-auto flex max-w-6xl items-center px-6 py-2.5">
        <Link href="/" className="group inline-flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cld(LOGO, "h_160,c_limit,q_auto,f_auto")}
            alt="OurManasvi — A Year of Firsts"
            className="h-14 w-auto drop-shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-16"
          />
        </Link>
      </nav>
    </header>
  );
}
