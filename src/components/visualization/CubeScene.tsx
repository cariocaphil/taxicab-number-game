import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useRef, type ComponentRef } from 'react'
import { cameraFramingForPair, layoutCubePair } from './cubeLayout'
import { UnitCubeBlock } from './UnitCubeBlock'

type OrbitControlsHandle = ComponentRef<typeof OrbitControls>

interface CubeSceneProps {
  readonly a: number
  readonly b: number
  readonly exploring: boolean
  readonly resetToken: number
  readonly reducedMotion: boolean
}

function InitialCamera({ a, b }: { readonly a: number; readonly b: number }) {
  const { camera, invalidate } = useThree()
  const framing = cameraFramingForPair(a, b)

  useLayoutEffect(() => {
    camera.position.set(
      framing.position.x,
      framing.position.y,
      framing.position.z,
    )
    camera.lookAt(framing.target.x, framing.target.y, framing.target.z)
    camera.updateProjectionMatrix()
    invalidate()
  }, [a, b, camera, framing, invalidate])

  return null
}

function ExploreControls({
  a,
  b,
  resetToken,
  reducedMotion,
}: {
  readonly a: number
  readonly b: number
  readonly resetToken: number
  readonly reducedMotion: boolean
}) {
  const controlsRef = useRef<OrbitControlsHandle | null>(null)
  const { camera, gl, invalidate } = useThree()
  const framing = cameraFramingForPair(a, b)

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
    camera.position.set(
      framing.position.x,
      framing.position.y,
      framing.position.z,
    )
    if (controls !== null) {
      controls.target.set(
        framing.target.x,
        framing.target.y,
        framing.target.z,
      )
      controls.update()
    }
    invalidate()
  }, [camera, framing, invalidate, resetToken])

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
  const layout = layoutCubePair(a, b)

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

      <InitialCamera a={a} b={b} />

      {exploring ? (
        <ExploreControls
          a={a}
          b={b}
          resetToken={resetToken}
          reducedMotion={reducedMotion}
        />
      ) : null}
    </>
  )
}
