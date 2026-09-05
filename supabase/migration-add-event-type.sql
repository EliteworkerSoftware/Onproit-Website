alter table page_views add column if not exists event_type text;
create index if not exists page_views_event_type_idx on page_views (event_type);
