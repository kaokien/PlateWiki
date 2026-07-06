export type VideoCategory = 'technique' | 'recovery' | 'fundamentals' | 'conditioning' | 'lifestyle';
export type VideoPlatform = 'instagram' | 'youtube';
export type VideoFormat = 'long' | 'short';

export interface WatchVideo {
  id: string;
  title: string;
  description: string;
  category: VideoCategory;
  platform: VideoPlatform;
  format: VideoFormat;
  /** YouTube video ID or full Instagram URL */
  videoId: string;
  /** URL to open when clicking the card */
  url: string;
  thumbnail: string;
  order: number;
  /** Technique page slugs to cross-link (e.g. ['jab', 'cross']) */
  relatedTechniques?: { slug: string; label: string }[];
}

export const VIDEO_CATEGORIES = {
  fundamentals: { label: 'Fundamentals', emoji: '🥊' },
  technique: { label: 'Technique', emoji: '🎯' },
  conditioning: { label: 'Conditioning', emoji: '💪' },
  recovery: { label: 'Recovery', emoji: '🧊' },
  lifestyle: { label: 'Lifestyle', emoji: '🎬' },
} as const;

export const watchVideos: WatchVideo[] = [
  // ── YouTube Long-Form ─────────────────────────────────────────────
  {
    id: 'master-the-jab',
    title: 'Master the Jab in 6 Minutes',
    description:
      'Complete jab tutorial covering proper form, hand positioning, snap technique, and common mistakes. The jab is boxing\'s most important punch and this video breaks it all down.',
    category: 'fundamentals',
    platform: 'youtube',
    format: 'long',
    videoId: 'WOeEjrzlehM',
    url: 'https://www.youtube.com/watch?v=WOeEjrzlehM',
    thumbnail: '/images/watch/stance.png',
    order: 1,
    relatedTechniques: [{ slug: 'jab', label: 'The Jab' }],
  },
  {
    id: 'footwork-and-balance',
    title: 'Boxing 101: Footwork & Balance',
    description:
      'Learn the building blocks of boxing movement. Coach Josh covers weight distribution, the step-slide, pivots, and how to maintain balance while throwing punches.',
    category: 'fundamentals',
    platform: 'youtube',
    format: 'long',
    videoId: 'daigP88puu4',
    url: 'https://www.youtube.com/watch?v=daigP88puu4',
    thumbnail: '/images/watch/footwork.png',
    order: 2,
    relatedTechniques: [
      { slug: 'step-drag', label: 'Step-Drag' },
      { slug: 'lateral-movement', label: 'Lateral Movement' },
      { slug: 'pivot', label: 'Pivot' },
    ],
  },
  {
    id: 'control-heavy-bag',
    title: 'How to Control the Heavy Bag',
    description:
      'Stop pushing the bag and start punching it. Coach Josh teaches how to hit with accuracy and power while keeping the bag under control for productive training.',
    category: 'fundamentals',
    platform: 'youtube',
    format: 'long',
    videoId: 'Eao9YqviGc0',
    url: 'https://www.youtube.com/watch?v=Eao9YqviGc0',
    thumbnail: '/images/watch/explosive-power.png',
    order: 3,
    relatedTechniques: [{ slug: 'heavy-bag', label: 'Heavy Bag Work' }],
  },
  {
    id: 'jump-rope-beginners',
    title: 'How to Jump Rope for Boxing Beginners',
    description:
      'Jump rope is the backbone of boxing cardio. This tutorial covers proper form, timing, and progressions to improve footwork, cardio, and rhythm.',
    category: 'conditioning',
    platform: 'youtube',
    format: 'long',
    videoId: 'zb6LGO_8UCY',
    url: 'https://www.youtube.com/watch?v=zb6LGO_8UCY',
    thumbnail: '/images/watch/footwork.png',
    order: 4,
    relatedTechniques: [{ slug: 'jump-rope', label: 'Jump Rope' }],
  },
  {
    id: 'olympic-warmup',
    title: 'Olympic Style Boxing Warm-Up (Train Like Real Fighters)',
    description:
      'The warm-up routine used by competitive boxers. Covers dynamic stretching, shadowboxing, and boxing-specific movements to prep your body for hard training.',
    category: 'conditioning',
    platform: 'youtube',
    format: 'long',
    videoId: '8xi4qrfBmVs',
    url: 'https://www.youtube.com/watch?v=8xi4qrfBmVs',
    thumbnail: '/images/watch/shadow-boxing.png',
    order: 5,
    relatedTechniques: [{ slug: 'shadow-boxing', label: 'Shadow Boxing' }],
  },
  {
    id: 'warmup-routine-champions',
    title: 'The Warm-Up Routine Champions Use (Boxing Fundamentals 101)',
    description:
      'A step-by-step warm-up that gets your body ready for boxing. Focus on shoulder activation, hip mobility, and light shadowboxing to get loose.',
    category: 'conditioning',
    platform: 'youtube',
    format: 'long',
    videoId: 'M4uyfBR7H1I',
    url: 'https://www.youtube.com/watch?v=M4uyfBR7H1I',
    thumbnail: '/images/watch/core.png',
    order: 6,
  },
  {
    id: 'morning-stretch',
    title: 'Do This Every Morning (6 Minute Full Body Stretch)',
    description:
      'A quick daily stretch routine for fighters and athletes. Covers full body mobility in just 6 minutes to start your day right and prevent injuries.',
    category: 'recovery',
    platform: 'youtube',
    format: 'long',
    videoId: 'Wiy90pVSEGk',
    url: 'https://www.youtube.com/watch?v=Wiy90pVSEGk',
    thumbnail: '/images/watch/fascia.png',
    order: 7,
  },
  {
    id: 'recovery-routine',
    title: 'The Recovery Routine That Changed How My Body Feels',
    description:
      'Coach Josh shares his personal recovery protocol that transformed his training. Covers stretching, foam rolling, and active recovery methods.',
    category: 'recovery',
    platform: 'youtube',
    format: 'long',
    videoId: '8zK-U4tNSz4',
    url: 'https://www.youtube.com/watch?v=8zK-U4tNSz4',
    thumbnail: '/images/watch/fascia.png',
    order: 8,
  },
  {
    id: 'fascia-release-collab',
    title: 'Deep Tissue Fascia Release for Fighters',
    description:
      'Recovery collaboration covering deep tissue fascia release techniques. Learn hands-on methods to break up adhesions, improve mobility, and recover faster.',
    category: 'recovery',
    platform: 'youtube',
    format: 'long',
    videoId: 'eGsJhMxGkxs',
    url: 'https://www.youtube.com/watch?v=eGsJhMxGkxs',
    thumbnail: '/images/watch/fascia.png',
    order: 9,
  },
  {
    id: 'sparring-elvin-ayala',
    title: 'Sparring a Former Champion + Interview w/ Elvin Ayala',
    description:
      'Coach Josh spars former middleweight contender Elvin Ayala and sits down for an interview. Real ring experience and insights from a pro fighter.',
    category: 'lifestyle',
    platform: 'youtube',
    format: 'long',
    videoId: 'CgnnGwEEqSg',
    url: 'https://www.youtube.com/watch?v=CgnnGwEEqSg',
    thumbnail: '/images/watch/slips.png',
    order: 10,
  },
  {
    id: 'find-the-right-coach',
    title: 'How To Find The Right Coach',
    description:
      'What to look for in a boxing coach and red flags to avoid. Coach Josh shares advice on choosing the right gym and trainer for your goals.',
    category: 'lifestyle',
    platform: 'youtube',
    format: 'long',
    videoId: '6L4IYoCqaA4',
    url: 'https://www.youtube.com/watch?v=6L4IYoCqaA4',
    thumbnail: '/images/watch/shoulder-strength.png',
    order: 11,
  },

  // ── YouTube Shorts ────────────────────────────────────────────────
  {
    id: 'yt-dodge-left-hook',
    title: 'How to Dodge the Left Hook',
    description:
      'Quick defensive tip on reading and evading the left hook using proper head movement and body positioning.',
    category: 'technique',
    platform: 'youtube',
    format: 'short',
    videoId: 'zMigqsy5hZU',
    url: 'https://www.youtube.com/shorts/zMigqsy5hZU',
    thumbnail: '/images/watch/slips.png',
    order: 12,
    relatedTechniques: [
      { slug: 'slip-outside', label: 'Slip Outside' },
      { slug: 'bob-and-weave', label: 'Bob & Weave' },
    ],
  },
  {
    id: 'yt-form-over-everything',
    title: 'Form Over Everything: Master the Basics',
    description:
      'Why drilling proper form matters more than speed or power. Build your technique foundation first, then add the extras.',
    category: 'fundamentals',
    platform: 'youtube',
    format: 'short',
    videoId: 'zdqkAfbDBxQ',
    url: 'https://www.youtube.com/shorts/zdqkAfbDBxQ',
    thumbnail: '/images/watch/stance.png',
    order: 13,
  },
  {
    id: 'yt-fast-hands-feet',
    title: 'Fast Feet AND Hands Working Together',
    description:
      'It is not just about fast feet. Train your hands and feet to move in sync for better combinations and ring control.',
    category: 'technique',
    platform: 'youtube',
    format: 'short',
    videoId: 'K0iUtevtZY0',
    url: 'https://www.youtube.com/shorts/K0iUtevtZY0',
    thumbnail: '/images/watch/footwork.png',
    order: 14,
    relatedTechniques: [{ slug: 'pendulum-bounce', label: 'Pendulum Bounce' }],
  },
  {
    id: 'yt-touch-sparring',
    title: 'Touch Sparring: Relax in the Ring',
    description:
      'Touch sparring is key to developing composure under pressure. Learn to stay relaxed and react naturally instead of tensing up.',
    category: 'technique',
    platform: 'youtube',
    format: 'short',
    videoId: 'Jw3gMXHBnnM',
    url: 'https://www.youtube.com/shorts/Jw3gMXHBnnM',
    thumbnail: '/images/watch/shadow-boxing.png',
    order: 15,
    relatedTechniques: [{ slug: 'sparring', label: 'Sparring' }],
  },
  {
    id: 'yt-defense-feet',
    title: 'Better Feet. Better Defense. Better Boxing.',
    description:
      'Defensive footwork drill showing how your feet control your ability to slip, block, and counter effectively.',
    category: 'technique',
    platform: 'youtube',
    format: 'short',
    videoId: 'Q1QlYb9RRGw',
    url: 'https://www.youtube.com/shorts/Q1QlYb9RRGw',
    thumbnail: '/images/watch/footwork.png',
    order: 16,
  },
  {
    id: 'yt-weight-shifting',
    title: 'Weight Shifting on Cue',
    description:
      'Stay on your toes and learn to shift weight quickly between stances for better punch placement and defensive transitions.',
    category: 'technique',
    platform: 'youtube',
    format: 'short',
    videoId: 'tO0IBpFgyFA',
    url: 'https://www.youtube.com/shorts/tO0IBpFgyFA',
    thumbnail: '/images/watch/opposite-opposite.png',
    order: 17,
  },
  {
    id: 'yt-morning-mobility',
    title: 'Morning Mobility: All You Need Is a Wall',
    description:
      'Quick morning stretch using just a wall. Open up your hips, shoulders, and thoracic spine before training.',
    category: 'recovery',
    platform: 'youtube',
    format: 'short',
    videoId: 'HmFo4dGnvXI',
    url: 'https://www.youtube.com/shorts/HmFo4dGnvXI',
    thumbnail: '/images/watch/fascia.png',
    order: 18,
  },
  {
    id: 'yt-wall-stretch',
    title: 'Wall Stretch for Fighters',
    description:
      'Simple but effective wall stretch for releasing tension in your shoulders and chest. Great pre- or post-training.',
    category: 'recovery',
    platform: 'youtube',
    format: 'short',
    videoId: 'hky1uTRLgpo',
    url: 'https://www.youtube.com/shorts/hky1uTRLgpo',
    thumbnail: '/images/watch/fascia.png',
    order: 19,
  },
  {
    id: 'yt-athlete-recovery',
    title: 'Athlete Recovery Done Right',
    description:
      'Quick overview of how fighters should approach recovery between training sessions to stay healthy and perform at their best.',
    category: 'recovery',
    platform: 'youtube',
    format: 'short',
    videoId: 'KmC6AR0XkI8',
    url: 'https://www.youtube.com/shorts/KmC6AR0XkI8',
    thumbnail: '/images/watch/fascia.png',
    order: 20,
  },

  // ── Instagram Reels ───────────────────────────────────────────────
  {
    id: 'ig-stance',
    title: 'Stance Fundamentals',
    description:
      'Coach Josh breaks down proper boxing stance fundamentals: foot placement, weight distribution, and guard position that form the foundation of every punch and defensive move.',
    category: 'fundamentals',
    platform: 'instagram',
    format: 'short',
    videoId: 'DZIb8tdBrbC',
    url: 'https://www.instagram.com/reel/DZIb8tdBrbC/',
    thumbnail: '/images/watch/stance.png',
    order: 21,
    relatedTechniques: [{ slug: 'peek-a-boo', label: 'Peek-a-Boo Stance' }],
  },
  {
    id: 'ig-explosive-power',
    title: 'Explosive Power Drill',
    description:
      'Build knockout-level power with this explosive training drill. Generate force from the ground up through proper hip rotation and kinetic chain activation.',
    category: 'technique',
    platform: 'instagram',
    format: 'short',
    videoId: 'DZAiGNyuifu',
    url: 'https://www.instagram.com/reel/DZAiGNyuifu/',
    thumbnail: '/images/watch/explosive-power.png',
    order: 22,
  },
  {
    id: 'ig-opposite-opposite',
    title: 'Opposite Opposite (Coordination & Stamina)',
    description:
      'Master the opposite-opposite drill to sharpen leg coordination and build fight-ready stamina. This footwork pattern trains your body to move fluidly between offense and defense.',
    category: 'technique',
    platform: 'instagram',
    format: 'short',
    videoId: 'DY7Zx-wOa8y',
    url: 'https://www.instagram.com/reel/DY7Zx-wOa8y/',
    thumbnail: '/images/watch/opposite-opposite.png',
    order: 23,
  },
  {
    id: 'ig-slips',
    title: 'Slips',
    description:
      'Learn head movement and slip technique to evade punches without losing position. Proper slip mechanics for both orthodox and southpaw fighters.',
    category: 'technique',
    platform: 'instagram',
    format: 'short',
    videoId: 'DYz0xZ0ueXX',
    url: 'https://www.instagram.com/reel/DYz0xZ0ueXX/',
    thumbnail: '/images/watch/slips.png',
    order: 24,
    relatedTechniques: [
      { slug: 'slip-inside', label: 'Slip Inside' },
      { slug: 'slip-outside', label: 'Slip Outside' },
    ],
  },
  {
    id: 'ig-shoulder-strength',
    title: 'Shoulder Strength for Boxing',
    description:
      'Strengthen the shoulders for endurance and injury prevention with this boxing-specific conditioning drill. Essential for maintaining your guard through late rounds.',
    category: 'conditioning',
    platform: 'instagram',
    format: 'short',
    videoId: 'DYfVRQeOJLA',
    url: 'https://www.instagram.com/reel/DYfVRQeOJLA/',
    thumbnail: '/images/watch/shoulder-strength.png',
    order: 25,
    relatedTechniques: [{ slug: 'high-guard', label: 'High Guard' }],
  },
  {
    id: 'ig-footwork',
    title: 'Footwork Drill',
    description:
      'Develop ring-cutting footwork with this movement drill. Control distance, cut angles, and maintain balance while transitioning between attack and retreat.',
    category: 'technique',
    platform: 'instagram',
    format: 'short',
    videoId: 'DYdJCTdumXS',
    url: 'https://www.instagram.com/reel/DYdJCTdumXS/',
    thumbnail: '/images/watch/footwork.png',
    order: 26,
    relatedTechniques: [
      { slug: 'cut-off', label: 'Cut Off' },
      { slug: 'angle-out', label: 'Angle Out' },
    ],
  },
  {
    id: 'ig-footwork-2',
    title: 'Advanced Footwork Patterns',
    description:
      'Advanced footwork patterns building on the fundamentals. Lateral movement, pivot mechanics, and directional changes that separate amateur boxers from skilled fighters.',
    category: 'technique',
    platform: 'instagram',
    format: 'short',
    videoId: 'DXr2qqjEdlu',
    url: 'https://www.instagram.com/reel/DXr2qqjEdlu/',
    thumbnail: '/images/watch/footwork.png',
    order: 27,
  },
  {
    id: 'ig-shadow-boxing',
    title: 'Shadow nutrition',
    description:
      'Purposeful shadow nutrition: how to visualize opponents, practice combinations, and develop rhythm without a bag or partner.',
    category: 'technique',
    platform: 'instagram',
    format: 'short',
    videoId: 'DYuRpEcODkm',
    url: 'https://www.instagram.com/reel/DYuRpEcODkm/',
    thumbnail: '/images/watch/shadow-boxing.png',
    order: 28,
    relatedTechniques: [{ slug: 'shadow-boxing', label: 'Shadow Boxing' }],
  },
  {
    id: 'ig-core',
    title: 'Core Training for Fighters',
    description:
      'Build a fighter\'s core with this targeted conditioning drill. Strong abs and obliques are critical for punch power, defensive rotations, and absorbing body shots.',
    category: 'conditioning',
    platform: 'instagram',
    format: 'short',
    videoId: 'DYdGfR-uZmB',
    url: 'https://www.instagram.com/reel/DYdGfR-uZmB/',
    thumbnail: '/images/watch/core.png',
    order: 29,
    relatedTechniques: [{ slug: 'core-conditioning', label: 'Core Conditioning' }],
  },
  {
    id: 'ig-fascia-1',
    title: 'Fascia with Hassan (Part 1)',
    description:
      'Part 1 of the fascia release series with Hassan. Myofascial release techniques that reduce soreness, improve mobility, and speed up recovery between training sessions.',
    category: 'recovery',
    platform: 'instagram',
    format: 'short',
    videoId: 'DYnhWfPO3_G',
    url: 'https://www.instagram.com/reel/DYnhWfPO3_G/',
    thumbnail: '/images/watch/fascia.png',
    order: 30,
  },
  {
    id: 'ig-fascia-2',
    title: 'Fascia with Hassan (Part 2)',
    description:
      'Part 2 continues the fascia series targeting deeper tissue layers. Advanced self-massage techniques for the hips, shoulders, and thoracic spine.',
    category: 'recovery',
    platform: 'instagram',
    format: 'short',
    videoId: 'DYnhksvuszH',
    url: 'https://www.instagram.com/reel/DYnhksvuszH/',
    thumbnail: '/images/watch/fascia.png',
    order: 31,
  },
  {
    id: 'ig-fascia-3',
    title: 'Fascia with Hassan (Part 3)',
    description:
      'The final installment covers full-body fascia integration and a recovery routine you can perform post-training to maintain flexibility and prevent chronic tightness.',
    category: 'recovery',
    platform: 'instagram',
    format: 'short',
    videoId: 'DYnhvH2Ojjs',
    url: 'https://www.instagram.com/reel/DYnhvH2Ojjs/',
    thumbnail: '/images/watch/fascia.png',
    order: 32,
  },
];
