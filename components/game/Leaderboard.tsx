import { LeaderboardEntry } from '@/types/database'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  highlightPlayerId?: string
  showTop?: number
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard({
  entries,
  highlightPlayerId,
  showTop,
}: LeaderboardProps) {
  const displayed = showTop ? entries.slice(0, showTop) : entries

  return (
    <div className="w-full space-y-2">
      {displayed.map((entry, i) => {
        const isHighlighted = entry.player_id === highlightPlayerId
        const medal = MEDALS[i] ?? null
        const initial = entry.display_name.charAt(0).toUpperCase()

        return (
          <div
            key={entry.player_id}
            className={[
              'flex items-center gap-4 px-4 py-3 rounded-2xl',
              'transition-all duration-300',
              isHighlighted
                ? 'bg-yellow-400/30 ring-2 ring-yellow-400 scale-[1.02]'
                : 'bg-white/10',
            ].join(' ')}
            style={{
              animationDelay: `${i * 80}ms`,
              animation: 'slideInRight 0.4s ease-out both',
            }}
          >
            {/* Rank */}
            <div className="w-10 text-center flex-shrink-0">
              {medal ? (
                <span className="text-2xl">{medal}</span>
              ) : (
                <span className="text-lg font-bold text-white/60">
                  {entry.rank}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md"
              style={{ backgroundColor: entry.avatar_color }}
            >
              {initial}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p
                className={[
                  'font-bold text-base truncate',
                  isHighlighted ? 'text-yellow-300' : 'text-white',
                ].join(' ')}
              >
                {entry.display_name}
                {isHighlighted && (
                  <span className="ml-2 text-xs font-normal text-yellow-400">
                    (you)
                  </span>
                )}
              </p>
            </div>

            {/* Score */}
            <div className="flex-shrink-0 text-right">
              <span
                className={[
                  'text-lg font-extrabold tabular-nums',
                  isHighlighted ? 'text-yellow-300' : 'text-white',
                ].join(' ')}
              >
                {entry.total_score.toLocaleString()}
              </span>
              <p className="text-xs text-white/50 font-normal">pts</p>
            </div>

            {/* Score change badge */}
            {entry.score_change !== undefined && entry.score_change > 0 && (
              <div className="flex-shrink-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                +{entry.score_change}
              </div>
            )}
          </div>
        )
      })}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
