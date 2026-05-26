'use client'

import { useState, useRef } from 'react'
import { parseQuizMarkdown } from '@/lib/quiz-markdown'
import type { ParsedQuiz, ParsedQuestion } from '@/lib/quiz-markdown'

const ANSWER_CONFIG = [
  { bg: 'bg-red-500',    emoji: '▲' },
  { bg: 'bg-blue-500',   emoji: '◆' },
  { bg: 'bg-yellow-500', emoji: '●' },
  { bg: 'bg-green-500',  emoji: '■' },
]

function resolveImageUrl(imageUrl: string | undefined, bucket: string | undefined): string | null {
  if (!imageUrl) return null
  if (imageUrl.startsWith('https://')) return imageUrl
  if (bucket) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    return `${base}/storage/v1/object/public/${bucket}/${imageUrl}`
  }
  return null
}

function QuestionImage({ rawValue, bucket }: { rawValue: string | undefined, bucket?: string }) {
  const [failed, setFailed] = useState(false)
  const url = resolveImageUrl(rawValue, bucket)

  if (!rawValue) return null

  if (!url || failed) {
    return (
      <div className="flex justify-center flex-shrink-0">
        <div className="h-52 w-full max-w-lg rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 bg-white/5">
          <span className="text-4xl">🖼️</span>
          <p className="text-white/40 text-sm font-semibold">
            {url ? 'Image not found' : 'No bucket configured'}
          </p>
          <p className="text-white/25 text-xs font-mono">{rawValue}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center flex-shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Question image"
        onError={() => setFailed(true)}
        className="h-52 max-w-lg w-full rounded-2xl object-cover shadow-xl"
      />
    </div>
  )
}

function QuestionCard({ question, index, total, bucket }: {
  question: ParsedQuestion
  index: number
  total: number
  bucket?: string
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col font-[var(--font-nunito)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 pt-6 pb-2">
        <div className="text-white/60 text-xl font-semibold">
          Question #{index + 1} <span className="text-white/30">of {total}</span>
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-purple-400 flex items-center justify-center">
          <span className="text-white text-2xl font-extrabold">{question.timer_seconds}</span>
        </div>
        <div className="text-white/60 text-xl font-semibold">
          {question.points.toLocaleString()} pts
        </div>
      </div>

      {/* Question body */}
      <div className="flex-1 flex flex-col px-8 py-4 gap-4">
        {question.section_title && (
          <div className="flex justify-center">
            <span className="bg-white/10 border border-white/20 text-white/60 text-sm font-semibold tracking-widest uppercase px-5 py-1.5 rounded-full">
              {question.section_title}
            </span>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
          <p className="text-white text-3xl font-bold text-center leading-snug">
            {question.question_text}
          </p>
        </div>

        <QuestionImage rawValue={question.image_url} bucket={bucket} />

        {question.image_url && question.image_reveal === 'after' && (
          <div className="flex justify-center flex-shrink-0">
            <div className="h-10 w-full max-w-lg rounded-xl border border-dashed border-yellow-400/50 flex items-center justify-center gap-2 bg-yellow-900/20">
              <span className="text-yellow-400 text-xs font-semibold">🖼️ Image reveals after answer</span>
            </div>
          </div>
        )}

        {question.question_type === 'open_text' ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 text-center w-full max-w-lg">
              <p className="text-white/50 text-lg font-semibold mb-2">Open-ended question</p>
              <p className="text-white/30 text-sm">Players type their answer</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 flex-1">
            {question.answer_options.map((opt, i) => {
              const cfg = ANSWER_CONFIG[i % 4]
              return (
                <div
                  key={i}
                  className={[
                    'rounded-2xl p-4 flex items-center gap-4 shadow-lg relative',
                    cfg.bg,
                    opt.is_correct ? 'ring-4 ring-white ring-offset-2 ring-offset-transparent' : '',
                  ].join(' ')}
                >
                  <span className="text-white text-3xl w-10 text-center flex-shrink-0">{cfg.emoji}</span>
                  <span className="text-white text-xl font-bold leading-snug">{opt.answer_text}</span>
                  {opt.is_correct && (
                    <span className="absolute top-2 right-3 text-white text-lg">✓</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PreviewPage() {
  const [markdown, setMarkdown] = useState('')
  const [quiz, setQuiz] = useState<ParsedQuiz | null>(null)
  const [qIndex, setQIndex] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  const parse = (md: string) => {
    const result = parseQuizMarkdown(md)
    setQuiz(result)
    setQIndex(0)
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setMarkdown(text)
    parse(text)
  }

  const question = quiz?.questions[qIndex] ?? null

  if (quiz && quiz.errors.length === 0 && question) {
    return (
      <div className="relative">
        <QuestionCard question={question} index={qIndex} total={quiz.questions.length} bucket={quiz.bucket} />

        {/* Navigation overlay */}
        <div className="fixed bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm px-6 py-3 flex items-center justify-between gap-4 z-10">
          <button
            onClick={() => setQIndex(i => Math.max(0, i - 1))}
            disabled={qIndex === 0}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-semibold transition-colors"
          >
            ← Prev
          </button>

          <div className="flex items-center gap-2 overflow-x-auto max-w-xl">
            {quiz.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setQIndex(i)}
                className={[
                  'w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 transition-colors',
                  i === qIndex ? 'bg-purple-400 text-white' : 'bg-white/20 text-white/60 hover:bg-white/30',
                ].join(' ')}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setQuiz(null); setMarkdown('') }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 text-sm font-semibold transition-colors"
            >
              ✕ Close
            </button>
            <button
              onClick={() => setQIndex(i => Math.min(quiz.questions.length - 1, i + 1))}
              disabled={qIndex === quiz.questions.length - 1}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-semibold transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex flex-col items-center justify-center p-8 font-[var(--font-nunito)]">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Quiz Preview</h1>
          <p className="text-white/50 text-sm">Renders your markdown exactly as it will look in-game</p>
        </div>

        {/* Upload */}
        <div>
          <input ref={fileRef} type="file" accept=".md,.txt" className="hidden" onChange={handleFile} />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-white/30 hover:border-purple-400 rounded-2xl p-6 text-center transition-colors cursor-pointer"
          >
            <p className="text-white font-semibold">Click to upload a .md file</p>
            <p className="text-white/40 text-sm mt-1">or paste below</p>
          </button>
        </div>

        {/* Paste */}
        <textarea
          value={markdown}
          onChange={e => { setMarkdown(e.target.value); setQuiz(null) }}
          placeholder="# My Quiz&#10;> bucket: quiz-images/folder&#10;&#10;## Section&#10;&#10;### Question text?&#10;- [ ] Wrong&#10;- [x] Right"
          rows={8}
          className="bg-black/30 border border-white/20 rounded-xl p-4 text-sm text-white font-mono resize-none focus:outline-none focus:border-purple-400 placeholder:text-white/20"
        />

        {/* Errors */}
        {quiz && quiz.errors.length > 0 && (
          <div className="bg-red-900/40 border border-red-500/50 rounded-xl p-4 space-y-1">
            <p className="text-red-400 font-semibold text-sm">{quiz.errors.length} error{quiz.errors.length > 1 ? 's' : ''}</p>
            {quiz.errors.map((e, i) => <p key={i} className="text-red-300 text-xs pl-2">{e}</p>)}
          </div>
        )}

        <button
          onClick={() => parse(markdown)}
          disabled={!markdown.trim()}
          className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-lg font-extrabold transition-colors"
        >
          Preview Quiz →
        </button>
      </div>
    </div>
  )
}
