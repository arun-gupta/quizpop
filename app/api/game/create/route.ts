import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateJoinCode, generateToken } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { quiz_id } = body

    if (!quiz_id || typeof quiz_id !== 'string') {
      return NextResponse.json({ error: 'quiz_id required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Validate quiz exists
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('id')
      .eq('id', quiz_id)
      .single()

    if (quizError || !quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Generate unique join code
    let joinCode = ''
    let attempts = 0
    while (attempts < 10) {
      const code = generateJoinCode()
      const { data: existing } = await supabase
        .from('game_sessions')
        .select('id')
        .eq('join_code', code)
        .maybeSingle()
      if (!existing) {
        joinCode = code
        break
      }
      attempts++
    }

    if (!joinCode) {
      return NextResponse.json({ error: 'Failed to generate unique join code' }, { status: 500 })
    }

    // Generate host token (64-char hex = 32 bytes)
    const hostToken = generateToken()

    // Insert game session
    const { data: session, error: insertError } = await supabase
      .from('game_sessions')
      .insert({
        quiz_id,
        join_code: joinCode,
        host_token: hostToken,
        game_state: 'lobby',
        current_question_index: 0,
      })
      .select()
      .single()

    if (insertError || !session) {
      console.error('Failed to create session:', insertError)
      return NextResponse.json({ error: 'Failed to create game session' }, { status: 500 })
    }

    // Log analytics event (non-blocking, best-effort)
    await supabase.from('analytics_events').insert({
      event_type: 'game_created',
      game_session_id: session.id,
      metadata: { quiz_id },
    }).then(({ error }) => {
      if (error) console.warn('Analytics event failed:', error.message)
    })

    return NextResponse.json({
      gameId: session.id,
      joinCode,
      hostToken,
    })
  } catch (err) {
    console.error('Unexpected error in POST /api/game/create:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
