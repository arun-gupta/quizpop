import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params
    const { hostToken, action } = await req.json()

    if (!hostToken || !action || !['pause', 'resume'].includes(action)) {
      return NextResponse.json({ error: 'hostToken and action (pause|resume) required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('id, host_token, game_state, is_paused, paused_at, question_started_at, section_intro_at, state_changed_at')
      .eq('id', gameId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }
    if (session.host_token !== hostToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    if (session.game_state === 'finished' || session.game_state === 'lobby') {
      return NextResponse.json({ error: 'Cannot pause in this state' }, { status: 409 })
    }

    const now = new Date().toISOString()

    if (action === 'pause') {
      if (session.is_paused) return NextResponse.json({ ok: true })
      await supabase
        .from('game_sessions')
        .update({ is_paused: true, paused_at: now })
        .eq('id', gameId)
    } else {
      // resume — shift the relevant timestamp forward by the pause duration
      // so timers continue exactly from where they were
      if (!session.is_paused) return NextResponse.json({ ok: true })

      const pauseMs = session.paused_at
        ? Date.now() - new Date(session.paused_at).getTime()
        : 0

      const shift = (ts: string | null) =>
        ts ? new Date(new Date(ts).getTime() + pauseMs).toISOString() : null

      const updates: Record<string, unknown> = { is_paused: false, paused_at: null }

      if (session.game_state === 'question_active' && session.question_started_at) {
        updates.question_started_at = shift(session.question_started_at)
      } else if (session.game_state === 'section_intro' && session.section_intro_at) {
        updates.section_intro_at = shift(session.section_intro_at)
      } else if (session.state_changed_at) {
        updates.state_changed_at = shift(session.state_changed_at)
      }

      await supabase.from('game_sessions').update(updates).eq('id', gameId)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Unexpected error in POST /api/game/[gameId]/pause:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
