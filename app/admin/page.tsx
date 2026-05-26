import { createServiceClient } from '@/lib/supabase/server'
import MetricCard from '@/components/admin/MetricCard'
import Link from 'next/link'

interface RecentGame {
  id: string
  quiz_title: string
  player_count: number
  game_state: string
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
  const label = state.replace(/_/g, ' ')
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {label}
    </span>
  )
}

export default async function AdminDashboard() {
  const service = createServiceClient()

  // Fetch all stats in parallel
  const [
    { count: totalGames },
    { count: activeGames },
    { count: totalPlayers },
    { data: recentRows },
  ] = await Promise.all([
    service.from('game_sessions').select('*', { count: 'exact', head: true }),
    service.from('game_sessions').select('*', { count: 'exact', head: true }).neq('game_state', 'finished'),
    service.from('players').select('*', { count: 'exact', head: true }),
    service
      .from('game_sessions')
      .select(`
        id,
        game_state,
        created_at,
        quizzes (title),
        players (count)
      `)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const avgPlayers =
    totalGames && totalGames > 0
      ? (Math.round(((totalPlayers ?? 0) / totalGames) * 10) / 10).toFixed(1)
      : '0'

  const recentGames: RecentGame[] = (recentRows ?? []).map((gs: {
    id: string
    game_state: string
    created_at: string
    quizzes: unknown
    players: { count: number }[]
  }) => {
    const quizzesRaw = gs.quizzes
    const quizTitle = (Array.isArray(quizzesRaw) ? quizzesRaw[0]?.title : (quizzesRaw as { title: string } | null)?.title) ?? 'Unknown'
    return {
      id: gs.id,
      quiz_title: quizTitle,
      player_count: gs.players?.[0]?.count ?? 0,
      game_state: gs.game_state,
      created_at: gs.created_at,
    }
  })

  const metrics = [
    {
      title: 'Total Games Played',
      value: totalGames ?? 0,
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
      title: 'Active Live Games',
      value: activeGames ?? 0,
      subtitle: 'Currently running',
      trend: (activeGames ?? 0) > 0 ? 'up' : 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: 'Total Players',
      value: totalPlayers ?? 0,
      subtitle: 'Unique player joins',
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
      value: avgPlayers,
      subtitle: 'Per game session',
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
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-gray-400 text-sm">Overview of QuizPop activity</p>
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

      {/* Quick external links */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: 'Production App',
              href: 'https://quizpop-arungupta.vercel.app/admin',
              desc: 'Live admin panel',
              icon: '🚀',
            },
            {
              label: 'Vercel Deployments',
              href: 'https://vercel.com/arun-gupta-5985s-projects/quizpop/deployments',
              desc: 'Deploy history & logs',
              icon: '▲',
            },
            {
              label: 'Supabase Dashboard',
              href: 'https://supabase.com/dashboard/project/kttofycsvcjmwpxamjwa',
              desc: 'Database & auth',
              icon: '🗄️',
            },
            {
              label: 'Perf Dashboard',
              href: 'https://arun-gupta.github.io/quizpop/dev/bench/',
              desc: 'CI load-test trends',
              icon: '📈',
            },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gray-900 border border-gray-800 hover:border-violet-600 rounded-xl px-4 py-3 transition-colors group"
            >
              <span className="text-2xl">{link.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">{link.label}</p>
                <p className="text-xs text-gray-500">{link.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Games table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Games</h2>
          <Link
            href="/admin/live-games"
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all active →
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {recentGames.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No games have been created yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-3 text-gray-400 font-medium">Quiz</th>
                    <th className="text-left px-6 py-3 text-gray-400 font-medium">Players</th>
                    <th className="text-left px-6 py-3 text-gray-400 font-medium">Status</th>
                    <th className="text-left px-6 py-3 text-gray-400 font-medium">Date</th>
                    <th className="text-right px-6 py-3 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentGames.map((game) => (
                    <tr key={game.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{game.quiz_title}</td>
                      <td className="px-6 py-4 text-gray-300">{game.player_count}</td>
                      <td className="px-6 py-4">
                        <StateLabel state={game.game_state} />
                      </td>
                      <td className="px-6 py-4 text-gray-400">{formatDate(game.created_at)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/live-games`}
                            className="text-xs text-violet-400 hover:text-violet-300 transition-colors px-2 py-1 rounded border border-gray-700 hover:border-violet-600"
                          >
                            View
                          </Link>
                        </div>
                      </td>
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
