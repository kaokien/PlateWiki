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

/** Validate a workout object has required string fields. */
function isValidWorkout(w: unknown): w is Record<string, unknown> {
  if (!w || typeof w !== 'object') return false;
  const obj = w as Record<string, unknown>;
  return typeof obj.title === 'string' && obj.title.trim().length > 0;
}

/** Map a client workout to a DB row. */
function toDbRow(w: Record<string, unknown>, userId: string) {
  return {
    clerk_user_id: userId,
    title: (w.title as string).trim(),
    duration: typeof w.duration === 'string' ? w.duration : '',
    goal: typeof w.goal === 'string' ? w.goal : '',
    level: typeof w.level === 'string' ? w.level : '',
    equipment: typeof w.equipment === 'string' ? w.equipment : '',
    drills: Array.isArray(w.drills) ? w.drills : [],
    gym_exercises: Array.isArray(w.gymExercises) ? w.gymExercises
      : Array.isArray(w.gym_exercises) ? w.gym_exercises : [],
    warmup: Array.isArray(w.warmup) ? w.warmup : [],
    cooldown: Array.isArray(w.cooldown) ? w.cooldown : [],
    saved_at: typeof w.savedAt === 'string' ? w.savedAt
      : typeof w.saved_at === 'string' ? w.saved_at
      : new Date().toISOString(),
  };
}

// ── GET /api/workouts ───────────────────────────────────────────

export async function GET() {
  const userId = await getUser();
  if (!userId) return err('Unauthorized', 401);

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('saved_workouts')
    .select('*')
    .eq('clerk_user_id', userId)
    .order('saved_at', { ascending: false });

  if (error) {
    console.error('[workouts/GET] fetch error:', error);
    return err('Failed to fetch workouts', 500);
  }

  return json({ workouts: data });
}

// ── POST /api/workouts — save one or bulk-sync ──────────────────

export async function POST(req: NextRequest) {
  const userId = await getUser();
  if (!userId) return err('Unauthorized', 401);

  const limited = rateLimit(getRateLimitKey(req, userId), { maxRequests: 10, windowMs: 60_000 });
  if (limited) return limited;

  const body = await parseBody(req);
  if (!body) return err('Invalid JSON', 400);

  const workoutsRaw = Array.isArray(body.workouts) ? body.workouts : [body];
  const valid = workoutsRaw.filter(isValidWorkout);

  if (valid.length === 0) {
    return err('No valid workouts provided. Each workout needs at least a title.', 400);
  }

  const supabase = createServerSupabase();
  const rows = valid.map(w => toDbRow(w, userId));

  const { data, error } = await supabase
    .from('saved_workouts')
    .insert(rows)
    .select();

  if (error) {
    console.error('[workouts/POST] save error:', error);
    return err('Failed to save workout', 500);
  }

  return json({ workouts: data });
}

// ── DELETE /api/workouts — delete one workout by ID ─────────────

export async function DELETE(req: NextRequest) {
  const userId = await getUser();
  if (!userId) return err('Unauthorized', 401);

  const limited = rateLimit(getRateLimitKey(req, userId), { maxRequests: 10, windowMs: 60_000 });
  if (limited) return limited;

  const body = await parseBody(req);
  if (!body) return err('Invalid JSON', 400);

  if (typeof body.id !== 'string' || !body.id.trim()) {
    return err('Missing or invalid workout id', 400);
  }

  const supabase = createServerSupabase();
  const { error } = await supabase
    .from('saved_workouts')
    .delete()
    .eq('id', body.id.trim())
    .eq('clerk_user_id', userId);

  if (error) {
    console.error('[workouts/DELETE] error:', error);
    return err('Failed to delete workout', 500);
  }

  return json({ success: true });
}

// ── PUT /api/workouts — atomic full replace (diff-based) ────────

export async function PUT(req: NextRequest) {
  const userId = await getUser();
  if (!userId) return err('Unauthorized', 401);

  const limited = rateLimit(getRateLimitKey(req, userId), { maxRequests: 10, windowMs: 60_000 });
  if (limited) return limited;

  const body = await parseBody(req);
  if (!body) return err('Invalid JSON', 400);

  if (!Array.isArray(body.workouts)) {
    return err('workouts must be an array', 400);
  }

  const valid = (body.workouts as unknown[]).filter(isValidWorkout);
  const supabase = createServerSupabase();

  // Fetch current cloud state
  const { data: existing, error: fetchError } = await supabase
    .from('saved_workouts')
    .select('id, title, saved_at')
    .eq('clerk_user_id', userId);

  if (fetchError) {
    console.error('[workouts/PUT] fetch error:', fetchError);
    return err('Failed to read current workouts', 500);
  }

  // Build lookup keys: title||saved_at for matching
  const cloudMap = new Map<string, string>();
  for (const w of existing || []) {
    cloudMap.set(`${w.title}||${w.saved_at}`, w.id);
  }

  const localKeys = new Set(
    valid.map(w => `${(w.title as string).trim()}||${w.savedAt || w.saved_at || ''}`)
  );

  // IDs of cloud workouts not in local set → remove
  const toRemoveIds = [...cloudMap.entries()]
    .filter(([key]) => !localKeys.has(key))
    .map(([, id]) => id);

  // Workouts in local set not in cloud → add
  const toAdd = valid.filter(w => {
    const key = `${(w.title as string).trim()}||${w.savedAt || w.saved_at || ''}`;
    return !cloudMap.has(key);
  });

  // Remove stale workouts
  if (toRemoveIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('saved_workouts')
      .delete()
      .eq('clerk_user_id', userId)
      .in('id', toRemoveIds);

    if (deleteError) {
      console.error('[workouts/PUT] delete error:', deleteError);
      return err('Failed to remove stale workouts', 500);
    }
  }

  // Add new workouts
  if (toAdd.length > 0) {
    const rows = toAdd.map(w => toDbRow(w, userId));
    const { error: insertError } = await supabase
      .from('saved_workouts')
      .insert(rows);

    if (insertError) {
      console.error('[workouts/PUT] insert error:', insertError);
      return err('Failed to add new workouts', 500);
    }
  }

  return json({ success: true });
}
