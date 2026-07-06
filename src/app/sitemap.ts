import type { MetadataRoute } from 'next';
import { techniques, bodyParts } from '@/data/techniques';
import { fighters } from '@/data/fighters';
import { glossary, toSlug } from '@/data/glossary';
import { programs } from '@/data/programs';
import { exercises, muscleGroupWorkouts, goalWorkouts } from '@/data/exercises';
import { getArticlesList } from '@/utils/contentLoader';

const SITE_URL = 'https://FoodWiki.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/techniques`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/exercises`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/workouts`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/workout`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/programs`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/articles`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/glossary`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/rules`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/timer`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/fighters`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/course`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/merch`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/partner`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/watch`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic technique pages
  const techniquePages: MetadataRoute.Sitemap = Object.keys(techniques).map((id) => ({
    url: `${SITE_URL}/technique/${id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic fighter pages
  const fighterPages: MetadataRoute.Sitemap = fighters.map((f) => ({
    url: `${SITE_URL}/fighters/${f.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic glossary term pages
  const glossaryPages: MetadataRoute.Sitemap = glossary.map((g) => ({
    url: `${SITE_URL}/glossary/${toSlug(g.term)}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Dynamic article pages (includes both local and remote/markdown articles)
  const allArticles = await getArticlesList();
  const articlePages: MetadataRoute.Sitemap = allArticles.map((a) => ({
    url: `${SITE_URL}/articles/${a.id}`,
    lastModified: a.date ? new Date(a.date) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic program pages
  const programPages: MetadataRoute.Sitemap = Object.keys(programs).map((id) => ({
    url: `${SITE_URL}/program/${id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic anatomy pages
  const anatomyPages: MetadataRoute.Sitemap = Object.keys(bodyParts).map((id) => ({
    url: `${SITE_URL}/anatomy/${id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic technique workout pages
  const techniqueWorkoutPages: MetadataRoute.Sitemap = Object.keys(techniques).map((id) => ({
    url: `${SITE_URL}/technique/${id}/workout`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Dynamic exercise pages
  const exercisePages: MetadataRoute.Sitemap = Object.keys(exercises).map((id) => ({
    url: `${SITE_URL}/exercise/${id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic muscle group workout pages
  const muscleWorkoutPages: MetadataRoute.Sitemap = Object.keys(muscleGroupWorkouts).map((slug) => ({
    url: `${SITE_URL}/workouts/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Dynamic goal-based workout pages
  const goalWorkoutPages: MetadataRoute.Sitemap = Object.keys(goalWorkouts).map((slug) => ({
    url: `${SITE_URL}/workouts/goal/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...techniquePages,
    ...fighterPages,
    ...glossaryPages,
    ...articlePages,
    ...programPages,
    ...anatomyPages,
    ...techniqueWorkoutPages,
    ...exercisePages,
    ...muscleWorkoutPages,
    ...goalWorkoutPages,
  ];
}

