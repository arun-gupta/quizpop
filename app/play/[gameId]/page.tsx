'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type {
  GameSession,
  Player,
  PublicQuestion,
  LeaderboardEntry,
  PlayerResponse,
} from '@/types/database'
import PlayerSectionIntro from '@/components/player/PlayerSectionIntro'

// --------------- Sub-components ---------------

function WaitingSpinner({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-white/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-violet-400 animate-spin" />
      </div>
      <p className="text-purple-200 font-semibold text-lg">{message}</p>
    </div>
  )
}

interface PlayerLobbyProps {
  session: GameSession
  player: Player
}
function PlayerLobby({ session, player }: PlayerLobbyProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm text-center space-y-8 animate-slide-in-up">
        {/* Avatar */}
        <div
          className="w-28 h-28 rounded-full mx-auto flex items-center justify-center text-5xl font-black text-white shadow-2xl border-4 border-white/30 animate-float"
          style={{ backgroundColor: player.avatar_color }}
        >
          {player.display_name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1 className="text-3xl font-black text-white mb-1">You&apos;re in!</h1>
          <p className="text-xl font-bold text-purple-200">{player.display_name}</p>
        </div>

        <div className="card-glass p-6 space-y-4">
          <div className="flex items-center gap-3 justify-center">
            <span className="text-3xl animate-pulse">⏳</span>
            <p className="text-xl font-bold text-white">Waiting for host to start...</p>
          </div>
          <WaitingSpinner message="Game starting soon!" />
        </div>

        <p className="text-purple-300/60 text-sm font-semibold">
          Game code: <span className="text-purple-200 font-black tracking-wider">{session.join_code}</span>
        </p>
      </div>
    </div>
  )
}

interface PlayerQuestionProps {
  session: GameSession
  question: PublicQuestion
  player: Player
  onAnswer: (answerId: string) => void
  onTextAnswer: (text: string) => void
  isSubmitting: boolean
  submittedTexts?: string[]
}

const ANSWER_CONFIG = [
  { bg: 'bg-red-500 hover:bg-red-400 active:bg-red-600', emoji: '▲', shape: 'Triangle' },
  { bg: 'bg-blue-500 hover:bg-blue-400 active:bg-blue-600', emoji: '◆', shape: 'Diamond' },
  { bg: 'bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600', emoji: '●', shape: 'Circle' },
  { bg: 'bg-green-500 hover:bg-green-400 active:bg-green-600', emoji: '■', shape: 'Square' },
]

function PlayerQuestion({ session, question, player, onAnswer, onTextAnswer, isSubmitting, submittedTexts = [] }: PlayerQuestionProps) {
  const [timeLeft, setTimeLeft] = useState(question.timer_seconds)
  const [typedAnswer, setTypedAnswer] = useState('')
  const startTime = useRef<number>(
    session.question_started_at ? new Date(session.question_started_at).getTime() : Date.now()
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime.current) / 1000
      const remaining = Math.max(0, question.timer_seconds - elapsed)
      setTimeLeft(remaining)
      if (remaining <= 0) clearInterval(interval)
    }, 250)
    return () => clearInterval(interval)
  }, [question.timer_seconds])

  const progressPct = (timeLeft / question.timer_seconds) * 100
  const timerColor = progressPct > 50 ? 'bg-emerald-500' : progressPct > 25 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col">
      {/* Timer bar */}
      <div className="h-3 bg-white/10">
        <div
          className={`h-full ${timerColor} transition-all duration-250 ease-linear`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col px-4 py-6 gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-base font-black text-white border-2 border-white/30"
              style={{ backgroundColor: player.avatar_color }}
            >
              {player.display_name.charAt(0).toUpperCase()}
            </div>
            <span className="text-purple-200 font-bold text-sm">{player.display_name}</span>
          </div>
          <div className={`text-2xl font-black px-3 py-1 rounded-xl ${timerColor} text-white`}>
            {Math.ceil(timeLeft)}
          </div>
        </div>

        <div className="card-glass p-5 text-center flex-shrink-0">
          <p className="text-2xl font-extrabold text-white leading-snug">
            {question.question_text}
          </p>
          {question.image_url && question.image_reveal !== 'after' && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={question.image_url}
              alt="Question"
              className="mt-4 mx-auto max-h-48 rounded-2xl object-contain"
            />
          )}
        </div>

        {/* Answer area */}
        {question.question_type === 'open_text' ? (
          <div className="flex flex-col gap-3 flex-1">
            {submittedTexts.length > 0 && (
              <div className="bg-violet-500/20 border border-violet-400/30 rounded-2xl p-3 space-y-1.5">
                <p className="text-violet-300 text-xs font-bold uppercase tracking-wider">Your answers ({submittedTexts.length})</p>
                {submittedTexts.map((t, i) => (
                  <p key={i} className="text-white font-semibold text-sm">&ldquo;{t}&rdquo;</p>
                ))}
              </div>
            )}
            <textarea
              className="w-full bg-white/10 border-2 border-white/20 rounded-2xl p-4 text-white text-xl font-bold placeholder-white/30 resize-none focus:outline-none focus:border-violet-400 transition-colors"
              rows={3}
              maxLength={120}
              placeholder={submittedTexts.length === 0 ? 'Type your answer…' : 'Add another answer…'}
              value={typedAnswer}
              onChange={e => setTypedAnswer(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey && typedAnswer.trim() && !isSubmitting && timeLeft > 0) {
                  e.preventDefault()
                  onTextAnswer(typedAnswer.trim())
                  setTypedAnswer('')
                }
              }}
              disabled={timeLeft <= 0}
            />
            <button
              onClick={() => {
                if (!isSubmitting && typedAnswer.trim() && timeLeft > 0) {
                  onTextAnswer(typedAnswer.trim())
                  setTypedAnswer('')
                }
              }}
              disabled={isSubmitting || !typedAnswer.trim() || timeLeft <= 0}
              className="w-full bg-violet-500 hover:bg-violet-400 active:bg-violet-600 text-white text-xl font-extrabold rounded-2xl py-4 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting…' : submittedTexts.length === 0 ? 'Submit ✓' : 'Add Answer ✓'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 flex-1">
            {question.answer_options.map((option, index) => {
              const config = ANSWER_CONFIG[index % 4]
              return (
                <button
                  key={option.id}
                  onClick={() => !isSubmitting && onAnswer(option.id)}
                  disabled={isSubmitting || timeLeft <= 0}
                  className={`
                    ${config.bg} text-white rounded-2xl p-4
                    flex flex-col items-center justify-center gap-2
                    transform active:scale-95 transition-all duration-150
                    font-bold text-base shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    min-h-[100px]
                  `}
                >
                  <span className="text-2xl">{config.emoji}</span>
                  <span className="text-center leading-tight">{option.answer_text}</span>
                </button>
              )
            })}
          </div>
        )}

        {timeLeft <= 0 && !isSubmitting && (
          <div className="text-center py-4 animate-bounce-in">
            <p className="text-xl font-bold text-yellow-400">⏰ Time&apos;s up!</p>
            <p className="text-purple-300 text-sm">Waiting for results...</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface PlayerAnsweredProps {
  question: PublicQuestion
  player: Player
  selectedAnswerId: string | null
  selectedText: string | null
}

function PlayerAnswered({ question, player, selectedAnswerId, selectedText }: PlayerAnsweredProps) {
  const selectedOption = question.answer_options.find(o => o.id === selectedAnswerId)
  const selectedIndex = question.answer_options.findIndex(o => o.id === selectedAnswerId)
  const config = ANSWER_CONFIG[Math.max(0, selectedIndex) % 4]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm text-center space-y-6 animate-slide-in-up">
        <div
          className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-white/30"
          style={{ backgroundColor: player.avatar_color }}
        >
          {player.display_name.charAt(0).toUpperCase()}
        </div>

        <div>
          <div className="text-5xl mb-3">✅</div>
          <h2 className="text-3xl font-black text-white">Answer submitted!</h2>
          <p className="text-purple-200 mt-1">Good luck, {player.display_name}!</p>
        </div>

        {question.question_type === 'open_text' && selectedText ? (
          <div className="bg-violet-500/30 border border-violet-400/40 rounded-2xl p-4">
            <p className="text-violet-300 text-sm font-bold mb-1">Your answer</p>
            <p className="font-extrabold text-white text-lg">&ldquo;{selectedText}&rdquo;</p>
          </div>
        ) : selectedOption ? (
          <div className={`${config.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <span className="text-2xl">{config.emoji}</span>
            <span className="font-bold text-white text-lg">{selectedOption.answer_text}</span>
          </div>
        ) : null}

        <WaitingSpinner message="Waiting for everyone to answer..." />
      </div>
    </div>
  )
}

interface PlayerResultsProps {
  question: PublicQuestion
  player: Player
  selectedAnswerId: string | null
  selectedText: string | null
  submittedTexts: string[]
  correctAnswerId: string | null
  lastResponse: PlayerResponse | null
}

function PlayerResults({ question, player, selectedAnswerId, selectedText, submittedTexts, correctAnswerId, lastResponse }: PlayerResultsProps) {
  const [countdown, setCountdown] = useState(5)
  useEffect(() => {
    const interval = setInterval(() => setCountdown(prev => Math.max(0, prev - 1)), 1000)
    return () => clearInterval(interval)
  }, [])

  const isOpenText = question.question_type === 'open_text'
  const isPoll = question.question_type === 'poll'
  const isCorrect = !isOpenText && !isPoll && selectedAnswerId && correctAnswerId && selectedAnswerId === correctAnswerId
  const correctOption = (!isOpenText && !isPoll) ? question.answer_options.find(o => o.id === correctAnswerId) : null

  const resultIcon = isPoll ? '🗳️' : isOpenText ? '💬' : !selectedAnswerId ? '⏰' : isCorrect ? '🎉' : '😅'
  const resultText = isPoll ? 'Vote counted!' : isOpenText ? 'Answered!' : !selectedAnswerId ? 'Too slow!' : isCorrect ? 'Correct!' : 'Wrong!'
  const resultColor = isPoll ? 'text-blue-300' : isOpenText ? 'text-violet-300' : !selectedAnswerId ? 'text-yellow-400' : isCorrect ? 'text-emerald-400' : 'text-red-400'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm text-center space-y-6 animate-bounce-in">
        {/* Result icon */}
        <div className="text-8xl">{resultIcon}</div>
        <h2 className={`text-4xl font-black ${resultColor}`}>{resultText}</h2>

        {/* Reveal image shown on results (reveal: after) */}
        {question.image_url && question.image_reveal === 'after' && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={question.image_url}
            alt="Reveal"
            className="mx-auto max-h-48 rounded-2xl object-contain shadow-xl"
          />
        )}

        {/* Open text: show all submitted answers */}
        {isOpenText && submittedTexts.length > 0 && (
          <div className="bg-violet-500/20 border border-violet-400/40 rounded-2xl p-4 text-left">
            <p className="text-violet-300 text-sm font-bold mb-2">Your answers</p>
            <ul className="space-y-1">
              {submittedTexts.map((t, i) => (
                <li key={i} className="text-white font-bold text-base">&ldquo;{t}&rdquo;</li>
              ))}
            </ul>
            <p className="text-purple-300 text-sm mt-2">Check the host screen for the word cloud!</p>
          </div>
        )}

        {/* Points earned */}
        {lastResponse && lastResponse.awarded_points > 0 && (
          <div className="card-glass p-4 animate-slide-in-up">
            <p className="text-purple-300 font-semibold">Points earned</p>
            <p className="text-4xl font-black text-yellow-400">+{lastResponse.awarded_points}</p>
            {!isOpenText && lastResponse.response_time_ms < 3000 && (
              <p className="text-emerald-400 text-sm font-bold">⚡ Speed bonus!</p>
            )}
          </div>
        )}

        {/* Correct answer reveal (MC only) */}
        {correctOption && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-4">
            <p className="text-emerald-300 text-sm font-bold mb-1">Correct answer</p>
            <p className="text-white font-extrabold text-lg">{correctOption.answer_text}</p>
          </div>
        )}

        {/* Total score */}
        <div className="card-glass p-4">
          <p className="text-purple-300 font-semibold text-sm">Your total score</p>
          <p className="text-3xl font-black text-white">{player.total_score.toLocaleString()}</p>
          <p className="text-purple-400 text-xs">pts</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-purple-300/70 text-sm font-semibold">Leaderboard in</p>
          <p className="text-4xl font-black text-white">{countdown}</p>
        </div>
      </div>
    </div>
  )
}

interface PlayerLeaderboardProps {
  leaderboard: LeaderboardEntry[]
  player: Player
}

function PlayerLeaderboard({ leaderboard, player }: PlayerLeaderboardProps) {
  const [countdown, setCountdown] = useState(8)
  useEffect(() => {
    const interval = setInterval(() => setCountdown(prev => Math.max(0, prev - 1)), 1000)
    return () => clearInterval(interval)
  }, [])

  const myEntry = leaderboard.find(e => e.player_id === player.id)
  const top5 = leaderboard.slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center animate-slide-in-down">
          <h2 className="text-4xl font-black text-white mb-1">Leaderboard</h2>
          <p className="text-purple-300 font-semibold">After this question</p>
        </div>

        {/* My position highlight */}
        {myEntry && (
          <div className="flex items-center gap-3 bg-yellow-400/20 border-2 border-yellow-400/50 rounded-2xl p-4 animate-bounce-in">
            <span className="text-2xl font-black text-yellow-400">#{myEntry.rank}</span>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black text-white shadow border-2 border-white/30"
              style={{ backgroundColor: player.avatar_color }}
            >
              {player.display_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-black text-white">{player.display_name} <span className="text-yellow-400">(you)</span></p>
              <p className="text-yellow-300 font-bold text-sm">{myEntry.total_score.toLocaleString()} pts</p>
            </div>
            {myEntry.score_change && myEntry.score_change > 0 && (
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">+{myEntry.score_change}</span>
            )}
          </div>
        )}

        {/* Top 5 */}
        <div className="space-y-2">
          {top5.map((entry, i) => {
            const medals = ['🥇', '🥈', '🥉']
            const isMe = entry.player_id === player.id
            return (
              <div
                key={entry.player_id}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  isMe ? 'bg-yellow-400/20 ring-1 ring-yellow-400/50' : 'bg-white/10'
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="w-8 text-center text-lg">{medals[i] ?? `#${entry.rank}`}</span>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white shadow"
                  style={{ backgroundColor: entry.avatar_color }}
                >
                  {entry.display_name.charAt(0).toUpperCase()}
                </div>
                <span className={`flex-1 font-bold truncate ${isMe ? 'text-yellow-300' : 'text-white'}`}>
                  {entry.display_name}
                </span>
                <span className="font-extrabold text-white tabular-nums">{entry.total_score.toLocaleString()}</span>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-purple-300/70 text-sm font-semibold">Next question in</p>
          <p className="text-4xl font-black text-white">{countdown}</p>
        </div>
      </div>
    </div>
  )
}

interface PlayerFinishedProps {
  leaderboard: LeaderboardEntry[]
  player: Player
  session: GameSession
}

function PlayerFinished({ leaderboard, player, session }: PlayerFinishedProps) {
  const myEntry = leaderboard.find(e => e.player_id === player.id)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="text-7xl animate-bounce-in">
          {myEntry?.rank === 1 ? '🏆' : myEntry?.rank === 2 ? '🥈' : myEntry?.rank === 3 ? '🥉' : '🎉'}
        </div>

        <div className="animate-slide-in-up">
          <h1 className="text-4xl font-black text-white mb-1">Game Over!</h1>
          {myEntry && (
            <p className="text-xl font-bold text-purple-200">
              You finished #{myEntry.rank}!
            </p>
          )}
        </div>

        {myEntry && (
          <div className="card-glass p-6 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <div
              className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-black text-white shadow-xl border-4 border-white/30"
              style={{ backgroundColor: player.avatar_color }}
            >
              {player.display_name.charAt(0).toUpperCase()}
            </div>
            <p className="text-white font-extrabold text-xl mb-1">{player.display_name}</p>
            <p className="text-5xl font-black text-yellow-400 my-2">{myEntry.total_score.toLocaleString()}</p>
            <p className="text-purple-300 font-semibold">final points</p>
          </div>
        )}

        {/* Top 3 podium */}
        {leaderboard.length > 0 && (
          <div className="card-glass p-4 space-y-2 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-extrabold text-white mb-3">Final Standings</h3>
            {leaderboard.slice(0, 5).map((entry, i) => {
              const medals = ['🥇', '🥈', '🥉']
              const isMe = entry.player_id === player.id
              return (
                <div key={entry.player_id} className={`flex items-center gap-3 p-2 rounded-xl ${isMe ? 'bg-yellow-400/20' : 'bg-white/5'}`}>
                  <span className="w-7 text-sm text-center">{medals[i] ?? `#${entry.rank}`}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ backgroundColor: entry.avatar_color }}
                  >
                    {entry.display_name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`flex-1 font-bold text-sm truncate ${isMe ? 'text-yellow-300' : 'text-white'}`}>
                    {entry.display_name}{isMe ? ' (you)' : ''}
                  </span>
                  <span className="font-extrabold text-sm text-white tabular-nums">{entry.total_score.toLocaleString()}</span>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex flex-col gap-3 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => router.push(`/results/${session.id}`)}
            className="btn-primary w-full"
          >
            📊 Full Results
          </button>
          <button
            onClick={() => router.push('/join')}
            className="btn-outline w-full text-lg py-3"
          >
            Play Another Game
          </button>
        </div>
      </div>
    </div>
  )
}

// --------------- Main Page ---------------

export default function PlayPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string

  const [player, setPlayer] = useState<Player | null>(null)
  const [session, setSession] = useState<GameSession | null>(null)
  const [question, setQuestion] = useState<PublicQuestion | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [correctAnswerId, setCorrectAnswerId] = useState<string | null>(null)
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [submittedTexts, setSubmittedTexts] = useState<string[]>([])
  const [lastResponse, setLastResponse] = useState<PlayerResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastQuestionIndexRef = useRef<number>(-1)

  // Load player data from localStorage and verify
  useEffect(() => {
    const raw = localStorage.getItem(`playerData_${gameId}`)
    if (!raw) {
      router.replace(`/join?code=&returnTo=/play/${gameId}`)
      return
    }

    let playerData: { playerId: string; displayName: string; avatarColor: string }
    try {
      playerData = JSON.parse(raw)
    } catch {
      router.replace(`/join?returnTo=/play/${gameId}`)
      return
    }

    fetchGameState(playerData.playerId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId])

  const fetchGameState = useCallback(async (playerId: string) => {
    try {
      const res = await fetch(`/api/game/${gameId}/state?playerId=${playerId}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError('Game not found.')
          return
        }
        throw new Error('Failed to fetch game state')
      }

      const data = await res.json()
      const currentSession = data.session as GameSession
      setSession(currentSession)
      setQuestion(data.question ?? null)
      setLeaderboard(data.leaderboard ?? [])
      setCorrectAnswerId(data.correctAnswerId ?? null)

      // Build player object from stored data + fresh scores
      const raw = localStorage.getItem(`playerData_${gameId}`)
      if (raw) {
        const stored = JSON.parse(raw)
        const playerFromState = (data.players as Player[])?.find(p => p.id === stored.playerId)
        if (playerFromState) {
          setPlayer(playerFromState)
        } else {
          // Player not in list yet — create placeholder
          setPlayer({
            id: stored.playerId,
            game_session_id: gameId,
            display_name: stored.displayName,
            total_score: 0,
            avatar_color: stored.avatarColor,
            joined_at: new Date().toISOString(),
          })
        }
      }

      // Reset selection if question changed
      if (currentSession.current_question_index !== lastQuestionIndexRef.current) {
        lastQuestionIndexRef.current = currentSession.current_question_index
        setSelectedAnswerId(null)
        setSelectedText(null)
        setSubmittedTexts([])
        setLastResponse(null)
        setIsSubmitting(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game')
    } finally {
      setIsLoading(false)
    }
  }, [gameId])

  // Subscribe to Supabase Realtime
  useEffect(() => {
    const raw = localStorage.getItem(`playerData_${gameId}`)
    if (!raw) return

    let playerId: string
    try {
      playerId = JSON.parse(raw).playerId
    } catch {
      return
    }

    const supabase = createClient()

    // Subscribe to game_sessions changes
    const sessionChannel = supabase
      .channel(`player-session:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${gameId}`,
        },
        () => {
          fetchGameState(playerId)
        }
      )
      .subscribe()

    // Subscribe to own player_responses (to detect answer confirmation)
    const responseChannel = supabase
      .channel(`player-responses:${playerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'player_responses',
          filter: `player_id=eq.${playerId}`,
        },
        (payload) => {
          setLastResponse(payload.new as PlayerResponse)
        }
      )
      .subscribe()

    // Also subscribe to player score updates
    const playerChannel = supabase
      .channel(`player-score:${playerId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'players',
          filter: `id=eq.${playerId}`,
        },
        (payload) => {
          setPlayer(payload.new as Player)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(sessionChannel)
      supabase.removeChannel(responseChannel)
      supabase.removeChannel(playerChannel)
    }
  }, [gameId, fetchGameState])

  // Poll every second during timed states so server-side auto-transitions fire promptly
  useEffect(() => {
    const timedStates = ['section_intro', 'question_active', 'question_results', 'leaderboard']
    if (!session?.game_state || !timedStates.includes(session.game_state)) return
    const raw = localStorage.getItem(`playerData_${gameId}`)
    if (!raw) return
    let playerId: string
    try {
      playerId = JSON.parse(raw).playerId
    } catch {
      return
    }
    const interval = setInterval(() => fetchGameState(playerId), 1000)
    return () => clearInterval(interval)
  }, [session?.game_state, gameId, fetchGameState])

  async function submitAnswer(answerId: string) {
    if (isSubmitting || !session?.question_started_at) return

    const playerId = JSON.parse(localStorage.getItem(`playerData_${gameId}`) || '{}').playerId
    if (!playerId) return

    setSelectedAnswerId(answerId)
    setIsSubmitting(true)

    const responseTimeMs = Date.now() - new Date(session.question_started_at).getTime()

    try {
      const res = await fetch(`/api/game/${gameId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, answerId, responseTimeMs }),
      })

      if (!res.ok) {
        const data = await res.json()
        console.error('Answer submission failed:', data.error)
      }
    } catch (err) {
      console.error('Failed to submit answer:', err)
    }
  }

  async function submitTextAnswer(text: string) {
    if (isSubmitting || !session?.question_started_at) return

    const playerId = JSON.parse(localStorage.getItem(`playerData_${gameId}`) || '{}').playerId
    if (!playerId) return

    setIsSubmitting(true)

    const responseTimeMs = Date.now() - new Date(session.question_started_at).getTime()

    try {
      const res = await fetch(`/api/game/${gameId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, freeTextResponse: text, responseTimeMs }),
      })

      if (res.ok) {
        setSelectedText(text)
        setSubmittedTexts(prev => [...prev, text])
      } else {
        const data = await res.json()
        console.error('Text answer submission failed:', data.error)
      }
    } catch (err) {
      console.error('Failed to submit text answer:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🚀</div>
          <p className="text-2xl font-bold text-white">Joining game...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex items-center justify-center px-4">
        <div className="card-glass p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button onClick={() => router.push('/join')} className="btn-primary w-full">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!session || !player) return null

  const gameState = session.game_state

  if (session.is_paused) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center gap-4">
        <div className="text-8xl">⏸</div>
        <h2 className="text-4xl font-extrabold text-white tracking-wide">Game Paused</h2>
        <p className="text-white/50 text-lg">The host will resume shortly…</p>
      </div>
    )
  }

  if (gameState === 'lobby') {
    return <PlayerLobby session={session} player={player} />
  }

  if (gameState === 'section_intro') {
    const sectionTitle = question?.section_title ?? 'Next Section'
    return <PlayerSectionIntro sectionTitle={sectionTitle} />
  }

  if (gameState === 'question_active') {
    if (!question) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex items-center justify-center">
          <WaitingSpinner message="Loading question..." />
        </div>
      )
    }

    if (selectedAnswerId || (selectedText && question.question_type !== 'open_text')) {
      return <PlayerAnswered question={question} player={player} selectedAnswerId={selectedAnswerId} selectedText={selectedText} />
    }

    return (
      <PlayerQuestion
        session={session}
        question={question}
        player={player}
        onAnswer={submitAnswer}
        onTextAnswer={submitTextAnswer}
        isSubmitting={isSubmitting}
        submittedTexts={submittedTexts}
      />
    )
  }

  if (gameState === 'question_results') {
    if (!question) return null
    return (
      <PlayerResults
        question={question}
        player={player}
        selectedAnswerId={selectedAnswerId}
        selectedText={selectedText}
        submittedTexts={submittedTexts}
        correctAnswerId={correctAnswerId}
        lastResponse={lastResponse}
      />
    )
  }

  if (gameState === 'leaderboard') {
    return <PlayerLeaderboard leaderboard={leaderboard} player={player} />
  }

  if (gameState === 'finished') {
    return <PlayerFinished leaderboard={leaderboard} player={player} session={session} />
  }

  return null
}
