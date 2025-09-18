'use client';

import { useEffect, useState } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const LANGUAGE_STORAGE_KEY = 'nagar-mitra-language';

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const translatePage = (languageCode: string) => {
    setIsTranslating(true);
    
    const translate = () => {
      const googleCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (googleCombo) {
        googleCombo.value = languageCode;
        googleCombo.dispatchEvent(new Event('change', { bubbles: true }));
        setCurrentLanguage(languageCode);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
        setIsTranslating(false);
        return true;
      }
      return false;
    };

    // Try immediately, then with delays if needed
    if (!translate()) {
      setTimeout(() => {
        if (!translate()) {
          setTimeout(translate, 1000);
        }
      }, 500);
    }
  };

  const resetToOriginal = () => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    window.location.reload();
  };

  return {
    currentLanguage,
    isTranslating,
    translatePage,
    resetToOriginal
  };
}