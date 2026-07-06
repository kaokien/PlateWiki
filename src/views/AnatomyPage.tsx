'use client';
import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, ArrowLeft, Crosshair } from 'lucide-react';
import AdBanner from '../components/AdBanner';
import { bodyParts, techniques } from '../data/techniques';
import './AnatomyPage.css';

// Adjacency map: which muscles are anatomically related
const muscleRelations: Record<string, string[]> = {
  head: ['neck', 'trapezius'],
  neck: ['head', 'trapezius', 'front-deltoids', 'back-deltoids'],
  'front-deltoids': ['neck', 'chest', 'triceps', 'biceps'],
  'back-deltoids': ['neck', 'trapezius', 'upper-back', 'triceps'],
  chest: ['front-deltoids', 'triceps', 'abs', 'obliques'],
  triceps: ['front-deltoids', 'chest', 'forearm'],
  biceps: ['front-deltoids', 'forearm'],
  forearm: ['biceps', 'triceps'],
  abs: ['obliques', 'chest', 'lower-back'],
  obliques: ['abs', 'lower-back', 'gluteal'],
  quadriceps: ['hamstring', 'gluteal', 'calves', 'abductors'],
  hamstring: ['quadriceps', 'gluteal', 'calves'],
  gluteal: ['hamstring', 'obliques', 'lower-back', 'quadriceps'],
  calves: ['quadriceps', 'hamstring'],
  adductor: ['quadriceps', 'abductors', 'hamstring'],
  abductors: ['quadriceps', 'adductor', 'gluteal'],
  trapezius: ['neck', 'back-deltoids', 'upper-back'],
  'upper-back': ['trapezius', 'back-deltoids', 'lower-back'],
  'lower-back': ['upper-back', 'abs', 'obliques', 'gluteal'],
};

const AnatomyPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const muscle = bodyParts[id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!muscle) {
    return (
      <div className="anatomy-not-found glass-panel">
        <h2>Muscle group not found</h2>
        <p>The muscle group you're looking for doesn't exist in our database.</p>
        <Link href="/" className="back-link-btn">
          <ArrowLeft size={18} /> Back to Interactive Map
        </Link>
      </div>
    );
  }

  const relatedTechniques = Object.values(techniques).filter(t => t.muscles && t.muscles.includes(id));

  // Related muscles (#18)
  const relatedMuscles = useMemo(() => {
    const relations = muscleRelations[id] || [];
    return relations
      .filter(mId => bodyParts[mId])
      .map(mId => ({ id: mId, ...bodyParts[mId] }));
  }, [id]);

  return (
    <div className="anatomy-page">
{/* Professional breadcrumb navigation */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="breadcrumb-link">Interactive Map</Link>
        <ChevronRight size={14} className="breadcrumb-chevron" />
        <span className="breadcrumb-current">{muscle.name}</span>
      </nav>

      <div className="glass-panel anatomy-hero">
        <div className="anatomy-badge">
          <Crosshair size={14} />
          <span>Anatomy Focus</span>
        </div>
        <h1 className="muscle-title">{muscle.name}</h1>
        <h3 className="muscle-subtitle">{muscle.shortDesc}</h3>
        <p className="muscle-description">{muscle.description}</p>
        
        <div className="ad-wrapper">
          <AdBanner format="horizontal" />
        </div>
      </div>

      <div className="techniques-section">
        <h2>Techniques Using The {muscle.name}</h2>
        <div className="techniques-grid">
          {relatedTechniques.length > 0 ? (
            relatedTechniques.map(tech => (
              <Link href={`/technique/${tech.id}?from=${id}`} key={tech.id} className="glass-panel technique-card-large" aria-label={`${tech.name} — ${tech.category}`}>
                <div className="card-top-row">
                  <span className="tech-category">{tech.category}</span>
                  {tech.difficulty && (
                    <span className={`difficulty-badge ${tech.difficulty}`}>
                      {tech.difficulty === 'beginner' ? '• ' : tech.difficulty === 'intermediate' ? '•• ' : '••• '}
                      {tech.difficulty}
                    </span>
                  )}
                </div>
                <h3>{tech.name}</h3>
                <p>{tech.description}</p>
                <div className="read-more">Learn Technique →</div>
              </Link>
            ))
          ) : (
            <div className="glass-panel empty-tech">
              <p>No techniques mapped to this muscle group yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Muscle Groups (#18) */}
      {relatedMuscles.length > 0 && (
        <div className="related-muscles-section">
          <h2>Related Muscle Groups</h2>
          <div className="related-muscles-grid">
            {relatedMuscles.map(m => (
              <Link href={`/anatomy/${m.id}`} key={m.id} className="glass-panel related-muscle-card">
                <h4>{m.name}</h4>
                <span className="related-desc">{m.shortDesc}</span>
                <span className="read-more">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnatomyPage;
