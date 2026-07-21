'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Guided walkthrough that navigates through the app: starts on the branding
// showreel, then map → acts list → gallery. Triggered on first visit (from the
// welcome modal) and re-runnable any time via the "i" TourButton.
const STEPS = [
  {
    route: '/branding',
    icon: 'fa-palette',
    title: 'El branding',
    text: 'Tot arrenca aquí: la identitat visual de Les Santes, inspirada en el llenguatge de «Strava».',
  },
  {
    route: '/',
    icon: 'fa-map-location-dot',
    title: 'El mapa',
    text: 'La pantalla principal. Explora tots els actes situats sobre el mapa de Mataró.',
  },
  {
    route: '/llista',
    icon: 'fa-list-ul',
    title: 'La llista d’actes',
    text: 'Tots els actes ordenats i filtrables per dia, amb tots els detalls.',
  },
  {
    route: '/galeria',
    icon: 'fa-images',
    title: 'La galeria',
    text: 'Fes-te fotos estil BeReal als actes amb el botó taronja i comparteix-les amb tothom.',
  },
];

const DONE_KEY = 'santvs_tour_done';

export default function TourController() {
  const router = useRouter();
  const [step, setStep] = useState(-1); // -1 = inactive

  const go = useCallback(
    i => {
      setStep(i);
      router.push(STEPS[i].route);
    },
    [router]
  );

  const finish = useCallback(() => {
    setStep(-1);
    try {
      window.localStorage.setItem(DONE_KEY, '1');
    } catch {}
  }, []);

  useEffect(() => {
    const onStart = () => go(0);
    window.addEventListener('santvs:start-tour', onStart);
    return () => window.removeEventListener('santvs:start-tour', onStart);
  }, [go]);

  if (step < 0) return null;

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1500] flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+76px)]">
      <div className="pointer-events-auto w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fc4c02]/10 text-[#fc4c02]">
            <i className={`fa-solid ${s.icon} text-lg`} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              {step + 1} / {STEPS.length}
            </p>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">{s.title}</h3>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{s.text}</p>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-5 bg-[#fc4c02]' : 'w-1.5 bg-neutral-300 dark:bg-neutral-700'
              }`}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={finish}
            className="rounded-full px-4 py-2.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            Ometre
          </button>
          <button
            onClick={() => (isLast ? finish() : go(step + 1))}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#fc4c02] px-5 py-2.5 text-sm font-semibold text-white"
          >
            {isLast ? 'Som-hi!' : 'Següent'}
            {!isLast && <i className="fa-solid fa-arrow-right" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  );
}
