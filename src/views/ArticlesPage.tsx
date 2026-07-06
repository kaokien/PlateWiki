'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Clock,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Filter,
  Award,
  Shield,
  Compass,
  Dumbbell,
  Apple,
  ShoppingBag,
  Swords,
  Brain,
} from 'lucide-react';
import { articles as staticArticles, categories as staticCategories } from '../data/articles';
import './ArticlesPage.css';
import type { Article, Category } from '../data/articles';

// Category Icon components map
const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  fundamentals: Award,
  defense: Shield,
  footwork: Compass,
  conditioning: Dumbbell,
  nutrition: Apple,
  gear: ShoppingBag,
  sparring: Swords,
  mindset: Brain,
};

// Category → fallback thumbnail (matches existing images in /public/images/articles/)
const CATEGORY_IMAGES: Record<string, string> = {
  'Boxing Fundamentals': '/images/articles/boxing-fundamentals.png',
  'Defense & Countering': '/images/articles/defense-countering.png',
  'Footwork & Movement': '/images/articles/footwork-movement.png',
  'Conditioning & Fitness': '/images/articles/conditioning-fitness.png',
  'Nutrition & Weight': '/images/articles/nutrition-weight.png',
  'Equipment & Gear': '/images/articles/equipment-gear.png',
  'Sparring & Competition': '/images/articles/sparring-competition.png',
  'Mindset & Strategy': '/images/articles/mindset-strategy.png',
};

/** Returns heroImage if set, otherwise the category fallback image. */
function getArticleImage(article: Article): string {
  return article.heroImage || CATEGORY_IMAGES[article.category] || '/images/articles/boxing-fundamentals.png';
}

interface ArticlesPageProps {
  articles?: Article[];
  categories?: Category[];
}


/* ─── Featured Carousel ──────────────────────────────────────────────── */

const CAROUSEL_INTERVAL = 6000; // 6 seconds

const FeaturedCarousel = ({ items }: { items: Article[] }) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setActive(prev => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(advance, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, [paused, advance]);

  const goTo = (index: number) => setActive(index);
  const goPrev = () => setActive(prev => (prev - 1 + items.length) % items.length);
  const goNext = () => advance();

  return (
    <section
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured articles"
    >
      <div className="carousel__viewport">
        {items.map((article, i) => (
          <Link
            href={`/articles/${article.id}`}
            key={article.id}
            className={`carousel__slide ${i === active ? 'carousel__slide--active' : ''}`}
            aria-hidden={i !== active}
            tabIndex={i === active ? 0 : -1}
          >
            <div className="carousel__image">
              <Image
                src={getArticleImage(article)}
                alt={article.title}
                fill
                className="carousel__img"
                sizes="100vw"
                priority={i === 0}
              />
              <div className="carousel__gradient" />
            </div>
            <div className="carousel__content">
              <span className="carousel__category">{article.category}</span>
              <h2 className="carousel__title">{article.title}</h2>
              <p className="carousel__subtitle">{article.subtitle}</p>
              <div className="carousel__meta">
                <Clock size={14} />
                <span>{article.readTime} read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation arrows */}
      <button className="carousel__arrow carousel__arrow--prev" onClick={(e) => { e.preventDefault(); goPrev(); }} aria-label="Previous article">
        <ChevronLeft size={22} />
      </button>
      <button className="carousel__arrow carousel__arrow--next" onClick={(e) => { e.preventDefault(); goNext(); }} aria-label="Next article">
        <ChevronRight size={22} />
      </button>

      {/* Progress bar */}
      <div
        className="carousel__progress"
        style={{
          position: 'relative',
          width: '100%',
          margin: '1.25rem 0 0.75rem 0',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          borderRadius: '100px',
          zIndex: 5,
        }}
      >
        <div
          className={`carousel__progress-bar ${paused ? 'carousel__progress-bar--paused' : ''}`}
          key={active}
        />
      </div>

      {/* Dot indicators */}
      <div
        className="carousel__dots"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '0.75rem',
          marginBottom: '0.5rem',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {items.map((_, i) => (
          <button
            key={i}
            className={`carousel__dot ${i === active ? 'carousel__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to article ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

/* ─── Article Card ───────────────────────────────────────────────────── */

const ArticleCard = ({ article }: { article: Article }) => (
  <Link href={`/articles/${article.id}`} className="article-card" id={`article-${article.id}`}>
    <div className="article-card__image">
      <Image src={getArticleImage(article)} alt={article.title} width={400} height={225} className="article-card__img" />
      <span className="article-card__category-badge">{article.category}</span>
    </div>
    <div className="article-card__body">
      <h3 className="article-card__title">{article.title}</h3>
      <p className="article-card__subtitle">{article.subtitle}</p>
      <div className="article-card__meta">
        <span className="article-card__read-time">
          <Clock size={14} />
          {article.readTime}
        </span>
        <span className="article-card__date">{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>
    <div className="article-card__arrow">
      <ChevronRight size={18} />
    </div>
  </Link>
);

/* ─── Articles Page ──────────────────────────────────────────────────── */

const ArticlesPage = ({
  articles = staticArticles,
  categories = staticCategories,
}: ArticlesPageProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredArticles = useMemo(() => {
    let result = articles;
    if (activeCategory !== 'all') {
      result = articles.filter(a => a.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.subtitle.toLowerCase().includes(q) ||
          (a.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [articles, activeCategory, searchQuery]);

  const featured = articles.slice(0, 5);

  return (
    <div className="articles-page">
      {/* Hero */}
      <section className="articles-hero">
        <div className="articles-hero__content">
          <span className="articles-hero__label">Knowledge Base</span>
          <h1>Boxing Articles & Guides</h1>
          <p>In-depth guides covering everything from your first jab to fight-night preparation. Written for boxers, by boxers.</p>
          <div className="articles-hero__stats">
            <div className="articles-hero__stat">
              <strong>{articles.length}</strong>
              <span>Articles</span>
            </div>
            <div className="articles-hero__stat">
              <strong>{categories.length - 1}</strong>
              <span>Categories</span>
            </div>
            <div className="articles-hero__stat">
              <strong>Free</strong>
              <span>Always</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Carousel */}
      <FeaturedCarousel items={featured} />

      {/* Search + Filter Bar */}
      <section className="articles-controls">
        <div className="articles-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            id="article-search"
          />
        </div>
        <button
          className="articles-filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <Filter size={16} />
          Filter
        </button>
      </section>

      {/* Category Filters */}
      <section className={`articles-categories ${showFilters ? 'articles-categories--open' : ''}`}>
        {categories.map(cat => {
          const IconComponent = cat.icon ? CATEGORY_ICONS[cat.icon] : null;
          return (
            <button
              key={cat.id}
              className={`category-chip ${activeCategory === cat.id ? 'category-chip--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {IconComponent && (
                <IconComponent className="category-chip__icon" size={16} />
              )}
              {cat.name}
              <span className="category-chip__count">{cat.count}</span>
            </button>
          );
        })}
      </section>

      {/* Article Grid */}
      <section className="articles-grid">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <div className="articles-empty">
            <BookOpen size={48} />
            <h3>No articles found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="articles-cta">
        <h2>Want structured training, not just articles?</h2>
        <p>The Boxing Blueprint is a 4-part video course that takes you from zero to ring-ready.</p>
        <Link href="/course" className="articles-cta__button">
          View The Boxing Blueprint
          <ChevronRight size={18} />
        </Link>
      </section>
    </div>
  );
};

export default ArticlesPage;
