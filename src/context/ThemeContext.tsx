'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    
    const applyTheme = (currentTheme: Theme) => {
      let targetTheme: 'light' | 'dark';
      
      if (currentTheme === 'system') {
        const mq = typeof window !== 'undefined' && typeof window.matchMedia === 'function' 
          ? window.matchMedia('(prefers-color-scheme: dark)') 
          : null;
        targetTheme = mq?.matches ? 'dark' : 'light';
      } else {
        targetTheme = currentTheme as 'light' | 'dark';
      }

      if (targetTheme === 'dark') {
        root.classList.add('dark');
        setResolvedTheme('dark');
      } else {
        root.classList.remove('dark');
        setResolvedTheme('light');
      }
      
      localStorage.setItem('theme', currentTheme);
    };

    applyTheme(theme);

    // Listen for system theme changes if in system mode
    if (theme === 'system' && typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme('system');
        
        if (mediaQuery) {
          if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleChange);
            return () => {
              try {
                mediaQuery.removeEventListener('change', handleChange);
              } catch (e) {
                console.error('Error removing theme listener:', e);
              }
            };
          } else if (typeof (mediaQuery as any).addListener === 'function') {
            (mediaQuery as any).addListener(handleChange);
            return () => {
              try {
                (mediaQuery as any).removeListener(handleChange);
              } catch (e) {
                console.error('Error removing theme listener (legacy):', e);
              }
            };
          }
        }
      } catch (err) {
        console.error('Error in theme media query listener:', err);
      }
    }
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
