/**
 * Load test: simulates N concurrent players joining and answering a game.
 *
 * Usage:
 *   npm run load-test                                   # 50 players, localhost
 *   npm run load-test -- --players=100                  # 100 players
 *   npm run load-test -- --url=https://...              # against production
 *   npm run load-test -- --players=50 --out=results.json  # save JSON output
 */

import { writeFileSync } from 'fs'

const args = Object.fromEntries(
  process.argv.slice(2).map(a => a.replace(/^--/, '').split('=') as [string, string])
)

const BASE_URL = args.url ?? 'http://localhost:3000'
const PLAYER_COUNT = parseInt(args.players ?? '50', 10)
const OUT_FILE = args.out ?? null             // e.g. --out=results.json
const BENCHMARK_OUT = args['benchmark-out'] ?? null  // github-action-benchmark format

// ─── helpers ────────────────────────────────────────────────────────────────

function ms(n: number) { return `${n.toFixed(0)}ms` }

function stats(times: number[]) {
  if (times.length === 0) return { min: 0, max: 0, avg: 0, p50: 0, p95: 0 }
  const sorted = [...times].sort((a, b) => a - b)
  const sum = sorted.reduce((a, b) => a + b, 0)
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: sum / sorted.length,
    p50: sorted[Math.floor(sorted.length * 0.5)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
  }
}

async function post(path: string, body: unknown): Promise<{ ok: boolean; status: number; data: unknown; ms: number }> {
  const t = Date.now()
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return { ok: res.ok, status: res.status, data, ms: Date.now() - t }
}

async function get(path: string): Promise<{ ok: boolean; data: unknown; ms: number }> {
  const t = Date.now()
  const res = await fetch(`${BASE_URL}${path}`)
  const data = await res.json()
  return { ok: res.ok, data, ms: Date.now() - t }
}

// ─── step 1: get a quiz id ───────────────────────────────────────────────────

async function getFirstQuizId(): Promise<string> {
  const { ok, data } = await get('/api/admin/quizzes')
  if (!ok) throw new Error('Could not list quizzes — is the server running?')
  const quizzes = (data as { quizzes: { id: string; title: string }[] }).quizzes
  if (!quizzes?.length) throw new Error('No quizzes found — run seed SQL first')
  console.log(`  Using quiz: "${quizzes[0].title}" (${quizzes[0].id})`)
  return quizzes[0].id
}

// ─── step 2: create a game ──────────────────────────────────────────────────

async function createGame(quizId: string): Promise<{ gameId: string; hostToken: string; joinCode: string }> {
  const { ok, data } = await post('/api/game/create', { quiz_id: quizId })
  if (!ok) throw new Error(`Failed to create game: ${JSON.stringify(data)}`)
  const { gameId, hostToken, joinCode } = data as { gameId: string; hostToken: string; joinCode: string }
  console.log(`  Game created: ${gameId}  join code: ${joinCode}`)
  return { gameId, hostToken, joinCode }
}

// ─── step 3: join N players concurrently ────────────────────────────────────

interface PlayerResult {
  index: number
  playerId?: string
  ok: boolean
  ms: number
  error?: string
}

async function joinPlayers(joinCode: string, count: number): Promise<PlayerResult[]> {
  const joins = Array.from({ length: count }, (_, i) =>
    post('/api/game/join', {
      joinCode,
      displayName: `Player${i + 1}`,
    }).then(r => {
      const d = r.data as { player?: { id: string }; error?: string }
      return {
        index: i + 1,
        playerId: d.player?.id,
        ok: r.ok,
        ms: r.ms,
        error: r.ok ? undefined : (d.error ?? String(r.status)),
      } as PlayerResult
    })
  )
  return Promise.all(joins)
}

// ─── step 4: start the game ─────────────────────────────────────────────────

async function startGame(gameId: string, hostToken: string) {
  const { ok, data } = await post(`/api/game/${gameId}/start`, { hostToken })
  if (!ok) throw new Error(`Failed to start game: ${JSON.stringify(data)}`)
}

// ─── step 5: get first answer option ────────────────────────────────────────

async function getFirstAnswerId(gameId: string): Promise<string> {
  const { ok, data } = await get(`/api/game/${gameId}/state`)
  if (!ok) throw new Error(`Failed to fetch game state: ${JSON.stringify(data)}`)
  const q = (data as { question?: { answer_options: { id: string }[] } }).question
  const answerId = q?.answer_options?.[0]?.id
  if (!answerId) throw new Error(`No answer options in state response — game_state=${(data as {session?: {game_state?: string}}).session?.game_state}, question=${JSON.stringify(q)}`)
  return answerId
}

// ─── step 6: all players answer simultaneously ───────────────────────────────

interface AnswerResult {
  playerId: string
  ok: boolean
  ms: number
  status: number
  error?: string
}

async function submitAnswers(
  gameId: string,
  players: PlayerResult[],
  answerId: string
): Promise<AnswerResult[]> {
  const validPlayers = players.filter(p => p.ok && p.playerId)
  const answers = validPlayers.map(p =>
    post(`/api/game/${gameId}/answer`, {
      playerId: p.playerId,
      answerId,
      responseTimeMs: Math.floor(Math.random() * 8000) + 500, // 0.5–8.5s random
    }).then(r => {
      const d = r.data as { error?: string }
      return {
        playerId: p.playerId!,
        ok: r.ok,
        ms: r.ms,
        status: r.status,
        error: r.ok ? undefined : d.error,
      } as AnswerResult
    })
  )
  return Promise.all(answers)
}

// ─── reporting ───────────────────────────────────────────────────────────────

function report(label: string, results: { ok: boolean; ms: number; error?: string }[]) {
  const passed = results.filter(r => r.ok)
  const failed = results.filter(r => !r.ok)
  const s = stats(passed.map(r => r.ms))
  console.log(`\n  ${label}`)
  console.log(`    Total: ${results.length}  ✓ ${passed.length}  ✗ ${failed.length}`)
  if (passed.length > 0) {
    console.log(`    Latency — min: ${ms(s.min)}  avg: ${ms(s.avg)}  p50: ${ms(s.p50)}  p95: ${ms(s.p95)}  max: ${ms(s.max)}`)
  }
  if (failed.length > 0) {
    const sample = failed.slice(0, 3).map(r => r.error ?? 'unknown').join(', ')
    console.log(`    Errors (sample): ${sample}`)
  }
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nQuizPop Load Test`)
  console.log(`  Target:  ${BASE_URL}`)
  console.log(`  Players: ${PLAYER_COUNT}`)
  console.log('')

  // 1. Quiz
  process.stdout.write('→ Fetching quiz... ')
  const quizId = await getFirstQuizId()

  // 2. Create game
  process.stdout.write('→ Creating game... ')
  const { gameId, hostToken, joinCode } = await createGame(quizId)

  // 3. Join players concurrently
  process.stdout.write(`→ Joining ${PLAYER_COUNT} players concurrently... `)
  const t1 = Date.now()
  const joinResults = await joinPlayers(joinCode, PLAYER_COUNT)
  const joinTime = Date.now() - t1
  console.log(`done in ${ms(joinTime)}`)
  report('JOIN /api/game/join', joinResults)

  const joined = joinResults.filter(r => r.ok).length
  if (joined === 0) {
    console.error('\n✗ No players joined — aborting.')
    process.exit(1)
  }

  // 4. Start game
  process.stdout.write('\n→ Starting game... ')
  await startGame(gameId, hostToken)
  console.log('done')

  // 5. Get answer option
  process.stdout.write('→ Fetching question state... ')
  // Brief pause to let DB settle after start
  await new Promise(r => setTimeout(r, 300))
  const answerId = await getFirstAnswerId(gameId)
  console.log(`answer option id: ${answerId.slice(0, 8)}...`)

  // 6. Submit answers concurrently
  process.stdout.write(`\n→ Submitting ${joined} answers simultaneously... `)
  const t2 = Date.now()
  const answerResults = await submitAnswers(gameId, joinResults, answerId)
  const answerTime = Date.now() - t2
  console.log(`done in ${ms(answerTime)}`)
  report('ANSWER /api/game/[gameId]/answer', answerResults)

  // 7. Verify auto-reveal triggered
  process.stdout.write('\n→ Checking game state after all answers... ')
  await new Promise(r => setTimeout(r, 500))
  const { data: stateData } = await get(`/api/game/${gameId}/state`)
  const gameState = (stateData as { session?: { game_state: string } }).session?.game_state
  const revealed = gameState === 'question_results' || gameState === 'leaderboard' || gameState === 'finished'
  console.log(`game_state = ${gameState} ${revealed ? '✓ auto-revealed' : '✗ still question_active'}`)

  // Clean up — mark session finished so it doesn't appear as a stale active game
  await post(`/api/game/${gameId}/next`, { action: 'finish', hostToken })
  console.log('  Game session finished (cleanup)')

  const joinStats = stats(joinResults.filter(r => r.ok).map(r => r.ms))
  const answerStats = stats(answerResults.filter(r => r.ok).map(r => r.ms))
  const pass = joinResults.every(r => r.ok) && answerResults.filter(r => r.ok).length >= joined * 0.95

  const result = {
    timestamp: new Date().toISOString(),
    url: BASE_URL,
    players: PLAYER_COUNT,
    join: { total: joinResults.length, passed: joinResults.filter(r => r.ok).length, failed: joinResults.filter(r => !r.ok).length, ...joinStats },
    answer: { total: answerResults.length, passed: answerResults.filter(r => r.ok).length, failed: answerResults.filter(r => !r.ok).length, ...answerStats },
    autoReveal: revealed,
    pass,
  }

  if (OUT_FILE) {
    writeFileSync(OUT_FILE, JSON.stringify(result, null, 2))
    console.log(`\n  Results saved to ${OUT_FILE}`)
  }

  // github-action-benchmark format (customSmallerIsBetter)
  if (BENCHMARK_OUT) {
    const n = PLAYER_COUNT
    const bench = [
      { name: `join_p50 (${n} players)`,   unit: 'ms', value: Math.round(joinStats.p50) },
      { name: `join_p95 (${n} players)`,   unit: 'ms', value: Math.round(joinStats.p95) },
      { name: `answer_p50 (${n} players)`, unit: 'ms', value: Math.round(answerStats.p50) },
      { name: `answer_p95 (${n} players)`, unit: 'ms', value: Math.round(answerStats.p95) },
    ]
    writeFileSync(BENCHMARK_OUT, JSON.stringify(bench, null, 2))
    console.log(`  Benchmark saved to ${BENCHMARK_OUT}`)
  }

  console.log('\n─────────────────────────────')
  console.log(pass ? '✓ PASS — all key metrics within threshold' : '✗ FAIL — check errors above')
  console.log('')
  if (!pass) process.exit(1)
}

main().catch(err => {
  console.error('\n✗ Fatal:', err.message)
  process.exit(1)
})
