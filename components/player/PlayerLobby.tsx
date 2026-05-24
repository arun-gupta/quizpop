'use client'

import { Player } from '@/types/database'

interface PlayerLobbyProps {
  player: Player
  playerCount: number
}

const ENCOURAGEMENTS = [
  'Warm up your brain! 🧠',
  'Ready to crush it? 💪',
  'Think fast, answer faster! ⚡',
  'Show them what you\'ve got! 🔥',
  'Time to shine! ✨',
  'Let\'s go! 🚀',
]

export default function PlayerLobby({ player, playerCount }: PlayerLobbyProps) {
  const encouragement =
    ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center p-6 font-[var(--font-nunito)]">
      {/* You're in card */}
      <div
        className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center w-full max-w-sm shadow-2xl border border-white/20 mb-6"
        style={{ animation: 'popIn 0.5s ease-out both' }}
      >
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl font-extrabold text-white mb-2">
          You&apos;re in!
        </h1>

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3 my-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold text-white shadow-xl"
            style={{ backgroundColor: player.avatar_color }}
          >
            {player.display_name.charAt(0).toUpperCase()}
          </div>
          <p
            className="text-2xl font-extrabold"
            style={{ color: player.avatar_color }}
          >
            {player.display_name}
          </p>
        </div>

        <p className="text-white/60 text-base">{encouragement}</p>
      </div>

      {/* Player count */}
      <div
        className="bg-white/10 rounded-2xl px-6 py-3 mb-8"
        style={{ animation: 'popIn 0.5s ease-out 0.1s both' }}
      >
        <p className="text-white text-lg font-semibold text-center">
          <span className="text-purple-300 font-extrabold text-2xl">
            {playerCount}
          </span>{' '}
          {playerCount === 1 ? 'player' : 'players'} joined
        </p>
      </div>

      {/* Waiting animation */}
      <div
        className="text-center"
        style={{ animation: 'popIn 0.5s ease-out 0.2s both' }}
      >
        <p className="text-white/60 text-base font-semibold flex items-center gap-1">
          Waiting for host to start
          <span className="inline-flex gap-0.5 ml-1">
            <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </p>
      </div>

      <style jsx>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
