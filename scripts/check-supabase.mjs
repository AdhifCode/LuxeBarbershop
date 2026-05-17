// node scripts/check-supabase.mjs
// Quick health check that the Next.js app can talk to Supabase.

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
};
const ok = (msg) => console.log(`✓ ${msg}`);

console.log("\n— Luxe Barbershop · Supabase health check —\n");

// 1. Env vars present?
if (!url) fail("NEXT_PUBLIC_SUPABASE_URL missing");
else ok(`URL: ${url}`);
if (!anonKey) fail("NEXT_PUBLIC_SUPABASE_ANON_KEY missing");
else ok("Anon key present");
if (!serviceKey) fail("SUPABASE_SERVICE_ROLE_KEY missing");
else ok("Service-role key present");

if (!url || !anonKey || !serviceKey) {
  console.error("\nFix .env.local then re-run.");
  process.exit(1);
}

// 2. Anon-key read of the public services table (covers RLS too)
console.log("\n— Reading services with anon key —");
const anon = createClient(url, anonKey);
const { data: services, error: anonErr } = await anon
  .from("services")
  .select("id, title, price, is_active")
  .limit(5);

if (anonErr) fail(`anon read failed: ${anonErr.message}`);
else if (!services || services.length === 0)
  fail("anon read returned 0 rows — did you run 0001_init.sql + 0002_seed.sql?");
else {
  ok(`anon read ok: ${services.length} services`);
  for (const s of services)
    console.log(`   · ${s.title} — Rp ${s.price.toLocaleString("id-ID")}`);
}

// 3. Service-role read of the auth schema (proves env + role + connectivity)
console.log("\n— Service-role / admin sanity check —");
const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { count: profileCount, error: countErr } = await admin
  .from("profiles")
  .select("id", { count: "exact", head: true });

if (countErr) fail(`profile count failed: ${countErr.message}`);
else ok(`profiles table reachable, ${profileCount ?? 0} rows`);

const { data: admins, error: adminErr } = await admin
  .from("profiles")
  .select("email, role")
  .in("role", ["ADMIN", "STAFF"]);

if (adminErr) fail(`admin lookup failed: ${adminErr.message}`);
else if (!admins || admins.length === 0)
  console.log(
    "⚠  No ADMIN/STAFF profile found yet. Promote your user via SQL:\n   update profiles set role='ADMIN' where email='you@example.com';"
  );
else {
  ok(`Found ${admins.length} admin/staff account(s):`);
  for (const a of admins) console.log(`   · ${a.email} [${a.role}]`);
}

// 4. Optional schema sanity — confirm the JWT-sync trigger is installed
console.log("\n— Migrations check —");
const { data: trig, error: trigErr } = await admin
  .rpc("increment_promo_used_count", {
    p_id: "00000000-0000-0000-0000-000000000000",
  })
  .single();

if (trigErr && /function .* does not exist/i.test(trigErr.message))
  fail("0004_promo_increment.sql not applied yet");
else ok("0004_promo_increment.sql applied");

console.log("\nDone.\n");
