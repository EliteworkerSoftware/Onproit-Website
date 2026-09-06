alter table target_keywords add column if not exists source text not null default 'manual';
alter table target_keywords add column if not exists status text not null default 'discovered';
alter table target_keywords add column if not exists last_impressions integer;
alter table target_keywords add column if not exists last_clicks integer;
alter table target_keywords add column if not exists last_position numeric;
alter table target_keywords add column if not exists last_synced_at timestamptz;
