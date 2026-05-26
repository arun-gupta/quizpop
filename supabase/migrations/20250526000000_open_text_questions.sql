-- Add question_type to questions
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS question_type text NOT NULL DEFAULT 'multiple_choice'
    CHECK (question_type IN ('multiple_choice', 'open_text'));

-- Add free_text_response to player_responses
ALTER TABLE player_responses
  ADD COLUMN IF NOT EXISTS free_text_response text;

-- Make selected_answer_id nullable (open_text questions have no answer options)
ALTER TABLE player_responses
  ALTER COLUMN selected_answer_id DROP NOT NULL;
