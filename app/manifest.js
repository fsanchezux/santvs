import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

export default function manifest() {
  return {
    name: SITE_NAME,
    short_name: 'Les Santxs',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#fc4c02',
    lang: 'ca',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
