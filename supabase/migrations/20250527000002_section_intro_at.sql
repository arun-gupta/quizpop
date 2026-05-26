ALTER TABLE game_sessions
  ADD COLUMN IF NOT EXISTS section_intro_at timestamptz;
