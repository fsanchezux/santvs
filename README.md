# Les Santes 2026 · Mapa

Clon mínim del descobridor de rutes d'Strava, adaptat per a la Festa Major de Mataró.

- **Rutes** dels usuaris en tres modalitats: `hardcore`, `chill`, `infantil` (filtres tipus chip).
- **Cerca d'actes** del programa oficial: et marca el recinte al mapa i et dóna enllaç a Google Maps.

## Stack

- Next.js 14 (App Router, JS)
- Tailwind CSS
- React-Leaflet + tiles d'OpenStreetMap (gratuït, sense API key)
- Desplegament a Vercel

## Posada en marxa

```bash
npm install
npm run dev
```

Obre <http://localhost:3000>.

## Estructura

```
app/                rutas y layout de Next
components/         UI (mapa, buscador, filtros, llista)
data/
  venues.js         coordenades dels recintes
  events.js         programa de Les Santes 2026
  routes.js         rutes d'exemple (mock)
```

## Ajustar dades

- **Coordenades dels recintes**: edita `data/venues.js`. Els valors actuals són aproximats al voltant del centre de Mataró; afina lat/lng quan vulguis (Google Maps → clic dret → copiar coordenades).
- **Actes**: edita `data/events.js`. Cada acte fa referència a un `venueId` de `venues.js`.
- **Rutes**: edita `data/routes.js`. La propietat `path` és una llista de `[lat, lng]`. Per importar GPX real, transforma els punts a aquest format.

## Desplegament a Vercel

1. Puja el repo a GitHub.
2. A [vercel.com/new](https://vercel.com/new) importa el repo.
3. Framework: *Next.js* (auto-detectat). Sense variables d'entorn.
4. Deploy.

També pots usar la CLI:

```bash
npm i -g vercel
vercel
```

## Roadmap proper (idees)

- Pujada de GPX per part dels usuaris (form + parseig a `path`).
- Backend amb Supabase / Vercel KV per persistir rutes.
- Compartir ruta amb URL (`?route=id`).
- Capa de "favorits" amb localStorage.
- PWA per instal·lar al mòbil.
