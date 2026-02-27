import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side route guard — runs before page renders.
 * Eliminates the client-side "flash before redirect" on protected routes.
 *
 * Auth cookie: Supabase sets `sb-<project>-auth-token` as an httpOnly cookie.
 * We check for its presence as a gate — actual role validation still happens
 * in the page-level route guards (which call GET /api/auth/me).
 *
 * NOTE: Next.js 16 renamed middleware.ts → proxy.ts
 */

// Routes that require authentication (any role)
const AUTH_REQUIRED = ['/business', '/admin'];

// Cookie names Supabase uses (covers both old and new SSR patterns)
const AUTH_COOKIE_PATTERNS = [
    'sb-',          // matches sb-<projectRef>-auth-token
    'supabase-auth', // legacy pattern
];

function hasAuthCookie(request: NextRequest): boolean {
    const cookies = request.cookies.getAll();
    return cookies.some(c =>
        AUTH_COOKIE_PATTERNS.some(pattern => c.name.startsWith(pattern)) &&
        c.value.length > 10
    );
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip static files, API routes, and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    const isProtected = AUTH_REQUIRED.some(route => pathname.startsWith(route));

    // Allow signup/login pages through without auth check
    const isAuthPage =
        pathname === '/business/login' ||
        pathname === '/business/signup' ||
        pathname === '/admin/login';

    if (isProtected && !isAuthPage && !hasAuthCookie(request)) {
        const loginPath = pathname.startsWith('/admin')
            ? '/admin/login'
            : '/business/login';

        const url = request.nextUrl.clone();
        url.pathname = loginPath;
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Block /business/services — route exists on disk but is not ready for production
    if (pathname === '/business/services') {
        const url = request.nextUrl.clone();
        url.pathname = '/business/dashboard';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico, sitemap.xml, robots.txt
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images/).*)',
    ],
};
