// Images the user can pick from in the share sheet (Instagram Stories, etc.).
//
// ── Com afegir-ne més ─────────────────────────────────────────────
// 1. Desa el fitxer dins de `public/` (el nom és lliure; recomanat sense
//    espais ni accents, p. ex. `share-5.png`). Vertical, ideal 1080×1920.
// 2. Afegeix una línia aquí amb la seva ruta (comença per `/`) i una etiqueta:
//        { src: '/share-5.png', label: 'Opció 5' },
// La primera de la llista és la seleccionada per defecte. El selector només
// apareix quan n'hi ha més d'una.
// ──────────────────────────────────────────────────────────────────
export const SHARE_IMAGES = [
  { src: '/share-1.jpg', label: 'Opció 1' },
  { src: '/share-2.png', label: 'Opció 2' },
  { src: '/share-3.png', label: 'Opció 3' },
  { src: '/share-4.png', label: 'Opció 4' },
  { src: '/share-5.png', label: 'Opció 5' },
];
