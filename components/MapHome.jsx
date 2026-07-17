'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Wordmark from './Wordmark';
import { events } from '@/data/events';
import { venues } from '@/data/venues';
import { CATEGORIES, resolveCategory } from '@/lib/categories';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

const DAYS = [
  { iso: '2026-07-17', label: 'Dv 17' },
  { iso: '2026-07-18', label: 'Ds 18' },
  { iso: '2026-07-19', label: 'Dg 19' },
  { iso: '2026-07-20', label: 'Dl 20' },
  { iso: '2026-07-21', label: 'Dm 21' },
  { iso: '2026-07-22', label: 'Dx 22' },
  { iso: '2026-07-23', label: 'Dj 23' },
  { iso: '2026-07-24', label: 'Dv 24' },
  { iso: '2026-07-25', label: 'Ds 25' },
  { iso: '2026-07-26', label: 'Dg 26' },
  { iso: '2026-07-27', label: 'Dl 27' },
  { iso: '2026-07-28', label: 'Dm 28' },
  { iso: '2026-07-29', label: 'Dx 29' },
];

export default function MapHome() {
  const [query, setQuery] = useState('');
  const [day, setDay] = useState(null);

  const enriched = useMemo(
    () =>
      events.map(e => ({
        ...e,
        venue: venues[e.venueId],
        category: resolveCategory(e),
      })),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter(e => {
      if (!e.venue) return false;
      if (day && e.day !== day) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        (e.venue?.name || '').toLowerCase().includes(q) ||
        CATEGORIES[e.category].label.toLowerCase().includes(q)
      );
    });
  }, [enriched, query, day]);

  return (
    <div className="fixed inset-0">
      <div className="absolute inset-0">
        <MapView events={filtered} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[900] flex flex-col gap-2 p-3 pb-0">
        <div className="pointer-events-auto mx-auto flex w-full max-w-2xl items-center gap-3 rounded-full border border-neutral-900/10 bg-white/85 px-4 py-2 backdrop-blur dark:border-white/10 dark:bg-neutral-950/85">
          <Wordmark size="sm" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cerca acte, lloc, categoria…"
            className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-500 dark:text-white"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Neteja"
              className="rounded-full px-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="pointer-events-auto mx-auto w-full max-w-2xl overflow-x-auto no-scrollbar">
          <div className="flex gap-2 py-1">
            <DayChip label="Tots" active={day === null} onClick={() => setDay(null)} />
            {DAYS.map(d => (
              <DayChip key={d.iso} label={d.label} active={day === d.iso} onClick={() => setDay(d.iso)} />
            ))}
          </div>
        </div>

        <div className="pointer-events-none mx-auto max-w-2xl px-2">
          <span className="pointer-events-auto inline-block rounded-full bg-white/70 px-3 py-1 text-[11px] uppercase tracking-widest text-neutral-600 backdrop-blur dark:bg-black/60 dark:text-neutral-300">
            {filtered.length} {filtered.length === 1 ? 'acte' : 'actes'}
          </span>
        </div>
      </div>
    </div>
  );
}

function DayChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1 text-xs backdrop-blur ${
        active
          ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
          : 'border-neutral-900/15 bg-white/70 text-neutral-600 dark:border-white/15 dark:bg-neutral-950/70 dark:text-neutral-300'
      }`}
    >
      {label}
    </button>
  );
}
