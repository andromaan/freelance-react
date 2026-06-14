import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { setDefaultOptions } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'uk'],
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  setDefaultOptions({ locale: lng === 'uk' ? uk : enUS });
});

// Set initial
document.documentElement.lang = i18n.language || 'en';
setDefaultOptions({ locale: i18n.language === 'uk' ? uk : enUS });

export default i18n;
