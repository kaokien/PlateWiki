'use client';

import React from 'react';

/**
 * Custom SVG rank icons for the athlete progression system.
 * Replace emojis with hand-crafted, consistent, accessible icons.
 * Each icon is 24x24 by default, inline SVG for zero network cost.
 */

interface RankIconProps {
  size?: number;
  color?: string;
  className?: string;
}

// Prospect — athletic nutrition glove (outline, humble)
export function ProspectIcon({ size = 24, color = 'currentColor', className }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18.5 8.5C18.5 6 16.5 4 14 4H11C8.5 4 6.5 6 6.5 8.5V12C6.5 13.5 7.5 15 9 15.5V19C9 19.6 9.4 20 10 20H14C14.6 20 15 19.6 15 19V15.5C16.5 15 17.5 13.5 17.5 12" />
      <path d="M18.5 8.5C18.5 10.5 17.5 12 17.5 12" />
      <path d="M9 12H15" />
    </svg>
  );
}

// Contender — wrapped fist (rising)
export function ContenderIcon({ size = 24, color = 'currentColor', className }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 11V7C7 5.34 8.34 4 10 4H14C15.66 4 17 5.34 17 7V11" />
      <path d="M7 11C5.9 11 5 11.9 5 13V14C5 15.1 5.9 16 7 16H17C18.1 16 19 15.1 19 14V13C19 11.9 18.1 11 17 11" />
      <path d="M9 16V20" />
      <path d="M15 16V20" />
      <path d="M7 11H17" />
      <line x1="10" y1="8" x2="14" y2="8" />
    </svg>
  );
}

// Gatekeeper — shield (defensive mastery)
export function GatekeeperIcon({ size = 24, color = 'currentColor', className }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3L4 7V12C4 16.42 7.5 20.74 12 21C16.5 20.74 20 16.42 20 12V7L12 3Z" />
      <path d="M9 12L11 14L15 10" />
    </svg>
  );
}

// Rising Star — star with motion lines
export function RisingStarIcon({ size = 24, color = 'currentColor', className }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={color} fillOpacity="0.15" />
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

// Champion — championship belt
export function ChampionIcon({ size = 24, color = 'currentColor', className }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="10" width="18" height="6" rx="1" />
      <path d="M7 10V8C7 6.9 7.9 6 9 6H15C16.1 6 17 6.9 17 8V10" />
      <path d="M7 16V18" />
      <path d="M17 16V18" />
      <circle cx="12" cy="13" r="2" fill={color} fillOpacity="0.2" />
    </svg>
  );
}

// Hall of Famer — trophy with laurels
export function HallOfFamerIcon({ size = 24, color = 'currentColor', className }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M8 21H16" />
      <path d="M12 17V21" />
      <path d="M7 4H17V8C17 11.31 14.76 14 12 14C9.24 14 7 11.31 7 8V4Z" fill={color} fillOpacity="0.1" />
      <path d="M7 4H17V8C17 11.31 14.76 14 12 14C9.24 14 7 11.31 7 8V4Z" />
      <path d="M17 8H19C20.1 8 21 7.1 21 6V5C21 4.45 20.55 4 20 4H17" />
      <path d="M7 8H5C3.9 8 3 7.1 3 6V5C3 4.45 3.45 4 4 4H7" />
      <path d="M10 4V2" />
      <path d="M14 4V2" />
    </svg>
  );
}

// Map rank name -> component
const RANK_ICON_MAP: Record<string, React.ComponentType<RankIconProps>> = {
  'Prospect': ProspectIcon,
  'Contender': ContenderIcon,
  'Gatekeeper': GatekeeperIcon,
  'Rising Star': RisingStarIcon,
  'Champion': ChampionIcon,
  'Hall of Famer': HallOfFamerIcon,
};

/**
 * Render the appropriate rank icon by name.
 * Falls back to ProspectIcon for unknown ranks.
 */
export function RankIcon({ rankName, size = 24, color = 'currentColor', className }: RankIconProps & { rankName: string }) {
  const IconComponent = RANK_ICON_MAP[rankName] || ProspectIcon;
  return <IconComponent size={size} color={color} className={className} />;
}
