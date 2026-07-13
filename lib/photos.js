// Client-side helpers for the shared photo gallery.
// Persistence lives on the server (Supabase); these just wrap fetch.

export async function savePhoto({ blob, actId, actTitle, actTime, coords, ownerId }) {
  const fd = new FormData();
  fd.append('file', blob, 'photo.jpg');
  if (actId) fd.append('act_id', actId);
  if (actTitle) fd.append('act_title', actTitle);
  if (actTime) fd.append('act_time', actTime);
  if (coords) {
    fd.append('coords_lat', String(coords.lat));
    fd.append('coords_lng', String(coords.lng));
  }
  const res = await fetch('/api/photos', {
    method: 'POST',
    headers: { 'X-Owner-Id': ownerId },
    body: fd,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}): ${msg}`);
  }
  return await res.json();
}

export async function listPhotos() {
  const res = await fetch('/api/photos', { cache: 'no-store' });
  if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
  return await res.json();
}

export async function deletePhoto(id, ownerId) {
  const res = await fetch(`/api/photos/${id}`, {
    method: 'DELETE',
    headers: { 'X-Owner-Id': ownerId },
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`Delete failed (${res.status}): ${msg}`);
  }
}
