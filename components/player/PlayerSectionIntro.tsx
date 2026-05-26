'use client'

interface PlayerSectionIntroProps {
  sectionTitle: string
}

export default function PlayerSectionIntro({ sectionTitle }: PlayerSectionIntroProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center font-[var(--font-nunito)] px-6">
      <div className="text-center">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-[0.3em] mb-4">
          Next Section
        </p>

        <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
          {sectionTitle}
        </h2>

        <div className="w-16 h-1 bg-violet-400/60 rounded-full mx-auto mb-8" />

        <p className="text-white/50 text-base mb-6">Get ready…</p>

        <div className="flex gap-2 justify-center">
          <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
