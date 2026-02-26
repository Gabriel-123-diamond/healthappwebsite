import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
 
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin Route Protection
  // Protect all /admin routes except the login page
  if (pathname.includes('/admin') && !pathname.includes('/admin/login')) {
    const adminSession = request.cookies.get('admin_session');
    
    if (!adminSession) {
      // Improved locale detection
      const segments = pathname.split('/');
      const firstSegment = segments[1];
      const locale = routing.locales.includes(firstSegment as any) ? firstSegment : routing.defaultLocale;
      
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}
 
export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_static (inside /public)
  // - /_vercel (Vercel internals)
  // - all root files inside /public (e.g. /favicon.ico)
  matcher: ['/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)']
};