-- First-party page view tracking for the admin Analytics dashboard.
-- Public can only INSERT (the client-side tracker beacon); only the
-- service-role key (used by the admin dashboard) can read rows back.

create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  country text,
  is_mobile boolean,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on page_views (created_at desc);
create index if not exists page_views_path_idx on page_views (path);

alter table page_views enable row level security;

create policy "Anyone can record a page view"
  on page_views for insert
  to anon
  with check (true);
