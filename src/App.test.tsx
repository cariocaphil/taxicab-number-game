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

  it('uses a neutral brand plate that does not spoil the target', () => {
    render(<App />)
    expect(screen.getByText('TAXI')).toBeInTheDocument()
    const brand = document.querySelector('.brand__plate')
    expect(brand).toHaveTextContent('TAXI')
    expect(brand).not.toHaveTextContent('1729')
  })

  it('renders the taxi selection game initially', () => {
    render(<App />)
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
      screen.getAllByRole('button', { name: /Taxi with license plate/ }),
    ).toHaveLength(6)
  })
})
