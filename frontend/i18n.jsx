import React from "react";
import { createRoot } from 'react-dom/client';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    
    fallbackLng: "en",
    detection: {
        order: [  'cookie', 'htmlTag','localStorage', 'sessionStorage', 'navigator',  'path', 'subdomain'],
        caches: ["cookie"],
    },
    backend:
    {
        loadPath: '/public/locale/{{lng}}/translation.json'
    },
  });

function App() {
  const { t } = useTranslation();

  return <h2>{t('Welcome to React')}</h2>;
}

// append app to dom
const root = createRoot(document.getElementById('root'));
root.render(
  <App />
);