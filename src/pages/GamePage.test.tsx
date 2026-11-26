import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getPuzzleById } from '../domain/taxicab'
import { GamePage } from './GamePage'

const puzzle = getPuzzleById('1729')

if (puzzle === undefined) {
  throw new Error('Expected catalogue puzzle with id "1729"')
}

function getEquationRegions() {
  return screen.getAllByRole('math')
}

function equationAccessibleName(index: number) {
  return getEquationRegions()[index]?.getAttribute('aria-label') ?? ''
}

describe('GamePage', () => {
  it('displays the target number and starts with all representations hidden', () => {
    render(<GamePage />)

    expect(
      screen.getByRole('img', { name: `Taxi license plate ${puzzle.target}` }),
    ).toBeInTheDocument()

    const equations = getEquationRegions()
    expect(equations).toHaveLength(puzzle.representations.length)

    for (let index = 0; index < equations.length; index += 1) {
      expect(equationAccessibleName(index)).toMatch(/unknown cubed/i)
      expect(equationAccessibleName(index)).not.toMatch(/\d+ cubed plus \d+/i)
    }

    expect(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    ).toBeEnabled()
    expect(
      screen.queryByText(/congratulations/i),
    ).not.toBeInTheDocument()
  })

  it('reveals representations progressively from domain data', () => {
    render(<GamePage />)
    const [first, second] = puzzle.representations

    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    )

    expect(equationAccessibleName(0)).toBe(
      `${first.a} cubed plus ${first.b} cubed equals ${puzzle.target}`,
    )
    expect(equationAccessibleName(1)).toMatch(/unknown cubed/i)
    expect(
      screen.getByRole('button', { name: 'Reveal next representation' }),
    ).toBeEnabled()
    expect(
      screen.queryByText(/congratulations/i),
    ).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal next representation' }),
    )

    expect(equationAccessibleName(0)).toBe(
      `${first.a} cubed plus ${first.b} cubed equals ${puzzle.target}`,
    )
    expect(equationAccessibleName(1)).toBe(
      `${second.a} cubed plus ${second.b} cubed equals ${puzzle.target}`,
    )
  })

  it('shows completion and disables further reveals', () => {
    render(<GamePage />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal next representation' }),
    )

    expect(
      document.querySelector('.game-completion'),
    ).toHaveTextContent(
      /Congratulations! You discovered why 1729 is the smallest positive integer/i,
    )

    const revealButton = screen.getByRole('button', {
      name: 'All representations revealed',
    })
    expect(revealButton).toBeDisabled()

    fireEvent.click(revealButton)
    expect(getEquationRegions()).toHaveLength(puzzle.representations.length)
    expect(revealButton).toBeDisabled()
  })

  it('restarts without reloading and hides answers again', () => {
    render(<GamePage />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal next representation' }),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Restart' }))

    for (let index = 0; index < puzzle.representations.length; index += 1) {
      expect(equationAccessibleName(index)).toMatch(/unknown cubed/i)
    }

    expect(
      screen.queryByText(/congratulations/i),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    ).toBeEnabled()
  })

  it('keeps a polite live region mounted before the first reveal', () => {
    const { container } = render(<GamePage />)
    const liveRegion = container.querySelector('[aria-live="polite"]')

    expect(liveRegion).not.toBeNull()
    expect(liveRegion).toBeInTheDocument()
    expect(within(liveRegion as HTMLElement).queryByText(/./)).toBeNull()
  })
})
