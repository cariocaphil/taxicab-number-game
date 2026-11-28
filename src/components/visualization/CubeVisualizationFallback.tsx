import { CUBE_VARIANT_THEME } from './cubeTheme'

const FALLBACK_MESSAGE =
  'Interactive 3D view unavailable. The cube dimensions and volumes are listed above.'

interface CubeVisualizationFallbackProps {
  readonly a: number
  readonly b: number
  /**
   * Availability copy under the diagram. Defaults to the WebGL-unavailable
   * message. Pass `null` when the diagram is intentional (e.g. only one live
   * WebGL view is allowed) and no availability warning is needed.
   */
  readonly message?: string | null
}

/**
 * Static scene substitute only. Math labels and educational copy live in the parent.
 */
export function CubeVisualizationFallback({
  a,
  b,
  message = FALLBACK_MESSAGE,
}: CubeVisualizationFallbackProps) {
  const maxEdge = Math.max(a, b)
  const scale = 7.5 / maxEdge
  const primary = CUBE_VARIANT_THEME.primary
  const secondary = CUBE_VARIANT_THEME.secondary

  return (
    <div
      className="cube-viz__fallback"
      role="img"
      aria-label={`Static diagram of cubes with edges ${a} and ${b}`}
    >
      <svg
        className="cube-viz__fallback-svg"
        viewBox="0 0 320 160"
        aria-hidden="true"
      >
        <IsometricCube
          edge={a}
          scale={scale}
          originX={70}
          originY={120}
          fill={primary.face}
          stroke={primary.edge}
          hatch="primary"
        />
        <IsometricCube
          edge={b}
          scale={scale}
          originX={210}
          originY={120}
          fill={secondary.face}
          stroke={secondary.edge}
          hatch="secondary"
        />
      </svg>
      {message !== null ? (
        <p className="cube-viz__fallback-message">{message}</p>
      ) : null}
    </div>
  )
}

interface IsometricCubeProps {
  readonly edge: number
  readonly scale: number
  readonly originX: number
  readonly originY: number
  readonly fill: string
  readonly stroke: string
  readonly hatch: 'primary' | 'secondary'
}

function IsometricCube({
  edge,
  scale,
  originX,
  originY,
  fill,
  stroke,
  hatch,
}: IsometricCubeProps) {
  const size = edge * scale
  const dx = size * 0.55
  const dy = size * 0.32

  const front = [
    [originX, originY],
    [originX + size, originY],
    [originX + size, originY - size],
    [originX, originY - size],
  ] as const
  const top = [
    [originX, originY - size],
    [originX + size, originY - size],
    [originX + size + dx, originY - size - dy],
    [originX + dx, originY - size - dy],
  ] as const
  const side = [
    [originX + size, originY],
    [originX + size + dx, originY - dy],
    [originX + size + dx, originY - size - dy],
    [originX + size, originY - size],
  ] as const

  const patternId = `cube-hatch-${hatch}-${edge}`

  return (
    <g>
      <defs>
        <pattern
          id={patternId}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform={
            hatch === 'secondary' ? 'rotate(45)' : 'rotate(0)'
          }
        >
          <path
            d="M0 0 H6"
            stroke={stroke}
            strokeWidth="1"
            opacity="0.35"
          />
        </pattern>
      </defs>
      <polygon points={toPoints(top)} fill={fill} stroke={stroke} />
      <polygon points={toPoints(side)} fill={fill} stroke={stroke} opacity={0.85} />
      <polygon points={toPoints(front)} fill={fill} stroke={stroke} />
      <polygon points={toPoints(front)} fill={`url(#${patternId})`} />
      <polygon points={toPoints(top)} fill={`url(#${patternId})`} opacity={0.5} />
    </g>
  )
}

function toPoints(points: ReadonlyArray<readonly [number, number]>): string {
  return points.map(([x, y]) => `${x},${y}`).join(' ')
}
