'use client';

import { useEffect, useState } from 'react';
import { listPhotos, deletePhoto } from '@/lib/photos';

export default function Gallery() {
  const [photos, setPhotos] = useState(null);
  const [open, setOpen] = useState(null); // { photo, url }

  useEffect(() => {
    let urls = [];
    (async () => {
      const rows = await listPhotos();
      urls = rows.map(r => URL.createObjectURL(r.blob));
      setPhotos(rows.map((r, i) => ({ ...r, url: urls[i] })));
    })();
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, []);

  const handleDelete = async id => {
    await deletePhoto(id);
    setPhotos(list => list.filter(p => p.id !== id));
    setOpen(null);
  };

  if (photos === null) {
    return <p className="mx-auto max-w-2xl px-4 pt-10 text-center text-neutral-400">Carregant…</p>;
  }

  if (photos.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-20 text-center">
        <p className="text-lg text-neutral-200">Encara no hi ha fotos.</p>
        <p className="mt-2 text-sm text-neutral-500">
          Prem el botó SANTVS per capturar el primer moment.
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
          <div className="flex items-center justify-between p-4">
            <button className="text-white/80" onClick={() => setOpen(null)}>✕</button>
            <button
              onClick={e => {
                e.stopPropagation();
                if (confirm('Esborrar aquesta foto?')) handleDelete(open.id);
              }}
              className="text-sm text-red-400"
            >
              Esborrar
            </button>
          </div>
          <img src={open.url} alt="" className="flex-1 object-contain" />
          <div className="px-6 pb-4 pt-3 text-sm text-neutral-300">
            <p className="font-medium text-white">{open.actTitle || '—'}</p>
            <p className="text-neutral-500">
              {new Date(open.createdAt).toLocaleString('ca-ES')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
