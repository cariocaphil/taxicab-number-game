import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { getPuzzleById } from '../../domain/taxicab'
import { ProgressiveReveal } from './ProgressiveReveal'

vi.mock('../visualization/CubeVisualization', () => ({
  CubeVisualization: ({
    pair,
    enableWebGL = true,
  }: {
    readonly pair: { readonly a: number; readonly b: number }
    readonly enableWebGL?: boolean
  }) => (
    <div
      data-testid="cube-visualization"
      data-enable-webgl={String(enableWebGL)}
    >
      Visualization for {pair.a} and {pair.b}
    </div>
  ),
}))

const puzzle = getPuzzleById('1729')
const puzzle4104 = getPuzzleById('4104')

if (puzzle === undefined || puzzle4104 === undefined) {
  throw new Error('Expected catalogue puzzles')
}

function getEquationRegions() {
  return screen.getAllByRole('math')
}

function equationAccessibleName(index: number) {
  return getEquationRegions()[index]?.getAttribute('aria-label') ?? ''
}

describe('ProgressiveReveal', () => {
  it('displays the target number and starts with all representations hidden', () => {
    render(<ProgressiveReveal puzzle={puzzle} onNewRound={() => {}} />)

    expect(
      screen.getByRole('img', { name: `Taxi license plate ${puzzle.target}` }),
    ).toBeInTheDocument()

    const equations = getEquationRegions()
    expect(equations).toHaveLength(puzzle.representations.length)

    for (let index = 0; index < equations.length; index += 1) {
      expect(equationAccessibleName(index)).toMatch(/unknown cubed/i)
      expect(equationAccessibleName(index)).not.toMatch(/\d+ cubed plus \d+/i)
    }

    expect(screen.queryAllByTestId('cube-visualization')).toHaveLength(0)

    expect(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    ).toBeEnabled()
    expect(
      screen.queryByText(/congratulations/i),
    ).not.toBeInTheDocument()
  })

  it('reveals representations progressively from domain data', () => {
    render(<ProgressiveReveal puzzle={puzzle} onNewRound={() => {}} />)
    const [first, second] = puzzle.representations

    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    )

    expect(equationAccessibleName(0)).toBe(
      `${first.a} cubed plus ${first.b} cubed equals ${puzzle.target}`,
    )
    expect(equationAccessibleName(1)).toMatch(/unknown cubed/i)
    const firstViz = screen.getByTestId('cube-visualization')
    expect(firstViz).toHaveAttribute('data-enable-webgl', 'true')
    expect(
      screen.getByText(`Visualization for ${first.a} and ${first.b}`),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reveal next representation' }),
    ).toBeEnabled()

    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal next representation' }),
    )

    expect(equationAccessibleName(0)).toBe(
      `${first.a} cubed plus ${first.b} cubed equals ${puzzle.target}`,
    )
    expect(equationAccessibleName(1)).toBe(
      `${second.a} cubed plus ${second.b} cubed equals ${puzzle.target}`,
    )
    const visualizations = screen.getAllByTestId('cube-visualization')
    expect(visualizations).toHaveLength(2)
    expect(visualizations[0]).toHaveAttribute('data-enable-webgl', 'false')
    expect(visualizations[1]).toHaveAttribute('data-enable-webgl', 'true')
  })

  it('shows completion and disables further reveals', () => {
    render(<ProgressiveReveal puzzle={puzzle} onNewRound={() => {}} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal next representation' }),
    )

    expect(document.querySelector('.game-completion')).toHaveTextContent(
      /Congratulations! You discovered why 1729 is the smallest positive integer/i,
    )

    const revealButton = screen.getByRole('button', {
      name: 'All representations revealed',
    })
    expect(revealButton).toBeDisabled()
  })

  it('uses a generic completion message for non-1729 puzzles', () => {
    render(<ProgressiveReveal puzzle={puzzle4104} onNewRound={() => {}} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal next representation' }),
    )

    expect(document.querySelector('.game-completion')).toHaveTextContent(
      /4104 can be expressed as the sum of two positive cubes/i,
    )
    expect(
      screen.getByRole('img', {
        name: `Taxi license plate ${puzzle4104.target}`,
      }),
    ).toBeInTheDocument()
  })

  it('restarts without reloading and hides answers again', () => {
    render(<ProgressiveReveal puzzle={puzzle} onNewRound={() => {}} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal next representation' }),
    )
    expect(screen.getAllByTestId('cube-visualization')).toHaveLength(2)

    fireEvent.click(screen.getByRole('button', { name: 'Restart' }))

    for (let index = 0; index < puzzle.representations.length; index += 1) {
      expect(equationAccessibleName(index)).toMatch(/unknown cubed/i)
    }

    expect(screen.queryAllByTestId('cube-visualization')).toHaveLength(0)
    expect(
      screen.queryByText(/congratulations/i),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    ).toBeEnabled()
  })

  it('shows visualizations for non-1729 puzzle representations', () => {
    render(<ProgressiveReveal puzzle={puzzle4104} onNewRound={() => {}} />)
    const [first] = puzzle4104.representations

    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    )

    expect(
      screen.getByText(`Visualization for ${first.a} and ${first.b}`),
    ).toBeInTheDocument()
  })

  it('keeps a polite live region mounted before the first reveal', () => {
    const { container } = render(
      <ProgressiveReveal puzzle={puzzle} onNewRound={() => {}} />,
    )
    const liveRegion = container.querySelector('[aria-live="polite"]')

    expect(liveRegion).not.toBeNull()
    expect(within(liveRegion as HTMLElement).queryByText(/./)).toBeNull()
  })

  it('invokes onNewRound when New round is clicked after completion', () => {
    const onNewRound = vi.fn()
    render(<ProgressiveReveal puzzle={puzzle} onNewRound={onNewRound} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal next representation' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'New round' }))

    expect(onNewRound).toHaveBeenCalledTimes(1)
  })
})
