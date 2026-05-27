window.BENCHMARK_DATA = {
  "lastUpdate": 1779843358672,
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
      },
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
          "id": "206ddc7018013aec14b4357fd2a4d4db1d3a12d1",
          "message": "Add custom perf dashboard and deploy it to gh-pages on every CI run\n\nCopies scripts/perf-report.html to dev/bench/index.html on the gh-pages\nbranch after benchmark-action writes data.js, replacing the default\nbenchmark-action chart with a branded dark-theme dashboard showing\ntrend summary cards, per-metric line charts (50 + 100 players), and\na full run log with linked commit SHAs.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T09:00:42-07:00",
          "tree_id": "16e289c2f0400a66faeed29bfacc81f1ce421825",
          "url": "https://github.com/arun-gupta/quizpop/commit/206ddc7018013aec14b4357fd2a4d4db1d3a12d1"
        },
        "date": 1779724915289,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1677,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1933,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 2297,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2727,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1706,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1914,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2348,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3042,
            "unit": "ms"
          }
        ]
      },
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
          "id": "eba5e979177c5407531bfb0c0bc6b5924087dce9",
          "message": "Split perf dashboard summary cards into 50-player and 100-player rows\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T17:11:31-07:00",
          "tree_id": "6f36347b15b8d3fb13cdf68f52243d87f867e5cb",
          "url": "https://github.com/arun-gupta/quizpop/commit/eba5e979177c5407531bfb0c0bc6b5924087dce9"
        },
        "date": 1779754365433,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 2012,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2265,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 2444,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2987,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1285,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1566,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 1997,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 2656,
            "unit": "ms"
          }
        ]
      },
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
          "id": "3c58503b8302b5b92d9cc99799bf8454042314ee",
          "message": "Add vercel.json to gh-pages branch to prevent Vercel from building it\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T17:17:33-07:00",
          "tree_id": "5c36a3d3255c9b180b59476f09ec7ebfdecd6c53",
          "url": "https://github.com/arun-gupta/quizpop/commit/3c58503b8302b5b92d9cc99799bf8454042314ee"
        },
        "date": 1779754716353,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1966,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2117,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1632,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2217,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1760,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 2252,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 1895,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3214,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Arun Gupta",
            "username": "arun-gupta",
            "email": "arun.gupta@gmail.com"
          },
          "committer": {
            "name": "Arun Gupta",
            "username": "arun-gupta",
            "email": "arun.gupta@gmail.com"
          },
          "id": "3c58503b8302b5b92d9cc99799bf8454042314ee",
          "message": "Add vercel.json to gh-pages branch to prevent Vercel from building it\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T00:17:33Z",
          "url": "https://github.com/arun-gupta/quizpop/commit/3c58503b8302b5b92d9cc99799bf8454042314ee"
        },
        "date": 1779754720290,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1013,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1124,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 2556,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 3394,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1222,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1532,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 1906,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 2554,
            "unit": "ms"
          }
        ]
      },
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
          "id": "a88df097c13c7cd2f92bfa37c16404123b9f6fd8",
          "message": "Fix charts not rendering: replace innerHTML+= with insertAdjacentHTML\n\ninnerHTML += re-serializes the entire DOM on each iteration, destroying\npreviously-created canvas elements and their Chart.js contexts. Only the\nlast chart survived. insertAdjacentHTML('beforeend') appends without\ntouching existing nodes.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T17:21:15-07:00",
          "tree_id": "8efbf9babd5f2a8d445fc8244133b8e50c83a0e5",
          "url": "https://github.com/arun-gupta/quizpop/commit/a88df097c13c7cd2f92bfa37c16404123b9f6fd8"
        },
        "date": 1779754945611,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1665,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1875,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 2038,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2563,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1663,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1912,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2337,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3014,
            "unit": "ms"
          }
        ]
      },
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
          "id": "84b563cf0689ec7b25e4d94e41e2570b8ab26756",
          "message": "Bump GitHub Actions to Node.js 24-compatible versions\n\nactions/checkout@v4.2.2, setup-node@v4.4.0, upload-artifact@v4.6.2\nRequired before June 2 2026 when GitHub moves runners to Node.js 24.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T17:21:57-07:00",
          "tree_id": "4ac43df77a646e5e796e9eda9112b3ca8d0d0c96",
          "url": "https://github.com/arun-gupta/quizpop/commit/84b563cf0689ec7b25e4d94e41e2570b8ab26756"
        },
        "date": 1779754981593,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1648,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1906,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1429,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 1587,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1642,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1900,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 1860,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 2916,
            "unit": "ms"
          }
        ]
      },
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
          "id": "a9e34a8a5c63e8a1fa5e121fe52755dbd7e25e7e",
          "message": "Add original app specification prompt to docs/\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T17:23:19-07:00",
          "tree_id": "265bc7ab94d45d690dbff3940b0f7e6ba5a95795",
          "url": "https://github.com/arun-gupta/quizpop/commit/a9e34a8a5c63e8a1fa5e121fe52755dbd7e25e7e"
        },
        "date": 1779755069242,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1561,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1747,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1650,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 1852,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1527,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1805,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2057,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3112,
            "unit": "ms"
          }
        ]
      },
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
          "id": "319ef6780b14e3a879e3eacc685e614a816e07b5",
          "message": "fix: add safety migration for missing production columns and improve load test errors\n\nMigration 20250527000004 re-applies ADD COLUMN IF NOT EXISTS for question_type,\nsection_title, section_intro_at, and state_changed_at — production DB was missing\nquestion_type because 20250526000000 was only marked applied via migration repair,\nnever actually executed. Also updates quiz content and surfaces real server errors\nin load test output.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T20:40:01-07:00",
          "tree_id": "20c9b1448e1351f11409bd9a576a86923d1e7952",
          "url": "https://github.com/arun-gupta/quizpop/commit/319ef6780b14e3a879e3eacc685e614a816e07b5"
        },
        "date": 1779767148999,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1903,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2018,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1732,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2385,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1733,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1934,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2807,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3341,
            "unit": "ms"
          }
        ]
      },
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
          "id": "10d1f2fd754767213471dab524b20c52747955b0",
          "message": "feat: image_reveal timing and fix deterministic answer shuffle",
          "timestamp": "2026-05-25T21:26:59-07:00",
          "tree_id": "2842b931bef539ccf67f77407e5622094c485901",
          "url": "https://github.com/arun-gupta/quizpop/commit/10d1f2fd754767213471dab524b20c52747955b0"
        },
        "date": 1779769686156,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1956,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2208,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1764,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2334,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1884,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 2121,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 3319,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3800,
            "unit": "ms"
          }
        ]
      },
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
          "id": "f42d6d405a1e7e7c1751af9c382f2f0bf5e33b1c",
          "message": "docs: add logo to README\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T21:30:42-07:00",
          "tree_id": "7cf0819458b82752fd22289d4dcba859be27b377",
          "url": "https://github.com/arun-gupta/quizpop/commit/f42d6d405a1e7e7c1751af9c382f2f0bf5e33b1c"
        },
        "date": 1779769923001,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1600,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1757,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 2150,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2673,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1801,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1972,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 3400,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3887,
            "unit": "ms"
          }
        ]
      },
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
          "id": "24d802f081f623212cb166cf1b20773a32969b12",
          "message": "docs: integrate logo into README hero section\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T21:33:05-07:00",
          "tree_id": "26387d56e9b097b828d9a2b7fa9e55f8e53f4afd",
          "url": "https://github.com/arun-gupta/quizpop/commit/24d802f081f623212cb166cf1b20773a32969b12"
        },
        "date": 1779770507176,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 2493,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2557,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1908,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2075,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1758,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1983,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 1934,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3098,
            "unit": "ms"
          }
        ]
      },
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
          "id": "57d8a40f720431d4cb088f1a653aa97021be808a",
          "message": "docs: side-by-side logo+title layout with cleaner badges\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T21:43:35-07:00",
          "tree_id": "b87ea576f818657c23afc8c9249bdd622982eb54",
          "url": "https://github.com/arun-gupta/quizpop/commit/57d8a40f720431d4cb088f1a653aa97021be808a"
        },
        "date": 1779770708932,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1680,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1839,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 2098,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2261,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1234,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1765,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2078,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 2901,
            "unit": "ms"
          }
        ]
      },
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
          "id": "9b4f8aeab5364691d27c9d4421ffbffb4c883103",
          "message": "feat: add Question/Results toggle to preview for reveal:after images\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T22:01:22-07:00",
          "tree_id": "353f1ca9130307fdaa27b5b13cd8fc3dfcb551ce",
          "url": "https://github.com/arun-gupta/quizpop/commit/9b4f8aeab5364691d27c9d4421ffbffb4c883103"
        },
        "date": 1779771765197,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1579,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1932,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1998,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2470,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1286,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1599,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2537,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3124,
            "unit": "ms"
          }
        ]
      },
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
          "id": "f25c9f4b256dfab1c7a9f81dbdd3d61279dbe346",
          "message": "fix: add bottom padding in preview to clear fixed nav bar\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T22:33:21-07:00",
          "tree_id": "4f698200dc779ce17d9c2743456ff518f8979ffd",
          "url": "https://github.com/arun-gupta/quizpop/commit/f25c9f4b256dfab1c7a9f81dbdd3d61279dbe346"
        },
        "date": 1779773671949,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 2043,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2279,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 2226,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2706,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1768,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1991,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2991,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3450,
            "unit": "ms"
          }
        ]
      },
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
          "id": "5899afee79f88044d0f2454710562f796a92cf39",
          "message": "fix: constrain results/leaderboard screens to viewport height\n\nApply h-screen overflow-hidden to HostResults, PlayerResults, and\nHostLeaderboard. Reduce reveal image to h-40. Add overflow-y-auto\nto scrollable content areas so nothing gets cut off.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-25T22:35:13-07:00",
          "tree_id": "6f29cf69e432dfcf9890b57017e4661774c1254d",
          "url": "https://github.com/arun-gupta/quizpop/commit/5899afee79f88044d0f2454710562f796a92cf39"
        },
        "date": 1779773775279,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1602,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1914,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1641,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2333,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1600,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1839,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2388,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 2758,
            "unit": "ms"
          }
        ]
      },
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
          "id": "500ee00be17bc9339fb064374cffb35b21243316",
          "message": "chore: gitignore quizzes/ directory\n\nPersonal quiz files should be imported via the admin panel,\nnot committed to the repo.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T09:18:34-07:00",
          "tree_id": "6a087f3ddf71fd561de250586e7bece9a8158cfb",
          "url": "https://github.com/arun-gupta/quizpop/commit/500ee00be17bc9339fb064374cffb35b21243316"
        },
        "date": 1779812387465,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 2264,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2489,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 2237,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2795,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1570,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1889,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2197,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 2873,
            "unit": "ms"
          }
        ]
      },
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
          "id": "2a26cf143ff00cd4de72f7d3b4ae8429c5bf0800",
          "message": "feat: import quiz markdown directly from Supabase Storage bucket\n\nNew 'From Storage' tab in admin import UI. Enter a bucket path\n(e.g. quiz-images/mihir), the server finds the .md file in that\nfolder, downloads it, and populates the preview/import flow.\nImages stay in the same folder and are resolved via the existing\n> bucket: header in the markdown.\n\nAlso fix /quizzes gitignore pattern to not accidentally match\napp/api/admin/quizzes/.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T09:27:06-07:00",
          "tree_id": "99c6c28133f9cd790b2c5f3642e04e921c3b1af3",
          "url": "https://github.com/arun-gupta/quizpop/commit/2a26cf143ff00cd4de72f7d3b4ae8429c5bf0800"
        },
        "date": 1779812894641,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1556,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1780,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1732,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2277,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1737,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1918,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2724,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3316,
            "unit": "ms"
          }
        ]
      },
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
          "id": "76eed94fd66ca75a302d34956415127955807669",
          "message": "ux: rename Preview to Validate in markdown import\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T09:37:03-07:00",
          "tree_id": "3cafd69d2b8293c25329a439c675f3683ada4b01",
          "url": "https://github.com/arun-gupta/quizpop/commit/76eed94fd66ca75a302d34956415127955807669"
        },
        "date": 1779813494677,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1698,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1936,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1957,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2468,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1878,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 2155,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2678,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3237,
            "unit": "ms"
          }
        ]
      },
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
          "id": "b8bb929479f497b40b0804a67c0c6e69ddf529e2",
          "message": "ux: auto-validate markdown on paste with 400ms debounce, remove button\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T09:37:41-07:00",
          "tree_id": "3f30f6b76b599f24ca8c6a14ac11847c792b8871",
          "url": "https://github.com/arun-gupta/quizpop/commit/b8bb929479f497b40b0804a67c0c6e69ddf529e2"
        },
        "date": 1779813524922,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1639,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1869,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1210,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2002,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1649,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1833,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2410,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 2693,
            "unit": "ms"
          }
        ]
      },
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
          "id": "4f6f061fa7e7349e4a198a39ff7261a757569850",
          "message": "feat: categorize game sessions as Active / Stale / Past\n\n- Live Games page now shows all sessions split into three sections:\n  Active (non-finished, <2h old), Stale (non-finished, >=2h old),\n  Past (finished). Stale section has a Force End All button.\n- Load test now calls finish action after each test run so CI games\n  don't accumulate as stale sessions.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T09:44:19-07:00",
          "tree_id": "3ac4e844e4930b020880b34e68e9cc07ebae8f50",
          "url": "https://github.com/arun-gupta/quizpop/commit/4f6f061fa7e7349e4a198a39ff7261a757569850"
        },
        "date": 1779813925892,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1880,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2243,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 2003,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2860,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1739,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1953,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2139,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3223,
            "unit": "ms"
          }
        ]
      },
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
          "id": "5af49eb1abae8850b54c89a47a9cbab4c4f7d7be",
          "message": "fix: use last-activity timestamp for stale game detection\n\nStale threshold now checks state_changed_at (falls back to started_at,\nthen created_at) instead of created_at alone — a game actively advancing\nthrough questions won't be incorrectly flagged as stale just because it\nstarted 2+ hours ago.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T09:54:34-07:00",
          "tree_id": "fec74908d0bd283e6b9ed2eaa51600942e7d424a",
          "url": "https://github.com/arun-gupta/quizpop/commit/5af49eb1abae8850b54c89a47a9cbab4c4f7d7be"
        },
        "date": 1779814560840,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 2315,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 5707,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1339,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 4216,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1262,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1716,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2203,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3024,
            "unit": "ms"
          }
        ]
      },
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
          "id": "5fdb952098f7b7773f178cdd35d182c4b017ce68",
          "message": "fix: host and player answer colors now match throughout the game\n\nThe state API deterministically shuffles answer options so all clients\nsee the same colour→answer assignment. Host components were re-sorting\nby display_order after the fact, undoing the shuffle and causing colours\nto differ between host and player. Removed the redundant sorts.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T09:59:09-07:00",
          "tree_id": "b22e5bce084f692c61ad197d8b7622d1f223fbbc",
          "url": "https://github.com/arun-gupta/quizpop/commit/5fdb952098f7b7773f178cdd35d182c4b017ce68"
        },
        "date": 1779814830074,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1733,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2047,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 2535,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 3062,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1417,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1739,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2691,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 10951,
            "unit": "ms"
          }
        ]
      },
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
          "id": "390820af1548e4ec0c3999fa9609787daba22830",
          "message": "feat: allow multiple answers for open-text questions, fix word cloud\n\n- DB: replace broad UNIQUE(player_id, question_id) with a partial index\n  that only enforces uniqueness for MC answers (selected_answer_id not null).\n  Open-text players can now submit multiple answers.\n- API: detect first vs subsequent open-text submission; points awarded only\n  on the first, additional submissions add to word cloud with 0 extra points.\n- Player UI: textarea stays active after each submission so players can keep\n  adding answers; submitted answers listed above the input; Enter key submits.\n- Format guide: document type: open_text and fix the word cloud not\n  showing (quiz must be re-imported with > type: open_text on each question).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T10:09:34-07:00",
          "tree_id": "9ff6326fdce4ba4bac4e31e90a5861e3c467b6ce",
          "url": "https://github.com/arun-gupta/quizpop/commit/390820af1548e4ec0c3999fa9609787daba22830"
        },
        "date": 1779815447810,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1553,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2090,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1477,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2398,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1703,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1922,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2397,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3298,
            "unit": "ms"
          }
        ]
      },
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
          "id": "3334cceef1a3a17cde8471c215a299d9dc470eb9",
          "message": "feat: live word cloud on host screen during open-text questions\n\n- State route now returns word cloud during question_active (not just\n  question_results) for open_text questions.\n- Host Realtime subscription triggers a state refresh on each free-text\n  response INSERT, so the word cloud updates as players submit.\n- HostQuestion shows the live word cloud instead of empty space for\n  open_text questions.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T10:22:28-07:00",
          "tree_id": "75ce8902264c533bc870b9597cd68b1a0439a51c",
          "url": "https://github.com/arun-gupta/quizpop/commit/3334cceef1a3a17cde8471c215a299d9dc470eb9"
        },
        "date": 1779816220503,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 2209,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2315,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1908,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2065,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1773,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1999,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2789,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3102,
            "unit": "ms"
          }
        ]
      },
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
          "id": "b28e78c76533b08efc83e2f0307d5d981c6fcc1d",
          "message": "feat: Family Feud scoring for open-text questions\n\nPoints are now awarded at question reveal based on word-cloud frequency:\n- Most popular answer gets full base_points\n- Others get floor(base_points × count / maxCount)\n- Per player, their highest-frequency submission wins\n- Submissions always insert with 0 points; Block C awards final scores\n  and increments players.total_score when the timer expires.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T10:27:40-07:00",
          "tree_id": "c9157ae9a982054dc68789d53a07f5e49035b9a4",
          "url": "https://github.com/arun-gupta/quizpop/commit/b28e78c76533b08efc83e2f0307d5d981c6fcc1d"
        },
        "date": 1779816524998,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1558,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1841,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 2298,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2724,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1747,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1991,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2515,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3103,
            "unit": "ms"
          }
        ]
      },
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
          "id": "68edae6fc46597c846637863892ef976c99b5ed7",
          "message": "fix: respect image_reveal on player question and results screens\n\nPlayerQuestion was missing the reveal: after check — image always showed.\nPlayerResults was not showing reveal: after images at all.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T12:07:17-07:00",
          "tree_id": "61de855975a8ee04c103f2bfdb2fa9fa14bfefb7",
          "url": "https://github.com/arun-gupta/quizpop/commit/68edae6fc46597c846637863892ef976c99b5ed7"
        },
        "date": 1779822509988,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1696,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2033,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1938,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2394,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1484,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1840,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2478,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3128,
            "unit": "ms"
          }
        ]
      },
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
          "id": "6b9b58c2c76134b65b60a2b0852ec83a892091d6",
          "message": "fix: scope word cloud to current game session only\n\nBoth the live word cloud query and the Family Feud scoring query were\nfiltering by question_id alone, pulling in responses from previous plays\nof the same quiz. Added an inner join on players to filter by game_session_id.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T12:08:20-07:00",
          "tree_id": "17936664697c121e134770a7c88def7bc6e8e3d4",
          "url": "https://github.com/arun-gupta/quizpop/commit/6b9b58c2c76134b65b60a2b0852ec83a892091d6"
        },
        "date": 1779822571065,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1546,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1796,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 2188,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2770,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1224,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1522,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2311,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3195,
            "unit": "ms"
          }
        ]
      },
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
          "id": "59d65f943854d139b70c5cf10a9931b55ef0e020",
          "message": "ux: extend question_results display to 10s (was 5s)\n\nGives host more time to see the correct answer and word cloud\nbefore auto-advancing to the leaderboard.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T12:08:54-07:00",
          "tree_id": "a50ec1fb1a72d7b06e01ba499d5c1fdaae9b98c2",
          "url": "https://github.com/arun-gupta/quizpop/commit/59d65f943854d139b70c5cf10a9931b55ef0e020"
        },
        "date": 1779822614652,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1836,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2024,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1542,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2401,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1952,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 2181,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 3007,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3655,
            "unit": "ms"
          }
        ]
      },
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
          "id": "df327b2330d4b610f7c09f929b806c0d5a5e467c",
          "message": "fix: don't auto-reveal open_text questions when all players answered\n\nOpen-text questions should always run to the full timer so players can\nsubmit multiple answers. The auto-reveal on all-answered now only fires\nfor multiple-choice questions.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T12:10:14-07:00",
          "tree_id": "77264db3ec23b4f1b9991fdeb05e468503eacc31",
          "url": "https://github.com/arun-gupta/quizpop/commit/df327b2330d4b610f7c09f929b806c0d5a5e467c"
        },
        "date": 1779822685943,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1644,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1980,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1644,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 1903,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1716,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1940,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2433,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3371,
            "unit": "ms"
          }
        ]
      },
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
          "id": "cf820c4fdc0f1ad057f087d0765c9302508b80d2",
          "message": "fix: show \"Game ending in Xs\" instead of \"Next question\" on final leaderboard\n\nAdds totalQuestions to the state API response; host page computes\nisLastQuestion and passes it to HostLeaderboard to switch the label.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T12:20:46-07:00",
          "tree_id": "57e7ae243763629607f909e8abf0ce5fccbc2c4f",
          "url": "https://github.com/arun-gupta/quizpop/commit/cf820c4fdc0f1ad057f087d0765c9302508b80d2"
        },
        "date": 1779823317481,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1409,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2016,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1760,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2355,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1442,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1798,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2780,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3481,
            "unit": "ms"
          }
        ]
      },
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
          "id": "1e31e18c538b77a0fa02c9e890314a4d3e997116",
          "message": "Show all submitted open-text answers in PlayerResults\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T12:54:43-07:00",
          "tree_id": "0f0758c613c58d6b346d4a500ba59c42b00506bc",
          "url": "https://github.com/arun-gupta/quizpop/commit/1e31e18c538b77a0fa02c9e890314a4d3e997116"
        },
        "date": 1779825357226,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1503,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1845,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1580,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2323,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1622,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1927,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2620,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3256,
            "unit": "ms"
          }
        ]
      },
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
          "id": "e420dfd2b31c5944febb201e9f3c6a30e02bc597",
          "message": "Count distinct players answered, not total submissions\n\nOpen-text questions allow multiple submissions per player; tracking by\nplayer ID Set prevents the count exceeding total players.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T13:01:08-07:00",
          "tree_id": "95ac37063b97b6cd46e118736781e4b4dd6afdca",
          "url": "https://github.com/arun-gupta/quizpop/commit/e420dfd2b31c5944febb201e9f3c6a30e02bc597"
        },
        "date": 1779825739877,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1646,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1851,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1870,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2510,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1981,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 2196,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2740,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3345,
            "unit": "ms"
          }
        ]
      },
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
          "id": "73175aa7ccfd2ba0a0c5d46af5379d532dd6b3c5",
          "message": "Add animated podium to game over screen\n\n3rd place rises first (0.3s), then 2nd (0.9s), then 1st (1.5s) with a\nspring bounce. Layout: 2nd left · 1st centre (tallest) · 3rd right.\nRanks 4+ shown below as \"Also Played\".\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T13:05:32-07:00",
          "tree_id": "d12cb0fb6aad9f3d275e9f88b9198ba5ce10eb14",
          "url": "https://github.com/arun-gupta/quizpop/commit/73175aa7ccfd2ba0a0c5d46af5379d532dd6b3c5"
        },
        "date": 1779826003208,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 2463,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2624,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1684,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2091,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1778,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1981,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2883,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3465,
            "unit": "ms"
          }
        ]
      },
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
          "id": "7ece14cd3d132b5fcde227b5f90e53b973aae569",
          "message": "Add overwrite option to quiz import\n\nCheckbox 'Replace existing quiz with same title' deletes the old quiz\n(cascading questions/options) then re-imports fresh. Button label\nchanges to 'Replace Quiz' when checked.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T17:53:24-07:00",
          "tree_id": "a8d8ed46597450968859421be50ec1a8a3bdbb08",
          "url": "https://github.com/arun-gupta/quizpop/commit/7ece14cd3d132b5fcde227b5f90e53b973aae569"
        },
        "date": 1779843274325,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 2434,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 2623,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 2020,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2550,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1692,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1929,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2665,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 3302,
            "unit": "ms"
          }
        ]
      },
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
          "id": "b5708df86bf0267f239b50510883f9e935df80ba",
          "message": "Fix quiz delete blocked by game_sessions foreign key\n\nChange game_sessions.quiz_id from ON DELETE RESTRICT to ON DELETE CASCADE\nso quizzes can be deleted even when completed game sessions reference them.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-05-26T17:54:47-07:00",
          "tree_id": "ccc022824aec6feb3f2f51e2cb2443f1496d184b",
          "url": "https://github.com/arun-gupta/quizpop/commit/b5708df86bf0267f239b50510883f9e935df80ba"
        },
        "date": 1779843358370,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "join_p50 (50 players)",
            "value": 1407,
            "unit": "ms"
          },
          {
            "name": "join_p95 (50 players)",
            "value": 1892,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (50 players)",
            "value": 1536,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (50 players)",
            "value": 2126,
            "unit": "ms"
          },
          {
            "name": "join_p50 (100 players)",
            "value": 1609,
            "unit": "ms"
          },
          {
            "name": "join_p95 (100 players)",
            "value": 1817,
            "unit": "ms"
          },
          {
            "name": "answer_p50 (100 players)",
            "value": 2458,
            "unit": "ms"
          },
          {
            "name": "answer_p95 (100 players)",
            "value": 2977,
            "unit": "ms"
          }
        ]
      }
    ]
  }
}