import React from 'react';

interface GearIconProps {
  size?: number;
  className?: string;
}

/**
 * Filled boxing glove — bold silhouette, instantly recognizable.
 */
export function GloveFilledIcon({ size = 24, className }: GearIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M17.5 4C15.5 4 14 5 13 6.5C12 5 10.5 4 8.5 4C5.5 4 4 6.5 4 9.5c0 2 .8 3.5 2 4.5l-1 3c-.3.8.2 1.5 1 1.5h12c.8 0 1.3-.7 1-1.5l-1-3c1.2-1 2-2.5 2-4.5C20 6.5 18.5 4 17.5 4zM8 20.5v1c0 .3.2.5.5.5h7c.3 0 .5-.2.5-.5v-1H8z"
      />
      <path fill="currentColor" opacity="0.4" d="M10 8.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    </svg>
  );
}

/**
 * Filled hand wraps — rolled bandage silhouette.
 */
export function WrapsFilledIcon({ size = 24, className }: GearIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
      {/* Wrap roll */}
      <circle cx="12" cy="9" r="5.5" fill="currentColor" />
      <circle cx="12" cy="9" r="2.5" fill="var(--color-bg, #0a0a0a)" />
      {/* Trailing end */}
      <path fill="currentColor" d="M14 14h-4c-.5 0-1 .3-1.2.7l-2.3 4.6c-.3.6.1 1.2.8 1.2h1.4c.4 0 .7-.2.9-.5L12 16l2.4 4c.2.3.5.5.9.5h1.4c.7 0 1.1-.6.8-1.2l-2.3-4.6c-.2-.4-.7-.7-1.2-.7z" />
    </svg>
  );
}

/**
 * Filled headgear — boxing headguard silhouette.
 */
export function HeadgearFilledIcon({ size = 24, className }: GearIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
      {/* Head shell */}
      <path
        fill="currentColor"
        d="M12 2C7.6 2 4 5.1 4 9v3c0 1.1.4 2.1 1 3v2.5c0 .8.7 1.5 1.5 1.5H7v1.5c0 .8.7 1.5 1.5 1.5h7c.8 0 1.5-.7 1.5-1.5V19h.5c.8 0 1.5-.7 1.5-1.5V15c.6-.9 1-1.9 1-3V9c0-3.9-3.6-7-8-7z"
      />
      {/* Face cutout */}
      <path fill="var(--color-bg, #0a0a0a)" d="M8.5 9C8.5 7.6 10 6.5 12 6.5s3.5 1.1 3.5 2.5v4c0 1.4-1.5 2.5-3.5 2.5S8.5 14.4 8.5 13V9z" />
      {/* Chin strap */}
      <path fill="currentColor" opacity="0.5" d="M9 17h6v1.5H9z" />
    </svg>
  );
}

/**
 * Filled focus mitts — coaching pad silhouette.
 */
export function MittsFilledIcon({ size = 24, className }: GearIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
      {/* Mitt body */}
      <path
        fill="currentColor"
        d="M18 5c0-1.7-1.3-3-3-3H9C7.3 2 6 3.3 6 5v10c0 1.7 1.3 3 3 3h6c1.7 0 3-1.3 3-3V5z"
      />
      {/* Target circle */}
      <circle cx="12" cy="10" r="4" fill="var(--color-bg, #0a0a0a)" />
      <circle cx="12" cy="10" r="2.2" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="10" r="0.8" fill="var(--color-bg, #0a0a0a)" />
      {/* Handle */}
      <path fill="currentColor" opacity="0.5" d="M9 19h6v3H9z" />
    </svg>
  );
}

/**
 * Filled boxing set — gift box / bundle silhouette.
 */
export function SetFilledIcon({ size = 24, className }: GearIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
      {/* Box body */}
      <rect x="3" y="10" width="18" height="11" rx="2" fill="currentColor" />
      {/* Box lid */}
      <rect x="2" y="7" width="20" height="4" rx="1.5" fill="currentColor" />
      {/* Ribbon vertical */}
      <rect x="10.5" y="7" width="3" height="14" fill="var(--color-bg, #0a0a0a)" opacity="0.3" />
      {/* Ribbon horizontal */}
      <rect x="2" y="8" width="20" height="2" fill="var(--color-bg, #0a0a0a)" opacity="0.15" />
      {/* Bow */}
      <path fill="currentColor" d="M12 7c-1.5-1.5-3-2.5-4-2s-.5 2 1 3.5h6c1.5-1.5 2-3 1-3.5s-2.5.5-4 2z" />
    </svg>
  );
}

/**
 * Filled sparring glove — tilted silhouette with laces on the cuff.
 */
export function SparringGloveFilledIcon({ size = 24, className }: GearIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M19 11c0-3.87-3.13-7-7-7c-2.1 0-3.98.92-5.27 2.4C5.61 5.43 4.28 5 3 5c0 3 2 4.5 2 7.5c0 1.25.43 2.4 1.15 3.3L4.44 20.3C4.1 21.3 4.8 22 5.8 22h8.4c.8 0 1.5-.6 1.7-1.4l1.37-5.5c1.07-.94 1.73-2.3 1.73-4.1z"
      />
      <path
        d="M9 16.5l4 2.5M13 16.5l-4 2.5"
        stroke="var(--color-bg, #0a0a0a)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M9 18.5l4 2.5M13 18.5l-4 2.5"
        stroke="var(--color-bg, #0a0a0a)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

