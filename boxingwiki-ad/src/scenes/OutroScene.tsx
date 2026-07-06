import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { COLORS, FONT_FAMILY, FONT_FAMILY_DISPLAY } from '../lib/config';

// Ring ropes
const RingRopes: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <group>
      {/* Three horizontal ropes */}
      {[-0.8, 0, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 8, 16]} />
          <meshStandardMaterial
            color="#DC2626"
            roughness={0.3}
            metalness={0.4}
            emissive="#DC2626"
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
      {/* Vertical posts */}
      {[-4, 4].map((x, i) => (
        <mesh key={`post-${i}`} position={[x, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 2.4, 12]} />
          <meshStandardMaterial
            color="#374151"
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>
      ))}
      {/* Turnbuckles */}
      {[-4, 4].map((x) =>
        [-0.8, 0, 0.8].map((y, j) => (
          <mesh key={`tb-${x}-${j}`} position={[x, y, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial
              color="#9CA3AF"
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>
        ))
      )}
    </group>
  );
};

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Camera flies through the ropes
  const cameraZ = interpolate(frame, [0, fps * 2.5], [6, 1.5], {
    extrapolateRight: 'clamp',
  });

  // Text reveals
  const urlOpacity = interpolate(frame, [fps * 2.5, fps * 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const urlProgress = spring({
    frame: Math.max(0, frame - Math.round(fps * 2.5)),
    fps,
    config: { damping: 12, stiffness: 80, mass: 1 },
  });
  const urlScale = interpolate(urlProgress, [0, 1], [0.8, 1]);

  const ctaOpacity = interpolate(frame, [fps * 3.3, fps * 3.8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 3D scene opacity (fade out as text appears)
  const sceneOpacity = interpolate(frame, [fps * 2, fps * 3], [1, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 3D Ring Ropes */}
      <div style={{ opacity: sceneOpacity, width: '100%', height: '100%' }}>
        <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, cameraZ], fov: 45 }}>
          <ambientLight intensity={0.2} />
          <spotLight
            position={[0, 5, 3]}
            intensity={2}
            angle={0.5}
            penumbra={0.7}
            color="#ffffff"
          />
          <pointLight position={[3, 0, 2]} intensity={0.5} color="#DC2626" />
          <pointLight position={[-3, 0, 2]} intensity={0.3} color="#00F0FF" />
          <RingRopes />
          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#111111" roughness={0.9} />
          </mesh>
        </ThreeCanvas>
      </div>

      {/* URL + CTA overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* URL */}
        <div
          style={{
            opacity: urlOpacity,
            transform: `scale(${urlScale})`,
            fontFamily: "'Courier New', monospace",
            fontSize: 42,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: 2,
            textShadow: `0 0 20px ${COLORS.primary}60`,
          }}
        >
          boxingwiki.vercel.app
        </div>

        {/* CTA */}
        <div
          style={{
            opacity: ctaOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY_DISPLAY,
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.textMuted,
              letterSpacing: 6,
            }}
          >
            FREE · NO SIGNUP · START TRAINING
          </div>
          {/* Accent line */}
          <div
            style={{
              width: 120,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${COLORS.primary}, transparent)`,
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 30%, ${COLORS.bg} 100%)`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
