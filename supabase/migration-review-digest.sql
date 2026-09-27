-- One "ready for review" email per content-agent run instead of one per
-- keyword: each keyword is stamped when it's been included in a digest
-- email, so it's never announced twice.
alter table target_keywords add column if not exists review_notified_at timestamptz;

-- Keywords already waiting for review were announced by the old per-keyword
-- emails; don't announce them again in the first digest.
update target_keywords set review_notified_at = now() where status = 'in_review' and review_notified_at is null;
