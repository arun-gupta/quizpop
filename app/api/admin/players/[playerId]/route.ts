import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

type RouteContext = { params: Promise<{ playerId: string }> }

// ─── Auth helper ─────────────────────────────────────────────────────────────
async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

// ─── DELETE /api/admin/players/[playerId] ────────────────────────────────────
// Remove a player from a game
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { playerId } = await params
    const service = createServiceClient()

    // Verify player exists first
    const { data: player, error: fetchError } = await service
      .from('players')
      .select('id, game_session_id')
      .eq('id', playerId)
      .single()

    if (fetchError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    const { error } = await service
      .from('players')
      .delete()
      .eq('id', playerId)

    if (error) {
      console.error('Failed to delete player:', error)
      return NextResponse.json({ error: 'Failed to delete player' }, { status: 500 })
    }

    // Log analytics event
    await service.from('analytics_events').insert({
      event_type: 'player_removed_by_admin',
      game_session_id: player.game_session_id,
      player_id: null,
      metadata: { removed_player_id: playerId, admin_user_id: user.id },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in DELETE /api/admin/players/[playerId]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── PATCH /api/admin/players/[playerId] ─────────────────────────────────────
// Update player display name
// Body: { display_name: string }
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { playerId } = await params

    let body: { display_name: string }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    if (!body.display_name || typeof body.display_name !== 'string') {
      return NextResponse.json({ error: 'display_name is required' }, { status: 400 })
    }

    const displayName = body.display_name.trim()
    if (displayName.length === 0 || displayName.length > 20) {
      return NextResponse.json(
        { error: 'display_name must be 1–20 characters' },
        { status: 400 }
      )
    }

    const service = createServiceClient()

    const { data: player, error } = await service
      .from('players')
      .update({ display_name: displayName })
      .eq('id', playerId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Player not found' }, { status: 404 })
      }
      console.error('Failed to update player:', error)
      return NextResponse.json({ error: 'Failed to update player' }, { status: 500 })
    }

    return NextResponse.json({ player })
  } catch (err) {
    console.error('Unexpected error in PATCH /api/admin/players/[playerId]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
