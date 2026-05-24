import type { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export default function MetricCard({ title, value, subtitle, icon, trend }: MetricCardProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-500',
  }

  const trendIcons = {
    up: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: null,
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        {icon && (
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-700 text-gray-300">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
        {trend && trend !== 'neutral' && (
          <span className={`flex items-center gap-1 text-xs font-medium mb-1 ${trendColors[trend]}`}>
            {trendIcons[trend]}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}
    </div>
  )
}
