import type { TaxicabPuzzle } from './types'

/**
 * Small verified catalogue of numbers expressible as the sum of two positive
 * cubes in two distinct ways. Only 1729 is Taxicab(2) / Ta(2) in the
 * conventional sequence; the others are additional educational examples.
 *
 * Catalogue consistency is asserted in unit tests via `validatePuzzle`.
 */
export const TAXICAB_PUZZLES: readonly TaxicabPuzzle[] = [
  {
    id: '1729',
    target: 1729,
    representations: [
      { a: 1, b: 12 },
      { a: 9, b: 10 },
    ],
  },
  {
    id: '4104',
    target: 4104,
    representations: [
      { a: 2, b: 16 },
      { a: 9, b: 15 },
    ],
  },
  {
    id: '13832',
    target: 13832,
    representations: [
      { a: 2, b: 24 },
      { a: 18, b: 20 },
    ],
  },
  {
    id: '20683',
    target: 20683,
    representations: [
      { a: 10, b: 27 },
      { a: 19, b: 24 },
    ],
  },
] as const

export function getPuzzleById(id: string): TaxicabPuzzle | undefined {
  return TAXICAB_PUZZLES.find((puzzle) => puzzle.id === id)
}
