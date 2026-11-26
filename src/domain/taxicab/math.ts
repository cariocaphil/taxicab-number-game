/**
 * Pure cube-sum mathematics for educational taxicab puzzles.
 *
 * Public API uses `number`. All correctness-critical arithmetic uses `BigInt`.
 * `Math.cbrt` is used only to estimate integer cube roots; candidates are always
 * verified with exact BigInt multiplication.
 *
 * Contracts:
 * - Inputs must be safe integers where specified; invalid inputs throw.
 * - `cube` / `sumOfCubes` throw when the *result* is not a safe integer
 *   (a safe input does not guarantee a safe cube). Safety is decided from the
 *   computed BigInt value, not a hardcoded input threshold.
 * - `findCubePairs` accepts any positive safe-integer target. The search bound
 *   is ⌊∛target⌋ (at most ≈ 208064 for Number.MAX_SAFE_INTEGER).
 */

import type { CubePair } from './types'

const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER)

function assertSafeInteger(value: number, label: string): void {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${label} must be a number`)
  }
  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be an integer`)
  }
  if (!Number.isSafeInteger(value)) {
    throw new Error(`${label} must be a safe integer`)
  }
}

function bigIntCube(n: bigint): bigint {
  return n * n * n
}

function toSafeNumber(value: bigint, label: string): number {
  if (value > MAX_SAFE || value < -MAX_SAFE) {
    throw new Error(`${label} exceeds Number.MAX_SAFE_INTEGER`)
  }
  return Number(value)
}

/**
 * Returns n³ as a safe integer number.
 * Throws if n is not a safe integer, or if n³ is not a safe integer.
 */
export function cube(n: number): number {
  assertSafeInteger(n, 'n')
  return toSafeNumber(bigIntCube(BigInt(n)), 'n³')
}

/**
 * Returns a³ + b³ as a safe integer number.
 * Throws if inputs are not safe integers, or if the sum is not a safe integer.
 */
export function sumOfCubes(a: number, b: number): number {
  assertSafeInteger(a, 'a')
  assertSafeInteger(b, 'b')
  const sum = bigIntCube(BigInt(a)) + bigIntCube(BigInt(b))
  return toSafeNumber(sum, 'a³ + b³')
}

/**
 * Estimate an integer cube root of a non-negative BigInt.
 * Uses Math.cbrt only for estimation when the value fits in a Number;
 * otherwise uses an integer binary search. Always verify with BigInt cubes.
 */
function estimateIntegerCbrt(n: bigint): bigint {
  if (n <= 0n) {
    return 0n
  }

  if (n <= MAX_SAFE) {
    const estimate = Math.round(Math.cbrt(Number(n)))
    return BigInt(estimate)
  }

  // Binary search for floor(cbrt(n)) when n may exceed Number range.
  let low = 1n
  let high = 1n
  while (bigIntCube(high) <= n) {
    high <<= 1n
  }
  while (low < high) {
    const mid = (low + high + 1n) / 2n
    if (bigIntCube(mid) <= n) {
      low = mid
    } else {
      high = mid - 1n
    }
  }
  return low
}

function adjustMaxA(estimate: bigint, target: bigint): bigint {
  let maxA = estimate
  while (maxA > 0n && bigIntCube(maxA) > target) {
    maxA -= 1n
  }
  while (bigIntCube(maxA + 1n) <= target) {
    maxA += 1n
  }
  return maxA
}

/**
 * Finds all distinct pairs of positive integers (a, b) with a <= b and
 * a³ + b³ === target. Returns pairs in ascending order of a.
 */
export function findCubePairs(target: number): CubePair[] {
  assertSafeInteger(target, 'target')
  if (target <= 0) {
    throw new Error('target must be a positive safe integer')
  }

  const targetBig = BigInt(target)
  const maxAEstimate = estimateIntegerCbrt(targetBig)
  const maxA = adjustMaxA(maxAEstimate, targetBig)

  const pairs: CubePair[] = []

  for (let a = 1n; a <= maxA; a += 1n) {
    const remainder = targetBig - bigIntCube(a)
    if (remainder <= 0n) {
      continue
    }

    const bEstimate = estimateIntegerCbrt(remainder)
    // Check nearby candidates in case float/binary estimate is off by one.
    for (let delta = -1n; delta <= 1n; delta += 1n) {
      const b = bEstimate + delta
      if (b < a) {
        continue
      }
      if (bigIntCube(b) === remainder) {
        pairs.push({
          a: toSafeNumber(a, 'a'),
          b: toSafeNumber(b, 'b'),
        })
        break
      }
    }
  }

  return pairs
}
