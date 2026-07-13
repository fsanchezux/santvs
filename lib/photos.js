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

export async function listPhotos({ adminToken } = {}) {
  const headers = adminToken ? { 'X-Admin-Token': adminToken } : {};
  const url = adminToken ? '/api/photos?scope=admin' : '/api/photos';
  const res = await fetch(url, { cache: 'no-store', headers });
  if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
  return await res.json();
}

export async function deletePhoto(id, { ownerId, adminToken } = {}) {
  const headers = {};
  if (ownerId) headers['X-Owner-Id'] = ownerId;
  if (adminToken) headers['X-Admin-Token'] = adminToken;
  const res = await fetch(`/api/photos/${id}`, { method: 'DELETE', headers });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`Delete failed (${res.status}): ${msg}`);
  }
}

export async function reportPhoto(id, ownerId) {
  const res = await fetch(`/api/photos/${id}/report`, {
    method: 'POST',
    headers: { 'X-Owner-Id': ownerId },
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`Report failed (${res.status}): ${msg}`);
  }
  return await res.json();
}

export async function setPhotoHidden(id, hidden, adminToken) {
  const res = await fetch(`/api/photos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': adminToken,
    },
    body: JSON.stringify({ hidden }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`Update failed (${res.status}): ${msg}`);
  }
  return await res.json();
}
