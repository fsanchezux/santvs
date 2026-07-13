const KEY = 'santvs_owner_id';

// Anonymous per-device UUID used to decide who can delete which photo.
// Losing localStorage = losing delete rights for older photos. That's fine
// for this app.
export function getOwnerId() {
  if (typeof window === 'undefined') return null;
  let id = null;
  try {
    id = window.localStorage.getItem(KEY);
  } catch {}
  if (!id) {
    id = crypto.randomUUID();
    try {
      window.localStorage.setItem(KEY, id);
    } catch {}
  }
  return id;
}
