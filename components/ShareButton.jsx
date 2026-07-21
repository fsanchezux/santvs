'use client';

import { useEffect, useRef, useState } from 'react';
import { shareApp } from '@/lib/share';

// Top-right button to share the app. Opens the native share sheet on mobile,
// otherwise copies the link and shows a brief "copied" toast.
export default function ShareButton({ className = '' }) {
  const [toast, setToast] = useState(null); // null | 'copied' | 'failed'
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    const result = await shareApp();
    if (result === 'shared' || result === 'cancelled') return;
    setToast(result === 'copied' ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        aria-label="Compartir l'aplicació"
        title="Compartir enllaç"
        className={`flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-900/5 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white ${className}`}
      >
        <i className="fa-solid fa-share-nodes text-lg" aria-hidden="true" />
      </button>
      {toast && (
        <span
          role="status"
          className="pointer-events-none absolute right-0 top-11 z-[1000] whitespace-nowrap rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-neutral-950"
        >
          {toast === 'copied' ? 'Enllaç copiat!' : 'No s’ha pogut copiar'}
        </span>
      )}
    </div>
  );
}
