import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white border border-purple-500 disabled:bg-purple-800 disabled:border-purple-700',
  secondary:
    'bg-transparent hover:bg-white/10 active:bg-white/20 text-white border border-white/40 disabled:opacity-40',
  danger:
    'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white border border-red-500 disabled:bg-red-800 disabled:border-red-700',
  ghost:
    'bg-transparent hover:bg-white/10 active:bg-white/20 text-white border-transparent disabled:opacity-40',
}

const SIZE_CLASSES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2 text-base rounded-xl gap-2',
  lg: 'px-6 py-3 text-lg rounded-2xl gap-2.5',
  xl: 'px-8 py-4 text-xl rounded-2xl gap-3',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-bold',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent',
        'active:scale-[0.97]',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        'shadow-md hover:shadow-lg',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading && (
        <svg
          className={[
            'animate-spin flex-shrink-0',
            size === 'sm' ? 'h-3.5 w-3.5' : size === 'xl' ? 'h-5 w-5' : 'h-4 w-4',
          ].join(' ')}
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
