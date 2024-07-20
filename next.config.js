/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
              value: `
                default-src 'self' p.suddsy.dev note.suddsy.dev;
                script-src-elem unpkg.com 'self' 'unsafe-inline';
                style-src 'self' 'unsafe-inline';
                font-src 'self' 'unsafe-inline' fonts.gstatic.com fonts.google.com fonts.googleapis.com;
                frame-src *;
                connect-src 'self' unsplash.com api.unsplash.com images.unsplash.com noti.suddsy.dev proti.suddsy.dev;
                img-src 'self' noti.suddsy.dev proti.suddsy.dev p.suddsy.dev images.unsplash.com unsplash.com data: blob:;
                worker-src 'self' unpkg.com https://cdn.jsdelivr.net;
              `.replace(/\s{2,}/g, ' ').trim() // Minimize the string for cleaner CSP
            },
          ],
        },
      ];
    }
    // Return an empty array if not in production
    return [];
  },
}

// const withOffline = require('next-offline');

module.exports = nextConfig;
