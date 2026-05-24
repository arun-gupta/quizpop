#!/usr/bin/env tsx
/**
 * Import a quiz from a Markdown file directly into Supabase.
 *
 * Usage:
 *   npx tsx scripts/import-quiz.ts path/to/quiz.md
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * to be set (reads from .env.local automatically via --env-file flag,
 * or export them manually).
 *
 *   node --env-file=.env.local --import tsx/esm scripts/import-quiz.ts quiz.md
 *
 * Or add to package.json scripts and run:
 *   npm run import-quiz -- quiz.md
 */

import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { parseQuizMarkdown } from '../lib/quiz-markdown'

async function main() {
  const filePath = process.argv[2]

  if (!filePath) {
    console.error('Usage: npx tsx scripts/import-quiz.ts <path-to-quiz.md>')
    console.error('')
    console.error('Example:')
    console.error('  npx tsx scripts/import-quiz.ts my-quiz.md')
    process.exit(1)
  }

  const absPath = resolve(process.cwd(), filePath)
  if (!existsSync(absPath)) {
    console.error(`File not found: ${absPath}`)
    process.exit(1)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('Missing environment variables.')
    console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or run via:')
    console.error('  node --env-file=.env.local --import tsx/esm scripts/import-quiz.ts <file>')
    process.exit(1)
  }

  const markdown = readFileSync(absPath, 'utf-8')
  const parsed = parseQuizMarkdown(markdown)

  if (parsed.errors.length > 0) {
    console.error(`\n✗ Parse errors in ${filePath}:\n`)
    parsed.errors.forEach(e => console.error(`  • ${e}`))
    process.exit(1)
  }

  if (parsed.warnings.length > 0) {
    console.warn(`\n⚠ Warnings:\n`)
    parsed.warnings.forEach(w => console.warn(`  • ${w}`))
  }

  console.log(`\nParsed: "${parsed.title}" — ${parsed.questions.length} questions`)
  if (parsed.description) console.log(`Description: ${parsed.description}`)

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Insert quiz
  const { data: quiz, error: quizErr } = await supabase
    .from('quizzes')
    .insert({ title: parsed.title, description: parsed.description || null })
    .select()
    .single()

  if (quizErr || !quiz) {
    console.error('\n✗ Failed to create quiz:', quizErr?.message)
    process.exit(1)
  }

  console.log(`\nCreated quiz (id: ${quiz.id})`)

  // Insert questions + options
  for (const q of parsed.questions) {
    const { data: question, error: qErr } = await supabase
      .from('questions')
      .insert({
        quiz_id: quiz.id,
        question_text: q.question_text,
        timer_seconds: q.timer_seconds,
        points: q.points,
        display_order: q.display_order,
      })
      .select()
      .single()

    if (qErr || !question) {
      console.error(`\n✗ Failed to insert question ${q.display_order}: ${qErr?.message}`)
      await supabase.from('quizzes').delete().eq('id', quiz.id)
      process.exit(1)
    }

    const { error: optErr } = await supabase.from('answer_options').insert(
      q.answer_options.map(opt => ({
        question_id: question.id,
        answer_text: opt.answer_text,
        is_correct: opt.is_correct,
        display_order: opt.display_order,
      }))
    )

    if (optErr) {
      console.error(`\n✗ Failed to insert options for Q${q.display_order}: ${optErr.message}`)
      await supabase.from('quizzes').delete().eq('id', quiz.id)
      process.exit(1)
    }

    const correct = q.answer_options.find(a => a.is_correct)!
    console.log(`  Q${q.display_order}: ${q.question_text.slice(0, 60)} → ✓ ${correct.answer_text}`)
  }

  console.log(`\n✓ Import complete! "${parsed.title}" is ready to use.\n`)
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
