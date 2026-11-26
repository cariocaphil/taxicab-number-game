import { AppFooter } from './components/layout/AppFooter'
import { AppHeader } from './components/layout/AppHeader'
import { GamePage } from './pages/GamePage'

function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AppHeader />
      <main id="main" className="app-main">
        <GamePage />
      </main>
      <AppFooter />
    </div>
  )
}

export default App
