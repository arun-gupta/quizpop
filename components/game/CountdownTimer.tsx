'use client'

interface CountdownTimerProps {
  seconds: number
  totalSeconds: number
  size?: 'sm' | 'lg'
}

export default function CountdownTimer({ seconds, totalSeconds, size = 'lg' }: CountdownTimerProps) {
  const isLarge = size === 'lg'
  const dimension = isLarge ? 120 : 72
  const strokeWidth = isLarge ? 8 : 5
  const radius = (dimension - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const center = dimension / 2

  const fraction = totalSeconds > 0 ? seconds / totalSeconds : 0
  const dashOffset = circumference * (1 - fraction)

  const percentage = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0
  let strokeColor = '#22c55e' // green
  if (percentage <= 25) {
    strokeColor = '#ef4444' // red
  } else if (percentage <= 50) {
    strokeColor = '#eab308' // yellow
  }

  const fontSize = isLarge ? 'text-3xl' : 'text-xl'
  const fontWeight = 'font-bold'

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <svg
        width={dimension}
        height={dimension}
        className="-rotate-90"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
          }}
        />
      </svg>
      <span
        className={`relative z-10 ${fontSize} ${fontWeight} text-white tabular-nums`}
        style={{ lineHeight: 1 }}
      >
        {Math.max(0, Math.ceil(seconds))}
      </span>
    </div>
  )
}
