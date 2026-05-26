'use client'

import { useEffect, useState } from 'react'
import { PublicQuestion, Player, WordCloudEntry } from '@/types/database'
import WordCloud from '@/components/game/WordCloud'

const ANSWER_CONFIG = [
  { bg: 'bg-red-500', dimBg: 'bg-red-900/40', emoji: '▲' },
  { bg: 'bg-blue-500', dimBg: 'bg-blue-900/40', emoji: '◆' },
  { bg: 'bg-yellow-500', dimBg: 'bg-yellow-900/40', emoji: '●' },
  { bg: 'bg-green-500', dimBg: 'bg-green-900/40', emoji: '■' },
]

interface HostResultsProps {
  question: PublicQuestion
  correctAnswerId: string | null
  players: Player[]
  answerDistribution: Record<string, number>
  wordCloud?: WordCloudEntry[] | null
  onLeaderboard: () => void
  autoAdvanceSecs?: number
}

export default function HostResults({
  question,
  correctAnswerId,
  players,
  answerDistribution,
  wordCloud,
  onLeaderboard,
  autoAdvanceSecs = 5,
}: HostResultsProps) {
  const [countdown, setCountdown] = useState(autoAdvanceSecs)

  useEffect(() => {
    setCountdown(autoAdvanceSecs)
    const interval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [autoAdvanceSecs])

  const isOpenText = question.question_type === 'open_text'
  const totalResponses = isOpenText
    ? (wordCloud ?? []).reduce((sum, e) => sum + e.count, 0)
    : Object.values(answerDistribution).reduce((sum, n) => sum + n, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col font-[var(--font-nunito)]">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <div className="text-center">
          <p className="text-white/60 text-xl font-semibold mb-1">
            Question #{question.display_order}
          </p>
          <h2 className="text-white text-3xl font-bold leading-snug">
            {question.question_text}
          </h2>
        </div>
      </div>

      {/* Body: word cloud or answer distribution */}
      <div className="flex-1 px-8 py-4">
        {isOpenText ? (
          <div className="bg-black/20 rounded-3xl min-h-[240px] flex items-center justify-center">
            <WordCloud entries={wordCloud ?? []} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {[...question.answer_options]
              .sort((a, b) => a.display_order - b.display_order)
              .map((option, i) => {
                const config = ANSWER_CONFIG[i % 4]
                const isCorrect = option.id === correctAnswerId
                const count = answerDistribution[option.id] ?? 0
                const maxCount = Math.max(1, ...Object.values(answerDistribution))
                const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0
                const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0

                return (
                  <div
                    key={option.id}
                    className={[
                      'rounded-2xl overflow-hidden shadow-xl transition-all duration-300',
                      isCorrect ? '' : 'opacity-60',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'flex items-center gap-4 px-4 py-4',
                        isCorrect ? config.bg : config.dimBg,
                      ].join(' ')}
                    >
                      <span className="text-white text-3xl w-10 text-center flex-shrink-0">
                        {isCorrect ? '✓' : config.emoji}
                      </span>
                      <span className={['text-xl font-bold leading-snug flex-1', isCorrect ? 'text-white' : 'text-white/70'].join(' ')}>
                        {option.answer_text}
                      </span>
                      <span className={['text-xl font-extrabold ml-auto flex-shrink-0', isCorrect ? 'text-white' : 'text-white/60'].join(' ')}>
                        {count}
                      </span>
                    </div>
                    <div className="bg-black/30 px-4 py-2">
                      <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={['absolute left-0 top-0 h-full rounded-full transition-all duration-700', isCorrect ? config.bg : 'bg-white/30'].join(' ')}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <p className="text-white/50 text-xs mt-1 text-right">{percentage.toFixed(0)}%</p>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="px-8 pb-4 text-center">
        <p className="text-white/50 text-lg">
          <span className="text-white font-bold">{totalResponses}</span> of{' '}
          <span className="text-white font-bold">{players.length}</span> players answered
        </p>
      </div>

      {/* Auto-advance countdown + manual button */}
      <div className="px-8 pb-8 flex flex-col items-center gap-3">
        <button
          onClick={onLeaderboard}
          className="px-12 py-5 rounded-2xl text-white text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-violet-400 hover:from-purple-400 hover:to-violet-300 hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xl cursor-pointer"
        >
          🏆 Show Leaderboard
        </button>
        <p className="text-white/40 text-sm font-semibold">
          Auto-advancing in {countdown}s…
        </p>
      </div>
    </div>
  )
}
