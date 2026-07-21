import { events } from '@/data/events';
import { venues } from '@/data/venues';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

const FESTIVAL_START = '2026-07-17';
const FESTIVAL_END = '2026-07-29';

// Build an ISO start date; use the time when it's a clean HH:MM, otherwise the
// day alone (many acts are "todo el día" or time ranges). +02:00 = CEST.
function startDateFor(ev) {
  const m = /^(\d{2}):(\d{2})/.exec(ev.time || '');
  return m ? `${ev.day}T${m[1]}:${m[2]}:00+02:00` : ev.day;
}

function placeFor(venueId) {
  const v = venues[venueId];
  if (!v) return undefined;
  return {
    '@type': 'Place',
    name: v.name,
    geo: { '@type': 'GeoCoordinates', latitude: v.lat, longitude: v.lng },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mataró',
      addressRegion: 'Barcelona',
      addressCountry: 'ES',
    },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'ca',
  };
}

export function festivalJsonLd({ withSubEvents = false } = {}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Festival',
    name: 'Les Santes de Mataró 2026',
    alternateName: SITE_NAME,
    description: SITE_DESCRIPTION,
    startDate: FESTIVAL_START,
    endDate: FESTIVAL_END,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    location: {
      '@type': 'Place',
      name: 'Mataró',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mataró',
        addressRegion: 'Barcelona',
        addressCountry: 'ES',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Ajuntament de Mataró',
      url: 'https://www.lessantes.cat',
    },
  };

  if (withSubEvents) {
    data.subEvent = events.map(ev => ({
      '@type': 'Event',
      name: ev.title,
      startDate: startDateFor(ev),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: placeFor(ev.venueId),
      url: `${SITE_URL}/llista`,
    }));
  }

  return data;
}
