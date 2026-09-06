alter table page_views add column if not exists session_id text;
alter table page_views add column if not exists duration_seconds integer;
alter table page_views add column if not exists click_label text;
alter table page_views add column if not exists click_href text;

create index if not exists page_views_session_id_idx on page_views (session_id);
