// Images the user can pick from in the share sheet (Instagram Stories, etc.).
//
// ── Com afegir-ne més ─────────────────────────────────────────────
// 1. Desa el fitxer d'imatge dins de `public/share/` (per exemple
//    `public/share/dorsals-2.jpg`). Recomanat: format vertical 1080×1920.
// 2. Afegeix una entrada en aquesta llista amb la seva ruta i una etiqueta:
//        { src: '/share/dorsals-2.jpg', label: 'Dorsals 2' },
// La primera de la llista és la seleccionada per defecte.
// ──────────────────────────────────────────────────────────────────
export const SHARE_IMAGES = [
  { src: '/og.jpg', label: 'Dorsals' },
];
