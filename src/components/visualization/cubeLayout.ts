/**
 * Pure layout helpers for cube-pair 3D framing and surface grid density.
 * Keep GPU-free so Vitest can cover catalogue extremes without WebGL.
 */

/** Edges at or below this length get a true 1-unit surface grid. */
export const FULL_UNIT_GRID_MAX_EDGE = 16

/** Maximum face subdivisions when the unit grid is simplified. */
export const MAX_SIMPLIFIED_GRID_SEGMENTS = 12

export interface Vec3 {
  readonly x: number
  readonly y: number
  readonly z: number
}

export interface GridDensity {
  /** Number of equal segments along each edge of the cube face. */
  readonly segments: number
  /** True when segments do not match individual unit cubes. */
  readonly isSimplified: boolean
}

export interface CubePlacement {
  readonly edge: number
  readonly position: Vec3
}

export interface PairLayout {
  readonly left: CubePlacement
  readonly right: CubePlacement
  /** World-space gap between the facing faces of the two cubes. */
  readonly gap: number
  readonly boundsMin: Vec3
  readonly boundsMax: Vec3
  readonly center: Vec3
  readonly span: number
}

export interface CameraFraming {
  readonly position: Vec3
  readonly target: Vec3
  readonly minDistance: number
  readonly maxDistance: number
}

export function gridDensityForEdge(edge: number): GridDensity {
  if (!Number.isInteger(edge) || edge < 1) {
    throw new Error('edge must be a positive integer')
  }

  if (edge <= FULL_UNIT_GRID_MAX_EDGE) {
    return { segments: edge, isSimplified: false }
  }

  return { segments: MAX_SIMPLIFIED_GRID_SEGMENTS, isSimplified: true }
}

export function pairUsesSimplifiedGrid(a: number, b: number): boolean {
  return gridDensityForEdge(a).isSimplified || gridDensityForEdge(b).isSimplified
}

/**
 * Place two cubes on the X axis, bottoms on y = 0, centered as a pair at the origin.
 */
export function layoutCubePair(a: number, b: number): PairLayout {
  if (!Number.isInteger(a) || a < 1 || !Number.isInteger(b) || b < 1) {
    throw new Error('cube edges must be positive integers')
  }

  const gap = Math.max(a, b) * 0.45 + 2
  const totalWidth = a + gap + b
  const leftX = -totalWidth / 2 + a / 2
  const rightX = totalWidth / 2 - b / 2

  const left: CubePlacement = {
    edge: a,
    position: { x: leftX, y: a / 2, z: 0 },
  }
  const right: CubePlacement = {
    edge: b,
    position: { x: rightX, y: b / 2, z: 0 },
  }

  const maxY = Math.max(a, b)
  const maxZ = Math.max(a, b) / 2

  const boundsMin: Vec3 = {
    x: leftX - a / 2,
    y: 0,
    z: -maxZ,
  }
  const boundsMax: Vec3 = {
    x: rightX + b / 2,
    y: maxY,
    z: maxZ,
  }

  const center: Vec3 = {
    x: (boundsMin.x + boundsMax.x) / 2,
    y: (boundsMin.y + boundsMax.y) / 2,
    z: (boundsMin.z + boundsMax.z) / 2,
  }

  const span = Math.max(
    boundsMax.x - boundsMin.x,
    boundsMax.y - boundsMin.y,
    boundsMax.z - boundsMin.z,
  )

  return { left, right, gap, boundsMin, boundsMax, center, span }
}

/**
 * Isometric-style camera that frames both cubes with padding.
 */
export function cameraFramingForPair(a: number, b: number): CameraFraming {
  const layout = layoutCubePair(a, b)
  const distance = layout.span * 1.85

  // Bias toward +Z so both cubes stay side-by-side in view for asymmetric pairs
  // (a large nearer cube on +X would otherwise occlude a smaller sibling).
  return {
    position: {
      x: layout.center.x + distance * 0.45,
      y: layout.center.y + distance * 0.55,
      z: layout.center.z + distance * 1.15,
    },
    target: layout.center,
    minDistance: Math.max(layout.span * 0.45, 2),
    maxDistance: Math.max(layout.span * 6, 40),
  }
}
