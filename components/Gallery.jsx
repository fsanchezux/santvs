'use client';

import { useEffect, useMemo, useState } from 'react';
import { listPhotos, deletePhoto, reportPhoto } from '@/lib/photos';
import { getOwnerId } from '@/lib/ownerId';
import { dayLabels } from '@/data/events';

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
  const [tab, setTab] = useState('all'); // 'all' | 'mine'

  useEffect(() => {
    setOwnerId(getOwnerId());
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
    setCanShare(
      typeof navigator !== 'undefined' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [new File([''], 'x.jpg', { type: 'image/jpeg' })] })
    );
  }, []);

  const mineCount = useMemo(
    () => (photos && ownerId ? photos.filter(p => p.owner_id === ownerId).length : 0),
    [photos, ownerId]
  );

  const visible = useMemo(() => {
    if (!photos) return [];
    if (tab === 'mine') return photos.filter(p => ownerId && p.owner_id === ownerId);
    return photos;
  }, [photos, tab, ownerId]);

  const groups = useMemo(() => groupByDay(visible), [visible]);

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

  if (photos === null) {
    return (
      <p className="mx-auto max-w-2xl px-4 pt-10 text-center text-neutral-500 dark:text-neutral-400">Carregant…</p>
    );
  }

  if (photos.length === 0) {
    return (
      <>
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
      <div className="mx-auto max-w-3xl px-2 pb-32 pt-4">
        <div className="mb-3 flex gap-2 px-1">
          <TabButton label="Totes" count={photos.length} active={tab === 'all'} onClick={() => setTab('all')} />
          <TabButton label="Les meves fotos" count={mineCount} active={tab === 'mine'} onClick={() => setTab('mine')} />
        </div>

        {tab === 'mine' && mineCount === 0 ? (
          <div className="px-6 pt-16 text-center">
            <i className="fa-regular fa-user text-4xl text-neutral-400" aria-hidden="true" />
            <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-200">Encara no has fet cap foto.</p>
            <p className="mt-2 text-sm text-neutral-500">
              Prem el botó taronja de la barra inferior i apareixerà aquí.
            </p>
          </div>
        ) : (
          groups.map(([key, dayPhotos]) => (
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
                {dayPhotos.map(p => {
                  const mine = ownerId && p.owner_id === ownerId;
                  return (
                    <div
                      key={p.id}
                      className="relative aspect-square overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-900"
                    >
                      <button onClick={() => setOpen(p)} className="absolute inset-0 h-full w-full">
                        <img
                          src={p.public_url}
                          alt={p.act_title || 'Foto'}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </button>
                      {mine && (
                        <button
                          onClick={() => handleShare(p)}
                          aria-label="Compartir la foto"
                          title="Compartir"
                          className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition active:scale-95"
                        >
                          <i className="fa-solid fa-share-nodes text-xs" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
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

function TabButton({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
        active
          ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
          : 'border-neutral-900/15 bg-white text-neutral-600 dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-300'
      }`}
    >
      {label}
      <span className={active ? 'opacity-70' : 'text-neutral-400'}>{count}</span>
    </button>
  );
}
