import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { parseQuizMarkdown } from '@/lib/quiz-markdown'

// POST /api/admin/quizzes/import
// Accepts JSON { markdown: string } or multipart form-data with a .md file
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    let markdown = ''
    const contentType = req.headers.get('content-type') ?? ''

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      const file = form.get('file') as File | null
      if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      if (!file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
        return NextResponse.json({ error: 'File must be a .md or .txt file' }, { status: 400 })
      }
      markdown = await file.text()
    } else {
      const body = await req.json()
      markdown = body.markdown ?? ''
    }

    if (!markdown.trim()) {
      return NextResponse.json({ error: 'Markdown content is empty' }, { status: 400 })
    }

    const parsed = parseQuizMarkdown(markdown)

    if (parsed.errors.length > 0) {
      return NextResponse.json({ errors: parsed.errors, warnings: parsed.warnings }, { status: 422 })
    }

    const service = createServiceClient()

    // Insert quiz
    const { data: quiz, error: quizError } = await service
      .from('quizzes')
      .insert({ title: parsed.title, description: parsed.description || null })
      .select()
      .single()

    if (quizError || !quiz) {
      return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 })
    }

    // Insert questions and answer options
    for (const q of parsed.questions) {
      const { data: question, error: qError } = await service
        .from('questions')
        .insert({
          quiz_id: quiz.id,
          question_text: q.question_text,
          image_url: q.image_url ?? null,
          timer_seconds: q.timer_seconds,
          points: q.points,
          display_order: q.display_order,
          question_type: q.question_type ?? 'multiple_choice',
        })
        .select()
        .single()

      if (qError || !question) {
        // Clean up the quiz we just created
        await service.from('quizzes').delete().eq('id', quiz.id)
        return NextResponse.json({ error: `Failed to insert question ${q.display_order}` }, { status: 500 })
      }

      // Open text questions have no answer options
      if (q.answer_options.length > 0) {
        const { error: optError } = await service.from('answer_options').insert(
          q.answer_options.map(opt => ({
            question_id: question.id,
            answer_text: opt.answer_text,
            is_correct: opt.is_correct,
            display_order: opt.display_order,
          }))
        )

        if (optError) {
          await service.from('quizzes').delete().eq('id', quiz.id)
          return NextResponse.json({ error: `Failed to insert answer options for question ${q.display_order}` }, { status: 500 })
        }
      }
    }

    return NextResponse.json({
      quiz: { id: quiz.id, title: quiz.title },
      questionCount: parsed.questions.length,
      warnings: parsed.warnings,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
