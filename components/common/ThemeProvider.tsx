'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULT_THEME } from '@/lib/theme';

export function applyThemeToDOM(t: typeof DEFAULT_THEME) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  const primary = t.primaryColor || '#008F5A';
  const secondary = t.secondaryColor || '#006B45';
  const navy = t.navyColor || '#071B2B';
  const accent = t.accentColor || '#059669';

  root.style.setProperty('--emerald-brand', primary);
  root.style.setProperty('--emerald-hover', secondary);
  root.style.setProperty('--deep-green', secondary);
  root.style.setProperty('--primary-navy', navy);
  root.style.setProperty('--secondary-navy', navy);
  root.style.setProperty('--accent-color', accent);
  root.style.setProperty('--card-radius', t.borderRadius || '14px');
  root.style.setProperty('--hero-height', t.heroHeight || '460px');
  root.style.setProperty('--side-card-height', t.sideCardHeight || '85px');
  root.style.setProperty('--insights-img-height', t.insightsCardImageHeight || '180px');
  root.style.setProperty('--market-widget-height', t.marketWidgetHeight || '404px');

  if (t.backgroundColor) {
    root.style.setProperty('--bg-page', t.backgroundColor);
    if (document.body) {
      document.body.style.backgroundColor = t.backgroundColor;
    }
  }
}

interface ThemeContextType {
  theme: typeof DEFAULT_THEME;
  loading: boolean;
  updateThemeLocally: (t: typeof DEFAULT_THEME) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
  loading: true,
  updateThemeLocally: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<typeof DEFAULT_THEME>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('nesture_theme');
        if (cached) {
          const parsed = JSON.parse(cached);
          applyThemeToDOM(parsed);
          return { ...DEFAULT_THEME, ...parsed };
        }
      } catch {}
    }
    return DEFAULT_THEME;
  });

  const [loading, setLoading] = useState(false);

  const updateThemeLocally = useCallback((newTheme: typeof DEFAULT_THEME) => {
    setTheme(newTheme);
    applyThemeToDOM(newTheme);
    try {
      localStorage.setItem('nesture_theme', JSON.stringify(newTheme));
    } catch {}
  }, []);

  useEffect(() => {
    // 1. Fetch live theme from database API
    fetch('/api/theme')
      .then((res) => res.json())
      .then((data) => {
        if (data?.theme) {
          setTheme(data.theme);
          applyThemeToDOM(data.theme);
          try {
            localStorage.setItem('nesture_theme', JSON.stringify(data.theme));
          } catch {}
        }
      })
      .catch(() => {});

    // 2. Multi-tab and intra-window live sync listener
    const handleSync = (e: any) => {
      try {
        const raw = e?.detail || localStorage.getItem('nesture_theme');
        if (raw) {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          setTheme(parsed);
          applyThemeToDOM(parsed);
        }
      } catch {}
    };

    window.addEventListener('nesture_theme_change', handleSync);
    window.addEventListener('storage', handleSync);

    // 3. BroadcastChannel for instant cross-tab sync
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('nesture_theme_channel');
      bc.onmessage = (event) => {
        if (event.data) {
          setTheme(event.data);
          applyThemeToDOM(event.data);
        }
      };
    } catch {}

    return () => {
      window.removeEventListener('nesture_theme_change', handleSync);
      window.removeEventListener('storage', handleSync);
      if (bc) {
        try {
          bc.close();
        } catch {}
      }
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, loading, updateThemeLocally }}>
      {children}
    </ThemeContext.Provider>
  );
}
