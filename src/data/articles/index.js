import { nutritionWeight } from './nutrition-weight.js';
import { newRecoveryFootwork } from './new-recovery-footwork.js';

export const categories = [
  { id: 'all', name: 'All Articles', count: 0 },
  { id: 'Nutrition & Diet', name: 'Nutrition & Diet', icon: 'nutrition' },
  { id: 'Cooking & Meal Prep', name: 'Cooking & Meal Prep', icon: 'fundamentals' },
  { id: 'Athlete Fueling', name: 'Athlete Fueling', icon: 'defense' },
  { id: 'Health & Recovery', name: 'Health & Recovery', icon: 'conditioning' },
];

// Re-map the local articles to be food/nutrition-focused
const mappedNutritionWeight = nutritionWeight.map(art => {
  if (art.id === 'what-to-eat-before-athletic-training') {
    return {
      ...art,
      title: 'What to Eat Before Training: Fueling for Performance',
      subtitle: 'What you eat before training decides whether you feel sharp or sluggish by the end.',
      category: 'Athlete Fueling',
      tags: ['nutrition', 'pre-workout', 'fueling'],
      author: 'FoodWiki Editorial',
    };
  }
  if (art.id === 'fight-week-weight-management') {
    return {
      ...art,
      title: 'Weight Management & Energy Balance for Athletes',
      subtitle: 'Understanding energy balance, caloric deficits, and hydration safely.',
      category: 'Nutrition & Diet',
      tags: ['nutrition', 'weight', 'diet'],
      author: 'FoodWiki Editorial',
    };
  }
  return art;
});

const recoveryArticle = newRecoveryFootwork
  .filter(art => art.id === 'recovery-for-athletes')
  .map(art => ({
    ...art,
    title: 'Athlete Recovery: Sleep, Hydration & Injury Prevention',
    subtitle: 'Training breaks you down — recovery is where you actually get stronger.',
    category: 'Health & Recovery',
    tags: ['recovery', 'nutrition', 'rest'],
    author: 'FoodWiki Editorial',
  }));

export const articles = [
  ...mappedNutritionWeight,
  ...recoveryArticle,
].sort((a, b) => new Date(b.date) - new Date(a.date));

// Update the "all" count
categories[0].count = articles.length;
categories.forEach(cat => {
  if (cat.id !== 'all') {
    cat.count = articles.filter(a => a.category === cat.id).length;
  }
});

export const getArticleById = (id) => articles.find(a => a.id === id);
export const getArticlesByCategory = (category) =>
  category === 'all' ? articles : articles.filter(a => a.category === category);
export const getRelatedArticles = (articleId) => {
  const article = getArticleById(articleId);
  if (!article) return [];
  return article.relatedArticles
    .map(id => getArticleById(id))
    .filter(Boolean);
};

// Reverse map: technique ID → articles that reference it
const _techniqueArticleMap = {};
articles.forEach(art => {
  (art.relatedTechniques || []).forEach(tid => {
    if (!_techniqueArticleMap[tid]) _techniqueArticleMap[tid] = [];
    _techniqueArticleMap[tid].push(art);
  });
});

/**
 * Get articles that reference a given technique ID (max 3).
 * Used by TechniquePage sidebar for cross-linking.
 */
export const getArticlesForTechnique = (techniqueId) =>
  (_techniqueArticleMap[techniqueId] || []).slice(0, 3);
