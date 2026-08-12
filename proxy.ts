import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isWellKnown(pathname: string) {
  return pathname === '/.well-known' || pathname.startsWith('/.well-known/');
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Probe paths like /.git, /.github, /.env, /.aws, … — not LNURL /.well-known
  if (pathname.startsWith('/.') && !isWellKnown(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  // Leading "/." paths only (avoids running on normal pages)
  matcher: ['/(\\..*)']
};
