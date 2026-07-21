import { ImageResponse } from 'next/og';

export const alt = 'Les Santxs 2026 · Programa i mapa de la Festa Major de Mataró';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '90px',
          background: '#0a0a0a',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <div style={{ width: 52, height: 52, borderRadius: 999, background: '#fc4c02' }} />
          <div
            style={{
              fontSize: 30,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#a3a3a3',
            }}
          >
            Festa Major de Mataró
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 130, fontWeight: 800, marginTop: 24, lineHeight: 1 }}>
          Les Santxs
        </div>
        <div style={{ display: 'flex', fontSize: 130, fontWeight: 800, color: '#fc4c02', lineHeight: 1 }}>
          2026
        </div>
        <div style={{ display: 'flex', fontSize: 38, color: '#d4d4d4', marginTop: 36 }}>
          El programa i el mapa de tots els actes
        </div>
      </div>
    ),
    { ...size }
  );
}
