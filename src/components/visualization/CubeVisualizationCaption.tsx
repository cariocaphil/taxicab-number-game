import { cube, type CubePair } from '../../domain/taxicab'
import { pairUsesSimplifiedGrid } from './cubeLayout'

interface CubeVisualizationCaptionProps {
  readonly pair: CubePair
  readonly captionId: string
}

function formatVolume(volume: number): string {
  const formatted = volume.toLocaleString('en-US')
  return volume === 1 ? `${formatted} unit³` : `${formatted} units³`
}

/**
 * Educational dimension/volume copy for a cube pair. Owns no WebGL state.
 */
export function CubeVisualizationCaption({
  pair,
  captionId,
}: CubeVisualizationCaptionProps) {
  const volumeA = cube(pair.a)
  const volumeB = cube(pair.b)
  const simplified = pairUsesSimplifiedGrid(pair.a, pair.b)

  return (
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
          longer marks every individual unit cube. The edge lengths and volumes
          above remain exact.
        </p>
      ) : null}
    </figcaption>
  )
}
