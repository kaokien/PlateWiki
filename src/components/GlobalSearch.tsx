'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Swords, FileText, BookOpen, Dumbbell, Target, Clock, Video, type LucideProps } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { analytics } from '@/utils/analytics';
import { getHistory, HistoryItem } from '../utils/favorites';
import './GlobalSearch.css';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  type: 'technique' | 'glossary' | 'article' | 'program' | 'exercise';
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TYPE_META: Record<
  SearchResult['type'],
  { icon: React.ComponentType<LucideProps>; label: string; viewAllHref: (q: string) => string }
> = {
  technique: {
    icon: Swords,
    label: 'Techniques',
    viewAllHref: (q) => `/foods?search=${encodeURIComponent(q)}`,
  },
  article: {
    icon: FileText,
    label: 'Articles',
    viewAllHref: () => '/articles',
  },
  glossary: {
    icon: BookOpen,
    label: 'Glossary',
    viewAllHref: () => '/glossary',
  },
  program: {
    icon: Dumbbell,
    label: 'Programs',
    viewAllHref: () => '/programs',
  },
  exercise: {
    icon: Target,
    label: 'Exercises',
    viewAllHref: (q) => `/recipes?search=${encodeURIComponent(q)}`,
  },
};

const MAX_PER_GROUP = 5;

/* ------------------------------------------------------------------ */
/*  Build the searchable corpus once — lazily.                         */
/*  The underlying data files total ~660KB of source; importing them   */
/*  statically would ship all of it in the shared bundle on every page */
/*  (this component mounts from the Header). Dynamic imports keep the  */
/*  data out of the critical path until the search modal first opens.  */
/* ------------------------------------------------------------------ */

async function buildCorpus(): Promise<SearchResult[]> {
  const [
    { techniques },
    { glossary },
    { articles },
    { programs },
    { exercises },
  ] = await Promise.all([
    import('@/data/foods'),
    import('@/data/glossary'),
    import('@/data/articles/index'),
    import('@/data/programs'),
    import('@/data/recipes'),
  ]);

  const results: SearchResult[] = [];

  // Techniques
  Object.values(techniques).forEach((t) => {
    results.push({
      id: t.id,
      title: t.name,
      subtitle: `${t.category} · ${t.difficulty}`,
      href: `/food/${t.id}`,
      type: 'technique',
    });
  });

  // Glossary
  glossary.forEach((g) => {
    results.push({
      id: `glossary-${g.term}`,
      title: g.term,
      subtitle: g.definition.substring(0, 90) + '…',
      href: `/glossary#${g.term.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'glossary',
    });
  });

  // Articles
  const todayStr = new Date().toISOString().split('T')[0];
  articles.forEach((a) => {
    if (a.date <= todayStr) {
      results.push({
        id: String(a.id),
        title: a.title,
        subtitle: `${a.category} · ${a.readTime}`,
        href: `/articles/${a.id}`,
        type: 'article',
      });
    }
  });

  // Programs
  Object.values(programs).forEach((p) => {
    results.push({
      id: p.id,
      title: p.title,
      subtitle: `${p.level} · ${p.duration}`,
      href: `/program/${p.id}`,
      type: 'program',
    });
  });

  // Exercises
  Object.values(exercises).forEach((ex: any) => {
    results.push({
      id: `exercise-${ex.id}`,
      title: ex.name,
      subtitle: `${ex.category} · ${ex.difficulty}`,
      href: `/recipe/${ex.id}`,
      type: 'exercise',
    });
  });



  return results;
}

// One corpus per session, shared across open/close cycles and instances
let corpusPromise: Promise<SearchResult[]> | null = null;
function loadCorpus(): Promise<SearchResult[]> {
  if (!corpusPromise) corpusPromise = buildCorpus();
  return corpusPromise;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const modalRef = useFocusTrap(isOpen, onClose);

  // Load the corpus when the modal first opens
  const [corpus, setCorpus] = useState<SearchResult[]>([]);
  useEffect(() => {
    if (!isOpen || corpus.length > 0) return;
    let cancelled = false;
    loadCorpus().then((c) => {
      if (!cancelled) setCorpus(c);
    });
    return () => { cancelled = true; };
  }, [isOpen, corpus.length]);

  // Filter results
  const grouped = useMemo(() => {
    if (!query.trim()) return {};
    const q = query.toLowerCase();
    const matches = corpus.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q),
    );

    const groups: Record<string, SearchResult[]> = {};
    for (const m of matches) {
      if (!groups[m.type]) groups[m.type] = [];
      groups[m.type].push(m);
    }
    return groups;
  }, [query, corpus]);

  // Flat list for keyboard nav
  const flatResults = useMemo(() => {
    const flat: SearchResult[] = [];
    const order: SearchResult['type'][] = [
      'technique',
      'exercise',
      'article',
      'glossary',
      'program',
    ];
    for (const type of order) {
      if (grouped[type]) {
        flat.push(...grouped[type].slice(0, MAX_PER_GROUP));
      }
    }
    return flat;
  }, [grouped]);

  const totalResults = useMemo(
    () =>
      Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0),
    [grouped],
  );

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setRecentHistory(getHistory().slice(0, 5));
      // Delay focus to allow animation
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Debounced analytics
  useEffect(() => {
    if (!query.trim()) return;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      analytics.searchQuery(query, totalResults);
    }, 800);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [query, totalResults]);

  // Navigate to result
  const navigateTo = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) =>
            i < flatResults.length - 1 ? i + 1 : 0,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) =>
            i > 0 ? i - 1 : flatResults.length - 1,
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (flatResults[selectedIndex]) {
            navigateTo(flatResults[selectedIndex].href);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [flatResults, selectedIndex, navigateTo, onClose],
  );

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected into view
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector(
      '.gs-result-item.selected',
    );
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  let flatIdx = 0;
  const order: SearchResult['type'][] = [
    'technique',
    'exercise',
    'article',
    'glossary',
    'program',
  ];

  return (
    <div className="gs-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Search PlateWiki">
      <div
        ref={modalRef}
        className="gs-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="gs-input-row">
          <Search size={20} className="gs-input-icon" />
          <input
            ref={inputRef}
            type="text"
            className="gs-input"
            placeholder="Search techniques, articles, glossary…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              className="gs-clear-btn"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="gs-kbd" onClick={onClose}>
            ESC
          </kbd>
          <button
            className="gs-close-btn"
            onClick={onClose}
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="gs-results" ref={listRef}>
          {!query.trim() ? (
            <div className="gs-hint">
              {recentHistory.length > 0 ? (
                <>
                  <p className="gs-recent-label">Recently Viewed</p>
                  <ul className="gs-recent-list">
                    {recentHistory.map((item, i) => (
                      <li key={`${item.href}-${i}`}>
                        <button
                          className="gs-recent-item"
                          onClick={() => {
                            router.push(item.href);
                            onClose();
                          }}
                        >
                          <Clock size={14} className="gs-recent-icon" />
                          <span className="gs-recent-title">{item.title}</span>
                          <span className="gs-recent-type">{item.type}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Start typing to search across all content</p>
              )}
              <div className="gs-hint-shortcuts gs-hint-shortcuts--desktop">
                <span><kbd>↑↓</kbd> Navigate</span>
                <span><kbd>↵</kbd> Open</span>
                <span><kbd>esc</kbd> Close</span>
              </div>
              <div className="gs-hint-shortcuts gs-hint-shortcuts--mobile">
                <span>Tap a result to open</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="gs-empty">
              <span className="gs-empty-icon">🥊</span>
              <p>No results for &quot;{query}&quot;</p>
              <p className="gs-empty-sub">
                Try a different term or browse{' '}
                <button
                  className="gs-inline-link"
                  onClick={() => navigateTo('/foods')}
                >
                  All Techniques
                </button>
              </p>
            </div>
          ) : (
            <>
              {order.map((type) => {
                const items = grouped[type];
                if (!items || items.length === 0) return null;
                const meta = TYPE_META[type];
                const displayed = items.slice(0, MAX_PER_GROUP);

                return (
                  <div className="gs-group" key={type}>
                    <div className="gs-group-header">
                      <meta.icon className="gs-group-icon" size={16} />
                      <span className="gs-group-label">{meta.label}</span>
                      <span className="gs-group-count">
                        {items.length}
                      </span>
                    </div>
                    {displayed.map((r) => {
                      const idx = flatIdx++;
                      return (
                        <button
                          key={r.id}
                          className={`gs-result-item ${
                            idx === selectedIndex ? 'selected' : ''
                          }`}
                          onClick={() => navigateTo(r.href)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          role="option"
                          aria-selected={idx === selectedIndex}
                        >
                          <div className="gs-result-text">
                            <span className="gs-result-title">
                              {highlightMatch(r.title, query)}
                            </span>
                            <span className="gs-result-subtitle">
                              {r.subtitle}
                            </span>
                          </div>
                          <ArrowRight
                            size={14}
                            className="gs-result-arrow"
                          />
                        </button>
                      );
                    })}
                    {items.length > MAX_PER_GROUP && (
                      <button
                        className="gs-view-all"
                        onClick={() =>
                          navigateTo(meta.viewAllHref(query))
                        }
                      >
                        View all {items.length} {meta.label.toLowerCase()}{' '}
                        →
                      </button>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Highlight helper                                                   */
/* ------------------------------------------------------------------ */

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="gs-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}
