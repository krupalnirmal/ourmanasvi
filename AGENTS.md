<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# OurManasvi

A premium digital memory book for Manasvi's first year (birth → first birthday).
Emotional, month-by-month storytelling. See `doc/` for the full product spec.

## Hard rule: everything must stay FREE
Hosting, database, and media/uploads must all use free tiers only. Never add a
paid service or a feature that requires leaving the free tier.

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
- `npm run db:push` / `db:studio` once a real `DATABASE_URL` is set

## Theme
Colors: white, cream, soft-pink, baby-blue, lavender (defined in `app/globals.css`).
Fonts: Poppins (body), Playfair Display (headings), Caveat (handwriting accents).
