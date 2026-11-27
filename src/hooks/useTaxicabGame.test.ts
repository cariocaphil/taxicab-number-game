import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { TaxicabPuzzle } from '../domain/taxicab'
import { getPuzzleById } from '../domain/taxicab'
import { useTaxicabGame } from './useTaxicabGame'

const puzzle1729 = getPuzzleById('1729')

if (puzzle1729 === undefined) {
  throw new Error('Expected catalogue puzzle with id "1729"')
}

const TA3_FIXTURE: TaxicabPuzzle = {
  id: '87539319',
  target: 87539319,
  representations: [
    { a: 167, b: 436 },
    { a: 228, b: 423 },
    { a: 255, b: 414 },
  ],
}

describe('useTaxicabGame', () => {
  it('starts with nothing revealed', () => {
    const { result } = renderHook(() => useTaxicabGame(puzzle1729))

    expect(result.current.revealedCount).toBe(0)
    expect(result.current.canReveal).toBe(true)
    expect(result.current.isComplete).toBe(false)
  })

  it('reveals representations one at a time up to the puzzle length', () => {
    const { result } = renderHook(() => useTaxicabGame(puzzle1729))
    const total = puzzle1729.representations.length

    act(() => {
      result.current.revealNext()
    })

    expect(result.current.revealedCount).toBe(1)
    expect(result.current.isComplete).toBe(false)

    act(() => {
      result.current.revealNext()
    })

    expect(result.current.revealedCount).toBe(total)
    expect(result.current.canReveal).toBe(false)
    expect(result.current.isComplete).toBe(true)
  })

  it('does not advance beyond the available representations', () => {
    const { result } = renderHook(() => useTaxicabGame(puzzle1729))
    const total = puzzle1729.representations.length

    act(() => {
      result.current.revealNext()
      result.current.revealNext()
      result.current.revealNext()
      result.current.revealNext()
    })

    expect(result.current.revealedCount).toBe(total)
    expect(result.current.canReveal).toBe(false)
  })

  it('restarts to the initial reveal state', () => {
    const { result } = renderHook(() => useTaxicabGame(puzzle1729))

    act(() => {
      result.current.revealNext()
      result.current.revealNext()
    })

    expect(result.current.isComplete).toBe(true)

    act(() => {
      result.current.restart()
    })

    expect(result.current.revealedCount).toBe(0)
    expect(result.current.canReveal).toBe(true)
    expect(result.current.isComplete).toBe(false)
  })

  it('generalizes reveal progression to three representations', () => {
    const { result } = renderHook(() => useTaxicabGame(TA3_FIXTURE))

    expect(TA3_FIXTURE.representations).toHaveLength(3)
    expect(result.current.revealedCount).toBe(0)

    act(() => {
      result.current.revealNext()
    })
    expect(result.current.revealedCount).toBe(1)
    expect(result.current.canReveal).toBe(true)

    act(() => {
      result.current.revealNext()
    })
    expect(result.current.revealedCount).toBe(2)

    act(() => {
      result.current.revealNext()
    })
    expect(result.current.revealedCount).toBe(3)
    expect(result.current.isComplete).toBe(true)
    expect(result.current.canReveal).toBe(false)

    act(() => {
      result.current.revealNext()
    })
    expect(result.current.revealedCount).toBe(3)
  })
})
