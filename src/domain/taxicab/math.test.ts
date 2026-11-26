/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { cube, findCubePairs, sumOfCubes } from './math'

describe('cube', () => {
  it('returns 27 for cube(3)', () => {
    expect(cube(3)).toBe(27)
  })

  it('returns a safe integer when n³ still fits Number.MAX_SAFE_INTEGER', () => {
    // 208063³ is the largest cube that remains a safe integer; asserted via BigInt, not a production cutoff.
    const n = 208063
    const result = cube(n)
    expect(Number.isSafeInteger(result)).toBe(true)
    expect(result).toBe(Number(BigInt(n) * BigInt(n) * BigInt(n)))
  })

  it('throws when the computed cube exceeds Number.MAX_SAFE_INTEGER', () => {
    expect(() => cube(208064)).toThrow(/exceeds Number\.MAX_SAFE_INTEGER/)
  })

  it('rejects non-integer and unsafe inputs', () => {
    expect(() => cube(1.5)).toThrow()
    expect(() => cube(Number.MAX_SAFE_INTEGER + 1)).toThrow()
    expect(() => cube(Number.NaN)).toThrow()
  })
})

describe('sumOfCubes', () => {
  it('returns 1729 for (1, 12) and (9, 10)', () => {
    expect(sumOfCubes(1, 12)).toBe(1729)
    expect(sumOfCubes(9, 10)).toBe(1729)
  })

  it('rejects non-integer inputs', () => {
    expect(() => sumOfCubes(1.2, 3)).toThrow()
  })
})

describe('findCubePairs', () => {
  it('returns exactly two distinct representations for 1729', () => {
    expect(findCubePairs(1729)).toEqual([
      { a: 1, b: 12 },
      { a: 9, b: 10 },
    ])
  })

  it('returns exactly two distinct representations for 4104', () => {
    expect(findCubePairs(4104)).toEqual([
      { a: 2, b: 16 },
      { a: 9, b: 15 },
    ])
  })

  it('returns no representations for 100', () => {
    expect(findCubePairs(100)).toEqual([])
  })

  it('handles equal cube values (2³ + 2³ = 16)', () => {
    expect(findCubePairs(16)).toEqual([{ a: 2, b: 2 }])
  })

  it('rejects invalid and unsafe targets', () => {
    expect(() => findCubePairs(0)).toThrow()
    expect(() => findCubePairs(-1)).toThrow()
    expect(() => findCubePairs(1.5)).toThrow()
    expect(() => findCubePairs(Number.MAX_SAFE_INTEGER + 1)).toThrow()
  })
})
