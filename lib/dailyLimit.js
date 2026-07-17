// One photo per calendar day, per device. The server is the source of truth
// (unique index on owner_id + capture_day); this local flag just lets the UI
// react instantly without a round-trip.

const KEY = 'santvs_last_upload_day';

function pad(n) {
  return String(n).padStart(2, '0');
}

// Local calendar day as YYYY-MM-DD (not UTC — the festival lives in local time).
export function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function hasUploadedToday() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(KEY) === todayKey();
  } catch {
    return false;
  }
}

export function markUploadedToday() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, todayKey());
  } catch {}
}
