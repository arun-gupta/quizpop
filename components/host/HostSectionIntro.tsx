'use client'

import { useEffect, useState } from 'react'
import type { PublicQuestion } from '@/types/database'

interface HostSectionIntroProps {
  question: PublicQuestion
  onBegin: () => void
  isBeginning: boolean
  autoAdvanceSecs?: number
}

export default function HostSectionIntro({
  question,
  onBegin,
  isBeginning,
  autoAdvanceSecs = 5,
}: HostSectionIntroProps) {
  const [countdown, setCountdown] = useState(autoAdvanceSecs)

  useEffect(() => {
    setCountdown(autoAdvanceSecs)
  }, [question.id, autoAdvanceSecs])

  useEffect(() => {
    if (countdown <= 0) {
      onBegin()
      return
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, onBegin])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center font-[var(--font-nunito)]">
      <div className="text-center px-8 max-w-3xl w-full">
        {/* Label */}
        <p className="text-white/40 text-sm font-semibold uppercase tracking-[0.3em] mb-6">
          Next Section
        </p>

        {/* Section name */}
        <h1 className="text-7xl font-extrabold text-white mb-4 leading-tight">
          {question.section_title}
        </h1>

        {/* Divider */}
        <div className="w-24 h-1 bg-violet-400/60 rounded-full mx-auto mb-10" />

        {/* Countdown ring + button */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="6" />
              <circle
                cx="48" cy="48" r="40"
                fill="none"
                stroke="rgb(167 139 250)"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - countdown / autoAdvanceSecs)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white text-3xl font-extrabold">
              {countdown}
            </span>
          </div>

          <button
            id="host-action-btn"
            onClick={onBegin}
            disabled={isBeginning}
            className={[
              'px-10 py-4 rounded-2xl text-white text-xl font-extrabold shadow-xl transition-all duration-200',
              !isBeginning
                ? 'bg-gradient-to-r from-purple-500 to-violet-400 hover:from-purple-400 hover:to-violet-300 hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-gray-600 opacity-60 cursor-not-allowed',
            ].join(' ')}
          >
            {isBeginning ? 'Starting…' : 'Begin Section →'}
          </button>
        </div>
      </div>
    </div>
  )
}
