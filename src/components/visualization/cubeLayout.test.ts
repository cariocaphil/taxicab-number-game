import { describe, expect, it } from 'vitest'
import { CATALOGUE_MAX_EDGE } from '../../domain/taxicab'
import {
  FULL_UNIT_GRID_MAX_EDGE,
  MAX_SIMPLIFIED_GRID_SEGMENTS,
  cameraFramingForPair,
  gridDensityForEdge,
  layoutCubePair,
  pairUsesSimplifiedGrid,
} from './cubeLayout'

describe('gridDensityForEdge', () => {
  it('uses a true unit grid for small edges', () => {
    expect(gridDensityForEdge(1)).toEqual({
      segments: 1,
      isSimplified: false,
    })
    expect(gridDensityForEdge(12)).toEqual({
      segments: 12,
      isSimplified: false,
    })
    expect(gridDensityForEdge(FULL_UNIT_GRID_MAX_EDGE)).toEqual({
      segments: FULL_UNIT_GRID_MAX_EDGE,
      isSimplified: false,
    })
  })

  it('simplifies the surface grid for large edges including catalogue max', () => {
    expect(CATALOGUE_MAX_EDGE).toBeGreaterThan(FULL_UNIT_GRID_MAX_EDGE)

    const density = gridDensityForEdge(CATALOGUE_MAX_EDGE)
    expect(density.isSimplified).toBe(true)
    expect(density.segments).toBe(MAX_SIMPLIFIED_GRID_SEGMENTS)
    expect(density.segments).toBeLessThan(CATALOGUE_MAX_EDGE)
  })

  it('rejects non-positive edges', () => {
    expect(() => gridDensityForEdge(0)).toThrow(/positive integer/)
    expect(() => gridDensityForEdge(1.5)).toThrow(/positive integer/)
  })
})

describe('pairUsesSimplifiedGrid', () => {
  it('is false for the classic 1 and 12 pair', () => {
    expect(pairUsesSimplifiedGrid(1, 12)).toBe(false)
  })

  it('is true when either edge exceeds the full-grid threshold', () => {
    expect(pairUsesSimplifiedGrid(8, CATALOGUE_MAX_EDGE)).toBe(true)
    expect(pairUsesSimplifiedGrid(CATALOGUE_MAX_EDGE, CATALOGUE_MAX_EDGE)).toBe(
      true,
    )
  })
})

describe('layoutCubePair', () => {
  it('places cubes without overlap and preserves relative proportions', () => {
    const layout = layoutCubePair(1, 12)

    expect(layout.left.edge).toBe(1)
    expect(layout.right.edge).toBe(12)
    expect(layout.left.position.y).toBe(0.5)
    expect(layout.right.position.y).toBe(6)

    const leftRightFace = layout.left.position.x + layout.left.edge / 2
    const rightLeftFace = layout.right.position.x - layout.right.edge / 2
    expect(rightLeftFace - leftRightFace).toBeCloseTo(layout.gap)
    expect(layout.gap).toBeGreaterThan(0)
  })

  it('frames the catalogue maximum edge length without overlap', () => {
    const layout = layoutCubePair(8, CATALOGUE_MAX_EDGE)
    const leftRightFace = layout.left.position.x + layout.left.edge / 2
    const rightLeftFace = layout.right.position.x - layout.right.edge / 2

    expect(rightLeftFace).toBeGreaterThan(leftRightFace)
    expect(layout.span).toBeGreaterThanOrEqual(CATALOGUE_MAX_EDGE)
    expect(layout.boundsMax.y).toBe(CATALOGUE_MAX_EDGE)
  })
})

describe('cameraFramingForPair', () => {
  it('returns an isometric-style camera that looks at the pair center', () => {
    const layout = layoutCubePair(1, 12)
    const framing = cameraFramingForPair(1, 12)

    expect(framing.target.x).toBeCloseTo(layout.center.x)
    expect(framing.target.y).toBeCloseTo(layout.center.y)
    expect(framing.target.z).toBeCloseTo(layout.center.z)
    expect(framing.position.y).toBeGreaterThan(framing.target.y)
    expect(framing.position.z).toBeGreaterThan(framing.target.z)
    expect(framing.minDistance).toBeLessThan(framing.maxDistance)
  })

  it('scales camera distance for the catalogue maximum edge', () => {
    const small = cameraFramingForPair(1, 12)
    const large = cameraFramingForPair(8, CATALOGUE_MAX_EDGE)

    const smallDistance = Math.hypot(
      small.position.x - small.target.x,
      small.position.y - small.target.y,
      small.position.z - small.target.z,
    )
    const largeDistance = Math.hypot(
      large.position.x - large.target.x,
      large.position.y - large.target.y,
      large.position.z - large.target.z,
    )

    expect(largeDistance).toBeGreaterThan(smallDistance)
    expect(large.maxDistance).toBeGreaterThan(large.minDistance)
  })
})
