-- Add section_title to questions so quizzes can be grouped into named sections
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS section_title text;
