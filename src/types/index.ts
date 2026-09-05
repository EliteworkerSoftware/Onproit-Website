// Matches the real `blog_posts` table in the shared onproit Supabase
// project — no `author` or `published` boolean column; a post is
// considered published when `published_at` is set and in the past.
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
}

// Matches the real `contact_messages` table.
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  company: string | null;
  message: string | null;
  service: string | null;
  read: boolean;
  archived: boolean;
  created_at: string;
}

export interface ServiceCardData {
  title: string;
  description: string;
  href: string;
  icon: string;
}
