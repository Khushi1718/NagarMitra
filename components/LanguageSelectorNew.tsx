'use client';

import { useEffect, useState } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

interface LanguageSelectorProps {
  onLanguageChange?: (language: Language) => void;
}

const LANGUAGE_STORAGE_KEY = 'nagar-mitra-language';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
  }
}

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved) {
        const savedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === saved);
        if (savedLang) return savedLang;
      }
    }
    return SUPPORTED_LANGUAGES[0];
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslateReady, setIsTranslateReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const loadGoogleTranslate = async () => {
      try {
        // Check if Google Translate is already loaded
        if (window.google?.translate?.TranslateElement) {
          if (mounted) {
            initializeTranslateWidget();
          }
          return;
        }

        // Check if script already exists
        const existingScript = document.querySelector('script[src*="translate.google.com"]');
        if (existingScript) {
          // Wait for it to load
          const checkInterval = setInterval(() => {
            if (window.google?.translate?.TranslateElement) {
              clearInterval(checkInterval);
              if (mounted) {
                initializeTranslateWidget();
              }
            }
          }, 100);
          
          // Timeout after 5 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            if (mounted) {
              setIsLoading(false);
            }
          }, 5000);
          return;
        }

        // Load the Google Translate script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        
        // Set up the callback
        window.googleTranslateElementInit = () => {
          if (mounted) {
            initializeTranslateWidget();
          }
        };

        script.onerror = () => {
          console.error('Failed to load Google Translate');
          if (mounted) {
            setIsLoading(false);
          }
        };

        document.head.appendChild(script);
        
      } catch (error) {
        console.error('Error loading Google Translate:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const initializeTranslateWidget = () => {
      try {
        console.log('Initializing Google Translate widget');
        
        // Clear any existing widget
        const container = document.getElementById('google_translate_element');
        if (container) {
          container.innerHTML = '';
        }

        // Create new widget
        if (window.google?.translate?.TranslateElement) {
          console.log('Creating Google Translate Element');
          
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: SUPPORTED_LANGUAGES.map(lang => lang.code).join(','),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          }, 'google_translate_element');

          // Wait for widget to be ready
          setTimeout(() => {
            if (mounted) {
              console.log('Google Translate widget ready');
              setIsTranslateReady(true);
              setIsLoading(false);
              
              // Check if we can find the select element
              const selectEl = document.querySelector('.goog-te-combo');
              console.log('Google Translate select element found:', !!selectEl);
              
              // Apply saved language if not English
              if (selectedLanguage.code !== 'en') {
                console.log('Applying saved language:', selectedLanguage.code);
                setTimeout(() => changeLanguage(selectedLanguage.code), 500);
              }
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Error initializing Google Translate widget:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadGoogleTranslate();

    return () => {
      mounted = false;
    };
  }, [selectedLanguage.code]);

  const changeLanguage = (languageCode: string) => {
    console.log('Attempting to change language to:', languageCode);
    
    // Find and trigger the Google Translate dropdown
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      console.log('Found Google Translate select element');
      console.log('Available options:', Array.from(selectElement.options).map(o => o.value));
      
      // Set the value
      selectElement.value = languageCode;
      
      // Trigger change event
      const event = new Event('change', { bubbles: true });
      selectElement.dispatchEvent(event);
      
      console.log('Translation triggered for:', languageCode);
      return true;
    } else {
      console.log('Google Translate select element not found');
      
      // Try alternative selectors
      const altSelector = document.querySelector('select[class*="goog-te"]') as HTMLSelectElement;
      if (altSelector) {
        console.log('Found alternative Google Translate selector');
        altSelector.value = languageCode;
        altSelector.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
    }
    return false;
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language.code);
    onLanguageChange?.(language);

    if (language.code === 'en') {
      // Reset to original English - reload page
      window.location.reload();
    } else if (isTranslateReady) {
      // Try to change language immediately
      if (!changeLanguage(language.code)) {
        // If immediate change fails, try with delays
        setTimeout(() => {
          if (!changeLanguage(language.code)) {
            setTimeout(() => changeLanguage(language.code), 1000);
          }
        }, 500);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm">Language</span>
        <select 
          value={selectedLanguage.code}
          onChange={(e) => {
            const language = SUPPORTED_LANGUAGES.find(lang => lang.code === e.target.value);
            if (language) {
              handleLanguageChange(language);
            }
          }}
          className="text-sm bg-background border border-border rounded px-2 py-1 min-w-[120px] focus:outline-none focus:ring-1 focus:ring-ring"
          disabled={isLoading}
        >
          {SUPPORTED_LANGUAGES.map((language) => (
            <option key={language.code} value={language.code}>
              {language.nativeName}
            </option>
          ))}
        </select>
      </div>
      
      {/* Google Translate Element - positioned off-screen */}
      <div 
        id="google_translate_element" 
        style={{ 
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          visibility: 'hidden',
          height: '1px',
          overflow: 'hidden'
        }}
      ></div>
      
      {isLoading && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <div className="w-3 h-3 border border-border border-t-primary rounded-full animate-spin"></div>
          Initializing translator...
        </div>
      )}

      {!isLoading && !isTranslateReady && (
        <div className="text-xs text-red-500">
          Translation service unavailable
        </div>
      )}

      {isTranslateReady && selectedLanguage.code !== 'en' && (
        <div className="text-xs text-green-600 dark:text-green-400">
          ✓ Page translated to {selectedLanguage.nativeName}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;