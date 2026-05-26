import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { GameStateResponse, LeaderboardEntry, PublicQuestion, WordCloudEntry } from '@/types/database'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params
    if (!gameId) {
      return NextResponse.json({ error: 'gameId required' }, { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const playerId = searchParams.get('playerId')

    const supabase = createServiceClient()

    // Fetch game session (excluding host_token from response)
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select(
        'id, quiz_id, join_code, game_state, current_question_index, question_started_at, section_intro_at, correct_answer_id, started_at, completed_at, created_at'
      )
      .eq('id', gameId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 })
    }

    // Auto-transition section_intro → question_active after 5 seconds
    if (session.game_state === 'section_intro' && session.section_intro_at) {
      const elapsed = Date.now() - new Date(session.section_intro_at).getTime()
      if (elapsed >= 5000) {
        const now = new Date().toISOString()
        await supabase
          .from('game_sessions')
          .update({ game_state: 'question_active', question_started_at: now })
          .eq('id', gameId)
        // Mutate local session so the rest of the handler sees the updated state
        session.game_state = 'question_active'
        ;(session as Record<string, unknown>).question_started_at = now
      }
    }

    // If playerId provided, verify the player belongs to this session
    if (playerId) {
      const { data: playerCheck } = await supabase
        .from('players')
        .select('id')
        .eq('id', playerId)
        .eq('game_session_id', gameId)
        .maybeSingle()

      if (!playerCheck) {
        return NextResponse.json({ error: 'Player not found in this session' }, { status: 403 })
      }
    }

    // Fetch all players sorted by total_score desc
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('id, game_session_id, display_name, total_score, avatar_color, joined_at')
      .eq('game_session_id', gameId)
      .order('total_score', { ascending: false })

    if (playersError) {
      console.error('Players fetch error:', playersError)
      return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 })
    }

    // Fetch current question with answer options (no is_correct field)
    let question: PublicQuestion | null = null

    if (session.game_state !== 'finished') {
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id, quiz_id, question_text, image_url, timer_seconds, points, display_order, question_type, section_title')
        .eq('quiz_id', session.quiz_id)
        .order('display_order', { ascending: true })

      if (questionsError) {
        console.error('Questions fetch error:', questionsError)
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
      }

      const currentQuestion = questions?.[session.current_question_index] ?? null

      if (currentQuestion) {
        if (currentQuestion.question_type === 'open_text') {
          question = { ...currentQuestion, answer_options: [] }
        } else {
          // Fetch answer options without is_correct
          const { data: answerOptions, error: optionsError } = await supabase
            .from('answer_options')
            .select('id, question_id, answer_text, display_order')
            .eq('question_id', currentQuestion.id)
            .order('display_order', { ascending: true })

          if (optionsError) {
            console.error('Answer options fetch error:', optionsError)
            return NextResponse.json({ error: 'Failed to fetch answer options' }, { status: 500 })
          }

          // Shuffle so the correct answer isn't always in the same position
          const shuffled = [...(answerOptions ?? [])]
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
          }

          question = { ...currentQuestion, answer_options: shuffled }
        }
      }
    }

    // Determine leaderboard, correctAnswerId, and wordCloud based on state
    let leaderboard: LeaderboardEntry[] | null = null
    let correctAnswerId: string | null = null
    let wordCloud: WordCloudEntry[] | null = null

    const revealStates = ['question_results', 'leaderboard', 'finished']
    if (revealStates.includes(session.game_state)) {
      correctAnswerId = session.correct_answer_id

      // For open_text questions, aggregate free-text responses into a word cloud
      if (question?.question_type === 'open_text') {
        const { data: textResponses } = await supabase
          .from('player_responses')
          .select('free_text_response')
          .eq('question_id', question.id)
          .not('free_text_response', 'is', null)

        const counts: Record<string, number> = {}
        for (const r of textResponses ?? []) {
          const key = (r.free_text_response as string).trim().toLowerCase()
          if (key) counts[key] = (counts[key] ?? 0) + 1
        }
        wordCloud = Object.entries(counts)
          .map(([text, count]) => ({ text, count }))
          .sort((a, b) => b.count - a.count)
      }

      // Fetch the latest leaderboard snapshot
      const { data: snapshot } = await supabase
        .from('leaderboard_snapshots')
        .select('snapshot_data')
        .eq('game_session_id', gameId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (snapshot?.snapshot_data) {
        leaderboard = snapshot.snapshot_data as LeaderboardEntry[]
      } else {
        // Fallback: build leaderboard from current player scores
        leaderboard = (players ?? []).map((p, index) => ({
          player_id: p.id,
          display_name: p.display_name,
          avatar_color: p.avatar_color,
          total_score: p.total_score,
          rank: index + 1,
        }))
      }
    }

    const response: GameStateResponse = {
      session,
      question,
      players: players ?? [],
      playerCount: players?.length ?? 0,
      leaderboard,
      correctAnswerId,
      wordCloud,
    }

    return NextResponse.json(response)
  } catch (err) {
    console.error('Unexpected error in GET /api/game/[gameId]/state:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
