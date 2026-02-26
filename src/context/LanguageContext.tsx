'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { en } from '@/locales/en';
import { es } from '@/locales/es';
import { fr } from '@/locales/fr';
import { de } from '@/locales/de';
import { zh } from '@/locales/zh';
import { ar } from '@/locales/ar';

type Locale = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ar';
type Translations = typeof en;

const translations = { en, es, fr, de, zh, ar };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLocale }: { children: ReactNode, initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale || 'en');
  const [mounted, setMounted] = useState(false);

  // Sync with prop if it changes and save to localStorage
  useEffect(() => {
    if (initialLocale) {
      setLocale(initialLocale);
      localStorage.setItem('language', initialLocale);
    }
  }, [initialLocale]);

  // Load from local storage if available and no initialLocale provided
  useEffect(() => {
    if (!initialLocale) {
      const saved = localStorage.getItem('language') as Locale;
      if (saved && translations[saved]) {
        setLocale(saved);
      }
    }
    setMounted(true);
  }, [initialLocale]);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('language', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t: translations[locale] || translations.en }}>
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