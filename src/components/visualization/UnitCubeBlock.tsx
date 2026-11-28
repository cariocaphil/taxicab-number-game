import { useLayoutEffect, useMemo } from 'react'
import { gridDensityForEdge } from './cubeLayout'
import {
  CUBE_VARIANT_THEME,
  type CubeBlockVariant,
} from './cubeTheme'
import { buildSurfaceGridGeometry } from './surfaceGrid'

export type { CubeBlockVariant }

interface UnitCubeBlockProps {
  readonly edge: number
  readonly position: readonly [number, number, number]
  readonly variant: CubeBlockVariant
}

export function UnitCubeBlock({
  edge,
  position,
  variant,
}: UnitCubeBlockProps) {
  const density = gridDensityForEdge(edge)
  const theme = CUBE_VARIANT_THEME[variant]

  const gridGeometry = useMemo(
    () => buildSurfaceGridGeometry(edge, density.segments),
    [edge, density.segments],
  )

  useLayoutEffect(() => {
    return () => {
      gridGeometry.dispose()
    }
  }, [gridGeometry])

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[edge, edge, edge]} />
        <meshStandardMaterial
          color={theme.face}
          roughness={0.55}
          metalness={0.05}
          emissive={theme.emissive}
          emissiveIntensity={theme.emissiveIntensity}
        />
      </mesh>
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial
          color={theme.edge}
          transparent
          opacity={0.85}
        />
      </lineSegments>
    </group>
  )
}
