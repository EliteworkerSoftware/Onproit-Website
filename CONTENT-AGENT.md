# Notes for the ONPRO IT content agent (the daily routine)

These override anything older in your routine prompt.

## Review emails: one per run, not one per keyword

Saving a blog draft (POST /api/cron/blog-drafts) and marking a keyword in
review (PATCH /api/cron/keywords/<id>) no longer email the owner. Instead, once
you've finished STEP 5 (the PR and every PATCH) and saved any blog drafts, and
before the STEP 7 push notification, make this ONE call with the same
Authorization header you use for the other calls:

curl -s -X POST -H "Authorization: Bearer <same secret>" https://www.onproit.com/api/cron/content-review-digest

It emails the owner a single summary of everything ready for review, with one
link to the Content Review page. It's safe to call even if nothing was built
(it sends nothing). If you forget, a daily fallback sends it at 10 AM ET.
