import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact — OurManasvi" };

export default function ContactPage() {
  return (
    <main className="flex-1">
      <section className="bg-cream px-6 pb-24 pt-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-hand text-3xl text-soft-pink-deep">say hello</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-5 leading-relaxed text-ink-soft">
            OurManasvi is a little keepsake made with love for family and friends. Have a photo, a
            memory, or a wish for Manasvi? We&apos;d love to hear from you.
          </p>

          <div className="mt-10 rounded-3xl bg-white/80 p-8 shadow-sm ring-1 ring-lavender/40">
            <p className="font-hand text-2xl text-ink">With love,</p>
            <p className="mt-1 font-display text-xl font-semibold text-soft-pink-deep">
              Manasvi&apos;s Family
            </p>
            <p className="mt-4 text-sm text-ink-soft">
              Share your wishes and memories with us whenever you visit. 💕
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
