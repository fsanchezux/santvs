'use client';

import { useEffect, useState } from 'react';
import { getAdminToken } from '@/lib/admin';
import AdminGate from '@/components/AdminGate';
import AdminGallery from '@/components/AdminGallery';
import Wordmark from '@/components/Wordmark';

export default function AdminPage() {
  const [authed, setAuthed] = useState(null);

  useEffect(() => {
    setAuthed(!!getAdminToken());
  }, []);

  if (authed === null) return null;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-neutral-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Wordmark size="md" />
          <span className="text-[10px] uppercase tracking-widest text-yellow-300">Admin</span>
        </div>
      </header>
      <main>
        {authed ? (
          <AdminGallery onLogout={() => setAuthed(false)} />
        ) : (
          <AdminGate onUnlock={() => setAuthed(true)} />
        )}
      </main>
    </>
  );
}
