export function calculateScore(
  isCorrect: boolean,
  responseTimeMs: number,
  timerSeconds: number,
  basePoints: number
): number {
  if (!isCorrect) return 0
  const timeLimitMs = timerSeconds * 1000
  const timeRatio = Math.max(0, 1 - responseTimeMs / timeLimitMs)
  const speedBonus = Math.floor(basePoints * 0.5 * timeRatio)
  return basePoints + speedBonus
}

export const AVATAR_COLORS = [
  '#7c3aed', '#2563eb', '#dc2626', '#16a34a',
  '#d97706', '#0891b2', '#db2777', '#059669',
  '#7c2d12', '#1e40af', '#166534', '#92400e',
]

export function getRandomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
}
