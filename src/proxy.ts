import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  // Gracefully bypass if Clerk keys are not set in the environment yet
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    return;
  }

  // Signed-in users land on their dashboard. Redirecting at the edge — before
  // any HTML is sent — avoids the flash of the marketing homepage that the old
  // client-side swap (HomePage -> dynamic DashboardPage) caused, while the
  // homepage itself stays fully static for signed-out visitors and crawlers.
  try {
    if (req.nextUrl.pathname === '/') {
      const { userId } = await auth();
      if (userId) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  } catch (error) {
    console.error('Clerk middleware error:', error);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
