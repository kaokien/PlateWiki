/**
 * Quiz Generator — auto-generates multiple-choice questions from technique data.
 * No manual question writing. The structured data IS the question bank.
 */

import { techniques } from '@/data/techniques';

// ── Types ───────────────────────────────────────────────────────────

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

type TechniqueData = {
  id: string;
  name: string;
  category: string;
  muscles?: string[];
  mistakes?: string[];
  coachingCues?: string[];
  whenToUse?: string;
  [key: string]: unknown;
};

// ── Seeded PRNG (deterministic per technique) ───────────────────────

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b) + 0x1234) | 0;
    return ((h >>> 0) / 4294967296);
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Distractor Pools ────────────────────────────────────────────────

const allTechniques = Object.values(techniques) as unknown as TechniqueData[];

function getOtherTechniques(excludeId: string, category?: string): TechniqueData[] {
  return allTechniques.filter(
    (t) => t.id !== excludeId && (!category || t.category === category)
  );
}

function pickDistractors(pool: string[], correct: string, count: number, rng: () => number): string[] {
  // dedupe case-insensitively — clause-shortened options can collide
  const seen = new Set<string>([correct.toLowerCase()]);
  const filtered = pool.filter((item) => {
    const key = item.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return shuffle(filtered, rng).slice(0, count);
}

/**
 * Shorten option text to a complete thought. The source data follows a
 * "Short statement — longer explanation" pattern, so long entries are cut
 * at the first strong clause boundary (em-dash, sentence, semicolon) and
 * read as finished phrases — no mid-sentence ellipsis. A word-boundary
 * truncation is only the last resort for run-on text with no boundaries.
 */
export function truncateOption(s: string, max = 140): string {
  const text = s.trim();
  if (text.length <= max) return text;
  // prefer a complete clause: cut at the first strong separator
  for (const sep of [' — ', '. ', '; ']) {
    const idx = text.indexOf(sep);
    if (idx >= 30 && idx <= max) return text.slice(0, idx);
  }
  // next best: a comma clause boundary ("..., which telegraphs the punch")
  const comma = text.indexOf(', ', 30);
  if (comma !== -1 && comma <= max) return text.slice(0, comma);
  // last resort: word-boundary truncate
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:]$/, '') + '…';
}

// ── All known muscle labels (for muscle questions) ──────────────────

const ALL_MUSCLES = [
  'front-deltoids', 'back-deltoids', 'triceps', 'biceps', 'forearm',
  'chest', 'obliques', 'abs', 'lower-back', 'trapezius',
  'quadriceps', 'hamstring', 'calves', 'gluteal', 'abductors',
  'adductor', 'neck', 'head',
];

function formatMuscle(m: string): string {
  return m
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** "the {name}" without doubling the article when the name already has one. */
function theName(name: string): string {
  return /^the\s/i.test(name) ? name : `the ${name}`;
}

// ── Question Generators ─────────────────────────────────────────────

function makeMistakeQuestion(
  tech: TechniqueData,
  rng: () => number
): QuizQuestion | null {
  if (!tech.mistakes || tech.mistakes.length === 0) return null;

  const correct = truncateOption(tech.mistakes[Math.floor(rng() * tech.mistakes.length)]);

  const otherMistakes = getOtherTechniques(tech.id)
    .flatMap((t) => t.mistakes || [])
    .map((s) => truncateOption(s));

  const distractors = pickDistractors(otherMistakes, correct, 3, rng);
  if (distractors.length < 3) return null;

  const options = shuffle([correct, ...distractors], rng);
  return {
    question: `Which of these is a common mistake or pitfall when preparing/consuming ${theName(tech.name)}?`,
    options,
    correctIndex: options.indexOf(correct),
  };
}

function makeMuscleQuestion(
  tech: TechniqueData,
  rng: () => number
): QuizQuestion | null {
  if (!tech.muscles || tech.muscles.length === 0) return null;

  const correct = tech.muscles[Math.floor(rng() * tech.muscles.length)];
  const wrongMuscles = ALL_MUSCLES.filter((m) => !tech.muscles!.includes(m));
  const distractors = pickDistractors(wrongMuscles, correct, 3, rng);
  if (distractors.length < 3) return null;

  const options = shuffle(
    [formatMuscle(correct), ...distractors.map(formatMuscle)],
    rng
  );
  return {
    question: `Which target muscle group is physiologically supported or target-fuelled by ${theName(tech.name)}?`,
    options,
    correctIndex: options.indexOf(formatMuscle(correct)),
  };
}

function makeCueQuestion(
  tech: TechniqueData,
  rng: () => number
): QuizQuestion | null {
  if (!tech.coachingCues || tech.coachingCues.length === 0) return null;

  const correct = truncateOption(tech.coachingCues[Math.floor(rng() * tech.coachingCues.length)]);
  const otherCues = getOtherTechniques(tech.id)
    .flatMap((t) => t.coachingCues || [])
    .map((s) => truncateOption(s));

  const distractors = pickDistractors(otherCues, correct, 3, rng);
  if (distractors.length < 3) return null;

  const options = shuffle([correct, ...distractors], rng);
  return {
    question: `Which preparation or nutritional guideline belongs to ${theName(tech.name)}?`,
    options,
    correctIndex: options.indexOf(correct),
  };
}

// ── Public API ──────────────────────────────────────────────────────

const generators = [makeMistakeQuestion, makeMuscleQuestion, makeCueQuestion];

/**
 * Generate 3 quiz questions for a technique.
 * Questions are deterministic per technique ID + variant (seeded RNG).
 * Bump `variant` on retries so repeat attempts get a different mix where
 * the source data allows it.
 */
export function generateQuiz(techniqueId: string, variant = 0): QuizQuestion[] {
  const tech = (techniques as unknown as Record<string, TechniqueData>)[techniqueId];
  if (!tech) return [];

  const seed = variant > 0 ? `${techniqueId}#${variant}` : techniqueId;
  const rng = seededRandom(seed);
  const questions: QuizQuestion[] = [];

  // Shuffle generators order per technique for variety
  const orderedGens = shuffle([...generators], rng);

  for (const gen of orderedGens) {
    if (questions.length >= 3) break;
    const q = gen(tech, rng);
    if (q) questions.push(q);
  }

  // If we got fewer than 3, try remaining generators with fresh seeds
  if (questions.length < 3) {
    const rng2 = seededRandom(seed + '_retry');
    for (const gen of generators) {
      if (questions.length >= 3) break;
      const q = gen(tech, rng2);
      if (q && !questions.some((existing) => existing.question === q.question)) {
        questions.push(q);
      }
    }
  }

  return questions;
}
