import { useTranslation } from 'react-i18next'
import type { TaxicabPuzzle } from '../../domain/taxicab'

interface GameCompletionProps {
  readonly visible: boolean
  readonly puzzle: TaxicabPuzzle
}

export function GameCompletion({ visible, puzzle }: GameCompletionProps) {
  const { t } = useTranslation()

  if (!visible) {
    return null
  }

  const message =
    puzzle.target === 1729
      ? t('progressiveReveal.completion1729')
      : t('progressiveReveal.completionGeneric', { target: puzzle.target })

  return <p className="game-completion">{message}</p>
}
