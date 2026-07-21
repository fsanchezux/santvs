'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Guided walkthrough that navigates through the app: starts on the branding
// showreel, then map → acts list → gallery. Triggered on first visit (from the
// welcome modal) and re-runnable any time via the "i" TourButton.
const STEPS = [
  {
    route: '/branding',
    icon: 'fa-film',
    title: 'El branding',
    summary: 'La identitat visual del projecte, inspirada en Strava.',
    text: 'He desenvolupat una identitat visual per a la Festa Major de Les Santes inspirada en el llenguatge visual de Strava.',
    strava: true,
  },
  {
    route: '/',
    icon: 'fa-map-location-dot',
    title: 'El mapa',
    summary: 'La pantalla principal, amb tots els actes sobre el mapa.',
    text: [
      'Després de desenvolupar com seria aquesta identitat visual, vaig estirar la idea una mica més enllà, transformant no només l’aspecte visual, sinó també la part utilitària. És així com apareix el mapa.',
      'Aquest està basat en la pantalla principal de Strava, on es troben les rutes recomanades del teu entorn. En aquest cas, les rutes passen a ser els actes de la Festa Major i la pantalla principal es transforma en un programa de Les Santes.',
    ],
  },
  {
    route: '/llista',
    icon: 'fa-list-ul',
    title: 'La llista d’actes',
    summary: 'Tots els actes en format llista, filtrables per dia.',
    text: 'Complementa l’apartat de mapa i dóna una versió adaptada dels actes.',
  },
  {
    route: '/galeria',
    icon: 'fa-images',
    title: 'La galeria',
    summary: 'Comparteix les teves fotos dels actes de la festa.',
    text: 'I per acabar, el que fa que l’aplicació en la que ens estem inspirant tingui tant d’èxit és la seva faceta de xarxa social. En aquest cas, l’adaptació i la sinergia entre les dues idees no ha sigut tan directa.',
    steps: [
      {
        icon: 'fa-solid fa-camera-retro',
        title: 'Estil BeReal',
        text: 'Primer un selfie i tot seguit la foto del davant. Es combinen en una sola imatge.',
      },
      {
        icon: 'fa-solid fa-calendar-day',
        title: 'Una foto al dia',
        text: 'Cada dia de Les Santes pots pujar una foto. Tria bé el teu moment!',
      },
      {
        icon: 'fa-regular fa-images',
        title: 'Ordenada per dies',
        text: 'La galeria és compartida i s’agrupa per dies. Comparteix o descarrega la que vulguis.',
      },
    ],
  },
];

const SEEN_KEY = 'santvs_welcome_seen';

export default function TourController() {
  const router = useRouter();
  const [step, setStep] = useState(-1); // -1 = inactive
  const [showStrava, setShowStrava] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const go = useCallback(
    i => {
      setStep(i);
      setExpanded(false);
      router.push(STEPS[i].route);
    },
    [router]
  );

  // End of the tour → show the welcome modal as the final facet.
  const finish = useCallback(() => {
    setStep(-1);
    setShowStrava(false);
    setTimeout(() => window.dispatchEvent(new Event('santvs:open-welcome')), 60);
  }, []);

  useEffect(() => {
    const onStart = () => go(0);
    window.addEventListener('santvs:start-tour', onStart);
    // Auto-start the tour on the very first visit.
    let seen = true;
    try {
      seen = !!window.localStorage.getItem(SEEN_KEY);
    } catch {}
    if (!seen) go(0);
    return () => window.removeEventListener('santvs:start-tour', onStart);
  }, [go]);

  if (step < 0) return null;

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1500] flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+76px)]">
      <div className="pointer-events-auto max-h-[78vh] w-full max-w-sm overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10">
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

        {/* Concise summary — always visible */}
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{s.summary}</p>

        {/* Optional "know more" toggle → reveals the fuller description */}
        {(s.text || s.steps) && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#fc4c02]"
            aria-expanded={expanded}
          >
            {expanded ? 'Mostrar-ne menys' : 'Saber-ne més'}
            <i className={`fa-solid fa-chevron-${expanded ? 'up' : 'down'} text-[10px]`} aria-hidden="true" />
          </button>
        )}

        {expanded && (
          <div className="mt-3 border-t border-neutral-900/5 pt-3 dark:border-white/10">
            {Array.isArray(s.text) ? (
              <div className="space-y-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {s.text.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
            ) : (
              s.text && <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{s.text}</p>
            )}

            {s.strava && (
              <button
                onClick={() => setShowStrava(true)}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-[#fc4c02] hover:underline"
              >
                <i className="fa-solid fa-circle-question" aria-hidden="true" />
                Què és Strava?
              </button>
            )}

            {s.steps && (
              <ul className="mt-4 flex flex-col gap-3">
                {s.steps.map(st => (
                  <li key={st.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fc4c02]/10 text-[#fc4c02]">
                      <i className={`${st.icon} text-sm`} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">{st.title}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{st.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

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

      {showStrava && <StravaModal onClose={() => setShowStrava(false)} />}
    </div>
  );
}

function StravaModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      className="pointer-events-auto fixed inset-0 z-[1700] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg font-bold text-[#fc4c02]">
            <i className="fa-brands fa-strava" aria-hidden="true" />
            Què és Strava?
          </span>
          <button
            onClick={onClose}
            aria-label="Tancar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-900/5 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <i className="fa-solid fa-xmark text-lg" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          Strava és l’aplicació i xarxa social esportiva més popular per registrar activitats com
          córrer o anar amb bici: enregistra els teus recorreguts en un mapa, en guarda les
          estadístiques i et permet compartir-los i seguir la teva comunitat.
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <a
            href="https://apps.apple.com/app/strava/id426826309"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950"
          >
            <i className="fa-brands fa-app-store-ios text-base" aria-hidden="true" />
            App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.strava"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-neutral-900/15 px-5 py-3 text-sm font-semibold text-neutral-800 dark:border-white/15 dark:text-neutral-100"
          >
            <i className="fa-brands fa-google-play text-base" aria-hidden="true" />
            Google Play
          </a>
        </div>
      </div>
    </div>
  );
}
