import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from('photos')
    .select('id, owner_id, act_id, act_title, act_time, coords_lat, coords_lng, public_url, created_at')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req) {
  const ownerId = req.headers.get('x-owner-id');
  if (!ownerId) {
    return NextResponse.json({ error: 'missing owner id' }, { status: 400 });
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'missing file' }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: 'file too large' }, { status: 413 });
  }

  const supa = supabaseAdmin();
  const id = crypto.randomUUID();
  const path = `${id}.jpg`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadErr } = await supa.storage
    .from('photos')
    .upload(path, bytes, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });
  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data: urlData } = supa.storage.from('photos').getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  const row = {
    id,
    owner_id: ownerId,
    act_id: form.get('act_id') || null,
    act_title: form.get('act_title') || null,
    act_time: form.get('act_time') || null,
    coords_lat: form.get('coords_lat') ? Number(form.get('coords_lat')) : null,
    coords_lng: form.get('coords_lng') ? Number(form.get('coords_lng')) : null,
    storage_path: path,
    public_url: publicUrl,
  };
  const { data: inserted, error: insertErr } = await supa
    .from('photos')
    .insert(row)
    .select()
    .single();
  if (insertErr) {
    // roll back the upload so we don't leak orphan blobs
    await supa.storage.from('photos').remove([path]);
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }
  return NextResponse.json(inserted);
}
