-- ============================================================
-- Luxe Barbershop · 0003 · Sync profiles.role to auth JWT
-- ============================================================
-- Lets the Next.js middleware authorize admin routes by reading
-- `app_metadata.role` from the JWT, instead of querying the
-- profiles table on every request.
--
-- After running this migration, existing admins won't have the
-- claim until their role is touched. We backfill at the bottom.
-- ============================================================

create or replace function sync_role_to_jwt()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update auth.users
     set raw_app_meta_data =
         coalesce(raw_app_meta_data, '{}'::jsonb)
         || jsonb_build_object('role', new.role)
   where id = new.id;
  return new;
end;
$$;

drop trigger if exists trg_sync_role on profiles;

create trigger trg_sync_role
  after insert or update of role on profiles
  for each row
  execute function sync_role_to_jwt();

-- Backfill existing rows: assigning role to itself fires the trigger
-- and pushes the current role into auth.users.raw_app_meta_data.
update profiles set role = role;
