ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS state_changed_at timestamptz;
