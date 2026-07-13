import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_THRESHOLD = 3;

export async function POST(req, { params }) {
  const { id } = await params;
  const reporterId = req.headers.get('x-owner-id');
  if (!reporterId) {
    return NextResponse.json({ error: 'missing owner id' }, { status: 400 });
  }

  const supa = supabaseAdmin();

  const { data: photo, error: getErr } = await supa
    .from('photos')
    .select('id, owner_id')
    .eq('id', id)
    .single();
  if (getErr || !photo) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  if (photo.owner_id === reporterId) {
    return NextResponse.json({ error: 'cannot report own photo' }, { status: 400 });
  }

  // De-dupe: primary key (photo_id, reporter_id) blocks a second insert.
  const { error: insertErr } = await supa
    .from('photo_reports')
    .insert({ photo_id: id, reporter_id: reporterId });

  if (insertErr && insertErr.code !== '23505') {
    // 23505 = unique violation → already reported, treat as success.
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }
  const alreadyReported = insertErr?.code === '23505';

  // Recompute canonical count from the reports table to avoid drift.
  const { count } = await supa
    .from('photo_reports')
    .select('*', { count: 'exact', head: true })
    .eq('photo_id', id);

  const threshold = Number(process.env.REPORT_THRESHOLD) || DEFAULT_THRESHOLD;
  const hidden = (count || 0) >= threshold;

  const { data: updated, error: updateErr } = await supa
    .from('photos')
    .update({ report_count: count || 0, hidden })
    .eq('id', id)
    .select('report_count, hidden')
    .single();
  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    already_reported: alreadyReported,
    report_count: updated.report_count,
    hidden: updated.hidden,
  });
}
