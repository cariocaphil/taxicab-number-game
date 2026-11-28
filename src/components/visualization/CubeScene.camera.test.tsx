import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cameraFramingForPair } from './cubeLayout'

const positionSet = vi.fn()
const lookAt = vi.fn()
const updateProjectionMatrix = vi.fn()
const invalidate = vi.fn()
const controlsTargetSet = vi.fn()
const controlsUpdate = vi.fn()

const camera = {
  position: { set: positionSet },
  lookAt,
  updateProjectionMatrix,
}

const gl = {
  domElement: { style: { touchAction: 'auto' } },
}

vi.mock('@react-three/fiber', () => ({
  useThree: () => ({
    camera,
    gl,
    invalidate,
  }),
}))

vi.mock('@react-three/drei', () => ({
  OrbitControls: ({
    ref,
  }: {
    readonly ref?:
      | ((instance: unknown) => void)
      | { current: unknown }
  }) => {
    const controls = {
      target: { set: controlsTargetSet },
      minDistance: 0,
      maxDistance: 0,
      enableDamping: false,
      update: controlsUpdate,
    }

    if (typeof ref === 'function') {
      ref(controls)
    } else if (ref && typeof ref === 'object') {
      ref.current = controls
    }

    return <div data-testid="orbit-controls" />
  },
}))

vi.mock('./UnitCubeBlock', () => ({
  UnitCubeBlock: () => null,
}))

describe('CubeScene camera framing stability', () => {
  beforeEach(() => {
    positionSet.mockClear()
    lookAt.mockClear()
    updateProjectionMatrix.mockClear()
    invalidate.mockClear()
    controlsTargetSet.mockClear()
    controlsUpdate.mockClear()
  })

  it('does not re-apply the initial camera pose on unrelated re-renders', async () => {
    const { CubeScene } = await import('./CubeScene')
    const framing = cameraFramingForPair(1, 12)

    const view = render(
      <CubeScene
        a={1}
        b={12}
        exploring={false}
        resetToken={0}
        reducedMotion={false}
      />,
    )

    expect(positionSet).toHaveBeenCalledTimes(1)
    expect(positionSet).toHaveBeenCalledWith(
      framing.position.x,
      framing.position.y,
      framing.position.z,
    )
    expect(lookAt).toHaveBeenCalledTimes(1)

    view.rerender(
      <CubeScene
        a={1}
        b={12}
        exploring={false}
        resetToken={0}
        reducedMotion={true}
      />,
    )

    expect(positionSet).toHaveBeenCalledTimes(1)
    expect(lookAt).toHaveBeenCalledTimes(1)
  })

  it('re-applies the camera pose when resetToken increments while exploring', async () => {
    const { CubeScene } = await import('./CubeScene')
    const framing = cameraFramingForPair(1, 12)

    const view = render(
      <CubeScene
        a={1}
        b={12}
        exploring={true}
        resetToken={0}
        reducedMotion={false}
      />,
    )

    // InitialCamera apply + ExploreControls setup (target only, not position via reset)
    const callsAfterMount = positionSet.mock.calls.length
    expect(callsAfterMount).toBeGreaterThanOrEqual(1)

    view.rerender(
      <CubeScene
        a={1}
        b={12}
        exploring={true}
        resetToken={1}
        reducedMotion={false}
      />,
    )

    expect(positionSet.mock.calls.length).toBeGreaterThan(callsAfterMount)
    expect(positionSet).toHaveBeenLastCalledWith(
      framing.position.x,
      framing.position.y,
      framing.position.z,
    )
  })

  it('re-applies the camera pose when resetToken increments without exploring', async () => {
    const { CubeScene } = await import('./CubeScene')
    const framing = cameraFramingForPair(1, 12)

    const view = render(
      <CubeScene
        a={1}
        b={12}
        exploring={false}
        resetToken={0}
        reducedMotion={false}
      />,
    )

    const callsAfterMount = positionSet.mock.calls.length
    expect(callsAfterMount).toBe(1)

    view.rerender(
      <CubeScene
        a={1}
        b={12}
        exploring={false}
        resetToken={1}
        reducedMotion={false}
      />,
    )

    expect(positionSet.mock.calls.length).toBe(callsAfterMount + 1)
    expect(positionSet).toHaveBeenLastCalledWith(
      framing.position.x,
      framing.position.y,
      framing.position.z,
    )
    expect(lookAt).toHaveBeenLastCalledWith(
      framing.target.x,
      framing.target.y,
      framing.target.z,
    )
  })

  it('re-applies the camera pose when cube dimensions change', async () => {
    const { CubeScene } = await import('./CubeScene')
    const framing = cameraFramingForPair(9, 10)

    const view = render(
      <CubeScene
        a={1}
        b={12}
        exploring={false}
        resetToken={0}
        reducedMotion={false}
      />,
    )

    expect(positionSet).toHaveBeenCalledTimes(1)

    view.rerender(
      <CubeScene
        a={9}
        b={10}
        exploring={false}
        resetToken={0}
        reducedMotion={false}
      />,
    )

    expect(positionSet).toHaveBeenCalledTimes(2)
    expect(positionSet).toHaveBeenLastCalledWith(
      framing.position.x,
      framing.position.y,
      framing.position.z,
    )
  })
})
