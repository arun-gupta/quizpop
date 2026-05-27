-- Add 'poll' as a valid question_type by dropping and recreating the CHECK constraint
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_question_type_check;
ALTER TABLE questions
  ADD CONSTRAINT questions_question_type_check
  CHECK (question_type IN ('multiple_choice', 'open_text', 'poll'));
