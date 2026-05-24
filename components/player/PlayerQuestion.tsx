'use client'

import { useEffect, useState } from 'react'
import { PublicQuestion } from '@/types/database'
import CountdownTimer from '@/components/game/CountdownTimer'
import AnswerButton from '@/components/game/AnswerButton'

interface PlayerQuestionProps {
  question: PublicQuestion
  questionStartedAt: string | null
  selectedAnswerId: string | null
  onAnswer: (answerId: string) => void
  isSubmitting: boolean
}

export default function PlayerQuestion({
  question,
  questionStartedAt,
  selectedAnswerId,
  onAnswer,
  isSubmitting,
}: PlayerQuestionProps) {
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

  const timedOut = secondsLeft <= 0
  const isAnswered = selectedAnswerId !== null
  const buttonsDisabled = isAnswered || timedOut || isSubmitting

  const sortedOptions = [...question.answer_options].sort(
    (a, b) => a.display_order - b.display_order
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col font-[var(--font-nunito)]">
      {/* Timer + question number */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="text-white/60 text-sm font-semibold">
          Q#{question.display_order}
        </div>
        <CountdownTimer
          seconds={secondsLeft}
          totalSeconds={question.timer_seconds}
          size="sm"
        />
        <div className="text-white/60 text-sm font-semibold">
          {question.points} pts
        </div>
      </div>

      {/* Question text */}
      <div className="px-4 pb-3">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <p className="text-white text-lg font-bold text-center leading-snug">
            {question.question_text}
          </p>
        </div>
      </div>

      {/* Answer buttons */}
      <div className="flex-1 px-4 pb-4 grid grid-cols-2 gap-3">
        {sortedOptions.map((option, i) => (
          <AnswerButton
            key={option.id}
            option={option}
            index={i}
            disabled={buttonsDisabled}
            selected={selectedAnswerId === option.id}
            revealed={false}
            isCorrect={false}
            onClick={() => {
              if (!buttonsDisabled) {
                onAnswer(option.id)
              }
            }}
          />
        ))}
      </div>

      {/* Overlay states */}
      {isAnswered && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 text-center shadow-2xl border border-white/30 mx-6">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-white text-2xl font-extrabold mb-1">
              Answer submitted!
            </p>
            <p className="text-white/70 text-base">
              Waiting for results
              <span className="inline-flex gap-0.5 ml-2">
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </p>
          </div>
        </div>
      )}

      {timedOut && !isAnswered && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-red-900/80 backdrop-blur-md rounded-3xl p-8 text-center shadow-2xl border border-red-400/40 mx-6">
            <div className="text-5xl mb-3">⏰</div>
            <p className="text-white text-2xl font-extrabold">Time&apos;s up!</p>
            <p className="text-white/70 text-base mt-1">
              Waiting for results...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
