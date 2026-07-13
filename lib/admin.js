const KEY = 'santvs_admin_token';

// The admin token is a shared secret set on Vercel as ADMIN_TOKEN.
// Storing it in localStorage lets the same phone act as admin across
// visits. Server always re-validates against the env var.
export function getAdminToken() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token) {
  try {
    window.localStorage.setItem(KEY, token);
  } catch {}
}

export function clearAdminToken() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
}

export function isAdmin() {
  return !!getAdminToken();
}
