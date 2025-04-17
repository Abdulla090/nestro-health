"use client";

import { useEffect } from 'react';

export default function FontLoader() {
  useEffect(() => {
    // Force all HTML elements to use NizarBukra
    const forceNizarBukraOnAllElements = () => {
      // Get all elements in the document
      const allElements = document.querySelectorAll('*');
      
      // Set font-family on each element regardless of direction
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          try {
            el.style.fontFamily = "'NizarBukra', sans-serif";
          } catch (e) {
            // Some elements may not support style changes
          }
        }
      });
    };
    
    // Create a font loader
    const loadFonts = async () => {
      try {
        // Force load NizarBukra font - only use TTF format which is working
        const fontFace = new FontFace(
          'NizarBukra',
          `url('/fonts/NizarBukraRegular.ttf') format('truetype')`
        );
        
        // Add font to document fonts and load it
        const loadedFont = await fontFace.load();
        document.fonts.add(loadedFont);
        
        console.log('NizarBukra font loaded successfully');
        
        // Apply the font to the entire document
        document.documentElement.style.fontFamily = "'NizarBukra', sans-serif";
        
        // Add an important style to override any other styles with higher specificity
        const style = document.createElement('style');
        style.textContent = `
          @font-face {
            font-family: 'NizarBukra';
            src: url('/fonts/NizarBukraRegular.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: block;
          }
          
          /* No longer using the problematic woff2 format that's causing 404 errors */
          /* @font-face {
            font-family: 'NizarBukra';
            src: url('/fonts/NizarBukraBold.woff2') format('woff2');
            font-weight: bold;
            font-style: normal;
            font-display: block;
          } */
          
          html, body, * {
            font-family: 'NizarBukra', sans-serif !important;
          }
          
          html[dir="rtl"] * {
            font-family: 'NizarBukra', sans-serif !important;
          }

          /* Specific element overrides */
          p, span, div, a, button, input, textarea, select, label, h1, h2, h3, h4, h5, h6, li {
            font-family: 'NizarBukra', sans-serif !important;
          }
        `;
        document.head.appendChild(style);
        
        // Force NizarBukra on all elements
        forceNizarBukraOnAllElements();
        
        // Set up a MutationObserver to enforce font on newly added elements
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              forceNizarBukraOnAllElements();
            }
          });
        });
        
        // Start observing
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      } catch (error) {
        console.error('Failed to load NizarBukra font:', error);
        
        // Fallback - add a style tag directly if FontFace API fails
        try {
          const fallbackStyle = document.createElement('style');
          fallbackStyle.textContent = `
            @font-face {
              font-family: 'NizarBukra';
              src: url('/fonts/NizarBukraRegular.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: block;
            }
            
            html, body, * {
              font-family: 'NizarBukra', sans-serif !important;
            }
          `;
          document.head.appendChild(fallbackStyle);
        } catch (e) {
          console.error('Font fallback failed:', e);
        }
      }
    };
    
    loadFonts();
    
    // Run this on multiple delays to catch any elements loaded after initial render
    setTimeout(forceNizarBukraOnAllElements, 500);
    setTimeout(forceNizarBukraOnAllElements, 1500);
    setTimeout(forceNizarBukraOnAllElements, 3000);
  }, []);
  
  return null; // This component doesn't render anything
} 