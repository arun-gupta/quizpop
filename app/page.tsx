import Link from 'next/link'

// Pure CSS star positions — no client JS needed
const STARS = [
  { size: 2, top: 8, left: 15, delay: 0, duration: 3 },
  { size: 3, top: 12, left: 72, delay: 0.5, duration: 2.5 },
  { size: 2, top: 20, left: 35, delay: 1, duration: 4 },
  { size: 4, top: 5, left: 88, delay: 1.5, duration: 3.5 },
  { size: 2, top: 30, left: 55, delay: 0.8, duration: 2.8 },
  { size: 3, top: 45, left: 8, delay: 2, duration: 3.2 },
  { size: 2, top: 60, left: 92, delay: 0.3, duration: 4.1 },
  { size: 4, top: 75, left: 25, delay: 1.2, duration: 2.7 },
  { size: 2, top: 85, left: 65, delay: 0.7, duration: 3.8 },
  { size: 3, top: 15, left: 48, delay: 1.8, duration: 3.0 },
  { size: 2, top: 38, left: 80, delay: 2.5, duration: 2.4 },
  { size: 4, top: 55, left: 42, delay: 0.4, duration: 4.5 },
  { size: 2, top: 70, left: 12, delay: 1.6, duration: 3.3 },
  { size: 3, top: 90, left: 78, delay: 2.2, duration: 2.9 },
  { size: 2, top: 22, left: 62, delay: 0.9, duration: 3.6 },
  { size: 3, top: 48, left: 30, delay: 1.4, duration: 2.2 },
  { size: 2, top: 65, left: 50, delay: 2.8, duration: 4.0 },
  { size: 4, top: 80, left: 88, delay: 0.6, duration: 3.1 },
  { size: 2, top: 3, left: 40, delay: 1.9, duration: 2.6 },
  { size: 3, top: 95, left: 20, delay: 0.2, duration: 3.9 },
]

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 overflow-hidden flex flex-col items-center justify-center px-4 py-12">
      {/* Animated star background */}
      <div className="stars-container" aria-hidden="true">
        {STARS.map((star, i) => (
          <div
            key={i}
            className="star animate-twinkle"
            style={{
              width: star.size,
              height: star.size,
              top: `${star.top}%`,
              left: `${star.left}%`,
              '--delay': `${star.delay}s`,
              '--duration': `${star.duration}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Radial glow blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="animate-slide-in-down">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl animate-float" style={{ animationDelay: '0s' }}>🎉</span>
            <h1
              className="text-responsive-xl font-black tracking-tight gradient-text"
              style={{ lineHeight: 1.1 }}
            >
              QuizPop
            </h1>
            <span className="text-5xl animate-float" style={{ animationDelay: '0.5s' }}>🎊</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-purple-200 text-shadow">
            The party game everyone loves!
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-lg text-purple-300/80 max-w-md animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          Create a game in seconds, join with a code, and battle friends for quiz glory!
        </p>

        {/* Action buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-slide-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <Link
            href="/host"
            className="group relative flex items-center justify-center gap-3 px-8 py-5 rounded-3xl font-extrabold text-2xl text-white
              bg-gradient-to-r from-violet-600 to-purple-600
              hover:from-violet-500 hover:to-purple-500
              transform hover:scale-105 active:scale-95
              transition-all duration-200
              shadow-2xl hover:shadow-violet-500/50
              animate-pulse-glow
              min-w-[200px]"
          >
            <span className="text-3xl group-hover:animate-bounce">🎮</span>
            <span>Host a Game</span>
          </Link>

          <Link
            href="/join"
            className="group flex items-center justify-center gap-3 px-8 py-5 rounded-3xl font-extrabold text-2xl text-white
              bg-gradient-to-r from-pink-600 to-rose-600
              hover:from-pink-500 hover:to-rose-500
              transform hover:scale-105 active:scale-95
              transition-all duration-200
              shadow-2xl hover:shadow-pink-500/50
              min-w-[200px]"
          >
            <span className="text-3xl group-hover:animate-bounce">🚀</span>
            <span>Join a Game</span>
          </Link>
        </div>

        {/* Features row */}
        <div
          className="flex flex-wrap justify-center gap-4 mt-2 animate-slide-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          {[
            { emoji: '👥', text: 'Up to 100 players' },
            { emoji: '⚡', text: 'Live scoring' },
            { emoji: '🎊', text: 'Fun for all ages' },
            { emoji: '📱', text: 'No app needed' },
          ].map((feat) => (
            <div
              key={feat.text}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold text-purple-100"
            >
              <span>{feat.emoji}</span>
              <span>{feat.text}</span>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div
          className="w-full card-glass p-6 sm:p-8 mt-4 animate-slide-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <h2 className="text-xl font-extrabold text-white mb-5 text-center">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/60 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                1
              </div>
              <p className="text-sm font-semibold text-purple-200">
                Host picks a quiz and creates a game room
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-pink-600/60 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                2
              </div>
              <p className="text-sm font-semibold text-purple-200">
                Players join with the 6-letter code on any device
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/60 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                3
              </div>
              <p className="text-sm font-semibold text-purple-200">
                Answer fast, score big, climb the leaderboard!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-12 flex flex-col items-center gap-3 text-purple-400/60 text-sm">
        <p>Built with Next.js &amp; Supabase</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/arun-gupta/quizpop"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-purple-400/50 hover:text-white transition-colors"
            aria-label="View source on GitHub"
          >
            {/* GitHub Octocat SVG */}
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span className="text-xs font-semibold">GitHub</span>
          </a>
          <Link
            href="/admin"
            className="text-xs text-purple-500/40 hover:text-purple-400/60 transition-colors"
          >
            Admin
          </Link>
        </div>
      </footer>
    </main>
  )
}
