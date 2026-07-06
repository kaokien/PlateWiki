import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import crypto from 'crypto';

/**
 * POST /api/webhooks/clerk — handle Clerk webhook events.
 *
 * Currently handles:
 * - user.deleted → cascade delete all user data from Supabase
 *
 * Setup:
 * 1. In Clerk Dashboard → Webhooks → Add Endpoint
 * 2. URL: https://your-domain.com/api/webhooks/clerk
 * 3. Subscribe to: user.deleted
 * 4. Copy the Signing Secret → add as CLERK_WEBHOOK_SECRET in env
 */

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Verify Clerk webhook signature (Svix).
 * Returns the parsed body if valid, null if invalid.
 */
function verifyWebhook(body: string, headers: Headers): Record<string, unknown> | null {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[webhook/clerk] CLERK_WEBHOOK_SECRET not configured');
    return null;
  }

  const svixId = headers.get('svix-id');
  const svixTimestamp = headers.get('svix-timestamp');
  const svixSignature = headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.warn('[webhook/clerk] Missing svix headers');
    return null;
  }

  // Check timestamp is within 5 minutes (prevent replay attacks)
  const timestamp = parseInt(svixTimestamp, 10);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > 300) {
    console.warn('[webhook/clerk] Timestamp too old');
    return null;
  }

  // Verify signature
  // Clerk/Svix signs: `${svixId}.${svixTimestamp}.${body}`
  const signedContent = `${svixId}.${svixTimestamp}.${body}`;

  // Secret comes as "whsec_..." — strip prefix and base64 decode
  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const expectedSignature = crypto
    .createHmac('sha256', secretBytes)
    .update(signedContent)
    .digest('base64');

  // Svix sends comma-separated signatures like "v1,XXXX v1,YYYY"
  const signatures = svixSignature.split(' ').map(s => s.split(',')[1]);
  const isValid = signatures.some(sig => {
    try {
      return crypto.timingSafeEqual(
        Buffer.from(sig || '', 'base64'),
        Buffer.from(expectedSignature, 'base64')
      );
    } catch {
      return false;
    }
  });

  if (!isValid) {
    console.warn('[webhook/clerk] Invalid signature');
    return null;
  }

  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const payload = verifyWebhook(rawBody, req.headers);

  if (!payload) {
    return json({ error: 'Invalid webhook signature' }, 401);
  }

  const eventType = payload.type as string;

  if (eventType === 'user.deleted') {
    const data = payload.data as Record<string, unknown> | undefined;
    const clerkUserId = data?.id as string | undefined;

    if (!clerkUserId) {
      console.error('[webhook/clerk] user.deleted event missing user id');
      return json({ error: 'Missing user id' }, 400);
    }

    if (process.env.NODE_ENV !== 'production') console.log(`[webhook/clerk] Processing user.deleted for ${clerkUserId}`);

    const supabase = createServerSupabase();

    // Delete fighter_profiles row — FK constraints cascade to favorites + saved_workouts
    const { error } = await supabase
      .from('fighter_profiles')
      .delete()
      .eq('clerk_user_id', clerkUserId);

    if (error) {
      console.error('[webhook/clerk] Failed to delete user data:', error);
      return json({ error: 'Failed to clean up user data' }, 500);
    }

    // Also clean up training_stats if it exists
    await supabase
      .from('training_stats')
      .delete()
      .eq('clerk_user_id', clerkUserId);

    if (process.env.NODE_ENV !== 'production') console.log(`[webhook/clerk] Successfully cleaned up data for ${clerkUserId}`);
    return json({ success: true });
  }

  // Unhandled event type — acknowledge receipt
  return json({ received: true });
}
