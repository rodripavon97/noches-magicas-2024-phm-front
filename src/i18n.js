// @ts-nocheck
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import esJSON from './locale/es.json'
i18n.use(initReactI18next).init({
  resources: {
    es: { ...esJSON },
  },
  fallbackLng: 'es',

  defaultNS: 'common',
  fallbackNS: 'common',

  interpolation: {
    escapeValue: false,
  },
})

i18n.services.formatter.add('lowercase', value => {
  return value.toLowerCase()
})

export default i18n
