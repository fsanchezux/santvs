'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { events, dayLabels } from '@/data/events';
import { venues } from '@/data/venues';
import { CATEGORIES, resolveCategory } from '@/lib/categories';

// Groups every act by day, preserving the order in data/events.js.
function groupByDay(list) {
  const map = new Map();
  for (const e of list) {
    if (!map.has(e.day)) map.set(e.day, []);
    map.get(e.day).push(e);
  }
  return Array.from(map.entries());
}

export default function ActList() {
  const router = useRouter();
  const [query, setQuery] = useState('');

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
    if (!q) return enriched;
    return enriched.filter(
      e =>
        e.title.toLowerCase().includes(q) ||
        (e.venue?.name || '').toLowerCase().includes(q) ||
        CATEGORIES[e.category].label.toLowerCase().includes(q)
    );
  }, [enriched, query]);

  const groups = useMemo(() => groupByDay(filtered), [filtered]);

  const showOnMap = venueId => {
    if (venueId) router.push(`/?venue=${venueId}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-3 pb-32 pt-3">
      <div className="mb-3 flex items-center gap-3 rounded-full border border-neutral-900/10 bg-white px-4 py-2 dark:border-white/10 dark:bg-neutral-900">
        <i className="fa-solid fa-magnifying-glass text-sm text-neutral-400" aria-hidden="true" />
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
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        )}
      </div>

      {groups.length === 0 && (
        <p className="pt-16 text-center text-sm text-neutral-500">Cap acte coincideix amb la cerca.</p>
      )}

      {groups.map(([day, acts]) => (
        <section key={day} className="mb-5">
          <div className="sticky top-[52px] z-10 mb-1 py-1">
            <span className="rounded-full bg-neutral-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 backdrop-blur dark:bg-white/10 dark:text-neutral-300">
              {dayLabels[day] || day}
            </span>
          </div>
          <ul className="flex flex-col">
            {acts.map(e => {
              const meta = CATEGORIES[e.category];
              return (
                <li key={e.id}>
                  <button
                    onClick={() => showOnMap(e.venueId)}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-neutral-900/5 dark:hover:bg-white/5"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ background: meta.color }}
                    >
                      <i className={`${meta.icon} text-xs`} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-neutral-900 dark:text-white">
                        {e.title}
                      </span>
                      <span className="block truncate text-xs text-neutral-500">
                        {e.time} · {e.venue?.name || '—'}
                      </span>
                    </span>
                    <i
                      className="fa-solid fa-location-dot text-sm text-neutral-400"
                      aria-hidden="true"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
