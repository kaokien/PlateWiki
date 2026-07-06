// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  incrementChallengeProgress,
  getChallengeProgress,
  isChallengeComplete,
  WEEKLY_CHALLENGES,
} from './weeklyChallenges';

beforeEach(() => {
  localStorage.clear();
});

describe('incrementChallengeProgress', () => {
  it('counts a unique id only once per week', () => {
    incrementChallengeProgress('technique_studied', 'jab');
    incrementChallengeProgress('technique_studied', 'jab');
    incrementChallengeProgress('technique_studied', 'jab');
    expect(getChallengeProgress().technique_studied).toBe(1);
  });

  it('counts distinct ids separately', () => {
    incrementChallengeProgress('technique_studied', 'jab');
    incrementChallengeProgress('technique_studied', 'cross');
    incrementChallengeProgress('technique_studied', 'lead-hook');
    expect(getChallengeProgress().technique_studied).toBe(3);
  });

  it('plain increments without an id count every time', () => {
    incrementChallengeProgress('workout_complete');
    incrementChallengeProgress('workout_complete');
    expect(getChallengeProgress().workout_complete).toBe(2);
  });

  it('tracks types independently', () => {
    incrementChallengeProgress('technique_studied', 'jab');
    incrementChallengeProgress('article_read', 'jab'); // same id, different type
    expect(getChallengeProgress().technique_studied).toBe(1);
    expect(getChallengeProgress().article_read).toBe(1);
  });
});

describe('isChallengeComplete', () => {
  it('requires every requirement to be met', () => {
    const challenge = WEEKLY_CHALLENGES.find(c => c.id === 'jab-week')!;
    // needs 3 techniques + 2 workouts
    expect(isChallengeComplete(challenge, { technique_studied: 3, workout_complete: 1 })).toBe(false);
    expect(isChallengeComplete(challenge, { technique_studied: 3, workout_complete: 2 })).toBe(true);
  });
});
