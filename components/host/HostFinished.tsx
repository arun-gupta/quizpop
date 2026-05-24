'use client'

import { useRouter } from 'next/navigation'
import { LeaderboardEntry, GameSession } from '@/types/database'
import Leaderboard from '@/components/game/Leaderboard'
import Confetti from '@/components/game/Confetti'

interface HostFinishedProps {
  entries: LeaderboardEntry[]
  session: GameSession
}

export default function HostFinished({ entries, session }: HostFinishedProps) {
  const router = useRouter()
  const winner = entries[0] ?? null
  const totalPlayers = entries.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col font-[var(--font-nunito)]">
      <Confetti />

      {/* Header */}
      <div className="text-center pt-10 pb-4 px-8">
        <h1
          className="text-6xl font-extrabold text-white tracking-wide drop-shadow-2xl"
          style={{ animation: 'zoomIn 0.6s ease-out both' }}
        >
          🎉 GAME OVER! 🎉
        </h1>
      </div>

      {/* Winner spotlight */}
      {winner && (
        <div
          className="mx-auto max-w-lg w-full px-8 mb-6"
          style={{ animation: 'zoomIn 0.7s ease-out 0.2s both' }}
        >
          <div className="bg-gradient-to-br from-yellow-400/30 to-orange-400/20 rounded-3xl p-6 border-2 border-yellow-400/60 shadow-2xl text-center">
            <div className="text-5xl mb-2">🥇</div>
            <div
              className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl"
              style={{ backgroundColor: winner.avatar_color }}
            >
              {winner.display_name.charAt(0).toUpperCase()}
            </div>
            <p className="text-yellow-300 text-4xl font-extrabold mb-1">
              {winner.display_name}
            </p>
            <p className="text-white/70 text-xl">
              <span className="text-yellow-300 font-extrabold text-3xl">
                {winner.total_score.toLocaleString()}
              </span>{' '}
              points
            </p>
            <p className="text-yellow-400 text-2xl font-bold mt-2">WINNER!</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex justify-center gap-8 px-8 mb-4">
        <div className="bg-white/10 rounded-2xl px-6 py-3 text-center">
          <p className="text-white font-extrabold text-2xl">{totalPlayers}</p>
          <p className="text-white/50 text-sm">Players</p>
        </div>
        <div className="bg-white/10 rounded-2xl px-6 py-3 text-center">
          <p className="text-white font-extrabold text-2xl">
            {session.current_question_index}
          </p>
          <p className="text-white/50 text-sm">Questions</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="flex-1 px-8 max-w-3xl mx-auto w-full overflow-y-auto">
        <h2 className="text-white/60 text-lg font-semibold uppercase tracking-widest text-center mb-3">
          Final Standings
        </h2>
        <Leaderboard entries={entries} showTop={10} />
      </div>

      {/* Play Again */}
      <div className="px-8 py-8 flex justify-center">
        <button
          onClick={() => router.push('/host')}
          className="px-12 py-5 rounded-2xl text-white text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-violet-400 hover:from-purple-400 hover:to-violet-300 hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xl cursor-pointer"
        >
          🔄 Play Again
        </button>
      </div>

      <style jsx>{`
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
