-- Run once in Supabase SQL Editor.

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

-- Anyone can read the metadata (list gallery). Writes go through the API
-- with the service_role key, which bypasses RLS.
alter table public.photos enable row level security;
drop policy if exists "public read" on public.photos;
create policy "public read" on public.photos for select using (true);

-- Public storage bucket for the JPEGs. Public read via URL; uploads/deletes
-- happen server-side with the service_role.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;
