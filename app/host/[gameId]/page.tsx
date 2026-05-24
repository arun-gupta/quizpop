'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type {
  GameSession,
  Player,
  PublicQuestion,
  LeaderboardEntry,
} from '@/types/database'
import HostLobby from '@/components/host/HostLobby'
import HostQuestion from '@/components/host/HostQuestion'
import HostResults from '@/components/host/HostResults'
import HostLeaderboard from '@/components/host/HostLeaderboard'
import HostFinished from '@/components/host/HostFinished'

export default function HostGamePage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string

  const [session, setSession] = useState<GameSession | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [question, setQuestion] = useState<PublicQuestion | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [hostToken, setHostToken] = useState<string>('')
  const [responseCount, setResponseCount] = useState(0)
  const [answerDistribution, setAnswerDistribution] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isActionPending, setIsActionPending] = useState(false)
  const [totalQuestions, setTotalQuestions] = useState(0)

  // Track current question id to reset response counts properly
  const currentQuestionIdRef = useRef<string | null>(null)

  // Load host token from localStorage
  useEffect(() => {
    const token = localStorage.getItem(`hostToken_${gameId}`)
    if (!token) {
      router.replace('/host')
      return
    }
    setHostToken(token)
  }, [gameId, router])

  // Fetch initial game state
  const fetchGameState = useCallback(async () => {
    if (!hostToken) return
    try {
      const res = await fetch(`/api/game/${gameId}/state?hostToken=${hostToken}`)
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.replace('/host')
          return
        }
        throw new Error('Failed to fetch game state')
      }
      const data = await res.json()
      const newSession = data.session as GameSession
      setSession(newSession)
      setPlayers(data.players ?? [])

      const newQuestion = data.question ?? null
      // Reset response counters only when the question changes
      if (newQuestion?.id !== currentQuestionIdRef.current) {
        currentQuestionIdRef.current = newQuestion?.id ?? null
        setResponseCount(0)
        setAnswerDistribution({})
      }
      setQuestion(newQuestion)
      setLeaderboard(data.leaderboard ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game')
    } finally {
      setIsLoading(false)
    }
  }, [gameId, hostToken, router])

  // Fetch total question count once
  const fetchTotalQuestions = useCallback(async () => {
    if (!hostToken || !session?.quiz_id) return
    try {
      const res = await fetch(`/api/admin/quizzes/${session.quiz_id}`)
      if (res.ok) {
        const data = await res.json()
        setTotalQuestions(data.questions?.length ?? data.question_count ?? 0)
      }
    } catch {
      // non-critical, ignore
    }
  }, [hostToken, session?.quiz_id])

  useEffect(() => {
    if (hostToken) fetchGameState()
  }, [hostToken, fetchGameState])

  useEffect(() => {
    if (session?.quiz_id && totalQuestions === 0) fetchTotalQuestions()
  }, [session?.quiz_id, totalQuestions, fetchTotalQuestions])

  // Subscribe to Supabase Realtime
  useEffect(() => {
    if (!hostToken || !gameId) return
    const supabase = createClient()

    const sessionChannel = supabase
      .channel(`host-session:${gameId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${gameId}` },
        () => { fetchGameState() }
      )
      .subscribe()

    const playersChannel = supabase
      .channel(`host-players:${gameId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `game_session_id=eq.${gameId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPlayers((prev) => {
              const exists = prev.find((p) => p.id === (payload.new as Player).id)
              return exists ? prev : [...prev, payload.new as Player]
            })
          } else if (payload.eventType === 'UPDATE') {
            setPlayers((prev) =>
              prev.map((p) => (p.id === (payload.new as Player).id ? (payload.new as Player) : p))
            )
          } else if (payload.eventType === 'DELETE') {
            setPlayers((prev) => prev.filter((p) => p.id !== (payload.old as Player).id))
          }
        }
      )
      .subscribe()

    const responsesChannel = supabase
      .channel(`responses:${gameId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'player_responses' },
        (payload) => {
          const response = payload.new as { selected_answer_id: string }
          setResponseCount((prev) => prev + 1)
          setAnswerDistribution((prev) => ({
            ...prev,
            [response.selected_answer_id]: (prev[response.selected_answer_id] ?? 0) + 1,
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(sessionChannel)
      supabase.removeChannel(playersChannel)
      supabase.removeChannel(responsesChannel)
    }
  }, [hostToken, gameId, fetchGameState])

  // Keyboard shortcut: Space / Enter triggers the action button
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) return
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        document.getElementById('host-action-btn')?.click()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // -------- Action helpers (call API then refresh state) --------

  async function callHostAction(path: string) {
    if (isActionPending || !hostToken) return
    setIsActionPending(true)
    try {
      const res = await fetch(`/api/game/${gameId}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostToken }),
      })
      if (!res.ok) {
        const data = await res.json()
        console.error(`Action ${path} failed:`, data.error)
      }
      await fetchGameState()
    } catch (err) {
      console.error(`Action ${path} error:`, err)
    } finally {
      setIsActionPending(false)
    }
  }

  const handleStart = useCallback(() => callHostAction('start'), [hostToken, isActionPending]) // eslint-disable-line react-hooks/exhaustive-deps
  const handleNext = useCallback(() => callHostAction('next'), [hostToken, isActionPending]) // eslint-disable-line react-hooks/exhaustive-deps

  // -------- Render --------

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <p className="text-2xl font-bold text-white">Loading game...</p>
          <p className="text-purple-300 mt-2">Setting everything up!</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex items-center justify-center px-4">
        <div className="text-center card-glass p-8 max-w-md w-full">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={fetchGameState} className="btn-primary">Retry</button>
            <button onClick={() => router.push('/host')} className="btn-outline">Back to Host</button>
          </div>
        </div>
      </div>
    )
  }

  if (!session) return null

  const isLastQuestion = totalQuestions > 0
    ? session.current_question_index >= totalQuestions - 1
    : false

  switch (session.game_state) {
    case 'lobby':
      return (
        <HostLobby
          session={session}
          players={players}
          onStart={handleStart}
          isStarting={isActionPending}
        />
      )

    case 'question_active':
      if (!question) return null
      return (
        <HostQuestion
          question={question}
          players={players}
          responses={responseCount}
          onReveal={handleNext}
          isRevealing={isActionPending}
          questionStartedAt={session.question_started_at}
        />
      )

    case 'question_results':
      if (!question) return null
      return (
        <HostResults
          question={question}
          correctAnswerId={session.correct_answer_id ?? ''}
          players={players}
          answerDistribution={answerDistribution}
          onLeaderboard={handleNext}
        />
      )

    case 'leaderboard':
      return (
        <HostLeaderboard
          entries={leaderboard}
          onNext={handleNext}
          isLastQuestion={isLastQuestion}
          isAdvancing={isActionPending}
        />
      )

    case 'finished':
      return (
        <HostFinished
          entries={leaderboard}
          session={session}
        />
      )

    default:
      return null
  }
}
