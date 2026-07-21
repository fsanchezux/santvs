'use client';

// Top-right button present on every screen. Opens the shared modal (same as
// the tour's final facet, minus the "start" button) with the copy-link and
// Instagram Stories options.
export default function ShareButton({ className = '' }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('santvs:open-share'))}
      aria-label="Compartir l'aplicació"
      title="Compartir"
      className={`flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-900/5 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white ${className}`}
    >
      <i className="fa-solid fa-share-nodes text-lg" aria-hidden="true" />
    </button>
  );
}
