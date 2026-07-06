'use client';
import React, { useState, useEffect, useCallback } from 'react';

const SECTIONS = [
  { id: 'body-map', label: 'Body Map' },
  { id: 'categories', label: 'Techniques' },
  { id: 'beginner', label: 'Program' },
  { id: 'community', label: 'Community' },
  { id: 'gear', label: 'Gear' },
  { id: 'faq', label: 'FAQ' },
];

const DesktopSectionNav = () => {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // Show nav after scrolling past hero
    const heroEl = document.querySelector('.hero-content');
    if (!heroEl) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-56px 0px 0px 0px' }
    );
    heroObserver.observe(heroEl);

    // Track active section
    const sectionEls = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    );
    sectionEls.forEach(el => sectionObserver.observe(el));

    return () => {
      heroObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <nav className={`desktop-section-nav ${visible ? 'visible' : ''}`} aria-label="Page sections">
      {SECTIONS.map(s => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={activeId === s.id ? 'active' : ''}
          onClick={(e) => handleClick(e, s.id)}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
};

export default DesktopSectionNav;
