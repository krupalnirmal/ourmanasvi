import Link from "next/link";

const LINKS = [
  { href: "/#timeline", label: "Journey" },
  { href: "/family", label: "Family" },
  { href: "/places", label: "Places" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-lavender/30 px-6 py-14 text-center">
      <p className="font-hand text-3xl text-soft-pink-deep">Made with love, for Manasvi</p>

      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-soft-pink-deep"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-ink-soft">
        A year of firsts · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
