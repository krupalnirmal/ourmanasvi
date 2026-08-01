# New site checklist

Standing up this memory book for a new baby. Budget ~1–2 hours end to end.

**The rule that keeps this free and legitimate:** every account is created in the
**client's own email**, not yours. Their site is a personal family keepsake, so a
free Vercel Hobby account is the right fit *for them*. Hosting many paying
clients under **your** account is not — that is commercial use and can get the
account closed, taking every client's site down with it.

---

## 0. Collect from the client first

Don't start until you have all of this — going back mid-setup wastes time.

- [ ] Baby's name, spelled exactly as it should appear on the site
- [ ] Date of birth (`YYYY-MM-DD`)
- [ ] First birthday date (`YYYY-MM-DD`)
- [ ] Site name, or default to `Our<BabyName>`
- [ ] Colour palette they want — `pink`, `blue`, `mint`, `peach` or `lavender`
      (show them the demo site in each before they pick)
- [ ] The email they want to own the accounts with — **and access to it**, since
      every signup needs a confirmation click
- [ ] Do they want a paid custom domain, or is `<name>.vercel.app` fine?
- [ ] Admin password they want (or generate one and hand it over)

---

## 1. Create the three accounts — in the client's email

Sit with them, or screen-share. Roughly 30–45 minutes.

### TiDB Cloud — database
- [ ] Sign up at <https://tidbcloud.com>, create a **Starter** cluster (free)
- [ ] Create a database — name it after the site, e.g. `ouraarav`
- [ ] **Connect → General / Prisma**, copy the connection string
- [ ] Keep `?sslaccept=strict` on the end — TiDB requires TLS

### Cloudinary — photos and videos
- [ ] Sign up at <https://cloudinary.com>
- [ ] Note the **Cloud name**, **API Key**, **API Secret** from the dashboard
- [ ] Settings → Upload → Upload presets → **Add upload preset**
- [ ] Set **Signing Mode: Unsigned**, name it e.g. `ouraarav_unsigned`
- [ ] Unsigned uploads blocked? Enable them under Settings → Security

> Unsigned is what lets the browser upload straight to Cloudinary, which is how
> we stay under Vercel's serverless request-body limit. Don't switch it to signed.

### Vercel — hosting
- [ ] Sign up at <https://vercel.com> with the same client email
- [ ] Free **Hobby** plan

---

## 2. Set up locally

```bash
# Fresh copy of the code, named for this client
git clone <your-repo-url> ouraarav
cd ouraarav
npm install

cp .env.example .env
```

Fill in `.env`:

- [ ] `DATABASE_URL` — from TiDB
- [ ] `CLOUDINARY_*` (4 vars) — from Cloudinary, preset name must match exactly
- [ ] `CLOUDINARY_FOLDER` — **unique per client**, e.g. `ouraarav`
- [ ] `NEXT_PUBLIC_BABY_NAME`, `NEXT_PUBLIC_SITE_NAME`,
      `NEXT_PUBLIC_SITE_TAGLINE`, `NEXT_PUBLIC_FAMILY_NAME`
- [ ] `SITE_THEME` — the palette they picked
- [ ] `BABY_BIRTH_DATE`, `BABY_FIRST_BIRTHDAY`
- [ ] `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- [ ] `AUTH_SECRET` — **generate a fresh one, never reuse across clients:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Then:

```bash
npm run db:push    # create the tables
npm run db:seed    # months 0–12 + the baby row
npm run dev        # check http://localhost:3000
```

> ⚠️ **`db:seed` wipes memories and milestones** before rewriting them from the
> static template. Safe on a brand-new database — never run it on a site that
> already has the family's real content in it.

Check before deploying:
- [ ] Baby's name shows in the header and footer — not "Baby"
- [ ] `/admin/login` accepts the admin email + password
- [ ] Upload one photo in admin — proves the unsigned Cloudinary preset works

---

## 3. Deploy

Deploying straight from your machine keeps the source code with you — the client
never needs a GitHub account, and you keep what you built.

```bash
npm i -g vercel
vercel login        # log in as the CLIENT (their email)
vercel link         # create a new project
vercel --prod
```

Now add the environment variables in the Vercel dashboard
(**Settings → Environment Variables**) — every var from `.env` except the
`BABY_*` dates, which are only used by the local seeder.

> 🚨 **Tick "Production" on every variable.** Vercel defaults to Preview only.
> A variable that is Preview-only silently does nothing on the live site — the
> page falls back to "Baby" and "OurBaby" instead of the real name. This is the
> single easiest mistake to make here.

- [ ] Every variable reads **"Production and Preview"** underneath, not just "Preview"
- [ ] Settings → Node.js Version → **22.x**
- [ ] **Redeploy** after adding the variables — untick *Use existing Build Cache*

> `NEXT_PUBLIC_*` values are baked into the build. Changing them in Vercel does
> nothing until a fresh build runs.

---

## 4. Verify on the live site

Not "it loaded" — actually check these:

- [ ] Homepage header and footer show the baby's name, no "Baby" anywhere
- [ ] Browser tab reads `<SiteName> — A Year of Firsts`
- [ ] `/admin/login` works with the real password
- [ ] Upload a photo through admin, confirm it appears on the public page
- [ ] Delete that test photo, confirm it disappears
- [ ] Open the site on a phone — most family members will only ever see it there

---

## 5. Hand over

- [ ] Give them a written list of all account logins — these are **their**
      accounts, and they should be able to carry on without you
- [ ] Show them `/admin`: adding photos, videos, memories, milestones

Tell them plainly, **in writing**:

> **Keep your original photos and videos on your own phone, laptop or Google
> Drive.** This website displays your memories beautifully — it is not a backup.
> The free plans used here do not keep backups, so anything deleted here is gone
> for good.

- [ ] Also warn them: a database left completely unused for many months may be
      paused or removed by the free plan. Ask them to open the site occasionally.
      Check TiDB's current inactivity policy — these terms change.
- [ ] Agree upfront what happens later: who pays for the domain renewal, and what
      you charge for changes after handover

---

## Per-client values that must never be shared between sites

| Variable | Why |
|---|---|
| `AUTH_SECRET` | Anyone holding it can forge an admin session — no password needed |
| `ADMIN_PASSWORD` | Obvious |
| `DATABASE_URL` | One client editing another's memories |
| `CLOUDINARY_FOLDER` | Keeps each family's media in its own folder |
