-- ============================================================
-- Luxe Barbershop · 0004 · Atomic promo usage counter
-- ============================================================
-- Increments promos.used_count atomically. Returns the new count.
-- Used by the public booking server action after a successful insert.
-- ============================================================

create or replace function increment_promo_used_count(p_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  update promos
     set used_count = used_count + 1
   where id = p_id
   returning used_count into new_count;

  return coalesce(new_count, 0);
end;
$$;

-- Allow anyone (including the anon role used by the public booking flow
-- via the service_role client) to call this. The function is SECURITY
-- DEFINER and only touches a single column.
grant execute on function increment_promo_used_count(uuid) to anon, authenticated, service_role;
