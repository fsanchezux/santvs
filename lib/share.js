'use client';

import { SITE_URL } from './site';

// The public URL of the app. Always the canonical production domain so shared
// links point to lessantxs.com regardless of the current deployment host.
export function getShareUrl() {
  return SITE_URL + '/';
}

const SHARE_TEXT = 'LesSantexs.com, un exercici de branding que connecta Strava amb Les Santes';
const SHARE_TITLE = 'Les Santxs 2026';

// Shares a branded image via the native sheet so the user can post it to
// Instagram Stories (or any app). Falls back to downloading it on desktop.
// Returns 'shared' | 'cancelled' | 'downloaded' | 'failed'.
export async function shareStoryImage(imageSrc = '/og.jpg') {
  try {
    const res = await fetch(imageSrc, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`image ${res.status}`);
    const blob = await res.blob();
    const file = new File([blob], 'lessantxs-2026.jpg', { type: blob.type || 'image/jpeg' });
    const data = { files: [file], title: SHARE_TITLE, text: SHARE_TEXT };

    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share(data);
      return 'shared';
    }

    // Desktop / no file-share support: download the image and open Instagram.
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = 'lessantxs-2026.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
    window.open('https://www.instagram.com/', '_blank', 'noopener');
    return 'downloaded';
  } catch (e) {
    if (e && e.name === 'AbortError') return 'cancelled';
    return 'failed';
  }
}

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
