/**
 * Gear recommendations — powered by Lead Boxing (leadboxing.com)
 * Affiliate code: COACHJOSH → 15% off all products
 */

export const AFFILIATE_CODE = 'coachjosh';
export const AFFILIATE_DISCOUNT = '15%';
export const AFFILIATE_STORE = 'Lead Boxing';
export const AFFILIATE_STORE_URL = 'https://leadboxing.com';

export const gearRecommendations = [
  {
    id: 'training-gloves',
    name: 'Training Gloves',
    description: 'Premium hook & loop training gloves built for daily bag work and pad sessions. Use code COACHJOSH for 15% off.',
    category: 'gloves',
    affiliateUrl: 'https://leadboxing.com/collections/velcro-gloves',
    icon: 'glove',
  },
  {
    id: 'sparring-gloves',
    name: 'Sparring Gloves',
    description: 'Full-padding sparring gloves to protect you and your partner. Premium leather construction for gym-level durability.',
    category: 'gloves',
    affiliateUrl: 'https://leadboxing.com/collections/sparring',
    icon: 'sparring-glove',
  },
  {
    id: 'hand-wraps',
    name: 'Hand Wraps',
    description: 'Semi-elastic hand wraps to protect your wrists, knuckles, and the small bones in your hands during training.',
    category: 'wraps',
    affiliateUrl: 'https://leadboxing.com/collections/hand-wraps',
    icon: 'wraps',
  },
  {
    id: 'headgear',
    name: 'Headgear',
    description: 'Premium quality headgear for safe sparring sessions. Well-made boxing protection is a necessity for any boxer.',
    category: 'protection',
    affiliateUrl: 'https://leadboxing.com/collections/head-gear',
    icon: 'headgear',
  },
  {
    id: 'coaching-equipment',
    name: 'Coaching Equipment',
    description: 'Focus mitts, punch shields, and training pads for coaches and partner drills. Essential for sharpening technique.',
    category: 'coaching',
    affiliateUrl: 'https://leadboxing.com/collections/coaching-equipment',
    icon: 'mitts',
  },
  {
    id: 'boxing-sets',
    name: 'Boxing Sets',
    description: 'Complete gear bundles for getting started. Gloves, wraps, and essentials in one package — perfect for beginners.',
    category: 'sets',
    affiliateUrl: 'https://leadboxing.com/collections/sets',
    icon: 'set',
  },
];

/**
 * Get gear recommendations by category
 */
export const getGearByCategory = (category) => {
  return gearRecommendations.filter(g => g.category === category);
};

