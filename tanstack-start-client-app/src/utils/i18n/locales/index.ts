import enHomeJson from './en/home.json'
import frHomeJson from './fr/home.json'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const resources = {
  en: {
    ns_home: enHomeJson,
  },
  fr: {
    ns_home: frHomeJson,
  },
}
