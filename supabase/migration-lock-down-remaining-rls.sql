-- Additional RLS lockdown, flagged by Supabase's own Advisor as critical.
-- Both tables are unrelated to the onproit-website app (edge_function_logs
-- is diagnostic logging from the company-invite feature; user_permissions
-- is empty, part of the unused client-portal RBAC system) but were
-- publicly readable/writable with zero auth. Neither has a legitimate
-- public consumer, so this locks them to service-role-only access, same as
-- the earlier migration.

alter table edge_function_logs enable row level security;
alter table user_permissions enable row level security;
