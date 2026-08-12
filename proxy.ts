import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isAllowedWellKnown(pathname: string) {
  return (
    pathname === '/.well-known/nostr.json' ||
    pathname.startsWith('/.well-known/lnurlp/')
  );
}

function hostname(hostHeader: string | null) {
  return (hostHeader ?? '').split(':')[0].toLowerCase();
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = hostname(request.headers.get('host'));

  // Subdomains of the app domain (including www on non-root paths)
  if (host.endsWith(`.${process.env.NEXT_PUBLIC_DOMAIN}`)) {
    if (isAllowedWellKnown(pathname)) {
      return NextResponse.next();
    }
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}
