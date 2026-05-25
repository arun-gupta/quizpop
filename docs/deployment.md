# Deployment Guide

This guide covers everything needed to deploy QuizPop from scratch — local development through production on Vercel.

## Prerequisites

- Node.js 18 or later
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (free/Hobby tier works)
- A GitHub account (repo must be on GitHub for Vercel import)

---

## Step 1 — Clone and install

```bash
git clone https://github.com/arun-gupta/quizpop.git
cd quizpop
npm install
```

---

## Step 2 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Choose your organization, give it a name (e.g. `QuizPop`), set a database password, pick a region close to your users
4. Wait for the project to finish provisioning (~1 minute)

---

## Step 3 — Run the database migration

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Select all the text in the editor, delete it, then paste the entire contents of:
   ```
   supabase/migrations/20250524000000_initial_schema.sql
   ```
3. Click **Run** (or `Cmd+Enter` / `Ctrl+Enter`)
4. You should see: `Success. No rows returned.`

This creates all 10 tables, indexes, RLS policies, and triggers.

---

## Step 4 — Load the seed data

1. In the SQL Editor, select all, delete, then paste the entire contents of:
   ```
   supabase/seed.sql
   ```
2. Click **Run**

This loads a sample **"🎉 Birthday Party Trivia"** quiz with 20 questions, ready to play immediately.

To verify: click **Table Editor** in the left sidebar — you should see:
- `quizzes` — 1 row
- `questions` — 20 rows
- `answer_options` — 80 rows

---

## Step 5 — Enable Realtime

QuizPop uses Supabase Realtime for live game synchronization. Enable it by running this in the SQL Editor:

```sql
ALTER PUBLICATION supabase_realtime
ADD TABLE game_sessions, players, player_responses, leaderboard_snapshots;
```

---

## Step 6 — Get your API credentials

1. In Supabase, go to **Project Settings → API Keys**
2. Copy these three values:

| Value | Used for |
|-------|----------|
| Project URL (`https://<ref>.supabase.co`) | `NEXT_PUBLIC_SUPABASE_URL` |
| **Publishable key** (default) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Secret key** (default) | `SUPABASE_SERVICE_ROLE_KEY` |

> The Project URL is `https://<project-id>.supabase.co` where the project ID is found in **Project Settings → General → Project ID**.

---

## Step 7 — Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in the three values from the previous step:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-publishable-key>
SUPABASE_SERVICE_ROLE_KEY=<your-secret-key>
```

---

## Step 8 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the QuizPop landing page.

**Quick smoke test:**
1. Click **Host a Game** — the Birthday Party Trivia quiz should appear
2. Click **Create Game** — you should land on a lobby screen with a join code
3. Open a new tab, go to `/join`, enter the code — you should join the lobby
4. Back on the host tab, click **Start Game** — both tabs should update in real time

---

## Step 9 — Create an admin user (optional)

The admin dashboard (`/admin`) requires a Supabase Auth account with a matching row in the `admin_users` table.

1. In Supabase, go to **Authentication → Users → Add user**
2. Enter an email and password, click **Create user**
3. Copy the new user's UUID (shown in the users list)
4. Run this in the SQL Editor:
   ```sql
   INSERT INTO admin_users (id, email)
   VALUES ('<paste-uuid-here>', '<your-email>');
   ```
5. Visit `/admin/login` and sign in with those credentials

---

## Step 10 — Deploy to Vercel

### 10a. Push to GitHub

Make sure your latest code is pushed:

```bash
git push
```

### 10b. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Select **Import Git Repository** and choose your `quizpop` repo
3. Vercel auto-detects Next.js — no build config changes needed
4. **Before clicking Deploy**, expand **Environment Variables** and add all three:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ```
5. Click **Deploy**

Vercel will build and deploy. The first deploy takes ~1–2 minutes.

### 10c. Verify the deployment

Once deployed, open your Vercel URL and repeat the smoke test from Step 8 — host a game, join from a phone, start playing.

---

## Adding your own quizzes

See [quiz-format.md](./quiz-format.md) for the full Markdown format. The short version:

```markdown
# My Quiz Title
Optional description.

## Question text?
- [ ] Wrong answer
- [x] Correct answer
- [ ] Wrong answer
- [ ] Wrong answer
```

Import via:
- **Admin UI**: `/admin/quizzes` → **Import .md**
- **CLI**: `npm run import-quiz -- my-quiz.md`

---

## Troubleshooting

**"Could not load quizzes" on the host page**
- Verify your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
- Check that the migration ran successfully (Table Editor should show all 10 tables)

**Players can't join / "Game not found"**
- Make sure a game session was created first via the host page
- Double-check the 6-character join code (no ambiguous characters — uses `A-Z` and `2-9` only)

**Real-time updates not working (screens don't sync)**
- Confirm you ran the `ALTER PUBLICATION` command in Step 5
- Check browser console for Supabase Realtime connection errors

**Admin login fails**
- Verify the user exists in Supabase **Authentication → Users**
- Verify there is a matching row in the `admin_users` table with the same UUID

**Build fails on Vercel**
- Ensure all three environment variables are set in the Vercel project settings
- Run `npm run build` locally first to catch errors before pushing
