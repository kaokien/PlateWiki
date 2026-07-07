'use client';
import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Search, BookOpen, ChevronRight, Hash, X } from 'lucide-react';
import { glossary, toSlug, getGlossaryLetters, getGlossaryCategories } from '../data/glossary';
import './GlossaryPage.css';

const GlossaryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const letters = useMemo(() => getGlossaryLetters(), []);
  const categories = useMemo(() => getGlossaryCategories(), []);

  const filteredTerms = useMemo(() => {
    let result = [...glossary];
    if (activeCategory !== 'All') {
      result = result.filter(g => g.category === activeCategory);
    }
    if (activeLetter) {
      result = result.filter(g => g.term.charAt(0).toUpperCase() === activeLetter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g =>
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, activeCategory, activeLetter]);

  // Group by first letter
  const grouped = useMemo(() => {
    const groups: Record<string, typeof filteredTerms> = {};
    filteredTerms.forEach(term => {
      const letter = term.term.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter === activeLetter ? null : letter);
    if (sectionRefs.current[letter]) {
      sectionRefs.current[letter].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setActiveLetter(null);
  };

  const hasActiveFilters = searchQuery || activeCategory !== 'All' || activeLetter;

  return (
    <div className="glossary-page">
{/* Header */}
      <section className="glossary-hero">
        <div className="glossary-hero__content">
          <span className="glossary-hero__label"><BookOpen size={14} /> Reference</span>
          <h1>NUTRITION <span className="text-primary">GLOSSARY</span></h1>
          <p>The A-Z dictionary of sports nutrition terminology. {glossary.length} terms covering macronutrients, gut microbiome health, muscle target fueling, and metabolic physiology.</p>
        </div>
      </section>

      {/* A-Z Jump Navigation */}
      <nav className="glossary-alpha-nav" aria-label="Alphabetical navigation">
        {letters.map(letter => (
          <button
            key={letter}
            className={`alpha-btn ${activeLetter === letter ? 'active' : ''}`}
            onClick={() => scrollToLetter(letter)}
            aria-label={`Jump to ${letter}`}
          >
            {letter}
          </button>
        ))}
      </nav>

      {/* Search & Category Filter */}
      <section className="glossary-controls">
        <div className="glossary-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            id="glossary-search"
            aria-label="Search glossary terms"
          />
          {searchQuery && (
            <button className="glossary-search__clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="glossary-category-row">
          {categories.map(cat => (
            <button
              key={cat}
              className={`glossary-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Results count */}
      <div className="glossary-results-bar">
        <span>{filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''}</span>
        {hasActiveFilters && (
          <button className="glossary-clear-btn" onClick={clearFilters}>Clear Filters</button>
        )}
      </div>

      {/* Term List */}
      <section className="glossary-list">
        {Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([letter, terms]) => (
            <div
              key={letter}
              className="glossary-group"
              ref={el => { sectionRefs.current[letter] = el; }}
            >
              <div className="glossary-group__letter">
                <Hash size={14} />
                {letter}
              </div>
              <div className="glossary-group__terms">
                {terms.map(term => (
                  <div key={term.term} className="glossary-term glass-panel" id={`term-${term.term.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="glossary-term__header">
                      <h3 className="glossary-term__name">{term.term}</h3>
                      {term.category && (
                        <span className={`glossary-term__cat cat-${term.category.toLowerCase()}`}>
                          {term.category}
                        </span>
                      )}
                    </div>
                    <p className="glossary-term__definition">{term.definition}</p>
                    <div className="glossary-term__footer">
                      <Link href={`/glossary/${toSlug(term.term)}`} className="glossary-term__link glossary-term__link--definition">
                        View Definition <ChevronRight size={14} />
                      </Link>
                      {term.relatedTechnique && (
                        <Link href={`/food/${term.relatedTechnique}`} className="glossary-term__link">
                          View Technique <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="glossary-empty glass-panel">
            <BookOpen size={48} />
            <h3>No terms found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default GlossaryPage;
