import { CubeEquation } from '../components/game/CubeEquation'
import { GameCompletion } from '../components/game/GameCompletion'
import { RevealControls } from '../components/game/RevealControls'
import { TaxiPlate } from '../components/game/TaxiPlate'
import { getPuzzleById } from '../domain/taxicab'
import { useTaxicabGame } from '../hooks/useTaxicabGame'
import '../styles/game.css'

function resolveInitialPuzzle() {
  const puzzle = getPuzzleById('1729')
  if (puzzle === undefined) {
    throw new Error('Expected catalogue puzzle with id "1729"')
  }
  return puzzle
}

const INITIAL_PUZZLE = resolveInitialPuzzle()

function liveRegionMessage(
  revealedCount: number,
  isComplete: boolean,
): string {
  if (revealedCount === 0) {
    return ''
  }
  if (isComplete) {
    return 'All representations revealed.'
  }
  return `Representation ${revealedCount} of the cube sum equations has been revealed.`
}

export function GamePage() {
  const puzzle = INITIAL_PUZZLE
  const {
    revealedCount,
    canReveal,
    isComplete,
    revealNext,
    restart,
    revealButtonLabel,
  } = useTaxicabGame(puzzle)

  return (
    <section className="game-page" aria-labelledby="game-heading">
      <h1 id="game-heading" className="game-page__heading">
        Discover the taxicab number
      </h1>

      <TaxiPlate number={puzzle.target} />

      <p className="game-page__prompt">
        Can you discover two different ways to express this number as the sum
        of two positive cubes?
      </p>

      <div className="game-page__equations">
        {puzzle.representations.map((pair, index) => (
          <CubeEquation
            key={`${pair.a}-${pair.b}`}
            pair={index < revealedCount ? pair : null}
            target={puzzle.target}
          />
        ))}
      </div>

      <div
        className="game-page__live"
        aria-live="polite"
        aria-atomic="true"
      >
        {liveRegionMessage(revealedCount, isComplete)}
      </div>

      <RevealControls
        revealLabel={revealButtonLabel}
        canReveal={canReveal}
        onReveal={revealNext}
        onRestart={restart}
      />

      <GameCompletion visible={isComplete} />
    </section>
  )
}
