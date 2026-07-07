'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import './TechniqueOfTheDay.css';

/**
 * Deterministic daily technique rotation.
 * Uses a simple date-based hash so every user sees the same technique on the same day,
 * and it changes at midnight local time.
 *
 * The technique dataset is dynamically imported after mount so this card
 * (which needs full descriptions) doesn't pull ~400KB of data into the
 * homepage's initial bundle.
 */
function pickTechniqueOfTheDay(techEntries: any[]): any {
  const now = new Date();
  const dayHash = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const index = dayHash % techEntries.length;
  return techEntries[index];
}

const TechniqueOfTheDay = () => {
  const [technique, setTechnique] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    import('../data/foods').then(({ techniques }) => {
      if (!cancelled) setTechnique(pickTechniqueOfTheDay(Object.values(techniques)));
    });
    return () => { cancelled = true; };
  }, []);

  // Skeleton with the card's own classes so the slot keeps its footprint
  // while the data chunk loads (avoids layout shift)
  if (!technique) {
    return (
      <div className="totd-card glass-panel" aria-hidden="true">
        <div className="totd-badge">
          <Sparkles size={14} />
          <span>SUPERFOOD OF THE DAY</span>
        </div>
        <div className="totd-content">
          <div className="totd-info">
            <span className="totd-category">&nbsp;</span>
            <h3 className="totd-name">&nbsp;</h3>
            <p className="totd-desc">&nbsp;</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/food/${technique.id}`} className="totd-card glass-panel">
      <div className="totd-badge">
        <Sparkles size={14} />
        <span>SUPERFOOD OF THE DAY</span>
      </div>
      <div className="totd-content">
        <div className="totd-info">
          <span className="totd-category">{technique.category}</span>
          <h3 className="totd-name">{technique.name}</h3>
          <p className="totd-desc">
            {technique.description?.substring(0, 120)}{technique.description?.length > 120 ? '…' : ''}
          </p>
        </div>
        <div className="totd-cta">
          <span className="totd-cta-text">Learn</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
};

export default TechniqueOfTheDay;
