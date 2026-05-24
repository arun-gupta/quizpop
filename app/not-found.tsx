import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 text-center animate-slide-in-up">
        {/* 404 number */}
        <div className="relative inline-block mb-6">
          <h1
            className="text-[160px] sm:text-[200px] font-black leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444, #ec4899, #8b5cf6, #3b82f6)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </h1>
          {/* Floating emoji decorations */}
          <span
            className="absolute -top-4 -right-4 text-5xl animate-float"
            style={{ animationDelay: '0s' }}
            aria-hidden="true"
          >
            🎭
          </span>
          <span
            className="absolute -bottom-4 -left-6 text-4xl animate-float"
            style={{ animationDelay: '0.8s' }}
            aria-hidden="true"
          >
            🎲
          </span>
        </div>

        {/* Message */}
        <p className="text-3xl font-extrabold text-white mb-3 text-shadow">
          Oops! Page not found
        </p>
        <p className="text-xl text-purple-200 mb-10 max-w-md mx-auto">
          Looks like this question doesn&apos;t have an answer — because the page doesn&apos;t exist!
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/" className="btn-primary">
            🏠 Go Home
          </Link>
          <Link href="/join" className="btn-secondary">
            🚀 Join a Game
          </Link>
          <Link href="/host" className="btn-outline">
            🎮 Host a Game
          </Link>
        </div>

        {/* Fun sub-message */}
        <p className="mt-12 text-purple-400/50 text-sm font-semibold">
          The game master has no idea what happened here either.
        </p>
      </div>
    </main>
  )
}
