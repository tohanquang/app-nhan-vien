import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationVI from "./vi.json";
import translationEN from "./en.json";

const resources = {
  vi: { translation: translationVI },
  en: { translation: translationEN },
};

const savedLanguage = localStorage.getItem("app_language") || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
