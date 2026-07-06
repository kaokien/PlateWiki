import React from 'react';

/**
 * The front-view body silhouette used by the anatomy map.
 *
 * Shared between BoxerPlaceholder (SSR placeholder for the interactive
 * model) and the dashboard's "jump to body map" button so the two stay
 * visually in sync. Pure JSX — safe in server components.
 *
 * Colors are set as presentation attributes on the <g>, so callers can
 * restyle via CSS (`svg g { fill: ...; stroke: ...; }`) without props.
 */
export default function BodySilhouette(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="rgba(255, 255, 255, 0.10)" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1">
        {/* head + neck */}
        <circle cx="50" cy="14" r="10" />
        <rect x="45" y="24" width="10" height="7" rx="2" />
        {/* torso */}
        <path d="M32 33 L68 33 Q71 33 71 37 L67 82 Q66 88 60 88 L40 88 Q34 88 33 82 L29 37 Q29 33 32 33 Z" />
        {/* arms */}
        <path d="M28 35 Q22 38 20 48 L15 78 Q14 84 18 85 L23 86 Q26 86 27 80 L32 48 Z" />
        <path d="M72 35 Q78 38 80 48 L85 78 Q86 84 82 85 L77 86 Q74 86 73 80 L68 48 Z" />
        {/* hands */}
        <circle cx="19" cy="93" r="5.5" />
        <circle cx="81" cy="93" r="5.5" />
        {/* hips */}
        <path d="M35 90 L65 90 Q68 90 68 94 L66 108 L34 108 L32 94 Q32 90 35 90 Z" />
        {/* legs */}
        <path d="M34 110 L48 110 L46 160 L44 196 Q44 200 40 200 L36 200 Q33 200 33 195 L33 150 Z" />
        <path d="M52 110 L66 110 L67 150 L67 195 Q67 200 64 200 L60 200 Q56 200 56 196 L54 160 Z" />
      </g>
    </svg>
  );
}
