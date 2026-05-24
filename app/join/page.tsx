'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Step = 'code' | 'name'

const AVATAR_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
]

export default function JoinPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo')

  const [step, setStep] = useState<Step>('code')
  const [joinCode, setJoinCode] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [validatedGameId, setValidatedGameId] = useState<string | null>(null)

  const codeInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Pre-fill join code from URL query param or returnTo path
  useEffect(() => {
    const codeParam = searchParams.get('code')
    if (codeParam) {
      setJoinCode(codeParam.toUpperCase().slice(0, 6))
    }
    // Focus the first input
    codeInputRef.current?.focus()
  }, [searchParams])

  // Focus name input when step changes
  useEffect(() => {
    if (step === 'name') {
      setTimeout(() => nameInputRef.current?.focus(), 100)
    }
  }, [step])

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
    setJoinCode(val)
    setError(null)
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (joinCode.length !== 6) {
      setError('Please enter a 6-character game code.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Validate the join code by attempting a lightweight check
      const res = await fetch(`/api/game/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joinCode, validate: true }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 404) {
          setError("Game not found. Check your code!")
        } else if (res.status === 409) {
          setError("Game has already started!")
        } else {
          setError(data.error || 'Something went wrong. Please try again.')
        }
        return
      }

      // Code is valid — move to name step
      setValidatedGameId(data.gameId)
      setStep('name')
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedName = displayName.trim()
    if (!trimmedName) {
      setError('Please enter a display name.')
      return
    }
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }
    if (trimmedName.length > 20) {
      setError('Name must be 20 characters or less.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/game/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joinCode, displayName: trimmedName }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 404) {
          setError("Game not found. Check your code!")
          setStep('code')
        } else if (res.status === 409) {
          setError("Game has already started!")
          setStep('code')
        } else if (res.status === 422) {
          setError("That name's already taken. Try another!")
        } else {
          setError(data.error || 'Failed to join. Please try again.')
        }
        return
      }

      const { player, session } = data
      const gameId = session.id

      // Pick a random avatar color
      const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

      // Save player data to localStorage
      localStorage.setItem(
        `playerData_${gameId}`,
        JSON.stringify({
          playerId: player.id,
          displayName: player.display_name,
          avatarColor: player.avatar_color || avatarColor,
          joinedAt: new Date().toISOString(),
        })
      )

      // Navigate to the play page
      const destination = returnTo || `/play/${gameId}`
      router.push(destination)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center px-4 py-8">
      {/* Background blobs */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in-down">
          <Link href="/" className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-6 text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">🚀</span>
            <h1 className="text-4xl font-black text-white">Join a Game</h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
              step === 'code'
                ? 'bg-violet-600 text-white'
                : 'bg-white/20 text-white/60'
            }`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-black ${
                step === 'name' ? 'bg-emerald-500' : 'bg-white/30'
              }`}>
                {step === 'name' ? '✓' : '1'}
              </span>
              Enter Code
            </div>
            <div className="w-8 h-0.5 bg-white/20" />
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
              step === 'name'
                ? 'bg-violet-600 text-white'
                : 'bg-white/10 text-white/40'
            }`}>
              <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-xs font-black">2</span>
              Your Name
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="card-glass p-8 animate-slide-in-up">
          {step === 'code' ? (
            <form onSubmit={handleCodeSubmit} className="flex flex-col gap-6">
              <div className="text-center">
                <label className="block text-purple-200 font-bold mb-3 text-lg">
                  Enter the game code
                </label>
                <input
                  ref={codeInputRef}
                  type="text"
                  value={joinCode}
                  onChange={handleCodeChange}
                  placeholder="XXXXXX"
                  className="input-game tracking-[0.4em] uppercase text-4xl font-black"
                  maxLength={6}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  disabled={isLoading}
                />
                {joinCode.length > 0 && joinCode.length < 6 && (
                  <p className="text-purple-300/70 text-sm mt-2 font-semibold">
                    {6 - joinCode.length} more character{6 - joinCode.length !== 1 ? 's' : ''}
                  </p>
                )}
                {joinCode.length === 6 && (
                  <p className="text-emerald-400 text-sm mt-2 font-semibold">
                    Looks good! ✓
                  </p>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-2xl px-4 py-3 text-red-300 font-semibold text-sm animate-bounce-in">
                  <span>❌</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || joinCode.length !== 6}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Checking...
                  </span>
                ) : (
                  'Continue →'
                )}
              </button>

              <p className="text-center text-purple-300/60 text-sm">
                Ask the host for the game code displayed on their screen
              </p>
            </form>
          ) : (
            <form onSubmit={handleNameSubmit} className="flex flex-col gap-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-4 py-2 text-emerald-300 font-bold text-sm mb-4">
                  <span>✓</span>
                  <span>Code: {joinCode}</span>
                </div>

                <label className="block text-purple-200 font-bold mb-3 text-lg">
                  What&apos;s your name?
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value.slice(0, 20))
                    setError(null)
                  }}
                  placeholder="Your name..."
                  className="input-game"
                  maxLength={20}
                  autoComplete="off"
                  disabled={isLoading}
                />
                <div className="flex justify-between mt-2 text-xs text-purple-300/60 font-semibold px-1">
                  <span>{displayName.length > 0 ? `${displayName.length}/20 characters` : ''}</span>
                  <span>{displayName.length === 20 ? 'Max length reached' : ''}</span>
                </div>
              </div>

              {/* Avatar color preview */}
              {displayName.trim().length >= 2 && (
                <div className="flex items-center justify-center gap-3 animate-bounce-in">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-lg border-4 border-white/30"
                    style={{ backgroundColor: AVATAR_COLORS[displayName.charCodeAt(0) % AVATAR_COLORS.length] }}
                  >
                    {displayName.trim().charAt(0).toUpperCase()}
                  </div>
                  <p className="text-purple-200 font-bold">
                    You&apos;ll appear as &quot;{displayName.trim().slice(0, 12)}{displayName.trim().length > 12 ? '...' : ''}&quot;
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-2xl px-4 py-3 text-red-300 font-semibold text-sm animate-bounce-in">
                  <span>❌</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep('code'); setError(null) }}
                  disabled={isLoading}
                  className="btn-outline flex-1 text-lg px-4 py-3"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || displayName.trim().length < 2}
                  className="btn-success flex-[2] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Joining...
                    </span>
                  ) : (
                    "Let's Go! 🚀"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Fun tagline */}
        <p className="text-center text-purple-300/50 text-sm mt-6 font-semibold">
          No account needed · Just show up and play!
        </p>
      </div>
    </main>
  )
}
