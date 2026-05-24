import { describe, it, expect } from 'vitest'
import { parseQuizMarkdown, generateExampleMarkdown } from '../lib/quiz-markdown'

describe('parseQuizMarkdown', () => {
  it('parses a minimal valid quiz', () => {
    const md = `# My Quiz

## What color is the sky?
- [ ] Red
- [x] Blue
- [ ] Green
`
    const result = parseQuizMarkdown(md)
    expect(result.errors).toHaveLength(0)
    expect(result.title).toBe('My Quiz')
    expect(result.questions).toHaveLength(1)
    expect(result.questions[0].question_text).toBe('What color is the sky?')
    expect(result.questions[0].answer_options).toHaveLength(3)
    expect(result.questions[0].answer_options.find(a => a.is_correct)?.answer_text).toBe('Blue')
  })

  it('parses title and description', () => {
    const md = `# Fun Quiz
A great quiz for all ages.

## Question?
- [x] Yes
- [ ] No
`
    const result = parseQuizMarkdown(md)
    expect(result.title).toBe('Fun Quiz')
    expect(result.description).toBe('A great quiz for all ages.')
    expect(result.errors).toHaveLength(0)
  })

  it('parses metadata: timer and points', () => {
    const md = `# Quiz

## Hard question?
> timer: 10 | points: 2000
- [x] Right
- [ ] Wrong
`
    const result = parseQuizMarkdown(md)
    expect(result.errors).toHaveLength(0)
    expect(result.questions[0].timer_seconds).toBe(10)
    expect(result.questions[0].points).toBe(2000)
  })

  it('parses metadata with only timer', () => {
    const md = `# Quiz

## Question
> timer: 30
- [x] A
- [ ] B
`
    const result = parseQuizMarkdown(md)
    expect(result.questions[0].timer_seconds).toBe(30)
    expect(result.questions[0].points).toBe(1000) // default
  })

  it('defaults timer to 20 and points to 1000', () => {
    const md = `# Quiz

## Question
- [x] A
- [ ] B
`
    const result = parseQuizMarkdown(md)
    expect(result.questions[0].timer_seconds).toBe(20)
    expect(result.questions[0].points).toBe(1000)
  })

  it('parses multiple questions', () => {
    const md = `# Quiz

## Q1?
- [x] A
- [ ] B

## Q2?
- [ ] X
- [x] Y
- [ ] Z

## Q3?
- [ ] 1
- [ ] 2
- [ ] 3
- [x] 4
`
    const result = parseQuizMarkdown(md)
    expect(result.errors).toHaveLength(0)
    expect(result.questions).toHaveLength(3)
    expect(result.questions[0].display_order).toBe(1)
    expect(result.questions[1].display_order).toBe(2)
    expect(result.questions[2].display_order).toBe(3)
    expect(result.questions[2].answer_options).toHaveLength(4)
  })

  it('accepts uppercase [X] as correct answer', () => {
    const md = `# Quiz

## Question
- [X] Correct
- [ ] Wrong
`
    const result = parseQuizMarkdown(md)
    expect(result.errors).toHaveLength(0)
    expect(result.questions[0].answer_options[0].is_correct).toBe(true)
  })

  it('errors on missing title', () => {
    const md = `## Question
- [x] A
- [ ] B
`
    const result = parseQuizMarkdown(md)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]).toMatch(/title/)
  })

  it('errors on no questions', () => {
    const result = parseQuizMarkdown('# Quiz\nJust a description.\n')
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]).toMatch(/no valid questions/i)
  })

  it('errors on question with no correct answer', () => {
    const md = `# Quiz

## Question?
- [ ] A
- [ ] B
`
    const result = parseQuizMarkdown(md)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]).toMatch(/no correct answer/i)
  })

  it('errors on question with multiple correct answers', () => {
    const md = `# Quiz

## Question?
- [x] A
- [x] B
- [ ] C
`
    const result = parseQuizMarkdown(md)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]).toMatch(/2 correct answers/i)
  })

  it('errors on too few options', () => {
    const md = `# Quiz

## Question?
- [x] Only one option
`
    const result = parseQuizMarkdown(md)
    expect(result.errors[0]).toMatch(/at least 2/i)
  })

  it('errors on too many options', () => {
    const md = `# Quiz

## Question?
- [x] A
- [ ] B
- [ ] C
- [ ] D
- [ ] E
`
    const result = parseQuizMarkdown(md)
    expect(result.errors[0]).toMatch(/maximum 4/i)
  })

  it('skips invalid questions but keeps valid ones', () => {
    const md = `# Quiz

## Bad question (no correct)
- [ ] A
- [ ] B

## Good question
- [x] Right
- [ ] Wrong
`
    const result = parseQuizMarkdown(md)
    expect(result.errors).toHaveLength(1)
    expect(result.questions).toHaveLength(1)
    expect(result.questions[0].question_text).toBe('Good question')
  })

  it('parses the built-in example without errors', () => {
    const result = parseQuizMarkdown(generateExampleMarkdown())
    expect(result.errors).toHaveLength(0)
    expect(result.questions).toHaveLength(4)
  })

  it('assigns correct display_order to questions', () => {
    const md = `# Quiz

## First
- [x] A
- [ ] B

## Second
- [ ] A
- [x] B
`
    const result = parseQuizMarkdown(md)
    expect(result.questions[0].display_order).toBe(1)
    expect(result.questions[1].display_order).toBe(2)
  })

  it('assigns correct display_order to answer options', () => {
    const md = `# Quiz

## Question
- [ ] First
- [x] Second
- [ ] Third
`
    const result = parseQuizMarkdown(md)
    const opts = result.questions[0].answer_options
    expect(opts[0].answer_text).toBe('First')
    expect(opts[0].display_order).toBe(0)
    expect(opts[1].display_order).toBe(1)
    expect(opts[2].display_order).toBe(2)
  })
})
