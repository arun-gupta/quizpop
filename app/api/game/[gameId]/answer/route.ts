import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { calculateScore } from '@/lib/scoring'

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
    const { playerId, answerId, freeTextResponse, responseTimeMs } = body

    if (!playerId || typeof playerId !== 'string') {
      return NextResponse.json({ error: 'playerId required' }, { status: 400 })
    }
    if (!answerId && !freeTextResponse) {
      return NextResponse.json({ error: 'answerId or freeTextResponse required' }, { status: 400 })
    }
    if (answerId && typeof answerId !== 'string') {
      return NextResponse.json({ error: 'answerId must be a string' }, { status: 400 })
    }
    if (freeTextResponse && (typeof freeTextResponse !== 'string' || !freeTextResponse.trim())) {
      return NextResponse.json({ error: 'freeTextResponse must be a non-empty string' }, { status: 400 })
    }
    if (typeof responseTimeMs !== 'number' || responseTimeMs < 0) {
      return NextResponse.json({ error: 'responseTimeMs must be a non-negative number' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Fetch game session
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('id, quiz_id, game_state, current_question_index, question_started_at')
      .eq('id', gameId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 })
    }

    // Verify game is accepting answers
    if (session.game_state !== 'question_active') {
      return NextResponse.json(
        { error: 'No active question. Answers can only be submitted during question_active state.' },
        { status: 409 }
      )
    }

    // Fetch current question with timer, points, and type
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, timer_seconds, points, question_type')
      .eq('quiz_id', session.quiz_id)
      .order('display_order', { ascending: true })

    if (questionsError || !questions || questions.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
    }

    const currentQuestion = questions[session.current_question_index]
    if (!currentQuestion) {
      return NextResponse.json({ error: 'Current question not found' }, { status: 500 })
    }

    // Verify the answer window hasn't expired (with 2s grace period)
    if (session.question_started_at) {
      const startedAt = new Date(session.question_started_at).getTime()
      const timeLimitMs = currentQuestion.timer_seconds * 1000
      const graceMs = 2000
      const deadline = startedAt + timeLimitMs + graceMs
      const now = Date.now()

      if (now > deadline) {
        return NextResponse.json(
          { error: 'Time is up! The answer window has closed.' },
          { status: 410 }
        )
      }
    }

    // Verify player belongs to this session
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('id, game_session_id')
      .eq('id', playerId)
      .eq('game_session_id', gameId)
      .single()

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found in this game session' }, { status: 403 })
    }

    let isCorrect: boolean
    let awardedPoints: number
    let insertPayload: Record<string, unknown>

    if (currentQuestion.question_type === 'open_text') {
      // Open text: multiple submissions allowed; points only on the first one
      const { count: priorCount } = await supabase
        .from('player_responses')
        .select('*', { count: 'exact', head: true })
        .eq('player_id', playerId)
        .eq('question_id', currentQuestion.id)

      isCorrect = true
      awardedPoints = (priorCount ?? 0) === 0 ? currentQuestion.points : 0
      insertPayload = {
        player_id: playerId,
        question_id: currentQuestion.id,
        selected_answer_id: null,
        free_text_response: (freeTextResponse as string).trim(),
        response_time_ms: responseTimeMs,
        is_correct: true,
        awarded_points: awardedPoints,
      }
    } else {
      // Multiple choice: reject duplicate submissions
      const { data: existingResponse, error: dupeCheckError } = await supabase
        .from('player_responses')
        .select('id, is_correct, awarded_points')
        .eq('player_id', playerId)
        .eq('question_id', currentQuestion.id)
        .maybeSingle()

      if (dupeCheckError) {
        console.error('Duplicate check error:', dupeCheckError)
        return NextResponse.json({ error: 'Failed to validate submission' }, { status: 500 })
      }

      if (existingResponse) {
        return NextResponse.json(
          {
            error: 'Already submitted an answer for this question.',
            isCorrect: existingResponse.is_correct,
            awardedPoints: existingResponse.awarded_points,
            correctAnswerId: null,
          },
          { status: 409 }
        )
      }

      // Look up the chosen option
      const { data: answerOption, error: answerError } = await supabase
        .from('answer_options')
        .select('id, question_id, is_correct')
        .eq('id', answerId)
        .eq('question_id', currentQuestion.id)
        .single()

      if (answerError || !answerOption) {
        return NextResponse.json(
          { error: 'Answer option not found or does not belong to the current question.' },
          { status: 404 }
        )
      }

      isCorrect = answerOption.is_correct
      awardedPoints = calculateScore(isCorrect, responseTimeMs, currentQuestion.timer_seconds, currentQuestion.points)
      insertPayload = {
        player_id: playerId,
        question_id: currentQuestion.id,
        selected_answer_id: answerId,
        response_time_ms: responseTimeMs,
        is_correct: isCorrect,
        awarded_points: awardedPoints,
      }
    }

    // Insert player response (DB trigger will update player.total_score)
    const { data: response, error: insertError } = await supabase
      .from('player_responses')
      .insert(insertPayload)
      .select('id, is_correct, awarded_points')
      .single()

    if (insertError || !response) {
      // Handle UNIQUE constraint violation as a duplicate submission
      if (insertError?.code === '23505') {
        return NextResponse.json(
          {
            error: 'Already submitted an answer for this question.',
            isCorrect: false,
            awardedPoints: 0,
            correctAnswerId: null,
          },
          { status: 409 }
        )
      }
      console.error('Player response insert error:', insertError)
      return NextResponse.json({ error: 'Failed to record answer' }, { status: 500 })
    }

    // Log analytics event (best-effort)
    supabase.from('analytics_events').insert({
      event_type: 'answer_submitted',
      game_session_id: gameId,
      player_id: playerId,
      metadata: {
        question_id: currentQuestion.id,
        answer_id: answerId,
        is_correct: isCorrect,
        response_time_ms: responseTimeMs,
        awarded_points: awardedPoints,
        question_index: session.current_question_index,
      },
    }).then(({ error }) => {
      if (error) console.warn('Analytics event failed:', error.message)
    })

    // Auto-reveal when all players have answered
    const { data: sessionPlayers } = await supabase
      .from('players')
      .select('id')
      .eq('game_session_id', gameId)

    const playerIds = (sessionPlayers ?? []).map(p => p.id)
    const playerCount = playerIds.length

    const { count: responseCount } = playerCount > 0
      ? await supabase
          .from('player_responses')
          .select('id', { count: 'exact', head: true })
          .eq('question_id', currentQuestion.id)
          .in('player_id', playerIds)
      : { count: 0 }

    if (
      typeof responseCount === 'number' &&
      typeof playerCount === 'number' &&
      playerCount > 0 &&
      responseCount >= playerCount
    ) {
      if (currentQuestion.question_type === 'open_text') {
        // Open text: reveal with no correct_answer_id
        await supabase
          .from('game_sessions')
          .update({ game_state: 'question_results', correct_answer_id: null })
          .eq('id', gameId)
          .eq('game_state', 'question_active')
      } else {
        // Multiple choice: reveal the correct answer
        const { data: correctOption } = await supabase
          .from('answer_options')
          .select('id')
          .eq('question_id', currentQuestion.id)
          .eq('is_correct', true)
          .single()

        if (correctOption) {
          await supabase
            .from('game_sessions')
            .update({ game_state: 'question_results', correct_answer_id: correctOption.id })
            .eq('id', gameId)
            .eq('game_state', 'question_active')
        }
      }
    }

    return NextResponse.json({
      isCorrect,
      awardedPoints,
      correctAnswerId: null,
    })
  } catch (err) {
    console.error('Unexpected error in POST /api/game/[gameId]/answer:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
