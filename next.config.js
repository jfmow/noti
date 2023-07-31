/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['news1.suddsy.dev', 'news2.suddsy.dev', '127.0.0.1', 'noti.suddsy.dev', 'web-platforms.sfo2.cdn.digitaloceanspaces.com'],
  },
  async headers() {
    if (process.env.PRODUCTION === 'true') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self' savemynotes.net noti.jamesmowat.com; style-src 'self' 'unsafe-inline'; frame-src *; connect-src 'self' noti.suddsy.dev; img-src 'self' noti.suddsy.dev web-platforms.sfo2.cdn.digitaloceanspaces.com data:; worker-src 'self' https://cdn.jsdelivr.net;"
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
