import { trackEvent } from './analytics';

export type TestVariant = 'A' | 'B';

/**
 * Get or assign variant for a given test key
 * Uses deterministic allocation stored in localStorage
 */
export function getOrAssignVariant(testKey: string): TestVariant {
  if (typeof window === 'undefined') return 'A';

  const storageKey = `bw_ab_test_${testKey}`;
  const existing = localStorage.getItem(storageKey);

  if (existing === 'A' || existing === 'B') {
    return existing as TestVariant;
  }

  // Assign randomly with 50/50 split
  const assigned: TestVariant = Math.random() < 0.5 ? 'A' : 'B';
  localStorage.setItem(storageKey, assigned);

  // Track the assignment event
  trackEvent('ab_test_assigned', {
    test_key: testKey,
    variant: assigned,
  });

  return assigned;
}

/**
 * Reset all test allocations (for dev/testing)
 */
export function resetTestAllocations() {
  if (typeof window === 'undefined') return;
  
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('bw_ab_test_')) {
      localStorage.removeItem(key);
    }
  });
}
