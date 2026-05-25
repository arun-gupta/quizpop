window.BENCHMARK_DATA = {
  "lastUpdate": 1779724368724,
  "repoUrl": "https://github.com/arun-gupta/quizpop",
  "entries": {
    "QuizPop API Latency": [
      {
        "commit": {
          "author": {
            "email": "arun.gupta@gmail.com",
            "name": "Arun Gupta",
            "username": "arun-gupta"
          },
          "committer": {
            "email": "arun.gupta@gmail.com",
            "name": "Arun Gupta",
            "username": "arun-gupta"
          },
          "distinct": true,
          "id": "88fd138051f2a8b55cc1ff823838393332cc2599",
          "message": "Fix perf workflow: gh-pages branch + Vercel polling for project tokens\n\n- Create gh-pages branch (benchmark-action needs it to exist)\n- Vercel polling: project-scoped tokens (vcp_) can't filter by SHA via\n  the account deployments API; fall back to checking latest deployment\n  state when no SHA match is found\n- Timeout is now non-fatal (continues to load test) so transient\n  Vercel API issues don't block perf results\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T08:51:45-07:00",
          "tree_id": "2b28d6e3556e7a1b52e9ca963eeceadae93cd852",
          "url": "https://github.com/arun-gupta/quizpop/commit/88fd138051f2a8b55cc1ff823838393332cc2599"
        },
        "date": 1779724368292,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1473,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1665,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1882,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2570,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1678,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1899,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2269,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3263,
            "unit": "ms"
          }
        ]
      }
    ]
  }
}