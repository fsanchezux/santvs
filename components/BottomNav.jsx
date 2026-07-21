'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/llista', label: 'Llista', icon: 'fa-solid fa-list-ul' },
  { href: '/', label: 'Mapa', icon: 'fa-solid fa-map-location-dot' },
  { href: '/galeria', label: 'Galeria', icon: 'fa-regular fa-images' },
  { href: '/branding', label: 'Branding', icon: 'fa-solid fa-film' },
];

export default function BottomNav() {
  const pathname = usePathname();
  // hide on the fullscreen camera page
  if (pathname?.startsWith('/camera')) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-900/10 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] dark:border-white/10 dark:bg-neutral-950/95">
      <div className="mx-auto flex max-w-2xl items-end justify-around px-4">
        <NavItem item={items[0]} active={pathname?.startsWith('/llista')} />
        <NavItem item={items[1]} active={pathname === '/'} />
        <ShutterLink />
        <NavItem item={items[2]} active={pathname?.startsWith('/galeria')} />
        <NavItem item={items[3]} active={pathname?.startsWith('/branding')} />
      </div>
    </nav>
  );
}

function NavItem({ item, active }) {
  return (
    <Link
      href={item.href}
      className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
        active
          ? 'text-neutral-900 dark:text-white'
          : 'text-neutral-400 dark:text-neutral-500'
      }`}
    >
      <i className={`${item.icon} text-xl`} aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

function ShutterLink() {
  return (
    <Link
      href="/camera"
      aria-label="Fer una foto"
      className="relative -mt-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#fc4c02] text-white transition active:scale-95"
    >
      <i className="fa-solid fa-camera text-xl" aria-hidden="true" />
    </Link>
  );
}
