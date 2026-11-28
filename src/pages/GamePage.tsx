import { ProgressiveReveal } from '../components/game/ProgressiveReveal'
import { TaxiSelectionGrid } from '../components/taxi/TaxiSelectionGrid'
import {
  useGameSession,
  type UseGameSessionOptions,
} from '../hooks/useGameSession'

interface GamePageProps {
  readonly sessionOptions?: UseGameSessionOptions
}

export function GamePage({ sessionOptions }: GamePageProps = {}) {
  const session = useGameSession(sessionOptions)

  if (session.phase === 'selecting') {
    return (
      <TaxiSelectionGrid
        candidates={session.round.candidates}
        target={session.round.puzzle.target}
        incorrectSelections={session.incorrectSelections}
        correctSelected={session.correctSelected}
        onSelect={session.selectTaxi}
        onContinue={session.continueToReveal}
      />
    )
  }

  return (
    <ProgressiveReveal
      puzzle={session.round.puzzle}
      onNewRound={session.startNewRound}
    />
  )
}
