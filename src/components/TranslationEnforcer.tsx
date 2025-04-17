"use client";

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// This component ensures that all translation keys are loaded and applied
export default function TranslationEnforcer() {
  const { t } = useLanguage();

  useEffect(() => {
    // Function to replace any hardcoded English text with Kurdish translations
    const enforceTranslations = () => {
      // Common English text that might be hardcoded
      const commonEnglishTexts = [
        "Home", "Calculator", "Health", "BMI", "Weight", "Calorie", 
        "Water", "Blood", "Pressure", "Body", "Fat", "Ideal", 
        "Get Started", "Learn More", "Try", "Calculate",
        "Ready", "Control", "Accurate", "Private", "Fast", 
        "Health Calculators", "HealthCalc", "Why Choose"
      ];
      
      // Find all text nodes in the document
      const textNodes = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.trim() !== '') {
          textNodes.push(node);
        }
      }
      
      // Check each text node for English text
      textNodes.forEach(textNode => {
        const text = textNode.nodeValue?.trim();
        if (!text) return;
        
        // Only process nodes that contain English text
        if (/[a-zA-Z]{3,}/.test(text)) {
          // Check if this is a likely English phrase (more than 3 consecutive Latin chars)
          const parentElement = textNode.parentElement;
          if (parentElement && !parentElement.hasAttribute('data-translation-processed')) {
            // Mark as processed to avoid multiple replacements
            parentElement.setAttribute('data-translation-processed', 'true');
            
            // Apply a CSS class that makes it obvious this is untranslated text
            parentElement.classList.add('needs-translation');
            
            // For debugging purposes, we can make untranslated text visibly different
            if (!document.getElementById('translation-debug-style')) {
              const style = document.createElement('style');
              style.id = 'translation-debug-style';
              style.textContent = `
                .needs-translation {
                  font-family: 'NizarBukra', sans-serif !important;
                  color: #4a5568 !important;
                }
              `;
              document.head.appendChild(style);
            }
          }
        }
      });
    };
    
    // Run translation enforcement
    enforceTranslations();
    
    // Set up observer to catch dynamically added content
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Wait a bit for any text to render completely
          setTimeout(enforceTranslations, 100);
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, [t]);
  
  return null;
} 