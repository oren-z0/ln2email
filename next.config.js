/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: []
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/lnurlp/:path*',
        destination: '/api/well-known/lnurlp/:path*'
      },
      {
        source: '/.well-known/nostr.json',
        destination: '/api/well-known/nostr.json'
      }
    ];
  },
  async redirects() {
    return [
      {
        // Skip /.well-known and other "/." probe paths (those get 404 from proxy.ts)
        source: '/((?!\\.).*)',
        destination: `https://${process.env.NEXT_PUBLIC_DOMAIN}`,
        permanent: true,
        has: [{
          type: 'host',
          value: '(.*\.ln2\.email)'
        }]
      }
    ];
  }
};

module.exports = nextConfig;
