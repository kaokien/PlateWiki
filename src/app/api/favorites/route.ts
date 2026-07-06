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

/** Validate and sanitize an array of technique IDs: non-empty strings, deduplicated. */
function sanitizeIds(raw: unknown): string[] | null {
  if (!Array.isArray(raw)) return null;
  const cleaned = [...new Set(
    raw.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
      .map(id => id.trim())
  )];
  return cleaned.length > 0 ? cleaned : [];
}

// ── GET /api/favorites ──────────────────────────────────────────

export async function GET() {
  const userId = await getUser();
  if (!userId) return err('Unauthorized', 401);

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('favorites')
    .select('technique_id, saved_at')
    .eq('clerk_user_id', userId)
    .order('saved_at', { ascending: false });

  if (error) {
    console.error('[favorites/GET] fetch error:', error);
    return err('Failed to fetch favorites', 500);
  }

  return json({ favorites: (data || []).map(f => f.technique_id) });
}

// ── POST /api/favorites — add one or bulk-add ───────────────────

export async function POST(req: NextRequest) {
  const userId = await getUser();
  if (!userId) return err('Unauthorized', 401);

  const body = await parseBody(req);
  if (!body) return err('Invalid JSON', 400);

  const limited = rateLimit(getRateLimitKey(req, userId), { maxRequests: 15, windowMs: 60_000 });
  if (limited) return limited;

  // Accept { techniqueId: string } or { favorites: string[] }
  let ids: string[];
  if (body.favorites) {
    const cleaned = sanitizeIds(body.favorites);
    if (cleaned === null) return err('favorites must be an array of strings', 400);
    if (cleaned.length === 0) return err('favorites array is empty', 400);
    ids = cleaned;
  } else if (typeof body.techniqueId === 'string' && body.techniqueId.trim()) {
    ids = [body.techniqueId.trim()];
  } else {
    return err('Missing or invalid techniqueId or favorites', 400);
  }

  const supabase = createServerSupabase();
  const rows = ids.map(id => ({ clerk_user_id: userId, technique_id: id }));

  const { error } = await supabase
    .from('favorites')
    .upsert(rows, { onConflict: 'clerk_user_id,technique_id', ignoreDuplicates: true });

  if (error) {
    console.error('[favorites/POST] save error:', error);
    return err('Failed to save favorites', 500);
  }

  return json({ success: true });
}

// ── DELETE /api/favorites — remove one favorite ─────────────────

export async function DELETE(req: NextRequest) {
  const userId = await getUser();
  if (!userId) return err('Unauthorized', 401);

  const body = await parseBody(req);
  if (!body) return err('Invalid JSON', 400);

  const limited = rateLimit(getRateLimitKey(req, userId), { maxRequests: 15, windowMs: 60_000 });
  if (limited) return limited;

  if (typeof body.techniqueId !== 'string' || !body.techniqueId.trim()) {
    return err('Missing or invalid techniqueId', 400);
  }

  const supabase = createServerSupabase();
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('clerk_user_id', userId)
    .eq('technique_id', body.techniqueId.trim());

  if (error) {
    console.error('[favorites/DELETE] error:', error);
    return err('Failed to delete favorite', 500);
  }

  return json({ success: true });
}

// ── PUT /api/favorites — atomic full replace (diff-based) ───────

export async function PUT(req: NextRequest) {
  const userId = await getUser();
  if (!userId) return err('Unauthorized', 401);

  const limited = rateLimit(getRateLimitKey(req, userId), { maxRequests: 15, windowMs: 60_000 });
  if (limited) return limited;

  const body = await parseBody(req);
  if (!body) return err('Invalid JSON', 400);

  const cleaned = sanitizeIds(body.favorites);
  if (cleaned === null) return err('favorites must be an array of strings', 400);

  const supabase = createServerSupabase();

  // Fetch current cloud state
  const { data: existing, error: fetchError } = await supabase
    .from('favorites')
    .select('technique_id')
    .eq('clerk_user_id', userId);

  if (fetchError) {
    console.error('[favorites/PUT] fetch error:', fetchError);
    return err('Failed to read current favorites', 500);
  }

  const cloudSet = new Set((existing || []).map(f => f.technique_id));
  const localSet = new Set(cleaned);

  // Diff: what to add and what to remove
  const toAdd = cleaned.filter(id => !cloudSet.has(id));
  const toRemove = [...cloudSet].filter(id => !localSet.has(id));

  // Remove stale favorites
  if (toRemove.length > 0) {
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('clerk_user_id', userId)
      .in('technique_id', toRemove);

    if (deleteError) {
      console.error('[favorites/PUT] delete error:', deleteError);
      return err('Failed to remove stale favorites', 500);
    }
  }

  // Add new favorites
  if (toAdd.length > 0) {
    const rows = toAdd.map(id => ({ clerk_user_id: userId, technique_id: id }));
    const { error: insertError } = await supabase
      .from('favorites')
      .upsert(rows, { onConflict: 'clerk_user_id,technique_id', ignoreDuplicates: true });

    if (insertError) {
      console.error('[favorites/PUT] insert error:', insertError);
      return err('Failed to add new favorites', 500);
    }
  }

  return json({ success: true });
}
