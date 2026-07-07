import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { rateLimit, getRateLimitKey } from '@/lib/rateLimit';

// ── Helpers ─────────────────────────────────────────────────────

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function err(message: string, status: number) {
  return json({ error: message }, status);
}

async function getUser() {
  const { userId } = await auth();
  return userId;
}

async function parseBody(req: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

// ── Input bounds ────────────────────────────────────────────────
// The profile is client-authoritative by design, but stored payloads must
// stay bounded so a hostile client can't bloat rows or slow queries.

const MAX_LIST_ITEMS = 1000;
const MAX_ITEM_LENGTH = 200;
const MAX_DAILY_AWARD_KEYS = 400;
const MAX_LOG_ENTRIES = 200;

/** Cap a string-array field: strings only, item length and count bounded. */
function stringList(value: unknown, maxItems = MAX_LIST_ITEMS): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((s: unknown): s is string => typeof s === 'string')
    .map(s => s.slice(0, MAX_ITEM_LENGTH))
    .slice(0, maxItems);
}

/** Cap the daily-awards map: string keys → YYYY-MM-DD-ish string values. */
function dailyAwardsMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([k, v]) => typeof k === 'string' && typeof v === 'string')
      .map(([k, v]) => [k.slice(0, 60), (v as string).slice(0, 10)])
      .slice(0, MAX_DAILY_AWARD_KEYS),
  );
}

// ── GET /api/profile ────────────────────────────────────────────

export async function GET() {
  const userId = await getUser();
  if (!userId) return err('Unauthorized', 401);

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('fighter_profiles')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[profile/GET] fetch error:', error);
    return err('Failed to fetch profile', 500);
  }

  return json({ profile: data });
}

// ── POST /api/profile — upsert athlete profile ──────────────────

export async function POST(req: NextRequest) {
  const userId = await getUser();
  if (!userId) return err('Unauthorized', 401);

  const limited = rateLimit(getRateLimitKey(req, userId), { maxRequests: 10, windowMs: 60_000 });
  if (limited) return limited;

  const body = await parseBody(req);
  if (!body) return err('Invalid JSON', 400);

  const profileData = {
    clerk_user_id: userId,
    display_name: typeof body.displayName === 'string' ? body.displayName.trim().slice(0, 30) || 'athlete' : 'athlete',
    xp: typeof body.xp === 'number' && body.xp >= 0 ? Math.floor(body.xp) : 0,
    workouts_completed: typeof body.workoutsCompleted === 'number' ? Math.max(0, Math.floor(body.workoutsCompleted)) : 0,
    articles_read: stringList(body.articlesRead),
    techniques_studied: stringList(body.techniquesStudied),
    quizzes_completed: stringList(body.quizzesCompleted),
    timer_sessions: typeof body.timerSessions === 'number' ? Math.max(0, Math.floor(body.timerSessions)) : 0,
    program_days_completed: typeof body.programDaysCompleted === 'number' ? Math.max(0, Math.floor(body.programDaysCompleted)) : 0,
    longest_streak: typeof body.longestStreak === 'number' ? Math.max(0, Math.floor(body.longestStreak)) : 0,
    seen_badges: stringList(body.seenBadges),
    daily_awards: dailyAwardsMap(body.dailyAwards),
    joined_at: typeof body.joinedAt === 'string' ? body.joinedAt.slice(0, 40) : new Date().toISOString(),
    // Cloud-synced user preferences & progress
    stance: typeof body.stance === 'string' && ['orthodox', 'southpaw'].includes(body.stance) ? body.stance : 'orthodox',
    program_progress: body.programProgress && typeof body.programProgress === 'object' && !Array.isArray(body.programProgress) ? body.programProgress : {},
    workout_log: Array.isArray(body.workoutLog) ? body.workoutLog.slice(0, MAX_LOG_ENTRIES) : [],
    current_streak: typeof body.currentStreak === 'number' ? Math.max(0, Math.floor(body.currentStreak)) : 0,
    last_visit: typeof body.lastVisit === 'string' ? body.lastVisit.slice(0, 40) : null,
    browsing_history: Array.isArray(body.browsingHistory)
      ? body.browsingHistory
          .filter((h: any) => h && typeof h.id === 'string' && typeof h.href === 'string' && typeof h.title === 'string')
          .slice(0, 30)
          .map((h: any) => ({
            id: h.id.slice(0, MAX_ITEM_LENGTH),
            type: typeof h.type === 'string' ? h.type.slice(0, 40) : 'technique',
            title: h.title.slice(0, MAX_ITEM_LENGTH),
            href: h.href.slice(0, MAX_ITEM_LENGTH),
            timestamp: typeof h.timestamp === 'number' ? h.timestamp : Date.now(),
          }))
      : [],
  };

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('fighter_profiles')
    .upsert(profileData, { onConflict: 'clerk_user_id' })
    .select()
    .single();

  if (error) {
    console.error('[profile/POST] upsert error:', error);
    return err('Failed to save profile', 500);
  }

  return json({ profile: data });
}
