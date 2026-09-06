alter table target_keywords add column if not exists content_url text;
alter table target_keywords add column if not exists queued_at timestamptz;
alter table target_keywords add column if not exists content_published_at timestamptz;
