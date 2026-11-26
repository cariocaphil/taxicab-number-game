/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { TAXICAB_PUZZLES } from './puzzles'
import type { TaxicabPuzzle } from './types'
import { validatePuzzle } from './validation'

describe('validatePuzzle', () => {
  it('accepts every catalogue puzzle', () => {
    for (const puzzle of TAXICAB_PUZZLES) {
      expect(validatePuzzle(puzzle)).toEqual({ ok: true })
    }
  })

  it('rejects an incorrect target', () => {
    const puzzle: TaxicabPuzzle = {
      id: 'wrong-target',
      target: 1728,
      representations: [
        { a: 1, b: 12 },
        { a: 9, b: 10 },
      ],
    }
    const result = validatePuzzle(puzzle)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.some((error) => /not a valid cube pair|missing representation/i.test(error))).toBe(
        true,
      )
    }
  })

  it('rejects duplicate representations', () => {
    const puzzle: TaxicabPuzzle = {
      id: 'duplicates',
      target: 1729,
      representations: [
        { a: 1, b: 12 },
        { a: 1, b: 12 },
      ],
    }
    const result = validatePuzzle(puzzle)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.some((error) => /duplicate/i.test(error))).toBe(true)
    }
  })

  it('rejects reversed (non-normalized) representations', () => {
    const puzzle: TaxicabPuzzle = {
      id: 'reversed',
      target: 1729,
      representations: [
        { a: 12, b: 1 },
        { a: 9, b: 10 },
      ],
    }
    const result = validatePuzzle(puzzle)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.some((error) => /normalized|a <= b/i.test(error))).toBe(
        true,
      )
    }
  })

  it('rejects incomplete representation lists', () => {
    const puzzle: TaxicabPuzzle = {
      id: 'incomplete',
      target: 1729,
      representations: [{ a: 1, b: 12 }],
    }
    const result = validatePuzzle(puzzle)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(
        result.errors.some(
          (error) =>
            /at least two/i.test(error) || /missing representation/i.test(error),
        ),
      ).toBe(true)
    }
  })

  it('rejects zero and negative cube values', () => {
    const withZero: TaxicabPuzzle = {
      id: 'zero',
      target: 1729,
      representations: [
        { a: 0, b: 12 },
        { a: 9, b: 10 },
      ],
    }
    const withNegative: TaxicabPuzzle = {
      id: 'negative',
      target: 1729,
      representations: [
        { a: -1, b: 12 },
        { a: 9, b: 10 },
      ],
    }

    expect(validatePuzzle(withZero).ok).toBe(false)
    expect(validatePuzzle(withNegative).ok).toBe(false)
  })
})
