# QuizPop 🎉

> Kahoot-style multiplayer quiz game for parties and events — no app download required.

[![Production](https://img.shields.io/badge/Production-Live-00C7B7?style=for-the-badge&logo=vercel&logoColor=white)](https://quizpop-arungupta.vercel.app)
[![Vercel](https://img.shields.io/badge/Vercel-Deployments-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/arun-gupta-5985s-projects/quizpop/deployments)
[![Supabase](https://img.shields.io/badge/Supabase-Dashboard-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/dashboard/project/kttofycsvcjmwpxamjwa)
[![Perf](https://img.shields.io/badge/Perf-Dashboard-4493F8?style=for-the-badge&logo=githubactions&logoColor=white)](https://arun-gupta.github.io/quizpop/dev/bench/)
[![Admin](https://img.shields.io/badge/Admin-Panel-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://quizpop-arungupta.vercel.app/admin)

A host picks a quiz, players join on any device via a 6-letter code or QR code, and everyone answers timed questions for points. Built to run on Vercel + Supabase free tiers with no custom WebSocket server.

---

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) · TypeScript · Tailwind CSS |
| Database | Supabase Postgres + Realtime + Auth |
| Deployment | Vercel Hobby tier |

---

## Local setup

```bash
git clone https://github.com/arun-gupta/quizpop.git
cd quizpop
npm install
cp .env.example .env.local   # fill in Supabase credentials
npm run dev
```

Run the DB migration and seed in your Supabase SQL editor:

```
supabase/migrations/20250524000000_initial_schema.sql
supabase/migrations/20250526000000_open_text_questions.sql
supabase/seed.sql
```

Create an admin user:

```bash
npm run setup-admin   # reads ADMIN_EMAIL + ADMIN_PASSWORD from .env.local
```

---

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe for client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only) |

See `.env.example` for the full list including optional perf-test variables.

---

## Key commands

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build
npm run type-check   # TypeScript check
npm test             # Vitest unit tests
npm run load-test    # load test against localhost (50 players)
npm run setup-admin  # create/update admin user from .env.local
```

---

## Docs

- [`docs/original-prompt.md`](docs/original-prompt.md) — original product specification
- [`docs/deployment.md`](docs/deployment.md) — Vercel deployment guide
- [`docs/quiz-format.md`](docs/quiz-format.md) — quiz markdown format

---

## License

Apache 2.0 — see [LICENSE](./LICENSE).
