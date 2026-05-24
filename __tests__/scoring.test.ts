import { describe, it, expect } from 'vitest'
import { calculateScore } from '../lib/scoring'

describe('calculateScore', () => {
  it('returns 0 for incorrect answer', () => {
    expect(calculateScore(false, 1000, 20, 1000)).toBe(0)
  })

  it('returns base + max speed bonus for instant answer', () => {
    const score = calculateScore(true, 0, 20, 1000)
    expect(score).toBe(1500) // 1000 + 500 speed bonus
  })

  it('returns base points for last-second answer', () => {
    const score = calculateScore(true, 20000, 20, 1000)
    expect(score).toBe(1000) // 1000 + 0 speed bonus
  })

  it('returns base points for overtime answer', () => {
    const score = calculateScore(true, 25000, 20, 1000)
    expect(score).toBe(1000)
  })

  it('returns proportional bonus for mid-time answer', () => {
    // 10s on 20s timer = 50% time used -> 50% speed bonus
    const score = calculateScore(true, 10000, 20, 1000)
    expect(score).toBe(1250) // 1000 + floor(500 * 0.5)
  })
})
