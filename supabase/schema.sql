create table if not exists contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  company text,
  service text,
  message text,
  source text default 'website',
  created_at timestamp with time zone default now()
);

create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  category text,
  author text default 'ONPRO IT Team',
  published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now()
);
