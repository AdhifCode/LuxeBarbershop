-- ============================================================
-- Luxe Barbershop · 0002 · Seed data
-- ============================================================

-- ─── Services ───────────────────────────────
insert into services (slug, title, description, price, duration_min, is_featured, sort_order) values
  ('signature-haircut','Signature Haircut','Konsultasi gaya, potong rambut presisi, hot towel, dan styling premium.',75000,45,true,1),
  ('haircut-beard','Haircut + Beard Grooming','Paket lengkap potong rambut dan grooming jenggot dengan royal shave.',110000,60,false,2),
  ('creambath','Creambath Therapy','Perawatan kulit kepala dan rambut dengan pijat relaksasi 30 menit.',85000,60,false,3),
  ('keratin','Keratin Smoothing','Perawatan rambut premium untuk hasil halus, sehat, dan berkilau.',250000,90,false,4),
  ('hair-color','Hair Coloring','Pewarnaan profesional dengan produk premium dan finishing rapi.',180000,90,false,5),
  ('luxe-package','The Luxe Package','Haircut + Beard + Creambath + Hot Towel.',175000,120,true,6)
on conflict (slug) do nothing;

-- ─── Barbers ────────────────────────────────
insert into barbers (full_name, bio, photo_url, specialties) values
  ('Rizky "Kiki" Pratama', 'Master barber dengan 8+ tahun pengalaman.',
   'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
   '{Fade,Classic,Beard}'),
  ('Bagas Wirawan', 'Spesialis modern style, mullet, dan textured cuts.',
   'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=600&q=80',
   '{Mullet,Color,Fade}'),
  ('Andre Saputra', 'Senior barber, ahli beard grooming dan hot towel shave.',
   'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
   '{Beard,Classic}');

-- Default shift for everyone: every day 09:00-21:00
insert into barber_shifts (barber_id, weekday, start_time, end_time)
select b.id, d.weekday, '09:00'::time, '21:00'::time
from barbers b
cross join generate_series(0,6) as d(weekday);

-- All barbers can do all services by default
insert into barber_services (barber_id, service_id)
select b.id, s.id from barbers b cross join services s;

-- ─── Gallery ────────────────────────────────
insert into gallery (title, category, after_url, sort_order) values
  ('Mid Fade',           'FADE',    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80', 1),
  ('Classic Side Part',  'CLASSIC', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80', 2),
  ('Royal Beard',        'BEARD',   'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80', 3),
  ('Modern Mullet',      'MULLET',  'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&w=900&q=80', 4),
  ('Skin Fade',          'FADE',    'https://images.unsplash.com/photo-1635273051937-1108a242c14a?auto=format&fit=crop&w=900&q=80', 5),
  ('Textured Crop',      'CLASSIC', 'https://images.unsplash.com/photo-1593702288056-f173dc8a96c2?auto=format&fit=crop&w=900&q=80', 6),
  ('Highlight Color',    'COLOR',   'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80', 7),
  ('Pompadour',          'CLASSIC', 'https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?auto=format&fit=crop&w=900&q=80', 8);

-- ─── Testimonials ───────────────────────────
insert into testimonials (author_name, author_title, rating, message, sort_order) values
  ('Dimas A.',  'Marketing Manager',     5, 'Tempat ternyaman buat grooming. Kursi enak, vibe-nya premium.', 1),
  ('Aditya R.', 'Software Engineer',     5, 'Capster-nya pro banget, hasilnya selalu rapi dan modern.',     2),
  ('Reza P.',   'Entrepreneur',          5, 'Worth the price. Pelayanan kelas hotel bintang lima.',         3);

-- ─── Promos ─────────────────────────────────
insert into promos (code, title, description, type, value, starts_at, ends_at) values
  ('GRANDOPEN', 'Grand Opening 20% OFF', 'Diskon 20% untuk semua layanan. Berlaku terbatas.',
   'PERCENTAGE', 20, now(), now() + interval '30 days');

-- ─── Inventory ──────────────────────────────
insert into inventory_items (name, sku, unit, stock, reorder_level) values
  ('Pomade Premium',    'POM-001', 'pcs', 24, 6),
  ('Shampoo Argan',     'SHP-001', 'pcs', 12, 4),
  ('Hair Dye - Black',  'DYE-001', 'pcs',  8, 3),
  ('Hot Towel',         'TWL-001', 'pcs', 40, 10);
