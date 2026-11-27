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

  it('features the number 1729', () => {
    render(<App />)
    expect(screen.getAllByText(/1729/).length).toBeGreaterThan(0)
  })

  it('renders the interactive game', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Discover the taxicab number',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reveal first representation' }),
    ).toBeInTheDocument()
  })
})
