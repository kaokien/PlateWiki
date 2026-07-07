'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Heart, Clock, Trash2, ArrowRight, Crown, Dumbbell, Calendar } from 'lucide-react';
import { techniques, bodyParts } from '../data/foods';
import { getFavorites, removeFavorite, getRecentlyViewed, getHistory, HistoryItem } from '../utils/favorites';
import { useSubscription, FREE_FAVORITES_LIMIT } from '../context/SubscriptionContext';
import { getSavedWorkouts, deleteSavedWorkout, SavedWorkout, FREE_WORKOUTS_LIMIT } from '../utils/savedWorkouts';
import AuthGate from '../components/AuthGate';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const [activeTab, setActiveTab] = useState<'techniques' | 'workouts' | 'history'>('techniques');
  const [favoriteIds, setFavoriteIds] = useState<any[]>([]);
  const [recentIds, setRecentIds] = useState<any[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const { isPro } = useSubscription();
  const { user, isLoaded } = useUser();
  
  const atLimit = !isPro && favoriteIds.length >= FREE_FAVORITES_LIMIT;
  const workoutsAtLimit = !isPro && savedWorkouts.length >= FREE_WORKOUTS_LIMIT;

  useEffect(() => {
    setFavoriteIds(getFavorites());
    setRecentIds(getRecentlyViewed());
    setSavedWorkouts(getSavedWorkouts());
    setHistoryItems(getHistory());
  }, []);

  if (isLoaded && !user) {
    return (
      <div className="favorites-page">
        <AuthGate feature="Saved Items" description="Sign in to save techniques, workouts, and track your browsing history across devices." />
      </div>
    );
  }

  const handleRemoveFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(id);
    setFavoriteIds(prev => prev.filter(fId => fId !== id));
  };

  const handleDeleteWorkout = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteSavedWorkout(id);
    setSavedWorkouts(prev => prev.filter(w => w.id !== id));
  };

  const favoriteTechniques = favoriteIds
    .map(id => techniques[id])
    .filter(Boolean);

  const recentTechniques = recentIds
    .filter(id => !favoriteIds.includes(id)) // don't show dupes
    .map(id => techniques[id])
    .filter(Boolean)
    .slice(0, 6);

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>YOUR <span className="text-primary">SAVED</span> ITEMS</h1>
        <p className="favorites-subtitle">Techniques you've favorited and workouts you've saved.</p>
      </div>

      <div className="fav-tabs">
        <button
          className={`fav-tab-btn ${activeTab === 'techniques' ? 'active' : ''}`}
          onClick={() => setActiveTab('techniques')}
        >
          <Heart size={16} /> Techniques ({favoriteTechniques.length})
        </button>
        <button
          className={`fav-tab-btn ${activeTab === 'workouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('workouts')}
        >
          <Dumbbell size={16} /> Workouts ({savedWorkouts.length})
        </button>
        <button
          className={`fav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={16} /> History ({historyItems.length})
        </button>
      </div>

      {activeTab === 'techniques' && (
        <>
          <section className="favorites-section">
            <div className="section-label">
              <Heart size={18} className="text-primary" fill="currentColor" />
              <h2>Favorites ({favoriteTechniques.length}{!isPro && ` / ${FREE_FAVORITES_LIMIT}`})</h2>
            </div>

            {atLimit && (
              <div className="glass-panel fav-limit-banner">
                <Crown size={16} style={{ color: '#f5a623' }} />
                <span>You've hit the free limit. <Link href="/pricing" style={{ color: '#f5a623', fontWeight: 700 }}>Unlock unlimited saves with Pro</Link></span>
              </div>
            )}

            {favoriteTechniques.length > 0 ? (
              <div className="favorites-grid">
                {favoriteTechniques.map(tech => (
                  <Link
                    href={`/food/${tech.id}`}
                    key={tech.id}
                    className="glass-panel fav-card"
                  >
                    <div className="card-top-row">
                      <span className="browse-category">{tech.category}</span>
                      {tech.difficulty && (
                        <span className={`difficulty-badge ${tech.difficulty}`}>
                          {tech.difficulty === 'beginner' ? '• ' : tech.difficulty === 'intermediate' ? '•• ' : '••• '}
                          {tech.difficulty}
                        </span>
                      )}
                    </div>
                    <h3>{tech.name}</h3>
                    <p>{tech.description.substring(0, 100)}...</p>
                    <div className="fav-card-footer">
                      <span className="read-more">Study <ArrowRight size={14} /></span>
                      <button
                        className="remove-fav-btn"
                        onClick={(e) => handleRemoveFavorite(tech.id, e)}
                        aria-label={`Remove ${tech.name} from favorites`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass-panel empty-state">
                <div className="empty-icon empty-heart-container">
                  <Heart size={48} className="empty-heart-icon" />
                </div>
                <h3>Your training corner is empty</h3>
                <p>Tap the heart icon on any technique to save it here.</p>
                <Link href="/" className="empty-cta">
                  Go to Interactive Map <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </section>

          {recentTechniques.length > 0 && (
            <section className="favorites-section">
              <div className="section-label">
                <Clock size={18} />
                <h2>Recently Viewed</h2>
              </div>
              <div className="favorites-grid">
                {recentTechniques.map(tech => (
                  <Link
                    href={`/food/${tech.id}`}
                    key={tech.id}
                    className="glass-panel fav-card recent-card"
                  >
                    <div className="card-top-row">
                      <span className="browse-category">{tech.category}</span>
                    </div>
                    <h3>{tech.name}</h3>
                    <span className="read-more">Review <ArrowRight size={14} /></span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {activeTab === 'workouts' && (
        <section className="favorites-section">
          <div className="section-label">
            <Dumbbell size={18} className="text-primary" />
            <h2>Saved Workouts ({savedWorkouts.length}{!isPro && ` / ${FREE_WORKOUTS_LIMIT}`})</h2>
          </div>

          {workoutsAtLimit && (
            <div className="glass-panel fav-limit-banner">
              <Crown size={16} style={{ color: '#f5a623' }} />
              <span>You've hit the free limit. <Link href="/pricing" style={{ color: '#f5a623', fontWeight: 700 }}>Unlock unlimited saves with Pro</Link></span>
            </div>
          )}

          {savedWorkouts.length > 0 ? (
            <div className="favorites-grid">
              {savedWorkouts.map(workout => (
                <Link
                  href={`/meal-generator?savedId=${workout.id}`}
                  key={workout.id}
                  className="glass-panel fav-card workout-card"
                >
                  <div className="card-top-row">
                    <span className="browse-category">{workout.goal.toUpperCase()}</span>
                    <span className={`difficulty-badge ${workout.level}`}>
                      {workout.level}
                    </span>
                  </div>
                  <h3>{workout.title}</h3>
                  <p className="workout-card-meta">
                    <span><Clock size={12} /> {workout.duration}</span>
                    <span>• {workout.drills.length} drills</span>
                  </p>
                  <div className="fav-card-footer">
                    <span className="read-more">Start Workout <ArrowRight size={14} /></span>
                    <button
                      className="remove-fav-btn"
                      onClick={(e) => handleDeleteWorkout(workout.id, e)}
                      aria-label={`Delete ${workout.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-panel empty-state">
              <div className="empty-icon empty-workout-container">
                <Dumbbell size={48} className="empty-workout-icon" />
              </div>
              <h3>No saved workouts yet</h3>
              <p>Generate a customized routine and save it to access it here.</p>
              <Link href="/meal-generator" className="empty-cta">
                Generate Workout <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>
      )}

      {activeTab === 'history' && (
        <section className="favorites-section">
          <div className="section-label">
            <Clock size={18} />
            <h2>Browsing History ({historyItems.length})</h2>
          </div>
          {historyItems.length > 0 ? (
            <div className="favorites-grid">
              {historyItems.map((item, i) => (
                <Link
                  href={item.href}
                  key={`${item.href}-${i}`}
                  className="glass-panel fav-card recent-card"
                >
                  <div className="card-top-row">
                    <span className="browse-category">{item.type.toUpperCase()}</span>
                    <span className="time-ago">{timeAgo(item.timestamp)}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <span className="read-more">View <ArrowRight size={14} /></span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-panel empty-state">
              <div className="empty-icon empty-heart-container">
                <Clock size={48} className="empty-heart-icon" />
              </div>
              <h3>No browsing history yet</h3>
              <p>Pages you visit will appear here.</p>
              <Link href="/" className="empty-cta">
                Go to Interactive Map <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default FavoritesPage;
