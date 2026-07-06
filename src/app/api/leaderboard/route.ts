import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { rateLimit, getRateLimitKey } from '@/lib/rateLimit';

const TOP_LIMIT = 50;

/**
 * GET /api/leaderboard — global XP rankings.
 *
 * Public (leaderboards are meant to be seen), but only exposes what a
 * leaderboard needs: display name + aggregate stats. No user ids, emails,
 * or profile internals. When the caller is signed in, their own rank is
 * included so the UI can show "you're #123" even outside the top 50.
 */
export async function GET(req: NextRequest) {
  const limited = rateLimit(getRateLimitKey(req, null), { maxRequests: 30, windowMs: 60_000 });
  if (limited) return limited;

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('fighter_profiles')
    .select('clerk_user_id, display_name, xp, current_streak, workouts_completed')
    .order('xp', { ascending: false })
    .limit(TOP_LIMIT);

  if (error) {
    console.error('[leaderboard/GET] fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }

  const rows = data ?? [];

  // Caller's own placement (optional — only when signed in)
  let you: { rank: number; xp: number } | null = null;
  try {
    const { userId } = await auth();
    if (userId) {
      const topIdx = rows.findIndex((r) => r.clerk_user_id === userId);
      if (topIdx !== -1) {
        you = { rank: topIdx + 1, xp: rows[topIdx].xp ?? 0 };
      } else {
        const { data: mine } = await supabase
          .from('fighter_profiles')
          .select('xp')
          .eq('clerk_user_id', userId)
          .maybeSingle();
        if (mine && typeof mine.xp === 'number') {
          const { count } = await supabase
            .from('fighter_profiles')
            .select('*', { count: 'exact', head: true })
            .gt('xp', mine.xp);
          you = { rank: (count ?? 0) + 1, xp: mine.xp };
        }
      }
    }
  } catch {
    // signed-out or auth unavailable — leaderboard still works
  }

  // Strip user ids before responding; expose only display data.
  const entries = rows.map((r, i) => ({
    rank: i + 1,
    displayName: r.display_name || 'Fighter',
    xp: r.xp ?? 0,
    currentStreak: r.current_streak ?? 0,
    workoutsCompleted: r.workouts_completed ?? 0,
  }));

  // Only anonymous responses are CDN-cacheable — signed-in ones carry the
  // caller's personal rank and must never be served to someone else.
  const cacheControl = you
    ? 'private, no-store'
    : 'public, s-maxage=120, stale-while-revalidate=300';

  return NextResponse.json({ entries, you }, { headers: { 'Cache-Control': cacheControl } });
}
