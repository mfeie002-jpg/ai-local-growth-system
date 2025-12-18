import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from './translations';

// Define a loose type for translations
type TranslationsType = typeof translations.de | typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationsType;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'itsfeierabend-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'en' || stored === 'de') {
        return stored;
      }
    }
    return 'de';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  // Sync with URL on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/en')) {
      setLanguageState('en');
      localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
    } else {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'en') {
        setLanguageState('en');
      }
    }
  }, []);

  const t = translations[language];
  const isEnglish = language === 'en';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isEnglish }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Helper to get localized path
export function getLocalizedPath(path: string, language: Language): string {
  const pathMap: Record<string, Record<Language, string>> = {
    '/': { de: '/', en: '/en' },
    '/gratis-audit': { de: '/gratis-audit', en: '/en/free-audit' },
    '/gratis-call': { de: '/gratis-call', en: '/en/free-call' },
    '/pakete': { de: '/pakete', en: '/en/pricing' },
    '/system': { de: '/system', en: '/en/system' },
    '/faq': { de: '/faq', en: '/en/faq' },
    '/datenschutz': { de: '/datenschutz', en: '/en/privacy' },
    '/impressum': { de: '/impressum', en: '/en/imprint' },
    // EN to DE mapping
    '/en': { de: '/', en: '/en' },
    '/en/free-audit': { de: '/gratis-audit', en: '/en/free-audit' },
    '/en/free-call': { de: '/gratis-call', en: '/en/free-call' },
    '/en/pricing': { de: '/pakete', en: '/en/pricing' },
    '/en/system': { de: '/system', en: '/en/system' },
    '/en/faq': { de: '/faq', en: '/en/faq' },
    '/en/privacy': { de: '/datenschutz', en: '/en/privacy' },
    '/en/imprint': { de: '/impressum', en: '/en/imprint' },
  };

  return pathMap[path]?.[language] || (language === 'en' ? `/en${path}` : path);
}

// Get current page in other language
export function getAlternateLanguagePath(currentPath: string, currentLang: Language): string {
  const targetLang = currentLang === 'de' ? 'en' : 'de';
  return getLocalizedPath(currentPath, targetLang);
}
