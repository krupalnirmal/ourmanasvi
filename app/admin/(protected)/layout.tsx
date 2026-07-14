import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-lavender/40 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-display text-xl font-semibold text-ink">
            OurManasvi <span className="text-soft-pink-deep">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-ink-soft hover:text-ink"
              target="_blank"
            >
              View site ↗
            </Link>
            <form action={logout}>
              <button className="rounded-full bg-lavender/50 px-4 py-1.5 text-sm font-medium text-ink hover:bg-lavender">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
