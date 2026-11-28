import { describe, expect, it } from 'vitest'
import { CATALOGUE_MAX_EDGE, gridDensityForEdge } from './cubeLayout'
import { buildSurfaceGridGeometry } from './surfaceGrid'

describe('buildSurfaceGridGeometry', () => {
  it('creates a disposable surface grid without interior voxels', () => {
    const geometry = buildSurfaceGridGeometry(3, 3)
    const position = geometry.getAttribute('position')

    expect(position).toBeDefined()
    expect(position.count).toBeGreaterThan(0)
    expect(position.count).toBeLessThan(3 ** 3 * 8)
    geometry.dispose()
  })

  it('keeps segment count bounded for the catalogue maximum edge', () => {
    const density = gridDensityForEdge(CATALOGUE_MAX_EDGE)
    const geometry = buildSurfaceGridGeometry(
      CATALOGUE_MAX_EDGE,
      density.segments,
    )
    const position = geometry.getAttribute('position')

    expect(density.isSimplified).toBe(true)
    expect(position.count).toBeGreaterThan(0)
    expect(position.count).toBeLessThan(50_000)
    geometry.dispose()
  })
})
