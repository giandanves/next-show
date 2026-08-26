# Deploy: Vercel + Neon (demo)

This app is Next.js + Blitz + Prisma. It needs a **Node server** (Vercel) and **Postgres** (Neon). SQLite does not work on Vercel.

## 1. Create a Neon database

1. Sign up at [https://neon.tech](https://neon.tech) (free tier).
2. Create a project (pick a region close to your Vercel region, e.g. `iad1` / US East).
3. Open **Connection details** and copy:
   - **Pooled** connection string → `DATABASE_URL`
   - **Direct** connection string → `DIRECT_URL`
4. Prefer adding query params:
   - Pooled: `?sslmode=require&pgbouncer=true`
   - Direct: `?sslmode=require`

## 2. Point local env at Neon (simplest)

Copy [`.env.example`](../.env.example) to `.env` (or `.env.local`) and fill:

```bash
cp .env.example .env
# edit DATABASE_URL, DIRECT_URL, SESSION_SECRET_KEY, APP_ORIGIN
```

Generate a session secret:

```bash
openssl rand -hex 32
```

Apply schema + seed:

```bash
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Local login after seed: `admin@next-show.local` / `admin` (see `db/seed.ts`).

> Local SQLite (`file:./db/dev.db`) is no longer supported by this schema. Use Neon (or any Postgres) for local too.

## 3. Push code to GitHub

Commit the Postgres migration + schema changes, then push the branch you want to deploy.

## Required on Vercel (Production)

Without these, public pages may work but `/`, `/login`, and `/admin` break:

| Name | Notes |
|------|--------|
| `DATABASE_URL` | Neon **pooled** URL |
| `DIRECT_URL` | Neon **direct** URL |
| `SESSION_SECRET_KEY` | **Required** — min 32 chars (`openssl rand -hex 32`). Blitz crashes auth pages without it. |
| `APP_ORIGIN` | `https://your-app.vercel.app` |

After changing env vars: **Deployments → ⋯ → Redeploy**.

## 4. Create the Vercel project

1. Go to [https://vercel.com](https://vercel.com) → **Add New… → Project**.
2. Import the GitHub repo.
3. Framework: **Next.js** (auto-detected).
4. **Build Command** (override if needed):

   ```text
   prisma generate && prisma migrate deploy && blitz build
   ```

   (`package.json` `build` script already does this.)

5. **Install Command**: `npm install` (default is fine; `postinstall` runs `prisma generate`).
6. Before deploying, add Environment Variables (Production + Preview):

| Name | Value |
|------|--------|
| `DATABASE_URL` | Neon **pooled** URL (`…-pooler…` + `pgbouncer=true`) |
| `DIRECT_URL` | Neon **direct** URL (no pooler) |
| `SESSION_SECRET_KEY` | output of `openssl rand -hex 32` |
| `APP_ORIGIN` | leave empty on first deploy, then set to `https://YOUR-PROJECT.vercel.app` and redeploy |

7. Click **Deploy**.

## 5. Seed production once

After the first successful deploy (migrations already ran in build):

```bash
# From your machine, with PRODUCTION DATABASE_URL + DIRECT_URL in the env:
DATABASE_URL="…" DIRECT_URL="…" npm run db:seed
```

Or use Neon SQL editor only if you prefer not to seed from CLI (seed script is easier).

Do **not** put the seed in every Vercel build unless you accept it rewriting demo data on each deploy (current seed uses upserts, so it is mostly safe but still resets the demo show).

## 6. Set `APP_ORIGIN` and verify

1. Copy the Vercel URL (e.g. `https://next-show-xxx.vercel.app`).
2. Set `APP_ORIGIN` to that URL in Vercel env vars → Redeploy.
3. Open `/giandanves` (or your artist slug) and `/login`.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Prisma migrate fails on build | Check `DIRECT_URL` is the **non-pooler** Neon URL |
| Runtime DB errors / prepared statement | Use pooled URL for `DATABASE_URL` with `pgbouncer=true` |
| Auth / JWT errors in production | `SESSION_SECRET_KEY` missing or shorter than 32 chars |
| Empty database | Run `npm run db:seed` against production URLs once |
| Cold starts / Neon wake | Free Neon may sleep; first request after idle can be slow |

## Security note for demos

Change the seeded admin password before sharing a public demo URL, or create a separate demo user and remove the default credentials from `db/seed.ts`.
