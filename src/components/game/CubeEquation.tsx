import type { CubePair } from '../../domain/taxicab'

interface CubeEquationProps {
  readonly pair: CubePair | null
  readonly target: number
}

export function CubeEquation({ pair, target }: CubeEquationProps) {
  if (pair === null) {
    return (
      <p
        className="cube-equation cube-equation--hidden"
        role="math"
        aria-label={`Unknown cubed plus unknown cubed equals ${target}`}
      >
        <span aria-hidden="true">
          ?<sup>3</sup> + ?<sup>3</sup> = {target}
        </span>
      </p>
    )
  }

  return (
    <p
      className="cube-equation cube-equation--revealed"
      role="math"
      aria-label={`${pair.a} cubed plus ${pair.b} cubed equals ${target}`}
    >
      <span aria-hidden="true">
        {pair.a}
        <sup>3</sup> + {pair.b}
        <sup>3</sup> = {target}
      </span>
    </p>
  )
}
