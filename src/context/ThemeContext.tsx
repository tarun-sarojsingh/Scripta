'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // Synchronously update DOM and state
  const applyTheme = (targetTheme: Theme) => {
    if (typeof window === 'undefined') return;

    const isDark =
      targetTheme === 'dark' ||
      (targetTheme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    const active: 'light' | 'dark' = isDark ? 'dark' : 'light';
    setResolvedTheme(active);

    const root = document.documentElement;
    if (active === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  };

  useEffect(() => {
    setMounted(true);
    let initialTheme: Theme = 'system';
    const saved = localStorage.getItem('scripta_theme') as Theme | null;
    if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
      initialTheme = saved;
    }
    setThemeState(initialTheme);
    applyTheme(initialTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const currentSaved = localStorage.getItem('scripta_theme') as Theme | null;
      if (!currentSaved || currentSaved === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    try {
      localStorage.setItem('scripta_theme', newTheme);
    } catch (e) {
      console.warn('Could not save theme preference', e);
    }
  };

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
