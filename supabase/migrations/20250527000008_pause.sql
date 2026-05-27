ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS is_paused boolean NOT NULL DEFAULT false;
ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS paused_at timestamptz;
