import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CubeVisualizationFallback } from './CubeVisualizationFallback'

describe('CubeVisualizationFallback', () => {
  it('assigns document-unique hatch pattern ids across multiple diagrams', () => {
    const { container } = render(
      <>
        <CubeVisualizationFallback a={1} b={12} />
        <CubeVisualizationFallback a={1} b={12} />
      </>,
    )

    const patternIds = [...container.querySelectorAll('pattern')].map(
      (pattern) => pattern.id,
    )

    expect(patternIds).toHaveLength(4)
    expect(new Set(patternIds).size).toBe(patternIds.length)
  })
})
