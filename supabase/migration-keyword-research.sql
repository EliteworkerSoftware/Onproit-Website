-- "New" badge: whether an admin has seen a keyword on the dashboard yet.
alter table target_keywords add column if not exists seen_at timestamptz;

-- Everything already in the list has been on the dashboard before — only
-- keywords discovered from here on start out unseen.
update target_keywords set seen_at = now() where seen_at is null;

-- Real monthly search demand from DataForSEO (Google Ads data), independent
-- of whether the site has ever shown up for the keyword.
alter table target_keywords add column if not exists search_volume integer;
alter table target_keywords add column if not exists volume_checked_at timestamptz;

-- Running DataForSEO spend per calendar month ("2026-09"), so the sync can
-- refuse to make a call that would push past the monthly budget.
create table if not exists dataforseo_usage (
  month text primary key,
  spend_usd numeric not null default 0,
  calls integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table dataforseo_usage enable row level security;
