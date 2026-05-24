import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// ─── GET /api/admin/games ────────────────────────────────────────────────────
// List all game sessions with player counts and quiz titles
// Query params: ?status=active|completed|all&limit=20&offset=0
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const status = url.searchParams.get('status') ?? 'all'
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') ?? '20', 10), 1), 100)
    const offset = Math.max(parseInt(url.searchParams.get('offset') ?? '0', 10), 0)

    const service = createServiceClient()

    let query = service
      .from('game_sessions')
      .select(`
        id,
        quiz_id,
        join_code,
        game_state,
        current_question_index,
        question_started_at,
        started_at,
        completed_at,
        created_at,
        quizzes (title),
        players (count)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status === 'active') {
      query = query.neq('game_state', 'finished')
    } else if (status === 'completed') {
      query = query.eq('game_state', 'finished')
    }
    // 'all' = no filter

    const { data: rows, count, error } = await query

    if (error) {
      console.error('Failed to fetch games:', error)
      return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 })
    }

    const games = (rows ?? []).map((gs: {
      id: string
      quiz_id: string
      join_code: string
      game_state: string
      current_question_index: number
      question_started_at: string | null
      started_at: string | null
      completed_at: string | null
      created_at: string
      quizzes: unknown
      players: { count: number }[]
    }) => {
      const quizzesRaw = gs.quizzes
      const quizTitle = (Array.isArray(quizzesRaw) ? quizzesRaw[0]?.title : (quizzesRaw as { title: string } | null)?.title) ?? 'Unknown'
      return {
        id: gs.id,
        quiz_id: gs.quiz_id,
        join_code: gs.join_code,
        game_state: gs.game_state,
        current_question_index: gs.current_question_index,
        question_started_at: gs.question_started_at,
        started_at: gs.started_at,
        completed_at: gs.completed_at,
        created_at: gs.created_at,
        quiz_title: quizTitle,
        player_count: gs.players?.[0]?.count ?? 0,
      }
    })

    return NextResponse.json({ games, total: count ?? 0 })
  } catch (err) {
    console.error('Unexpected error in GET /api/admin/games:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
