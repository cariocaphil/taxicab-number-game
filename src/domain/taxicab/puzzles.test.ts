/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { FULL_UNIT_GRID_MAX_EDGE } from '../../components/visualization/cubeLayout'
import { findCubePairs } from './math'
import { CATALOGUE_MAX_EDGE, getPuzzleById, TAXICAB_PUZZLES } from './puzzles'
import { validatePuzzle } from './validation'

function digitLength(n: number): number {
  return String(n).length
}

describe('TAXICAB_PUZZLES catalogue', () => {
  it('contains at least 12 distinct puzzles', () => {
    expect(TAXICAB_PUZZLES.length).toBeGreaterThanOrEqual(12)
    const targets = TAXICAB_PUZZLES.map((puzzle) => puzzle.target)
    expect(new Set(targets).size).toBe(TAXICAB_PUZZLES.length)
  })

  it('includes four-, five-, and six-digit targets', () => {
    const lengths = new Set(TAXICAB_PUZZLES.map((p) => digitLength(p.target)))
    expect(lengths.has(4)).toBe(true)
    expect(lengths.has(5)).toBe(true)
    expect(lengths.has(6)).toBe(true)

    const byLength = (digits: number) =>
      TAXICAB_PUZZLES.filter((p) => digitLength(p.target) === digits)
    expect(byLength(4).length).toBeGreaterThanOrEqual(2)
    expect(byLength(5).length).toBeGreaterThanOrEqual(2)
    expect(byLength(6).length).toBeGreaterThanOrEqual(2)
  })

  it('gives every puzzle exactly two engine-verified representations', () => {
    for (const puzzle of TAXICAB_PUZZLES) {
      expect(puzzle.representations).toHaveLength(2)
      expect(findCubePairs(puzzle.target)).toEqual([...puzzle.representations])
      expect(validatePuzzle(puzzle)).toEqual({ ok: true })
    }
  })

  it('preserves existing puzzle IDs', () => {
    for (const id of ['1729', '4104', '13832', '20683'] as const) {
      const puzzle = getPuzzleById(id)
      expect(puzzle).toBeDefined()
      expect(puzzle?.id).toBe(id)
      expect(puzzle?.target).toBe(Number(id))
    }
  })

  it('derives CATALOGUE_MAX_EDGE from representation edges', () => {
    const maxEdge = Math.max(
      ...TAXICAB_PUZZLES.flatMap((puzzle) =>
        puzzle.representations.flatMap(({ a, b }) => [a, b]),
      ),
    )

    expect(Number.isInteger(CATALOGUE_MAX_EDGE)).toBe(true)
    expect(CATALOGUE_MAX_EDGE).toBeGreaterThan(0)
    expect(CATALOGUE_MAX_EDGE).toBe(maxEdge)
    expect(CATALOGUE_MAX_EDGE).toBeGreaterThan(FULL_UNIT_GRID_MAX_EDGE)
  })
})
