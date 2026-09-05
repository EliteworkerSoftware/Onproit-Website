export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  author: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  source: string;
}

export interface ServiceCardData {
  title: string;
  description: string;
  href: string;
  icon: string;
}
