/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'avatar.tobi.sh',
      'cloudflare-ipfs.com',
      'loremflickr.com'
    ]
  },
  experimental: {
    legacyBrowsers: false,
    browsersListForSwc: true
  },
  async redirects() {
    return [
      {
        source: '/((?!.well-known/).*)',
        destination: 'https://ln2.email',
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
