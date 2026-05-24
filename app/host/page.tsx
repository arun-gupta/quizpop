'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Quiz } from '@/types/database'

interface QuizWithCount extends Quiz {
  question_count?: number
}

const CATEGORY_EMOJIS: Record<string, string> = {
  general: '🌍',
  science: '🔬',
  history: '📜',
  sports: '⚽',
  music: '🎵',
  movies: '🎬',
  food: '🍕',
  technology: '💻',
  nature: '🌿',
  default: '🎯',
}

function getCategoryEmoji(title: string): string {
  const lower = title.toLowerCase()
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJIS)) {
    if (lower.includes(key)) return emoji
  }
  return CATEGORY_EMOJIS.default
}

const CARD_GRADIENTS = [
  'from-violet-600 to-purple-700',
  'from-pink-600 to-rose-700',
  'from-blue-600 to-indigo-700',
  'from-emerald-600 to-teal-700',
  'from-amber-600 to-orange-700',
  'from-cyan-600 to-sky-700',
]

export default function HostPage() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<QuizWithCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creatingGameFor, setCreatingGameFor] = useState<string | null>(null)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  async function fetchQuizzes() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/quizzes')
      if (!res.ok) {
        throw new Error('Failed to load quizzes')
      }
      const data = await res.json()
      // Support both { quizzes: [...] } and direct array responses
      const list: QuizWithCount[] = Array.isArray(data) ? data : (data.quizzes ?? [])
      setQuizzes(list)
    } catch (err) {
      setError('Could not load quizzes. Please refresh and try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateGame(quizId: string) {
    setCreatingGameFor(quizId)
    setError(null)

    try {
      const res = await fetch('/api/game/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz_id: quizId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create game')
      }

      const data = await res.json()
      const { gameId, hostToken } = data

      // Save host token to localStorage
      localStorage.setItem(`hostToken_${gameId}`, hostToken)
      localStorage.setItem(`hostGameId`, gameId)

      // Navigate to host control panel
      router.push(`/host/${gameId}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create game'
      setError(message)
      setCreatingGameFor(null)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 px-4 py-8">
      {/* Background blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-in-down">
          <Link href="/" className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-4xl">🎮</span>
            <div>
              <h1 className="text-3xl font-black text-white">Host a Game</h1>
              <p className="text-purple-300 text-sm font-semibold">Pick a quiz to get started</p>
            </div>
          </div>

          <div className="w-24" />
        </div>

        {/* How it works — first-time host info */}
        <div className="card-glass p-6 mb-8 animate-slide-in-up">
          <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
            <span>💡</span> How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: '1', icon: '🎯', text: 'Pick a quiz below' },
              { step: '2', icon: '🔗', text: 'Share the join code with players' },
              { step: '3', icon: '▶️', text: 'Start when everyone has joined' },
              { step: '4', icon: '🏆', text: 'Advance questions at your pace' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-violet-600/60 flex items-center justify-center text-xs font-black text-white shrink-0">
                  {item.step}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-sm font-semibold text-purple-200">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-violet-600/20 border border-violet-500/30 rounded-2xl">
            <p className="text-sm text-violet-200 font-semibold">
              <span className="text-violet-400">💡 Pro tip:</span> Display the host screen on a TV or shared monitor.
              Players join on their own phones — no app download needed!
            </p>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/20 border border-red-500/40 rounded-2xl px-4 py-3 mb-6 text-red-300 font-semibold animate-bounce-in">
            <span>❌</span>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-200">✕</button>
          </div>
        )}

        {/* Quiz grid */}
        <div className="mb-6 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-extrabold text-white mb-4">
            Available Quizzes
            {!isLoading && quizzes.length > 0 && (
              <span className="ml-2 text-sm font-semibold text-purple-300">
                ({quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''})
              </span>
            )}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card-glass p-6 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 mb-4" />
                  <div className="h-5 bg-white/10 rounded-xl w-3/4 mb-3" />
                  <div className="h-4 bg-white/10 rounded-xl w-full mb-2" />
                  <div className="h-4 bg-white/10 rounded-xl w-2/3 mb-6" />
                  <div className="h-12 bg-white/10 rounded-2xl w-full" />
                </div>
              ))}
            </div>
          ) : quizzes.length === 0 ? (
            <div className="card-glass p-12 text-center">
              <span className="text-6xl mb-4 block">📭</span>
              <h3 className="text-xl font-bold text-white mb-2">No quizzes yet</h3>
              <p className="text-purple-300 mb-6">Create some quizzes in the admin panel first.</p>
              <Link href="/admin/quizzes/new" className="btn-primary">
                Create a Quiz
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz, index) => (
                <div
                  key={quiz.id}
                  className="card-glass p-6 hover:bg-white/15 transition-all duration-200 flex flex-col animate-slide-in-up"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  {/* Category icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]} flex items-center justify-center text-3xl mb-4 shadow-lg`}
                  >
                    {getCategoryEmoji(quiz.title)}
                  </div>

                  {/* Title & description */}
                  <h3 className="text-lg font-extrabold text-white mb-2 leading-tight">
                    {quiz.title}
                  </h3>
                  {quiz.description && (
                    <p className="text-purple-300 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
                      {quiz.description}
                    </p>
                  )}
                  {!quiz.description && <div className="flex-1 mb-4" />}

                  {/* Meta info */}
                  <div className="flex items-center gap-3 mb-5">
                    {quiz.question_count !== undefined && (
                      <span className="flex items-center gap-1 text-xs font-bold text-purple-300 bg-white/10 px-2.5 py-1 rounded-full">
                        <span>❓</span>
                        <span>{quiz.question_count} question{quiz.question_count !== 1 ? 's' : ''}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs font-bold text-purple-300 bg-white/10 px-2.5 py-1 rounded-full">
                      <span>⏱</span>
                      <span>Timed</span>
                    </span>
                  </div>

                  {/* Create game button */}
                  <button
                    onClick={() => handleCreateGame(quiz.id)}
                    disabled={creatingGameFor !== null}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-extrabold text-white text-base
                      bg-gradient-to-r ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]}
                      hover:opacity-90 transform hover:scale-105 active:scale-95
                      transition-all duration-200 shadow-lg
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {creatingGameFor === quiz.id ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      <>
                        <span>🎮</span>
                        <span>Create Game</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin link */}
        <div className="text-center mt-8">
          <Link
            href="/admin"
            className="text-purple-400/60 hover:text-purple-300 text-sm font-semibold transition-colors"
          >
            Manage quizzes in Admin Panel →
          </Link>
        </div>
      </div>
    </main>
  )
}
