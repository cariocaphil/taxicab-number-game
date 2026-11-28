import { BufferGeometry, Float32BufferAttribute } from 'three'

/**
 * Build line segments that draw a surface grid on all six faces of an n×n×n cube
 * centered at the origin. Does not allocate interior voxels.
 */
export function buildSurfaceGridGeometry(
  edge: number,
  segments: number,
): BufferGeometry {
  const half = edge / 2
  const step = edge / segments
  const positions: number[] = []

  function pushLine(
    ax: number,
    ay: number,
    az: number,
    bx: number,
    by: number,
    bz: number,
  ): void {
    positions.push(ax, ay, az, bx, by, bz)
  }

  for (const z of [-half, half]) {
    for (let i = 0; i <= segments; i += 1) {
      const t = -half + i * step
      pushLine(-half, t, z, half, t, z)
      pushLine(t, -half, z, t, half, z)
    }
  }

  for (const y of [-half, half]) {
    for (let i = 0; i <= segments; i += 1) {
      const t = -half + i * step
      pushLine(-half, y, t, half, y, t)
      pushLine(t, y, -half, t, y, half)
    }
  }

  for (const x of [-half, half]) {
    for (let i = 0; i <= segments; i += 1) {
      const t = -half + i * step
      pushLine(x, -half, t, x, half, t)
      pushLine(x, t, -half, x, t, half)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  return geometry
}
