import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  isWebGLAvailable,
  resetWebGLAvailabilityCache,
} from './webglSupport'

describe('isWebGLAvailable', () => {
  afterEach(() => {
    resetWebGLAvailabilityCache()
    vi.restoreAllMocks()
  })

  it('probes the browser once and reuses the cached result', () => {
    const getContext = vi.fn(() => ({}))
    vi.spyOn(document, 'createElement').mockImplementation(
      () =>
        ({
          getContext,
        }) as unknown as HTMLCanvasElement,
    )

    expect(isWebGLAvailable()).toBe(true)
    expect(isWebGLAvailable()).toBe(true)
    expect(document.createElement).toHaveBeenCalledTimes(1)
    expect(getContext).toHaveBeenCalled()
  })

  it('re-probes after the availability cache is reset', () => {
    const getContext = vi.fn<(...args: unknown[]) => object | null>(
      () => null,
    )
    vi.spyOn(document, 'createElement').mockImplementation(
      () =>
        ({
          getContext,
        }) as unknown as HTMLCanvasElement,
    )

    expect(isWebGLAvailable()).toBe(false)
    resetWebGLAvailabilityCache()
    getContext.mockReturnValue({})
    expect(isWebGLAvailable()).toBe(true)
    expect(document.createElement).toHaveBeenCalledTimes(2)
  })
})
