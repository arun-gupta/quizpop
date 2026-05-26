Build a Kahoot-style multiplayer quiz game called "QuizPop" that can be hosted entirely on the Vercel Hobby/free tier.

Context:
This app is designed for family events, birthday parties, and casual gatherings. The experience should feel fun, fast, lightweight, and reliable for real-world party usage where one host controls the game from a laptop or TV while players join from their phones.

Primary use case:
A birthday party with 20 to 100 simultaneous players.

Tech stack:
- Next.js (latest App Router)
- TypeScript
- Tailwind CSS
- Supabase Postgres
- Supabase Realtime
- Supabase Auth
- Deployable on Vercel Hobby/free tier

Architecture requirement:
The entire app must be deployable on the Vercel Hobby/free tier.

Hosting architecture:
- Deploy the Next.js app on Vercel.
- Use Vercel only for frontend rendering, routing, server actions, and lightweight API routes.
- Do not run a custom WebSocket server on Vercel.
- Do not use Socket.io as the primary realtime solution.

Realtime architecture:
- Use Supabase Realtime for all live synchronization.
- Game state changes should be written to Supabase tables.
- Clients should subscribe to Supabase Realtime channels for:
  - lobby updates
  - player joins
  - current question
  - countdown timer
  - player responses
  - question results
  - leaderboard updates
  - game completion

Database architecture:
Use Supabase Postgres as the source of truth.

Create tables for:
- quizzes
- questions
- answer_options
- game_sessions
- players
- player_responses
- leaderboard_snapshots
- admin_users
- archived_game_sessions
- analytics_events

Suggested schema:

quizzes
- id
- title
- description
- created_at

questions
- id
- quiz_id
- question_text
- image_url
- timer_seconds
- points
- display_order

answer_options
- id
- question_id
- answer_text
- is_correct
- display_order

game_sessions
- id
- quiz_id
- join_code
- game_state
- current_question_index
- started_at
- completed_at

players
- id
- game_session_id
- display_name
- total_score
- joined_at

player_responses
- id
- player_id
- question_id
- selected_answer_id
- response_time_ms
- is_correct
- awarded_points

leaderboard_snapshots
- id
- game_session_id
- snapshot_data
- created_at

admin_users
- id
- email
- role
- created_at

archived_game_sessions
- id
- original_game_session_id
- archive_data
- archived_at

analytics_events
- id
- event_type
- game_session_id
- player_id
- metadata
- created_at

Game states:
- lobby
- question_active
- question_results
- leaderboard
- finished

Core gameplay flow:
1. Host creates or selects a quiz.
2. App generates a short join code.
3. Players join using code and enter their name.
4. Host starts the game.
5. Host screen shows current question and timer.
6. Player screens show answer options.
7. Players answer before timer expires.
8. Scores are calculated based on correctness and speed.
9. Results screen shows correct answer and rankings.
10. Leaderboard appears after each round.
11. Final leaderboard appears at end of game.

Required routes:
- `/`
  - Landing page
  - Buttons:
    - Host Game
    - Join Game

- `/host`
  - Create/select quiz
  - Create game session
  - Start lobby

- `/host/[gameId]`
  - Host control dashboard
  - Fullscreen presentation mode

- `/join`
  - Enter join code
  - Enter display name

- `/play/[gameId]`
  - Player gameplay screen

- `/results/[gameId]`
  - Final leaderboard

- `/admin`
  - Protected admin dashboard

- `/admin/quizzes`
  - Quiz management

- `/admin/analytics`
  - Analytics dashboard

- `/admin/live-games`
  - Live game monitoring

Host features:
- Create session
- Select quiz
- Start game
- Advance to next question
- Reveal results
- Show leaderboard
- End game
- Restart game
- Fullscreen mode

Player features:
- Join during lobby only
- Prevent duplicate names within same session
- Prevent answering twice
- Show waiting screen after answer submission
- Show whether answer was correct
- Display score updates

Admin dashboard requirements:

Authentication:
- Use Supabase Auth for admin login
- Only authenticated admins can access admin pages
- Anonymous players should not require authentication

Admin capabilities:

Game analytics:
- Total games played
- Active live games
- Total players joined
- Average players per game
- Most played quizzes
- Average response times
- Question accuracy percentages
- Peak concurrent players

Live monitoring:
- View active game sessions in realtime
- View connected players
- View current game state
- View answer submission progress
- View server/database health indicators

Quiz management:
- Create quiz
- Edit quiz
- Delete quiz
- Duplicate quiz
- Reorder questions
- Bulk upload quiz JSON
- Preview quiz before publishing

Player management:
- Remove disruptive players
- Rename players if needed
- Reset game session
- End live game session

Data management:
- Export leaderboard results as CSV
- Export quiz definitions as JSON
- Archive completed games
- Delete old sessions

Analytics events to track:
- player_joined
- question_started
- answer_submitted
- question_completed
- leaderboard_viewed
- game_finished

Scoring system:
- Correct answers earn base points
- Faster answers earn bonus points
- Incorrect answers receive zero points

Suggested scoring formula:
awarded_points =
base_points +
speed_bonus

Where:
- base_points = question.points
- speed_bonus scales inversely with response time

Timer behavior:
- Countdown visible on host and player screens
- Default question timer: 20 seconds
- Automatically close submissions when timer expires

UI/UX requirements:
- Bright playful modern design
- Mobile-first player experience
- Large readable typography for TV/projector host screen
- Clear answer buttons with distinct colors
- Smooth transitions and lightweight animations
- Responsive layouts
- Fast load times

Visual style inspiration:
- Kahoot
- Jackbox
- Modern party games

Answer button colors:
- Red
- Blue
- Yellow
- Green

Required components:
- Countdown timer
- Live leaderboard
- Animated score changes
- Join code display
- Player count display
- Answer reveal screen
- Winner celebration screen

Admin UI requirements:
- Responsive dashboard layout
- Realtime analytics updates
- Simple charts and metrics cards
- Search and filtering
- Dark mode support

Suggested admin sections:
- Dashboard
- Live Games
- Quizzes
- Analytics
- Archived Games
- Settings

Nice-to-have features:
- QR code on lobby screen
- Confetti animation on final results
- Sound effects with mute toggle
- Randomized answer order
- Avatar colors for players
- Rejoin support after accidental refresh
- Dark mode
- Live heatmap of answer distributions
- Real-time response graph during questions
- Session replay mode
- Downloadable game reports

Free-tier optimization requirements:
- Keep API routes lightweight
- Avoid long-running server processes
- Avoid polling
- Use realtime subscriptions instead of interval refreshes
- Optimize all images
- Avoid large media uploads
- Avoid expensive server-side computation
- Design for reliable performance on free-tier hosting

Security requirements:
- Validate join codes
- Prevent duplicate submissions
- Sanitize player names
- Rate limit join attempts where appropriate
- Enforce RLS policies for admin-only tables
- Protect admin APIs
- Never expose admin keys client-side
- Separate public gameplay APIs from admin APIs
- Do not expose service role keys to client

Environment variables:
Create `.env.example` with:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

Supabase requirements:
- Include SQL migrations
- Include RLS policies
- Include seed data
- Include indexes where appropriate
- Anonymous gameplay should work without login

Seed content:
Include a sample birthday quiz with 20 funny family-friendly questions.

Example categories:
- Family trivia
- Embarrassing moments
- Who said this?
- Guess the year
- Favorite foods
- Vacation memories
- Rapid-fire fun facts

Developer experience:
- Clean folder structure
- Reusable React components
- Strong typing
- Minimal dependencies
- Clear separation of client/server code
- Comments only where useful
- Production-quality code

Testing:
- Add basic validation tests
- Test multiplayer synchronization
- Test simultaneous answers
- Test leaderboard updates

README requirements:
Include:
- local setup
- Supabase project setup
- SQL migration instructions
- seeding instructions
- running locally
- Vercel deployment steps
- environment variable configuration
- troubleshooting guide

Deployment requirement:
The final app must be runnable locally and deployable directly to Vercel Hobby/free tier with Supabase free tier.

Deliverables:
- Complete Next.js application
- Supabase schema and migrations
- Seed quiz data
- Tailwind styling
- Realtime multiplayer functionality
- Admin dashboard
- Analytics dashboard
- README
- Vercel deployment instructions
- Clean production-ready codebase
