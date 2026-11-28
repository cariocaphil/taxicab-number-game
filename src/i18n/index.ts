import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en'],
  resources: {
    en: {
      translation: en,
    },
  },
  interpolation: {
    escapeValue: false,
  },
})

if (typeof document !== 'undefined') {
  document.title = i18n.t('meta.title')
  const description = document.querySelector('meta[name="description"]')
  if (description) {
    description.setAttribute('content', i18n.t('meta.description'))
  }
}

export default i18n
