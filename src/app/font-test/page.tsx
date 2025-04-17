"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";

export default function FontTestPage() {
  const { language, setLanguage } = useLanguage();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [currentFontFamily, setCurrentFontFamily] = useState("");
  
  useEffect(() => {
    // Check if fonts are loaded
    if (typeof window !== 'undefined') {
      document.fonts.ready.then(() => {
        setFontLoaded(true);
        
        // Get the computed font-family of a test element
        const testElement = document.getElementById('font-test-text');
        if (testElement) {
          const computedStyle = window.getComputedStyle(testElement);
          setCurrentFontFamily(computedStyle.fontFamily);
        }
      });
    }
  }, [language]);
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ku' : 'en');
  };
  
  const resetFontCache = () => {
    // Force reload by clearing cache
    if (typeof window !== 'undefined') {
      // Clear local storage settings
      localStorage.removeItem('language');
      
      // Force reload page with cache bypass
      window.location.reload();
    }
  };
  
  const forceApplyNizarBukra = () => {
    // Apply NizarBukra font to all elements
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
    `;
    document.head.appendChild(styleElement);
    
    // Update status
    setCurrentFontFamily("'NizarBukra', sans-serif (Forced)");
  };
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Font Test Page</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Settings</h2>
        <p><strong>Language:</strong> {language}</p>
        <p><strong>Direction:</strong> {language === 'ku' ? 'RTL' : 'LTR'}</p>
        <p><strong>Fonts Loaded:</strong> {fontLoaded ? 'Yes' : 'Loading...'}</p>
        <p><strong>Current Font Family:</strong> {currentFontFamily}</p>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={toggleLanguage}
          >
            Switch to {language === 'en' ? 'Kurdish' : 'English'}
          </button>
          
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={resetFontCache}
          >
            Reset Font Cache
          </button>
          
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md"
            onClick={forceApplyNizarBukra}
          >
            Force Apply NizarBukra Font
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Font Test</h2>
          <p id="font-test-text" className="text-lg">
            This text should be displayed in the current language font.
            If Kurdish is selected, it should use NizarBukra font.
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Kurdish Sample Text</h2>
          <div className="font-sorani text-lg rtl">
            ئەمە نموونەیەکی کوردییە. ئەم دەقە دەبێت بە فۆنتی نیزار بوکرا نیشان بدرێت.
          </div>
        </div>
      </div>
    </div>
  );
} 