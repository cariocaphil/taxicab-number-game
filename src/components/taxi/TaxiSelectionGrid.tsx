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

function feedbackMessage(
  correctSelected: boolean,
  incorrectCount: number,
): string {
  if (correctSelected) {
    return 'Well spotted! Continue to uncover its mathematical secret.'
  }
  if (incorrectCount > 0) {
    return 'Not quite. Try another taxi!'
  }
  return ''
}

export function TaxiSelectionGrid({
  candidates,
  target,
  incorrectSelections,
  correctSelected,
  onSelect,
  onContinue,
}: TaxiSelectionGridProps) {
  const selectionsLocked = correctSelected

  return (
    <section className="taxi-selection" aria-labelledby="selection-heading">
      <h1 id="selection-heading" className="taxi-selection__heading">
        Spot the Taxicab Number!
      </h1>

      <p className="taxi-selection__prompt">
        One of these taxis is hiding a mathematical secret. Can you find the
        number that can be expressed as the sum of two positive cubes in two
        different ways?
      </p>

      <div className="taxi-selection__grid" role="group" aria-label="Taxi fleet">
        {candidates.map((number) => {
          const isIncorrect = incorrectSelections.has(number)
          const isCorrect = correctSelected && number === target
          const status = isCorrect
            ? 'correct'
            : isIncorrect
              ? 'incorrect'
              : 'default'
          const disabled =
            selectionsLocked || isIncorrect || (correctSelected && !isCorrect)

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
        {feedbackMessage(correctSelected, incorrectSelections.size)}
      </p>

      {correctSelected ? (
        <button
          type="button"
          className="taxi-selection__continue"
          onClick={onContinue}
        >
          Continue
        </button>
      ) : null}
    </section>
  )
}
