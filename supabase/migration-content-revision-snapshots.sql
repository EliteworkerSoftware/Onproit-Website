-- Before/after snapshots on each "Request changes" revision, so Content Review
-- can show exactly what the agent changed. For website changes these hold the
-- pull request's commit ({"sha": ...}); for blog drafts, the draft's text
-- ({"title", "excerpt", "content"}).
alter table content_revisions add column if not exists before_snapshot jsonb;
alter table content_revisions add column if not exists after_snapshot jsonb;
