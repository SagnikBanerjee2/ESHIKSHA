import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // 1. Load from LocalStorage or default to English
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'en';
  });

  // 2. Persist selection to LocalStorage
  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  // 3. Translation Helper
  const t = (contentObj) => {
    if (!contentObj) return "";
    // Returns translation for current language, or falls back to English
    return contentObj[language] || contentObj['en'] || "";
  };

  return (
    /* 🔹 CHANGE: Exposing 'setLanguage' instead of 'toggleLanguage' */
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);