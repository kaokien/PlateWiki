import BodySilhouette from './BodySilhouette';
import './InteractiveBoxer.css';

/**
 * Server-rendered placeholder for the InteractiveBoxer body map.
 *
 * The real component is client-only (ssr: false), so without a placeholder
 * the hero's largest element pops in only after hydration + dynamic import —
 * on mobile that made it the LCP element, gated behind seconds of JS. This
 * silhouette paints with the initial HTML (contentful, so it's LCP-eligible)
 * and reserves the same footprint to avoid layout shift when the model loads.
 */
// exact front-view muscle button labels (from bodyParts) so the grid wraps
// into the same rows and reserves the same height as the real component
const PLACEHOLDER_MUSCLES = [
  'Pectorals (Chest)', 'Obliques', 'Rectus Abdominis (Abs)', 'Biceps',
  'Triceps', 'Neck & Traps', 'Anterior Deltoids', 'Head & Neck',
  'Abductors', 'Quadriceps', 'Calves', 'Forearms',
];

export default function BoxerPlaceholder() {
  return (
    <div className="musclewiki-container" aria-hidden="true">
      <div className="view-toggle">
        <button className="view-toggle-btn active" disabled>Front</button>
        <button className="view-toggle-btn" disabled>Back</button>
      </div>
      <div className="single-model-layout">
        {/* the real model wrapper resolves to exactly 400px tall (the lib's
            svg is height:100% inside an indefinite-height parent, so its
            minHeight:400px wins) — match it exactly to avoid any shift */}
        <div className="model-wrapper" style={{ height: '400px' }}>
          <BodySilhouette
            width="100%"
            height="100%"
            role="img"
            aria-label="Loading interactive body map"
          />
        </div>
      </div>
      {/* mirrors the real component's accessible muscle list so the section
          height doesn't jump when the interactive model mounts */}
      <div className="accessible-muscle-list">
        <h3>Select a muscle group to explore:</h3>
        <div className="muscle-grid">
          {PLACEHOLDER_MUSCLES.map((name) => (
            <button key={name} className="muscle-btn" disabled style={{ opacity: 0.55 }}>
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
