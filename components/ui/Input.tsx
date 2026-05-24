import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export default function Input({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-white/80"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={[
          'w-full px-4 py-3 rounded-xl',
          'bg-white/10 backdrop-blur-sm',
          'text-white placeholder:text-white/40',
          'border transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30'
            : 'border-white/20 focus:border-purple-400 focus:ring-purple-400/30 hover:border-white/40',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'font-medium text-base',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        {...props}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-red-400 text-sm font-medium flex items-center gap-1.5"
          role="alert"
        >
          <svg
            className="h-4 w-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-white/40 text-sm">
          {hint}
        </p>
      )}
    </div>
  )
}
