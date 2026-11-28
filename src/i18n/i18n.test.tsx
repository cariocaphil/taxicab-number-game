/** @vitest-environment jsdom */
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TaxiSelectionGrid } from '../components/taxi/TaxiSelectionGrid'
import { CubeVisualizationCaption } from '../components/visualization/CubeVisualizationCaption'
import i18n from './index'
import en from './locales/en.json'

describe('i18n English resource', () => {
  it('loads the English translation resource as the active language', () => {
    expect(i18n.language).toBe('en')
    expect(i18n.t('meta.title')).toBe(en.meta.title)
    expect(i18n.t('home.brandName')).toBe(en.home.brandName)
    expect(i18n.t('game.heading')).toBe(en.game.heading)
    expect(i18n.t('progressiveReveal.heading')).toBe(
      en.progressiveReveal.heading,
    )
    expect(i18n.t('visualization.explore')).toBe(en.visualization.explore)
  })

  it('interpolates dynamic values', () => {
    expect(i18n.t('game.feedbackIncorrect', { plate: 4104 })).toBe(
      'Not quite. 4104 is not the taxicab number. Try another taxi!',
    )
    expect(
      i18n.t('progressiveReveal.equationRevealedAriaLabel', {
        a: 1,
        b: 12,
        target: 1729,
      }),
    ).toBe('1 cubed plus 12 cubed equals 1729')
  })

  it('resolves singular and plural volume labels', () => {
    expect(
      i18n.t('visualization.volume', { count: 1, volume: '1' }),
    ).toBe('1 unit³')
    expect(
      i18n.t('visualization.volume', { count: 8, volume: '8' }),
    ).toBe('8 units³')
    expect(
      i18n.t('visualization.explanationSecondary', {
        count: 1,
        edge: 1,
        volume: '1',
      }),
    ).toBe('A cube with an edge length of 1 contains 1 unit cube.')
    expect(
      i18n.t('visualization.explanationSecondary', {
        count: 1728,
        edge: 12,
        volume: '1,728',
      }),
    ).toBe('A cube with an edge length of 12 contains 1,728 unit cubes.')
  })
})

describe('translated component rendering', () => {
  it('renders selection-grid English copy from the translation resource', () => {
    render(
      <TaxiSelectionGrid
        candidates={[1729, 4104]}
        target={1729}
        incorrectSelections={new Set([4104])}
        correctSelected={false}
        onSelect={() => {}}
        onContinue={() => {}}
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'Spot the Taxicab Number!' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /Not quite\. 4104 is not the taxicab number\. Try another taxi!/,
      ),
    ).toBeInTheDocument()
  })

  it('renders pluralized visualization caption volume labels', () => {
    render(
      <CubeVisualizationCaption
        pair={{ a: 1, b: 12 }}
        captionId="caption-test"
      />,
    )

    expect(screen.getByText('1 unit³')).toBeInTheDocument()
    expect(screen.getByText('1,728 units³')).toBeInTheDocument()
    expect(
      screen.getByText(
        /A cube with an edge length of 12 contains 12 × 12 × 12 = 1,728 unit cubes\./,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /A cube with an edge length of 1 contains 1 unit cube\./,
      ),
    ).toBeInTheDocument()
  })
})
