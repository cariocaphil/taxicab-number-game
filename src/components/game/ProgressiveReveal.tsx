import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { TaxicabPuzzle } from '../../domain/taxicab'
import { useTaxicabGame } from '../../hooks/useTaxicabGame'
import { CubeVisualization } from '../visualization/CubeVisualization'
import { CubeEquation } from './CubeEquation'
import { GameCompletion } from './GameCompletion'
import { RevealControls } from './RevealControls'
import { TaxiPlate } from './TaxiPlate'
import '../../styles/game.css'

interface ProgressiveRevealProps {
  readonly puzzle: TaxicabPuzzle
  readonly onNewRound: () => void
}

export function ProgressiveReveal({
  puzzle,
  onNewRound,
}: ProgressiveRevealProps) {
  const { t } = useTranslation()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const {
    revealedCount,
    canReveal,
    isComplete,
    revealNext,
    restart,
  } = useTaxicabGame(puzzle)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  let announcement = ''
  if (revealedCount > 0) {
    announcement = isComplete
      ? t('progressiveReveal.allRevealedAnnouncement')
      : t('progressiveReveal.representationRevealed', { count: revealedCount })
  }

  return (
    <section className="game-page" aria-labelledby="reveal-heading">
      <h1
        id="reveal-heading"
        className="game-page__heading"
        tabIndex={-1}
        ref={headingRef}
      >
        {t('progressiveReveal.heading')}
      </h1>

      <TaxiPlate number={puzzle.target} />

      <p className="game-page__prompt">{t('progressiveReveal.prompt')}</p>

      <div className="game-page__equations">
        {puzzle.representations.map((pair, index) => {
          const revealed = index < revealedCount ? pair : null
          return (
            <div
              key={`${pair.a}-${pair.b}`}
              className="game-page__representation"
            >
              <CubeEquation pair={revealed} target={puzzle.target} />
              {revealed ? (
                <CubeVisualization
                  pair={revealed}
                  enableWebGL={index === revealedCount - 1}
                />
              ) : null}
            </div>
          )
        })}
      </div>

      <div
        className="game-page__live"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <RevealControls
        revealedCount={revealedCount}
        canReveal={canReveal}
        onReveal={revealNext}
        onRestart={restart}
      />

      <GameCompletion visible={isComplete} puzzle={puzzle} />

      {isComplete ? (
        <button
          type="button"
          className="reveal-controls__restart game-page__new-round"
          onClick={onNewRound}
        >
          {t('progressiveReveal.newRound')}
        </button>
      ) : null}
    </section>
  )
}
