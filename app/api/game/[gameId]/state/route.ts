import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { GameStateResponse, LeaderboardEntry, PublicQuestion, QuestionType, WordCloudEntry } from '@/types/database'

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
        'id, quiz_id, join_code, game_state, current_question_index, question_started_at, section_intro_at, state_changed_at, correct_answer_id, started_at, completed_at, created_at'
      )
      .eq('id', gameId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 })
    }

    // ---- Server-side auto-transitions ----
    // Each block checks elapsed time for the current state and transitions if the deadline passed.
    // Blocks run top-to-bottom; if one fires it mutates the local session so subsequent blocks
    // see the updated state but (since timestamps are fresh) won't immediately fire again.

    // Block A: section_intro → question_active (5 s)
    if (session.game_state === 'section_intro' && session.section_intro_at) {
      const elapsed = Date.now() - new Date(session.section_intro_at).getTime()
      if (elapsed >= 5000) {
        const now = new Date().toISOString()
        await supabase
          .from('game_sessions')
          .update({ game_state: 'question_active', question_started_at: now, state_changed_at: now })
          .eq('id', gameId)
        session.game_state = 'question_active'
        ;(session as Record<string, unknown>).question_started_at = now
        ;(session as Record<string, unknown>).state_changed_at = now
      }
    }

    // Block B: question_results → leaderboard (5 s)
    if (session.game_state === 'question_results' && session.state_changed_at) {
      const elapsed = Date.now() - new Date(session.state_changed_at).getTime()
      if (elapsed >= 5000) {
        const now = new Date().toISOString()

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

        const { data: lbPlayers } = await supabase
          .from('players')
          .select('id, display_name, avatar_color, total_score')
          .eq('game_session_id', gameId)
          .order('total_score', { ascending: false })

        const leaderboardEntries: LeaderboardEntry[] = (lbPlayers ?? []).map((p, index) => ({
          player_id: p.id,
          display_name: p.display_name,
          avatar_color: p.avatar_color,
          total_score: p.total_score,
          rank: index + 1,
          score_change: p.total_score - (prevScoreMap.get(p.id) ?? 0),
        }))

        await supabase.from('leaderboard_snapshots').insert({
          game_session_id: gameId,
          question_index: session.current_question_index,
          snapshot_data: leaderboardEntries,
        })

        await supabase
          .from('game_sessions')
          .update({ game_state: 'leaderboard', state_changed_at: now })
          .eq('id', gameId)

        session.game_state = 'leaderboard'
        ;(session as Record<string, unknown>).state_changed_at = now
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

    // Fetch all questions (needed for auto-transitions C & D, and for question display)
    type QuestionRow = {
      id: string; quiz_id: string; question_text: string; image_url: string | null
      image_reveal: 'before' | 'after'; timer_seconds: number; points: number
      display_order: number; question_type: QuestionType; section_title: string | null
    }
    let questions: QuestionRow[] | null = null
    let currentQuestion: QuestionRow | null = null

    if (session.game_state !== 'finished') {
      const { data: qs, error: questionsError } = await supabase
        .from('questions')
        .select('id, quiz_id, question_text, image_url, image_reveal, timer_seconds, points, display_order, question_type, section_title')
        .eq('quiz_id', session.quiz_id)
        .order('display_order', { ascending: true })

      if (questionsError) {
        console.error('Questions fetch error:', questionsError)
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
      }

      questions = (qs ?? []) as QuestionRow[]
      currentQuestion = questions[session.current_question_index] ?? null
    }

    // Block C: question_active → question_results (when question timer expires)
    if (session.game_state === 'question_active' && session.question_started_at && currentQuestion) {
      const elapsed = Date.now() - new Date(session.question_started_at).getTime()
      if (elapsed >= currentQuestion.timer_seconds * 1000) {
        const now = new Date().toISOString()
        let correctAnswerId: string | null = null

        if (currentQuestion.question_type !== 'open_text') {
          const { data: correctOption } = await supabase
            .from('answer_options')
            .select('id')
            .eq('question_id', currentQuestion.id)
            .eq('is_correct', true)
            .single()
          correctAnswerId = correctOption?.id ?? null
        }

        await supabase
          .from('game_sessions')
          .update({ game_state: 'question_results', correct_answer_id: correctAnswerId, state_changed_at: now })
          .eq('id', gameId)

        session.game_state = 'question_results'
        ;(session as Record<string, unknown>).correct_answer_id = correctAnswerId
        ;(session as Record<string, unknown>).state_changed_at = now

        // Award open-text points based on word-cloud frequency (Family Feud style)
        if (currentQuestion.question_type === 'open_text') {
          const { data: allResponses } = await supabase
            .from('player_responses')
            .select('id, player_id, free_text_response, players!inner(game_session_id)')
            .eq('question_id', currentQuestion.id)
            .eq('players.game_session_id', gameId)
            .not('free_text_response', 'is', null)

          if (allResponses && allResponses.length > 0) {
            const counts: Record<string, number> = {}
            for (const r of allResponses) {
              const key = (r.free_text_response as string).trim().toLowerCase()
              if (key) counts[key] = (counts[key] ?? 0) + 1
            }
            const maxCount = Math.max(...Object.values(counts))

            // Per player: find the submission with the highest frequency
            const playerBest: Record<string, { id: string; count: number }> = {}
            for (const r of allResponses) {
              const key = (r.free_text_response as string).trim().toLowerCase()
              const count = counts[key] ?? 0
              if (!playerBest[r.player_id] || count > playerBest[r.player_id].count) {
                playerBest[r.player_id] = { id: r.id, count }
              }
            }

            for (const [playerId, { id: responseId, count }] of Object.entries(playerBest)) {
              const awardedPoints = Math.floor(currentQuestion.points * count / maxCount)
              if (awardedPoints > 0) {
                await supabase
                  .from('player_responses')
                  .update({ awarded_points: awardedPoints })
                  .eq('id', responseId)
                const { data: pl } = await supabase
                  .from('players').select('total_score').eq('id', playerId).single()
                await supabase
                  .from('players')
                  .update({ total_score: (pl?.total_score ?? 0) + awardedPoints })
                  .eq('id', playerId)
              }
            }
          }
        }

        supabase.from('analytics_events').insert({
          event_type: 'question_completed',
          game_session_id: gameId,
          metadata: {
            question_index: session.current_question_index,
            question_id: currentQuestion.id,
            correct_answer_id: correctAnswerId,
          },
        }).then(({ error }) => { if (error) console.warn('Analytics event failed:', error.message) })
      }
    }

    // Block D: leaderboard → next question / section_intro / finished (8 s)
    if (session.game_state === 'leaderboard' && session.state_changed_at && questions) {
      const elapsed = Date.now() - new Date(session.state_changed_at).getTime()
      if (elapsed >= 8000) {
        const now = new Date().toISOString()
        const nextIndex = session.current_question_index + 1

        if (nextIndex >= questions.length) {
          await supabase
            .from('game_sessions')
            .update({ game_state: 'finished', completed_at: now })
            .eq('id', gameId)
          session.game_state = 'finished'

          supabase.from('analytics_events').insert({
            event_type: 'game_finished',
            game_session_id: gameId,
            metadata: { total_questions: questions.length, completed_at: now },
          }).then(({ error }) => { if (error) console.warn('Analytics event failed:', error.message) })
        } else {
          const currentSection = questions[session.current_question_index]?.section_title ?? null
          const nextSection = questions[nextIndex]?.section_title ?? null
          const isNewSection = nextSection !== null && nextSection !== currentSection

          if (isNewSection) {
            await supabase
              .from('game_sessions')
              .update({
                game_state: 'section_intro',
                current_question_index: nextIndex,
                question_started_at: null,
                correct_answer_id: null,
                section_intro_at: now,
                state_changed_at: now,
              })
              .eq('id', gameId)
            session.game_state = 'section_intro'
            session.current_question_index = nextIndex
            ;(session as Record<string, unknown>).question_started_at = null
            ;(session as Record<string, unknown>).section_intro_at = now
            ;(session as Record<string, unknown>).state_changed_at = now
            currentQuestion = questions[nextIndex] ?? null
          } else {
            await supabase
              .from('game_sessions')
              .update({
                game_state: 'question_active',
                current_question_index: nextIndex,
                question_started_at: now,
                correct_answer_id: null,
                state_changed_at: now,
              })
              .eq('id', gameId)
            session.game_state = 'question_active'
            session.current_question_index = nextIndex
            ;(session as Record<string, unknown>).question_started_at = now
            ;(session as Record<string, unknown>).state_changed_at = now
            currentQuestion = questions[nextIndex] ?? null

            supabase.from('analytics_events').insert({
              event_type: 'question_started',
              game_session_id: gameId,
              metadata: { question_index: nextIndex },
            }).then(({ error }) => { if (error) console.warn('Analytics event failed:', error.message) })
          }
        }
      }
    }

    // Build public question with answer options (no is_correct)
    let question: PublicQuestion | null = null

    if (currentQuestion && session.game_state !== 'finished') {
      if (currentQuestion.question_type === 'open_text') {
        question = { ...currentQuestion, answer_options: [] }
      } else {
        const { data: answerOptions, error: optionsError } = await supabase
          .from('answer_options')
          .select('id, question_id, answer_text, display_order')
          .eq('question_id', currentQuestion.id)
          .order('display_order', { ascending: true })

        if (optionsError) {
          console.error('Answer options fetch error:', optionsError)
          return NextResponse.json({ error: 'Failed to fetch answer options' }, { status: 500 })
        }

        // Shuffle deterministically using gameId + questionId as seed so every
        // client polling this endpoint sees the same colour→answer mapping.
        const seed = [...`${gameId}${currentQuestion.id}`].reduce(
          (h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0
        )
        const shuffled = [...(answerOptions ?? [])]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const x = Math.sin(seed + i) * 10000
          const j = Math.floor((x - Math.floor(x)) * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }

        question = { ...currentQuestion, answer_options: shuffled }
      }
    }

    // Determine leaderboard, correctAnswerId, and wordCloud based on state
    let leaderboard: LeaderboardEntry[] | null = null
    let correctAnswerId: string | null = null
    let wordCloud: WordCloudEntry[] | null = null

    const revealStates = ['question_results', 'leaderboard', 'finished']
    if (revealStates.includes(session.game_state)) {
      correctAnswerId = session.correct_answer_id
    }

    // Build word cloud for open_text questions during active play AND results
    if (question?.question_type === 'open_text' &&
        (revealStates.includes(session.game_state) || session.game_state === 'question_active')) {
      const { data: textResponses } = await supabase
        .from('player_responses')
        .select('free_text_response, players!inner(game_session_id)')
        .eq('question_id', question.id)
        .eq('players.game_session_id', gameId)
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

    if (revealStates.includes(session.game_state)) {

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
