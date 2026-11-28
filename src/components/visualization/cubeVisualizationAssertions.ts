import { screen } from '@testing-library/react'
import { expect } from 'vitest'
import { cube, type CubePair } from '../../domain/taxicab'

function formatVolumeLabel(edge: number): string {
  const volume = cube(edge)
  const formatted = volume.toLocaleString('en-US')
  return volume === 1 ? `${formatted} unit³` : `${formatted} units³`
}

/** Asserts dimension, volume, and explanation copy for a revealed cube pair. */
export function expectCubeMathLabels(pair: CubePair): void {
  const { a, b } = pair

  expect(screen.getByText(`${a} × ${a} × ${a}`)).toBeInTheDocument()
  expect(screen.getByText(`${b} × ${b} × ${b}`)).toBeInTheDocument()
  expect(screen.getByText(formatVolumeLabel(a))).toBeInTheDocument()
  expect(screen.getByText(formatVolumeLabel(b))).toBeInTheDocument()
  expect(
    screen.getByText(
      new RegExp(`A cube with an edge length of ${b} contains`, 'i'),
    ),
  ).toBeInTheDocument()
}

interface ExpectStaticFallbackOptions {
  /** Defaults to `present` (WebGL-unavailable copy). Use `absent` for quiet demotion. */
  readonly availabilityMessage?: 'present' | 'absent'
}

/**
 * Asserts the static diagram is shown, WebGL controls are hidden, and math
 * labels remain (exactly once for the diagram role).
 */
export function expectStaticFallback(
  pair: CubePair,
  options: ExpectStaticFallbackOptions = {},
): void {
  const { availabilityMessage = 'present' } = options

  expect(
    screen.getByRole('img', {
      name: `Static diagram of cubes with edges ${pair.a} and ${pair.b}`,
    }),
  ).toBeInTheDocument()
  expectCubeMathLabels(pair)
  expect(screen.queryByTestId('mock-webgl-scene')).toBeNull()
  expect(screen.queryByRole('button', { name: 'Explore 3D' })).toBeNull()

  if (availabilityMessage === 'present') {
    expect(
      screen.getByText(/Interactive 3D view unavailable/i),
    ).toBeInTheDocument()
  } else {
    expect(
      screen.queryByText(/Interactive 3D view unavailable/i),
    ).toBeNull()
  }
}

/** Asserts exactly one static diagram is mounted (failure-path suites). */
export function expectSingleStaticDiagram(): void {
  expect(
    screen.getAllByRole('img', { name: /Static diagram of cubes/i }),
  ).toHaveLength(1)
}
