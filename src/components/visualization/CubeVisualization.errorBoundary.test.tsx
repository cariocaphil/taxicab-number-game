import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  expectSingleStaticDiagram,
  expectStaticFallback,
} from './cubeVisualizationAssertions'
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

  it('shows a single parent-owned fallback when the 3D scene throws', async () => {
    render(<CubeVisualization pair={pair} />)

    await waitFor(() => {
      expectSingleStaticDiagram()
    })

    expect(screen.getByTestId('cube-visualization')).toHaveAttribute(
      'data-webgl',
      'false',
    )
    expectStaticFallback(pair)
  })
})
