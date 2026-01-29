import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import enJSON from './locale/en.json';
import frJSON from './locale/fr.json';

/**
 * Initialize i18n for internationalization
 * Currently supports English with French translations available but not enabled
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ["en"], // TODO: Enable French when ready: ["en", "fr"]
    resources: {
      en: { ...enJSON },
      fr: { ...frJSON },
    },
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS
    },
    react: {
      useSuspense: false, // Disable suspense mode for better compatibility
    },
    detection: {
      // Browser language detection configuration
      order: ['navigator', 'localStorage', 'cookie'],
      caches: ['localStorage', 'cookie'],
    }
  });

export default i18n;