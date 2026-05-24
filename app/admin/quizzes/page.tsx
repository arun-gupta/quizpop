'use client'

import { useEffect, useState } from 'react'
import QuizForm from '@/components/admin/QuizForm'
import type { QuizWithQuestions } from '@/types/database'

interface QuizSummary {
  id: string
  title: string
  description: string | null
  created_at: string
  question_count: number
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<QuizWithQuestions | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)

  async function fetchQuizzes() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/quizzes')
      if (res.ok) {
        const data = await res.json()
        setQuizzes(data.quizzes ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/quizzes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setQuizzes((prev) => prev.filter((q) => q.id !== id))
      } else {
        const err = await res.json()
        alert(err.error ?? 'Failed to delete quiz')
      }
    } finally {
      setDeletingId(null)
    }
  }

  async function handleEdit(id: string) {
    const res = await fetch(`/api/admin/quizzes/${id}`)
    if (res.ok) {
      const data = await res.json()
      setEditingQuiz(data.quiz)
    } else {
      alert('Failed to load quiz')
    }
  }

  async function handleDuplicate(quiz: QuizSummary) {
    setDuplicatingId(quiz.id)
    try {
      // Fetch full quiz first
      const res = await fetch(`/api/admin/quizzes/${quiz.id}`)
      if (!res.ok) throw new Error('Failed to fetch quiz')
      const { quiz: fullQuiz } = await res.json()

      // Post as new quiz
      const createRes = await fetch('/api/admin/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${fullQuiz.title} (copy)`,
          description: fullQuiz.description,
          questions: fullQuiz.questions.map((q: {
            question_text: string
            image_url: string | null
            timer_seconds: number
            points: number
            display_order: number
            answer_options: Array<{ answer_text: string; is_correct: boolean; display_order: number }>
          }) => ({
            question_text: q.question_text,
            image_url: q.image_url,
            timer_seconds: q.timer_seconds,
            points: q.points,
            display_order: q.display_order,
            answer_options: q.answer_options.map((a) => ({
              answer_text: a.answer_text,
              is_correct: a.is_correct,
              display_order: a.display_order,
            })),
          })),
        }),
      })
      if (createRes.ok) {
        await fetchQuizzes()
      } else {
        const err = await createRes.json()
        alert(err.error ?? 'Failed to duplicate quiz')
      }
    } catch {
      alert('Failed to duplicate quiz')
    } finally {
      setDuplicatingId(null)
    }
  }

  useEffect(() => {
    fetchQuizzes()
  }, [])

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quizzes</h1>
          <p className="mt-1 text-gray-400 text-sm">Create and manage your quiz library</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Quiz
        </button>
      </div>

      {/* Quiz grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse space-y-3 h-40" />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-16 text-center">
          <svg className="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="text-gray-400">No quizzes yet.</p>
          <p className="text-gray-600 text-sm mt-1">Create your first quiz to get started.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create Quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 hover:border-gray-700 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-white leading-tight">{quiz.title}</h3>
                {quiz.description && (
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{quiz.description}</p>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                    {quiz.question_count} question{quiz.question_count !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-gray-600">{formatDate(quiz.created_at)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-gray-800">
                <button
                  onClick={() => handleEdit(quiz.id)}
                  className="flex-1 text-xs px-3 py-2 text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDuplicate(quiz)}
                  disabled={duplicatingId === quiz.id}
                  className="flex-1 text-xs px-3 py-2 text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors disabled:opacity-50"
                >
                  {duplicatingId === quiz.id ? 'Copying…' : 'Duplicate'}
                </button>
                <button
                  onClick={() => handleDelete(quiz.id, quiz.title)}
                  disabled={deletingId === quiz.id}
                  className="flex-1 text-xs px-3 py-2 text-red-400 bg-gray-800 hover:bg-red-950 rounded-lg border border-gray-700 hover:border-red-900 transition-colors disabled:opacity-50"
                >
                  {deletingId === quiz.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      {(showCreate || editingQuiz) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-8 px-4">
          <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
              </h2>
              <button
                onClick={() => { setShowCreate(false); setEditingQuiz(null) }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <QuizForm
                quiz={editingQuiz ?? undefined}
                onSuccess={() => {
                  setShowCreate(false)
                  setEditingQuiz(null)
                  fetchQuizzes()
                }}
                onCancel={() => { setShowCreate(false); setEditingQuiz(null) }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
