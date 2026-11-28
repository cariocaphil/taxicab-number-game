import { useTranslation } from 'react-i18next'

export function AppFooter() {
  const { t } = useTranslation()

  return (
    <footer className="app-footer">
      <div className="checkerboard-strip" aria-hidden="true" />
      <div className="app-footer__inner">
        <p>{t('home.footer')}</p>
      </div>
    </footer>
  )
}
