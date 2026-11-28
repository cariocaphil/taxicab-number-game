import { useTranslation } from 'react-i18next'
import { AppFooter } from './components/layout/AppFooter'
import { AppHeader } from './components/layout/AppHeader'
import { GamePage } from './pages/GamePage'

function App() {
  const { t } = useTranslation()

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        {t('common.skipToContent')}
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
