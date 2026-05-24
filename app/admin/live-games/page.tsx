'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface LiveGame {
  id: string
  quiz_id: string
  join_code: string
  game_state: string
  current_question_index: number
  started_at: string | null
  created_at: string
  quiz_title: string
  player_count: number
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {state.replace(/_/g, ' ')}
    </span>
  )
}

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const mins = Math.floor(seconds / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ${mins % 60}m ago`
}

export default function LiveGamesPage() {
  const [games, setGames] = useState<LiveGame[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [forcingEnd, setForcingEnd] = useState<string | null>(null)
  const supabase = createClient()

  const fetchGames = useCallback(async () => {
    const res = await fetch('/api/admin/games?status=active&limit=50')
    if (res.ok) {
      const data = await res.json()
      setGames(data.games ?? [])
      setLastUpdated(new Date())
    }
    setLoading(false)
  }, [])

  async function handleForceEnd(gameId: string) {
    if (!confirm('Force end this game session?')) return
    setForcingEnd(gameId)
    try {
      const res = await fetch(`/api/admin/games/${gameId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'force_end' }),
      })
      if (res.ok) {
        await fetchGames()
      } else {
        const err = await res.json()
        alert(err.error ?? 'Failed to end game')
      }
    } finally {
      setForcingEnd(null)
    }
  }

  useEffect(() => {
    fetchGames()

    // Realtime subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = (supabase as any)
      .channel('admin-live-games')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_sessions',
        },
        () => {
          fetchGames()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchGames, supabase])

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Games</h1>
          <p className="mt-1 text-gray-400 text-sm">
            Active game sessions — updates in realtime
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={() => { setLoading(true); fetchGames() }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Active indicator */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>
        <span className="text-sm text-gray-400">
          {loading ? 'Loading…' : `${games.length} active game${games.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Games list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse space-y-3">
              <div className="h-4 bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
              <div className="h-3 bg-gray-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-16 text-center">
          <svg className="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <p className="text-gray-400">No active games right now.</p>
          <p className="text-gray-600 text-sm mt-1">Games will appear here as soon as players join.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4 hover:border-gray-700 transition-colors"
            >
              {/* Title + status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-white leading-tight">{game.quiz_title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Started {timeAgo(game.created_at)}</p>
                </div>
                <StateLabel state={game.game_state} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-800 rounded-lg px-2 py-2">
                  <p className="text-lg font-bold text-white">{game.player_count}</p>
                  <p className="text-xs text-gray-500">Players</p>
                </div>
                <div className="bg-gray-800 rounded-lg px-2 py-2">
                  <p className="text-lg font-bold text-white font-mono tracking-widest">{game.join_code}</p>
                  <p className="text-xs text-gray-500">Code</p>
                </div>
                <div className="bg-gray-800 rounded-lg px-2 py-2">
                  <p className="text-lg font-bold text-white">Q{game.current_question_index + 1}</p>
                  <p className="text-xs text-gray-500">Question</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <a
                  href={`/admin/live-games`}
                  className="flex-1 text-center text-xs px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-colors"
                >
                  View Details
                </a>
                <button
                  onClick={() => handleForceEnd(game.id)}
                  disabled={forcingEnd === game.id}
                  className="flex-1 text-xs px-3 py-2 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg border border-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forcingEnd === game.id ? 'Ending…' : 'Force End'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
