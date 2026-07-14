import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/admin",
      });
    } catch (e) {
      // signIn throws a redirect on success — let that propagate.
      if (e instanceof AuthError) redirect("/admin/login?error=1");
      throw e;
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm rounded-3xl bg-white/80 p-8 shadow-lg ring-1 ring-lavender/40">
        <h1 className="text-center font-display text-3xl font-semibold text-ink">
          Parents&apos; Login
        </h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          Sign in to add memories to Manasvi&apos;s book.
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-soft-pink/40 px-4 py-2 text-center text-sm text-ink">
            Wrong email or password. Please try again.
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-soft">Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-lavender/60 bg-white px-4 py-2.5 text-ink outline-none focus:border-lavender-deep"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-soft">Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-lavender/60 bg-white px-4 py-2.5 text-ink outline-none focus:border-lavender-deep"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-soft-pink-deep py-2.5 font-semibold text-white shadow-md transition-transform hover:scale-[1.02]"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
