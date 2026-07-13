import { events } from '@/data/events';
import { venues } from '@/data/venues';

function parseStartTime(day, timeStr) {
  if (!timeStr) return null;
  const m = String(timeStr).match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const [, hh, mm] = m;
  return new Date(`${day}T${hh.padStart(2, '0')}:${mm}:00`);
}

function haversine(a, b) {
  if (!a || !b) return Infinity;
  const R = 6371000;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Returns the act that best matches (now, coords). Cross-checks time and, if
// available, geolocation for disambiguation between simultaneous acts.
export function resolveCurrentAct({ now = new Date(), coords = null } = {}) {
  const isoDay = now.toISOString().slice(0, 10);
  const withStart = events
    .map(e => ({ ...e, start: parseStartTime(e.day, e.time), venue: venues[e.venueId] }))
    .filter(e => e.venue);

  // 1. Acts starting today (or without a parseable start on today's date)
  const today = withStart.filter(e => e.day === isoDay);
  const candidates = today.length ? today : withStart;

  // 2. Score = (time-proximity to now) + (geo-proximity if available)
  const scored = candidates
    .map(e => {
      const timeDelta = e.start ? Math.abs(e.start - now) / 60000 : 24 * 60; // minutes; unknown = far
      const geoDelta = coords && e.venue ? haversine(coords, e.venue) : null;
      // Weighted: with coords, prefer within ~200m; without, purely by time.
      const score = coords ? timeDelta + (geoDelta / 50) : timeDelta;
      return { event: e, timeDelta, geoDelta, score };
    })
    .sort((a, b) => a.score - b.score);

  return scored[0]?.event || null;
}
