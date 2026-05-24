'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { PublicQuestion, Player } from '@/types/database'
import CountdownTimer from '@/components/game/CountdownTimer'

const ANSWER_CONFIG = [
  { bg: 'bg-red-500', emoji: '▲' },
  { bg: 'bg-blue-500', emoji: '◆' },
  { bg: 'bg-yellow-500', emoji: '●' },
  { bg: 'bg-green-500', emoji: '■' },
]

interface HostQuestionProps {
  question: PublicQuestion
  players: Player[]
  responses: number
  onReveal: () => void
  isRevealing: boolean
  questionStartedAt: string | null
}

export default function HostQuestion({
  question,
  players,
  responses,
  onReveal,
  isRevealing,
  questionStartedAt,
}: HostQuestionProps) {
  const [secondsLeft, setSecondsLeft] = useState(question.timer_seconds)

  useEffect(() => {
    setSecondsLeft(question.timer_seconds)
  }, [question.id, question.timer_seconds])

  useEffect(() => {
    if (!questionStartedAt) {
      setSecondsLeft(question.timer_seconds)
      return
    }

    const tick = () => {
      const elapsed = (Date.now() - new Date(questionStartedAt).getTime()) / 1000
      const remaining = Math.max(0, question.timer_seconds - elapsed)
      setSecondsLeft(remaining)
    }

    tick()
    const interval = setInterval(tick, 250)
    return () => clearInterval(interval)
  }, [questionStartedAt, question.timer_seconds])

  const allAnswered = players.length > 0 && responses >= players.length
  const timedOut = secondsLeft <= 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col font-[var(--font-nunito)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 pt-6 pb-2">
        <div className="text-white/60 text-xl font-semibold">
          Question #{question.display_order}
        </div>
        <CountdownTimer
          seconds={secondsLeft}
          totalSeconds={question.timer_seconds}
          size="lg"
        />
        <div className="text-white text-xl font-semibold">
          <span className="text-white/60">Answers: </span>
          <span className="text-white font-extrabold">
            {responses}
          </span>
          <span className="text-white/60"> / {players.length}</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col px-8 py-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 flex-shrink-0">
          <p className="text-white text-3xl font-bold text-center leading-snug">
            {question.question_text}
          </p>
        </div>

        {/* Image */}
        {question.image_url && (
          <div className="flex justify-center flex-shrink-0">
            <div className="relative h-52 w-full max-w-lg rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={question.image_url}
                alt="Question image"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Answer options */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {question.answer_options
            .sort((a, b) => a.display_order - b.display_order)
            .map((option, i) => {
              const config = ANSWER_CONFIG[i % 4]
              return (
                <div
                  key={option.id}
                  className={[
                    'rounded-2xl p-4 flex items-center gap-4 shadow-lg',
                    config.bg,
                  ].join(' ')}
                >
                  <span className="text-white text-3xl w-10 text-center flex-shrink-0">
                    {config.emoji}
                  </span>
                  <span className="text-white text-xl font-bold leading-snug">
                    {option.answer_text}
                  </span>
                </div>
              )
            })}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-8 pb-8 flex items-center justify-between gap-4">
        {/* Response progress */}
        <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden max-w-sm">
          <div
            className="h-full bg-purple-400 transition-all duration-500 rounded-full"
            style={{
              width:
                players.length > 0
                  ? `${(responses / players.length) * 100}%`
                  : '0%',
            }}
          />
        </div>

        <button
          onClick={onReveal}
          disabled={isRevealing}
          className={[
            'px-8 py-4 rounded-2xl text-white text-xl font-extrabold',
            'transition-all duration-200 shadow-xl',
            !isRevealing
              ? 'bg-gradient-to-r from-purple-500 to-violet-400 hover:from-purple-400 hover:to-violet-300 hover:scale-105 active:scale-95 cursor-pointer'
              : 'bg-gray-600 opacity-60 cursor-not-allowed',
          ].join(' ')}
        >
          {isRevealing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Revealing...
            </span>
          ) : allAnswered || timedOut ? (
            '📊 Reveal Answers'
          ) : (
            '📊 Reveal Answers'
          )}
        </button>
      </div>
    </div>
  )
}
