import React from 'react';

interface BoxingGloveIconProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Boxing glove SVG icon — matches Lucide's stroke-based style.
 * Used for the stance toggle (Orthodox / Southpaw).
 */
export function BoxingGloveIcon({ size = 24, color = 'currentColor', className }: BoxingGloveIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Glove body */}
      <path d="M18 11c0-3.5-2-6-5.5-6C9 5 7 7.5 7 11c0 1.5.5 3 1.5 4L7 18c-.5 1 0 2 1 2h8c1 0 1.5-1 1-2l-1.5-3c1-1 2.5-2.5 2.5-4z" />
      {/* Thumb */}
      <path d="M7 11c-1.5 0-3-.5-3-2.5S5.5 5 7 5" />
      {/* Wrist strap */}
      <path d="M8 20v1c0 .5.5 1 1 1h6c.5 0 1-.5 1-1v-1" />
      {/* Lace detail */}
      <line x1="12" y1="8" x2="12" y2="12" />
    </svg>
  );
}
