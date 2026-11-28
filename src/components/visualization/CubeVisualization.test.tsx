import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cube } from '../../domain/taxicab'
import { isWebGLAvailable } from './webglSupport'
import { CubeVisualization } from './CubeVisualization'

const pair = { a: 1, b: 12 } as const
const largePair = { a: 8, b: 53 } as const

vi.mock('./webglSupport', () => ({
  isWebGLAvailable: vi.fn(() => true),
}))

vi.mock('./CubePairVisualization', () => ({
  CubePairVisualization: ({
    exploring,
  }: {
    readonly exploring: boolean
  }) => (
    <div data-testid="mock-webgl-scene" data-exploring={String(exploring)}>
      Mock WebGL scene
    </div>
  ),
}))

describe('CubeVisualization', () => {
  beforeEach(() => {
    vi.mocked(isWebGLAvailable).mockReturnValue(true)
  })

  it('renders dimension and volume labels once from domain cube()', async () => {
    render(<CubeVisualization pair={pair} />)

    expect(await screen.findByText('1 × 1 × 1')).toBeInTheDocument()
    expect(screen.getByText('12 × 12 × 12')).toBeInTheDocument()
    expect(screen.getByText('1 unit³')).toBeInTheDocument()
    expect(
      screen.getByText(`${cube(12).toLocaleString('en-US')} units³`),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/A cube with an edge length of 12 contains/i),
    ).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /Static diagram/i })).toBeNull()
  })

  it('shows a simplified-grid disclaimer for catalogue-max edges', async () => {
    render(<CubeVisualization pair={largePair} />)

    expect(await screen.findByRole('note')).toHaveTextContent(
      /no longer marks every individual unit cube/i,
    )
    expect(screen.getByText('53 × 53 × 53')).toBeInTheDocument()
    expect(
      screen.getByText(
        `${cube(53).toLocaleString('en-US')} units³`,
      ),
    ).toBeInTheDocument()
  })

  it('toggles Explore mode for camera interaction', async () => {
    render(<CubeVisualization pair={pair} />)

    expect(await screen.findByTestId('mock-webgl-scene')).toHaveAttribute(
      'data-exploring',
      'false',
    )
    expect(
      screen.getByRole('button', { name: 'Reset camera' }),
    ).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Explore 3D' }))

    expect(
      screen.getByRole('button', { name: 'Done exploring' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('mock-webgl-scene')).toHaveAttribute(
      'data-exploring',
      'true',
    )
    expect(
      screen.getByRole('button', { name: 'Reset camera' }),
    ).toBeEnabled()
  })

  it('renders the static fallback when WebGL is unavailable without duplicating math labels', () => {
    vi.mocked(isWebGLAvailable).mockReturnValue(false)

    render(<CubeVisualization pair={pair} />)

    expect(
      screen.getByRole('img', {
        name: 'Static diagram of cubes with edges 1 and 12',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('1 × 1 × 1')).toBeInTheDocument()
    expect(screen.getByText('12 × 12 × 12')).toBeInTheDocument()
    expect(
      screen.getByText(/Interactive 3D view unavailable/i),
    ).toBeInTheDocument()
    expect(screen.queryByTestId('mock-webgl-scene')).toBeNull()
    expect(
      screen.queryByRole('button', { name: 'Explore 3D' }),
    ).toBeNull()
  })
})
