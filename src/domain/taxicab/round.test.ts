/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { findCubePairs } from './math'
import { TAXICAB_PUZZLES } from './puzzles'
import {
  CANDIDATE_COUNT,
  digitLength,
  generateTaxicabRound,
  MAX_FALLBACK_PROBES,
  MAX_RANDOM_ATTEMPTS,
  type RandomFn,
} from './round'
import type { TaxicabPuzzle } from './types'

function sequenceRandom(values: number[]): RandomFn {
  let index = 0
  return () => {
    const value = values[index % values.length] ?? 0
    index += 1
    return value
  }
}

function digitMultiset(candidates: readonly number[]): number[] {
  return candidates.map(digitLength).sort((a, b) => a - b)
}

describe('digitLength', () => {
  it('returns the decimal digit count for positive integers', () => {
    expect(digitLength(1729)).toBe(4)
    expect(digitLength(13832)).toBe(5)
    expect(digitLength(110656)).toBe(6)
  })
})

describe('generateTaxicabRound', () => {
  it('generates exactly six distinct positive integer candidates', () => {
    const round = generateTaxicabRound({ random: () => 0.3 })

    expect(round.candidates).toHaveLength(CANDIDATE_COUNT)
    expect(new Set(round.candidates).size).toBe(CANDIDATE_COUNT)
    for (const candidate of round.candidates) {
      expect(candidate).toBeGreaterThan(0)
      expect(Number.isSafeInteger(candidate)).toBe(true)
    }
  })

  it('includes exactly one candidate with at least two cube representations', () => {
    const round = generateTaxicabRound({ random: () => 0.4 })
    const taxicabs = round.candidates.filter(
      (n) => findCubePairs(n).length >= 2,
    )
    expect(taxicabs).toEqual([round.puzzle.target])
  })

  it('verifies every distractor has fewer than two representations', () => {
    const round = generateTaxicabRound({ random: () => 0.2 })
    for (const candidate of round.candidates) {
      if (candidate === round.puzzle.target) {
        continue
      }
      expect(findCubePairs(candidate).length).toBeLessThan(2)
    }
  })

  it('contains exactly two numbers of each digit length', () => {
    const round = generateTaxicabRound({ random: () => 0.55 })
    expect(digitMultiset(round.candidates)).toEqual([4, 4, 5, 5, 6, 6])
  })

  it('can select different correct targets across rounds', () => {
    const first = generateTaxicabRound({ random: () => 0 })
    const second = generateTaxicabRound({ random: () => 0.99 })
    expect(first.puzzle.target).not.toBe(second.puzzle.target)
  })

  it('can vary candidate ordering with controlled randomness', () => {
    const first = generateTaxicabRound({
      random: sequenceRandom([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]),
    })
    const second = generateTaxicabRound({
      random: sequenceRandom([0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3]),
    })
    expect(first.puzzle.target).toBe(second.puzzle.target)
    expect(first.candidates).not.toEqual(second.candidates)
  })

  it('is deterministic with identical controlled randomness', () => {
    const values = [0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88, 0.15]
    const first = generateTaxicabRound({
      random: sequenceRandom(values),
    })
    const second = generateTaxicabRound({
      random: sequenceRandom(values),
    })
    expect(first).toEqual(second)
  })

  it('avoids immediately repeating the previous target when alternatives exist', () => {
    const previous = TAXICAB_PUZZLES[0]?.target
    expect(previous).toBeDefined()
    const round = generateTaxicabRound({
      excludeTarget: previous,
      random: () => 0,
    })
    expect(round.puzzle.target).not.toBe(previous)
  })

  it('allows repeating the only available target when exclusion empties the pool', () => {
    const alone = TAXICAB_PUZZLES[0]
    if (alone === undefined) {
      throw new Error('Expected catalogue entry')
    }
    const round = generateTaxicabRound({
      puzzles: [alone],
      excludeTarget: alone.target,
      random: () => 0,
    })
    expect(round.puzzle.target).toBe(alone.target)
  })

  it('terminates with pathological constant RNG via bounded fallback', () => {
    const round = generateTaxicabRound({ random: () => 0 })
    expect(round.candidates).toHaveLength(CANDIDATE_COUNT)
    expect(digitMultiset(round.candidates)).toEqual([4, 4, 5, 5, 6, 6])
  })

  it('exposes bounded attempt constants', () => {
    expect(MAX_RANDOM_ATTEMPTS).toBe(128)
    expect(MAX_FALLBACK_PROBES).toBe(256)
  })

  it('rejects an empty puzzle catalog', () => {
    expect(() => generateTaxicabRound({ puzzles: [] })).toThrow(
      /must not be empty/,
    )
  })

  it('rejects puzzles with unsupported target digit lengths', () => {
    const eightDigit: TaxicabPuzzle = {
      id: '87539319',
      target: 87539319,
      representations: [
        { a: 167, b: 436 },
        { a: 228, b: 423 },
      ],
    }
    expect(() =>
      generateTaxicabRound({ puzzles: [eightDigit], random: () => 0 }),
    ).toThrow(/Unsupported target digit length/)
  })

  it('rejects puzzles with invalid representations', () => {
    const invalid: TaxicabPuzzle = {
      id: '1729-bad',
      target: 1729,
      representations: [
        { a: 1, b: 12 },
        { a: 2, b: 3 },
      ],
    }
    expect(() =>
      generateTaxicabRound({ puzzles: [invalid], random: () => 0 }),
    ).toThrow(/Invalid puzzle/)
  })
})
