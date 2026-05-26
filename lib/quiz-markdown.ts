export interface ParsedQuiz {
  title: string
  description: string
  questions: ParsedQuestion[]
  errors: string[]
  warnings: string[]
}

export interface ParsedQuestion {
  question_text: string
  image_url?: string
  timer_seconds: number
  points: number
  display_order: number
  question_type: 'multiple_choice' | 'open_text'
  section_title?: string
  answer_options: ParsedAnswerOption[]
}

export interface ParsedAnswerOption {
  answer_text: string
  is_correct: boolean
  display_order: number
}

const DEFAULT_TIMER = 20
const DEFAULT_POINTS = 1000

export function parseQuizMarkdown(input: string): ParsedQuiz {
  const lines = input.split('\n')
  const result: ParsedQuiz = { title: '', description: '', questions: [], errors: [], warnings: [] }
  let i = 0

  // Advance past blank lines, find H1 title
  while (i < lines.length) {
    const line = lines[i].trim()
    if (line.startsWith('# ')) {
      result.title = line.slice(2).trim()
      i++
      break
    }
    if (line !== '') {
      result.errors.push(`Line ${i + 1}: Expected quiz title starting with "# "`)
      break
    }
    i++
  }

  if (!result.title && result.errors.length === 0) {
    result.errors.push('Quiz title is required — add a line like: # My Quiz Title')
  }

  // Optional description: next non-empty lines before first ##
  const descLines: string[] = []
  while (i < lines.length && !lines[i].trim().startsWith('## ')) {
    const line = lines[i].trim()
    if (line && !line.startsWith('#')) descLines.push(line)
    i++
  }
  result.description = descLines.join(' ').trim()

  // Parse questions
  let currentSection: string | undefined = undefined
  let currentQuestion: (Omit<ParsedQuestion, 'display_order'> & { display_order: number }) | null = null

  const flushQuestion = () => {
    if (!currentQuestion) return
    const qNum = result.questions.length + 1
    currentQuestion.display_order = qNum
    const errors = validateQuestion(currentQuestion, qNum)
    if (errors.length) {
      result.errors.push(...errors)
    } else {
      result.questions.push(currentQuestion)
    }
    currentQuestion = null
  }

  while (i < lines.length) {
    const raw = lines[i]
    const line = raw.trim()
    i++

    if (line.startsWith('### ')) {
      currentSection = line.slice(4).trim() || undefined
      continue
    }

    if (line.startsWith('## ')) {
      flushQuestion()
      currentQuestion = {
        question_text: line.slice(3).trim(),
        image_url: undefined,
        timer_seconds: DEFAULT_TIMER,
        points: DEFAULT_POINTS,
        display_order: 0,
        question_type: 'multiple_choice',
        section_title: currentSection,
        answer_options: [],
      }
      continue
    }

    if (!currentQuestion) continue

    // Optional metadata line: > timer: 20 | points: 1000 | image: https://...
    if (line.startsWith('> ')) {
      const meta = line.slice(2)
      const timerMatch = meta.match(/timer:\s*(\d+)/i)
      const pointsMatch = meta.match(/points:\s*(\d+)/i)
      const imageMatch = meta.match(/image:\s*(https?:\/\/\S+)/i)
      const typeMatch = meta.match(/type:\s*(open_text|multiple_choice)/i)
      if (timerMatch) currentQuestion.timer_seconds = parseInt(timerMatch[1], 10)
      if (pointsMatch) currentQuestion.points = parseInt(pointsMatch[1], 10)
      if (imageMatch) currentQuestion.image_url = imageMatch[1].trim()
      if (typeMatch) currentQuestion.question_type = typeMatch[1].toLowerCase() as 'multiple_choice' | 'open_text'
      continue
    }

    // Standalone image line: ![alt](url) or just a bare https:// image URL line
    const mdImageMatch = line.match(/^!\[.*?\]\((https?:\/\/\S+)\)$/)
    if (mdImageMatch) {
      currentQuestion.image_url = mdImageMatch[1]
      continue
    }

    // Correct answer: - [x] text  or  - [X] text
    const correctMatch = line.match(/^-\s*\[[xX]\]\s*(.+)$/)
    if (correctMatch) {
      currentQuestion.answer_options.push({
        answer_text: correctMatch[1].trim(),
        is_correct: true,
        display_order: currentQuestion.answer_options.length,
      })
      continue
    }

    // Wrong answer: - [ ] text
    const wrongMatch = line.match(/^-\s*\[\s*\]\s*(.+)$/)
    if (wrongMatch) {
      currentQuestion.answer_options.push({
        answer_text: wrongMatch[1].trim(),
        is_correct: false,
        display_order: currentQuestion.answer_options.length,
      })
      continue
    }
  }

  flushQuestion()

  if (result.questions.length === 0 && result.errors.length === 0) {
    result.errors.push('No valid questions found — add questions with "## Question text"')
  }

  // Warnings for unusual timer/points values
  for (const q of result.questions) {
    if (q.timer_seconds < 5 || q.timer_seconds > 120) {
      result.warnings.push(`Q${q.display_order}: unusual timer (${q.timer_seconds}s) — expected 5–120`)
    }
    if (q.points < 100 || q.points > 10000) {
      result.warnings.push(`Q${q.display_order}: unusual points (${q.points}) — expected 100–10000`)
    }
  }

  return result
}

function validateQuestion(
  q: Omit<ParsedQuestion, 'display_order'>,
  qNum: number
): string[] {
  const errors: string[] = []
  const label = `Q${qNum} ("${q.question_text.slice(0, 40)}${q.question_text.length > 40 ? '…' : ''}")`

  if (!q.question_text) {
    errors.push(`Question ${qNum}: empty question text`)
    return errors
  }

  if (q.question_type === 'open_text') {
    if (q.answer_options.length > 0) {
      errors.push(`${label}: open_text questions should not have answer options`)
    }
    return errors
  }

  if (q.answer_options.length < 2) {
    errors.push(`${label}: needs at least 2 answer options`)
  } else if (q.answer_options.length > 4) {
    errors.push(`${label}: maximum 4 answer options (got ${q.answer_options.length})`)
  }

  const correctCount = q.answer_options.filter(a => a.is_correct).length
  if (correctCount === 0) {
    errors.push(`${label}: no correct answer — mark one with "- [x] Answer"`)
  } else if (correctCount > 1) {
    errors.push(`${label}: ${correctCount} correct answers marked — only 1 allowed`)
  }

  return errors
}

export function generateExampleMarkdown(): string {
  return `# Birthday Party Trivia
Fun questions for all ages — perfect for parties!

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
> image: https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/240px-OSIRIS_Mars_true_color.jpg
- [ ] Jupiter
- [ ] Venus
- [x] Mars
- [ ] Saturn

## What is the fastest land animal?
> points: 1000
- [x] Cheetah
- [ ] Lion
- [ ] Greyhound
- [ ] Peregrine Falcon

## What's your favourite thing about this party?
> type: open_text | timer: 30 | points: 500
`
}
