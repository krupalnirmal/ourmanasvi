import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Single-admin auth (the parents). Credentials are checked against env vars,
// so there is no user table and nothing paid involved — fully free.
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          email &&
          password &&
          email === adminEmail &&
          password === adminPassword
        ) {
          return { id: "admin", name: "Parents", email };
        }
        return null;
      },
    }),
  ],
});
