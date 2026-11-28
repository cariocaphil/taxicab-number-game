import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cube } from '../../domain/taxicab'
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
      expect(
        screen.getAllByRole('img', { name: /Static diagram of cubes/i }),
      ).toHaveLength(1)
    })

    expect(screen.getByText('1 × 1 × 1')).toBeInTheDocument()
    expect(screen.getByText('12 × 12 × 12')).toBeInTheDocument()
    expect(screen.getByText('1 unit³')).toBeInTheDocument()
    expect(
      screen.getByText(`${cube(12).toLocaleString('en-US')} units³`),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/A cube with an edge length of 12 contains/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Explore 3D' }),
    ).toBeNull()
  })
})
