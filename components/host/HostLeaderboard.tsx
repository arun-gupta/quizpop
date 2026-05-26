'use client'

import { useEffect, useState } from 'react'
import { LeaderboardEntry } from '@/types/database'
import Leaderboard from '@/components/game/Leaderboard'

interface HostLeaderboardProps {
  entries: LeaderboardEntry[]
  autoAdvanceSecs?: number
}

export default function HostLeaderboard({
  entries,
  autoAdvanceSecs = 8,
}: HostLeaderboardProps) {
  const [countdown, setCountdown] = useState(autoAdvanceSecs)

  useEffect(() => {
    setCountdown(autoAdvanceSecs)
    const interval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [autoAdvanceSecs])
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col font-[var(--font-nunito)]">
      {/* Header */}
      <div className="text-center pt-10 pb-6 px-8">
        <h1
          className="text-6xl font-extrabold text-white tracking-widest uppercase drop-shadow-2xl"
          style={{ animation: 'fadeInDown 0.5s ease-out both' }}
        >
          🏆 Leaderboard
        </h1>
        <p className="text-white/50 text-xl mt-2">Top Players</p>
      </div>

      {/* Leaderboard list */}
      <div className="flex-1 px-8 max-w-3xl mx-auto w-full overflow-y-auto">
        {entries.length === 0 ? (
          <div className="text-center text-white/50 text-xl py-12">
            No scores yet...
          </div>
        ) : (
          <Leaderboard entries={entries} showTop={10} />
        )}
      </div>

      {/* Auto-advance countdown */}
      <div className="px-8 py-8 flex flex-col items-center gap-2">
        <p className="text-white/40 text-sm font-semibold">
          Next question in {countdown}s…
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
