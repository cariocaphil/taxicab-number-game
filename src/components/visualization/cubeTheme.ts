import type { CSSProperties } from 'react'

export type CubeBlockVariant = 'primary' | 'secondary'

export const CUBE_VARIANT_THEME = {
  primary: {
    face: '#c9851a',
    edge: '#5c3a0a',
    hatch: '#f0d29a',
    emissive: '#000000',
    emissiveIntensity: 0,
  },
  secondary: {
    face: '#2f6fed',
    edge: '#163a8a',
    hatch: '#a9c2f7',
    emissive: '#0a1a40',
    emissiveIntensity: 0.15,
  },
} as const

/**
 * CSS custom properties for caption swatches / borders, derived from CUBE_VARIANT_THEME.
 */
export function cubeVariantThemeCssVars(): CSSProperties {
  const { primary, secondary } = CUBE_VARIANT_THEME

  return {
    '--cube-primary-face': primary.face,
    '--cube-primary-edge': primary.edge,
    '--cube-primary-hatch': primary.hatch,
    '--cube-secondary-face': secondary.face,
    '--cube-secondary-edge': secondary.edge,
    '--cube-secondary-hatch': secondary.hatch,
  } as CSSProperties
}
