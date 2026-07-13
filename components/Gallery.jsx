'use client';

import { useEffect, useState } from 'react';
import { listPhotos, deletePhoto } from '@/lib/photos';

function filenameFor(photo) {
  const stamp = new Date(photo.createdAt)
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19);
  return `santvs-${stamp}.jpg`;
}

export default function Gallery() {
  const [photos, setPhotos] = useState(null);
  const [open, setOpen] = useState(null);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    let urls = [];
    (async () => {
      const rows = await listPhotos();
      urls = rows.map(r => URL.createObjectURL(r.blob));
      setPhotos(rows.map((r, i) => ({ ...r, url: urls[i] })));
    })();
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, []);

  useEffect(() => {
    setCanShare(
      typeof navigator !== 'undefined' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [new File([''], 'x.jpg', { type: 'image/jpeg' })] })
    );
  }, []);

  const handleDelete = async id => {
    await deletePhoto(id);
    setPhotos(list => list.filter(p => p.id !== id));
    setOpen(null);
  };

  const handleDownload = photo => {
    const a = document.createElement('a');
    a.href = photo.url;
    a.download = filenameFor(photo);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleShare = async photo => {
    try {
      const file = new File([photo.blob], filenameFor(photo), { type: photo.blob.type || 'image/jpeg' });
      await navigator.share({
        files: [file],
        title: photo.actTitle || 'SANTVS',
        text: photo.actTitle ? `${photo.actTitle} · ${photo.actTime || ''}` : 'Les Santes 2026',
      });
    } catch {
      // user cancelled or share not supported — fall back to download
      handleDownload(photo);
    }
  };

  if (photos === null) {
    return <p className="mx-auto max-w-2xl px-4 pt-10 text-center text-neutral-400">Carregant…</p>;
  }

  if (photos.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-20 text-center">
        <p className="text-lg text-neutral-200">Encara no hi ha fotos.</p>
        <p className="mt-2 text-sm text-neutral-500">
          Prem el botó taronja de la barra inferior per capturar el primer moment.
        </p>
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
            <img src={p.url} alt={p.actTitle || 'Foto'} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {open && (
        <div
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 flex flex-col bg-black/95 pb-[env(safe-area-inset-bottom)]"
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
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              Foto
            </span>
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
          </div>

          <img src={open.url} alt="" className="flex-1 object-contain" />

          <div
            className="px-6 pb-4 pt-3 text-sm text-neutral-300"
            onClick={e => e.stopPropagation()}
          >
            <p className="font-medium text-white">{open.actTitle || '—'}</p>
            <p className="text-neutral-500">
              {new Date(open.createdAt).toLocaleString('ca-ES')}
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
