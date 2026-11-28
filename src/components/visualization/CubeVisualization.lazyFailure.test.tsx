import { render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import {
  expectSingleStaticDiagram,
  expectStaticFallback,
} from './cubeVisualizationAssertions'
import { isWebGLAvailable } from './webglSupport'

const pair = { a: 1, b: 12 } as const

vi.mock('./webglSupport', () => ({
  isWebGLAvailable: vi.fn(() => true),
}))

// Accessing the export fails after the dynamic import resolves, which rejects
// the React.lazy() factory the same way a chunk-load failure would.
vi.mock('./CubePairVisualization', () => ({
  get CubePairVisualization() {
    throw new Error('Failed to load CubePairVisualization chunk')
  },
}))

describe('CubeVisualization lazy-load failure fallback', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.mocked(isWebGLAvailable).mockReturnValue(true)
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('shows a single fallback and keeps math labels when lazy loading fails', async () => {
    const { CubeVisualization } = await import('./CubeVisualization')

    render(<CubeVisualization pair={pair} />)

    await waitFor(() => {
      expectSingleStaticDiagram()
    })

    expectStaticFallback(pair)
  })
})
