/** Type declarations for the body parts data module */

export interface BodyPart {
  name: string;
  shortDesc: string;
  description: string;
}

export const bodyParts: Record<string, BodyPart>;
