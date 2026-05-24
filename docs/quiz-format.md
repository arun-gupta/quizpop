# Quiz Markdown Format

QuizPop can import quizzes from plain Markdown files. This format is designed to be easy to write in any text editor, version-controlled alongside your code, and shareable as a file.

## Basic Structure

```markdown
# Quiz Title
Optional one-line description.

## Question text goes here?
- [ ] Wrong answer
- [x] Correct answer
- [ ] Another wrong answer
- [ ] One more option

## Next question?
- [x] Right!
- [ ] Nope
- [ ] Not this
```

## Syntax Reference

| Element | Syntax | Notes |
|---------|--------|-------|
| Quiz title | `# My Title` | Required, first line |
| Description | Plain text after title | Optional |
| Question | `## Question text?` | Starts a new question |
| Correct answer | `- [x] Answer text` | Exactly 1 per question |
| Wrong answer | `- [ ] Answer text` | 1–3 per question (2–4 total) |
| Timer override | `> timer: 15` | After question line, seconds (default: 20) |
| Points override | `> points: 500` | After question line (default: 1000) |

## Custom Timer and Points

Add a `>` line directly after the question to override defaults:

```markdown
## What year did World War II end?
> timer: 30 | points: 2000
- [ ] 1943
- [ ] 1944
- [x] 1945
- [ ] 1946
```

You can set just one or both:
```markdown
> timer: 10
> points: 500
```

## Rules

- Exactly **1 correct answer** per question (marked with `[x]`)
- Each question needs **2–4 answer options**
- Questions have a default timer of **20 seconds** and **1000 points**
- Answer options are shown in the order listed in the file
- Blank lines between questions are ignored

## Full Example

```markdown
# Birthday Party Trivia
Fun questions for the whole family!

## What is the capital of France?
- [ ] London
- [x] Paris
- [ ] Berlin
- [ ] Rome

## How many legs does a spider have?
> timer: 15 | points: 500
- [ ] 6
- [x] 8
- [ ] 10
- [ ] 4

## Which planet is known as the Red Planet?
- [ ] Jupiter
- [ ] Venus
- [x] Mars
- [ ] Saturn

## What year was the first iPhone released?
> timer: 20 | points: 2000
- [ ] 2005
- [x] 2007
- [ ] 2009
- [ ] 2003
```

## How to Import

### Option 1: Admin Dashboard (recommended)
1. Log in to `/admin`
2. Go to **Quizzes**
3. Click **Import .md**
4. Paste your Markdown or upload the `.md` file
5. Preview the parsed questions
6. Click **Import Quiz**

### Option 2: CLI (for developers)

```bash
# With .env.local
node --env-file=.env.local --import tsx/esm scripts/import-quiz.ts my-quiz.md

# Or with npx tsx (if tsx is installed)
npx tsx scripts/import-quiz.ts my-quiz.md
```

### Option 3: API (for programmatic imports)

```bash
curl -X POST https://your-app.vercel.app/api/admin/quizzes/import \
  -H "Content-Type: application/json" \
  -H "Cookie: <your-admin-session-cookie>" \
  -d '{"markdown": "# Quiz\n## Q?\n- [x] A\n- [ ] B"}'
```

Or with a file upload:

```bash
curl -X POST https://your-app.vercel.app/api/admin/quizzes/import \
  -H "Cookie: <your-admin-session-cookie>" \
  -F "file=@my-quiz.md"
```

## Tips for Creating Quizzes

- Keep questions short and punchy — players read on phones
- 2 answer options work great for true/false questions
- Use `timer: 10` for very easy questions, `timer: 30` for tricky ones
- Use `points: 500` for warm-up questions, `points: 2000` for the final round
- Aim for 10–20 questions per quiz for the best party pacing
