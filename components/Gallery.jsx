'use client';

import { useEffect, useState } from 'react';
import { listPhotos, deletePhoto } from '@/lib/photos';
import { getOwnerId } from '@/lib/ownerId';

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

export default function Gallery() {
  const [photos, setPhotos] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(null);
  const [canShare, setCanShare] = useState(false);
  const [ownerId, setOwnerId] = useState(null);

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

  const handleDelete = async id => {
    try {
      await deletePhoto(id, ownerId);
      setPhotos(list => list.filter(p => p.id !== id));
      setOpen(null);
    } catch (e) {
      alert(e.message || 'No hem pogut esborrar la foto.');
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
    return <p className="mx-auto max-w-2xl px-4 pt-10 text-center text-neutral-400">Carregant…</p>;
  }

  if (photos.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-20 text-center">
        {error ? (
          <>
            <p className="text-lg text-red-400">{error}</p>
            <p className="mt-2 text-sm text-neutral-500">Torna a provar en uns segons.</p>
          </>
        ) : (
          <>
            <p className="text-lg text-neutral-200">Encara no hi ha fotos.</p>
            <p className="mt-2 text-sm text-neutral-500">
              Prem el botó taronja de la barra inferior per capturar el primer moment.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-2 pb-32 pt-4">
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {photos.map(p => (
          <button
            key={p.id}
            onClick={() => setOpen(p)}
            className="relative aspect-square overflow-hidden rounded-md bg-neutral-900"
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
              ✕
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
                🗑
              </button>
            ) : (
              <span className="h-10 w-10" />
            )}
          </div>

          <img src={open.public_url} alt="" className="flex-1 object-contain" />

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
                  className="flex-1 rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-950"
                >
                  Compartir
                </button>
              )}
              <button
                onClick={() => handleDownload(open)}
                className="flex-1 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white"
              >
                Descarregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
