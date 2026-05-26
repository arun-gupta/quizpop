-- Ensure question_type exists on questions (may be missing if 20250526000000 was only
-- marked applied via 'migration repair' rather than actually executed)
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS question_type text NOT NULL DEFAULT 'multiple_choice'
    CHECK (question_type IN ('multiple_choice', 'open_text'));

-- Ensure free_text_response exists on player_responses
ALTER TABLE player_responses
  ADD COLUMN IF NOT EXISTS free_text_response text;

-- Ensure selected_answer_id is nullable
ALTER TABLE player_responses
  ALTER COLUMN selected_answer_id DROP NOT NULL;

-- Ensure section_title exists on questions
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS section_title text;

-- Ensure section_intro_at exists on game_sessions
ALTER TABLE game_sessions
  ADD COLUMN IF NOT EXISTS section_intro_at timestamptz;

-- Ensure state_changed_at exists on game_sessions
ALTER TABLE game_sessions
  ADD COLUMN IF NOT EXISTS state_changed_at timestamptz;
