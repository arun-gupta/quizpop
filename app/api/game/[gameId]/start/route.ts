import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params
    if (!gameId) {
      return NextResponse.json({ error: 'gameId required' }, { status: 400 })
    }

    const body = await req.json()
    const { hostToken } = body

    if (!hostToken || typeof hostToken !== 'string') {
      return NextResponse.json({ error: 'hostToken required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Fetch game session including host_token for verification
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('id, quiz_id, host_token, game_state')
      .eq('id', gameId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 })
    }

    // Verify host token
    if (session.host_token !== hostToken) {
      return NextResponse.json({ error: 'Unauthorized: invalid host token' }, { status: 401 })
    }

    // Verify game is in lobby state
    if (session.game_state !== 'lobby') {
      return NextResponse.json(
        { error: `Cannot start game: current state is '${session.game_state}'` },
        { status: 409 }
      )
    }

    // Get quiz questions ordered by display_order
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, display_order')
      .eq('quiz_id', session.quiz_id)
      .order('display_order', { ascending: true })

    if (questionsError) {
      console.error('Questions fetch error:', questionsError)
      return NextResponse.json({ error: 'Failed to fetch quiz questions' }, { status: 500 })
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'Quiz has no questions. Add at least one question before starting.' },
        { status: 422 }
      )
    }

    const now = new Date().toISOString()

    // Transition to question_active state
    const { error: updateError } = await supabase
      .from('game_sessions')
      .update({
        game_state: 'question_active',
        current_question_index: 0,
        started_at: now,
        question_started_at: now,
      })
      .eq('id', gameId)

    if (updateError) {
      console.error('Session update error:', updateError)
      return NextResponse.json({ error: 'Failed to start game' }, { status: 500 })
    }

    // Log analytics event (best-effort)
    supabase.from('analytics_events').insert({
      event_type: 'game_started',
      game_session_id: gameId,
      metadata: {
        quiz_id: session.quiz_id,
        total_questions: questions.length,
      },
    }).then(({ error }) => {
      if (error) console.warn('Analytics event failed:', error.message)
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in POST /api/game/[gameId]/start:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
