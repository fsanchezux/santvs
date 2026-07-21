import { SITE_URL } from '@/lib/site';

export default function sitemap() {
  const now = new Date();
  const routes = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    { path: '/llista', priority: 0.9, changeFrequency: 'daily' },
    { path: '/galeria', priority: 0.7, changeFrequency: 'hourly' },
    { path: '/branding', priority: 0.5, changeFrequency: 'monthly' },
  ];
  return routes.map(r => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
