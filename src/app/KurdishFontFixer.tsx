'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Component to dynamically apply Kurdish fonts after React hydration
 * This helps fix cases where the font doesn't get applied by CSS alone
 */
export default function KurdishFontFixer() {
  const { language } = useLanguage();

  useEffect(() => {
    if (language === 'ku') {
      // Apply Kurdish font to all text elements
      console.log('Applying Kurdish font fix');
      
      // Inject a style tag with !important directives
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @font-face {
          font-family: 'NizarBukra';
          src: url('/fonts/NizarBukraRegular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'NizarBukra';
          src: url('/fonts/NizarBukraBold.woff2') format('woff2');
          font-weight: bold;
          font-style: normal;
          font-display: swap;
        }
        
        /* Override font for all elements when Kurdish is active */
        html[dir="rtl"] * {
          font-family: 'NizarBukra', sans-serif !important;
        }
        
        /* Force elements in document body to use Kurdish font */
        html[dir="rtl"] p,
        html[dir="rtl"] a,
        html[dir="rtl"] span,
        html[dir="rtl"] button,
        html[dir="rtl"] div,
        html[dir="rtl"] h1,
        html[dir="rtl"] h2,
        html[dir="rtl"] h3,
        html[dir="rtl"] h4,
        html[dir="rtl"] h5,
        html[dir="rtl"] h6,
        html[dir="rtl"] li,
        html[dir="rtl"] input,
        html[dir="rtl"] textarea {
          font-family: 'NizarBukra', sans-serif !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Apply force reflow of all text elements
      const elements = document.querySelectorAll('p, span, h1, h2, h3, button, a');
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.classList.add('font-sorani');
          
          // Force a reflow
          const display = el.style.display;
          el.style.display = 'none';
          el.offsetHeight; // Trigger reflow
          el.style.display = display;
        }
      });
    }
  }, [language]);

  return null; // No visible output
} 