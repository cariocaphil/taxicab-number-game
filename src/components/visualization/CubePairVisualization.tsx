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
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (host === null) {
      return
    }

    const canvas = host.querySelector('canvas')
    if (canvas === null) {
      return
    }

    const handleContextLost = (event: Event) => {
      event.preventDefault()
      onContextLost()
    }

    canvas.addEventListener('webglcontextlost', handleContextLost)
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost)
    }
  }, [onContextLost, pair.a, pair.b])

  return (
    <div
      ref={hostRef}
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
          } catch {
            onInitError()
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
