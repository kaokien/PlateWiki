/**
 * Kitchen tools and gear recommendations — non-affiliate, informational links.
 */

export const gearRecommendations = [
  {
    id: 'high-speed-blender',
    name: 'High-Speed Blender',
    description: 'Essential for preparing smooth, easily digestible pre-workout fruit smoothies and post-workout protein isolates.',
    category: 'appliances',
    affiliateUrl: 'https://www.amazon.com/s?k=high+speed+blender',
    icon: '🌪️',
  },
  {
    id: 'digital-food-scale',
    name: 'Digital Food Scale',
    description: 'Critical for precision portioning of macronutrient targets (complex carbohydrates, lean proteins, healthy lipids).',
    category: 'appliances',
    affiliateUrl: 'https://www.amazon.com/s?k=digital+food+scale',
    icon: '⚖️',
  },
  {
    id: 'cast-iron-skillet',
    name: 'Cast Iron Skillet',
    description: 'Provides even heating for searing high-quality proteins (grass-fed beef, bison, salmon) while naturally adding dietary iron.',
    category: 'cookware',
    affiliateUrl: 'https://www.amazon.com/s?k=cast+iron+skillet',
    icon: '🍳',
  },
  {
    id: 'cold-press-juicer',
    name: 'Cold-Press Juicer',
    description: 'Crucial for extracting nutrient-dense, high-nitrate and high-electrolyte juices (celery juice, beetroot juice) without heat oxidation.',
    category: 'appliances',
    affiliateUrl: 'https://www.amazon.com/s?k=masticating+juicer+cold+press',
    icon: '🥤',
  },
  {
    id: 'fermentation-crock',
    name: 'Fermentation Crock',
    description: 'Perfect for preparing gut-healthy active flora ferments such as organic sauerkraut, kimchi, or milk kefir.',
    category: 'fermentation',
    affiliateUrl: 'https://www.amazon.com/s?k=fermentation+crock',
    icon: '🏺',
  },
  {
    id: 'meal-prep-containers',
    name: 'Glass Prep Containers',
    description: 'Airtight, leakproof glass container sets for portioning and preserving cooked athletic meals and complex grains.',
    category: 'storage',
    affiliateUrl: 'https://www.amazon.com/s?k=glass+meal+prep+containers',
    icon: '📦',
  },
];

/**
 * Get gear recommendations by category
 */
export const getGearByCategory = (category) => {
  return gearRecommendations.filter(g => g.category === category);
};
