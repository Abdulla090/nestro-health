"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enTranslations from '@/locales/en.json';
import kuTranslations from '@/locales/ku.json';

type LanguageContextType = {
  language: string;
  translations: any;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const translations = {
  en: enTranslations,
  ku: kuTranslations,
};

// Always use Kurdish as the default language
const defaultLanguage = 'ku';

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  translations: translations[defaultLanguage],
  setLanguage: () => {},
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

// Function to force NizarBukra font on all elements
const forceNizarBukraFont = () => {
  // Apply to document root
  document.documentElement.style.fontFamily = "'NizarBukra', sans-serif";
  
  // Apply to all elements
  const allElements = document.querySelectorAll('*');
  allElements.forEach(el => {
    (el as HTMLElement).style.fontFamily = "'NizarBukra', sans-serif";
  });
  
  // Create stylesheet with high priority
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @font-face {
      font-family: 'NizarBukra';
      src: url('/fonts/NizarBukraRegular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: block;
    }
    
    html[dir="rtl"] * {
      font-family: 'NizarBukra', sans-serif !important;
    }
    
    html[dir="rtl"] body * {
      font-family: 'NizarBukra', sans-serif !important;
    }
    
    /* Target specific elements */
    html[dir="rtl"] p,
    html[dir="rtl"] button,
    html[dir="rtl"] span,
    html[dir="rtl"] div,
    html[dir="rtl"] a,
    html[dir="rtl"] h1,
    html[dir="rtl"] h2,
    html[dir="rtl"] h3,
    html[dir="rtl"] h4,
    html[dir="rtl"] h5,
    html[dir="rtl"] h6 {
      font-family: 'NizarBukra', sans-serif !important;
    }
  `;
  document.head.appendChild(styleElement);
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Always initialize with Kurdish
  const [language, setLanguage] = useState(defaultLanguage);
  const [currentTranslations, setCurrentTranslations] = useState(translations[defaultLanguage]);

  useEffect(() => {
    // Always set Kurdish (ignore any saved preferences)
    setLanguage(defaultLanguage);
    setCurrentTranslations(translations[defaultLanguage]);
    
    // Apply Kurdish RTL and font settings
    document.documentElement.dir = 'rtl';
    document.documentElement.classList.add('font-sorani');
    document.documentElement.setAttribute('lang', defaultLanguage);
    forceNizarBukraFont();
    
    // Apply font again after delays to catch any late-loaded elements
    setTimeout(forceNizarBukraFont, 500);
    setTimeout(forceNizarBukraFont, 1500);
    setTimeout(forceNizarBukraFont, 3000);
  }, []);

  const handleSetLanguage = (lang: string) => {
    // If trying to set English, override to Kurdish
    const actualLang = 'ku'; // Always use Kurdish
    
    setLanguage(actualLang);
    setCurrentTranslations(translations[actualLang]);
    
    // Always use Kurdish settings
    document.documentElement.dir = 'rtl';
    document.documentElement.classList.add('font-sorani');
    document.documentElement.setAttribute('lang', actualLang);
    forceNizarBukraFont();
    
    // Apply font again to ensure it's applied to all elements
    setTimeout(forceNizarBukraFont, 300);
    setTimeout(forceNizarBukraFont, 1000);
  };

  // Helper function to get nested translations using dot notation
  const t = (key: string): string => {
    const keys = key.split('.');
    let result = currentTranslations;

    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key; // Return the key if translation not found
      }
    }

    return result as string;
  };

  return (
    <LanguageContext.Provider value={{ language, translations: currentTranslations, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext; 