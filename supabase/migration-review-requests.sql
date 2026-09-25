-- Google review requests sent from Admin → Reviews. Each email's button goes
-- through /review/<token>, which records the click and redirects to Google,
-- so the admin can see who actually opened the review page.
create table if not exists review_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_email text not null,
  note text,
  token text not null unique,
  sent_by text,
  reminder_sent_at timestamptz,
  clicked_at timestamptz
);

create index if not exists review_requests_created_at_idx on review_requests (created_at desc);
create index if not exists review_requests_email_idx on review_requests (lower(customer_email));

alter table review_requests enable row level security;

-- Which admin the request was sent as (Admin → Reviews "Send as"), so the
-- follow-up comes from the same person. Safe to re-run.
alter table review_requests add column if not exists sender_id uuid;

-- Set with "Mark as reviewed" once their review shows up on Google; blocks
-- any further resends or new requests to them. Safe to re-run.
alter table review_requests add column if not exists reviewed_at timestamptz;
