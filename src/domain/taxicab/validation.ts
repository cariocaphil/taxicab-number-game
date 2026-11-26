import { findCubePairs } from './math'
import type { CubePair, PuzzleValidationResult, TaxicabPuzzle } from './types'

function pairKey(pair: CubePair): string {
  return `${pair.a},${pair.b}`
}

function isPositiveSafeInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 1
}

/**
 * Validates puzzle structure and that representations match the engine
 * (`findCubePairs`) exactly. Does not re-implement cube arithmetic.
 *
 * Collects all structural errors first. Mathematical comparison runs only
 * when every structural check has passed.
 */
export function validatePuzzle(puzzle: TaxicabPuzzle): PuzzleValidationResult {
  const errors: string[] = []

  if (typeof puzzle.id !== 'string' || puzzle.id.trim() === '') {
    errors.push('id must be a non-empty string')
  }

  if (!Number.isSafeInteger(puzzle.target) || puzzle.target <= 0) {
    errors.push('target must be a positive safe integer')
  }

  if (!Array.isArray(puzzle.representations)) {
    errors.push('representations must be an array')
  } else {
    if (puzzle.representations.length < 2) {
      errors.push('puzzle must contain at least two distinct representations')
    }

    const seen = new Set<string>()
    for (const [index, pair] of puzzle.representations.entries()) {
      if (pair == null || typeof pair !== 'object') {
        errors.push(`representation[${index}] must be an object`)
        continue
      }

      if (!isPositiveSafeInteger(pair.a) || !isPositiveSafeInteger(pair.b)) {
        errors.push(
          `representation[${index}] must use positive safe integers for a and b`,
        )
        continue
      }

      if (pair.a > pair.b) {
        errors.push(
          `representation[${index}] must be normalized with a <= b (got ${pair.a}, ${pair.b})`,
        )
      }

      const key = pairKey(pair)
      if (seen.has(key)) {
        errors.push(`duplicate representation: (${pair.a}, ${pair.b})`)
      }
      seen.add(key)
    }
  }

  // Engine comparison only when all structural checks passed.
  if (errors.length === 0) {
    let expected: CubePair[]
    try {
      expected = findCubePairs(puzzle.target)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      errors.push(`unable to discover cube pairs for target: ${message}`)
      return { ok: false, errors }
    }

    const expectedKeys = new Set(expected.map(pairKey))
    const suppliedKeys = new Set(puzzle.representations.map(pairKey))

    for (const key of suppliedKeys) {
      if (!expectedKeys.has(key)) {
        errors.push(
          `representation (${key.replace(',', ', ')}) is not a valid cube pair for target ${puzzle.target}`,
        )
      }
    }

    for (const key of expectedKeys) {
      if (!suppliedKeys.has(key)) {
        errors.push(
          `missing representation (${key.replace(',', ', ')}) for target ${puzzle.target}`,
        )
      }
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  return { ok: true }
}
