import { useTranslation } from 'react-i18next'

interface RevealControlsProps {
  readonly revealedCount: number
  readonly canReveal: boolean
  readonly onReveal: () => void
  readonly onRestart: () => void
}

export function RevealControls({
  revealedCount,
  canReveal,
  onReveal,
  onRestart,
}: RevealControlsProps) {
  const { t } = useTranslation()

  let label: string
  if (!canReveal) {
    label = t('progressiveReveal.allRevealed')
  } else if (revealedCount === 0) {
    label = t('progressiveReveal.revealFirst')
  } else {
    label = t('progressiveReveal.revealNext')
  }

  return (
    <div className="reveal-controls">
      <button
        type="button"
        className="reveal-controls__reveal"
        onClick={onReveal}
        disabled={!canReveal}
      >
        {label}
      </button>
      <button
        type="button"
        className="reveal-controls__restart"
        onClick={onRestart}
      >
        {t('progressiveReveal.restart')}
      </button>
    </div>
  )
}
