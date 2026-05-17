-- ============================================================
-- Luxe Barbershop · 0005 · Fix "Database error creating user"
-- ============================================================
-- Symptoms: Adding a user via Supabase Dashboard → Authentication
-- fails with "Database error creating user".
--
-- Root cause: the original handle_new_user trigger from 0001_init
-- did not pin search_path / qualify table names / grant rights
-- to supabase_auth_admin, so the trigger silently fails when
-- invoked from the auth schema.
--
-- This migration replaces that trigger with a hardened version.
-- ============================================================

-- 1. Ensure the auth admin role can read/write profiles
grant usage on schema public to supabase_auth_admin;
grant select, insert, update on public.profiles to supabase_auth_admin;

-- 2. Replace the trigger function with a hardened version
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      split_part(coalesce(new.email, ''), '@', 1),
      'New User'
    ),
    new.email,
    'CUSTOMER'
  )
  on conflict (id) do nothing;

  return new;
exception
  when others then
    -- Do NOT fail the auth.users insert if the profile insert
    -- has a transient issue — log and let the auth row land.
    raise warning 'handle_new_user failed for %: %', new.id, sqlerrm;
    return new;
end;
$$;

-- 3. Make sure the trigger is bound (drop + recreate, in case the
-- previous one was created against an older signature).
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
