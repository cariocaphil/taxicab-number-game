import { findCubePairs } from './math'
import { TAXICAB_PUZZLES } from './puzzles'
import type { TaxicabPuzzle } from './types'
import { validatePuzzle } from './validation'

export interface TaxicabRound {
  readonly puzzle: TaxicabPuzzle
  readonly candidates: readonly number[]
}

/** Returns a float in [0, 1). */
export type RandomFn = () => number

export interface GenerateTaxicabRoundOptions {
  readonly random?: RandomFn
  readonly excludeTarget?: number
  readonly puzzles?: readonly TaxicabPuzzle[]
}

export const MAX_RANDOM_ATTEMPTS = 128
export const MAX_FALLBACK_PROBES = 256
export const DISTRACTOR_COUNT = 5
export const CANDIDATE_COUNT = DISTRACTOR_COUNT + 1

const SUPPORTED_DIGIT_LENGTHS = new Set([4, 5, 6])

type DigitLength = 4 | 5 | 6

const DIGIT_RANGES: Record<DigitLength, { min: number; max: number }> = {
  4: { min: 1000, max: 9999 },
  5: { min: 10000, max: 99999 },
  6: { min: 100000, max: 999999 },
}

export function digitLength(n: number): number {
  if (!Number.isSafeInteger(n) || n <= 0) {
    throw new Error('digitLength requires a positive safe integer')
  }
  return String(n).length
}

function shuffle<T>(items: readonly T[], random: RandomFn): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const current = result[index]
    const swapped = result[swapIndex]
    if (current === undefined || swapped === undefined) {
      throw new Error('Unexpected undefined during shuffle')
    }
    result[index] = swapped
    result[swapIndex] = current
  }
  return result
}

function assertSupportedDigitLength(target: number, id: string): DigitLength {
  const length = digitLength(target)
  if (!SUPPORTED_DIGIT_LENGTHS.has(length)) {
    throw new Error(
      `Unsupported target digit length for puzzle "${id}": ${length} (expected 4, 5, or 6)`,
    )
  }
  return length as DigitLength
}

/**
 * Validates a puzzle catalog for round generation: non-empty, supported digit
 * lengths, and representations that match the engine with exactly two pairs.
 */
export function validateRoundCatalog(
  puzzles: readonly TaxicabPuzzle[],
): void {
  if (puzzles.length === 0) {
    throw new Error('Puzzle catalog must not be empty')
  }

  for (const puzzle of puzzles) {
    assertSupportedDigitLength(puzzle.target, puzzle.id)

    const result = validatePuzzle(puzzle)
    if (!result.ok) {
      throw new Error(
        `Invalid puzzle "${puzzle.id}": ${result.errors.join('; ')}`,
      )
    }

    if (puzzle.representations.length !== 2) {
      throw new Error(
        `Puzzle "${puzzle.id}" must have exactly two representations for round generation`,
      )
    }

    const enginePairs = findCubePairs(puzzle.target)
    if (enginePairs.length !== 2) {
      throw new Error(
        `Puzzle "${puzzle.id}" target must have exactly two cube-pair representations`,
      )
    }
  }
}

function isValidDistractor(
  candidate: number,
  digits: DigitLength,
  excluded: ReadonlySet<number>,
): boolean {
  if (!Number.isSafeInteger(candidate) || candidate <= 0) {
    return false
  }
  if (digitLength(candidate) !== digits) {
    return false
  }
  if (excluded.has(candidate)) {
    return false
  }
  return findCubePairs(candidate).length < 2
}

function sampleDistractor(
  digits: DigitLength,
  excluded: ReadonlySet<number>,
  random: RandomFn,
): number {
  const { min, max } = DIGIT_RANGES[digits]
  const span = max - min + 1

  for (let attempt = 0; attempt < MAX_RANDOM_ATTEMPTS; attempt += 1) {
    const candidate = min + Math.floor(random() * span)
    if (isValidDistractor(candidate, digits, excluded)) {
      return candidate
    }
  }

  const start = min + Math.floor(random() * span)
  for (let probe = 0; probe < MAX_FALLBACK_PROBES; probe += 1) {
    const candidate = min + ((start - min + probe) % span)
    if (isValidDistractor(candidate, digits, excluded)) {
      return candidate
    }
  }

  throw new Error(
    `Insufficient distractors for ${digits}-digit range after ${MAX_RANDOM_ATTEMPTS} random attempts and ${MAX_FALLBACK_PROBES} fallback probes`,
  )
}

function pickPuzzle(
  puzzles: readonly TaxicabPuzzle[],
  excludeTarget: number | undefined,
  random: RandomFn,
): TaxicabPuzzle {
  const eligible =
    excludeTarget === undefined
      ? puzzles
      : puzzles.filter((puzzle) => puzzle.target !== excludeTarget)

  const pool = eligible.length > 0 ? eligible : puzzles
  const index = Math.floor(random() * pool.length)
  const puzzle = pool[index]
  if (puzzle === undefined) {
    throw new Error('Failed to select a puzzle from the catalog')
  }
  return puzzle
}

/**
 * Builds a mixed-digit selection round: six distinct candidates with digit
 * multiset {4,4,5,5,6,6}, exactly one catalogue taxicab target, and five
 * engine-verified distractors. Randomness is injectable; generation is bounded.
 */
export function generateTaxicabRound(
  options: GenerateTaxicabRoundOptions = {},
): TaxicabRound {
  const random = options.random ?? Math.random
  const puzzles = options.puzzles ?? TAXICAB_PUZZLES

  validateRoundCatalog(puzzles)

  const puzzle = pickPuzzle(puzzles, options.excludeTarget, random)
  const targetDigits = assertSupportedDigitLength(puzzle.target, puzzle.id)

  const quotas: Record<DigitLength, number> = { 4: 2, 5: 2, 6: 2 }
  quotas[targetDigits] -= 1

  const excluded = new Set<number>([puzzle.target])
  const distractors: number[] = []

  for (const digits of [4, 5, 6] as const) {
    for (let count = 0; count < quotas[digits]; count += 1) {
      const distractor = sampleDistractor(digits, excluded, random)
      excluded.add(distractor)
      distractors.push(distractor)
    }
  }

  const candidates = shuffle([puzzle.target, ...distractors], random)

  return { puzzle, candidates }
}
