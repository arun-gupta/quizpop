'use client'

import { useEffect, useState } from 'react'

interface HostSectionIntroProps {
  sectionTitle: string
  introStartedAt: string | null
}

const INTRO_DURATION_MS = 5000

export default function HostSectionIntro({ sectionTitle, introStartedAt }: HostSectionIntroProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!introStartedAt) return
    const tick = () => {
      const elapsed = Date.now() - new Date(introStartedAt).getTime()
      setProgress(Math.min(1, elapsed / INTRO_DURATION_MS))
    }
    tick()
    const interval = setInterval(tick, 100)
    return () => clearInterval(interval)
  }, [introStartedAt])

  const secondsLeft = introStartedAt
    ? Math.max(0, Math.ceil((INTRO_DURATION_MS - (Date.now() - new Date(introStartedAt).getTime())) / 1000))
    : INTRO_DURATION_MS / 1000

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center font-[var(--font-nunito)]">
      <div id="host-action-btn" className="text-center px-8 max-w-3xl w-full">
        <p className="text-white/40 text-sm font-semibold uppercase tracking-[0.3em] mb-6">
          Next Section
        </p>
        <h1 className="text-7xl font-extrabold text-white mb-4 leading-tight">
          {sectionTitle}
        </h1>
        <div className="w-24 h-1 bg-violet-400/60 rounded-full mx-auto mb-10" />
        <div className="flex flex-col items-center gap-4">
          {/* Progress ring */}
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="6" />
              <circle
                cx="48" cy="48" r="40"
                fill="none"
                stroke="rgb(167 139 250)"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress)}`}
                strokeLinecap="round"
                className="transition-all duration-100 ease-linear"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white text-3xl font-extrabold">
              {secondsLeft}
            </span>
          </div>
          <p className="text-white/50 text-lg font-semibold">Starting soon…</p>
        </div>
      </div>
    </div>
  )
}
