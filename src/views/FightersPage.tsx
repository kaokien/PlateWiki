'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, ChevronRight } from 'lucide-react';
import { fighters } from '../data/fighters';
import './FightersPage.css';

const STYLE_FILTERS = [
  { label: 'All Styles', value: 'all' },
  { label: 'Swarmer', value: 'swarmer' },
  { label: 'Outboxer', value: 'outboxer' },
  { label: 'Counter-Puncher', value: 'counter-puncher' },
  { label: 'Boxer-Puncher', value: 'boxer-puncher' },
  { label: 'Pressure', value: 'pressure' },
  { label: 'Movement', value: 'movement' },
  { label: 'Technical', value: 'technical' },
];

const STANCE_FILTERS = ['All Goals', 'Endurance', 'Strength'];

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="fighter-stat-row">
    <span className="stat-label">{label}</span>
    <div className="stat-bar-track">
      <div className="stat-bar-fill" style={{ width: `${value}%`, background: color }} />
    </div>
    <span className="stat-value">{value}</span>
  </div>
);

const FightersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStyle, setActiveStyle] = useState('all');
  const [activeStance, setActiveStance] = useState('All Goals');

  const filtered = useMemo(() => {
    return fighters.filter(f => {
      const matchesSearch = searchQuery === '' ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.style.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStyle = activeStyle === 'all' || f.styleTags.includes(activeStyle);
      const matchesStance = activeStance === 'All Goals' ||
        (activeStance === 'Endurance' && f.stance === 'orthodox') ||
        (activeStance === 'Strength' && f.stance === 'southpaw');
      return matchesSearch && matchesStyle && matchesStance;
    });
  }, [searchQuery, activeStyle, activeStance]);

  return (
    <div className="athletes-page">
      <div className="athletes-header">
        <h1>ATHLETE <span className="text-primary">FUEL PROFILES</span></h1>
        <p className="athletes-subtitle">
          Study how the elite fuel. Each profile breaks down their sports nutrition, maps their signature foods, and shows you what to prepare.
        </p>
      </div>

      <div className="athletes-controls">
        <div className="athletes-search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search athlete profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search athletes"
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="athletes-filter-row">
          {STYLE_FILTERS.map(sf => (
            <button
              key={sf.value}
              className={`pill ${activeStyle === sf.value ? 'active' : ''}`}
              onClick={() => setActiveStyle(sf.value)}
            >
              {sf.label}
            </button>
          ))}
        </div>

        <div className="fighters-filter-row">
          {STANCE_FILTERS.map(s => (
            <button
              key={s}
              className={`pill ${activeStance === s ? 'active' : ''}`}
              onClick={() => setActiveStance(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="fighters-results-bar">
        <span>{filtered.length} athlete{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="fighters-grid">
        {filtered.length > 0 ? (
          filtered.map(fighter => (
            <Link href={`/fighters/${fighter.id}`} key={fighter.id} className="glass-panel fighter-card">
              <div className="fighter-card__header">
                <div className="fighter-card__identity">
                  <h2>{fighter.name}</h2>
                  <span className="fighter-card__nickname">&ldquo;{fighter.nickname}&rdquo;</span>
                </div>
                <span className={`fighter-card__stance ${fighter.stance}`}>
                  {fighter.stance === 'orthodox' ? '🏃 Endurance' : '💪 Strength'}
                </span>
              </div>

              <div className="fighter-card__meta">
                <span className="fighter-card__style">{fighter.style}</span>
                <span className="fighter-card__record">{fighter.record}</span>
                <span className="fighter-card__era">{fighter.era}</span>
              </div>

              <div className="fighter-card__stats">
                <StatBar label="Power" value={fighter.stats.power} color="var(--color-primary)" />
                <StatBar label="Speed" value={fighter.stats.speed} color="#00e5ff" />
                <StatBar label="Defense" value={fighter.stats.defense} color="var(--color-success)" />
              </div>

              <div className="fighter-card__tags">
                {fighter.styleTags.map(tag => (
                  <span key={tag} className="style-tag">{tag}</span>
                ))}
              </div>

              <div className="fighter-card__cta">
                Full Breakdown <ChevronRight size={16} />
              </div>
            </Link>
          ))
        ) : (
          <div className="glass-panel no-results">
            <div className="no-results-emoji">🥊</div>
            <h3>No fighters match</h3>
            <p>Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FightersPage;
