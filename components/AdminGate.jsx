'use client';

import { useState } from 'react';
import { setAdminToken } from '@/lib/admin';

export default function AdminGate({ onUnlock }) {
  const [token, setToken] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  const submit = async e => {
    e.preventDefault();
    if (!token.trim() || checking) return;
    setChecking(true);
    setError(null);
    try {
      const res = await fetch('/api/photos?scope=admin', {
        headers: { 'X-Admin-Token': token.trim() },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Token invàlid');
      setAdminToken(token.trim());
      onUnlock?.();
    } catch (err) {
      setError(err.message || 'Token invàlid');
    } finally {
      setChecking(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto mt-24 flex max-w-sm flex-col gap-4 px-6 text-center"
    >
      <p className="text-lg font-medium text-white">Zona d’administració</p>
      <p className="text-sm text-neutral-400">
        Introdueix el token d’admin per accedir.
      </p>
      <input
        type="password"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        value={token}
        onChange={e => setToken(e.target.value)}
        placeholder="Token"
        className="rounded-full border border-white/10 bg-neutral-900 px-5 py-3 text-center outline-none focus:border-white/30"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={checking || !token.trim()}
        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-950 disabled:opacity-60"
      >
        {checking ? 'Comprovant…' : 'Entrar'}
      </button>
    </form>
  );
}
