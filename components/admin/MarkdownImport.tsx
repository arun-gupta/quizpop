'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, AlertTriangle, X, Copy, Database } from 'lucide-react'
import { parseQuizMarkdown, generateExampleMarkdown } from '@/lib/quiz-markdown'
import type { ParsedQuiz } from '@/lib/quiz-markdown'

interface MarkdownImportProps {
  onSuccess: (quizId: string, title: string) => void
  onCancel: () => void
}

export default function MarkdownImport({ onSuccess, onCancel }: MarkdownImportProps) {
  const [markdown, setMarkdown] = useState('')
  const [preview, setPreview] = useState<ParsedQuiz | null>(null)
  const [importing, setImporting] = useState(false)
  const [tab, setTab] = useState<'paste' | 'upload' | 'bucket' | 'format'>('paste')
  const [bucketPath, setBucketPath] = useState('')
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!markdown.trim()) { setPreview(null); return }
    const t = setTimeout(() => setPreview(parseQuizMarkdown(markdown)), 400)
    return () => clearTimeout(t)
  }, [markdown])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setMarkdown(text)
    setPreview(parseQuizMarkdown(text))
    setTab('paste')
  }

  const handleImport = async () => {
    if (!preview || preview.errors.length > 0) return
    setImporting(true)
    try {
      const res = await fetch('/api/admin/quizzes/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPreview(prev => prev ? { ...prev, errors: data.errors ?? [data.error] } : null)
        return
      }
      onSuccess(data.quiz.id, data.quiz.title)
    } finally {
      setImporting(false)
    }
  }

  const handleFetchFromBucket = async () => {
    if (!bucketPath.trim()) return
    setFetching(true)
    setFetchError(null)
    try {
      const res = await fetch('/api/admin/quizzes/fetch-from-bucket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucketPath: bucketPath.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFetchError(data.error ?? 'Failed to fetch from bucket')
        return
      }
      setMarkdown(data.markdown)
      setPreview(parseQuizMarkdown(data.markdown))
      setTab('paste')
    } finally {
      setFetching(false)
    }
  }

  const loadExample = () => {
    const example = generateExampleMarkdown()
    setMarkdown(example)
    setPreview(parseQuizMarkdown(example))
    setTab('paste')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-4">
        {(['paste', 'upload', 'bucket', 'format'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {t === 'paste' ? 'Paste Markdown' : t === 'upload' ? 'Upload File' : t === 'bucket' ? 'From Storage' : 'Format Guide'}
          </button>
        ))}
      </div>

      {tab === 'paste' && (
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Paste your quiz in Markdown format</p>
            <button onClick={loadExample} className="text-xs text-purple-400 hover:text-purple-300 underline">
              Load example
            </button>
          </div>
          <textarea
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            placeholder={`# My Quiz\nA fun quiz for all ages!\n\n## What color is the sky?\n- [ ] Red\n- [x] Blue\n- [ ] Green`}
            className="flex-1 min-h-[220px] bg-gray-900 border border-gray-600 rounded-lg p-3 text-sm text-gray-100 font-mono resize-none focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
          />
        </div>
      )}

      {tab === 'upload' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <input ref={fileRef} type="file" accept=".md,.txt" className="hidden" onChange={handleFileUpload} />
          <div
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-600 hover:border-purple-500 rounded-xl p-12 flex flex-col items-center gap-3 cursor-pointer transition-colors"
          >
            <Upload size={40} className="text-gray-500" />
            <p className="text-gray-300 font-medium">Click to upload a .md file</p>
            <p className="text-gray-500 text-sm">or drag and drop</p>
          </div>
        </div>
      )}

      {tab === 'bucket' && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-400">
              Upload your <code className="text-purple-400">.md</code> file and images into the same Supabase Storage folder, then enter the path below.
            </p>
            <p className="text-xs text-gray-500">
              Format: <code className="text-gray-300">bucket-name/folder</code> — e.g. <code className="text-gray-300">quiz-images/mihir</code>
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={bucketPath}
              onChange={e => { setBucketPath(e.target.value); setFetchError(null) }}
              onKeyDown={e => e.key === 'Enter' && handleFetchFromBucket()}
              placeholder="quiz-images/my-folder"
              className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 font-mono focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
            />
            <button
              onClick={handleFetchFromBucket}
              disabled={!bucketPath.trim() || fetching}
              className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {fetching ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Database size={15} />
              )}
              {fetching ? 'Fetching…' : 'Fetch'}
            </button>
          </div>
          {fetchError && (
            <div className="flex items-start gap-2 bg-red-900/30 border border-red-700 rounded-lg p-3">
              <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{fetchError}</p>
            </div>
          )}
          <div className="bg-gray-800/60 rounded-lg p-4 text-xs text-gray-400 space-y-2">
            <p className="font-medium text-gray-300">Bucket folder structure:</p>
            <pre className="font-mono leading-relaxed">{`quiz-images/
└── mihir/
    ├── mihir-18th-birthday.md   ← quiz markdown
    ├── baby.jpeg
    ├── school.jpeg
    └── ...`}</pre>
            <p>The <code className="text-gray-300">.md</code> file must have <code className="text-purple-400">{`> bucket: quiz-images/mihir`}</code> at the top so image paths resolve correctly.</p>
          </div>
        </div>
      )}

      {tab === 'format' && (
        <div className="flex-1 overflow-y-auto space-y-4 text-sm">
          <p className="text-gray-300">Create a <code className="text-purple-400">.md</code> file with this structure:</p>
          <pre className="bg-gray-900 rounded-lg p-4 text-gray-100 text-xs leading-relaxed overflow-x-auto whitespace-pre">{`# Quiz Title
Optional description text here.

## Question text goes here?
- [ ] Wrong answer
- [x] Correct answer   ← mark correct with [x]
- [ ] Another wrong answer
- [ ] One more

## Another question with custom settings
> timer: 15 | points: 500
- [x] Right!
- [ ] Nope`}</pre>
          <div className="space-y-2 text-gray-400">
            <p><span className="text-white font-medium"># Title</span> — quiz name (required, one only)</p>
            <p><span className="text-white font-medium">## Question</span> — starts a new question</p>
            <p><span className="text-white font-medium">- [x] Answer</span> — correct answer (exactly 1 per question)</p>
            <p><span className="text-white font-medium">- [ ] Answer</span> — wrong answer (2–4 options total)</p>
            <p><span className="text-white font-medium">&gt; timer: N | points: N</span> — optional, after the question line</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-xs text-gray-400">
            Defaults: <span className="text-gray-200">timer = 20s</span>, <span className="text-gray-200">points = 1000</span>
          </div>
          <button onClick={loadExample} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm">
            <Copy size={14} /> Load example into editor
          </button>
        </div>
      )}

      {/* Preview panel */}
      {preview && (
        <div className="mt-4 border-t border-gray-700 pt-4 space-y-3">
          {preview.errors.length > 0 && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-red-400 font-medium text-sm">
                <AlertCircle size={16} /> {preview.errors.length} error{preview.errors.length > 1 ? 's' : ''}
              </div>
              {preview.errors.map((e, i) => (
                <p key={i} className="text-red-300 text-xs pl-6">{e}</p>
              ))}
            </div>
          )}

          {preview.warnings.length > 0 && (
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-yellow-400 font-medium text-sm">
                <AlertTriangle size={16} /> {preview.warnings.length} warning{preview.warnings.length > 1 ? 's' : ''}
              </div>
              {preview.warnings.map((w, i) => (
                <p key={i} className="text-yellow-300 text-xs pl-6">{w}</p>
              ))}
            </div>
          )}

          {preview.errors.length === 0 && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-400 font-medium text-sm mb-2">
                <CheckCircle size={16} /> Ready to import
              </div>
              <p className="text-gray-300 text-sm">
                <span className="font-medium text-white">{preview.title}</span>
                {preview.description && <span className="text-gray-400"> — {preview.description}</span>}
              </p>
              <p className="text-gray-400 text-xs mt-1">{preview.questions.length} question{preview.questions.length !== 1 ? 's' : ''}</p>
              <ul className="mt-2 space-y-0.5">
                {preview.questions.map(q => (
                  <li key={q.display_order} className="text-xs text-gray-400 flex gap-2">
                    <span className="text-gray-600">{q.display_order}.</span>
                    <span className="truncate">{q.question_text}</span>
                    <span className="shrink-0 text-gray-600">({q.answer_options.length} opts, {q.timer_seconds}s)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors">
          Cancel
        </button>
        <button
          onClick={handleImport}
          disabled={!preview || preview.errors.length > 0 || importing}
          className="px-5 py-2 text-sm bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {importing ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Importing…</>
          ) : (
            <><FileText size={15} /> Import Quiz</>
          )}
        </button>
      </div>
    </div>
  )
}
