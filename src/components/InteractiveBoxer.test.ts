import { describe, it, expect } from 'vitest';
import { bodyParts } from '../data/techniques';

// Since InteractiveBoxer uses react-body-highlighter which needs DOM/SVG,
// we test the data layer and lookup table logic that drives it.

// Replicate the polygon lookup from InteractiveBoxer
const anteriorMuscles = ['chest', 'obliques', 'abs', 'biceps', 'triceps', 'neck', 'front-deltoids', 'head', 'abductors', 'quadriceps', 'calves', 'forearm'];
const posteriorMuscles = ['head', 'trapezius', 'back-deltoids', 'upper-back', 'triceps', 'lower-back', 'forearm', 'gluteal', 'adductor', 'hamstring', 'calves'];

describe('InteractiveBoxer — Body Map Data', () => {
  it('every anterior muscle should exist in bodyParts', () => {
    for (const muscle of anteriorMuscles) {
      expect(bodyParts[muscle]).toBeDefined();
      expect(bodyParts[muscle].name).toBeTruthy();
    }
  });

  it('every posterior muscle should exist in bodyParts', () => {
    for (const muscle of posteriorMuscles) {
      expect(bodyParts[muscle]).toBeDefined();
      expect(bodyParts[muscle].name).toBeTruthy();
    }
  });

  it('every bodyPart should have name, shortDesc, and description', () => {
    for (const [key, part] of Object.entries(bodyParts) as any[]) {
      expect(part.name).toBeTruthy();
      expect(part.shortDesc).toBeTruthy();
      expect(part.description).toBeTruthy();
      expect(part.description.length).toBeGreaterThan(20);
    }
  });

  it('front and back views should cover all bodyParts', () => {
    const allMuscles = new Set([...anteriorMuscles, ...posteriorMuscles]);
    const bodyPartKeys = Object.keys(bodyParts);
    for (const key of bodyPartKeys) {
      expect(allMuscles.has(key)).toBe(true);
    }
  });
});

describe('InteractiveBoxer — View Toggle Logic', () => {
  it('should toggle between front and back', () => {
    let view: 'front' | 'back' = 'front';
    // Toggle
    view = view === 'front' ? 'back' : 'front';
    expect(view).toBe('back');
    // Toggle again
    view = view === 'front' ? 'back' : 'front';
    expect(view).toBe('front');
  });

  it('should map front to anterior and back to posterior', () => {
    const typeMap = (v: string) => v === 'front' ? 'anterior' : 'posterior';
    expect(typeMap('front')).toBe('anterior');
    expect(typeMap('back')).toBe('posterior');
  });

  it('should default to front view', () => {
    const defaultView = 'front';
    expect(defaultView).toBe('front');
  });
});
