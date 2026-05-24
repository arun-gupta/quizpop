'use client'

interface PlayerAnsweredProps {
  isCorrect?: boolean | null
}

export default function PlayerAnswered({ isCorrect }: PlayerAnsweredProps) {
  const isWaiting = isCorrect === null || isCorrect === undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center p-6 font-[var(--font-nunito)]">
      <div
        className={[
          'rounded-3xl p-10 text-center w-full max-w-xs shadow-2xl border',
          isWaiting
            ? 'bg-white/10 border-white/20'
            : isCorrect
            ? 'bg-green-600/30 border-green-400/50'
            : 'bg-red-600/30 border-red-400/50',
        ].join(' ')}
        style={{ animation: 'popIn 0.4s ease-out both' }}
      >
        {isWaiting ? (
          <>
            {/* Spinner */}
            <div className="flex justify-center mb-6">
              <svg
                className="animate-spin h-16 w-16 text-purple-300"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            </div>
            <p className="text-white text-2xl font-extrabold mb-2">
              Hang tight!
            </p>
            <p className="text-white/60 text-base">
              Waiting for results
              <span className="inline-flex gap-0.5 ml-1">
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </p>

            {/* Fun animation */}
            <div className="mt-8 flex justify-center gap-2">
              {['🎲', '🎯', '🎮', '🎰'].map((emoji, i) => (
                <span
                  key={i}
                  className="text-2xl animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </>
        ) : isCorrect ? (
          <>
            <div className="text-7xl mb-4" style={{ animation: 'zoomIn 0.4s ease-out both' }}>
              ✅
            </div>
            <p className="text-green-300 text-3xl font-extrabold mb-2">
              Correct!
            </p>
            <p className="text-white/60 text-base">
              Waiting for leaderboard...
            </p>
          </>
        ) : (
          <>
            <div className="text-7xl mb-4" style={{ animation: 'shakeX 0.5s ease-out both' }}>
              ❌
            </div>
            <p className="text-red-300 text-3xl font-extrabold mb-2">
              Wrong!
            </p>
            <p className="text-white/60 text-base">
              Better luck next time...
            </p>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.3); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  )
}
