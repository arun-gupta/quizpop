'use client'

import { LeaderboardEntry } from '@/types/database'
import Leaderboard from '@/components/game/Leaderboard'

interface PlayerLeaderboardProps {
  entries: LeaderboardEntry[]
  currentPlayerId: string
}

export default function PlayerLeaderboard({
  entries,
  currentPlayerId,
}: PlayerLeaderboardProps) {
  const currentEntry = entries.find((e) => e.player_id === currentPlayerId)
  const isInTopTen = entries.slice(0, 10).some((e) => e.player_id === currentPlayerId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col font-[var(--font-nunito)]">
      {/* Header */}
      <div className="text-center pt-8 pb-4 px-4">
        <h1
          className="text-4xl font-extrabold text-white mb-1"
          style={{ animation: 'fadeInDown 0.4s ease-out both' }}
        >
          🏆 Leaderboard
        </h1>
        <p className="text-white/50 text-sm font-semibold">
          Get ready for the next question!
        </p>
      </div>

      {/* Top 10 */}
      <div className="flex-1 px-4 overflow-y-auto">
        <Leaderboard
          entries={entries}
          showTop={10}
          highlightPlayerId={currentPlayerId}
        />

        {/* Current player's rank if outside top 10 */}
        {!isInTopTen && currentEntry && (
          <div className="mt-4">
            <div className="h-px bg-white/20 mb-4" />
            <p className="text-white/40 text-xs text-center mb-2 uppercase tracking-widest">
              Your position
            </p>
            <Leaderboard
              entries={[currentEntry]}
              highlightPlayerId={currentPlayerId}
            />
          </div>
        )}
      </div>

      {/* Next question notice */}
      <div className="px-4 pb-8 pt-4 text-center">
        <div className="bg-white/10 rounded-2xl px-6 py-4 inline-block">
          <p className="text-white font-bold text-base flex items-center gap-2 justify-center">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Next question coming up!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
