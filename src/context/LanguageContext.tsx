'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { en } from '@/locales/en';
import { es } from '@/locales/es';
import { fr } from '@/locales/fr';

type Locale = 'en' | 'es' | 'fr';
type Translations = typeof en;

const translations = { en, es, fr };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLocale }: { children: ReactNode, initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale || 'en');
  const [mounted, setMounted] = useState(false);

  // Sync with prop if it changes
  useEffect(() => {
    if (initialLocale) {
      setLocale(initialLocale);
    }
  }, [initialLocale]);

  // Load from local storage if available and no initialLocale provided
  useEffect(() => {
    if (!initialLocale) {
      const saved = localStorage.getItem('language') as Locale;
      if (saved && (saved === 'en' || saved === 'es' || saved === 'fr')) {
        setLocale(saved);
      }
    }
    setMounted(true);
  }, [initialLocale]);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('language', newLocale);
  };

  // Prevent hydration mismatch by rendering children only after mount or ensuring default locale consistency
  // However, simple text replacement usually works fine with standard client components.
  // Using 'key' prop on providers can force re-render if needed, but Context updates should trigger re-renders automatically.

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t: translations[locale] }}>
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