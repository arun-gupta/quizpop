window.BENCHMARK_DATA = {
  "lastUpdate": 1779812895031,
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
      }
    ]
  }
}