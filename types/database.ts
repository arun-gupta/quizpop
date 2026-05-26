export type GameState = 'lobby' | 'question_active' | 'question_results' | 'leaderboard' | 'finished'

export type QuestionType = 'multiple_choice' | 'open_text'

export interface WordCloudEntry {
  text: string
  count: number
}

export type AdminRole = 'admin' | 'super_admin'

export interface Quiz {
  id: string
  title: string
  description: string | null
  created_at: string
}

export interface Question {
  id: string
  quiz_id: string
  question_text: string
  image_url: string | null
  timer_seconds: number
  points: number
  display_order: number
  question_type: QuestionType
  section_title: string | null
}

export interface AnswerOption {
  id: string
  question_id: string
  answer_text: string
  is_correct: boolean
  display_order: number
}

export interface GameSession {
  id: string
  quiz_id: string
  join_code: string
  host_token: string
  game_state: GameState
  current_question_index: number
  question_started_at: string | null
  correct_answer_id: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
}

export interface Player {
  id: string
  game_session_id: string
  display_name: string
  total_score: number
  avatar_color: string
  joined_at: string
}

export interface PlayerResponse {
  id: string
  player_id: string
  question_id: string
  selected_answer_id: string | null
  free_text_response: string | null
  response_time_ms: number
  is_correct: boolean
  awarded_points: number
  created_at: string
}

export interface LeaderboardSnapshot {
  id: string
  game_session_id: string
  question_index: number
  snapshot_data: LeaderboardEntry[]
  created_at: string
}

export interface LeaderboardEntry {
  player_id: string
  display_name: string
  avatar_color: string
  total_score: number
  rank: number
  score_change?: number
}

export interface AdminUser {
  id: string
  email: string
  role: AdminRole
  created_at: string
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  game_session_id: string | null
  player_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface ArchivedGameSession {
  id: string
  original_game_session_id: string
  archive_data: Record<string, unknown>
  archived_at: string
}

export interface QuizWithQuestions extends Quiz {
  questions: QuestionWithOptions[]
}

export interface QuestionWithOptions extends Question {
  answer_options: AnswerOption[]
}

export interface PublicAnswerOption {
  id: string
  question_id: string
  answer_text: string
  display_order: number
}

export interface PublicQuestion {
  id: string
  quiz_id: string
  question_text: string
  image_url: string | null
  timer_seconds: number
  points: number
  display_order: number
  question_type: QuestionType
  section_title: string | null
  answer_options: PublicAnswerOption[]
}

export interface GameStateResponse {
  session: Omit<GameSession, 'host_token'>
  question: PublicQuestion | null
  players: Player[]
  playerCount: number
  leaderboard: LeaderboardEntry[] | null
  correctAnswerId: string | null
  wordCloud: WordCloudEntry[] | null
}

export interface JoinGameResponse {
  player: Player
  session: Omit<GameSession, 'host_token'>
}
