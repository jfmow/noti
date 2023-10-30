/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['127.0.0.1', 'noti.suddsy.dev', 'proti.suddsy.dev', 'images.unsplash.com', 'unsplash.com'],
  },
  async headers() {
    if (process.env.PRODUCTION === 'true') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self' savemynotes.net p.suddsy.dev noti.jamesmowat.com; style-src 'self' 'unsafe-inline'; frame-src *; connect-src 'self' unsplash.com api.unsplash.com images.unsplash.com noti.suddsy.dev proti.suddsy.dev; img-src 'self' noti.suddsy.dev proti.suddsy.dev images.unsplash.com unsplash.com data:; worker-src 'self' https://cdn.jsdelivr.net;"
            },
          ],

        },
      ];
    }
    // Return an empty array if not in production
    return [];
  },
}

//const withOffline = require('next-offline');

module.exports = nextConfig;
