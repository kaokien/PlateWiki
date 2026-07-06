'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const STORAGE_KEY = 'foodwiki_theme';

const updateThemeColorMeta = (theme: 'dark' | 'light') => {
  if (typeof document === 'undefined') return;
  const existing = document.querySelectorAll('meta[name="theme-color"]');
  existing.forEach(el => el.remove());

  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  meta.content = theme === 'light' ? '#faf8f4' : '#141a16';
  document.head.appendChild(meta);
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark') {
      setTheme('dark');
      document.documentElement.dataset.theme = 'dark';
      updateThemeColorMeta('dark');
    } else {
      setTheme('light');
      document.documentElement.removeAttribute('data-theme');
      updateThemeColorMeta('light');
    }
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.dataset.theme = 'dark';
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, next);
    updateThemeColorMeta(next);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="theme-toggle"
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}

