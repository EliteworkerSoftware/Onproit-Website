-- "Request changes" on Admin → Content Review: each request is a row the
-- content-revision agent works through (pending → in_progress → done/failed)
-- and reports back on, so the admin sees what was asked and what changed.
create table if not exists content_revisions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null,                 -- 'pr' (website changes) | 'blog' (blog draft)
  target text not null,               -- PR number, or blog draft id
  feedback text not null,
  requested_by text,
  status text not null default 'pending',
  result_note text,                   -- the agent's summary of what it changed
  completed_at timestamptz
);

create index if not exists content_revisions_target_idx on content_revisions (kind, target, created_at desc);
create index if not exists content_revisions_status_idx on content_revisions (status);

alter table content_revisions enable row level security;
