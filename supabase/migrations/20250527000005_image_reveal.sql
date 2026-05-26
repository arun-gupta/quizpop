ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS image_reveal text NOT NULL DEFAULT 'before'
    CHECK (image_reveal IN ('before', 'after'));
