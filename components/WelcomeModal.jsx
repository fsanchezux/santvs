'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Wordmark from './Wordmark';
import { getShareUrl, copyShareUrl, shareStoryImage } from '@/lib/share';
import { SHARE_IMAGES } from '@/lib/shareImages';

const SEEN_KEY = 'santvs_welcome_seen';

const SOCIAL_URL = 'https://www.instagram.com/fsanchez.co'; // "podeu seguir-me a les xarxes socials"

// Two entry points, same content:
//  · `santvs:open-welcome` → final facet of the tour (with the "start" button)
//  · `santvs:open-share`   → the reusable share sheet (from the ShareButton)
export default function WelcomeModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [igBusy, setIgBusy] = useState(false);
  const [igError, setIgError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(SHARE_IMAGES[0]?.src || '/og.jpg');

  useEffect(() => {
    setUrl(getShareUrl());
    const openFinale = () => {
      setShowStart(true);
      setOpen(true);
    };
    const openShare = () => {
      setShowStart(false);
      setOpen(true);
    };
    window.addEventListener('santvs:open-welcome', openFinale);
    window.addEventListener('santvs:open-share', openShare);
    return () => {
      window.removeEventListener('santvs:open-welcome', openFinale);
      window.removeEventListener('santvs:open-share', openShare);
    };
  }, []);

  const markSeen = () => {
    try {
      window.localStorage.setItem(SEEN_KEY, '1');
    } catch {}
  };

  // Close the modal. When `goToMap` is true, land the user on the map.
  const close = goToMap => {
    setOpen(false);
    markSeen();
    if (goToMap) router.push('/');
  };

  const onCopy = async () => {
    const ok = await copyShareUrl();
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const onInstagram = async () => {
    if (igBusy) return;
    setIgBusy(true);
    setIgError(false);
    const result = await shareStoryImage(selectedImage);
    if (result === 'failed') setIgError(true);
    setIgBusy(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-900/5 px-6 py-4 dark:border-white/10">
          <Wordmark size="md" />
          <button
            onClick={() => close(false)}
            aria-label="Tancar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-900/5 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <i className="fa-solid fa-xmark text-lg" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            Si us ha agradat el projecte, podeu seguir-me a les{' '}
            <a
              href={SOCIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#fc4c02] underline underline-offset-2"
            >
              xarxes socials
            </a>
            . I recordeu: el boca-orella és l’eina més poderosa, compartir-ho es la millor formar
            d’ajudar.
          </p>

          <div className="mt-5 rounded-2xl border border-neutral-900/10 bg-neutral-50 p-3 dark:border-white/10 dark:bg-neutral-950">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Comparteix l’aplicació
            </p>
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate rounded-full bg-white px-3 py-2 text-xs text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                {url}
              </span>
              <button
                onClick={onCopy}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950"
              >
                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`} aria-hidden="true" />
                {copied ? 'Copiat!' : 'Copiar'}
              </button>
            </div>
            {SHARE_IMAGES.length > 1 && (
              <div className="mt-3">
                <p className="mb-1.5 text-[11px] text-neutral-500">Tria la imatge a compartir</p>
                <div className="no-scrollbar flex gap-2 overflow-x-auto">
                  {SHARE_IMAGES.map(img => {
                    const active = selectedImage === img.src;
                    return (
                      <button
                        key={img.src}
                        onClick={() => setSelectedImage(img.src)}
                        aria-label={img.label}
                        aria-pressed={active}
                        className={`relative shrink-0 overflow-hidden rounded-lg border-2 transition ${
                          active ? 'border-[#fc4c02]' : 'border-transparent opacity-70'
                        }`}
                      >
                        <img src={img.src} alt={img.label} className="h-20 w-14 object-cover" />
                        {active && (
                          <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#fc4c02] text-[9px] text-white">
                            <i className="fa-solid fa-check" aria-hidden="true" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <button
              onClick={onInstagram}
              disabled={igBusy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              <i className={`fa-brands ${igBusy ? 'fa-spinner fa-spin' : 'fa-instagram'} text-sm`} aria-hidden="true" />
              Compartir a Instagram Stories
            </button>
            {igError && (
              <p className="mt-1.5 text-center text-[11px] text-red-500">
                No s’ha pogut compartir la imatge. Torna-ho a provar.
              </p>
            )}
          </div>
        </div>

        {showStart && (
          <div className="border-t border-neutral-900/5 px-6 py-4 dark:border-white/10">
            <button
              onClick={() => close(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#fc4c02] px-6 py-3 text-sm font-semibold text-white"
            >
              Començar a utilitzar
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
