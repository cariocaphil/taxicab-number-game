import { useTranslation } from 'react-i18next'
import { cube, type CubePair } from '../../domain/taxicab'
import { pairUsesSimplifiedGrid } from './cubeLayout'

interface CubeVisualizationCaptionProps {
  readonly pair: CubePair
  readonly captionId: string
}

/**
 * Educational dimension/volume copy for a cube pair. Owns no WebGL state.
 */
export function CubeVisualizationCaption({
  pair,
  captionId,
}: CubeVisualizationCaptionProps) {
  const { t } = useTranslation()
  const volumeA = cube(pair.a)
  const volumeB = cube(pair.b)
  const simplified = pairUsesSimplifiedGrid(pair.a, pair.b)
  const formattedVolumeA = volumeA.toLocaleString('en-US')
  const formattedVolumeB = volumeB.toLocaleString('en-US')

  return (
    <figcaption id={captionId} className="cube-viz__caption">
      <div className="cube-viz__dimensions">
        <div className="cube-viz__dimension cube-viz__dimension--primary">
          <span className="cube-viz__swatch" aria-hidden="true" />
          <p className="cube-viz__size">
            {pair.a} × {pair.a} × {pair.a}
          </p>
          <p className="cube-viz__volume">
            {t('visualization.volume', {
              count: volumeA,
              volume: formattedVolumeA,
            })}
          </p>
        </div>
        <div className="cube-viz__dimension cube-viz__dimension--secondary">
          <span className="cube-viz__swatch" aria-hidden="true" />
          <p className="cube-viz__size">
            {pair.b} × {pair.b} × {pair.b}
          </p>
          <p className="cube-viz__volume">
            {t('visualization.volume', {
              count: volumeB,
              volume: formattedVolumeB,
            })}
          </p>
        </div>
      </div>

      <p className="cube-viz__explanation">
        {t('visualization.explanationPrimary', {
          edge: pair.b,
          volume: formattedVolumeB,
        })}
        {pair.a !== pair.b ? (
          <>
            {' '}
            {t('visualization.explanationSecondary', {
              count: volumeA,
              edge: pair.a,
              volume: formattedVolumeA,
            })}
          </>
        ) : null}
      </p>

      {simplified ? (
        <p className="cube-viz__disclaimer" role="note">
          {t('visualization.simplifiedGridDisclaimer')}
        </p>
      ) : null}
    </figcaption>
  )
}
