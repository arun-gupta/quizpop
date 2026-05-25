import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// ─── GET /api/admin/quizzes ─────────────────────────────────────────────────
// List all quizzes with question counts — public read, no auth required
export async function GET() {
  try {
    const service = createServiceClient()

    const { data: quizzes, error } = await service
      .from('quizzes')
      .select(`
        id,
        title,
        description,
        created_at,
        questions(count)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch quizzes:', error)
      return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
    }

    const result = (quizzes ?? []).map((q: {
      id: string
      title: string
      description: string | null
      created_at: string
      questions: { count: number }[]
    }) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      created_at: q.created_at,
      question_count: q.questions?.[0]?.count ?? 0,
    }))

    return NextResponse.json({ quizzes: result })
  } catch (err) {
    console.error('Unexpected error in GET /api/admin/quizzes:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── POST /api/admin/quizzes ────────────────────────────────────────────────
// Create a new quiz with questions and answer options
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: {
      title: string
      description?: string
      questions: Array<{
        question_text: string
        image_url?: string
        timer_seconds?: number
        points?: number
        display_order: number
        answer_options: Array<{
          answer_text: string
          is_correct: boolean
          display_order: number
        }>
      }>
    }

    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    // ── Validate title ──────────────────────────────────────────────────────
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    const title = body.title.trim()
    if (title.length === 0) {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 })
    }
    if (title.length > 100) {
      return NextResponse.json({ error: 'Title must be 100 characters or fewer' }, { status: 400 })
    }

    // ── Validate questions ──────────────────────────────────────────────────
    if (!Array.isArray(body.questions) || body.questions.length === 0) {
      return NextResponse.json({ error: 'At least one question is required' }, { status: 400 })
    }

    for (let qi = 0; qi < body.questions.length; qi++) {
      const q = body.questions[qi]
      if (!q.question_text || typeof q.question_text !== 'string' || q.question_text.trim().length === 0) {
        return NextResponse.json({ error: `Question ${qi + 1}: question_text is required` }, { status: 400 })
      }
      if (!Array.isArray(q.answer_options) || q.answer_options.length < 2 || q.answer_options.length > 4) {
        return NextResponse.json(
          { error: `Question ${qi + 1}: must have 2–4 answer options` },
          { status: 400 }
        )
      }
      const correctCount = q.answer_options.filter(a => a.is_correct === true).length
      if (correctCount !== 1) {
        return NextResponse.json(
          { error: `Question ${qi + 1}: exactly one answer option must be correct` },
          { status: 400 }
        )
      }
    }

    const service = createServiceClient()

    // ── Insert quiz ─────────────────────────────────────────────────────────
    const { data: quiz, error: quizError } = await service
      .from('quizzes')
      .insert({ title, description: body.description ?? null })
      .select()
      .single()

    if (quizError || !quiz) {
      console.error('Failed to insert quiz:', quizError)
      return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 })
    }

    // ── Insert questions ────────────────────────────────────────────────────
    const questionsToInsert = body.questions.map((q) => ({
      quiz_id: quiz.id,
      question_text: q.question_text.trim(),
      image_url: q.image_url ?? null,
      timer_seconds: q.timer_seconds ?? 20,
      points: q.points ?? 1000,
      display_order: q.display_order,
    }))

    const { data: insertedQuestions, error: questionsError } = await service
      .from('questions')
      .insert(questionsToInsert)
      .select()

    if (questionsError || !insertedQuestions) {
      console.error('Failed to insert questions:', questionsError)
      // Best-effort cleanup
      await service.from('quizzes').delete().eq('id', quiz.id)
      return NextResponse.json({ error: 'Failed to create questions' }, { status: 500 })
    }

    // ── Insert answer options ───────────────────────────────────────────────
    const answersToInsert: Array<{
      question_id: string
      answer_text: string
      is_correct: boolean
      display_order: number
    }> = []

    for (let qi = 0; qi < body.questions.length; qi++) {
      const srcQuestion = body.questions[qi]
      const insertedQuestion = insertedQuestions[qi]
      for (const opt of srcQuestion.answer_options) {
        answersToInsert.push({
          question_id: insertedQuestion.id,
          answer_text: opt.answer_text,
          is_correct: opt.is_correct,
          display_order: opt.display_order,
        })
      }
    }

    const { error: answersError } = await service
      .from('answer_options')
      .insert(answersToInsert)

    if (answersError) {
      console.error('Failed to insert answer options:', answersError)
      await service.from('quizzes').delete().eq('id', quiz.id)
      return NextResponse.json({ error: 'Failed to create answer options' }, { status: 500 })
    }

    // ── Fetch complete quiz to return ───────────────────────────────────────
    const { data: fullQuiz, error: fetchError } = await service
      .from('quizzes')
      .select(`
        *,
        questions (
          *,
          answer_options (*)
        )
      `)
      .eq('id', quiz.id)
      .single()

    if (fetchError || !fullQuiz) {
      return NextResponse.json({ quiz }, { status: 201 })
    }

    return NextResponse.json({ quiz: fullQuiz }, { status: 201 })
  } catch (err) {
    console.error('Unexpected error in POST /api/admin/quizzes:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
