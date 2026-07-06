import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (!expectedSecret) {
    return NextResponse.json({ message: 'REVALIDATE_SECRET not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret') || request.headers.get('x-revalidate-token');

  if (secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const tag = searchParams.get('tag');
  const path = searchParams.get('path');

  try {
    if (tag) {
      revalidateTag(tag, {});
    }
    if (path) {
      revalidatePath(path);
    }
    
    // Default to revalidating 'articles' and path '/articles' if nothing specified
    if (!tag && !path) {
      revalidateTag('articles', {});
      revalidatePath('/articles');
      revalidatePath('/articles/[id]', 'page');
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: unknown) {
    return NextResponse.json({ message: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (!expectedSecret) {
    return NextResponse.json({ message: 'REVALIDATE_SECRET not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret') || request.headers.get('x-revalidate-token');

  if (secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const tag = searchParams.get('tag') || 'articles';
  const path = searchParams.get('path') || '/articles';

  try {
    revalidateTag(tag, {});
    revalidatePath(path);
    revalidatePath('/articles/[id]', 'page');
    return NextResponse.json({ revalidated: true, tag, path, now: Date.now() });
  } catch (err: unknown) {
    return NextResponse.json({ message: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
