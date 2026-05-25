'use client'

import { useEffect, useState } from 'react'
import { LeaderboardEntry } from '@/types/database'
import Leaderboard from '@/components/game/Leaderboard'

interface HostLeaderboardProps {
  entries: LeaderboardEntry[]
  onNext: () => void
  isLastQuestion: boolean
  isAdvancing: boolean
  autoAdvanceSecs?: number
}

export default function HostLeaderboard({
  entries,
  onNext,
  isLastQuestion,
  isAdvancing,
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

      {/* Next button + countdown */}
      <div className="px-8 py-8 flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          disabled={isAdvancing}
          className={[
            'px-14 py-5 rounded-2xl text-white text-2xl font-extrabold',
            'transition-all duration-200 shadow-2xl',
            !isAdvancing
              ? isLastQuestion
                ? 'bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-400 hover:to-red-300 hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 hover:scale-105 active:scale-95 cursor-pointer'
              : 'bg-gray-600 opacity-60 cursor-not-allowed',
          ].join(' ')}
        >
          {isAdvancing ? (
            <span className="flex items-center gap-3">
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading...
            </span>
          ) : isLastQuestion ? (
            '🏁 Finish Game'
          ) : (
            '▶ Next Question'
          )}
        </button>
        <p className="text-white/40 text-sm font-semibold">
          Auto-advancing in {countdown}s…
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
