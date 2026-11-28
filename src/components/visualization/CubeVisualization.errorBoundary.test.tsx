import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cube } from '../../domain/taxicab'
import { isWebGLAvailable } from './webglSupport'
import { CubeVisualization } from './CubeVisualization'

const pair = { a: 1, b: 12 } as const

vi.mock('./webglSupport', () => ({
  isWebGLAvailable: vi.fn(() => true),
}))

vi.mock('./CubePairVisualization', () => ({
  CubePairVisualization: () => {
    throw new Error('Forced WebGL scene render failure')
  },
}))

describe('CubeVisualization error boundary fallback', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.mocked(isWebGLAvailable).mockReturnValue(true)
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('shows the static fallback immediately when the 3D scene throws', async () => {
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

  it('does not render fallback content twice after the parent switches sceneMode', async () => {
    render(<CubeVisualization pair={pair} />)

    await waitFor(() => {
      expect(
        screen.getAllByRole('img', { name: /Static diagram of cubes/i }),
      ).toHaveLength(1)
    })

    // Allow switchToFallback state update to settle; still a single fallback.
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: 'Explore 3D' }),
      ).toBeNull()
      expect(
        screen.getAllByRole('img', { name: /Static diagram of cubes/i }),
      ).toHaveLength(1)
    })
  })
})
