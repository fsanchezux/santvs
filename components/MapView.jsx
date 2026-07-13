'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CATEGORIES } from '@/lib/categories';

const MATARO_CENTER = [41.5390, 2.4449];

function makePinIcon({ color, emoji, count }) {
  const badge = count > 1 ? `<span class="count">${count}</span>` : '';
  return L.divIcon({
    className: '',
    html: `<div class="santes-pin" style="background:${color}">${emoji}${badge}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -14],
  });
}

function groupByVenue(events) {
  const map = new Map();
  for (const e of events) {
    if (!e.venue) continue;
    const key = e.venueId;
    if (!map.has(key)) {
      map.set(key, { venueId: key, venue: e.venue, events: [] });
    }
    map.get(key).events.push(e);
  }
  return Array.from(map.values());
}

function dominantCategory(events) {
  const counts = new Map();
  for (const e of events) counts.set(e.category, (counts.get(e.category) || 0) + 1);
  let best = 'altres', bestCount = 0;
  for (const [cat, n] of counts) if (n > bestCount) { best = cat; bestCount = n; }
  return best;
}

const PROGRAMA_URL = 'https://www.lessantes.cat/les-santes-2026/programa-resumit-1';

function mapsUrl(venue) {
  return `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`;
}

function infoUrl(event) {
  return event.url || PROGRAMA_URL;
}

export default function MapView({ events }) {
  const groups = useMemo(() => groupByVenue(events), [events]);

  return (
    <MapContainer
      center={MATARO_CENTER}
      zoom={15}
      minZoom={13}
      maxZoom={18}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {groups.map(g => {
        const cat = dominantCategory(g.events);
        const meta = CATEGORIES[cat];
        const icon = makePinIcon({
          color: meta.color,
          emoji: meta.emoji,
          count: g.events.length,
        });
        return (
          <Marker key={g.venueId} position={[g.venue.lat, g.venue.lng]} icon={icon}>
            <Popup>
              <div className="min-w-[240px] max-w-[280px]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-wider text-neutral-400">
                    {g.venue.name}
                  </p>
                  <a
                    href={mapsUrl(g.venue)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-white/20"
                  >
                    Com hi vaig ↗
                  </a>
                </div>
                <ul className="mt-3 flex flex-col divide-y divide-white/5">
                  {g.events.map(e => (
                    <li key={e.id} className="flex items-center justify-between gap-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] uppercase tracking-wider text-neutral-500">
                          {e.time}
                        </p>
                        <p className="text-sm font-medium text-white">{e.title}</p>
                      </div>
                      <a
                        href={infoUrl(e)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-medium text-neutral-100 hover:bg-white/10"
                      >
                        Info ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
