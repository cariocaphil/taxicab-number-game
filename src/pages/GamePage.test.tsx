import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  generateTaxicabRound,
  getPuzzleById,
  type TaxicabRound,
} from '../domain/taxicab'
import { GamePage } from './GamePage'

function requirePuzzle(id: string) {
  const puzzle = getPuzzleById(id)
  if (puzzle === undefined) {
    throw new Error(`Expected catalogue puzzle ${id}`)
  }
  return puzzle
}

const puzzle4104 = requirePuzzle('4104')

function fixedRound(overrides?: Partial<TaxicabRound>): TaxicabRound {
  return {
    puzzle: puzzle4104,
    candidates: [4104, 1234, 5678, 12345, 67890, 123456],
    ...overrides,
  }
}

describe('GamePage', () => {
  it('displays the selection phase initially and hides progressive reveal', () => {
    render(
      <GamePage
        sessionOptions={{
          generateRound: () => fixedRound(),
        }}
      />,
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Spot the Taxicab Number!',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Reveal first representation' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Taxi with license plate 4104',
      }),
    ).toBeInTheDocument()
  })

  it('provides feedback for incorrect selections and prevents repeats', () => {
    render(
      <GamePage
        sessionOptions={{
          generateRound: () => fixedRound(),
        }}
      />,
    )

    const wrong = screen.getByRole('button', {
      name: 'Taxi with license plate 1234',
    })
    fireEvent.click(wrong)

    expect(screen.getByText(/Not quite\. Try another taxi!/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Taxi with license plate 1234, Incorrect',
      }),
    ).toBeDisabled()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Taxi with license plate 1234, Incorrect',
      }),
    )
    expect(screen.getByText(/Not quite\. Try another taxi!/i)).toBeInTheDocument()
  })

  it('locks all taxis after a correct selection and unlocks reveal via Continue', () => {
    render(
      <GamePage
        sessionOptions={{
          generateRound: () => fixedRound(),
        }}
      />,
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Taxi with license plate 4104',
      }),
    )

    expect(
      screen.getByText(/Well spotted! Continue to uncover/i),
    ).toBeInTheDocument()

    for (const candidate of [4104, 1234, 5678, 12345, 67890, 123456]) {
      const buttons = screen.getAllByRole('button').filter((button) =>
        (button.getAttribute('aria-label') ?? '').includes(
          `license plate ${candidate}`,
        ),
      )
      expect(buttons.length).toBeGreaterThan(0)
      for (const button of buttons) {
        expect(button).toBeDisabled()
      }
    }

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Discover the representations',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Taxi license plate 4104' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    ).toBeEnabled()
  })

  it('runs progressive reveal for the selected non-1729 puzzle', () => {
    const [first, second] = puzzle4104.representations
    render(
      <GamePage
        sessionOptions={{
          generateRound: () => fixedRound(),
        }}
      />,
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Taxi with license plate 4104',
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal next representation' }),
    )

    expect(document.querySelector('.game-completion')).toHaveTextContent(
      /4104 can be expressed as the sum of two positive cubes/i,
    )
    expect(screen.getByRole('math', {
      name: `${first.a} cubed plus ${first.b} cubed equals 4104`,
    })).toBeInTheDocument()
    expect(screen.getByRole('math', {
      name: `${second.a} cubed plus ${second.b} cubed equals 4104`,
    })).toBeInTheDocument()
  })

  it('starts a new round that resets selection and reveal state', () => {
    let calls = 0
    const first = fixedRound()
    const secondPuzzle = requirePuzzle('1729')
    const second: TaxicabRound = {
      puzzle: secondPuzzle,
      candidates: [1729, 2000, 3000, 20000, 30000, 200000],
    }

    render(
      <GamePage
        sessionOptions={{
          generateRound: () => {
            calls += 1
            return calls === 1 ? first : second
          },
        }}
      />,
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Taxi with license plate 4104',
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Reveal next representation' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'New round' }))

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Spot the Taxicab Number!',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Taxi with license plate 1729',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Reveal first representation' }),
    ).not.toBeInTheDocument()
    expect(calls).toBe(2)
  })

  it('can generate a live mixed-digit round through the domain helper', () => {
    const round = generateTaxicabRound({ random: () => 0.42 })
    expect(round.candidates).toHaveLength(6)
    render(
      <GamePage
        sessionOptions={{
          generateRound: () => round,
        }}
      />,
    )
    expect(
      screen.getByRole('button', {
        name: `Taxi with license plate ${round.puzzle.target}`,
      }),
    ).toBeInTheDocument()
  })
})
