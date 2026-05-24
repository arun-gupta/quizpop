'use client'

import { useRouter } from 'next/navigation'
import { Player, LeaderboardEntry } from '@/types/database'
import Leaderboard from '@/components/game/Leaderboard'
import Confetti from '@/components/game/Confetti'

interface PlayerFinishedProps {
  player: Player
  entries: LeaderboardEntry[]
  totalQuestions: number
}

const RANK_MESSAGES: Record<number, string> = {
  1: "You're the champion! 🏆",
  2: 'So close! Amazing job! 🥈',
  3: 'Top 3 — incredible! 🥉',
}

function getRankMessage(rank: number, name: string): string {
  return RANK_MESSAGES[rank] ?? `Great game, ${name}! Keep it up! 🎉`
}

export default function PlayerFinished({
  player,
  entries,
  totalQuestions,
}: PlayerFinishedProps) {
  const router = useRouter()
  const myEntry = entries.find((e) => e.player_id === player.id)
  const myRank = myEntry?.rank ?? entries.length
  const isWinner = myRank === 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col font-[var(--font-nunito)]">
      {isWinner && <Confetti />}

      {/* Header */}
      <div
        className="text-center pt-10 pb-4 px-4"
        style={{ animation: 'zoomIn 0.5s ease-out both' }}
      >
        <div className="text-5xl mb-2">
          {isWinner ? '🎉' : '🎮'}
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-1">
          Game Over!
        </h1>
        <p className="text-white/60 text-base">
          {totalQuestions} questions answered
        </p>
      </div>

      {/* Player result card */}
      <div
        className="mx-4 mb-4"
        style={{ animation: 'zoomIn 0.5s ease-out 0.15s both' }}
      >
        <div
          className={[
            'rounded-3xl p-6 text-center border shadow-2xl',
            isWinner
              ? 'bg-yellow-400/20 border-yellow-400/50'
              : 'bg-white/10 border-white/20',
          ].join(' ')}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg"
            style={{ backgroundColor: player.avatar_color }}
          >
            {player.display_name.charAt(0).toUpperCase()}
          </div>
          <p
            className={[
              'text-xl font-extrabold mb-1',
              isWinner ? 'text-yellow-300' : 'text-white',
            ].join(' ')}
          >
            {player.display_name}
          </p>
          <p className="text-white/50 text-sm mb-3">
            {getRankMessage(myRank, player.display_name)}
          </p>

          <div className="flex justify-center gap-6">
            <div>
              <p className="text-2xl font-extrabold text-white">
                #{myRank}
              </p>
              <p className="text-white/50 text-xs">Rank</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-2xl font-extrabold text-white">
                {player.total_score.toLocaleString()}
              </p>
              <p className="text-white/50 text-xs">Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div
        className="flex-1 px-4 overflow-y-auto"
        style={{ animation: 'fadeIn 0.5s ease-out 0.3s both' }}
      >
        <p className="text-white/40 text-xs uppercase tracking-widest text-center mb-3">
          Final Standings
        </p>
        <Leaderboard
          entries={entries}
          showTop={10}
          highlightPlayerId={player.id}
        />
      </div>

      {/* Play Again */}
      <div className="px-4 py-6">
        <button
          onClick={() => router.push('/join')}
          className="w-full py-4 rounded-2xl text-white text-xl font-extrabold bg-gradient-to-r from-purple-500 to-violet-400 hover:from-purple-400 hover:to-violet-300 active:scale-95 transition-all duration-200 shadow-xl cursor-pointer"
        >
          🔄 Play Again
        </button>
      </div>

      <style jsx>{`
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
