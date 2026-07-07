/** Type declarations for the techniques data module */

export interface BodyPart {
  name: string;
  shortDesc: string;
  description: string;
}

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
  video?: string;
  citations?: { title: string; source: string; link: string }[];
}

export const bodyParts: Record<string, BodyPart>;
export const techniques: Record<string, Technique>;
export const TECHNIQUE_COUNT: number;
