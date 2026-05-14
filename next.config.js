/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'avatar.tobi.sh' },
      { hostname: 'cloudflare-ipfs.com' },
      { hostname: 'loremflickr.com' }
    ]
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
        source: '/((?!.well-known/).*)',
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
