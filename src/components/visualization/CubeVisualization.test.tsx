import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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
    resetToken,
    reducedMotion,
    onContextLost,
    onInitError,
  }: {
    readonly exploring: boolean
    readonly resetToken: number
    readonly reducedMotion: boolean
    readonly onContextLost: () => void
    readonly onInitError: () => void
  }) => (
    <div
      data-testid="mock-webgl-scene"
      data-exploring={String(exploring)}
      data-reset-token={String(resetToken)}
      data-reduced-motion={String(reducedMotion)}
    >
      Mock WebGL scene
      <button type="button" onClick={onContextLost}>
        Simulate context loss
      </button>
      <button type="button" onClick={onInitError}>
        Simulate init error
      </button>
    </div>
  ),
}))

describe('CubeVisualization', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    vi.mocked(isWebGLAvailable).mockReturnValue(true)
    window.matchMedia = originalMatchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
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
    ).toBeEnabled()

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

    fireEvent.click(screen.getByRole('button', { name: 'Done exploring' }))

    expect(screen.getByTestId('mock-webgl-scene')).toHaveAttribute(
      'data-exploring',
      'false',
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

  it('keeps mathematical labels visible after a WebGL context-loss fallback', async () => {
    render(<CubeVisualization pair={pair} />)

    expect(await screen.findByTestId('mock-webgl-scene')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Simulate context loss' }),
    )

    expect(
      screen.getByRole('img', {
        name: 'Static diagram of cubes with edges 1 and 12',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('1 × 1 × 1')).toBeInTheDocument()
    expect(screen.getByText('12 × 12 × 12')).toBeInTheDocument()
    expect(screen.getByText('1 unit³')).toBeInTheDocument()
    expect(
      screen.getByText(`${cube(12).toLocaleString('en-US')} units³`),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/A cube with an edge length of 12 contains/i),
    ).toBeInTheDocument()
    expect(screen.queryByTestId('mock-webgl-scene')).toBeNull()
    expect(
      screen.queryByRole('button', { name: 'Explore 3D' }),
    ).toBeNull()
  })

  it('switches to the static fallback when WebGL initialization fails', async () => {
    render(<CubeVisualization pair={pair} />)

    expect(await screen.findByTestId('mock-webgl-scene')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Simulate init error' }),
    )

    expect(
      screen.getByRole('img', {
        name: 'Static diagram of cubes with edges 1 and 12',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('1 × 1 × 1')).toBeInTheDocument()
    expect(screen.getByText('12 × 12 × 12')).toBeInTheDocument()
    expect(screen.getByText('1 unit³')).toBeInTheDocument()
    expect(
      screen.getByText(`${cube(12).toLocaleString('en-US')} units³`),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/A cube with an edge length of 12 contains/i),
    ).toBeInTheDocument()
    expect(screen.queryByTestId('mock-webgl-scene')).toBeNull()
    expect(
      screen.queryByRole('button', { name: 'Explore 3D' }),
    ).toBeNull()
  })

  it('increments resetToken when Reset camera is clicked without exploring', async () => {
    render(<CubeVisualization pair={pair} />)

    const scene = await screen.findByTestId('mock-webgl-scene')
    expect(scene).toHaveAttribute('data-reset-token', '0')
    expect(scene).toHaveAttribute('data-exploring', 'false')

    fireEvent.click(screen.getByRole('button', { name: 'Reset camera' }))

    expect(screen.getByTestId('mock-webgl-scene')).toHaveAttribute(
      'data-reset-token',
      '1',
    )
    expect(screen.getByTestId('mock-webgl-scene')).toHaveAttribute(
      'data-exploring',
      'false',
    )
  })

  it('increments resetToken when Reset camera is clicked while exploring', async () => {
    render(<CubeVisualization pair={pair} />)

    expect(await screen.findByTestId('mock-webgl-scene')).toHaveAttribute(
      'data-reset-token',
      '0',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Explore 3D' }))
    expect(screen.getByTestId('mock-webgl-scene')).toHaveAttribute(
      'data-exploring',
      'true',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Reset camera' }))

    expect(screen.getByTestId('mock-webgl-scene')).toHaveAttribute(
      'data-reset-token',
      '1',
    )
    expect(screen.getByTestId('mock-webgl-scene')).toHaveAttribute(
      'data-exploring',
      'true',
    )
  })

  it('passes reducedMotion when prefers-reduced-motion is requested', async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    render(<CubeVisualization pair={pair} />)

    expect(await screen.findByTestId('mock-webgl-scene')).toHaveAttribute(
      'data-reduced-motion',
      'true',
    )
  })
})
