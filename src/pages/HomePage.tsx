const PREVIEW_PLATES = [
  { number: '1729', caption: 'Ta(2)' },
  { number: '4104', caption: 'Plate' },
  { number: '13832', caption: 'Plate' },
  { number: '87539319', caption: 'Plate' },
] as const

export function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__copy">
          <p className="hero__eyebrow">Hardy–Ramanujan</p>
          <h1 id="hero-heading" className="hero__title">
            Every number has a story.
          </h1>
          <p className="hero__subtitle">
            Discover the hidden mathematics behind a taxi&apos;s number plate.
          </p>
          <div className="hero__explanation">
            <p>
              <strong>1729</strong> is the smallest positive integer expressible
              as the sum of two positive integer cubes in two distinct ways.
            </p>
            <p className="hero__equation" role="math" aria-label="1729 equals 1 cubed plus 12 cubed, which also equals 9 cubed plus 10 cubed">
              1729 = 1<sup>3</sup> + 12<sup>3</sup> = 9<sup>3</sup> + 10
              <sup>3</sup>
            </p>
          </div>
        </div>

        <div className="hero__showcase" aria-hidden="true">
          <div className="hero-plate">
            <span className="hero-plate__label">Taxi</span>
            <span className="hero-plate__number">1729</span>
          </div>
        </div>
      </section>

      <section
        className="preview"
        aria-labelledby="preview-heading"
      >
        <h2 id="preview-heading">Discover the hidden numbers</h2>
        <p className="preview__intro">
          A gallery of taxi number plates will invite you to investigate which
          numbers hide cube-sum relationships. Here is a first glimpse of what
          is on the way.
        </p>
        <ul className="plate-gallery">
          {PREVIEW_PLATES.map((plate) => (
            <li key={plate.number} className="plate-card">
              {plate.number}
              <span className="plate-card__caption">{plate.caption}</span>
            </li>
          ))}
        </ul>
        <p className="coming-soon">Coming soon — the interactive game is under construction.</p>
      </section>
    </>
  )
}
