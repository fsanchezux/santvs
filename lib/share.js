'use client';

import { SITE_URL } from './site';

// The public URL of the app. Always the canonical production domain so shared
// links point to lessantxs.com regardless of the current deployment host.
export function getShareUrl() {
  return SITE_URL + '/';
}

const SHARE_TEXT = 'Descobreix Les Santes de Mataró 2026 amb SANTVS';
const SHARE_TITLE = 'SANTVS · Les Santes 2026';

// Copies the app URL to the clipboard. Returns true on success.
export async function copyShareUrl() {
  const url = getShareUrl();
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    // Fallback for browsers without the async clipboard API.
    try {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

// Opens the native share sheet when available, otherwise copies the link.
// Returns 'shared' | 'copied' | 'cancelled' | 'failed'.
export async function shareApp() {
  const url = getShareUrl();
  const data = { title: SHARE_TITLE, text: SHARE_TEXT, url };

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share(data);
      return 'shared';
    } catch (e) {
      // User dismissed the share sheet — don't treat as an error.
      if (e && e.name === 'AbortError') return 'cancelled';
      // Some desktops expose navigator.share but reject — fall through to copy.
    }
  }

  return (await copyShareUrl()) ? 'copied' : 'failed';
}
