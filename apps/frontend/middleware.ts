import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = [
  '/',
  '/pricing',
  '/pricing-mensuel',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/google',
  '/legal/mentions',
  '/legal/faq',
  '/not-found',
];

const PUBLIC_ROUTE_PATTERNS = [
  /^\/questionnaire\/.+$/,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_ROUTE_PATTERNS.some(pattern => pattern.test(pathname));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname.startsWith('/static') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token');

  if (!token) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
