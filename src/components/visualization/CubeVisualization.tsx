import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useId,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react'
import { cube, type CubePair } from '../../domain/taxicab'
import { pairUsesSimplifiedGrid } from './cubeLayout'
import { CubeVisualizationFallback } from './CubeVisualizationFallback'
import { isWebGLAvailable } from './webglSupport'
import '../../styles/cube-visualization.css'

const LazyCubePairVisualization = lazy(async () => {
  const module = await import('./CubePairVisualization')
  return { default: module.CubePairVisualization }
})

interface CubeVisualizationProps {
  readonly pair: CubePair
}

type SceneMode = 'webgl' | 'fallback'

interface SceneErrorBoundaryProps {
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
      return null
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

export function CubeVisualization({ pair }: CubeVisualizationProps) {
  const captionId = useId()
  const volumeA = cube(pair.a)
  const volumeB = cube(pair.b)
  const simplified = pairUsesSimplifiedGrid(pair.a, pair.b)

  const [sceneMode, setSceneMode] = useState<SceneMode>(() =>
    isWebGLAvailable() ? 'webgl' : 'fallback',
  )
  const [exploring, setExploring] = useState(false)
  const [resetToken, setResetToken] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion)

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

  const switchToFallback = () => {
    setExploring(false)
    setSceneMode('fallback')
  }

  return (
    <figure
      className="cube-viz"
      aria-describedby={captionId}
      data-testid="cube-visualization"
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

      {sceneMode === 'webgl' ? (
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
        <CubeVisualizationFallback a={pair.a} b={pair.b} />
      )}

      {sceneMode === 'webgl' ? (
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
            disabled={!exploring}
            onClick={() => {
              setResetToken((token) => token + 1)
            }}
          >
            Reset camera
          </button>
        </div>
      ) : null}

      {sceneMode === 'webgl' ? (
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
