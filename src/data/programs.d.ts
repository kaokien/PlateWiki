/** Type declarations for the training programs data module */

export type ProgramTask =
  | { type: 'learn'; techniqueId: string }
  | { type: 'practice'; description: string };

export interface ProgramDay {
  day: number;
  title: string;
  description: string;
  tasks: ProgramTask[];
}

export interface Program {
  id: string;
  title: string;
  level: string;
  duration: string;
  shortDesc: string;
  description: string;
  days: ProgramDay[];
}

export const programs: Record<string, Program>;
