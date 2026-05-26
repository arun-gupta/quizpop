'use client'

import { useRouter } from 'next/navigation'
import { LeaderboardEntry, GameSession } from '@/types/database'
import Leaderboard from '@/components/game/Leaderboard'
import Confetti from '@/components/game/Confetti'

interface HostFinishedProps {
  entries: LeaderboardEntry[]
  session: GameSession
}

interface PodiumSpotProps {
  entry: LeaderboardEntry
  place: 1 | 2 | 3
  animationDelay: string
}

function PodiumSpot({ entry, place, animationDelay }: PodiumSpotProps) {
  const configs = {
    1: {
      medal: '🥇',
      platformHeight: 'h-28',
      platformColor: 'bg-yellow-500/80 border-yellow-400/60',
      avatarSize: 'w-20 h-20 text-3xl',
      nameColor: 'text-yellow-300',
      scoreColor: 'text-yellow-400/80',
      fontSize: 'text-base',
      medalSize: 'text-5xl',
      numberSize: 'text-3xl',
      platformWidth: 'w-28',
    },
    2: {
      medal: '🥈',
      platformHeight: 'h-20',
      platformColor: 'bg-slate-400/80 border-slate-300/60',
      avatarSize: 'w-16 h-16 text-2xl',
      nameColor: 'text-white',
      scoreColor: 'text-white/60',
      fontSize: 'text-sm',
      medalSize: 'text-4xl',
      numberSize: 'text-2xl',
      platformWidth: 'w-24',
    },
    3: {
      medal: '🥉',
      platformHeight: 'h-12',
      platformColor: 'bg-amber-700/80 border-amber-600/60',
      avatarSize: 'w-14 h-14 text-xl',
      nameColor: 'text-white',
      scoreColor: 'text-white/60',
      fontSize: 'text-sm',
      medalSize: 'text-3xl',
      numberSize: 'text-xl',
      platformWidth: 'w-20',
    },
  }
  const c = configs[place]

  return (
    <div
      className="flex flex-col items-center"
      style={{ animation: `podiumRise 0.6s cubic-bezier(0.34,1.56,0.64,1) ${animationDelay} both` }}
    >
      <div className={`${c.medalSize} mb-1`}>{c.medal}</div>
      <div
        className={`${c.avatarSize} rounded-full flex items-center justify-center font-extrabold text-white shadow-xl mb-1`}
        style={{ backgroundColor: entry.avatar_color }}
      >
        {entry.display_name.charAt(0).toUpperCase()}
      </div>
      <p className={`${c.nameColor} font-extrabold ${c.fontSize} text-center mb-0.5 max-w-[100px] truncate`}>
        {entry.display_name}
      </p>
      <p className={`${c.scoreColor} text-xs mb-2 font-semibold`}>
        {entry.total_score.toLocaleString()} pts
      </p>
      <div
        className={`${c.platformWidth} ${c.platformHeight} ${c.platformColor} border rounded-t-xl flex items-center justify-center`}
      >
        <span className={`text-white font-extrabold ${c.numberSize}`}>{place}</span>
      </div>
    </div>
  )
}

export default function HostFinished({ entries, session }: HostFinishedProps) {
  const router = useRouter()
  const [first, second, third] = [entries[0] ?? null, entries[1] ?? null, entries[2] ?? null]
  const rest = entries.slice(3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col font-[var(--font-nunito)]">
      <Confetti />

      {/* Header */}
      <div
        className="text-center pt-10 pb-4 px-8"
        style={{ animation: 'fadeInDown 0.5s ease-out both' }}
      >
        <h1 className="text-6xl font-extrabold text-white tracking-wide drop-shadow-2xl">
          🎉 GAME OVER! 🎉
        </h1>
        <p className="text-white/50 text-lg mt-1">
          {entries.length} player{entries.length !== 1 ? 's' : ''} · {session.current_question_index + 1} questions
        </p>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 px-8 mt-4 mb-2">
        {/* 2nd — left */}
        {second ? (
          <PodiumSpot entry={second} place={2} animationDelay="0.9s" />
        ) : (
          <div className="w-24" />
        )}

        {/* 1st — centre, tallest, last to animate */}
        {first && (
          <PodiumSpot entry={first} place={1} animationDelay="1.5s" />
        )}

        {/* 3rd — right, first to animate */}
        {third ? (
          <PodiumSpot entry={third} place={3} animationDelay="0.3s" />
        ) : (
          <div className="w-20" />
        )}
      </div>

      {/* Rest of leaderboard (4th+) */}
      {rest.length > 0 && (
        <div className="px-8 max-w-2xl mx-auto w-full mt-6">
          <h2 className="text-white/40 text-sm font-semibold uppercase tracking-widest text-center mb-3">
            Also Played
          </h2>
          <Leaderboard entries={rest} showTop={rest.length} />
        </div>
      )}

      {/* Play Again */}
      <div className="px-8 py-8 flex justify-center mt-auto">
        <button
          onClick={() => router.push('/host')}
          className="px-12 py-5 rounded-2xl text-white text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-violet-400 hover:from-purple-400 hover:to-violet-300 hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xl cursor-pointer"
        >
          🔄 Play Again
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes podiumRise {
          from { opacity: 0; transform: translateY(60px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
