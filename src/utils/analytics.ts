/**
 * Analytics layer for PlateWiki
 * 
 * Supports GA4 out of the box, with a clean API that can be
 * swapped to Plausible, PostHog, or any other provider.
 */

export const GA_MEASUREMENT_ID = 'G-BXS6C3GE6C';

/**
 * Send a custom event to the analytics provider
 * @param {string} eventName - The event name
 * @param {Object} params - Event parameters
 */
export function trackEvent(eventName: string, params = {}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
}

/**
 * Pre-built event helpers
 */
export const analytics = {
  muscleClick: (muscleName: string, muscleId: string) => {
    trackEvent('muscle_click', {
      muscle_name: muscleName,
      muscle_id: muscleId,
      event_category: 'engagement',
    });
  },

  techniqueView: (techniqueName: string, category: string, difficulty: string) => {
    trackEvent('technique_view', {
      technique_name: techniqueName,
      category: category,
      difficulty: difficulty || 'unknown',
      event_category: 'content',
    });
  },

  searchQuery: (query: string, resultCount: number) => {
    trackEvent('search', {
      search_term: query,
      result_count: resultCount,
      event_category: 'engagement',
    });
  },

  filterCategory: (category: string) => {
    trackEvent('filter_category', {
      category: category,
      event_category: 'engagement',
    });
  },

  filterDifficulty: (difficulty: string) => {
    trackEvent('filter_difficulty', {
      difficulty: difficulty,
      event_category: 'engagement',
    });
  },

  filterStance: (stance: string) => {
    trackEvent('filter_stance', {
      stance: stance,
      event_category: 'engagement',
    });
  },

  filterFormat: (format: string) => {
    trackEvent('filter_format', {
      format: format,
      event_category: 'engagement',
    });
  },

  favoriteToggle: (techniqueId: string, action: string) => {
    trackEvent('favorite_toggle', {
      technique_id: techniqueId,
      action: action, // 'add' or 'remove'
      event_category: 'engagement',
    });
  },

  affiliateClick: (productName: string, url: string) => {
    trackEvent('affiliate_click', {
      product_name: productName,
      destination_url: url,
      event_category: 'monetization',
      transport_type: 'beacon',
    });
  },

  storeClick: (foodId: string, storeName: string, priceRange: string) => {
    trackEvent('store_link_click', {
      food_id: foodId,
      store_name: storeName,
      price_range: priceRange,
      event_category: 'monetization',
      transport_type: 'beacon',
    });
  },

  newsletterCta: (location: string) => {
    trackEvent('newsletter_cta', {
      location: location,
      event_category: 'monetization',
    });
  },

  randomDrill: (techniqueId: string, techniqueName: string) => {
    trackEvent('random_drill', {
      technique_id: techniqueId,
      technique_name: techniqueName,
      event_category: 'engagement',
    });
  },

  outboundClick: (url: string) => {
    trackEvent('click', {
      event_category: 'outbound',
      event_label: url,
      transport_type: 'beacon',
    });
  },

  coursePromoClick: (location: string, variant: string) => {
    trackEvent('course_promo_click', {
      location: location,
      variant: variant,
      event_category: 'monetization',
    });
  },

  courseCheckoutClick: (price: number) => {
    trackEvent('course_checkout_click', {
      course_name: 'boxing_blueprint',
      price: price,
      event_category: 'monetization',
      transport_type: 'beacon',
    });
  },

  customEvent: (eventName: string, params = {}) => {
    trackEvent(eventName, params);
  },

  onboardingStart: () => {
    trackEvent('onboarding_start', {
      event_category: 'onboarding',
    });
  },

  onboardingStepViewed: (stepNumber: number, deviceType: 'mobile' | 'desktop') => {
    trackEvent('onboarding_step_viewed', {
      step_number: stepNumber,
      device_type: deviceType,
      event_category: 'onboarding',
    });
  },

  onboardingStanceSelected: (stance: 'orthodox' | 'southpaw') => {
    trackEvent('onboarding_stance_selected', {
      stance: stance,
      event_category: 'onboarding',
    });
  },

  onboardingComplete: () => {
    trackEvent('onboarding_complete', {
      event_category: 'onboarding',
    });
  },

  paywallViewed: (triggerSource: string) => {
    trackEvent('paywall_viewed', {
      trigger_source: triggerSource,
      event_category: 'monetization',
    });
  },

  trialStarted: (billingInterval: 'monthly' | 'annual') => {
    trackEvent('trial_started', {
      billing_interval: billingInterval,
      event_category: 'monetization',
    });
  },

  purchaseCompleted: (billingInterval: 'monthly' | 'annual', price: number) => {
    trackEvent('purchase_completed', {
      billing_interval: billingInterval,
      price: price,
      event_category: 'monetization',
    });
  },

  workoutAbandoned: (workoutId: string, secondsElapsed: number, roundsCompleted: number) => {
    trackEvent('workout_abandoned', {
      workout_id: workoutId,
      seconds_elapsed: secondsElapsed,
      rounds_completed: roundsCompleted,
      event_category: 'engagement',
    });
  },

  fighterCardDownloaded: (rank: string, streakDays: number, totalXp: number) => {
    trackEvent('fighter_card_downloaded', {
      rank: rank,
      streak_days: streakDays,
      total_xp: totalXp,
      event_category: 'engagement',
    });
  },
};

// ─── Shadowbox Training Statistics Persistence ───────────────────────────

export interface TrainingStats {
  totalSessions: number;
  totalPunches: number;
  highScore: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalTime: number; // in seconds
  blitzHits: number;
  blitzMisses: number;
  weeklyLog: { [date: string]: number }; // map YYYY-MM-DD -> punches thrown
}

const DEFAULT_STATS: TrainingStats = {
  totalSessions: 0,
  totalPunches: 0,
  highScore: 0,
  streak: 0,
  lastActiveDate: '',
  totalTime: 0,
  blitzHits: 0,
  blitzMisses: 0,
  weeklyLog: {}
};

export const getTrainingStats = (): TrainingStats => {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_STATS, weeklyLog: {} };
  try {
    const data = localStorage.getItem('shadowbox_training_stats');
    if (!data) return { ...DEFAULT_STATS, weeklyLog: {} };
    const parsed = JSON.parse(data);
    return { 
      ...DEFAULT_STATS, 
      ...parsed, 
      weeklyLog: parsed.weeklyLog ? { ...parsed.weeklyLog } : {} 
    };
  } catch (e) {
    console.error('Failed to parse training stats:', e);
    return { ...DEFAULT_STATS, weeklyLog: {} };
  }
};

export const saveTrainingStats = (stats: TrainingStats) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem('shadowbox_training_stats', JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save training stats:', e);
  }
};

export const trackPunchRep = (count: number = 1) => {
  const stats = getTrainingStats();
  stats.totalPunches += count;
  
  const today = new Date().toISOString().split('T')[0];
  if (!stats.weeklyLog) stats.weeklyLog = {};
  stats.weeklyLog[today] = (stats.weeklyLog[today] || 0) + count;
  
  updateStreak(stats, today);
  saveTrainingStats(stats);
};

export const trackBlitzSession = (score: number, hits: number, misses: number) => {
  const stats = getTrainingStats();
  stats.totalSessions += 1;
  stats.blitzHits += hits;
  stats.blitzMisses += misses;
  stats.totalPunches += hits;
  
  const today = new Date().toISOString().split('T')[0];
  if (!stats.weeklyLog) stats.weeklyLog = {};
  stats.weeklyLog[today] = (stats.weeklyLog[today] || 0) + hits;

  if (score > stats.highScore) {
    stats.highScore = score;
  }

  updateStreak(stats, today);
  saveTrainingStats(stats);
};

export const trackTimeActive = (seconds: number) => {
  const stats = getTrainingStats();
  stats.totalTime += seconds;
  saveTrainingStats(stats);
};

const updateStreak = (stats: TrainingStats, todayStr: string) => {
  if (stats.lastActiveDate === todayStr) return; // already active today

  if (!stats.lastActiveDate) {
    stats.streak = 1;
  } else {
    const lastActive = new Date(stats.lastActiveDate);
    const today = new Date(todayStr);
    const diffTime = Math.abs(today.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      stats.streak += 1;
    } else if (diffDays > 1) {
      stats.streak = 1; // streak broken
    }
  }
  stats.lastActiveDate = todayStr;
};
