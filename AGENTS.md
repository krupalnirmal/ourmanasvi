<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# OurManasvi

A premium digital memory book for a baby's first year (birth → first birthday).
Emotional, month-by-month storytelling. See `doc/` for the full product spec.

## Hard rule: everything must stay FREE
Hosting, database, and media/uploads must all use free tiers only. Never add a
paid service or a feature that requires leaving the free tier.

## Hard rule: never hardcode whose book this is
The same codebase is deployed once per baby. Names, dates and titles come from
`lib/site-config.ts` (backed by `NEXT_PUBLIC_BABY_NAME`, `NEXT_PUBLIC_SITE_NAME`,
`NEXT_PUBLIC_SITE_TAGLINE`, `NEXT_PUBLIC_FAMILY_NAME`) — never write a baby's name
into a component, page title, or the `lib/journey-data.ts` fallback copy.
Use `pageTitle("Gallery")` for metadata and `BABY_POSSESSIVE` for "…'s" phrasing.

Where a real value exists in the DB (`baby.name`), prefer it and fall back to
config: `baby?.name ?? BABY_NAME`. Each site also needs its own `AUTH_SECRET`,
`ADMIN_PASSWORD` and `CLOUDINARY_FOLDER` — never reuse them across sites.

## Stack (all free)
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4
- Framer Motion — animations
- Prisma **v6** (pinned; v7 needs driver adapters) → TiDB Cloud Starter (MySQL-compatible)
- Cloudinary Free — images & video
- NextAuth v5 (single admin = parents, credentials from env)
- Deploy target: Vercel Hobby

## Local dev
- **Node 22 required** (system default `node` is v10). Run:
  `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.1`
- `npm run dev` (uses `.env`; copy from `.env.example`)
- `npm run db:push` / `db:studio` / `db:seed` (DB is live on TiDB)

## Auth (NextAuth v5 / Auth.js)
- Uses **`AUTH_SECRET`** (not NEXTAUTH_SECRET) and **`trustHost: true`** in `auth.ts`
  — both required, or login 500s (UntrustedHost) and route protection fails silently.
- Single admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Login: `/admin/login`.
  `/admin/*` protected by `app/admin/(protected)/layout.tsx`.

## Uploads
- Browser uploads DIRECTLY to Cloudinary via unsigned preset
  `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (avoids Vercel's serverless body limit).
  Server actions in `app/admin/actions.ts` persist the returned URL + public_id.
- Data reads: `lib/data.ts` (DB with static fallback). Public pages are force-dynamic.

## Theme
Fonts: Poppins (body), Playfair Display (headings), Caveat (handwriting accents).

Colour tokens (`soft-pink*`, `baby-blue*`, `lavender*`, `cream*`, `ink*`) are the
default pink palette in `app/globals.css`. `SITE_THEME` in `.env` picks one of the
palettes in `lib/theme.ts`, which the root layout injects as `:root` overrides —
Tailwind v4 compiles `bg-soft-pink-deep` to `var(--color-soft-pink-deep)`, so
redefining the variables re-skins everything.

**Treat the token names as roles, not colours:** `soft-pink*` is the primary
accent, `baby-blue*` the secondary, `lavender*` borders/rings. In the `blue`
palette `soft-pink-deep` holds a blue. Never add a hardcoded hex to a component —
add or edit a palette instead, and keep `PALETTES.pink` in sync with the defaults
in `globals.css`.
