'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Actes', icon: ListIcon },
  { href: '/galeria', label: 'Galeria', icon: GridIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  // hide on the fullscreen camera page
  if (pathname?.startsWith('/camera')) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-neutral-950/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-2xl items-end justify-around px-4">
        <NavItem item={items[0]} active={pathname === items[0].href} />
        <ShutterLink />
        <NavItem item={items[1]} active={pathname?.startsWith(items[1].href)} />
      </div>
    </nav>
  );
}

function NavItem({ item, active }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs ${active ? 'text-white' : 'text-neutral-400'}`}
    >
      <Icon className="h-6 w-6" />
      <span>{item.label}</span>
    </Link>
  );
}

function ShutterLink() {
  return (
    <Link
      href="/camera"
      aria-label="Fer una foto"
      className="relative -mt-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#fc4c02] shadow-lg shadow-[#fc4c02]/40 ring-4 ring-neutral-950 transition active:scale-95"
    >
      <span className="h-14 w-14 rounded-full border-2 border-white/25" />
    </Link>
  );
}

function ListIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
