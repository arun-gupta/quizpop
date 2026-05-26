'use client'

import type { WordCloudEntry } from '@/types/database'

const COLORS = [
  '#818cf8', '#f472b6', '#34d399', '#fbbf24',
  '#60a5fa', '#a78bfa', '#fb923c', '#4ade80',
  '#f87171', '#38bdf8', '#e879f9', '#86efac',
]

export default function WordCloud({ entries }: { entries: WordCloudEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="text-center text-white/40 py-12 text-lg font-semibold">
        No responses yet
      </div>
    )
  }

  const maxCount = Math.max(...entries.map(e => e.count))

  // Scale font: 1.1rem (single response) up to 3.8rem (top response)
  const fontSize = (count: number) => 1.1 + (count / maxCount) * 2.7

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-4 justify-center items-center p-6">
      {entries.map((entry, i) => (
        <span
          key={entry.text}
          className="font-extrabold leading-tight transition-all"
          style={{
            fontSize: `${fontSize(entry.count)}rem`,
            color: COLORS[i % COLORS.length],
          }}
          title={`${entry.count} player${entry.count === 1 ? '' : 's'}`}
        >
          {entry.text}
          <span
            className="text-white/50 font-bold ml-1"
            style={{ fontSize: '0.55em' }}
          >
            {entry.count}
          </span>
        </span>
      ))}
    </div>
  )
}
