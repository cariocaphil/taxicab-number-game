import type { TaxicabPuzzle } from './types'

/**
 * Curated OEIS A001235 catalogue: positive integers expressible as the sum of
 * two positive cubes in two distinct ways. Representations are taken from
 * `findCubePairs` (verified in unit tests). Only 1729 is Ta(2).
 *
 * No runtime OEIS fetch — this list is local and deterministic.
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
  {
    id: '32832',
    target: 32832,
    representations: [
      { a: 4, b: 32 },
      { a: 18, b: 30 },
    ],
  },
  {
    id: '39312',
    target: 39312,
    representations: [
      { a: 2, b: 34 },
      { a: 15, b: 33 },
    ],
  },
  {
    id: '40033',
    target: 40033,
    representations: [
      { a: 9, b: 34 },
      { a: 16, b: 33 },
    ],
  },
  {
    id: '46683',
    target: 46683,
    representations: [
      { a: 3, b: 36 },
      { a: 27, b: 30 },
    ],
  },
  {
    id: '64232',
    target: 64232,
    representations: [
      { a: 17, b: 39 },
      { a: 26, b: 36 },
    ],
  },
  {
    id: '65728',
    target: 65728,
    representations: [
      { a: 12, b: 40 },
      { a: 31, b: 33 },
    ],
  },
  {
    id: '110656',
    target: 110656,
    representations: [
      { a: 4, b: 48 },
      { a: 36, b: 40 },
    ],
  },
  {
    id: '110808',
    target: 110808,
    representations: [
      { a: 6, b: 48 },
      { a: 27, b: 45 },
    ],
  },
  {
    id: '134379',
    target: 134379,
    representations: [
      { a: 12, b: 51 },
      { a: 38, b: 43 },
    ],
  },
  {
    id: '149389',
    target: 149389,
    representations: [
      { a: 8, b: 53 },
      { a: 29, b: 50 },
    ],
  },
] as const

/** Largest cube edge length appearing in TAXICAB_PUZZLES representations. */
export const CATALOGUE_MAX_EDGE = Math.max(
  ...TAXICAB_PUZZLES.flatMap((puzzle) =>
    puzzle.representations.flatMap(({ a, b }) => [a, b]),
  ),
)

export function getPuzzleById(id: string): TaxicabPuzzle | undefined {
  return TAXICAB_PUZZLES.find((puzzle) => puzzle.id === id)
}
