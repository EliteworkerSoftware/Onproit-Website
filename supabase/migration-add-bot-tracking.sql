alter table page_views add column if not exists is_likely_bot boolean not null default false;
alter table page_views add column if not exists user_agent text;
create index if not exists page_views_is_likely_bot_idx on page_views (is_likely_bot);
