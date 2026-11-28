import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
          setClearColor: vi.fn(),
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

describe('CubePairVisualization context-loss listener', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('registers webglcontextlost on the renderer canvas when created', () => {
    const onContextLost = vi.fn()
    const addSpy = vi.spyOn(HTMLCanvasElement.prototype, 'addEventListener')

    const { container } = render(
      <CubePairVisualization
        pair={pair}
        exploring={false}
        resetToken={0}
        reducedMotion={false}
        onContextLost={onContextLost}
        onInitError={vi.fn()}
      />,
    )

    expect(container.querySelector('canvas')).not.toBeNull()
    expect(addSpy).toHaveBeenCalledWith(
      'webglcontextlost',
      expect.any(Function),
    )
  })

  it('invokes onContextLost when the canvas fires webglcontextlost', () => {
    const onContextLost = vi.fn()

    const { container } = render(
      <CubePairVisualization
        pair={pair}
        exploring={false}
        resetToken={0}
        reducedMotion={false}
        onContextLost={onContextLost}
        onInitError={vi.fn()}
      />,
    )

    const canvas = container.querySelector('canvas')
    expect(canvas).not.toBeNull()

    const event = new Event('webglcontextlost', {
      bubbles: true,
      cancelable: true,
    })
    canvas!.dispatchEvent(event)

    expect(onContextLost).toHaveBeenCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
  })

  it('removes the webglcontextlost listener on unmount', () => {
    const removeSpy = vi.spyOn(
      HTMLCanvasElement.prototype,
      'removeEventListener',
    )

    const { unmount } = render(
      <CubePairVisualization
        pair={pair}
        exploring={false}
        resetToken={0}
        reducedMotion={false}
        onContextLost={vi.fn()}
        onInitError={vi.fn()}
      />,
    )

    unmount()

    expect(removeSpy).toHaveBeenCalledWith(
      'webglcontextlost',
      expect.any(Function),
    )
  })
})
