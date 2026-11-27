interface RevealControlsProps {
  readonly revealedCount: number
  readonly canReveal: boolean
  readonly onReveal: () => void
  readonly onRestart: () => void
}

function revealButtonLabel(revealedCount: number, canReveal: boolean): string {
  if (!canReveal) {
    return 'All representations revealed'
  }
  if (revealedCount === 0) {
    return 'Reveal first representation'
  }
  return 'Reveal next representation'
}

export function RevealControls({
  revealedCount,
  canReveal,
  onReveal,
  onRestart,
}: RevealControlsProps) {
  const label = revealButtonLabel(revealedCount, canReveal)

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
        Restart
      </button>
    </div>
  )
}
