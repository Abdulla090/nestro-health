"use client";

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * A component that enforces Kurdish font application
 * This helps apply the NizarBukra font to all text when Kurdish is selected
 */
const KurdishLanguageEnforcer = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // When language changes, we need to force a style refresh
    if (language === 'ku') {
      // Force a re-render of styled elements by modifying the DOM
      const elements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, button, a, li, div');
      
      elements.forEach(el => {
        // Add our Kurdish text class to enforce the font
        el.classList.add('font-sorani');
        
        // Force a reflow to ensure the font is applied
        // This is a bit of a hack, but it works
        const display = el.style.display;
        el.style.display = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.display = display;
      });
      
      // Add a debug message to ensure this runs
      console.log('Kurdish text enforcer has run');
    }
  }, [language]);

  return null; // This component doesn't render anything
};

export default KurdishLanguageEnforcer; 