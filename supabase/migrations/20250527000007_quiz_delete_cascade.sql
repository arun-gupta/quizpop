-- Allow quizzes to be deleted even when game sessions reference them.
-- Deleting a quiz cascades to its game_sessions (and their players, responses, snapshots).
ALTER TABLE game_sessions
  DROP CONSTRAINT IF EXISTS game_sessions_quiz_id_fkey;

ALTER TABLE game_sessions
  ADD CONSTRAINT game_sessions_quiz_id_fkey
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE;
