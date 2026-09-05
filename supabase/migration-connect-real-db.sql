-- ============================================================================
-- Migration to connect the new onproit-website Next.js app to the REAL,
-- existing Supabase project (kvzduxklwnmevzzjswhv) that already backs the
-- old onproit.com admin — this is NOT a fresh schema, it adapts to what's
-- already live (blog_posts has 9 real posts, contact_messages has 1 real
-- message, app_settings has 44 real rows). Run this in the Supabase SQL
-- Editor for that project.
-- ============================================================================

-- contact_messages: add the "service interest" field the new contact form
-- collects (existing table has "subject" but no "service" column).
alter table contact_messages add column if not exists service text;

-- bookings: currently the old custom booking-widget table (name, email,
-- booking_date, booking_time, team_member_id, sms_opt_in, ...) tied to the
-- team_members/agent_availability/blocked_slots system being replaced by
-- Cal.com. It's empty (0 rows), so it's safe to drop and recreate with the
-- shape the new Cal.com webhook expects. team_members/agent_availability/
-- blocked_slots are left untouched (unused now, but not deleted).
drop table if exists bookings;

create table bookings (
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
-- Security fix: none of these tables had Row Level Security enabled, so the
-- public API key (exposed in every visitor's browser) could read real
-- customer messages, admin profiles, and — worst — pending admin invite
-- tokens directly. This locks down only the tables the new onproit-website
-- app touches; other tables (companies, company_users, users, sms_logs,
-- analytics_events, the LMS/projects tables) are NOT touched here and need
-- separate review since other products may depend on their current access.
-- ============================================================================

alter table contact_messages enable row level security;
alter table admin_invites enable row level security;
alter table profiles enable row level security;
alter table bookings enable row level security;

-- app_settings stays publicly readable (it's just business hours/contact
-- info, not sensitive) but locked against public writes.
alter table app_settings enable row level security;
drop policy if exists "public can read app_settings" on app_settings;
create policy "public can read app_settings" on app_settings
  for select using (true);
