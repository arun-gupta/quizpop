'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { GameSession, Player } from '@/types/database'
import QRCode from '@/components/game/QRCode'

interface HostLobbyProps {
  session: GameSession
  players: Player[]
  onStart: () => void
  isStarting: boolean
}

export default function HostLobby({
  session,
  players,
  onStart,
  isStarting,
}: HostLobbyProps) {
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const joinUrl = origin
    ? `${origin}/join?code=${session.join_code}`
    : `/join?code=${session.join_code}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center p-8 font-[var(--font-nunito)]">
      {/* Header */}
      <div className="text-center mb-8 flex flex-col items-center gap-3">
        <Image src="/quizpop-logo.png" alt="QuizPop" width={72} height={72} className="rounded-2xl shadow-xl" />
        <div>
          <h1 className="text-5xl font-extrabold text-white mb-1 tracking-tight drop-shadow-lg">QuizPop!</h1>
          <p className="text-white/70 text-xl">Join the game on your phone</p>
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Join info */}
        <div className="flex flex-col items-center gap-6">
          {/* URL + Code */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-center w-full border border-white/20 shadow-2xl">
            <p className="text-white/60 text-lg font-semibold mb-1">Go to</p>
            <p className="text-white text-2xl font-bold mb-4">
              {origin ? origin.replace(/^https?:\/\//, '') : 'quizpop.app'}
              <span className="text-purple-300">/join</span>
            </p>
            <div className="w-full h-px bg-white/20 mb-4" />
            <p className="text-white/60 text-lg font-semibold mb-2">Enter code</p>
            <div className="flex items-center justify-center gap-2">
              {session.join_code.split('').map((char, i) => (
                <span
                  key={i}
                  className="w-14 h-16 bg-white rounded-xl flex items-center justify-center text-3xl font-extrabold text-purple-900 shadow-md"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-white/60 text-sm font-semibold uppercase tracking-widest">
              Or scan QR code
            </p>
            {origin && <QRCode url={joinUrl} size={180} />}
          </div>
        </div>

        {/* Right: Players + Start */}
        <div className="flex flex-col gap-6">
          {/* Player count */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-2xl font-bold">
                Players Joined
              </h2>
              <span className="bg-purple-500 text-white text-2xl font-extrabold px-4 py-1 rounded-full min-w-[56px] text-center">
                {players.length}
              </span>
            </div>

            {players.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2 animate-bounce">👾</div>
                <p className="text-white/50 text-lg">
                  Waiting for players to join...
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {players.map((player, i) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5"
                    style={{
                      animation: 'popIn 0.3s ease-out both',
                      animationDelay: `${i * 50}ms`,
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: player.avatar_color }}
                    />
                    <span className="text-white text-sm font-semibold">
                      {player.display_name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            disabled={players.length === 0 || isStarting}
            className={[
              'w-full py-6 rounded-3xl text-white text-3xl font-extrabold',
              'transition-all duration-200 shadow-2xl',
              players.length > 0 && !isStarting
                ? 'bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-gray-600 opacity-50 cursor-not-allowed',
            ].join(' ')}
          >
            {isStarting ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Starting...
              </span>
            ) : (
              '🚀 Start Game!'
            )}
          </button>

          {players.length === 0 && (
            <p className="text-center text-white/40 text-sm">
              Need at least 1 player to start
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.6); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
