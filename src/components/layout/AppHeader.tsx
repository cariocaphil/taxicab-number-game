export function AppHeader() {
  return (
    <header className="app-header">
      <div className="checkerboard-strip" aria-hidden="true" />
      <div className="app-header__inner">
        <a className="brand" href="#main">
          <span className="brand__plate" aria-hidden="true">
            TAXI
          </span>
          <span className="brand__name">The Taxicab Number Game</span>
        </a>
      </div>
    </header>
  )
}
