import './globals.css';
import { Archivo_Black, Inter } from 'next/font/google';

const archivo = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-wordmark',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'SANTVS · Les Santes 2026',
  description: 'Fes-te fotos amb els actes de Les Santes de Mataró 2026',
};

export const viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ca" className={`${archivo.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-neutral-950 text-neutral-100 font-[var(--font-body)]">
        {children}
      </body>
    </html>
  );
}
