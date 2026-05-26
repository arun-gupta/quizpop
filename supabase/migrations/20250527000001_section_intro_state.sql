-- Add section_intro to the game_state check constraint
ALTER TABLE game_sessions
  DROP CONSTRAINT IF EXISTS game_sessions_game_state_check;

ALTER TABLE game_sessions
  ADD CONSTRAINT game_sessions_game_state_check
    CHECK (game_state IN ('lobby', 'question_active', 'question_results', 'leaderboard', 'section_intro', 'finished'));
