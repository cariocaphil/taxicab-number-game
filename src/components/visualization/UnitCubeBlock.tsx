import { useLayoutEffect, useMemo } from 'react'
import { gridDensityForEdge } from './cubeLayout'
import { buildSurfaceGridGeometry } from './surfaceGrid'

export type CubeBlockVariant = 'primary' | 'secondary'

interface UnitCubeBlockProps {
  readonly edge: number
  readonly position: readonly [number, number, number]
  readonly variant: CubeBlockVariant
}

const FACE_COLORS: Record<CubeBlockVariant, string> = {
  primary: '#c9851a',
  secondary: '#2f6fed',
}

const EDGE_COLORS: Record<CubeBlockVariant, string> = {
  primary: '#5c3a0a',
  secondary: '#163a8a',
}

export function UnitCubeBlock({
  edge,
  position,
  variant,
}: UnitCubeBlockProps) {
  const density = gridDensityForEdge(edge)

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
          color={FACE_COLORS[variant]}
          roughness={0.55}
          metalness={0.05}
          emissive={variant === 'secondary' ? '#0a1a40' : '#000000'}
          emissiveIntensity={variant === 'secondary' ? 0.15 : 0}
        />
      </mesh>
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial
          color={EDGE_COLORS[variant]}
          transparent
          opacity={0.85}
        />
      </lineSegments>
    </group>
  )
}
