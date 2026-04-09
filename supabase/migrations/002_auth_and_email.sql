-- Migration: 002_auth_and_email.sql
-- Adds user profiles, links orders to auth users, drops Zalo-specific columns.
-- Run in Supabase SQL Editor AFTER 001_initial_schema.sql.

-- ─── Profiles Table ──────────────────────────────────────────────────────────
-- Stores additional user info beyond Supabase Auth (name, phone, role).
create table if not exists profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null,
  phone      text,
  email      text,
  role       text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Users can read and update own profile
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id);

-- Service role can do everything (for registration API)
create policy "profiles_insert_service"
  on profiles for insert
  with check (true);

-- Admin can view all profiles
create policy "profiles_select_admin"
  on profiles for select
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ─── Link Orders to Auth Users ───────────────────────────────────────────────
-- Add user_id column (nullable for orders from before auth was added)
alter table orders add column if not exists user_id uuid references auth.users (id);

-- Drop Zalo-specific columns
alter table orders drop column if exists zalo_message_id;
alter table orders drop column if exists customer_zalo;

-- ─── Updated RLS for Orders ──────────────────────────────────────────────────
-- Drop old policies first (they were service-role-only)
drop policy if exists "orders_service_role_only" on orders;

-- Customers can view their own orders
create policy "orders_select_own"
  on orders for select
  using (auth.uid() = user_id);

-- Customers can insert orders for themselves
create policy "orders_insert_own"
  on orders for insert
  with check (auth.uid() = user_id);

-- Admin can view all orders
create policy "orders_select_admin"
  on orders for select
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Admin can update any order (status changes)
create policy "orders_update_admin"
  on orders for update
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Order items: viewable if user owns the parent order OR is admin
drop policy if exists "order_items_service_role_only" on order_items;

create policy "order_items_select_own"
  on order_items for select
  using (
    exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  );

create policy "order_items_select_admin"
  on order_items for select
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "order_items_insert"
  on order_items for insert
  with check (true);

-- ─── Create Admin User (run manually, change email) ─────────────────────────
-- After registering as a normal user, promote to admin:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@gmail.com';
