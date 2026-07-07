'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useClientSearchParams } from '@/hooks/useClientSearchParams';
import { Search, X, Dumbbell, Flame, Leaf } from 'lucide-react';
import { exercises, MUSCLE_GROUPS } from '@/data/recipes';
import './ExercisesPage.css';

const MUSCLE_KEYS = ['all', ...Object.keys(MUSCLE_GROUPS)] as const;
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;

function isCookedMeal(ex: any): boolean {
  const equipStr = (ex.equipment || []).join(' ').toLowerCase();
  return equipStr.includes('stove') || equipStr.includes('skillet') || equipStr.includes('pot') || equipStr.includes('pan') || equipStr.includes('kettle') || equipStr.includes('oven');
}

const TYPE_OPTIONS = [
  { key: 'all', label: 'All Recipes', icon: null },
  { key: 'athletic nutrition', label: 'Cooked & Prepared', icon: Flame },
  { key: 'strength', label: 'Raw & Zero Prep', icon: Leaf },
] as const;

const ExercisesPage = () => {
  const searchParams = useClientSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMuscle, setActiveMuscle] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [activeType, setActiveType] = useState('all');

  useEffect(() => {
    const type = searchParams?.get('type');
    if (type && TYPE_OPTIONS.some(o => o.key === type)) setActiveType(type);
  }, [searchParams]);

  const allExercises = useMemo(() => Object.values(exercises), []);

  const filtered = useMemo(() => {
    return allExercises.filter(ex => {
      const matchesMuscle = activeMuscle === 'all' || ex.muscles.includes(activeMuscle);
      const matchesDifficulty = activeDifficulty === 'All' || ex.difficulty === activeDifficulty;
      const matchesSearch = searchQuery === '' ||
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.performanceContext.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeType === 'all' ||
        (activeType === 'athletic nutrition' && isCookedMeal(ex)) ||
        (activeType === 'strength' && !isCookedMeal(ex));
      return matchesMuscle && matchesDifficulty && matchesSearch && matchesType;
    });
  }, [allExercises, activeMuscle, activeDifficulty, searchQuery, activeType]);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveMuscle('all');
    setActiveDifficulty('All');
    setActiveType('all');
  };

  const hasActiveFilters = activeMuscle !== 'all' || activeDifficulty !== 'All' || searchQuery !== '' || activeType !== 'all';

  const pageTitle = activeType === 'athletic nutrition'
    ? <>COOKED & <span className="text-primary">PREPARED</span></>
    : activeType === 'strength'
      ? <>RAW & <span className="text-primary">ZERO PREP</span></>
      : <>ATHLETE <span className="text-primary">RECIPE BOOK</span></>;

  const pageSubtitle = activeType === 'athletic nutrition'
    ? 'Warm, cooked, and prepared recipes requiring kitchen appliances for high bio-availability.'
    : activeType === 'strength'
      ? 'Raw nutrition, smoothies, and supplement infusions requiring zero stove-work.'
      : 'Curated athletic nutrition, macro fuels, and recovery meals to power your performance goals.';

  return (
    <div className="exl-page">
      <div className="exl-header">
        <h1>{pageTitle}</h1>
        <p className="exl-subtitle">{pageSubtitle}</p>
      </div>

      <div className="exl-controls">
        <div className="exl-search-row">
          <div className="exl-search-wrapper">
            <Search size={18} className="exl-search-icon" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="exl-search-input"
              aria-label="Search recipes"
            />
            {searchQuery && (
              <button
                className="exl-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="exl-filter-section">
          <label className="exl-filter-label">Prep Style</label>
          <div className="exl-filter-pills">
            {TYPE_OPTIONS.map(opt => (
              <button
                key={opt.key}
                className={`exl-pill ${activeType === opt.key ? 'active' : ''}`}
                onClick={() => setActiveType(opt.key)}
              >
                {opt.icon && <opt.icon size={14} className="exl-pill-icon" />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="exl-filter-section">
          <label className="exl-filter-label">Nutritional Role</label>
          <div className="exl-filter-pills">
            {MUSCLE_KEYS.map(key => (
              <button
                key={key}
                className={`exl-pill ${activeMuscle === key ? 'active' : ''}`}
                onClick={() => setActiveMuscle(key)}
              >
                {key === 'all' ? 'All' : MUSCLE_GROUPS[key as keyof typeof MUSCLE_GROUPS]}
              </button>
            ))}
          </div>
        </div>

        <div className="exl-filter-section">
          <label className="exl-filter-label">Prep Difficulty</label>
          <div className="exl-filter-pills">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                className={`exl-pill ${activeDifficulty === d ? 'active' : ''} ${d !== 'All' ? `exl-diff-${d.toLowerCase()}` : ''}`}
                onClick={() => setActiveDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="exl-results-bar">
        <span>
          Showing <strong>{filtered.length}</strong> of {allExercises.length} recipes
        </span>
        {hasActiveFilters && (
          <button className="exl-clear-btn" onClick={clearFilters}>Clear All</button>
        )}
      </div>

      <div className="exl-grid">
        {filtered.length > 0 ? (
          filtered.map(ex => (
            <Link
              key={ex.id}
              href={`/recipe/${ex.id}`}
              className="glass-panel exl-card"
              aria-label={`${ex.name} — ${ex.category}`}
            >
              <div className="exl-card-top">
                <span className="exl-category">{ex.category}</span>
                <span className={`exl-difficulty exl-diff-${ex.difficulty.toLowerCase()}`}>
                  {ex.difficulty === 'Beginner' ? '•' : ex.difficulty === 'Intermediate' ? '••' : '•••'}{' '}
                  {ex.difficulty}
                </span>
              </div>

              <h3>{ex.name}</h3>

              <span className={`exl-type-badge ${isCookedMeal(ex) ? 'athletic nutrition' : 'strength'}`}>
                {isCookedMeal(ex) ? '🔥 Cooked Meal' : '🌿 Raw / Powder'}
              </span>

              <p className="exl-context">
                {ex.performanceContext.length > 100
                  ? ex.performanceContext.substring(0, 100) + '...'
                  : ex.performanceContext}
              </p>

              <div className="exl-muscles">
                {ex.muscles.map(m => (
                  <span key={m} className="exl-muscle-chip">
                    {MUSCLE_GROUPS[m as keyof typeof MUSCLE_GROUPS] || m}
                  </span>
                ))}
              </div>

              <div className="exl-equipment">
                <span className="text-secondary font-mono text-xs">{ex.rest}</span>
              </div>

              <div className="exl-read-more">View Recipe →</div>
            </Link>
          ))
        ) : (
          <div className="glass-panel exl-no-results">
            <div className="exl-no-results-emoji">🥑</div>
            <h3>No recipes found</h3>
            <p>No recipes match your current filters. Try adjusting them.</p>
            <button className="exl-clear-filters-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesPage;
