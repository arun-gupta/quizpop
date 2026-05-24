import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// ─── GET /api/admin/analytics ───────────────────────────────────────────────
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const service = createServiceClient()

    // ── Total games ─────────────────────────────────────────────────────────
    const { count: totalGames } = await service
      .from('game_sessions')
      .select('*', { count: 'exact', head: true })

    // ── Active games (not finished) ─────────────────────────────────────────
    const { count: activeGames } = await service
      .from('game_sessions')
      .select('*', { count: 'exact', head: true })
      .neq('game_state', 'finished')

    // ── Total players ───────────────────────────────────────────────────────
    const { count: totalPlayers } = await service
      .from('players')
      .select('*', { count: 'exact', head: true })

    // ── Avg players per game ────────────────────────────────────────────────
    const avgPlayersPerGame =
      totalGames && totalGames > 0
        ? Math.round(((totalPlayers ?? 0) / totalGames) * 10) / 10
        : 0

    // ── Most played quizzes ─────────────────────────────────────────────────
    const { data: gameSessions } = await service
      .from('game_sessions')
      .select('quiz_id, quizzes(title)')

    const quizPlayMap = new Map<string, { title: string; count: number }>()
    for (const gs of gameSessions ?? []) {
      const quizzesRaw = gs.quizzes as unknown
      const quizTitle = (Array.isArray(quizzesRaw) ? quizzesRaw[0]?.title : (quizzesRaw as { title: string } | null)?.title) ?? 'Unknown'
      const existing = quizPlayMap.get(gs.quiz_id)
      if (existing) {
        existing.count++
      } else {
        quizPlayMap.set(gs.quiz_id, { title: quizTitle, count: 1 })
      }
    }

    const mostPlayedQuizzes = Array.from(quizPlayMap.entries())
      .map(([quiz_id, { title, count }]) => ({ quiz_id, title, play_count: count }))
      .sort((a, b) => b.play_count - a.play_count)
      .slice(0, 10)

    // ── Recent games ────────────────────────────────────────────────────────
    const { data: recentGameRows } = await service
      .from('game_sessions')
      .select(`
        id,
        game_state,
        created_at,
        quizzes (title),
        players (count)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    const recentGames = (recentGameRows ?? []).map((gs: {
      id: string
      game_state: string
      created_at: string
      quizzes: unknown
      players: { count: number }[]
    }) => {
      const quizzesRaw = gs.quizzes
      const quizTitle = (Array.isArray(quizzesRaw) ? quizzesRaw[0]?.title : (quizzesRaw as { title: string } | null)?.title) ?? 'Unknown'
      return {
        id: gs.id,
        quiz_title: quizTitle,
        player_count: gs.players?.[0]?.count ?? 0,
        game_state: gs.game_state,
        created_at: gs.created_at,
      }
    })

    // ── Analytics events (last 7 days, grouped by event_type) ──────────────
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: eventRows } = await service
      .from('analytics_events')
      .select('event_type')
      .gte('created_at', sevenDaysAgo)

    const eventCountMap = new Map<string, number>()
    for (const ev of eventRows ?? []) {
      eventCountMap.set(ev.event_type, (eventCountMap.get(ev.event_type) ?? 0) + 1)
    }
    const analyticsEvents = Array.from(eventCountMap.entries())
      .map(([event_type, count]) => ({ event_type, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      totalGames: totalGames ?? 0,
      activeGames: activeGames ?? 0,
      totalPlayers: totalPlayers ?? 0,
      avgPlayersPerGame,
      mostPlayedQuizzes,
      recentGames,
      analyticsEvents,
    })
  } catch (err) {
    console.error('Unexpected error in GET /api/admin/analytics:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
