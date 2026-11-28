import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ComponentRef,
} from 'react'
import {
  cameraFramingForPair,
  layoutCubePair,
  type CameraFraming,
} from './cubeLayout'
import { UnitCubeBlock } from './UnitCubeBlock'

type OrbitControlsHandle = ComponentRef<typeof OrbitControls>

interface CubeSceneProps {
  readonly a: number
  readonly b: number
  readonly exploring: boolean
  readonly resetToken: number
  readonly reducedMotion: boolean
}

function InitialCamera({
  framing,
}: {
  readonly framing: CameraFraming
}) {
  const { camera, invalidate } = useThree()

  useLayoutEffect(() => {
    camera.position.set(
      framing.position.x,
      framing.position.y,
      framing.position.z,
    )
    camera.lookAt(framing.target.x, framing.target.y, framing.target.z)
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, framing, invalidate])

  return null
}

/**
 * Always mounted so Reset camera works after "Done exploring"
 * (when OrbitControls / ExploreControls are unmounted).
 */
function CameraReset({
  framing,
  resetToken,
}: {
  readonly framing: CameraFraming
  readonly resetToken: number
}) {
  const { camera, invalidate } = useThree()

  useEffect(() => {
    if (resetToken === 0) {
      return
    }

    camera.position.set(
      framing.position.x,
      framing.position.y,
      framing.position.z,
    )
    camera.lookAt(framing.target.x, framing.target.y, framing.target.z)
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, framing, invalidate, resetToken])

  return null
}

function ExploreControls({
  framing,
  resetToken,
  reducedMotion,
}: {
  readonly framing: CameraFraming
  readonly resetToken: number
  readonly reducedMotion: boolean
}) {
  const controlsRef = useRef<OrbitControlsHandle | null>(null)
  const { gl, invalidate } = useThree()

  useLayoutEffect(() => {
    const controls = controlsRef.current
    if (controls === null) {
      return
    }

    controls.target.set(framing.target.x, framing.target.y, framing.target.z)
    controls.minDistance = framing.minDistance
    controls.maxDistance = framing.maxDistance
    controls.enableDamping = !reducedMotion
    controls.update()
    invalidate()
  }, [framing, invalidate, reducedMotion])

  useEffect(() => {
    if (resetToken === 0) {
      return
    }

    const controls = controlsRef.current
    if (controls === null) {
      return
    }

    // Camera pose is restored by CameraReset; sync OrbitControls target here.
    controls.target.set(framing.target.x, framing.target.y, framing.target.z)
    controls.update()
    invalidate()
  }, [framing, invalidate, resetToken])

  useEffect(() => {
    return () => {
      // Restore page scrolling when leaving Explore mode (OrbitControls sets none on connect).
      gl.domElement.style.touchAction = 'auto'
    }
  }, [gl])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      autoRotate={false}
      onChange={() => {
        invalidate()
      }}
    />
  )
}

export function CubeScene({
  a,
  b,
  exploring,
  resetToken,
  reducedMotion,
}: CubeSceneProps) {
  const layout = useMemo(() => layoutCubePair(a, b), [a, b])
  const framing = useMemo(() => cameraFramingForPair(a, b), [a, b])

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[40, 60, 30]} intensity={1.05} />
      <directionalLight position={[-30, 20, -20]} intensity={0.35} />

      <UnitCubeBlock
        edge={layout.left.edge}
        position={[
          layout.left.position.x,
          layout.left.position.y,
          layout.left.position.z,
        ]}
        variant="primary"
      />
      <UnitCubeBlock
        edge={layout.right.edge}
        position={[
          layout.right.position.x,
          layout.right.position.y,
          layout.right.position.z,
        ]}
        variant="secondary"
      />

      <InitialCamera framing={framing} />
      <CameraReset framing={framing} resetToken={resetToken} />

      {exploring ? (
        <ExploreControls
          framing={framing}
          resetToken={resetToken}
          reducedMotion={reducedMotion}
        />
      ) : null}
    </>
  )
}
