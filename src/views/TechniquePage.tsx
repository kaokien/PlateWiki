'use client';
import React, { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useClientSearchParams } from '@/hooks/useClientSearchParams';
import { ArrowRight, ChevronRight, Target, AlertTriangle, Lightbulb, Dumbbell, Maximize2, Heart, MessageCircle, Crosshair, Users, Clock, BookOpen, Tag, Camera, MessageSquare, ChefHat } from 'lucide-react';
import AdBanner from '../components/AdBanner';
import ShareButton from '../components/ShareButton';
import FlashcardCarousel from '../components/FlashcardCarousel';
import GearCard from '../components/GearCard';
import ProBadge from '../components/ProBadge';
import ProGate from '../components/ProGate';
import { techniques, bodyParts } from '../data/foods';
import { gearRecommendations } from '../data/gearRecommendations';
import { getArticlesForTechnique } from '../data/articles';
import { glossary, toSlug } from '../data/glossary';
import { analytics } from '../utils/analytics';
import { useStance } from '../context/StanceContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useFighterProfile } from '../context/FighterProfileContext';
import { parseStanceText } from '../utils/stanceParser';
import { isFavorite, toggleFavorite, addRecentlyViewed, addToHistory } from '../utils/favorites';
import { getWorkoutForTechnique } from '../data/gymWorkouts';
import KnowledgeCheck from '../components/KnowledgeCheck';
import './TechniquePage.css';

const TechniquePage = ({ routeId }: { routeId?: string }) => {
  const params = useParams<{ id: string }>();
  const id = routeId || params?.id || '';
  const searchParams = useClientSearchParams();
  const fromMuscleId = searchParams?.get('from') ?? null;
  const { isSouthpaw } = useStance();
  const { isPro } = useSubscription();
  const { awardXP } = useFighterProfile();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [hasJoinedDiscord, setHasJoinedDiscord] = useState(false);
  
  const technique = techniques[id];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (technique) {
      analytics.techniqueView(technique.name, technique.category, technique.difficulty);
      addRecentlyViewed(id);
      addToHistory({ id, type: 'technique', title: technique.name, href: `/food/${id}` });
      setIsFav(isFavorite(id));
      // Award XP for studying this technique (deduped by ID)
      awardXP('technique_studied', { techniqueId: id });
    }
    setHasJoinedDiscord(localStorage.getItem('joined_discord') === 'true');
  }, [id, technique, awardXP]);

  const handleJoinDiscord = () => {
    localStorage.setItem('joined_discord', 'true');
    setHasJoinedDiscord(true);
    analytics.customEvent('discord_join_click', { techniqueId: id });
  };

  const handleFavoriteToggle = () => {
    if (!user) { openSignIn(); return; }
    const added = toggleFavorite(id);
    setIsFav(added);
    analytics.favoriteToggle(id, added ? 'add' : 'remove');
  };

  if (!technique) {
    return (
      <div className="not-found">
        <h2>Food profile not found</h2>
        <Link href="/" className="back-link">Return to Anatomy Map</Link>
      </div>
    );
  }

  const fromMuscle = fromMuscleId ? bodyParts[fromMuscleId] : null;

  // Get related techniques
  const relatedTechs = (technique.relatedTechniques || [])
    .map(tid => techniques[tid])
    .filter(Boolean)
    .slice(0, 5);

  // Pick 2 random gear items relevant to the technique
  const suggestedGear = gearRecommendations.slice(0, 2);

  // Get workout for this technique
  const workout = getWorkoutForTechnique(technique);

  // Stance & format badges
  const stanceLabel = technique.stance === 'both' ? 'All Athletes' : technique.stance === 'orthodox' ? 'Runners / Endurance' : 'Lifters / Strength';
  const formatLabels = technique.trainingFormat || [];

  return (
    <div className="technique-page">
<nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="breadcrumb-link">Anatomy Map</Link>
        {fromMuscle && (
          <>
            <ChevronRight size={14} className="breadcrumb-chevron" />
            <Link href={`/body-map/${fromMuscleId}`} className="breadcrumb-link">{fromMuscle.name}</Link>
          </>
        )}
        <ChevronRight size={14} className="breadcrumb-chevron" />
        <span className="breadcrumb-current">{technique.name}</span>
      </nav>

      <div className="tech-header glass-panel">
        <div className="tech-header-grid">
          <div className="tech-title-area">
            <div className="tech-badges-row">
              <span className="category-badge">{technique.category}</span>
              {technique.difficulty && (
                <span className={`difficulty-badge ${technique.difficulty}`}>
                  {technique.difficulty === 'beginner' ? '• Staple' : technique.difficulty === 'intermediate' ? '•• Targeted' : '••• Specialized'}
                </span>
              )}
              <span className="stance-badge">{stanceLabel}</span>
            </div>
            <div className="tech-title-row">
              <h1 className="tech-title">{parseStanceText(technique.name, isSouthpaw)}</h1>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                <ShareButton title={`How to ${technique.name}`} description={technique.description} url={`/food/${technique.id}`} />
                <button 
                  className={`fav-btn ${isFav ? 'fav-active' : ''}`}
                  onClick={handleFavoriteToggle}
                  aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
            <p className="tech-description">{parseStanceText(technique.description, isSouthpaw)}</p>
            
            {/* Training format tags */}
            {formatLabels.length > 0 && (
              <div className="format-tags">
                {formatLabels.map(fmt => (
                  <span key={fmt} className="format-tag">{fmt}</span>
                ))}
              </div>
            )}

            {/* Coach review byline */}
            <div className="tech-byline">
              <Clock size={14} />
              <span>Reviewed by <strong>Nutrition Advisory Board</strong> · Last updated June 2026</span>
            </div>

            {(technique.muscles || []).length > 0 && (
              <div className="muscle-tags">
                {(technique.muscles || []).map(m => (
                  <Link href={`/body-map/${m}`} key={m} className="muscle-tag">{bodyParts[m]?.name || m}</Link>
                ))}
              </div>
            )}
          </div>
          {technique.image && (
            <div className="tech-hero-image-container">
              <img 
                src={technique.image.includes('unsplash.com') ? `${technique.image}&w=800&q=80` : technique.image} 
                alt={technique.name} 
                className="tech-hero-image" 
              />
            </div>
          )}
        </div>
      </div>

      <div className="tech-content-layout">
        <div className="tech-main-column">


          {/* When to Use */}
          {technique.whenToUse && (
            <div className="instruction-card glass-panel when-to-use">
              <div className="card-header">
                <Crosshair className="icon-crosshair" />
                <h2>Recommended Intake & Goals</h2>
              </div>
              <p className="when-text">{parseStanceText(technique.whenToUse, isSouthpaw)}</p>
            </div>
          )}

          {showFlashcards && isPro ? (
            <FlashcardCarousel 
              steps={(technique.steps || []).map(s => parseStanceText(s, isSouthpaw))} 
              onClose={() => setShowFlashcards(false)} 
            />
          ) : showFlashcards && !isPro ? (
            <ProGate
              feature="Flashcard Quiz Mode"
              description="Study technique steps one at a time in fullscreen flashcard mode."
            >
              <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.3 }}>
                <Maximize2 size={32} />
                <p>Flashcard Mode</p>
              </div>
            </ProGate>
          ) : (
            <div className="instruction-card glass-panel">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ChefHat className="icon-target" />
                  <h2 style={{ margin: 0 }}>Preparation & Usage Steps</h2>
                </div>
                <button 
                  onClick={() => setShowFlashcards(true)}
                  className="flashcard-toggle-btn"
                >
                  <Maximize2 size={16} /> Flashcard Mode {!isPro && <ProBadge />}
                </button>
              </div>
              <ol className="step-list">
                {(technique.steps || []).map((step, idx) => (
                  <li key={idx}><span>{parseStanceText(step, isSouthpaw)}</span></li>
                ))}
              </ol>
            </div>
          )}

          {/* Coaching Cues */}
          {technique.coachingCues && technique.coachingCues.length > 0 && (
            <div className="instruction-card glass-panel coaching-cues">
              <div className="card-header">
                <MessageCircle className="icon-cue" />
                <h2>Nutrition Cues</h2>
              </div>
              <div className="cue-list">
                {technique.coachingCues.map((cue, idx) => (
                  <div key={idx} className="cue-chip">"{parseStanceText(cue, isSouthpaw)}"</div>
                ))}
              </div>
            </div>
          )}

          {technique.proTips && technique.proTips.length > 0 && (
            <div className="instruction-card glass-panel pro-tips">
              <div className="card-header">
                <Lightbulb className="icon-tip" />
                <h2>Preparation Tips</h2>
              </div>
              <ul className="tip-list">
                {technique.proTips.map((tip, idx) => (
                  <li key={idx}>{parseStanceText(tip, isSouthpaw)}</li>
                ))}
              </ul>
            </div>
          )}

          {technique.conditioning && technique.conditioning.length > 0 && (
            <div className="instruction-card glass-panel conditioning">
              <div className="card-header">
                <Dumbbell className="icon-dumbbell" />
                <h2>Synergistic Foods & Bio-boosts</h2>
              </div>
              <ul className="conditioning-list">
                {technique.conditioning.map((drill, idx) => (
                  <li key={idx}>{parseStanceText(drill, isSouthpaw)}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Gym Workout CTA */}
          {workout && (
            <Link href={`/food/${id}/prep`} className="workout-cta-card glass-panel">
              <div className="workout-cta-icon">
                <Dumbbell size={24} />
              </div>
              <div className="workout-cta-text">
                <h3>Fueling Guide: {workout.title}</h3>
                <p>{workout.exercises.length} prep steps · {workout.duration} · Prepare this food to optimize your fuel intake</p>
              </div>
              <ArrowRight size={20} className="workout-cta-arrow" />
            </Link>
          )}

          {/* Track Harvest on Camera CTA */}
          {['jab', 'cross', 'lead-hook', 'rear-uppercut'].includes(id) && (
            <Link href={`/kitchen?tab=tracker&mode=practice&tech=${id}`} className="practice-cta-card glass-panel">
              <div className="practice-cta-icon">
                <Camera size={24} />
              </div>
              <div className="practice-cta-text">
                <h3>Practice on Camera</h3>
                <p>Use your device camera and real-time movement detection to harvest virtual ingredients.</p>
              </div>
              <ArrowRight size={20} className="practice-cta-arrow" />
            </Link>
          )}

          {/* Practice CTA */}
          <div className="technique-practice-cta glass-panel">
            <span className="technique-practice-badge">🌱 HARVEST ENGINE</span>
            <h3>Ready to harvest {technique.name}?</h3>
            <p>Start the webcam interactive harvest coach to gather this ingredient.</p>
            <div className="technique-practice-actions">
              <Link href="/kitchen" className="btn-primary">Launch Harvest Coach →</Link>
            </div>
          </div>

          {/* In-content ad */}
          <AdBanner format="horizontal" className="in-content-ad" />

          {/* Knowledge Check Quiz */}
          <KnowledgeCheck techniqueId={id} techniqueName={technique.name} />

          {/* Scientific Evidence & Citations */}
          {technique.citations && technique.citations.length > 0 && (
            <div className="instruction-card glass-panel citations-card" style={{ marginTop: '1.5rem' }}>
              <div className="card-header">
                <BookOpen className="icon-target" />
                <h2>Scientific Evidence & Citations</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                PlateWiki is committed to evidence-based sports science. The nutritional claims for {technique.name} are backed by the following peer-reviewed studies:
              </p>
              <ul className="citations-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {technique.citations.map((citation, idx) => (
                  <li key={idx} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: idx === (technique.citations?.length ?? 0) - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 700 }}>
                      <a href={citation.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                        {citation.title}
                      </a>
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      Source: {citation.source}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="tech-sidebar">
          <div className="warning-card glass-panel">
            <div className="card-header warning-header">
              <AlertTriangle className="icon-warning" />
              <h2>Common Pitfalls & Warnings</h2>
            </div>
            <ul className="mistake-list">
              {technique.mistakes?.map((mistake, idx) => (
                <li key={idx}>{mistake}</li>
              ))}
            </ul>
          </div>

          {/* Discord Form Check Sidebar Card */}
          <div className="sidebar-discord glass-panel">
            <div className="sidebar-discord-badge">
              <MessageSquare size={12} /> COMMUNITY KITCHEN
            </div>
            <h3>Share Your Meal Prep</h3>
            <p>
              Unsure if your macro balance is correct? Upload a photo of your plate to get direct feedback from other bio-athletes.
            </p>
            <div className="sidebar-discord-channels">
              <span className="sidebar-channel-tag">#recipe-swap</span>
              <span className="sidebar-channel-tag">#ask-the-nutritionist</span>
            </div>
            <a 
              href={hasJoinedDiscord ? "discord://discord.gg/Vhygw7DpVM" : "https://discord.gg/Vhygw7DpVM"}
              onClick={handleJoinDiscord}
              target="_blank" 
              rel="noopener noreferrer" 
              className="sidebar-discord-btn"
            >
              {hasJoinedDiscord ? "Open Discord App" : "Share Meal Photo"}
            </a>
          </div>

          {technique.combinations && technique.combinations.length > 0 && (
            <div className="combo-card glass-panel">
              <div className="card-header">
                <h2>Recipe Combinations</h2>
              </div>
              <div className="combo-links">
                {technique.combinations.map((combo, idx) => (
                  <Link href={`/food/${combo.link}`} key={idx} className="combo-btn">
                    {combo.name} <ArrowRight size={16} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Techniques */}
          {relatedTechs.length > 0 && (
            <div className="related-card glass-panel">
              <div className="card-header">
                <Users size={18} />
                <h2>Related Foods</h2>
              </div>
              <div className="related-links">
                {relatedTechs.map(t => (
                  <Link href={`/food/${t.id}`} key={t.id} className="related-link">
                    <span className="related-name">{t.name}</span>
                    <span className="related-cat">{t.category}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles — cross-link to articles hub */}
          {(() => {
            const relatedArticles = getArticlesForTechnique(id);
            return relatedArticles.length > 0 ? (
              <div className="related-card glass-panel">
                <div className="card-header">
                  <BookOpen size={18} />
                  <h2>Related Reading</h2>
                </div>
                <div className="related-links">
                  {relatedArticles.map(art => (
                    <Link href={`/articles/${art.id}`} key={art.id} className="related-link">
                      <span className="related-name">{art.title}</span>
                      <span className="related-cat">{art.readTime}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* Glossary Terms — cross-link to glossary hub */}
          {(() => {
            const glossaryTerms = glossary
              .filter(g => g.relatedTechnique === id)
              .slice(0, 4);
            return glossaryTerms.length > 0 ? (
              <div className="related-card glass-panel">
                <div className="card-header">
                  <Tag size={18} />
                  <h2>Glossary</h2>
                </div>
                <div className="related-links">
                  {glossaryTerms.map(g => (
                    <Link href={`/glossary/${toSlug(g.term)}`} key={g.term} className="related-link glossary-link">
                      <span className="related-name">{g.term}</span>
                      <span className="related-definition">{g.definition.slice(0, 60)}…</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* Gear Recommendation */}
          <div className="sidebar-gear">
            <h4 className="sidebar-gear-title">Recommended Kitchen Tools</h4>
            {suggestedGear.map(gear => (
              <GearCard key={gear.id} {...gear} />
            ))}
          </div>

          <div className="sidebar-ad-wrapper">
            <AdBanner format="rectangle" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechniquePage;
