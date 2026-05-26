import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sanitizeDisplayName } from '@/lib/utils'
import { getRandomAvatarColor } from '@/lib/scoring'
import type { JoinGameResponse } from '@/types/database'

const MAX_PLAYERS_PER_SESSION = 200

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { joinCode, displayName } = body

    // Validate inputs
    if (!joinCode || typeof joinCode !== 'string') {
      return NextResponse.json({ error: 'joinCode required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Find game session by join code (case-insensitive)
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('id, quiz_id, join_code, game_state, current_question_index, question_started_at, section_intro_at, correct_answer_id, started_at, completed_at, created_at')
      .ilike('join_code', joinCode.trim().toUpperCase())
      .maybeSingle()

    if (sessionError) {
      console.error('Session lookup error:', sessionError)
      return NextResponse.json({ error: 'Failed to look up game session' }, { status: 500 })
    }
    if (!session) {
      return NextResponse.json({ error: 'Game not found. Check the join code and try again.' }, { status: 404 })
    }

    // Only allow joining in lobby state
    if (session.game_state !== 'lobby') {
      return NextResponse.json(
        { error: 'Game has already started. You can only join during the lobby.' },
        { status: 409 }
      )
    }

    // Validation-only request (step 1 of the join flow — just checks the code)
    if (body.validate === true) {
      return NextResponse.json({ gameId: session.id, joinCode: session.join_code })
    }

    if (!displayName || typeof displayName !== 'string') {
      return NextResponse.json({ error: 'displayName required' }, { status: 400 })
    }

    const sanitized = sanitizeDisplayName(displayName)
    if (!sanitized || sanitized.length === 0) {
      return NextResponse.json({ error: 'displayName is invalid or empty after sanitization' }, { status: 400 })
    }

    // Rate limit: check current player count
    const { count, error: countError } = await supabase
      .from('players')
      .select('id', { count: 'exact', head: true })
      .eq('game_session_id', session.id)

    if (countError) {
      console.error('Player count error:', countError)
      return NextResponse.json({ error: 'Failed to validate session capacity' }, { status: 500 })
    }

    if ((count ?? 0) >= MAX_PLAYERS_PER_SESSION) {
      return NextResponse.json(
        { error: `Game is full (maximum ${MAX_PLAYERS_PER_SESSION} players).` },
        { status: 409 }
      )
    }

    // Check for duplicate display name in this session
    const { data: existingPlayer, error: dupeError } = await supabase
      .from('players')
      .select('id')
      .eq('game_session_id', session.id)
      .ilike('display_name', sanitized)
      .maybeSingle()

    if (dupeError) {
      console.error('Duplicate name check error:', dupeError)
      return NextResponse.json({ error: 'Failed to validate display name' }, { status: 500 })
    }

    if (existingPlayer) {
      return NextResponse.json(
        { error: 'That display name is already taken. Please choose another.' },
        { status: 409 }
      )
    }

    // Assign random avatar color
    const avatarColor = getRandomAvatarColor()

    // Insert player
    const { data: player, error: insertError } = await supabase
      .from('players')
      .insert({
        game_session_id: session.id,
        display_name: sanitized,
        total_score: 0,
        avatar_color: avatarColor,
      })
      .select()
      .single()

    if (insertError || !player) {
      console.error('Player insert error:', insertError)
      return NextResponse.json({ error: 'Failed to join game' }, { status: 500 })
    }

    // Log analytics event (best-effort)
    supabase.from('analytics_events').insert({
      event_type: 'player_joined',
      game_session_id: session.id,
      player_id: player.id,
      metadata: { display_name: sanitized },
    }).then(({ error }) => {
      if (error) console.warn('Analytics event failed:', error.message)
    })

    const response: JoinGameResponse = {
      player,
      session,
    }

    return NextResponse.json(response)
  } catch (err) {
    console.error('Unexpected error in POST /api/game/join:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
