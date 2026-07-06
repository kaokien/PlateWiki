/**
 * Local-timezone date helpers.
 *
 * Streaks and daily XP throttles are "per day" from the user's point of
 * view, so they must use the local calendar date. (Using
 * toISOString().split('T')[0] dates everything in UTC — for users far from
 * UTC, two local days can collapse into one UTC day or one local day can
 * span two, which stalls or breaks streaks.)
 */

/** YYYY-MM-DD in the user's local timezone. */
export function localDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Whole days from date string `a` to date string `b` (both YYYY-MM-DD,
 * interpreted as local dates). Positive when b is after a. Math.round
 * absorbs DST-shortened/lengthened days.
 */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  if (!ay || !am || !ad || !by || !bm || !bd) return NaN;
  const start = new Date(ay, am - 1, ad).getTime();
  const end = new Date(by, bm - 1, bd).getTime();
  return Math.round((end - start) / 86_400_000);
}
