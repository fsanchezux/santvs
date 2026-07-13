import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAdmin(req) {
  const token = req.headers.get('x-admin-token');
  const expected = process.env.ADMIN_TOKEN;
  return !!(token && expected && token === expected);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const ownerId = req.headers.get('x-owner-id');
  const admin = isAdmin(req);

  if (!ownerId && !admin) {
    return NextResponse.json({ error: 'missing owner id' }, { status: 400 });
  }

  const supa = supabaseAdmin();
  const { data: photo, error: getErr } = await supa
    .from('photos')
    .select('id, owner_id, storage_path')
    .eq('id', id)
    .single();
  if (getErr || !photo) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  if (!admin && photo.owner_id !== ownerId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  await supa.storage.from('photos').remove([photo.storage_path]);
  const { error: delErr } = await supa.from('photos').delete().eq('id', id);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

// Admin-only: flip the `hidden` flag (and optionally reset report_count).
export async function PATCH(req, { params }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const patch = {};
  if (typeof body.hidden === 'boolean') {
    patch.hidden = body.hidden;
    if (body.hidden === false) patch.report_count = 0;
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'nothing to update' }, { status: 400 });
  }

  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from('photos')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
