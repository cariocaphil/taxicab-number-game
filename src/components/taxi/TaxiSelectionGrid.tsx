import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { TaxiCab } from './TaxiCab'
import '../../styles/taxi-selection.css'

interface TaxiSelectionGridProps {
  readonly candidates: readonly number[]
  readonly target: number
  readonly incorrectSelections: ReadonlySet<number>
  readonly correctSelected: boolean
  readonly onSelect: (number: number) => void
  readonly onContinue: () => void
}

function latestIncorrect(
  selections: ReadonlySet<number>,
): number | undefined {
  let latest: number | undefined
  for (const value of selections) {
    latest = value
  }
  return latest
}

export function TaxiSelectionGrid({
  candidates,
  target,
  incorrectSelections,
  correctSelected,
  onSelect,
  onContinue,
}: TaxiSelectionGridProps) {
  const { t } = useTranslation()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const continueRef = useRef<HTMLButtonElement>(null)
  const selectionsLocked = correctSelected

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  useEffect(() => {
    if (correctSelected) {
      continueRef.current?.focus()
    }
  }, [correctSelected])

  let feedback = ''
  if (correctSelected) {
    feedback = t('game.feedbackSuccess')
  } else {
    const plate = latestIncorrect(incorrectSelections)
    if (plate !== undefined) {
      feedback = t('game.feedbackIncorrect', { plate })
    }
  }

  return (
    <section className="taxi-selection" aria-labelledby="selection-heading">
      <h1
        id="selection-heading"
        className="taxi-selection__heading"
        tabIndex={-1}
        ref={headingRef}
      >
        {t('game.heading')}
      </h1>

      <p className="taxi-selection__prompt">{t('game.prompt')}</p>

      <div
        className="taxi-selection__grid"
        role="group"
        aria-label={t('game.fleetLabel')}
      >
        {candidates.map((number) => {
          const isIncorrect = incorrectSelections.has(number)
          const isCorrect = correctSelected && number === target
          const status = isCorrect
            ? 'correct'
            : isIncorrect
              ? 'incorrect'
              : 'default'
          const disabled = selectionsLocked || isIncorrect

          return (
            <TaxiCab
              key={number}
              number={number}
              status={status}
              disabled={disabled}
              onSelect={() => onSelect(number)}
            />
          )
        })}
      </div>

      <p
        className="taxi-selection__feedback"
        aria-live="polite"
        aria-atomic="true"
      >
        {feedback}
      </p>

      {correctSelected ? (
        <button
          ref={continueRef}
          type="button"
          className="taxi-selection__continue"
          onClick={onContinue}
        >
          {t('game.continue')}
        </button>
      ) : null}
    </section>
  )
}
