import { useTranslation } from 'react-i18next'
import type { CubePair } from '../../domain/taxicab'

interface CubeEquationProps {
  readonly pair: CubePair | null
  readonly target: number
}

export function CubeEquation({ pair, target }: CubeEquationProps) {
  const { t } = useTranslation()

  if (pair === null) {
    return (
      <p
        className="cube-equation cube-equation--hidden"
        role="math"
        aria-label={t('progressiveReveal.equationHiddenAriaLabel', { target })}
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
      aria-label={t('progressiveReveal.equationRevealedAriaLabel', {
        a: pair.a,
        b: pair.b,
        target,
      })}
    >
      <span aria-hidden="true">
        {pair.a}
        <sup>3</sup> + {pair.b}
        <sup>3</sup> = {target}
      </span>
    </p>
  )
}
