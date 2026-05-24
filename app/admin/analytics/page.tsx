import MetricCard from '@/components/admin/MetricCard'

interface AnalyticsData {
  totalGames: number
  activeGames: number
  totalPlayers: number
  avgPlayersPerGame: number
  mostPlayedQuizzes: Array<{ quiz_id: string; title: string; play_count: number }>
  recentGames: Array<{
    id: string
    quiz_title: string
    player_count: number
    game_state: string
    created_at: string
  }>
  analyticsEvents: Array<{ event_type: string; count: number }>
}

async function getAnalytics(): Promise<AnalyticsData | null> {
  try {
    // Server-side fetch — include cookies for auth propagation
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/api/admin/analytics`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function StateLabel({ state }: { state: string }) {
  const map: Record<string, string> = {
    lobby: 'bg-blue-900 text-blue-300',
    question_active: 'bg-green-900 text-green-300',
    question_results: 'bg-yellow-900 text-yellow-300',
    leaderboard: 'bg-purple-900 text-purple-300',
    finished: 'bg-gray-800 text-gray-400',
  }
  const cls = map[state] ?? 'bg-gray-800 text-gray-400'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {state.replace(/_/g, ' ')}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function AnalyticsPage() {
  const data = await getAnalytics()

  if (!data) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Analytics</h1>
        <div className="bg-red-950 border border-red-800 rounded-xl px-6 py-8 text-center text-red-300">
          Failed to load analytics data.
        </div>
      </div>
    )
  }

  const maxPlayCount = Math.max(...(data.mostPlayedQuizzes.map((q) => q.play_count)), 1)
  const maxEventCount = Math.max(...(data.analyticsEvents.map((e) => e.count)), 1)

  const metrics = [
    {
      title: 'Total Games',
      value: data.totalGames,
      subtitle: 'All time',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Active Games',
      value: data.activeGames,
      subtitle: 'Right now',
      trend: data.activeGames > 0 ? 'up' : 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Total Players',
      value: data.totalPlayers,
      subtitle: 'All time joins',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Avg Players / Game',
      value: data.avgPlayersPerGame,
      subtitle: 'Per session',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ] as const

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-gray-400 text-sm">Overview of game and player activity</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            subtitle={m.subtitle}
            icon={m.icon}
            trend={'trend' in m ? m.trend : undefined}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most played quizzes */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Most Played Quizzes</h2>
          {data.mostPlayedQuizzes.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.mostPlayedQuizzes.map((quiz) => (
                <div key={quiz.quiz_id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300 truncate max-w-[70%]">{quiz.title}</span>
                    <span className="text-sm font-medium text-white ml-2">{quiz.play_count}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all"
                      style={{ width: `${(quiz.play_count / maxPlayCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analytics events (last 7 days) */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Events — Last 7 Days</h2>
          {data.analyticsEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">No events recorded.</p>
          ) : (
            <div className="space-y-2">
              {data.analyticsEvents.map((ev) => (
                <div key={ev.event_type} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300 font-mono">{ev.event_type}</span>
                      <span className="text-sm font-medium text-white">{ev.count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(ev.count / maxEventCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent games */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Games</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {data.recentGames.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-500">No games yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-3 text-gray-400 font-medium">Quiz</th>
                    <th className="text-left px-6 py-3 text-gray-400 font-medium">Players</th>
                    <th className="text-left px-6 py-3 text-gray-400 font-medium">Status</th>
                    <th className="text-left px-6 py-3 text-gray-400 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {data.recentGames.map((game) => (
                    <tr key={game.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-white font-medium">{game.quiz_title}</td>
                      <td className="px-6 py-4 text-gray-300">{game.player_count}</td>
                      <td className="px-6 py-4"><StateLabel state={game.game_state} /></td>
                      <td className="px-6 py-4 text-gray-400">{formatDate(game.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
