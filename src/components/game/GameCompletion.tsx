interface GameCompletionProps {
  readonly visible: boolean
}

export function GameCompletion({ visible }: GameCompletionProps) {
  if (!visible) {
    return null
  }

  return (
    <p className="game-completion">
      Congratulations! You discovered why 1729 is the smallest positive integer
      that can be expressed as the sum of two positive cubes in two distinct
      ways.
    </p>
  )
}
