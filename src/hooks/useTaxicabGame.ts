import { useState } from 'react'
import type { TaxicabPuzzle } from '../domain/taxicab'

export interface UseTaxicabGameResult {
  readonly revealedCount: number
  readonly canReveal: boolean
  readonly isComplete: boolean
  readonly revealNext: () => void
  readonly restart: () => void
  readonly revealButtonLabel: string
}

function revealButtonLabelFor(
  revealedCount: number,
  total: number,
): string {
  if (revealedCount >= total) {
    return 'All representations revealed'
  }
  if (revealedCount === 0) {
    return 'Reveal first representation'
  }
  return 'Reveal next representation'
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
    revealButtonLabel: revealButtonLabelFor(revealedCount, total),
  }
}
