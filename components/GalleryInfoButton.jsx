'use client';

// Small header button that re-opens the gallery tutorial. Decoupled from the
// Gallery component via a window event so it can live in the page header.
export default function GalleryInfoButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('santes:open-tutorial'))}
      aria-label="Com funciona la galeria"
      title="Com funciona"
      className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-900/5 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white"
    >
      <i className="fa-solid fa-circle-info text-lg" aria-hidden="true" />
    </button>
  );
}
