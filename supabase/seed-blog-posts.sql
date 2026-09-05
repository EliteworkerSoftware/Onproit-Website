-- Seed data recovered from the live onproit.com blog index (title, category, date, excerpt).
-- Full long-form article bodies were not published in individual post pages at the time of
-- this migration (the sitemap only listed /blog, not individual slugs), so `content` below
-- is seeded from the excerpt as placeholder body copy. Replace with the full article text
-- when available.

insert into blog_posts (title, slug, excerpt, content, category, author, published, published_at)
values
  (
    'Top 5 Benefits of Managed IT Services for Growing Companies',
    'top-5-benefits-of-managed-it-services-for-growing-companies',
    'Why struggle with tech issues when you can focus on your business? Explore how Managed IT Services provide cost savings, 24/7 support, and proactive security for small businesses.',
    '<p>Why struggle with tech issues when you can focus on your business? Explore how Managed IT Services provide cost savings, 24/7 support, and proactive security for small businesses.</p>',
    'Managed Services',
    'ONPRO IT Team',
    true,
    '2025-12-21T00:00:00Z'
  ),
  (
    'Essential Cybersecurity Solutions Every Small Business Needs Now',
    'essential-cybersecurity-solutions-every-small-business-needs-now',
    'Cyberattacks on small businesses are rising. Learn about the critical cybersecurity solutions—from MFA to Next-Gen Firewalls—that can protect your sensitive data and reputation.',
    '<p>Cyberattacks on small businesses are rising. Learn about the critical cybersecurity solutions—from MFA to Next-Gen Firewalls—that can protect your sensitive data and reputation.</p>',
    'Security',
    'ONPRO IT Team',
    true,
    '2025-12-21T00:00:00Z'
  ),
  (
    'The Ultimate IT Infrastructure Checklist for Small Businesses in 2026',
    'the-ultimate-it-infrastructure-checklist-for-small-businesses-in-2026',
    'Is your small business ready for the future? Use this comprehensive checklist to evaluate your IT infrastructure, security, and scalability for 2026 and beyond.',
    '<p>Is your small business ready for the future? Use this comprehensive checklist to evaluate your IT infrastructure, security, and scalability for 2026 and beyond.</p>',
    'Infrastructure',
    'ONPRO IT Team',
    true,
    '2025-12-21T00:00:00Z'
  ),
  (
    'Why Cyber Insurance is a Must-Have for Small Businesses in 2026',
    'why-cyber-insurance-is-a-must-have-for-small-businesses-in-2026',
    'As cyber threats evolve, having a robust defense is not enough. Learn why cyber insurance is becoming a critical safety net for modern businesses.',
    '<p>As cyber threats evolve, having a robust defense is not enough. Learn why cyber insurance is becoming a critical safety net for modern businesses.</p>',
    'Security',
    'ONPRO IT Team',
    true,
    '2025-12-18T00:00:00Z'
  ),
  (
    'Top 5 Signs Your Network Infrastructure Needs an Upgrade',
    'top-5-signs-your-network-infrastructure-needs-an-upgrade',
    'Slow internet speeds and frequent disconnects are just the tip of the iceberg. Discover the subtle signs that your network hardware is holding your business back.',
    '<p>Slow internet speeds and frequent disconnects are just the tip of the iceberg. Discover the subtle signs that your network hardware is holding your business back.</p>',
    'Network',
    'ONPRO IT Team',
    true,
    '2025-12-07T00:00:00Z'
  ),
  (
    'Cloud Migration: A Step-by-Step Guide for Growing Companies',
    'cloud-migration-a-step-by-step-guide-for-growing-companies',
    'Moving to the cloud doesn''t have to be daunting. We break down the migration process into manageable steps for seamless digital transformation.',
    '<p>Moving to the cloud doesn''t have to be daunting. We break down the migration process into manageable steps for seamless digital transformation.</p>',
    'Cloud',
    'ONPRO IT Team',
    true,
    '2025-11-19T00:00:00Z'
  ),
  (
    'VoIP vs. Traditional Landlines: What''s Best for Your Office?',
    'voip-vs-traditional-landlines-whats-best-for-your-office',
    'Still relying on copper wires? Compare the features, costs, and flexibility of VoIP systems against traditional landline setups.',
    '<p>Still relying on copper wires? Compare the features, costs, and flexibility of VoIP systems against traditional landline setups.</p>',
    'VoIP',
    'ONPRO IT Team',
    true,
    '2025-11-06T00:00:00Z'
  ),
  (
    'The Hidden Costs of Downtime: How Managed IT Pays for Itself',
    'the-hidden-costs-of-downtime-how-managed-it-pays-for-itself',
    'Downtime isn''t just about lost sales. It impacts reputation, employee morale, and future opportunities. Learn the true ROI of proactive IT management.',
    '<p>Downtime isn''t just about lost sales. It impacts reputation, employee morale, and future opportunities. Learn the true ROI of proactive IT management.</p>',
    'Managed IT',
    'ONPRO IT Team',
    true,
    '2025-10-22T00:00:00Z'
  ),
  (
    'Understanding Data Backup: The 3-2-1 Rule Explained',
    'understanding-data-backup-the-3-2-1-rule-explained',
    'Data loss can bankrupt a small business. Implement the industry-standard 3-2-1 backup strategy to ensure your data is always recoverable.',
    '<p>Data loss can bankrupt a small business. Implement the industry-standard 3-2-1 backup strategy to ensure your data is always recoverable.</p>',
    'Backup',
    'ONPRO IT Team',
    true,
    '2025-10-04T00:00:00Z'
  )
on conflict (slug) do nothing;
