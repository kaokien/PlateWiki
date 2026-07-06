import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { COLORS, FONT_FAMILY_DISPLAY, FPS } from '../lib/config';

// Stylized boxing glove built from Three.js primitives
const BoxingGlove: React.FC = () => {
  const frame = useCurrentFrame();
  const rotY = frame * 0.025;
  const rotX = Math.sin(frame * 0.015) * 0.15;
  const bobY = Math.sin(frame * 0.04) * 0.08;

  return (
    <group rotation={[rotX, rotY, 0]} position={[0, bobY, 0]}>
      {/* Main glove body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#DC2626"
          roughness={0.35}
          metalness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>
      {/* Thumb */}
      <mesh position={[-0.9, 0.3, 0.5]} rotation={[0, 0, 0.6]}>
        <capsuleGeometry args={[0.28, 0.5, 16, 16]} />
        <meshStandardMaterial
          color="#B91C1C"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {/* Wrist cuff */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.75, 0.85, 0.6, 32]} />
        <meshStandardMaterial
          color="#1F2937"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      {/* Lace detail on top */}
      <mesh position={[0, 0.5, 0.8]}>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.5, 0.78]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
      </mesh>
      <mesh position={[-0.15, 0.5, 0.78]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
      </mesh>
      {/* Knuckle ridge */}
      <mesh position={[0, 0.35, 0.95]} rotation={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.18, 0.8, 12, 12]} />
        <meshStandardMaterial
          color="#EF4444"
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
};

// Floating particles
const Particles: React.FC = () => {
  const frame = useCurrentFrame();

  const particles = React.useMemo(() => {
    const pts: Array<{ x: number; y: number; z: number; speed: number; size: number }> = [];
    for (let i = 0; i < 60; i++) {
      pts.push({
        x: (Math.random() - 0.5) * 12,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 8,
        speed: 0.002 + Math.random() * 0.005,
        size: 0.02 + Math.random() * 0.04,
      });
    }
    return pts;
  }, []);

  return (
    <>
      {particles.map((p, i) => {
        const y = p.y + Math.sin(frame * p.speed * 10 + i) * 0.5;
        const opacity = interpolate(
          Math.sin(frame * 0.02 + i * 0.5),
          [-1, 1],
          [0.1, 0.6]
        );
        return (
          <mesh key={i} position={[p.x, y, p.z]}>
            <sphereGeometry args={[p.size, 8, 8]} />
            <meshBasicMaterial color="#DC2626" transparent opacity={opacity} />
          </mesh>
        );
      })}
    </>
  );
};

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Camera pull-back
  const cameraZ = interpolate(frame, [0, fps * 2.5], [3, 5.5], {
    extrapolateRight: 'clamp',
  });

  // Glove fade out
  const gloveOpacity = interpolate(frame, [fps * 2.8, fps * 3.2], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Logo reveal
  const logoProgress = spring({
    frame: Math.max(0, frame - fps * 3),
    fps,
    config: { damping: 12, stiffness: 100, mass: 1 },
  });

  const logoScale = interpolate(logoProgress, [0, 1], [3, 1]);
  const logoOpacity = interpolate(frame, [fps * 2.8, fps * 3.2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Vignette
  const vignetteOpacity = interpolate(frame, [0, fps * 0.5], [1, 0.4], {
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
      {/* 3D Scene */}
      <div style={{ opacity: gloveOpacity, width: '100%', height: '100%' }}>
        <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, cameraZ], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
          <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#DC2626" />
          <pointLight position={[0, -2, 3]} intensity={0.6} color="#00F0FF" />
          <BoxingGlove />
          <Particles />
        </ThreeCanvas>
      </div>

      {/* Logo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY_DISPLAY,
            fontWeight: 900,
            fontSize: 96,
            letterSpacing: 6,
            display: 'flex',
            gap: 16,
          }}
        >
          <span style={{ color: COLORS.primary }}>BOXING</span>
          <span style={{ color: COLORS.text }}>WIKI</span>
        </div>
      </div>

      {/* Vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, ${COLORS.bg} 100%)`,
          opacity: vignetteOpacity,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
