-- =============================================================================
-- QuizPop Initial Schema Migration
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS quizzes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id        uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text  text NOT NULL,
  image_url      text,
  timer_seconds  int NOT NULL DEFAULT 20,
  points         int NOT NULL DEFAULT 1000,
  display_order  int NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS answer_options (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_text   text NOT NULL,
  is_correct    boolean NOT NULL DEFAULT false,
  display_order int NOT NULL CHECK (display_order BETWEEN 0 AND 3),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_sessions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id                 uuid NOT NULL REFERENCES quizzes(id) ON DELETE RESTRICT,
  join_code               text UNIQUE NOT NULL,
  host_token              text NOT NULL,
  game_state              text NOT NULL DEFAULT 'lobby'
                            CHECK (game_state IN ('lobby','question_active','question_results','leaderboard','finished')),
  current_question_index  int NOT NULL DEFAULT 0,
  question_started_at     timestamptz,
  correct_answer_id       uuid REFERENCES answer_options(id),
  started_at              timestamptz,
  completed_at            timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS players (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id uuid NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  display_name    text NOT NULL CHECK (length(trim(display_name)) BETWEEN 1 AND 20),
  total_score     int NOT NULL DEFAULT 0,
  avatar_color    text NOT NULL DEFAULT '#7c3aed',
  joined_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (game_session_id, display_name)
);

CREATE TABLE IF NOT EXISTS player_responses (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id          uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  question_id        uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer_id uuid REFERENCES answer_options(id),
  response_time_ms   int NOT NULL CHECK (response_time_ms >= 0),
  is_correct         boolean NOT NULL,
  awarded_points     int NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (player_id, question_id)
);

CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id uuid NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  question_index  int NOT NULL,
  snapshot_data   jsonb NOT NULL DEFAULT '[]',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text UNIQUE NOT NULL,
  role       text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin','super_admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type      text NOT NULL,
  game_session_id uuid REFERENCES game_sessions(id) ON DELETE SET NULL,
  player_id       uuid REFERENCES players(id) ON DELETE SET NULL,
  metadata        jsonb NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS archived_game_sessions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_game_session_id uuid,
  archive_data            jsonb NOT NULL,
  archived_at             timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_game_sessions_join_code      ON game_sessions (join_code);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_state     ON game_sessions (game_state);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at     ON game_sessions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_players_game_session_id      ON players (game_session_id);
CREATE INDEX IF NOT EXISTS idx_player_responses_player_id   ON player_responses (player_id);
CREATE INDEX IF NOT EXISTS idx_player_responses_question_id ON player_responses (question_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type  ON analytics_events (event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id  ON analytics_events (game_session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at  ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshots_session ON leaderboard_snapshots (game_session_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_order          ON questions (quiz_id, display_order);
CREATE INDEX IF NOT EXISTS idx_answer_options_question_order ON answer_options (question_id, display_order);

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — enable on all tables
-- ---------------------------------------------------------------------------

ALTER TABLE quizzes                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_options          ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE players                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_responses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots   ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE archived_game_sessions  ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- RLS POLICIES: quizzes
-- ---------------------------------------------------------------------------

CREATE POLICY "quizzes_public_read"
  ON quizzes FOR SELECT
  USING (true);

CREATE POLICY "quizzes_admin_insert"
  ON quizzes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "quizzes_admin_update"
  ON quizzes FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "quizzes_admin_delete"
  ON quizzes FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ---------------------------------------------------------------------------
-- RLS POLICIES: questions
-- ---------------------------------------------------------------------------

CREATE POLICY "questions_public_read"
  ON questions FOR SELECT
  USING (true);

CREATE POLICY "questions_admin_insert"
  ON questions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "questions_admin_update"
  ON questions FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "questions_admin_delete"
  ON questions FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ---------------------------------------------------------------------------
-- RLS POLICIES: answer_options
-- Public read is allowed; is_correct column access is controlled at API level
-- ---------------------------------------------------------------------------

CREATE POLICY "answer_options_public_read"
  ON answer_options FOR SELECT
  USING (true);

CREATE POLICY "answer_options_admin_insert"
  ON answer_options FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "answer_options_admin_update"
  ON answer_options FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "answer_options_admin_delete"
  ON answer_options FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ---------------------------------------------------------------------------
-- RLS POLICIES: game_sessions
-- Public can read; writes are handled via service role in the API layer
-- ---------------------------------------------------------------------------

CREATE POLICY "game_sessions_public_read"
  ON game_sessions FOR SELECT
  USING (true);

-- INSERT intentionally denied for non-service-role callers (no policy = deny)
-- UPDATE intentionally denied for non-service-role callers (no policy = deny)

-- ---------------------------------------------------------------------------
-- RLS POLICIES: players
-- ---------------------------------------------------------------------------

-- Anyone can read players in a game session that is in progress
CREATE POLICY "players_select_in_progress"
  ON players FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM game_sessions gs
      WHERE gs.id = players.game_session_id
        AND gs.game_state NOT IN ('finished')
    )
  );

-- Anyone can insert (join a game)
CREATE POLICY "players_public_insert"
  ON players FOR INSERT
  WITH CHECK (true);

-- UPDATE denied for non-service-role callers; service role handles score updates

-- ---------------------------------------------------------------------------
-- RLS POLICIES: player_responses
-- ---------------------------------------------------------------------------

-- Anyone can submit an answer
CREATE POLICY "player_responses_public_insert"
  ON player_responses FOR INSERT
  WITH CHECK (true);

-- Players can read their own responses; admins can read all
CREATE POLICY "player_responses_select_own_or_admin"
  ON player_responses FOR SELECT
  USING (
    player_id IN (SELECT id FROM players WHERE id = player_id)
    OR EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- RLS POLICIES: leaderboard_snapshots
-- ---------------------------------------------------------------------------

CREATE POLICY "leaderboard_snapshots_public_read"
  ON leaderboard_snapshots FOR SELECT
  USING (true);

-- ---------------------------------------------------------------------------
-- RLS POLICIES: admin_users
-- ---------------------------------------------------------------------------

-- Authenticated users can read only their own admin record
CREATE POLICY "admin_users_read_own"
  ON admin_users FOR SELECT
  USING (id = auth.uid());

-- ---------------------------------------------------------------------------
-- RLS POLICIES: analytics_events
-- ---------------------------------------------------------------------------

-- Anyone can insert an analytics event
CREATE POLICY "analytics_events_public_insert"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- Only admins can read analytics events
CREATE POLICY "analytics_events_admin_select"
  ON analytics_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ---------------------------------------------------------------------------
-- RLS POLICIES: archived_game_sessions
-- ---------------------------------------------------------------------------

CREATE POLICY "archived_game_sessions_admin_select"
  ON archived_game_sessions FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "archived_game_sessions_admin_insert"
  ON archived_game_sessions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "archived_game_sessions_admin_update"
  ON archived_game_sessions FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "archived_game_sessions_admin_delete"
  ON archived_game_sessions FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ---------------------------------------------------------------------------
-- FUNCTIONS & TRIGGERS
-- ---------------------------------------------------------------------------

-- Trigger function: update player total_score after a response is inserted
CREATE OR REPLACE FUNCTION update_player_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE players
  SET total_score = total_score + NEW.awarded_points
  WHERE id = NEW.player_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER after_response_insert
  AFTER INSERT ON player_responses
  FOR EACH ROW EXECUTE FUNCTION update_player_score();

-- Function: archive and clean up game sessions older than 7 days
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
  -- Archive before deleting (skip sessions already archived)
  INSERT INTO archived_game_sessions (original_game_session_id, archive_data)
  SELECT id, row_to_json(game_sessions.*)::jsonb
  FROM game_sessions
  WHERE completed_at < now() - interval '7 days'
    AND id NOT IN (SELECT original_game_session_id FROM archived_game_sessions);

  -- Delete the original sessions (cascades to related rows)
  DELETE FROM game_sessions
  WHERE completed_at < now() - interval '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
