# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**QuizPop** — Kahoot-style multiplayer party quiz game. Licensed under Apache 2.0.

Stack: Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Realtime + Auth) · Vercel Hobby tier.

## Commands

```bash
npm run dev          # start dev server (Turbopack)
npm run build        # production build
npm run type-check   # TypeScript check (no emit)
npm test             # Vitest unit tests
npm run lint         # ESLint
```

## Architecture

### Realtime flow
- All game state lives in Supabase Postgres (`game_sessions` table)
- Clients subscribe to Supabase Realtime `postgres_changes` on `game_sessions`, `players`, and `player_responses`
- Host calls API routes → API updates DB → Realtime broadcasts changes to all subscribers
- No custom WebSocket server; no polling

### Game state machine
`lobby` → `question_active` → `question_results` → `leaderboard` → (next question or) `finished`

Transitions are driven by host API calls to `app/api/game/[gameId]/next/route.ts` with `action: 'reveal' | 'leaderboard' | 'next' | 'finish'`.

### Auth model
- **Players**: no auth required; player ID stored in `localStorage` as `playerData_${gameId}`
- **Host**: no auth; host token stored in `localStorage` as `hostToken_${gameId}`, verified by API routes
- **Admin**: Supabase Auth (email/password); protected by `middleware.ts`; must have row in `admin_users` table

### Answer security
`answer_options.is_correct` is never selected by client-side queries. During `question_active`, the API returns options without `is_correct`. The correct answer is only revealed via `game_sessions.correct_answer_id` when state transitions to `question_results`.

### Scoring
`awarded_points = base_points + floor(base_points × 0.5 × max(0, 1 − responseTimeMs / timerMs))`
Max score = 1.5× base points (instant answer). See `lib/scoring.ts`.

### Supabase clients
- `lib/supabase/client.ts` — browser (anon key, used in `'use client'` components)
- `lib/supabase/server.ts` — `createClient()` for server components/routes (cookie-aware), `createServiceClient()` for admin DB ops (service role, server-only)

## Key directories

```
app/api/game/          # Public gameplay API routes
app/api/admin/         # Admin-only API routes (auth required)
app/host/[gameId]/     # Host control dashboard (client component)
app/play/[gameId]/     # Player game screen (client component)
components/host/       # Host-side game screens
components/player/     # Player-side game screens
components/game/       # Shared: CountdownTimer, AnswerButton, Leaderboard, QRCode, Confetti
supabase/migrations/   # Schema + RLS policies + triggers
supabase/seed.sql      # Sample birthday quiz (20 questions)
```

## Database notes
- `update_player_score` trigger auto-increments `players.total_score` on each `player_responses` insert
- `UNIQUE(player_id, question_id)` on `player_responses` prevents double submission
- `UNIQUE(game_session_id, display_name)` on `players` prevents duplicate names
- All tables have RLS enabled; gameplay uses anon key + RLS; admin ops use service role

## Environment variables
```
NEXT_PUBLIC_SUPABASE_URL        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Public anon key (safe for client)
SUPABASE_SERVICE_ROLE_KEY       # Secret service key (server-only, never expose)
```
