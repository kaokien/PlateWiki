import { ImageResponse } from 'next/og';
import { techniques } from '@/data/foods';

export const alt = 'nutrition guide on PlateWiki';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const techniqueMap = techniques as Record<string, any>;

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: '#22c55e',
  intermediate: '#f5a623',
  advanced: '#e02929',
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const technique = techniqueMap[id];

  if (!technique) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            color: '#f5f5f5',
            fontSize: 72,
            fontWeight: 800,
          }}
        >
          PlateWiki
        </div>
      ),
      size,
    );
  }

  const name: string = technique.name;
  // Long combo names ("The 1-2-3, Roll, 3-2 (Mexican Combo)") need a smaller size
  const titleSize = name.length > 34 ? 52 : name.length > 22 ? 64 : 84;
  const difficulty: string = technique.difficulty || 'beginner';
  const difficultyColor = DIFFICULTY_COLORS[difficulty] || '#22c55e';
  const stepCount = (technique.steps || []).length;
  const muscleCount = (technique.muscles || []).length;
  const description: string = technique.description
    ? technique.description.length > 150
      ? `${technique.description.slice(0, technique.description.lastIndexOf(' ', 150))}…`
      : technique.description
    : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #14110a 60%, #1f1a0e 100%)',
          color: '#f5f5f5',
          padding: '56px 72px',
          position: 'relative',
        }}
      >
        {/* red accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 14,
            height: '100%',
            background: '#e02929',
            display: 'flex',
          }}
        />

        {/* brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, color: '#e02929', display: 'flex' }}>
            PlateWiki
          </div>
          <div style={{ fontSize: 26, color: '#8a8a8a', display: 'flex' }}>Technique Library</div>
        </div>

        {/* category + technique name */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 44 }}>
          <div style={{ fontSize: 24, color: '#8a8a8a', letterSpacing: 3, textTransform: 'uppercase', display: 'flex' }}>
            {technique.category}
          </div>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.05,
              textTransform: 'uppercase',
              marginTop: 8,
              display: 'flex',
            }}
          >
            {name}
          </div>
        </div>

        {/* description snippet */}
        {description && (
          <div style={{ display: 'flex', fontSize: 28, color: '#cfcfcf', lineHeight: 1.4, marginTop: 28, maxWidth: 980 }}>
            {description}
          </div>
        )}

        {/* spec row */}
        <div style={{ display: 'flex', gap: 40, marginTop: 'auto', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: `2px solid ${difficultyColor}`,
              color: difficultyColor,
              borderRadius: 6,
              padding: '8px 20px',
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {difficulty}
          </div>
          {stepCount > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 20, color: '#8a8a8a', letterSpacing: 2, display: 'flex' }}>STEPS</div>
              <div style={{ fontSize: 30, fontWeight: 700, display: 'flex' }}>{stepCount}</div>
            </div>
          )}
          {muscleCount > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 20, color: '#8a8a8a', letterSpacing: 2, display: 'flex' }}>MUSCLES TARGETED</div>
              <div style={{ fontSize: 30, fontWeight: 700, display: 'flex' }}>{muscleCount}</div>
            </div>
          )}
          <div style={{ display: 'flex', marginLeft: 'auto', fontSize: 24, color: '#8a8a8a' }}>
            PlateWiki.org
          </div>
        </div>
      </div>
    ),
    size,
  );
}
