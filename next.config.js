/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['news1.suddsy.dev', 'news2.suddsy.dev', '127.0.0.1', 'notidb.suddsy.dev'],
  },
  async headers() {
    if (process.env.PRODUCTION === 'true') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self' noti.jamesmowat.com; style-src 'self' 'unsafe-inline'; frame-src 'self' docs.google.com notidb.suddsy.dev; connect-src 'self' notidb.suddsy.dev; img-src 'self' notidb.suddsy.dev;",
            },
          ],
        },
      ];
    }
    // Return an empty array if not in production
    return [];
  },
}

const withOffline = require('next-offline');

module.exports = withOffline(nextConfig);
