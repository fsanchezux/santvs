import './globals.css';
import { Archivo_Black, Inter } from 'next/font/google';
import ThemeController from '@/components/ThemeController';
import WelcomeModal from '@/components/WelcomeModal';
import TourController from '@/components/TourController';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'Les Santes',
    'Les Santes 2026',
    'Les Santes Mataró',
    'Festa Major Mataró',
    'programa Les Santes',
    'actes Les Santes',
    'Mataró',
  ],
  authors: [{ name: 'Ferran Sánchez', url: 'https://www.instagram.com/fsanchez.co' }],
  creator: 'Ferran Sánchez',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ca_ES',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: '/og.jpg', width: 1080, height: 1450, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/og.jpg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: SITE_NAME,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Runs before paint so the theme (light by day / dark by night) is applied
// without a flash on first load.
const themeScript = `(function(){try{var h=new Date().getHours();var dark=!(h>=7&&h<21);var r=document.documentElement;if(dark)r.classList.add('dark');var m=document.createElement('meta');m.name='theme-color';m.content=dark?'#0a0a0a':'#fafafa';document.head.appendChild(m);}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="ca" className={`${archivo.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 font-[var(--font-body)]">
        <ThemeController />
        <WelcomeModal />
        <TourController />
        {children}
      </body>
    </html>
  );
}
