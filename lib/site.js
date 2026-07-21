// Central site config used by metadata, sitemap, robots, manifest and JSON-LD.
// Override the URL per environment with NEXT_PUBLIC_SITE_URL; defaults to the
// production domain so canonical/OG URLs are stable once the domain is live.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://lessantxs.com').replace(/\/$/, '');
export const SITE_NAME = 'Les Santxs 2026';
export const SITE_DESCRIPTION =
  'El programa i el mapa de Les Santes de Mataró 2026: tots els actes de la Festa Major situats al mapa, la llista completa i una galeria de fotos compartida.';
