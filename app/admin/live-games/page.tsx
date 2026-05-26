'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface LiveGame {
  id: string
  quiz_id: string
  join_code: string
  game_state: string
  current_question_index: number
  state_changed_at: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  quiz_title: string
  player_count: number
}

const STALE_THRESHOLD_MS = 2 * 60 * 60 * 1000 // 2 hours

function lastActivity(g: LiveGame): number {
  // Use the most recent known activity timestamp as the stale baseline
  const ts = g.state_changed_at ?? g.started_at ?? g.created_at
  return new Date(ts).getTime()
}

function categorize(games: LiveGame[]) {
  const now = Date.now()
  const active: LiveGame[] = []
  const stale: LiveGame[] = []
  const past: LiveGame[] = []
  for (const g of games) {
    if (g.game_state === 'finished') {
      past.push(g)
    } else if (now - lastActivity(g) >= STALE_THRESHOLD_MS) {
      stale.push(g)
    } else {
      active.push(g)
    }
  }
  return { active, stale, past }
}

function StateLabel({ state }: { state: string }) {
  const map: Record<string, string> = {
    lobby: 'bg-blue-900 text-blue-300',
    question_active: 'bg-green-900 text-green-300',
    question_results: 'bg-yellow-900 text-yellow-300',
    leaderboard: 'bg-purple-900 text-purple-300',
    section_intro: 'bg-indigo-900 text-indigo-300',
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

function GameCard({ game, onForceEnd, forcing }: {
  game: LiveGame
  onForceEnd: (id: string) => void
  forcing: boolean
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-white leading-tight">{game.quiz_title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Started {timeAgo(game.created_at)}
            {game.completed_at && ` · ended ${timeAgo(game.completed_at)}`}
          </p>
        </div>
        <StateLabel state={game.game_state} />
      </div>

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

      {game.game_state !== 'finished' && (
        <button
          onClick={() => onForceEnd(game.id)}
          disabled={forcing}
          className="w-full text-xs px-3 py-2 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg border border-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {forcing ? 'Ending…' : 'Force End'}
        </button>
      )}
    </div>
  )
}

function Section({ title, dot, games, onForceEnd, forcing, emptyText, defaultOpen = true, onForceEndAll }: {
  title: string
  dot: string
  games: LiveGame[]
  onForceEnd: (id: string) => void
  forcing: string | null
  emptyText: string
  defaultOpen?: boolean
  onForceEndAll?: () => void
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 mb-3 group w-full text-left"
      >
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
        <span className="font-semibold text-white">{title}</span>
        <span className="text-sm text-gray-500">({games.length})</span>
        <svg
          className={`w-4 h-4 text-gray-500 ml-1 transition-transform ${open ? '' : '-rotate-90'}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {onForceEndAll && games.length > 0 && (
          <button
            onClick={e => { e.stopPropagation(); onForceEndAll() }}
            className="ml-auto text-xs px-3 py-1 bg-red-950 hover:bg-red-900 text-red-400 rounded-lg border border-red-900 transition-colors"
          >
            Force End All
          </button>
        )}
      </button>

      {open && (
        games.length === 0 ? (
          <p className="text-sm text-gray-600 pl-4">{emptyText}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {games.map(g => (
              <GameCard key={g.id} game={g} onForceEnd={onForceEnd} forcing={forcing === g.id} />
            ))}
          </div>
        )
      )}
    </div>
  )
}

export default function LiveGamesPage() {
  const [games, setGames] = useState<LiveGame[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [forcing, setForcing] = useState<string | null>(null)
  const supabase = createClient()

  const fetchGames = useCallback(async () => {
    const res = await fetch('/api/admin/games?status=all&limit=100')
    if (res.ok) {
      const data = await res.json()
      setGames(data.games ?? [])
      setLastUpdated(new Date())
    }
    setLoading(false)
  }, [])

  async function forceEnd(gameId: string) {
    setForcing(gameId)
    try {
      const res = await fetch(`/api/admin/games/${gameId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'force_end' }),
      })
      if (res.ok) {
        setGames(prev => prev.map(g => g.id === gameId ? { ...g, game_state: 'finished', completed_at: new Date().toISOString() } : g))
      } else {
        const err = await res.json()
        alert(err.error ?? 'Failed to end game')
      }
    } finally {
      setForcing(null)
    }
  }

  async function forceEndAll(games: LiveGame[]) {
    if (!confirm(`Force end ${games.length} session${games.length !== 1 ? 's' : ''}?`)) return
    for (const g of games) await forceEnd(g.id)
  }

  useEffect(() => {
    fetchGames()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = (supabase as any)
      .channel('admin-live-games')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions' }, () => fetchGames())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchGames, supabase])

  const { active, stale, past } = categorize(games)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Games</h1>
          <p className="mt-1 text-gray-400 text-sm">All game sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">Updated {lastUpdated.toLocaleTimeString()}</span>
          <button
            onClick={() => { setLoading(true); fetchGames() }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse space-y-3">
              <div className="h-4 bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <Section
            title="Active"
            dot="bg-green-500 animate-pulse"
            games={active}
            onForceEnd={forceEnd}
            forcing={forcing}
            emptyText="No active games right now."
            defaultOpen
          />
          <Section
            title="Stale"
            dot="bg-yellow-500"
            games={stale}
            onForceEnd={forceEnd}
            forcing={forcing}
            emptyText="No stale sessions."
            defaultOpen={stale.length > 0}
            onForceEndAll={() => forceEndAll(stale)}
          />
          <Section
            title="Past"
            dot="bg-gray-500"
            games={past}
            onForceEnd={forceEnd}
            forcing={forcing}
            emptyText="No completed games yet."
            defaultOpen={false}
          />
        </div>
      )}
    </div>
  )
}
