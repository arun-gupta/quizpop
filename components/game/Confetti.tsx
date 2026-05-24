'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function Confetti() {
  useEffect(() => {
    const fire = () => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
        ticks: 200,
      })

      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ['#a855f7', '#6366f1', '#ec4899', '#f59e0b'],
      })

      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
      })
    }

    // Initial burst
    fire()

    // Repeat every 3 seconds
    const interval = setInterval(fire, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return null
}
