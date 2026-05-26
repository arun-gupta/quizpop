-- Allow multiple free-text submissions per player per question.
-- Replace the broad unique constraint with a partial one that only applies
-- to multiple-choice answers (selected_answer_id IS NOT NULL).
ALTER TABLE player_responses
  DROP CONSTRAINT IF EXISTS player_responses_player_id_question_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS player_responses_mc_unique
  ON player_responses(player_id, question_id)
  WHERE selected_answer_id IS NOT NULL;
