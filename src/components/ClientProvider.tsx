'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import KurdishLanguageEnforcer from './KurdishLanguageEnforcer';
import { Toaster } from 'react-hot-toast';

/**
 * Client provider component to handle all client-side functionality
 * This wrapper handles document changes that require 'use client'
 */
export default function ClientProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { t, language } = useLanguage();
  
  useEffect(() => {
    if (language === 'ku') {
      // Force document direction and language
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ku';
      document.documentElement.classList.add('font-sorani');
      
      // Create a global script to inject into all page transitions
      const globalScript = document.createElement('script');
      globalScript.textContent = `
        // Enforce Kurdish font and RTL direction on all elements
        function enforceKurdishSettings() {
          document.documentElement.dir = 'rtl';
          document.documentElement.lang = 'ku';
          document.documentElement.classList.add('font-sorani');
          
          // Apply NizarBukra font directly to all elements
          const allElements = document.querySelectorAll('*');
          allElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.fontFamily = "'NizarBukra', sans-serif";
            }
          });
        }
        
        // Run immediately and on any navigation
        enforceKurdishSettings();
        document.addEventListener('DOMContentLoaded', enforceKurdishSettings);
        window.addEventListener('popstate', enforceKurdishSettings);
      `;
      document.head.appendChild(globalScript);
    } else {
      // For English language
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
      document.documentElement.classList.remove('font-sorani');
    }
    
    // Update document title to use Nestro Health
    document.title = `Nestro Health - ${t('common.appTagline')}`;
  }, [t, language]);
  
  return (
    <>
      <KurdishLanguageEnforcer />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            fontFamily: language === 'ku' ? "'NizarBukra', sans-serif" : 'inherit',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: '#fff',
            },
          },
          error: {
            duration: 3000,
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          },
        }}
      />
      {children}
    </>
  );
} 