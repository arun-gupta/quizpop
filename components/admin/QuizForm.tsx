'use client'

import { useState } from 'react'
import type { QuizWithQuestions } from '@/types/database'

interface AnswerOptionInput {
  answer_text: string
  is_correct: boolean
  display_order: number
}

interface QuestionInput {
  question_text: string
  image_url: string
  timer_seconds: number
  points: number
  display_order: number
  answer_options: AnswerOptionInput[]
}

interface QuizFormProps {
  quiz?: QuizWithQuestions
  onSuccess: () => void
  onCancel: () => void
}

const DEFAULT_ANSWER_OPTIONS: AnswerOptionInput[] = [
  { answer_text: '', is_correct: true, display_order: 0 },
  { answer_text: '', is_correct: false, display_order: 1 },
  { answer_text: '', is_correct: false, display_order: 2 },
  { answer_text: '', is_correct: false, display_order: 3 },
]

function makeDefaultQuestion(order: number): QuestionInput {
  return {
    question_text: '',
    image_url: '',
    timer_seconds: 20,
    points: 1000,
    display_order: order,
    answer_options: DEFAULT_ANSWER_OPTIONS.map((a) => ({ ...a })),
  }
}

function initQuestionsFromQuiz(quiz: QuizWithQuestions): QuestionInput[] {
  return quiz.questions.map((q) => ({
    question_text: q.question_text,
    image_url: q.image_url ?? '',
    timer_seconds: q.timer_seconds,
    points: q.points,
    display_order: q.display_order,
    answer_options: q.answer_options.map((a) => ({
      answer_text: a.answer_text,
      is_correct: a.is_correct,
      display_order: a.display_order,
    })),
  }))
}

export default function QuizForm({ quiz, onSuccess, onCancel }: QuizFormProps) {
  const isEditing = Boolean(quiz)

  const [title, setTitle] = useState(quiz?.title ?? '')
  const [description, setDescription] = useState(quiz?.description ?? '')
  const [questions, setQuestions] = useState<QuestionInput[]>(
    quiz ? initQuestionsFromQuiz(quiz) : [makeDefaultQuestion(1)]
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Question helpers ────────────────────────────────────────────────────────
  function addQuestion() {
    setQuestions((prev) => [...prev, makeDefaultQuestion(prev.length + 1)])
  }

  function removeQuestion(index: number) {
    if (questions.length <= 1) return
    setQuestions((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((q, i) => ({ ...q, display_order: i + 1 }))
    )
  }

  function moveQuestion(index: number, direction: 'up' | 'down') {
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= questions.length) return
    setQuestions((prev) => {
      const next = [...prev]
      ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
      return next.map((q, i) => ({ ...q, display_order: i + 1 }))
    })
  }

  function updateQuestion(index: number, updates: Partial<QuestionInput>) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...updates } : q))
    )
  }

  function updateAnswerOption(
    qIndex: number,
    aIndex: number,
    updates: Partial<AnswerOptionInput>
  ) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q
        return {
          ...q,
          answer_options: q.answer_options.map((a, j) => (j === aIndex ? { ...a, ...updates } : a)),
        }
      })
    )
  }

  function setCorrectAnswer(qIndex: number, aIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q
        return {
          ...q,
          answer_options: q.answer_options.map((a, j) => ({ ...a, is_correct: j === aIndex })),
        }
      })
    )
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        questions: questions.map((q) => ({
          question_text: q.question_text.trim(),
          image_url: q.image_url.trim() || undefined,
          timer_seconds: q.timer_seconds,
          points: q.points,
          display_order: q.display_order,
          answer_options: q.answer_options.map((a) => ({
            answer_text: a.answer_text.trim(),
            is_correct: a.is_correct,
            display_order: a.display_order,
          })),
        })),
      }

      const url = isEditing ? `/api/admin/quizzes/${quiz!.id}` : '/api/admin/quizzes'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to save quiz')
        return
      }

      onSuccess()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const TIMER_OPTIONS = [15, 20, 30]
  const POINTS_OPTIONS = [500, 1000, 2000]
  const ANSWER_COLORS = [
    'bg-red-900/40 border-red-800',
    'bg-blue-900/40 border-blue-800',
    'bg-green-900/40 border-green-800',
    'bg-yellow-900/40 border-yellow-800',
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error */}
      {error && (
        <div className="bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Quiz meta */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Quiz Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Birthday Party Trivia"
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Description <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="A short description of your quiz…"
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-200">
            Questions <span className="text-gray-500">({questions.length})</span>
          </h3>
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-violet-700 hover:bg-violet-600 text-white rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </button>
        </div>

        {questions.map((q, qi) => (
          <div key={qi} className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-4">
            {/* Question header */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-violet-400 bg-violet-950 px-2.5 py-0.5 rounded-full">
                Q{qi + 1}
              </span>

              {/* Reorder controls */}
              <div className="flex items-center gap-1 ml-auto">
                <button
                  type="button"
                  onClick={() => moveQuestion(qi, 'up')}
                  disabled={qi === 0}
                  className="p-1 text-gray-500 hover:text-gray-300 disabled:opacity-30 transition-colors"
                  title="Move up"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveQuestion(qi, 'down')}
                  disabled={qi === questions.length - 1}
                  className="p-1 text-gray-500 hover:text-gray-300 disabled:opacity-30 transition-colors"
                  title="Move down"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => removeQuestion(qi)}
                  disabled={questions.length <= 1}
                  className="p-1 text-gray-500 hover:text-red-400 disabled:opacity-30 transition-colors"
                  title="Remove question"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Question text */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Question Text <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={q.question_text}
                onChange={(e) => updateQuestion(qi, { question_text: e.target.value })}
                placeholder="Enter your question…"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Image URL <span className="text-gray-600">(optional)</span>
              </label>
              <input
                type="url"
                value={q.image_url}
                onChange={(e) => updateQuestion(qi, { image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Timer + Points */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Timer</label>
                <select
                  value={q.timer_seconds}
                  onChange={(e) => updateQuestion(qi, { timer_seconds: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {TIMER_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}s</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Points</label>
                <select
                  value={q.points}
                  onChange={(e) => updateQuestion(qi, { points: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {POINTS_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p.toLocaleString()} pts</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Answer options */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Answer Options <span className="text-gray-500">(select the correct one)</span>
              </label>
              <div className="space-y-2">
                {q.answer_options.map((a, ai) => (
                  <div
                    key={ai}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${ANSWER_COLORS[ai]} transition-colors`}
                  >
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={a.is_correct}
                      onChange={() => setCorrectAnswer(qi, ai)}
                      className="w-4 h-4 accent-violet-500 shrink-0"
                      title="Mark as correct answer"
                    />
                    <input
                      type="text"
                      required
                      value={a.answer_text}
                      onChange={(e) => updateAnswerOption(qi, ai, { answer_text: e.target.value })}
                      placeholder={`Option ${ai + 1}`}
                      className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                    />
                    {a.is_correct && (
                      <span className="text-xs text-green-400 font-medium shrink-0">Correct</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {submitting
            ? isEditing ? 'Saving…' : 'Creating…'
            : isEditing ? 'Save Changes' : 'Create Quiz'}
        </button>
      </div>
    </form>
  )
}
