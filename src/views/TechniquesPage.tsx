'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClientSearchParams } from '@/hooks/useClientSearchParams';
import { Search, X, Shuffle, SlidersHorizontal, Heart, ChefHat } from 'lucide-react';
import { techniques, bodyParts } from '../data/foods';
import { exercises } from '../data/recipes';
import AdBanner from '../components/AdBanner';
import { analytics } from '../utils/analytics';
import { isFavorite, toggleFavorite, getFavorites } from '../utils/favorites';
import './TechniquesPage.css';

const CATEGORIES = ['All', 'Macronutrients', 'Hydration & Salts', 'Micronutrients', 'Gut & Digestion', 'Superfoods & Adaptogens'];
const DIFFICULTIES = ['All Levels', 'beginner', 'intermediate', 'advanced'];
const STANCES = ['Any Goal', 'runner', 'lifter', 'fighter'];
const FORMATS = ['Any Form', 'cooked', 'raw', 'powder', 'capsule', 'liquid'];

const MUSCLE_GROUPS = [
  { label: 'Any Region', muscles: [] },
  { label: 'Upper Body', muscles: ['front-deltoids', 'back-deltoids', 'chest', 'trapezius', 'upper-back'] },
  { label: 'Core', muscles: ['abs', 'obliques', 'lower-back'] },
  { label: 'Legs', muscles: ['quadriceps', 'hamstring', 'calves', 'gluteal', 'abductors', 'adductor'] },
  { label: 'Arms', muscles: ['biceps', 'triceps', 'forearm'] },
  { label: 'Head & Neck', muscles: ['head', 'neck'] },
];

const TechniquesPage = ({ initialCategory }: { initialCategory?: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'All');
  const [activeDifficulty, setActiveDifficulty] = useState('All Levels');
  const [activeStance, setActiveStance] = useState('Any Goal');
  const [activeFormat, setActiveFormat] = useState('Any Form');
  const [activeMuscleGroup, setActiveMuscleGroup] = useState('Any Region');
  const [showFilters, setShowFilters] = useState(false);
  const [favIds, setFavIds] = useState(new Set());
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const searchParams = useClientSearchParams();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  // Load favorites on mount
  useEffect(() => {
    setFavIds(new Set(getFavorites()));
  }, []);

  // Read URL params for pre-filtering (?category=Carbs or ?muscle=Core)
  useEffect(() => {
    const cat = searchParams?.get('category') ?? null;
    const muscle = searchParams?.get('muscle') ?? null;
    if (cat && CATEGORIES.includes(cat)) setActiveCategory(cat);
    if (muscle && MUSCLE_GROUPS.some(g => g.label === muscle)) {
      setActiveMuscleGroup(muscle);
      setShowFilters(true);
    }
  }, [searchParams]);

  // Debounced search analytics
  useEffect(() => {
    if (!searchQuery) return;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      analytics.searchQuery(searchQuery, filteredTechniques.length);
    }, 800);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [searchQuery]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (cat !== 'All') analytics.filterCategory(cat);
  };

  const allTechniques = useMemo(() => Object.values(techniques), []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allTechniques.length };
    CATEGORIES.slice(1).forEach(cat => {
      counts[cat] = allTechniques.filter(t => t.category === cat).length;
    });
    return counts;
  }, [allTechniques]);

  const filteredTechniques = useMemo(() => {
    return allTechniques.filter(t => {
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      const matchesDifficulty = activeDifficulty === 'All Levels' || t.difficulty === activeDifficulty;
      const matchesStance = activeStance === 'Any Goal' || t.stance === activeStance || t.stance === 'both';
      const matchesFormat = activeFormat === 'Any Form' || (t.trainingFormat && t.trainingFormat.includes(activeFormat));
      const matchesMuscle = activeMuscleGroup === 'Any Region' || (() => {
        const group = MUSCLE_GROUPS.find(g => g.label === activeMuscleGroup);
        return group && t.muscles.some(m => group.muscles.includes(m));
      })();
      const matchesSearch = searchQuery === '' || 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.whenToUse && t.whenToUse.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesDifficulty && matchesStance && matchesFormat && matchesMuscle && matchesSearch;
    });
  }, [allTechniques, activeCategory, activeDifficulty, activeStance, activeFormat, activeMuscleGroup, searchQuery]);

  const relatedRecipes = useMemo(() => {
    if (activeCategory === 'All') return [];
    
    const activeCategoryClean = activeCategory.trim();
    return Object.values(exercises)
      .filter((recipe: any) => {
        return (recipe.techniques || []).some((tid: string) => {
          const ingredient = (techniques as Record<string, any>)[tid];
          return ingredient && ingredient.category === activeCategoryClean;
        });
      })
      .slice(0, 3);
  }, [activeCategory]);

  const activeFilterCount = [
    activeDifficulty !== 'All Levels',
    activeStance !== 'Any Goal',
    activeFormat !== 'Any Form',
    activeMuscleGroup !== 'Any Region',
  ].filter(Boolean).length;

  const handleRandomDrill = () => {
    const pool = filteredTechniques.length > 0 ? filteredTechniques : allTechniques;
    const random = pool[Math.floor(Math.random() * pool.length)];
    if (random) {
      analytics.randomDrill(random.id, random.name);
      router.push(`/food/${random.id}`);
    }
  };

  const handleFavToggle = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { openSignIn(); return; }
    const added = toggleFavorite(id);
    analytics.favoriteToggle(id, added ? 'add' : 'remove');
    setFavIds(prev => {
      const next = new Set(prev);
      if (added) next.add(id); else next.delete(id);
      return next;
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setActiveDifficulty('All Levels');
    setActiveStance('Any Goal');
    setActiveFormat('Any Form');
    setActiveMuscleGroup('Any Region');
  };

  return (
    <div className="techniques-browse-page">
      <div className="browse-header">
        <h1>FOOD & NUTRITION <span className="text-primary">LIBRARY</span></h1>
        <p className="browse-subtitle">{allTechniques.length} whole foods and nutrients across {CATEGORIES.length - 1} categories</p>
      </div>

      <div className="browse-controls">
        <div className="controls-top-row">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search foods & nutrients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search foods"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="control-buttons">
            <button className="random-drill-btn" onClick={handleRandomDrill} aria-label="Random drill">
              <Shuffle size={16} /> Random Food
            </button>
            <button 
              className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle advanced filters"
            >
              <SlidersHorizontal size={16} /> 
              Filters
              {activeFilterCount > 0 && <span className="filter-count-badge">{activeFilterCount}</span>}
            </button>
          </div>
        </div>

        <div className="category-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat} <span className="filter-count">({categoryCounts[cat] || 0})</span>
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="advanced-filters">
            <div className="filter-group">
              <label className="filter-label">Difficulty</label>
              <div className="filter-pills">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    className={`pill ${activeDifficulty === d ? 'active' : ''} ${d !== 'All Levels' ? d : ''}`}
                    onClick={() => { setActiveDifficulty(d); if (d !== 'All Levels') analytics.filterDifficulty(d); }}
                  >
                    {d === 'All Levels' ? d : d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">Target Goal</label>
              <div className="filter-pills">
                {STANCES.map(s => (
                  <button
                    key={s}
                    className={`pill ${activeStance === s ? 'active' : ''}`}
                    onClick={() => { setActiveStance(s); if (s !== 'Any Goal') analytics.filterStance(s); }}
                  >
                    {s === 'Any Goal' ? s : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">Preparation Form</label>
              <div className="filter-pills">
                {FORMATS.map(f => (
                  <button
                    key={f}
                    className={`pill ${activeFormat === f ? 'active' : ''}`}
                    onClick={() => { setActiveFormat(f); if (f !== 'Any Form') analytics.filterFormat(f); }}
                  >
                    {f === 'Any Form' ? f : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">Muscle Group</label>
              <div className="filter-pills">
                {MUSCLE_GROUPS.map(g => (
                  <button
                    key={g.label}
                    className={`pill ${activeMuscleGroup === g.label ? 'active' : ''}`}
                    onClick={() => setActiveMuscleGroup(g.label)}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="browse-results-bar">
        <span>{filteredTechniques.length} food{filteredTechniques.length !== 1 ? 's' : ''}</span>
        {(activeFilterCount > 0 || searchQuery) && (
          <button className="clear-all-btn" onClick={clearAllFilters}>Clear All</button>
        )}
      </div>

      <div className="browse-grid">
        {filteredTechniques.length > 0 ? (
          filteredTechniques.map((tech, idx) => (
            <React.Fragment key={tech.id}>
              <Link
                href={`/food/${tech.id}`}
                className="glass-panel browse-card"
                aria-label={`${tech.name} — ${tech.category}`}
              >
                {tech.image && (
                  <div className="card-image-container">
                    <img 
                      src={tech.image.includes('unsplash.com') ? `${tech.image}&w=400&q=75` : tech.image} 
                      alt={tech.name} 
                      className="card-image" 
                      loading="lazy" 
                    />
                  </div>
                )}
                <div className="card-top-row">
                  <span className="browse-category">{tech.category}</span>
                  {tech.difficulty && (
                    <span className={`difficulty-badge ${tech.difficulty}`}>
                      {tech.difficulty === 'beginner' ? '• ' : tech.difficulty === 'intermediate' ? '•• ' : '••• '}
                      {tech.difficulty}
                    </span>
                  )}
                  <button
                    className={`card-fav-btn ${favIds.has(tech.id) ? 'fav-active' : ''}`}
                    onClick={(e) => handleFavToggle(tech.id, e)}
                    aria-label={favIds.has(tech.id) ? 'Remove from favorites' : 'Save food'}
                  >
                    <Heart size={14} fill={favIds.has(tech.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <h3>{tech.name}</h3>
                <p>{tech.description.substring(0, 120)}...</p>
                {tech.trainingFormat && tech.trainingFormat.length > 0 && (
                  <div className="card-format-tags">
                    {tech.trainingFormat.map(fmt => (
                      <span key={fmt} className="format-chip">{fmt}</span>
                    ))}
                  </div>
                )}
                <div className="browse-muscles">
                  {tech.muscles.slice(0, 3).map(m => (
                    <span key={m} className="muscle-chip">{bodyParts[m]?.name || m}</span>
                  ))}
                </div>
                <div className="read-more">Learn Food Profile →</div>
              </Link>
              {(idx + 1) % 6 === 0 && idx < filteredTechniques.length - 1 && (
                <div className="grid-ad-slot" key={`ad-${idx}`}>
                  <AdBanner format="horizontal" />
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <div className="glass-panel no-results">
            <div className="no-results-emoji">🌱</div>
            <h3>No foods found</h3>
            <p>No foods match your current filters. Try adjusting them.</p>
            <button className="clear-filters-btn" onClick={clearAllFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {activeCategory !== 'All' && relatedRecipes.length > 0 && (
        <div className="category-recipes-section">
          <div className="section-header-recipes">
            <ChefHat size={22} className="recipes-section-icon" />
            <h2>Starter Recipes: {activeCategory}</h2>
          </div>
          <p className="recipes-section-desc">
            Try these simple meal prep recipes to start incorporating these essential ingredients into your daily routine:
          </p>
          <div className="recipes-starter-grid">
            {relatedRecipes.map((recipe: any) => (
              <Link key={recipe.id} href={`/recipe/${recipe.id}`} className="recipe-starter-card glass-panel">
                <div className="recipe-starter-header">
                  <span className="recipe-starter-difficulty">• {recipe.difficulty}</span>
                  <span className="recipe-starter-time">{recipe.reps}</span>
                </div>
                <h3>{recipe.name}</h3>
                <p>{recipe.boxingContext ? recipe.boxingContext.substring(0, 140) + '...' : ''}</p>
                <div className="recipe-starter-footer">
                  <span className="recipe-starter-macros">{recipe.rest}</span>
                  <span className="recipe-starter-arrow">View Recipe →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechniquesPage;
