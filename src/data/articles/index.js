import { boxingFundamentals } from './boxing-fundamentals.js';
import { defenseCounting } from './defense-countering.js';
import { footworkMovement } from './footwork-movement.js';
import { conditioningFitness } from './conditioning-fitness.js';
import { nutritionWeight } from './nutrition-weight.js';
import { equipmentGear } from './equipment-gear.js';
import { sparringCompetition } from './sparring-competition.js';
import { mindsetStrategy } from './mindset-strategy.js';
import { newFundamentals } from './new-fundamentals.js';
import { newConditioning } from './new-conditioning.js';
import { newStrategy } from './new-strategy.js';
import { newRecoveryFootwork } from './new-recovery-footwork.js';
import { newBreathingDefense } from './new-breathing-defense.js';

export const categories = [
  { id: 'all', name: 'All Articles', count: 0 },
  { id: 'Boxing Fundamentals', name: 'Boxing Fundamentals', icon: 'fundamentals' },
  { id: 'Defense & Countering', name: 'Defense & Countering', icon: 'defense' },
  { id: 'Footwork & Movement', name: 'Footwork & Movement', icon: 'footwork' },
  { id: 'Conditioning & Fitness', name: 'Conditioning & Fitness', icon: 'conditioning' },
  { id: 'Nutrition & Weight', name: 'Nutrition & Weight', icon: 'nutrition' },
  { id: 'Equipment & Gear', name: 'Equipment & Gear', icon: 'gear' },
  { id: 'Sparring & Competition', name: 'Sparring & Competition', icon: 'sparring' },
  { id: 'Mindset & Strategy', name: 'Mindset & Strategy', icon: 'mindset' },
];

export const articles = [
  ...boxingFundamentals,
  ...defenseCounting,
  ...footworkMovement,
  ...conditioningFitness,
  ...nutritionWeight,
  ...equipmentGear,
  ...sparringCompetition,
  ...mindsetStrategy,
  ...newFundamentals,
  ...newConditioning,
  ...newStrategy,
  ...newRecoveryFootwork,
  ...newBreathingDefense,
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
