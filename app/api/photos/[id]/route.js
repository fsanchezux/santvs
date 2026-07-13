import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(req, { params }) {
  const { id } = await params;
  const ownerId = req.headers.get('x-owner-id');
  const adminId = process.env.ADMIN_OWNER_ID;
  const isAdmin = !!(adminId && ownerId && ownerId === adminId);

  if (!ownerId) {
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
  if (!isAdmin && photo.owner_id !== ownerId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  await supa.storage.from('photos').remove([photo.storage_path]);
  const { error: delErr } = await supa.from('photos').delete().eq('id', id);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
