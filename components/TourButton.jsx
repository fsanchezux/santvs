'use client';

// Small "i" button that restarts the guided tour. Decoupled from the
// TourController via a window event so it can live anywhere in the UI.
export default function TourButton({ className = '' }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('santvs:start-tour'))}
      aria-label="Fer el tour de l’aplicació"
      title="Com funciona l’app"
      className={`flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-900/5 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white ${className}`}
    >
      <i className="fa-solid fa-circle-info text-lg" aria-hidden="true" />
    </button>
  );
}
