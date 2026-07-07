import { ImageResponse } from 'next/og';
import { fighters } from '@/data/athletes';

export const alt = 'Fighter style breakdown on PlateWiki';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const STAT_LABELS: Record<string, string> = {
  power: 'POWER',
  speed: 'SPEED',
  defense: 'DEFENSE',
  ringIQ: 'RING IQ',
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fighter = fighters.find((f) => f.id === id);

  if (!fighter) {
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

  const stats = (fighter.stats || {}) as Record<string, number>;
  const shownStats = Object.keys(STAT_LABELS).filter((k) => typeof stats[k] === 'number');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1114 60%, #2a1218 100%)',
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
          <div style={{ fontSize: 26, color: '#8a8a8a', display: 'flex' }}>Fighter Styles</div>
        </div>

        {/* name + nickname */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 48 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, textTransform: 'uppercase', display: 'flex' }}>
            {fighter.name}
          </div>
          <div style={{ fontSize: 36, color: '#e02929', fontWeight: 700, marginTop: 8, display: 'flex' }}>
            “{fighter.nickname}”
          </div>
        </div>

        {/* style + record line */}
        <div style={{ display: 'flex', gap: 40, marginTop: 40, fontSize: 30, color: '#cfcfcf' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 22, color: '#8a8a8a', letterSpacing: 2, display: 'flex' }}>STYLE</div>
            <div style={{ fontWeight: 700, display: 'flex' }}>{fighter.style}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 22, color: '#8a8a8a', letterSpacing: 2, display: 'flex' }}>RECORD</div>
            <div style={{ fontWeight: 700, display: 'flex' }}>{fighter.record}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 22, color: '#8a8a8a', letterSpacing: 2, display: 'flex' }}>DIVISION</div>
            <div style={{ fontWeight: 700, display: 'flex' }}>{fighter.weightClass}</div>
          </div>
        </div>

        {/* stat bars */}
        <div style={{ display: 'flex', gap: 36, marginTop: 'auto' }}>
          {shownStats.map((key) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', width: 220 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#8a8a8a' }}>
                <span>{STAT_LABELS[key]}</span>
                <span style={{ color: '#f5f5f5', fontWeight: 700 }}>{stats[key]}</span>
              </div>
              <div style={{ display: 'flex', height: 10, background: '#33262a', borderRadius: 5, marginTop: 8 }}>
                <div
                  style={{
                    display: 'flex',
                    width: `${Math.min(stats[key], 100)}%`,
                    background: '#e02929',
                    borderRadius: 5,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
