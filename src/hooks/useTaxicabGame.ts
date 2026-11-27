import { useState } from 'react'
import type { TaxicabPuzzle } from '../domain/taxicab'

export interface UseTaxicabGameResult {
  readonly revealedCount: number
  readonly canReveal: boolean
  readonly isComplete: boolean
  readonly revealNext: () => void
  readonly restart: () => void
}

export function useTaxicabGame(puzzle: TaxicabPuzzle): UseTaxicabGameResult {
  const total = puzzle.representations.length
  const [revealedCount, setRevealedCount] = useState(0)

  const canReveal = revealedCount < total
  const isComplete = revealedCount >= total

  const revealNext = () => {
    setRevealedCount((current) => Math.min(current + 1, total))
  }

  const restart = () => {
    setRevealedCount(0)
  }

  return {
    revealedCount,
    canReveal,
    isComplete,
    revealNext,
    restart,
  }
}
