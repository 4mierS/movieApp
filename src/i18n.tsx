import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Importiere die Übersetzungsdateien
import translationEN from "./locales/en/translation.json"
import translationDE from "./locales/de/translation.json"

// Ressourcen definieren
const resources = {
  en: { translation: translationEN },
  de: { translation: translationDE },
}

i18n
  .use(LanguageDetector) // Erkennt automatisch die Sprache
  .use(initReactI18next) // Für React
  .init({
    resources,
    fallbackLng: "en", // Fallback-Sprache
    interpolation: {
      escapeValue: false, // Für React nicht notwendig
    },
  })

export default i18n
