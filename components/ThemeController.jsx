'use client';

import { useEffect } from 'react';
import { currentTheme, THEME_COLOR } from '@/lib/theme';

// Keeps <html>'s `dark` class and the theme-color meta in sync with the
// time of day. The initial value is set by an inline script in the layout to
// avoid a flash; this just keeps it fresh while the app stays open.
export default function ThemeController() {
  useEffect(() => {
    const apply = () => {
      const theme = currentTheme();
      const root = document.documentElement;
      root.classList.toggle('dark', theme === 'dark');
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', THEME_COLOR[theme]);
      window.dispatchEvent(new CustomEvent('santes:themechange', { detail: theme }));
    };
    apply();
    const id = setInterval(apply, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return null;
}
