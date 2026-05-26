'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type {
  GameSession,
  Player,
  PublicQuestion,
  LeaderboardEntry,
  WordCloudEntry,
} from '@/types/database'
import HostLobby from '@/components/host/HostLobby'
import HostQuestion from '@/components/host/HostQuestion'
import HostResults from '@/components/host/HostResults'
import HostLeaderboard from '@/components/host/HostLeaderboard'
import HostSectionIntro from '@/components/host/HostSectionIntro'
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
  const [wordCloud, setWordCloud] = useState<WordCloudEntry[] | null>(null)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isActionPending, setIsActionPending] = useState(false)
  const [showEndGameConfirm, setShowEndGameConfirm] = useState(false)

  // Track current question id to reset response counts when question changes
  const currentQuestionIdRef = React.useRef<string | null>(null)

  // Load host token from localStorage
  useEffect(() => {
    const token = localStorage.getItem(`hostToken_${gameId}`)
    if (!token) {
      router.replace('/host')
      return
    }
    setHostToken(token)
  }, [gameId, router])

  // Fetch game state from server (server handles all auto-transitions)
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
        setWordCloud(null)
      }
      setQuestion(newQuestion)
      setLeaderboard(data.leaderboard ?? [])
      if (data.totalQuestions) setTotalQuestions(data.totalQuestions)
      if (data.wordCloud) setWordCloud(data.wordCloud)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game')
    } finally {
      setIsLoading(false)
    }
  }, [gameId, hostToken, router])

  useEffect(() => {
    if (hostToken) fetchGameState()
  }, [hostToken, fetchGameState])

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
          const response = payload.new as { selected_answer_id: string | null; free_text_response: string | null }
          setResponseCount((prev) => prev + 1)
          if (response.selected_answer_id) {
            setAnswerDistribution((prev) => ({
              ...prev,
              [response.selected_answer_id!]: (prev[response.selected_answer_id!] ?? 0) + 1,
            }))
          } else if (response.free_text_response) {
            // Open-text response: refresh to get updated word cloud
            fetchGameState()
          }
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

  // Poll every second during timed states so server auto-transitions fire promptly
  useEffect(() => {
    const timedStates = ['section_intro', 'question_active', 'question_results', 'leaderboard']
    if (!session?.game_state || !timedStates.includes(session.game_state)) return
    const interval = setInterval(fetchGameState, 1000)
    return () => clearInterval(interval)
  }, [session?.game_state, fetchGameState])

  // -------- Action helpers --------

  async function callHostAction(path: string, extraBody: Record<string, unknown> = {}) {
    if (isActionPending || !hostToken) return
    setIsActionPending(true)
    try {
      const res = await fetch(`/api/game/${gameId}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostToken, ...extraBody }),
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
  const handleFinishGame = useCallback(() => {
    setShowEndGameConfirm(false)
    callHostAction('next', { action: 'finish' })
  }, [hostToken, isActionPending]) // eslint-disable-line react-hooks/exhaustive-deps

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

  let content: React.ReactNode = null
  switch (session.game_state) {
    case 'lobby':
      content = (
        <HostLobby
          session={session}
          players={players}
          onStart={handleStart}
          isStarting={isActionPending}
        />
      )
      break

    case 'section_intro':
      if (question) content = (
        <HostSectionIntro
          sectionTitle={question.section_title ?? ''}
          introStartedAt={session.section_intro_at ?? null}
        />
      )
      break

    case 'question_active':
      if (question) content = (
        <HostQuestion
          question={question}
          players={players}
          responses={responseCount}
          questionStartedAt={session.question_started_at}
          wordCloud={wordCloud}
        />
      )
      break

    case 'question_results':
      if (question) content = (
        <HostResults
          question={question}
          correctAnswerId={session.correct_answer_id ?? null}
          players={players}
          answerDistribution={answerDistribution}
          wordCloud={wordCloud}
          autoAdvanceSecs={10}
        />
      )
      break

    case 'leaderboard':
      content = (
        <HostLeaderboard
          entries={leaderboard}
          autoAdvanceSecs={8}
          isLastQuestion={totalQuestions > 0 && session.current_question_index >= totalQuestions - 1}
        />
      )
      break

    case 'finished':
      content = (
        <HostFinished
          entries={leaderboard}
          session={session}
        />
      )
      break
  }

  const canEndGame = session.game_state !== 'finished'

  return (
    <>
      {content}

      {/* End Game overlay — visible in all non-finished states */}
      {canEndGame && (
        <div className="fixed top-4 left-4 z-50">
          {showEndGameConfirm ? (
            <div className="bg-gray-900/95 backdrop-blur-sm border border-red-500/40 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 min-w-[220px]">
              <p className="text-white font-bold text-sm text-center">End the game for everyone?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEndGameConfirm(false)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinishGame}
                  disabled={isActionPending}
                  className="flex-1 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-bold transition-colors"
                >
                  {isActionPending ? '...' : 'End Game'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowEndGameConfirm(true)}
              className="px-4 py-2 rounded-xl bg-gray-900/80 hover:bg-red-900/80 border border-white/20 hover:border-red-500/60 text-white/60 hover:text-white text-sm font-bold backdrop-blur-sm transition-all duration-200 shadow-lg"
            >
              ✕ End Game
            </button>
          )}
        </div>
      )}
    </>
  )
}
