window.BENCHMARK_DATA = {
  "lastUpdate": 1779755069658,
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
      }
    ]
  }
}