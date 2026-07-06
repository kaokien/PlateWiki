/** Shared type definitions for FoodWiki */

export interface Technique {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  stance: 'orthodox' | 'southpaw' | 'both';
  trainingFormat: string[];
  muscles: string[];
  description: string;
  whenToUse?: string;
  coachingCues?: string[];
  steps: string[];
  mistakes?: string[];
  proTips?: string[];
  conditioning?: string[];
  combinations?: { name: string; link: string }[];
  relatedTechniques?: string[];
  image?: string;
}

export interface BodyPart {
  name: string;
  shortDesc: string;
  description: string;
}

export interface Article {
  id: number | string;
  title: string;
  subtitle: string;
  category: string;
  heroImage?: string;
  author?: string;
  date: string;
  dateModified?: string;
  readTime: string;
  tags: string[];
  youtubeId?: string;
  sections: ArticleSection[];
  relatedTechniques?: string[];
  callToAction?: {
    text: string;
    link: string;
  };
}

export interface ArticleSection {
  heading: string;
  content?: string;
  list?: string[];
}

export interface GearRecommendation {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image?: string;
  affiliateUrl: string;
  rating?: number;
}

export type TechniqueMap = Record<string, Technique>;
export type BodyPartMap = Record<string, BodyPart>;
