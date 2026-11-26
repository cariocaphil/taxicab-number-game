interface RevealControlsProps {
  readonly revealLabel: string
  readonly canReveal: boolean
  readonly onReveal: () => void
  readonly onRestart: () => void
}

export function RevealControls({
  revealLabel,
  canReveal,
  onReveal,
  onRestart,
}: RevealControlsProps) {
  return (
    <div className="reveal-controls">
      <button
        type="button"
        className="reveal-controls__reveal"
        onClick={onReveal}
        disabled={!canReveal}
      >
        {revealLabel}
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
