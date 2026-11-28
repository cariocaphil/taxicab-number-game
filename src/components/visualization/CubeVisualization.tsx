import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react'
import { cube, type CubePair } from '../../domain/taxicab'
import { pairUsesSimplifiedGrid } from './cubeLayout'
import { cubeVariantThemeCssVars } from './cubeTheme'
import { CubeVisualizationFallback } from './CubeVisualizationFallback'
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

interface SceneErrorBoundaryProps {
  readonly a: number
  readonly b: number
  readonly onError: () => void
  readonly children: ReactNode
}

interface SceneErrorBoundaryState {
  readonly hasError: boolean
}

class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  public state: SceneErrorBoundaryState = { hasError: false }

  public static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(_error: Error, _info: ErrorInfo): void {
    this.props.onError()
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <CubeVisualizationFallback a={this.props.a} b={this.props.b} />
      )
    }
    return this.props.children
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function formatVolume(volume: number): string {
  const formatted = volume.toLocaleString('en-US')
  return volume === 1 ? `${formatted} unit³` : `${formatted} units³`
}

export function CubeVisualization({
  pair,
  enableWebGL = true,
}: CubeVisualizationProps) {
  const captionId = useId()
  const volumeA = cube(pair.a)
  const volumeB = cube(pair.b)
  const simplified = pairUsesSimplifiedGrid(pair.a, pair.b)

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
      <figcaption id={captionId} className="cube-viz__caption">
        <div className="cube-viz__dimensions">
          <div className="cube-viz__dimension cube-viz__dimension--primary">
            <span className="cube-viz__swatch" aria-hidden="true" />
            <p className="cube-viz__size">
              {pair.a} × {pair.a} × {pair.a}
            </p>
            <p className="cube-viz__volume">{formatVolume(volumeA)}</p>
          </div>
          <div className="cube-viz__dimension cube-viz__dimension--secondary">
            <span className="cube-viz__swatch" aria-hidden="true" />
            <p className="cube-viz__size">
              {pair.b} × {pair.b} × {pair.b}
            </p>
            <p className="cube-viz__volume">{formatVolume(volumeB)}</p>
          </div>
        </div>

        <p className="cube-viz__explanation">
          A cube with an edge length of {pair.b} contains {pair.b} × {pair.b} ×{' '}
          {pair.b} = {volumeB.toLocaleString('en-US')} unit cubes.
          {pair.a !== pair.b ? (
            <>
              {' '}
              A cube with an edge length of {pair.a} contains{' '}
              {volumeA.toLocaleString('en-US')}{' '}
              {volumeA === 1 ? 'unit cube' : 'unit cubes'}.
            </>
          ) : null}
        </p>

        {simplified ? (
          <p className="cube-viz__disclaimer" role="note">
            For these larger cubes the visible surface grid is simplified and no
            longer marks every individual unit cube. The edge lengths and
            volumes above remain exact.
          </p>
        ) : null}
      </figcaption>

      {showWebGL ? (
        <SceneErrorBoundary
          a={pair.a}
          b={pair.b}
          onError={switchToFallback}
        >
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
