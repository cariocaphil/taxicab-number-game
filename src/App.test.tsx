import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the application title', () => {
    render(<App />)
    expect(
      screen.getByText('The Taxicab Number Game'),
    ).toBeInTheDocument()
  })

  it('renders the hero heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Every number has a story.',
      }),
    ).toBeInTheDocument()
  })

  it('features the number 1729', () => {
    render(<App />)
    expect(screen.getAllByText(/1729/).length).toBeGreaterThan(0)
  })

  it('displays the Hardy–Ramanujan cube relationship', () => {
    render(<App />)
    expect(
      screen.getByText(/sum of two positive integer cubes in two distinct ways/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('math', {
        name: /1729 equals 1 cubed plus 12 cubed/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders the game preview section', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Discover the hidden numbers',
      }),
    ).toBeInTheDocument()
  })

  it('shows coming-soon messaging', () => {
    render(<App />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
