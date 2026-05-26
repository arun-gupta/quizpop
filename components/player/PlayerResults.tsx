'use client'

import Image from 'next/image'
import { PublicQuestion } from '@/types/database'

const ANSWER_CONFIG = [
  { bg: 'bg-red-500', emoji: '▲' },
  { bg: 'bg-blue-500', emoji: '◆' },
  { bg: 'bg-yellow-500', emoji: '●' },
  { bg: 'bg-green-500', emoji: '■' },
]

interface PlayerResultsProps {
  question: PublicQuestion
  selectedAnswerId: string | null
  correctAnswerId: string
  awardedPoints: number
  totalScore: number
}

export default function PlayerResults({
  question,
  selectedAnswerId,
  correctAnswerId,
  awardedPoints,
  totalScore,
}: PlayerResultsProps) {
  const isCorrect = selectedAnswerId === correctAnswerId
  const sortedOptions = [...question.answer_options].sort(
    (a, b) => a.display_order - b.display_order
  )

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col font-[var(--font-nunito)]">
      {/* Result banner */}
      <div
        className={[
          'w-full py-6 text-center shadow-xl',
          isCorrect
            ? 'bg-gradient-to-r from-green-600 to-emerald-500'
            : 'bg-gradient-to-r from-red-700 to-rose-600',
        ].join(' ')}
        style={{ animation: 'slideDown 0.4s ease-out both' }}
      >
        <div className="text-5xl mb-1">
          {isCorrect ? '✅' : selectedAnswerId ? '❌' : '⏰'}
        </div>
        <p className="text-white text-2xl font-extrabold">
          {isCorrect
            ? 'Correct!'
            : selectedAnswerId
            ? 'Wrong!'
            : "Time's up!"}
        </p>
      </div>

      {/* Reveal image */}
      {question.image_url && question.image_reveal === 'after' && (
        <div className="px-4 pt-3">
          <div className="relative h-40 w-full rounded-2xl overflow-hidden shadow-lg">
            <Image src={question.image_url} alt="Question image" fill className="object-cover" />
          </div>
        </div>
      )}

      {/* Points earned */}
      <div className="text-center py-5 px-6">
        {awardedPoints > 0 ? (
          <div style={{ animation: 'bounceIn 0.5s ease-out 0.2s both' }}>
            <p className="text-yellow-300 text-5xl font-extrabold mb-1">
              +{awardedPoints.toLocaleString()}
            </p>
            <p className="text-white/60 text-sm font-semibold">points earned</p>
          </div>
        ) : (
          <div style={{ animation: 'bounceIn 0.5s ease-out 0.2s both' }}>
            <p className="text-white/40 text-3xl font-extrabold mb-1">+0</p>
            <p className="text-white/40 text-sm">no points this round</p>
          </div>
        )}
      </div>

      {/* Answer options */}
      <div
        className="flex-1 px-4 space-y-2 overflow-y-auto"
        style={{ animation: 'fadeIn 0.5s ease-out 0.3s both' }}
      >
        {sortedOptions.map((option, i) => {
          const config = ANSWER_CONFIG[i % 4]
          const isOptionCorrect = option.id === correctAnswerId
          const isSelected = option.id === selectedAnswerId

          let bgClass = 'bg-white/10 opacity-50'
          let border = ''
          let icon = <span className="text-lg">{config.emoji}</span>

          if (isOptionCorrect) {
            bgClass = 'bg-green-600/50'
            border = 'ring-2 ring-green-400'
            icon = <span className="text-lg">✓</span>
          } else if (isSelected && !isOptionCorrect) {
            bgClass = 'bg-red-700/50'
            border = 'ring-2 ring-red-400'
            icon = <span className="text-lg">✗</span>
          }

          return (
            <div
              key={option.id}
              className={[
                'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all',
                bgClass,
                border,
              ].join(' ')}
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white flex-shrink-0">
                {icon}
              </span>
              <span
                className={[
                  'text-base font-bold',
                  isOptionCorrect
                    ? 'text-green-200'
                    : isSelected
                    ? 'text-red-200'
                    : 'text-white/50',
                ].join(' ')}
              >
                {option.answer_text}
              </span>
              {isSelected && (
                <span className="ml-auto text-xs text-white/50 font-semibold">
                  your answer
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Total score */}
      <div
        className="px-4 pb-6 pt-4 text-center"
        style={{ animation: 'fadeIn 0.5s ease-out 0.4s both' }}
      >
        <div className="bg-white/10 rounded-2xl px-6 py-3 inline-block">
          <p className="text-white/60 text-sm font-semibold">Total Score</p>
          <p className="text-white text-3xl font-extrabold">
            {totalScore.toLocaleString()}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          60% { opacity: 1; transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
