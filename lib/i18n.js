import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Ներմուծում ենք JSON ֆայլերը
import translationAM from '../locales/am.json';
import translationRU from '../locales/ru.json';
import translationEN from '../locales/en.json';

const resources = {
    am: { translation: translationAM },
    ru: { translation: translationRU },
    en: { translation: translationEN },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: 'am', // Կանխադրված լեզու
        fallbackLng: 'am', // Եթե ընտրված լեզուն չկա
        interpolation: {
            escapeValue: false, // React-ն արդեն պաշտպանում է XSS-ից
        },
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage', 'cookie'],
        },
    });

export default i18n;
