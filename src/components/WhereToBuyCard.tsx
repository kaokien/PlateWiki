'use client';
import React, { useState } from 'react';
import { ShoppingCart, ExternalLink, ChevronDown, TrendingUp } from 'lucide-react';
import type { PurchaseOption } from '../data/purchaseOptions';
import { analytics } from '../utils/analytics';
import './WhereToBuyCard.css';

/** Emoji map for store names */
const STORE_ICONS: Record<string, string> = {
  'Walmart': '🟦',
  'Costco': '🏪',
  'Amazon': '📦',
  'Amazon Fresh': '📦',
  'Whole Foods': '🥬',
  'Trader Joe\'s': '🌻',
  'Target': '🎯',
  'iHerb': '🌿',
  'GNC': '💪',
};

/** Badge display labels */
const BADGE_LABELS: Record<string, string> = {
  'best-value': 'Best Value',
  'highest-quality': 'Top Quality',
  'most-convenient': 'Convenient',
};

interface WhereToBuyCardProps {
  options: PurchaseOption[] | undefined;
  foodId: string;
  foodName: string;
}

const WhereToBuyCard: React.FC<WhereToBuyCardProps> = ({ options, foodId, foodName }) => {
  const [expanded, setExpanded] = useState(false);
  const hasOptions = options && options.length > 0;

  const INITIAL_SHOW = 3;
  const visibleOptions = hasOptions
    ? expanded ? options : options.slice(0, INITIAL_SHOW)
    : [];
  const hasMore = hasOptions && options.length > INITIAL_SHOW;

  const handleStoreClick = (option: PurchaseOption) => {
    analytics.storeClick(foodId, option.store, option.priceRange);
  };

  // Price summary — grab the best-value option or first one
  const bestValue = hasOptions ? options.find(o => o.badge === 'best-value') || options[0] : null;

  return (
    <div className="where-to-buy-card glass-panel" style={{ padding: '1.25rem' }}>
      <div className="where-to-buy-header">
        <ShoppingCart size={18} className="where-to-buy-icon" />
        <h2>Where to Buy</h2>
      </div>

      {hasOptions ? (
        <>
          {bestValue && (
            <div className="price-summary">
              <TrendingUp size={14} className="price-summary-icon" />
              From {bestValue.priceRange} {bestValue.unit}
            </div>
          )}

          <div className="store-list">
            {visibleOptions.map((option, idx) => {
              const icon = STORE_ICONS[option.store] || '🏬';
              const Tag = option.link ? 'a' : 'div';
              const linkProps = option.link
                ? { href: option.link, target: '_blank' as const, rel: 'noopener noreferrer' }
                : {};

              return (
                <Tag
                  key={`${option.store}-${idx}`}
                  className="store-row"
                  onClick={() => option.link && handleStoreClick(option)}
                  {...linkProps}
                >
                  <div className={`store-icon ${option.storeType}`}>
                    {icon}
                  </div>
                  <div className="store-info">
                    <div className="store-name-row">
                      <span className="store-name">{option.store}</span>
                      {option.badge && (
                        <span className={`store-badge ${option.badge}`}>
                          {BADGE_LABELS[option.badge]}
                        </span>
                      )}
                    </div>
                    <span className="store-price">
                      {option.priceRange} {option.unit}
                    </span>
                    {option.note && (
                      <span className="store-note"> · {option.note}</span>
                    )}
                  </div>
                  {option.link && (
                    <ExternalLink size={14} className="store-link-arrow" />
                  )}
                </Tag>
              );
            })}
          </div>

          {hasMore && (
            <button
              className="store-expand-btn"
              onClick={() => setExpanded(prev => !prev)}
              aria-expanded={expanded}
            >
              <ChevronDown size={14} className={`store-expand-icon ${expanded ? 'expanded' : ''}`} />
              {expanded ? 'Show fewer' : `+${options.length - INITIAL_SHOW} more stores`}
            </button>
          )}

          <p className="where-to-buy-disclaimer">
            Prices are approximate US averages and may vary by location. Last verified July 2026.
          </p>
        </>
      ) : (
        <div className="where-to-buy-empty">
          <span className="where-to-buy-empty-icon">🏷️</span>
          <p>
            Pricing data for <strong>{foodName}</strong> is coming soon.
            Have store suggestions? Share them in the community kitchen!
          </p>
        </div>
      )}
    </div>
  );
};

export default WhereToBuyCard;
