'use client'

import { useEffect, useState } from 'react'
import { PublicQuestion, Player, WordCloudEntry } from '@/types/database'
import CountdownTimer from '@/components/game/CountdownTimer'
import WordCloud from '@/components/game/WordCloud'

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
  questionStartedAt: string | null
  wordCloud?: WordCloudEntry[] | null
  isPaused?: boolean
}

export default function HostQuestion({
  question,
  players,
  responses,
  questionStartedAt,
  wordCloud,
  isPaused = false,
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
    if (isPaused) return // freeze timer while paused

    const tick = () => {
      const elapsed = (Date.now() - new Date(questionStartedAt).getTime()) / 1000
      const remaining = Math.max(0, question.timer_seconds - elapsed)
      setSecondsLeft(remaining)
    }

    tick()
    const interval = setInterval(tick, 250)
    return () => clearInterval(interval)
  }, [questionStartedAt, question.timer_seconds, isPaused])

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col font-[var(--font-nunito)]">
      {/* Paused overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-8xl mb-4">⏸</div>
            <p className="text-white text-4xl font-extrabold tracking-widest uppercase">Game Paused</p>
          </div>
        </div>
      )}
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
        {question.section_title && (
          <div className="flex justify-center">
            <span className="bg-white/10 border border-white/20 text-white/60 text-sm font-semibold tracking-widest uppercase px-5 py-1.5 rounded-full">
              {question.section_title}
            </span>
          </div>
        )}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 flex-shrink-0">
          <p className="text-white text-3xl font-bold text-center leading-snug">
            {question.question_text}
          </p>
        </div>

        {/* Image — only shown before reveal */}
        {question.image_url && question.image_reveal !== 'after' && (
          <div className="flex justify-center flex-shrink-0 px-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={question.image_url}
              alt="Question image"
              className="max-h-[28vh] w-auto max-w-full rounded-2xl shadow-xl object-contain"
            />
          </div>
        )}

        {/* Answer options or live word cloud */}
        {question.question_type === 'open_text' ? (
          <div className="flex-1 bg-black/20 rounded-3xl flex items-center justify-center min-h-0">
            <WordCloud entries={wordCloud ?? []} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 flex-1">
            {[...question.answer_options].map((option, i) => {
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
        )}
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

        <p className="text-white/50 text-sm font-semibold">
          Results reveal automatically when the timer ends
        </p>
      </div>
    </div>
  )
}
