import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { LeaderboardEntry } from '@/types/database'

type NextAction = 'reveal' | 'leaderboard' | 'next' | 'finish'

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
    const { hostToken, action } = body as { hostToken: string; action: NextAction }

    if (!hostToken || typeof hostToken !== 'string') {
      return NextResponse.json({ error: 'hostToken required' }, { status: 400 })
    }

    const validActions: NextAction[] = ['reveal', 'leaderboard', 'next', 'finish']
    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        { error: `action must be one of: ${validActions.join(', ')}` },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Fetch game session including host_token for verification
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('id, quiz_id, host_token, game_state, current_question_index')
      .eq('id', gameId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 })
    }

    // Verify host token
    if (session.host_token !== hostToken) {
      return NextResponse.json({ error: 'Unauthorized: invalid host token' }, { status: 401 })
    }

    // -------------------------------------------------------------------------
    // Action: 'reveal' — question_active → question_results
    // -------------------------------------------------------------------------
    if (action === 'reveal') {
      if (session.game_state !== 'question_active') {
        return NextResponse.json(
          { error: `Cannot reveal: expected 'question_active', got '${session.game_state}'` },
          { status: 409 }
        )
      }

      // Get the current question (including type)
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id, question_type')
        .eq('quiz_id', session.quiz_id)
        .order('display_order', { ascending: true })

      if (questionsError || !questions || questions.length === 0) {
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
      }

      const currentQuestion = questions[session.current_question_index]
      if (!currentQuestion) {
        return NextResponse.json({ error: 'Current question not found' }, { status: 500 })
      }

      let correctAnswerId: string | null = null

      if (currentQuestion.question_type !== 'open_text') {
        // Multiple choice: find the correct answer option
        const { data: correctOption, error: optionError } = await supabase
          .from('answer_options')
          .select('id')
          .eq('question_id', currentQuestion.id)
          .eq('is_correct', true)
          .single()

        if (optionError || !correctOption) {
          console.error('Correct answer lookup error:', optionError)
          return NextResponse.json({ error: 'Failed to find correct answer' }, { status: 500 })
        }
        correctAnswerId = correctOption.id
      }

      // Transition to question_results
      const { error: updateError } = await supabase
        .from('game_sessions')
        .update({
          game_state: 'question_results',
          correct_answer_id: correctAnswerId,
        })
        .eq('id', gameId)

      if (updateError) {
        console.error('Session update error:', updateError)
        return NextResponse.json({ error: 'Failed to reveal question results' }, { status: 500 })
      }

      // Log analytics (best-effort)
      supabase.from('analytics_events').insert({
        event_type: 'question_completed',
        game_session_id: gameId,
        metadata: {
          question_index: session.current_question_index,
          question_id: currentQuestion.id,
          correct_answer_id: correctAnswerId,
        },
      }).then(({ error }) => {
        if (error) console.warn('Analytics event failed:', error.message)
      })

      return NextResponse.json({ success: true, correctAnswerId })
    }

    // -------------------------------------------------------------------------
    // Action: 'leaderboard' — question_results → leaderboard
    // -------------------------------------------------------------------------
    if (action === 'leaderboard') {
      if (session.game_state !== 'question_results') {
        return NextResponse.json(
          { error: `Cannot show leaderboard: expected 'question_results', got '${session.game_state}'` },
          { status: 409 }
        )
      }

      // Fetch previous leaderboard snapshot for score_change calculation
      const { data: prevSnapshot } = await supabase
        .from('leaderboard_snapshots')
        .select('snapshot_data')
        .eq('game_session_id', gameId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const prevLeaderboard = (prevSnapshot?.snapshot_data ?? []) as LeaderboardEntry[]
      const prevScoreMap = new Map<string, number>(
        prevLeaderboard.map((e) => [e.player_id, e.total_score])
      )

      // Get players sorted by total_score desc
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('id, display_name, avatar_color, total_score')
        .eq('game_session_id', gameId)
        .order('total_score', { ascending: false })

      if (playersError || !players) {
        console.error('Players fetch error:', playersError)
        return NextResponse.json({ error: 'Failed to fetch players for leaderboard' }, { status: 500 })
      }

      const leaderboardEntries: LeaderboardEntry[] = players.map((p, index) => ({
        player_id: p.id,
        display_name: p.display_name,
        avatar_color: p.avatar_color,
        total_score: p.total_score,
        rank: index + 1,
        score_change: p.total_score - (prevScoreMap.get(p.id) ?? 0),
      }))

      // Insert leaderboard snapshot
      const { error: snapshotError } = await supabase
        .from('leaderboard_snapshots')
        .insert({
          game_session_id: gameId,
          question_index: session.current_question_index,
          snapshot_data: leaderboardEntries,
        })

      if (snapshotError) {
        console.error('Leaderboard snapshot insert error:', snapshotError)
        // Non-fatal: continue even if snapshot fails
      }

      // Transition to leaderboard state
      const { error: updateError } = await supabase
        .from('game_sessions')
        .update({ game_state: 'leaderboard' })
        .eq('id', gameId)

      if (updateError) {
        console.error('Session update error:', updateError)
        return NextResponse.json({ error: 'Failed to show leaderboard' }, { status: 500 })
      }

      return NextResponse.json({ success: true, leaderboard: leaderboardEntries })
    }

    // -------------------------------------------------------------------------
    // Action: 'next' — leaderboard → question_active OR finished
    // -------------------------------------------------------------------------
    if (action === 'next') {
      if (session.game_state !== 'leaderboard') {
        return NextResponse.json(
          { error: `Cannot advance to next question: expected 'leaderboard', got '${session.game_state}'` },
          { status: 409 }
        )
      }

      // Get total question count
      const { count: totalQuestions, error: countError } = await supabase
        .from('questions')
        .select('id', { count: 'exact', head: true })
        .eq('quiz_id', session.quiz_id)

      if (countError || totalQuestions === null) {
        console.error('Question count error:', countError)
        return NextResponse.json({ error: 'Failed to get question count' }, { status: 500 })
      }

      const nextIndex = session.current_question_index + 1
      const isLastQuestion = nextIndex >= totalQuestions

      const now = new Date().toISOString()

      if (isLastQuestion) {
        // No more questions — transition to finished
        const { error: updateError } = await supabase
          .from('game_sessions')
          .update({
            game_state: 'finished',
            completed_at: now,
          })
          .eq('id', gameId)

        if (updateError) {
          console.error('Session update error:', updateError)
          return NextResponse.json({ error: 'Failed to finish game' }, { status: 500 })
        }

        // Log analytics (best-effort)
        supabase.from('analytics_events').insert({
          event_type: 'game_finished',
          game_session_id: gameId,
          metadata: { total_questions: totalQuestions, completed_at: now },
        }).then(({ error }) => {
          if (error) console.warn('Analytics event failed:', error.message)
        })

        return NextResponse.json({ success: true, gameState: 'finished' })
      }

      // Advance to next question
      const { error: updateError } = await supabase
        .from('game_sessions')
        .update({
          game_state: 'question_active',
          current_question_index: nextIndex,
          question_started_at: now,
          correct_answer_id: null,
        })
        .eq('id', gameId)

      if (updateError) {
        console.error('Session update error:', updateError)
        return NextResponse.json({ error: 'Failed to advance to next question' }, { status: 500 })
      }

      // Log analytics (best-effort)
      supabase.from('analytics_events').insert({
        event_type: 'question_started',
        game_session_id: gameId,
        metadata: { question_index: nextIndex },
      }).then(({ error }) => {
        if (error) console.warn('Analytics event failed:', error.message)
      })

      return NextResponse.json({
        success: true,
        gameState: 'question_active',
        questionIndex: nextIndex,
      })
    }

    // -------------------------------------------------------------------------
    // Action: 'finish' — force-end the game from any state
    // -------------------------------------------------------------------------
    if (action === 'finish') {
      if (session.game_state === 'finished') {
        return NextResponse.json({ error: 'Game is already finished' }, { status: 409 })
      }

      const now = new Date().toISOString()

      // Get players sorted by score for final snapshot
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('id, display_name, avatar_color, total_score')
        .eq('game_session_id', gameId)
        .order('total_score', { ascending: false })

      if (playersError) {
        console.error('Players fetch error:', playersError)
        // Non-fatal: continue with finish
      }

      if (players && players.length > 0) {
        const finalLeaderboard: LeaderboardEntry[] = players.map((p, index) => ({
          player_id: p.id,
          display_name: p.display_name,
          avatar_color: p.avatar_color,
          total_score: p.total_score,
          rank: index + 1,
        }))

        // Insert final leaderboard snapshot
        await supabase.from('leaderboard_snapshots').insert({
          game_session_id: gameId,
          question_index: session.current_question_index,
          snapshot_data: finalLeaderboard,
        }).then(({ error }) => {
          if (error) console.warn('Final snapshot insert failed:', error.message)
        })
      }

      // Transition to finished
      const { error: updateError } = await supabase
        .from('game_sessions')
        .update({
          game_state: 'finished',
          completed_at: now,
        })
        .eq('id', gameId)

      if (updateError) {
        console.error('Session update error:', updateError)
        return NextResponse.json({ error: 'Failed to finish game' }, { status: 500 })
      }

      // Log analytics (best-effort)
      supabase.from('analytics_events').insert({
        event_type: 'game_finished',
        game_session_id: gameId,
        metadata: {
          forced: true,
          question_index: session.current_question_index,
          completed_at: now,
        },
      }).then(({ error }) => {
        if (error) console.warn('Analytics event failed:', error.message)
      })

      return NextResponse.json({ success: true, gameState: 'finished' })
    }

    // Should never reach here due to earlier validation
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Unexpected error in POST /api/game/[gameId]/next:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
