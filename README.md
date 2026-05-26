# QuizPop 🎉

> The fast, fun, multiplayer quiz game for parties and events — no app download required!

[![Production](https://img.shields.io/badge/Production-Live-00C7B7?style=for-the-badge&logo=vercel&logoColor=white)](https://quizpop-arungupta.vercel.app)
[![Vercel](https://img.shields.io/badge/Vercel-Deployments-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/arun-gupta-5985s-projects/quizpop/deployments)
[![Supabase](https://img.shields.io/badge/Supabase-Dashboard-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/dashboard/project/kttofycsvcjmwpxamjwa)
[![Perf](https://img.shields.io/badge/Perf-Dashboard-4493F8?style=for-the-badge&logo=githubactions&logoColor=white)](https://arun-gupta.github.io/quizpop/dev/bench/)
[![Admin](https://img.shields.io/badge/Admin-Panel-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://quizpop-arungupta.vercel.app/admin)

QuizPop is a Kahoot-style party quiz game built with Next.js 15 and Supabase Realtime. A host creates a game room, players join with a 6-letter code on any device, and everyone battles for quiz glory in real time.

<!-- Screenshot placeholder -->
> 📸 _Screenshot: Add a screenshot of your game in action here_

---

## Features

- **One-click game creation** — pick a quiz, create a room, share the code
- **Up to 100 simultaneous players** — scales with Supabase Realtime
- **No app download needed** — players join via any mobile browser
- **Live scoring** — speed bonuses reward fast answers
- **Dynamic leaderboard** — updates after every question
- **QR code join** — instant mobile join from the host screen
- **Admin panel** — create and manage quizzes, view analytics
- **Realtime sync** — all screens stay in sync via Supabase Realtime subscriptions
- **Export results** — download final standings as JSON or CSV
- **Keyboard shortcuts** — host can advance questions with Space/Enter

---

## Tech Stack

| Component | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Database | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime (postgres_changes) |
| Auth | Supabase Auth (admin only) |
| Deployment | Vercel |
| QR Codes | qrcode.react |
| Confetti | canvas-confetti |
| Testing | Vitest |

---

## Quick Start

### Prerequisites

- **Node.js 18+** (recommend 20 LTS)
- **npm** or **yarn**
- **Supabase account** (free tier works great) — [supabase.com](https://supabase.com)
- **Vercel account** (for deployment) — [vercel.com](https://vercel.com)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/quizpop.git
cd quizpop
npm install
```

---

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Wait for the database to provision (about 1 minute).
3. In your project dashboard, go to **SQL Editor**.
4. Click **New query**, paste the contents of `supabase/migrations/001_initial_schema.sql`, and click **Run**.
5. Create another new query, paste the contents of `supabase/seed.sql`, and click **Run**.  
   _(This adds sample quizzes so you can start playing immediately.)_
6. Get your credentials from **Settings > API**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
7. Enable Realtime for the required tables:
   - Go to **Settings > Replication** (or **Database > Replication**)
   - Add these tables to the replication set: `game_sessions`, `players`, `player_responses`

---

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...
```

> ⚠️ **Never commit `.env.local` to version control.** The `SUPABASE_SERVICE_ROLE_KEY` has full database access.

---

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 5. Create an admin user

The admin panel (`/admin`) is protected. To create your first admin user:

1. Go to your Supabase project → **Authentication > Users > Add user**.
2. Enter an email and password, then click **Create User**.
3. Copy the user's UUID from the Users table.
4. In the **SQL Editor**, run:

```sql
INSERT INTO admin_users (id, email, role)
VALUES ('<paste-user-uuid-here>', '<your@email.com>', 'admin');
```

5. Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in.

---

## Gameplay

### Hosting a Game

1. Go to [quizpop.com](https://quizpop.com) (or your local URL) and click **Host a Game**.
2. Pick a quiz from the available list.
3. Click **Create Game** — you'll be taken to the host control panel.
4. Share the displayed **join code** (or QR code) with your players.
5. Once everyone has joined, click **Start Game** to begin.
6. After each question, click **Show Results** → **Leaderboard** → **Next Question** to advance at your own pace.
7. After the final question, the game automatically finishes and shows the final leaderboard.

### Joining a Game

1. On your phone or any browser, go to the QuizPop URL.
2. Click **Join a Game** and enter the 6-letter code from the host screen.
3. Enter your display name and hit **Let's Go!** — you're in!

---

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/quizpop.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and click **Import** next to your repository.
2. Vercel auto-detects Next.js — leave the build settings as-is.
3. Under **Environment Variables**, add all three variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**. Your app will be live in about 60 seconds.

### 3. Supabase Configuration

After deployment, you need to allow your Vercel domain in Supabase:

1. In Supabase, go to **Settings > API > CORS**.
2. Add your Vercel domain (e.g. `https://quizpop.vercel.app`).
3. Also add it under **Settings > Authentication > URL Configuration > Site URL**.
4. Confirm Realtime is enabled for `game_sessions`, `players`, and `player_responses` (see step 7 in Supabase setup above).

---

## Scoring System

Points are awarded for correct answers only. The formula combines a base score with a speed bonus:

```
base_points   = question.points        (configured per question, e.g. 1000)
speed_bonus   = base_points × 0.5 × (time_remaining / timer_seconds)
total_awarded = base_points + floor(speed_bonus)
```

- A correct answer submitted immediately earns up to **1.5× the base points**.
- A correct answer at the last second earns exactly the **base points**.
- Incorrect or timed-out answers earn **0 points**.

The leaderboard is snapshotted after each question, enabling per-question rank tracking.

---

## Database Schema

| Table | Purpose |
|---|---|
| `quizzes` | Quiz metadata (title, description) |
| `questions` | Individual questions linked to a quiz |
| `answer_options` | Answer choices for each question (includes `is_correct`) |
| `game_sessions` | Active game rooms (join code, state machine, current question) |
| `players` | Players in a game session (name, score, avatar color) |
| `player_responses` | Individual answer submissions per player per question |
| `leaderboard_snapshots` | Post-question leaderboard snapshots for replay/display |
| `admin_users` | Admin panel user records |
| `analytics_events` | Optional event tracking for game analytics |
| `archived_game_sessions` | Long-term storage for completed games |

---

## Project Structure

```
quizpop/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout (metadata, fonts)
│   ├── globals.css             # Global styles and Tailwind
│   ├── not-found.tsx           # Custom 404 page
│   ├── join/                   # Player join flow
│   │   └── page.tsx
│   ├── host/                   # Host flow
│   │   ├── page.tsx            # Quiz selection
│   │   └── [gameId]/           # Host game control panel
│   │       └── page.tsx
│   ├── play/                   # Player game screen
│   │   └── [gameId]/
│   │       └── page.tsx
│   ├── results/                # Final results page
│   │   └── [gameId]/
│   │       └── page.tsx
│   ├── admin/                  # Admin panel (protected)
│   └── api/                    # API routes
│       ├── game/
│       │   ├── create/         # POST: create game session
│       │   ├── join/           # POST: player joins game
│       │   └── [gameId]/
│       │       ├── state/      # GET: full game state
│       │       ├── start/      # POST: host starts game
│       │       ├── next/       # POST: host advances state
│       │       └── answer/     # POST: player submits answer
│       └── admin/              # Admin API routes (authenticated)
├── components/
│   ├── game/                   # Shared game UI components
│   │   ├── AnswerButton.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── QRCode.tsx
│   │   └── Confetti.tsx
│   ├── host/                   # Host screen components
│   │   ├── HostLobby.tsx
│   │   ├── HostQuestion.tsx
│   │   ├── HostResults.tsx
│   │   ├── HostLeaderboard.tsx
│   │   └── HostFinished.tsx
│   ├── player/                 # Player screen components
│   └── ui/                     # Generic UI primitives
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server + service-role clients
│   ├── scoring.ts              # Scoring formula
│   └── utils.ts                # Utility helpers
├── types/
│   └── database.ts             # TypeScript interfaces for all tables
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql                # Sample quiz data
├── __tests__/                  # Vitest test files
├── middleware.ts               # Admin route protection
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Yes |

---

## Troubleshooting

### Players can't join the game
- Double-check the join code is being entered correctly (it's case-insensitive, 6 characters).
- Confirm the game session exists and is in `lobby` state — once started, new players cannot join.
- Check browser console for API errors from `/api/game/join`.

### Realtime updates not working
- Verify Realtime is enabled for `game_sessions`, `players`, and `player_responses` in Supabase → Settings → Replication.
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly (they're used client-side for Realtime).
- Open browser DevTools → Network → WS to confirm a WebSocket connection is established to Supabase.
- Ensure your Supabase plan supports the required number of concurrent connections.

### Admin login fails
- Verify the user exists in Supabase → Authentication → Users.
- Confirm the user's UUID is in the `admin_users` table.
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set in your environment.

### Game state not advancing
- Ensure the host is providing the correct `hostToken` (stored in `localStorage` under key `hostToken_${gameId}`).
- Check the `/api/game/[gameId]/next` route logs for errors.

### Build errors on Vercel
- Run `npm run build` locally first to catch TypeScript or ESLint errors.
- Run `npm run type-check` to verify types.
- Ensure all three environment variables are set in the Vercel project settings.

---

## License

Apache 2.0 — see [LICENSE](./LICENSE) for details.
