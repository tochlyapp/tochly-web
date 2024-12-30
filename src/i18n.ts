import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next  } from "react-i18next";

import translationGr from 'src/locales/gr/translation.json';
import translationIT from 'src/locales/it/translation.json';
import translationSP from 'src/locales/sp/translation.json';
import translationRS from 'src/locales/rs/translation.json';
import translationENG from 'src/locales/en/translation.json';

//translations
const resources = {
    gr: {
        translation: translationGr
    },
    it: {
        translation: translationIT
    },
    sp: {
        translation: translationSP
    },
    rs: {
        translation: translationRS
    },
    eng: {
        translation: translationENG
    }
};

i18n
    .use(detector)
    .use(initReactI18next ) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "en",
        fallbackLng: "en", // use en if detected lng is not available

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
        escapeValue: false // react already safes from xss
        }
    });

export default i18n;