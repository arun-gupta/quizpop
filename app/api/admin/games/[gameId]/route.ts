import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

type RouteContext = { params: Promise<{ gameId: string }> }

// ─── Auth helper ─────────────────────────────────────────────────────────────
async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

// ─── GET /api/admin/games/[gameId] ───────────────────────────────────────────
// Get detailed game session info: players, responses, leaderboard
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { gameId } = await params
    const service = createServiceClient()

    const { data: session, error: sessionError } = await service
      .from('game_sessions')
      .select(`
        *,
        quizzes (
          id,
          title,
          description
        )
      `)
      .eq('id', gameId)
      .single()

    if (sessionError || !session) {
      if (sessionError?.code === 'PGRST116') {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch game session' }, { status: 500 })
    }

    // Fetch players
    const { data: players } = await service
      .from('players')
      .select('*')
      .eq('game_session_id', gameId)
      .order('total_score', { ascending: false })

    // Fetch player responses
    const playerIds = (players ?? []).map((p: { id: string }) => p.id)
    let responses: unknown[] = []
    if (playerIds.length > 0) {
      const { data: responseRows } = await service
        .from('player_responses')
        .select('*')
        .in('player_id', playerIds)
      responses = responseRows ?? []
    }

    // Fetch latest leaderboard snapshot
    const { data: snapshots } = await service
      .from('leaderboard_snapshots')
      .select('*')
      .eq('game_session_id', gameId)
      .order('question_index', { ascending: false })
      .limit(1)

    const leaderboard = snapshots?.[0]?.snapshot_data ?? null

    return NextResponse.json({
      session,
      players: players ?? [],
      responses,
      leaderboard,
    })
  } catch (err) {
    console.error('Unexpected error in GET /api/admin/games/[gameId]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/games/[gameId] ───────────────────────────────────────
// End/delete a live game session
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { gameId } = await params
    const service = createServiceClient()

    const { error } = await service
      .from('game_sessions')
      .delete()
      .eq('id', gameId)

    if (error) {
      console.error('Failed to delete game session:', error)
      return NextResponse.json({ error: 'Failed to delete game session' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in DELETE /api/admin/games/[gameId]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── PATCH /api/admin/games/[gameId] ────────────────────────────────────────
// Force end or reset game state
// Body: { action: 'force_end' | 'reset_to_lobby' }
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { gameId } = await params

    let body: { action: 'force_end' | 'reset_to_lobby' }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    if (!body.action || !['force_end', 'reset_to_lobby'].includes(body.action)) {
      return NextResponse.json(
        { error: 'action must be "force_end" or "reset_to_lobby"' },
        { status: 400 }
      )
    }

    const service = createServiceClient()

    let updatePayload: Record<string, unknown>
    if (body.action === 'force_end') {
      updatePayload = {
        game_state: 'finished',
        completed_at: new Date().toISOString(),
      }
    } else {
      // reset_to_lobby
      updatePayload = {
        game_state: 'lobby',
        current_question_index: 0,
        question_started_at: null,
        correct_answer_id: null,
        started_at: null,
        completed_at: null,
      }
    }

    const { data: session, error } = await service
      .from('game_sessions')
      .update(updatePayload)
      .eq('id', gameId)
      .select()
      .single()

    if (error) {
      console.error('Failed to update game session:', error)
      return NextResponse.json({ error: 'Failed to update game session' }, { status: 500 })
    }

    if (!session) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // Log analytics event
    await service.from('analytics_events').insert({
      event_type: body.action === 'force_end' ? 'game_force_ended' : 'game_reset_to_lobby',
      game_session_id: gameId,
      metadata: { admin_user_id: user.id },
    })

    return NextResponse.json({ session })
  } catch (err) {
    console.error('Unexpected error in PATCH /api/admin/games/[gameId]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
