import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getPuzzleById, type TaxicabRound } from '../domain/taxicab'
import { useGameSession } from './useGameSession'

const puzzle = getPuzzleById('4104')
if (puzzle === undefined) {
  throw new Error('Expected catalogue puzzle 4104')
}

const round: TaxicabRound = {
  puzzle,
  candidates: [4104, 1111, 2222, 11111, 22222, 111111],
}

describe('useGameSession', () => {
  it('starts in the selecting phase', () => {
    const { result } = renderHook(() =>
      useGameSession({ generateRound: () => round }),
    )
    expect(result.current.phase).toBe('selecting')
    expect(result.current.correctSelected).toBe(false)
  })

  it('records incorrect selections and ignores repeats', () => {
    const { result } = renderHook(() =>
      useGameSession({ generateRound: () => round }),
    )

    act(() => {
      result.current.selectTaxi(1111)
    })
    act(() => {
      result.current.selectTaxi(1111)
    })

    expect([...result.current.incorrectSelections]).toEqual([1111])
    expect(result.current.correctSelected).toBe(false)
  })

  it('marks the correct taxi and advances to revealing on continue', () => {
    const { result } = renderHook(() =>
      useGameSession({ generateRound: () => round }),
    )

    act(() => {
      result.current.selectTaxi(4104)
    })
    expect(result.current.correctSelected).toBe(true)

    act(() => {
      result.current.selectTaxi(2222)
    })
    expect(result.current.incorrectSelections.size).toBe(0)

    act(() => {
      result.current.continueToReveal()
    })
    expect(result.current.phase).toBe('revealing')
  })

  it('resets selection state when starting a new round', () => {
    let calls = 0
    const secondPuzzle = getPuzzleById('1729')
    if (secondPuzzle === undefined) {
      throw new Error('Expected 1729')
    }

    const { result } = renderHook(() =>
      useGameSession({
        generateRound: () => {
          calls += 1
          return calls === 1
            ? round
            : {
                puzzle: secondPuzzle,
                candidates: [1729, 1000, 2000, 10000, 20000, 100000],
              }
        },
      }),
    )

    act(() => {
      result.current.selectTaxi(4104)
      result.current.continueToReveal()
    })
    act(() => {
      result.current.startNewRound()
    })

    expect(result.current.phase).toBe('selecting')
    expect(result.current.correctSelected).toBe(false)
    expect(result.current.incorrectSelections.size).toBe(0)
    expect(result.current.round.puzzle.target).toBe(1729)
    expect(calls).toBe(2)
  })
})
