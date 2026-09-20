# Work Hive

Endorsement-based hiring platform — candidate search, applications, endorsement requests, messaging, connections, and market insights (ratings, salaries, cost of living, relocation).

A full rebuild of the original design prototype into a real, working product: React + Vite frontend, Supabase (Postgres + Auth + Storage) backend, deployed to GitHub Pages.

## Stack

- React 19 + Vite, `react-router-dom` (HashRouter)
- Supabase: Postgres with Row Level Security, Auth (email/password), Storage (resumes, avatars)
- No separate server — the client talks to Supabase directly via the public anon key; RLS enforces access

## Local development

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL + anon key
npm run dev
```

## Database setup

Run once, in order, in the Supabase SQL Editor:

1. `supabase/schema.sql` — tables, RLS policies, storage buckets, the new-user trigger
2. `supabase/seed-1-companies.sql`
3. `supabase/seed-2-jobs.sql`
4. `supabase/seed-3-extras.sql`

Then create a demo account (email/password sign-up, e.g. via the app's own signup form) if you want a "continue as demo" shortcut — see `src/lib/supabase.js` for the fixed demo credentials the app signs in with.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on every push to `main`. Repo secrets required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
