import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, type ReactElement } from 'react'
import type { CubePair } from '../../domain/taxicab'
import { CubeScene } from './CubeScene'

export interface CubePairVisualizationProps {
  readonly pair: CubePair
  readonly exploring: boolean
  readonly resetToken: number
  readonly reducedMotion: boolean
  readonly onContextLost: () => void
  readonly onInitError: () => void
}

/**
 * WebGL Canvas host for a cube pair. Lazy-loaded by the parent entry.
 */
export function CubePairVisualization({
  pair,
  exploring,
  resetToken,
  reducedMotion,
  onContextLost,
  onInitError,
}: CubePairVisualizationProps): ReactElement {
  const onContextLostRef = useRef(onContextLost)
  const onInitErrorRef = useRef(onInitError)
  const detachContextLostListenerRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    onContextLostRef.current = onContextLost
  }, [onContextLost])

  useEffect(() => {
    onInitErrorRef.current = onInitError
  }, [onInitError])

  useEffect(() => {
    return () => {
      detachContextLostListenerRef.current?.()
      detachContextLostListenerRef.current = null
    }
  }, [])

  return (
    <div
      className={
        exploring
          ? 'cube-viz__canvas-host cube-viz__canvas-host--exploring'
          : 'cube-viz__canvas-host'
      }
    >
      <Canvas
        frameloop="demand"
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        camera={{ fov: 42, near: 0.1, far: 2000 }}
        onCreated={({ gl }) => {
          try {
            gl.setClearColor(0x000000, 0)
            // Keep scroll possible until Explore mode mounts OrbitControls.
            gl.domElement.style.touchAction = 'auto'

            detachContextLostListenerRef.current?.()

            const canvas = gl.domElement
            const handleContextLost = (event: Event) => {
              event.preventDefault()
              onContextLostRef.current()
            }

            canvas.addEventListener('webglcontextlost', handleContextLost)
            detachContextLostListenerRef.current = () => {
              canvas.removeEventListener('webglcontextlost', handleContextLost)
            }
          } catch {
            onInitErrorRef.current()
          }
        }}
      >
        <CubeScene
          a={pair.a}
          b={pair.b}
          exploring={exploring}
          resetToken={resetToken}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  )
}

export default CubePairVisualization
