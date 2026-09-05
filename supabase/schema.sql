-- ============================================================================
-- Public-site tables (existing)
-- ============================================================================

create table if not exists contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  company text,
  service text,
  message text,
  source text default 'website',
  status text not null default 'inbox' check (status in ('inbox', 'archived')),
  created_at timestamp with time zone default now()
);

alter table contact_submissions
  add column if not exists status text not null default 'inbox' check (status in ('inbox', 'archived'));

create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  category text,
  image_url text,
  author text default 'ONPRO IT Team',
  published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table blog_posts add column if not exists image_url text;

-- The contact form now writes through the service-role key only (see
-- src/app/api/contact/route.ts), so the public anon key needs no access at
-- all here — locked down the same as the admin-only tables below.
alter table contact_submissions enable row level security;

-- The public blog pages read this table with the anon key (src/lib/supabase.ts),
-- so unlike the tables above it needs one narrow public policy: published
-- posts only, never drafts, and no write access of any kind.
alter table blog_posts enable row level security;

drop policy if exists "public can read published posts" on blog_posts;
create policy "public can read published posts" on blog_posts
  for select using (published = true);

-- ============================================================================
-- Admin dashboard tables
-- ============================================================================

-- Who can log into /admin. Self-contained credentials store (not Supabase
-- Auth) — password_hash is salt:scryptHash, matching src/lib/admin-password.ts.
-- New admins are created directly with a generated temp password that's
-- emailed to them; there's no separate invitation/accept-link table.
create table if not exists admin_users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  password_hash text not null,
  display_name text,
  joined_at timestamp with time zone default now(),
  last_login_at timestamp with time zone
);

-- Log of admin replies sent to a contact_submissions row via Mailgun.
create table if not exists inquiry_replies (
  id uuid default gen_random_uuid() primary key,
  submission_id uuid not null references contact_submissions (id) on delete cascade,
  admin_id uuid references admin_users (id) on delete set null,
  admin_name text,
  message text not null,
  created_at timestamp with time zone default now()
);

-- Internal addresses notified on site events (contact form, etc).
create table if not exists email_recipients (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text,
  phone text,
  role text,
  notify_contact_forms boolean not null default true,
  notify_chatbot_leads boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Single global row driving the public Contact page / footer.
create table if not exists settings (
  id integer primary key default 1 check (id = 1),
  contact_email text not null default 'sales@onproit.com',
  contact_phone text not null default '856-988-2663',
  contact_address text not null default '409 Bloomfield Dr. STE 5, West Berlin, NJ 08091',
  hours_weekdays text not null default '9:00 AM - 5:00 PM',
  hours_saturday text not null default 'Closed',
  hours_sunday text not null default 'Closed',
  updated_at timestamp with time zone default now()
);

insert into settings (id) values (1) on conflict (id) do nothing;

-- ============================================================================
-- Cal.com booking pipeline
-- ============================================================================

create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  booking_uid text not null unique,
  attendee_name text,
  attendee_email text,
  attendee_phone text,
  event_type text,
  starts_at timestamp with time zone,
  ends_at timestamp with time zone,
  meeting_url text,
  pipeline_status text not null default 'confirmed',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================================
-- Row Level Security
--
-- The admin tables are reachable only through the server-side Supabase
-- service-role key (see src/lib/supabase-admin.ts), which bypasses RLS
-- entirely. RLS is enabled with no public policies so the anon key used by
-- the public site can never read/write them directly.
-- ============================================================================

alter table admin_users enable row level security;
alter table inquiry_replies enable row level security;
alter table email_recipients enable row level security;
alter table settings enable row level security;
alter table bookings enable row level security;
