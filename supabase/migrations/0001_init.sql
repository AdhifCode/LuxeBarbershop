-- ============================================================
-- Luxe Barbershop · 0001 · Initial schema
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists "btree_gist";

-- ─────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────
create type user_role as enum ('ADMIN', 'STAFF', 'CUSTOMER');
create type booking_status as enum (
  'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'
);
create type promo_type as enum ('PERCENTAGE', 'FIXED_AMOUNT');
create type notification_channel as enum ('WHATSAPP', 'EMAIL', 'SMS', 'IN_APP');
create type inventory_movement_type as enum ('IN', 'OUT', 'ADJUST');
create type gallery_category as enum (
  'FADE', 'CLASSIC', 'MULLET', 'BEARD', 'COLOR', 'OTHER'
);

-- ─────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text not null,
  phone           text,
  email           text,
  role            user_role not null default 'CUSTOMER',
  avatar_url      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_profiles_role on profiles(role);

-- ─────────────────────────────────────────────
-- services
-- ─────────────────────────────────────────────
create table services (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  title           text not null,
  description     text,
  price           integer not null check (price >= 0),
  duration_min    integer not null check (duration_min > 0),
  is_active       boolean not null default true,
  is_featured     boolean not null default false,
  sort_order      integer not null default 0,
  image_url       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_services_active on services(is_active);

-- ─────────────────────────────────────────────
-- barbers
-- ─────────────────────────────────────────────
create table barbers (
  id              uuid primary key default uuid_generate_v4(),
  profile_id      uuid references profiles(id) on delete set null,
  full_name       text not null,
  bio             text,
  photo_url       text,
  specialties     text[] not null default '{}',
  is_active       boolean not null default true,
  hire_date       date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_barbers_active on barbers(is_active);

create table barber_services (
  barber_id       uuid references barbers(id)  on delete cascade,
  service_id      uuid references services(id) on delete cascade,
  primary key (barber_id, service_id)
);

create table barber_shifts (
  id              uuid primary key default uuid_generate_v4(),
  barber_id       uuid not null references barbers(id) on delete cascade,
  weekday         smallint not null check (weekday between 0 and 6),
  start_time      time not null,
  end_time        time not null check (end_time > start_time),
  is_active       boolean not null default true,
  unique (barber_id, weekday, start_time)
);

-- ─────────────────────────────────────────────
-- promos (declared before bookings so FK works)
-- ─────────────────────────────────────────────
create table promos (
  id              uuid primary key default uuid_generate_v4(),
  code            text unique not null,
  title           text not null,
  description     text,
  type            promo_type not null,
  value           integer not null check (value > 0),
  banner_url      text,
  starts_at       timestamptz not null,
  ends_at         timestamptz not null check (ends_at > starts_at),
  is_active       boolean not null default true,
  usage_limit     integer,
  used_count      integer not null default 0,
  created_at      timestamptz not null default now()
);
create index idx_promos_active on promos(is_active, starts_at, ends_at);

-- ─────────────────────────────────────────────
-- bookings
-- ─────────────────────────────────────────────
create table bookings (
  id              uuid primary key default uuid_generate_v4(),
  code            text unique not null default ('LUX-' || upper(substr(md5(random()::text), 1, 6))),
  customer_id     uuid references profiles(id) on delete set null,
  customer_name   text not null,
  customer_phone  text not null,
  customer_email  text,
  service_id      uuid references services(id) on delete restrict,
  service_title   text not null,
  service_price   integer not null,
  duration_min    integer not null,
  barber_id       uuid references barbers(id) on delete set null,
  barber_name     text,
  start_at        timestamptz not null,
  end_at          timestamptz not null,
  status          booking_status not null default 'PENDING',
  promo_id        uuid references promos(id) on delete set null,
  discount_amount integer not null default 0 check (discount_amount >= 0),
  total_price     integer not null check (total_price >= 0),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check (end_at > start_at)
);
create index idx_bookings_start_at on bookings(start_at);
create index idx_bookings_status   on bookings(status);
create index idx_bookings_barber   on bookings(barber_id);

alter table bookings add constraint no_double_booking
  exclude using gist (
    barber_id with =,
    tstzrange(start_at, end_at, '[)') with &&
  ) where (status in ('PENDING', 'CONFIRMED'));

-- ─────────────────────────────────────────────
-- gallery, testimonials
-- ─────────────────────────────────────────────
create table gallery (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  category        gallery_category not null default 'OTHER',
  before_url      text,
  after_url       text not null,
  barber_id       uuid references barbers(id) on delete set null,
  is_published    boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);
create index idx_gallery_published on gallery(is_published, sort_order);

create table testimonials (
  id              uuid primary key default uuid_generate_v4(),
  author_name     text not null,
  author_title    text,
  author_avatar   text,
  rating          smallint not null check (rating between 1 and 5),
  message         text not null,
  is_published    boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- inventory
-- ─────────────────────────────────────────────
create table inventory_items (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  sku             text unique,
  unit            text not null default 'pcs',
  stock           numeric(12,2) not null default 0,
  reorder_level   numeric(12,2) not null default 0,
  cost_price      integer,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table inventory_movements (
  id              uuid primary key default uuid_generate_v4(),
  item_id         uuid not null references inventory_items(id) on delete cascade,
  type            inventory_movement_type not null,
  quantity        numeric(12,2) not null check (quantity > 0),
  reason          text,
  booking_id      uuid references bookings(id) on delete set null,
  created_by      uuid references profiles(id) on delete set null,
  created_at      timestamptz not null default now()
);
create index idx_inv_mov_item on inventory_movements(item_id);

-- ─────────────────────────────────────────────
-- notifications
-- ─────────────────────────────────────────────
create table notifications (
  id              uuid primary key default uuid_generate_v4(),
  booking_id      uuid references bookings(id) on delete cascade,
  channel         notification_channel not null,
  recipient       text not null,
  subject         text,
  body            text not null,
  sent_at         timestamptz,
  error           text,
  created_at      timestamptz not null default now()
);
create index idx_notif_booking on notifications(booking_id);

-- ============================================================
-- Triggers
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger t_profiles_upd        before update on profiles        for each row execute function set_updated_at();
create trigger t_services_upd        before update on services        for each row execute function set_updated_at();
create trigger t_barbers_upd         before update on barbers         for each row execute function set_updated_at();
create trigger t_bookings_upd        before update on bookings        for each row execute function set_updated_at();
create trigger t_inventory_items_upd before update on inventory_items for each row execute function set_updated_at();

-- Inventory stock updater
create or replace function apply_inventory_movement()
returns trigger language plpgsql as $$
begin
  if new.type = 'IN' then
    update inventory_items set stock = stock + new.quantity where id = new.item_id;
  elsif new.type = 'OUT' then
    update inventory_items set stock = stock - new.quantity where id = new.item_id;
  elsif new.type = 'ADJUST' then
    update inventory_items set stock = new.quantity where id = new.item_id;
  end if;
  return new;
end $$;

create trigger t_inv_apply after insert on inventory_movements
  for each row execute function apply_inventory_movement();

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'CUSTOMER'
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table profiles            enable row level security;
alter table services            enable row level security;
alter table barbers             enable row level security;
alter table barber_services     enable row level security;
alter table barber_shifts       enable row level security;
alter table bookings            enable row level security;
alter table promos              enable row level security;
alter table gallery             enable row level security;
alter table testimonials        enable row level security;
alter table inventory_items     enable row level security;
alter table inventory_movements enable row level security;
alter table notifications       enable row level security;

create or replace function is_admin() returns boolean
language sql security definer stable as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('ADMIN','STAFF')
  );
$$;

-- Public reads
create policy "public read services"     on services            for select using (is_active);
create policy "public read barbers"      on barbers             for select using (is_active);
create policy "public read shifts"       on barber_shifts       for select using (is_active);
create policy "public read barber_svcs"  on barber_services     for select using (true);
create policy "public read gallery"      on gallery             for select using (is_published);
create policy "public read testimonials" on testimonials        for select using (is_published);
create policy "public read promos"       on promos              for select using (is_active and now() between starts_at and ends_at);

-- Bookings
create policy "create booking"          on bookings for insert with check (true);
create policy "read own booking"        on bookings for select using (customer_id = auth.uid() or is_admin());
create policy "admin update bookings"   on bookings for update using (is_admin());
create policy "admin delete bookings"   on bookings for delete using (is_admin());

-- Profiles
create policy "read own profile"   on profiles for select using (id = auth.uid() or is_admin());
create policy "update own profile" on profiles for update using (id = auth.uid() or is_admin());
create policy "admin insert profiles" on profiles for insert with check (is_admin());

-- Admin-only writes everywhere else
create policy "admin write services"      on services            for all using (is_admin()) with check (is_admin());
create policy "admin write barbers"       on barbers             for all using (is_admin()) with check (is_admin());
create policy "admin write barber_svcs"   on barber_services     for all using (is_admin()) with check (is_admin());
create policy "admin write shifts"        on barber_shifts       for all using (is_admin()) with check (is_admin());
create policy "admin write promos"        on promos              for all using (is_admin()) with check (is_admin());
create policy "admin write gallery"       on gallery             for all using (is_admin()) with check (is_admin());
create policy "admin write testimonials"  on testimonials        for all using (is_admin()) with check (is_admin());
create policy "admin write inv_items"     on inventory_items     for all using (is_admin()) with check (is_admin());
create policy "admin write inv_moves"     on inventory_movements for all using (is_admin()) with check (is_admin());
create policy "admin read notifications"  on notifications       for select using (is_admin());
create policy "admin write notifications" on notifications       for all using (is_admin()) with check (is_admin());
