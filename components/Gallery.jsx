'use client';

import { useEffect, useMemo, useState } from 'react';
import { listPhotos, deletePhoto, reportPhoto } from '@/lib/photos';
import { getOwnerId } from '@/lib/ownerId';
import { dayLabels } from '@/data/events';

const TUTORIAL_KEY = 'santvs_gallery_tutorial_seen';

function filenameFor(photo) {
  const stamp = new Date(photo.created_at)
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19);
  return `santvs-${stamp}.jpg`;
}

async function fetchAsBlob(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  return await res.blob();
}

// Local calendar day (YYYY-MM-DD) for a photo — prefers the stored capture_day,
// falls back to the created_at date for older rows.
function dayKeyFor(photo) {
  if (photo.capture_day) return photo.capture_day;
  const d = new Date(photo.created_at);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dayHeading(key) {
  if (dayLabels[key]) return dayLabels[key];
  const d = new Date(`${key}T00:00:00`);
  const s = d.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function groupByDay(photos) {
  const map = new Map();
  for (const p of photos) {
    const key = dayKeyFor(p);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  }
  return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

export default function Gallery() {
  const [photos, setPhotos] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(null);
  const [canShare, setCanShare] = useState(false);
  const [ownerId, setOwnerId] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    setOwnerId(getOwnerId());
    try {
      if (!window.localStorage.getItem(TUTORIAL_KEY)) setShowTutorial(true);
    } catch {}
    (async () => {
      try {
        const rows = await listPhotos();
        setPhotos(rows);
      } catch (e) {
        setError(e.message || 'Error carregant fotos');
        setPhotos([]);
      }
    })();
  }, []);

  useEffect(() => {
    const open = () => setShowTutorial(true);
    window.addEventListener('santes:open-tutorial', open);
    return () => window.removeEventListener('santes:open-tutorial', open);
  }, []);

  useEffect(() => {
    setCanShare(
      typeof navigator !== 'undefined' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [new File([''], 'x.jpg', { type: 'image/jpeg' })] })
    );
  }, []);

  const dismissTutorial = () => {
    setShowTutorial(false);
    try {
      window.localStorage.setItem(TUTORIAL_KEY, '1');
    } catch {}
  };

  const groups = useMemo(() => (photos ? groupByDay(photos) : []), [photos]);

  const handleDelete = async id => {
    try {
      await deletePhoto(id, { ownerId });
      setPhotos(list => list.filter(p => p.id !== id));
      setOpen(null);
    } catch (e) {
      alert(e.message || 'No hem pogut esborrar la foto.');
    }
  };

  const handleReport = async photo => {
    if (!confirm('Reportar aquesta foto? Si diverses persones la reporten, s’amagarà automàticament.')) return;
    try {
      const res = await reportPhoto(photo.id, ownerId);
      if (res.hidden) {
        setPhotos(list => list.filter(p => p.id !== photo.id));
        setOpen(null);
        alert('Gràcies. La foto ha estat amagada.');
      } else if (res.already_reported) {
        alert('Ja havies reportat aquesta foto.');
      } else {
        alert('Gràcies pel report.');
      }
    } catch (e) {
      alert(e.message || 'No hem pogut enviar el report.');
    }
  };

  const handleDownload = async photo => {
    try {
      const blob = await fetchAsBlob(photo.public_url);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filenameFor(photo);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(photo.public_url, '_blank');
    }
  };

  const handleShare = async photo => {
    try {
      const blob = await fetchAsBlob(photo.public_url);
      const file = new File([blob], filenameFor(photo), { type: blob.type || 'image/jpeg' });
      await navigator.share({
        files: [file],
        title: photo.act_title || 'SANTVS',
        text: photo.act_title ? `${photo.act_title} · ${photo.act_time || ''}` : 'Les Santes 2026',
      });
    } catch {
      handleDownload(photo);
    }
  };

  const tutorial = showTutorial ? <TutorialOverlay onClose={dismissTutorial} /> : null;

  if (photos === null) {
    return (
      <>
        {tutorial}
        <p className="mx-auto max-w-2xl px-4 pt-10 text-center text-neutral-500 dark:text-neutral-400">Carregant…</p>
      </>
    );
  }

  if (photos.length === 0) {
    return (
      <>
        {tutorial}
        <div className="mx-auto max-w-2xl px-6 pt-20 text-center">
          {error ? (
            <>
              <p className="text-lg text-red-500 dark:text-red-400">{error}</p>
              <p className="mt-2 text-sm text-neutral-500">Torna a provar en uns segons.</p>
            </>
          ) : (
            <>
              <i className="fa-regular fa-images text-4xl text-neutral-400" aria-hidden="true" />
              <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-200">Encara no hi ha fotos.</p>
              <p className="mt-2 text-sm text-neutral-500">
                Prem el botó taronja de la barra inferior per capturar el primer moment.
              </p>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {tutorial}
      <div className="mx-auto max-w-3xl px-2 pb-32 pt-4">
        {groups.map(([key, dayPhotos]) => (
          <section key={key} className="mb-6">
            <div className="sticky top-[52px] z-10 mb-2 flex items-center gap-2 px-1 py-1">
              <span className="rounded-full bg-neutral-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 backdrop-blur dark:bg-white/10 dark:text-neutral-300">
                {dayHeading(key)}
              </span>
              <span className="text-[11px] text-neutral-400">
                {dayPhotos.length} {dayPhotos.length === 1 ? 'foto' : 'fotos'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {dayPhotos.map(p => (
                <button
                  key={p.id}
                  onClick={() => setOpen(p)}
                  className="relative aspect-square overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-900"
                >
                  <img
                    src={p.public_url}
                    alt={p.act_title || 'Foto'}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {open && (
        <div
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[70] flex flex-col bg-black/95 pb-[env(safe-area-inset-bottom)]"
        >
          <div
            className="flex items-center justify-between p-4"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              onClick={() => setOpen(null)}
              aria-label="Tancar"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
            <span className="text-xs uppercase tracking-widest text-neutral-500">Foto</span>
            {open.owner_id === ownerId ? (
              <button
                onClick={() => {
                  if (confirm('Esborrar aquesta foto?')) handleDelete(open.id);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-red-400"
                aria-label="Esborrar"
                title="Esborrar"
              >
                <i className="fa-solid fa-trash" aria-hidden="true" />
              </button>
            ) : (
              <button
                onClick={() => handleReport(open)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-yellow-400"
                aria-label="Reportar"
                title="Reportar"
              >
                <i className="fa-solid fa-flag" aria-hidden="true" />
              </button>
            )}
          </div>

          <img src={open.public_url} alt="" className="min-h-0 w-full flex-1 object-contain" />

          <div
            className="px-6 pb-4 pt-3 text-sm text-neutral-300"
            onClick={e => e.stopPropagation()}
          >
            <p className="font-medium text-white">{open.act_title || '—'}</p>
            <p className="text-neutral-500">
              {new Date(open.created_at).toLocaleString('ca-ES')}
            </p>

            <div className="mt-4 flex items-center gap-3">
              {canShare && (
                <button
                  onClick={() => handleShare(open)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-950"
                >
                  <i className="fa-solid fa-arrow-up-from-bracket" aria-hidden="true" />
                  Compartir
                </button>
              )}
              <button
                onClick={() => handleDownload(open)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white"
              >
                <i className="fa-solid fa-download" aria-hidden="true" />
                Descarregar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TutorialOverlay({ onClose }) {
  const steps = [
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
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl dark:bg-neutral-900">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fc4c02] text-white">
          <i className="fa-solid fa-wand-magic-sparkles text-xl" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Benvingut/da a la galeria</h2>
        <p className="mt-1 text-sm text-neutral-500">Com funciona:</p>

        <ul className="mt-5 flex flex-col gap-4 text-left">
          {steps.map(s => (
            <li key={s.title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900/5 text-[#fc4c02] dark:bg-white/10">
                <i className={s.icon} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">{s.title}</p>
                <p className="text-sm text-neutral-500">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950"
        >
          Entesos!
        </button>
      </div>
    </div>
  );
}
