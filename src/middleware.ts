import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = request.nextUrl.pathname;
  
  // Check for a special "no_redirect" query parameter to break infinite loops
  const noRedirect = request.nextUrl.searchParams.get('no_redirect') === 'true';
  
  // If trying to access signin or signup pages, redirect to create-profile
  if ((path.startsWith('/auth/signin') || path.startsWith('/auth/signup')) && !noRedirect) {
    console.log('Middleware redirecting auth page to create-profile');
    url.pathname = '/create-profile';
    // Add a parameter to prevent further redirects if we get in a loop
    url.searchParams.set('no_redirect', 'true');
    return NextResponse.redirect(url);
  }

  // Get the pathname of the request
  // Only handle the auth pages, disable the other middleware logic that might cause problems
  return NextResponse.next();
}

// Configure matcher to only run on specific paths
export const config = {
  matcher: [
    '/auth/:path*',
  ],
}; 