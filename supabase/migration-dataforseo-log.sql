-- One row per DataForSEO request, shown in Admin → Analytics → "DataForSEO
-- activity" so it's always visible exactly what was looked up, when, why,
-- and what it cost. dataforseo_usage (monthly totals) still enforces the cap.
create table if not exists dataforseo_calls (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null,          -- 'volume' (search volumes) | 'ideas' (related keywords)
  trigger text,                -- what asked for it, e.g. 'Daily keyword sync'
  market text,                 -- the area volumes are measured in
  keywords_sent integer,
  results integer,
  cost_usd numeric not null default 0,
  ok boolean not null default true,
  detail text,                 -- a one-line summary or the error
  sample jsonb                 -- a few of the keywords sent / ideas returned
);

create index if not exists dataforseo_calls_created_at_idx on dataforseo_calls (created_at desc);

alter table dataforseo_calls enable row level security;
