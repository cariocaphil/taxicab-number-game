import { useState } from 'react'
import {
  generateTaxicabRound,
  type GamePhase,
  type RandomFn,
  type TaxicabRound,
} from '../domain/taxicab'

export interface UseGameSessionOptions {
  readonly random?: RandomFn
  readonly generateRound?: (excludeTarget?: number) => TaxicabRound
}

export interface UseGameSessionResult {
  readonly phase: GamePhase
  readonly round: TaxicabRound
  readonly incorrectSelections: ReadonlySet<number>
  readonly correctSelected: boolean
  readonly selectTaxi: (number: number) => void
  readonly continueToReveal: () => void
  readonly startNewRound: () => void
}

function createRound(
  options: UseGameSessionOptions | undefined,
  excludeTarget?: number,
): TaxicabRound {
  if (options?.generateRound !== undefined) {
    return options.generateRound(excludeTarget)
  }
  return generateTaxicabRound({
    random: options?.random,
    excludeTarget,
  })
}

export function useGameSession(
  options?: UseGameSessionOptions,
): UseGameSessionResult {
  const [round, setRound] = useState(() => createRound(options))
  const [phase, setPhase] = useState<GamePhase>('selecting')
  const [incorrectSelections, setIncorrectSelections] = useState(
    () => new Set<number>(),
  )
  const [correctSelected, setCorrectSelected] = useState(false)

  const selectTaxi = (number: number) => {
    if (phase !== 'selecting' || correctSelected) {
      return
    }
    if (!round.candidates.includes(number)) {
      return
    }
    if (incorrectSelections.has(number)) {
      return
    }

    if (number === round.puzzle.target) {
      setCorrectSelected(true)
      return
    }

    setIncorrectSelections((current) => {
      const next = new Set(current)
      next.add(number)
      return next
    })
  }

  const continueToReveal = () => {
    if (!correctSelected) {
      return
    }
    setPhase('revealing')
  }

  const startNewRound = () => {
    const previousTarget = round.puzzle.target
    setRound(createRound(options, previousTarget))
    setIncorrectSelections(new Set())
    setCorrectSelected(false)
    setPhase('selecting')
  }

  return {
    phase,
    round,
    incorrectSelections,
    correctSelected,
    selectTaxi,
    continueToReveal,
    startNewRound,
  }
}
