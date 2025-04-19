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
        // Load only the regular font which is working
        const regularFont = new FontFace(
          'NizarBukra',
          `url('/fonts/NizarBukraRegular.ttf') format('truetype')`
        );
        
        // Add font to document fonts and load it
        const loadedRegularFont = await regularFont.load();
        document.fonts.add(loadedRegularFont);
        
        console.log('NizarBukra font loaded successfully');
        
        // Apply the font to the entire document
        document.documentElement.style.fontFamily = "'NizarBukra', sans-serif";
        
        // Add font-face definitions and global styles
        const style = document.createElement('style');
        style.textContent = `
          @font-face {
            font-family: 'NizarBukra';
            src: url('/fonts/NizarBukraRegular.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          
          /* Use the same regular font for bold text to avoid loading errors */
          @font-face {
            font-family: 'NizarBukra';
            src: url('/fonts/NizarBukraRegular.ttf') format('truetype');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
          }
          
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
              font-display: swap;
            }
            
            /* Also define bold weight using the regular font */
            @font-face {
              font-family: 'NizarBukra';
              src: url('/fonts/NizarBukraRegular.ttf') format('truetype');
              font-weight: bold;
              font-style: normal;
              font-display: swap;
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
    
    // Load fonts after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      loadFonts();
    }, 100);
    
    // Run this on multiple delays to catch any elements loaded after initial render
    const timeoutIds = [
      setTimeout(forceNizarBukraOnAllElements, 500),
      setTimeout(forceNizarBukraOnAllElements, 1500),
      setTimeout(forceNizarBukraOnAllElements, 3000)
    ];
    
    // Clean up timeouts on unmount
    return () => {
      clearTimeout(timeoutId);
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);
  
  return null; // This component doesn't render anything
} 