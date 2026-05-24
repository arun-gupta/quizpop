import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import type { LeaderboardEntry } from '@/types/database'

interface ResultsPageProps {
  params: Promise<{ gameId: string }>
}

// Export buttons use anchor tags with data: URIs — no client JS required.

const MEDALS = ['🥇', '🥈', '🥉']
const RANK_COLORS = [
  'from-yellow-500/30 to-amber-500/10 border-yellow-500/40',
  'from-gray-400/20 to-gray-500/10 border-gray-400/40',
  'from-amber-700/20 to-amber-800/10 border-amber-700/40',
]

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { gameId } = await params
  const supabase = createServiceClient()

  // Fetch game session
  const { data: session, error: sessionError } = await supabase
    .from('game_sessions')
    .select('id, quiz_id, game_state, join_code, started_at, completed_at, created_at')
    .eq('id', gameId)
    .single()

  if (sessionError || !session) {
    notFound()
  }

  // Fetch quiz info
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id, title, description')
    .eq('id', session.quiz_id)
    .single()

  // Fetch players
  const { data: players } = await supabase
    .from('players')
    .select('id, display_name, avatar_color, total_score, joined_at')
    .eq('game_session_id', gameId)
    .order('total_score', { ascending: false })

  // Fetch total questions count
  const { count: questionCount } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('quiz_id', session.quiz_id)

  // Fetch the latest leaderboard snapshot
  const { data: snapshot } = await supabase
    .from('leaderboard_snapshots')
    .select('snapshot_data')
    .eq('game_session_id', gameId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Build leaderboard: prefer snapshot, fall back to players table
  let leaderboard: LeaderboardEntry[] = []
  if (snapshot?.snapshot_data) {
    leaderboard = snapshot.snapshot_data as LeaderboardEntry[]
  } else if (players) {
    leaderboard = players.map((p, i) => ({
      player_id: p.id,
      display_name: p.display_name,
      avatar_color: p.avatar_color,
      total_score: p.total_score,
      rank: i + 1,
    }))
  }

  const playerCount = players?.length ?? 0
  const quizTitle = quiz?.title ?? 'Quiz'
  const totalQuestions = questionCount ?? 0

  const startedAt = session.started_at ? new Date(session.started_at) : null
  const completedAt = session.completed_at ? new Date(session.completed_at) : null
  const durationMs =
    startedAt && completedAt ? completedAt.getTime() - startedAt.getTime() : null
  const durationMin = durationMs ? Math.round(durationMs / 60000) : null

  // Build JSON export string for client-side download
  const exportJson = JSON.stringify(
    {
      game: { id: gameId, quiz: quizTitle, date: session.completed_at },
      stats: { players: playerCount, questions: totalQuestions },
      leaderboard,
    },
    null,
    2
  )

  const exportCsv = [
    'Rank,Name,Score',
    ...leaderboard.map((e) => `${e.rank},"${e.display_name.replace(/"/g, '""')}",${e.total_score}`),
  ].join('\n')

  // Winner
  const winner = leaderboard[0]

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 px-4 py-8">
      {/* Background blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in-down">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-black text-white mb-2">Final Results</h1>
          <p className="text-purple-200 font-bold text-xl">{quizTitle}</p>
        </div>

        {/* Game stats */}
        <div className="grid grid-cols-3 gap-3 mb-8 animate-slide-in-up">
          {[
            { icon: '👥', value: playerCount, label: 'Players' },
            { icon: '❓', value: totalQuestions, label: 'Questions' },
            { icon: '⏱', value: durationMin !== null ? `${durationMin}m` : '—', label: 'Duration' },
          ].map((stat) => (
            <div key={stat.label} className="card-glass p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-purple-300 text-xs font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Winner spotlight */}
        {winner && (
          <div className="card-glass p-6 mb-6 text-center border border-yellow-500/30 bg-yellow-500/10 animate-slide-in-up">
            <p className="text-yellow-400 font-bold text-sm uppercase tracking-widest mb-3">Winner</p>
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-black text-white shadow-2xl border-4 border-yellow-400/50 mb-3"
              style={{ backgroundColor: winner.avatar_color }}
            >
              {winner.display_name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-3xl font-black text-white mb-1">{winner.display_name}</h2>
            <p className="text-5xl font-black text-yellow-400">{winner.total_score.toLocaleString()}</p>
            <p className="text-yellow-300/70 font-semibold">points</p>
          </div>
        )}

        {/* Full leaderboard */}
        {leaderboard.length > 0 && (
          <div className="card-glass p-6 mb-6 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-extrabold text-white mb-4">Full Standings</h3>
            <div className="space-y-2">
              {leaderboard.map((entry, i) => {
                const medal = MEDALS[i]
                const rankStyle = RANK_COLORS[i] ?? 'from-white/5 to-white/5 border-white/10'
                return (
                  <div
                    key={entry.player_id}
                    className={`flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r border ${rankStyle}`}
                  >
                    <div className="w-10 text-center flex-shrink-0">
                      {medal ? (
                        <span className="text-2xl">{medal}</span>
                      ) : (
                        <span className="text-white/60 font-bold text-lg">#{entry.rank}</span>
                      )}
                    </div>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-base font-black text-white shadow border-2 border-white/20 flex-shrink-0"
                      style={{ backgroundColor: entry.avatar_color }}
                    >
                      {entry.display_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-1 font-bold text-white truncate">{entry.display_name}</span>
                    <span className="font-extrabold text-white tabular-nums text-lg">
                      {entry.total_score.toLocaleString()}
                    </span>
                    <span className="text-purple-300/60 text-xs font-semibold">pts</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Export buttons — inline download via data URIs */}
        <div className="card-glass p-6 mb-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
            <span>📥</span> Export Results
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`data:application/json;charset=utf-8,${encodeURIComponent(exportJson)}`}
              download={`quizpop-results-${gameId.slice(0, 8)}.json`}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white
                bg-gradient-to-r from-blue-600 to-indigo-600
                hover:from-blue-500 hover:to-indigo-500
                transform hover:scale-105 active:scale-95
                transition-all duration-200 shadow-lg"
            >
              <span>📄</span> Download JSON
            </a>
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(exportCsv)}`}
              download={`quizpop-results-${gameId.slice(0, 8)}.csv`}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white
                bg-gradient-to-r from-emerald-600 to-teal-600
                hover:from-emerald-500 hover:to-teal-500
                transform hover:scale-105 active:scale-95
                transition-all duration-200 shadow-lg"
            >
              <span>📊</span> Download CSV
            </a>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
          <Link href="/host" className="btn-primary">
            🎮 Host Another Game
          </Link>
          <Link href="/join" className="btn-outline">
            🚀 Join a Game
          </Link>
        </div>

        {/* Game metadata */}
        <div className="mt-8 text-center text-purple-400/50 text-xs font-semibold space-y-1">
          <p>Game ID: {gameId}</p>
          {completedAt && (
            <p>Completed: {completedAt.toLocaleDateString()} {completedAt.toLocaleTimeString()}</p>
          )}
        </div>
      </div>
    </main>
  )
}
