'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAdminToken, clearAdminToken } from '@/lib/admin';
import { listPhotos, deletePhoto, setPhotoHidden } from '@/lib/photos';

export default function AdminGallery({ onLogout }) {
  const [photos, setPhotos] = useState(null);
  const [filter, setFilter] = useState('all'); // all | reported | hidden
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const token = getAdminToken();
      const rows = await listPhotos({ adminToken: token });
      setPhotos(rows);
    } catch (e) {
      setError(e.message);
      setPhotos([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!photos) return null;
    if (filter === 'reported') return photos.filter(p => p.report_count > 0 && !p.hidden);
    if (filter === 'hidden') return photos.filter(p => p.hidden);
    return photos;
  }, [photos, filter]);

  const del = async id => {
    if (!confirm('Esborrar definitivament?')) return;
    setBusy(id);
    try {
      await deletePhoto(id, { adminToken: getAdminToken() });
      setPhotos(list => list.filter(p => p.id !== id));
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };

  const toggleHidden = async (photo, hidden) => {
    setBusy(photo.id);
    try {
      const updated = await setPhotoHidden(photo.id, hidden, getAdminToken());
      setPhotos(list =>
        list.map(p =>
          p.id === photo.id
            ? { ...p, hidden: updated.hidden, report_count: updated.report_count }
            : p
        )
      );
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };

  const logout = () => {
    clearAdminToken();
    onLogout?.();
  };

  if (photos === null) {
    return <p className="pt-10 text-center text-neutral-400">Carregant…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Tab label={`Totes (${photos.length})`} active={filter === 'all'} onClick={() => setFilter('all')} />
          <Tab
            label={`Reportades (${photos.filter(p => p.report_count > 0 && !p.hidden).length})`}
            active={filter === 'reported'}
            onClick={() => setFilter('reported')}
          />
          <Tab
            label={`Amagades (${photos.filter(p => p.hidden).length})`}
            active={filter === 'hidden'}
            onClick={() => setFilter('hidden')}
          />
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-300"
        >
          Sortir
        </button>
      </div>

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">Res per aquí.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map(p => (
            <li
              key={p.id}
              className={`overflow-hidden rounded-xl border ${
                p.hidden ? 'border-yellow-500/40' : 'border-white/5'
              } bg-neutral-900`}
            >
              <div className="relative aspect-square">
                <img
                  src={p.public_url}
                  alt={p.act_title || 'Foto'}
                  className={`h-full w-full object-cover ${p.hidden ? 'opacity-40' : ''}`}
                  loading="lazy"
                />
                {p.report_count > 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-yellow-500/90 px-2 py-0.5 text-[10px] font-semibold text-neutral-950">
                    {p.report_count} 🚩
                  </span>
                )}
                {p.hidden && (
                  <span className="absolute right-2 top-2 rounded-full bg-neutral-950/80 px-2 py-0.5 text-[10px] font-semibold text-yellow-300">
                    AMAGADA
                  </span>
                )}
              </div>
              <div className="p-2 text-xs">
                <p className="truncate text-white">{p.act_title || '—'}</p>
                <p className="truncate text-neutral-500">
                  {new Date(p.created_at).toLocaleString('ca-ES')}
                </p>
                <div className="mt-2 flex gap-2">
                  {p.hidden ? (
                    <button
                      onClick={() => toggleHidden(p, false)}
                      disabled={busy === p.id}
                      className="flex-1 rounded-full border border-white/15 px-2 py-1 text-[11px] text-white disabled:opacity-50"
                    >
                      Restaurar
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleHidden(p, true)}
                      disabled={busy === p.id}
                      className="flex-1 rounded-full border border-white/15 px-2 py-1 text-[11px] text-yellow-300 disabled:opacity-50"
                    >
                      Amagar
                    </button>
                  )}
                  <button
                    onClick={() => del(p.id)}
                    disabled={busy === p.id}
                    className="flex-1 rounded-full bg-red-500/20 px-2 py-1 text-[11px] text-red-300 disabled:opacity-50"
                  >
                    Esborrar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs ${
        active
          ? 'border-white bg-white text-neutral-950'
          : 'border-white/15 bg-neutral-900 text-neutral-300'
      }`}
    >
      {label}
    </button>
  );
}
