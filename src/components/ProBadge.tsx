import React from 'react';
import { Crown } from 'lucide-react';

/**
 * ProBadge — small pill badge indicating a Pro-only feature.
 * @param {string} size — 'sm' or 'md'
 */
const ProBadge = ({ size = 'sm' }) => {
  // No payment processor — hide Pro badges in production
  if (process.env.NODE_ENV === 'production') return null;

  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem',
    padding: size === 'sm' ? '0.15rem 0.45rem' : '0.2rem 0.6rem',
    fontSize: size === 'sm' ? '0.6rem' : '0.7rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#f5a623',
    background: 'rgba(245, 166, 35, 0.1)',
    border: '1px solid rgba(245, 166, 35, 0.2)',
    borderRadius: '999px',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  };

  return (
    <span style={styles}>
      <Crown size={size === 'sm' ? 10 : 12} />
      PRO
    </span>
  );
};

export default ProBadge;
