create table if not exists target_keywords (
  id uuid primary key default gen_random_uuid(),
  keyword text not null unique,
  target_url text,
  priority text not null default 'medium',
  notes text,
  created_at timestamptz not null default now()
);

alter table target_keywords enable row level security;
