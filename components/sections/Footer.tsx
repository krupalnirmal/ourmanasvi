export default function Footer() {
  return (
    <footer className="bg-lavender/30 px-6 py-12 text-center">
      <p className="font-hand text-3xl text-soft-pink-deep">
        Made with love, for Manasvi
      </p>
      <p className="mt-3 text-sm text-ink-soft">
        A year of firsts · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
