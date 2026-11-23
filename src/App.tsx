import { AppFooter } from './components/layout/AppFooter'
import { AppHeader } from './components/layout/AppHeader'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AppHeader />
      <main id="main" className="app-main">
        <HomePage />
      </main>
      <AppFooter />
    </div>
  )
}

export default App
