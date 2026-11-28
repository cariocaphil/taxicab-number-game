import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { CubePairVisualization } from './CubePairVisualization'

const pair = { a: 1, b: 12 } as const

vi.mock('./CubeScene', () => ({
  CubeScene: () => null,
}))

vi.mock('@react-three/fiber', () => ({
  Canvas: ({
    children,
    onCreated,
  }: {
    readonly children?: ReactNode
    readonly onCreated?: (state: {
      gl: {
        domElement: HTMLCanvasElement
        setClearColor: (color: number, alpha: number) => void
      }
    }) => void
  }) => {
    const canvasRef = (element: HTMLCanvasElement | null) => {
      if (element === null || onCreated === undefined) {
        return
      }
      onCreated({
        gl: {
          domElement: element,
          setClearColor: () => {
            throw new Error('Forced WebGL renderer initialization failure')
          },
        },
      })
    }

    return (
      <div data-testid="mock-r3f-canvas">
        <canvas ref={canvasRef} />
        {children}
      </div>
    )
  },
}))

describe('CubePairVisualization initialization failure', () => {
  it('invokes onInitError when renderer setup throws', () => {
    const onInitError = vi.fn()

    expect(() => {
      render(
        <CubePairVisualization
          pair={pair}
          exploring={false}
          resetToken={0}
          reducedMotion={false}
          onContextLost={vi.fn()}
          onInitError={onInitError}
        />,
      )
    }).not.toThrow()

    expect(onInitError).toHaveBeenCalledTimes(1)
  })
})
