-- Run once (idempotent). Paste in Supabase SQL Editor and hit Run.

-- 1. Photos table
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  act_id text,
  act_title text,
  act_time text,
  coords_lat double precision,
  coords_lng double precision,
  storage_path text not null,
  public_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists photos_created_at_desc
  on public.photos (created_at desc);

-- 2. Moderation columns
alter table public.photos
  add column if not exists report_count integer not null default 0,
  add column if not exists hidden boolean not null default false;

create index if not exists photos_hidden_idx
  on public.photos (hidden);

-- 2b. One photo per device per day.
-- capture_day is the local calendar day (YYYY-MM-DD) sent by the client.
alter table public.photos
  add column if not exists capture_day text;

create unique index if not exists photos_owner_day_uniq
  on public.photos (owner_id, capture_day)
  where capture_day is not null;

-- 3. Per-device report log (one row per (photo, reporter))
create table if not exists public.photo_reports (
  photo_id uuid not null references public.photos(id) on delete cascade,
  reporter_id text not null,
  created_at timestamptz not null default now(),
  primary key (photo_id, reporter_id)
);

create index if not exists photo_reports_photo_idx
  on public.photo_reports (photo_id);

-- 4. RLS: metadata readable by anyone (writes go through the API with the
-- service_role key, which bypasses RLS). Same for reports.
alter table public.photos enable row level security;
drop policy if exists "public read" on public.photos;
create policy "public read" on public.photos for select using (true);

alter table public.photo_reports enable row level security;
-- no public policies — reports table is service-role only.

-- 5. Public storage bucket for the JPEGs.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;
