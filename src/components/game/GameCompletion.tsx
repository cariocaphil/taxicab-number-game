import type { TaxicabPuzzle } from '../../domain/taxicab'

interface GameCompletionProps {
  readonly visible: boolean
  readonly puzzle: TaxicabPuzzle
}

function completionMessage(puzzle: TaxicabPuzzle): string {
  if (puzzle.target === 1729) {
    return (
      'Congratulations! You discovered why 1729 is the smallest positive integer ' +
      'that can be expressed as the sum of two positive cubes in two distinct ways.'
    )
  }

  return (
    `Congratulations! You discovered that ${puzzle.target} can be expressed as ` +
    'the sum of two positive cubes in two distinct ways — a member of OEIS sequence A001235.'
  )
}

export function GameCompletion({ visible, puzzle }: GameCompletionProps) {
  if (!visible) {
    return null
  }

  return <p className="game-completion">{completionMessage(puzzle)}</p>
}
