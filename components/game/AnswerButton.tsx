'use client'

import { PublicAnswerOption } from '@/types/database'

interface AnswerButtonProps {
  option: PublicAnswerOption
  index: number
  disabled: boolean
  selected: boolean
  revealed: boolean
  isCorrect: boolean
  onClick: () => void
}

const ANSWER_CONFIG = [
  { bg: 'bg-red-500', hover: 'hover:bg-red-400', emoji: '▲', label: 'Red' },
  { bg: 'bg-blue-500', hover: 'hover:bg-blue-400', emoji: '◆', label: 'Blue' },
  { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-400', emoji: '●', label: 'Yellow' },
  { bg: 'bg-green-500', hover: 'hover:bg-green-400', emoji: '■', label: 'Green' },
] as const

export default function AnswerButton({
  option,
  index,
  disabled,
  selected,
  revealed,
  isCorrect,
  onClick,
}: AnswerButtonProps) {
  const config = ANSWER_CONFIG[index % 4]

  let bgClass = `${config.bg} ${!disabled ? config.hover : ''}`
  let opacity = ''
  let ring = ''
  let icon: React.ReactNode = (
    <span className="text-2xl leading-none">{config.emoji}</span>
  )

  if (revealed) {
    if (isCorrect) {
      bgClass = 'bg-green-500'
      ring = 'ring-4 ring-white ring-offset-2 ring-offset-transparent'
      icon = <span className="text-2xl leading-none">✓</span>
    } else if (selected) {
      bgClass = 'bg-gray-600'
      icon = <span className="text-2xl leading-none">✗</span>
    } else {
      bgClass = 'bg-gray-700'
      opacity = 'opacity-50'
      icon = <span className="text-2xl leading-none">{config.emoji}</span>
    }
  } else if (selected) {
    ring = 'ring-4 ring-white ring-offset-2 ring-offset-transparent'
    opacity = ''
  } else if (disabled) {
    opacity = 'opacity-60'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'relative flex items-center gap-3 w-full h-full min-h-[80px] px-4 py-3',
        'rounded-2xl text-white font-bold text-left',
        'transition-all duration-200',
        'shadow-lg active:scale-95',
        bgClass,
        opacity,
        ring,
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`${config.label}: ${option.answer_text}`}
    >
      <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-black/20">
        {icon}
      </span>
      <span className="text-base sm:text-lg leading-snug break-words min-w-0">
        {option.answer_text}
      </span>
      {selected && !revealed && (
        <span className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse" />
      )}
    </button>
  )
}
