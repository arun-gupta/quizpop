import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

type RouteContext = { params: Promise<{ quizId: string }> }

// ─── Auth helper ────────────────────────────────────────────────────────────
async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

// ─── GET /api/admin/quizzes/[quizId] ────────────────────────────────────────
// Return quiz with all questions and answer options
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { quizId } = await params
    const service = createServiceClient()

    const { data: quiz, error } = await service
      .from('quizzes')
      .select(`
        *,
        questions (
          *,
          answer_options (*)
        )
      `)
      .eq('id', quizId)
      .order('display_order', { referencedTable: 'questions' })
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
      }
      console.error('Failed to fetch quiz:', error)
      return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 })
    }

    return NextResponse.json({ quiz })
  } catch (err) {
    console.error('Unexpected error in GET /api/admin/quizzes/[quizId]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── PUT /api/admin/quizzes/[quizId] ────────────────────────────────────────
// Update quiz title, description, and/or question display_order
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { quizId } = await params

    let body: {
      title?: string
      description?: string
      questions?: Array<{ id: string; display_order: number }>
    }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const service = createServiceClient()

    // ── Verify quiz exists ──────────────────────────────────────────────────
    const { data: existing, error: fetchError } = await service
      .from('quizzes')
      .select('id')
      .eq('id', quizId)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // ── Update quiz metadata ────────────────────────────────────────────────
    const updates: Record<string, unknown> = {}
    if (body.title !== undefined) {
      const title = body.title.trim()
      if (title.length === 0) {
        return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 })
      }
      if (title.length > 100) {
        return NextResponse.json({ error: 'Title must be 100 characters or fewer' }, { status: 400 })
      }
      updates.title = title
    }
    if (body.description !== undefined) {
      updates.description = body.description
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await service
        .from('quizzes')
        .update(updates)
        .eq('id', quizId)

      if (updateError) {
        console.error('Failed to update quiz:', updateError)
        return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 })
      }
    }

    // ── Reorder questions ───────────────────────────────────────────────────
    if (Array.isArray(body.questions) && body.questions.length > 0) {
      for (const q of body.questions) {
        const { error: reorderError } = await service
          .from('questions')
          .update({ display_order: q.display_order })
          .eq('id', q.id)
          .eq('quiz_id', quizId)

        if (reorderError) {
          console.error('Failed to reorder question:', reorderError)
          return NextResponse.json({ error: 'Failed to reorder questions' }, { status: 500 })
        }
      }
    }

    // ── Return updated quiz ─────────────────────────────────────────────────
    const { data: quiz, error: refetchError } = await service
      .from('quizzes')
      .select(`
        *,
        questions (
          *,
          answer_options (*)
        )
      `)
      .eq('id', quizId)
      .order('display_order', { referencedTable: 'questions' })
      .single()

    if (refetchError || !quiz) {
      return NextResponse.json({ error: 'Quiz updated but failed to refetch' }, { status: 500 })
    }

    return NextResponse.json({ quiz })
  } catch (err) {
    console.error('Unexpected error in PUT /api/admin/quizzes/[quizId]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/quizzes/[quizId] ─────────────────────────────────────
// Delete quiz (cascades to questions and answer_options via DB)
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { quizId } = await params
    const service = createServiceClient()

    const { error } = await service
      .from('quizzes')
      .delete()
      .eq('id', quizId)

    if (error) {
      console.error('Failed to delete quiz:', error)
      return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in DELETE /api/admin/quizzes/[quizId]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
