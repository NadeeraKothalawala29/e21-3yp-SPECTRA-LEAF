import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const roleHomes: Record<string, string> = {
  OFFICER: '/officer',
  MANAGER: '/manager',
  GENERAL_MANAGER: '/gm',
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get('spectraleaf_role')?.value;

  const isProtected =
    pathname.startsWith('/officer') ||
    pathname.startsWith('/manager') ||
    pathname.startsWith('/gm');

  if (isProtected && !role) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (role && isProtected) {
    if (pathname.startsWith('/officer') && role !== 'OFFICER') {
      const url = req.nextUrl.clone();
      url.pathname = roleHomes[role] ?? '/login';
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith('/manager') && role !== 'MANAGER') {
      const url = req.nextUrl.clone();
      url.pathname = roleHomes[role] ?? '/login';
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith('/gm') && role !== 'GENERAL_MANAGER') {
      const url = req.nextUrl.clone();
      url.pathname = roleHomes[role] ?? '/login';
      return NextResponse.redirect(url);
    }
  }

  if ((pathname === '/' || pathname === '/login') && role) {
    const home = roleHomes[role];
    if (home && pathname !== home) {
      const url = req.nextUrl.clone();
      url.pathname = home;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/officer/:path*', '/manager/:path*', '/gm/:path*'],
};
