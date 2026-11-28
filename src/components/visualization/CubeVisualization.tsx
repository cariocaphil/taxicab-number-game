import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useState,
} from 'react'
import type { CubePair } from '../../domain/taxicab'
import { CubeVisualizationCaption } from './CubeVisualizationCaption'
import { cubeVariantThemeCssVars } from './cubeTheme'
import { CubeVisualizationFallback } from './CubeVisualizationFallback'
import { SceneErrorBoundary } from './SceneErrorBoundary'
import { isWebGLAvailable } from './webglSupport'
import '../../styles/cube-visualization.css'

const LazyCubePairVisualization = lazy(async () => {
  const module = await import('./CubePairVisualization')
  return { default: module.CubePairVisualization }
})

interface CubeVisualizationProps {
  readonly pair: CubePair
  /**
   * When false, skip WebGL and show a quiet static diagram so at most one
   * interactive canvas is mounted across revealed representations.
   */
  readonly enableWebGL?: boolean
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function CubeVisualization({
  pair,
  enableWebGL = true,
}: CubeVisualizationProps) {
  const captionId = useId()

  const [webglSupported] = useState(() => isWebGLAvailable())
  const [webglFailed, setWebglFailed] = useState(false)
  const [exploring, setExploring] = useState(false)
  const [resetToken, setResetToken] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion)

  const showWebGL = enableWebGL && webglSupported && !webglFailed

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      setReducedMotion(media.matches)
    }
    sync()
    media.addEventListener('change', sync)
    return () => {
      media.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (!enableWebGL) {
      setExploring(false)
    }
  }, [enableWebGL])

  const switchToFallback = useCallback(() => {
    setExploring(false)
    setWebglFailed(true)
  }, [])

  return (
    <figure
      className="cube-viz"
      style={cubeVariantThemeCssVars()}
      aria-describedby={captionId}
      data-testid="cube-visualization"
      data-webgl={showWebGL ? 'true' : 'false'}
    >
      <CubeVisualizationCaption pair={pair} captionId={captionId} />

      {showWebGL ? (
        <SceneErrorBoundary onError={switchToFallback}>
          <Suspense
            fallback={
              <div className="cube-viz__loading" role="status">
                Loading 3D view…
              </div>
            }
          >
            <LazyCubePairVisualization
              pair={pair}
              exploring={exploring}
              resetToken={resetToken}
              reducedMotion={reducedMotion}
              onContextLost={switchToFallback}
              onInitError={switchToFallback}
            />
          </Suspense>
        </SceneErrorBoundary>
      ) : (
        <CubeVisualizationFallback
          a={pair.a}
          b={pair.b}
          message={enableWebGL ? undefined : null}
        />
      )}

      {showWebGL ? (
        <div className="cube-viz__controls">
          <button
            type="button"
            className="cube-viz__button"
            aria-pressed={exploring}
            onClick={() => {
              setExploring((current) => !current)
            }}
          >
            {exploring ? 'Done exploring' : 'Explore 3D'}
          </button>
          <button
            type="button"
            className="cube-viz__button cube-viz__button--secondary"
            onClick={() => {
              setResetToken((token) => token + 1)
            }}
          >
            Reset camera
          </button>
        </div>
      ) : null}

      {showWebGL ? (
        exploring ? (
          <p className="cube-viz__hint">
            Drag to rotate and scroll to zoom. Choose Done exploring to restore
            page scrolling on touch devices.
          </p>
        ) : (
          <p className="cube-viz__hint">
            Page scrolling stays available. Choose Explore 3D to rotate and zoom
            the scene.
          </p>
        )
      ) : null}
    </figure>
  )
}
