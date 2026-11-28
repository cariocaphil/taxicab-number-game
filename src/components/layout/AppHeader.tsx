import { useTranslation } from 'react-i18next'

export function AppHeader() {
  const { t } = useTranslation()

  return (
    <header className="app-header">
      <div className="checkerboard-strip" aria-hidden="true" />
      <div className="app-header__inner">
        <a className="brand" href="#main">
          <span className="brand__plate" aria-hidden="true">
            {t('home.badge')}
          </span>
          <span className="brand__name">{t('home.brandName')}</span>
        </a>
      </div>
    </header>
  )
}
