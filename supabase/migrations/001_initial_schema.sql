-- Migration: 001_initial_schema.sql
-- Run this in Supabase SQL Editor at: https://supabase.com/dashboard

-- ─── Products ─────────────────────────────────────────────────────────────────
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(12, 2) not null check (price >= 0),
  image_url   text,
  stock       integer not null default 0 check (stock >= 0),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─── Order Status Enum ────────────────────────────────────────────────────────
do $$ begin
  create type order_status as enum (
    'pending',
    'confirmed',
    'shipping',
    'delivered',
    'cancelled'
  );
exception
  when duplicate_object then null;
end $$;

-- ─── Orders ───────────────────────────────────────────────────────────────────
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  customer_name     text not null,
  customer_phone    text not null,
  customer_zalo     text,
  customer_email    text,
  shipping_address  text not null,
  note              text,
  total_amount      numeric(12, 2) not null check (total_amount >= 0),
  status            order_status not null default 'pending',
  zalo_message_id   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Auto-update `updated_at` on any row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_orders_updated_at on orders;
create trigger set_orders_updated_at
  before update on orders
  for each row execute procedure update_updated_at();

-- ─── Order Items ──────────────────────────────────────────────────────────────
create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders (id) on delete cascade,
  product_id    uuid references products (id) on delete set null,
  product_name  text not null,
  quantity      integer not null check (quantity > 0),
  unit_price    numeric(12, 2) not null check (unit_price >= 0)
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table products  enable row level security;
alter table orders    enable row level security;
alter table order_items enable row level security;

-- Products: public read; service role writes
create policy "products_select_public"
  on products for select using (true);

-- Orders: service role only (API routes use service role key)
-- No direct public access; all mutations go through API routes
-- Admin reads are also via service role key

-- ─── Seed: Sample Products ───────────────────────────────────────────────────
insert into products (name, description, price, image_url, stock)
values
  ('Áo thun Unisex Basic', 'Áo thun cotton 100%, thoáng mát, form rộng', 150000, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', 50),
  ('Quần Jogger Cao Cấp', 'Chất liệu da cá, co giãn 4 chiều, phù hợp thể thao', 280000, 'https://images.unsplash.com/photo-1540572458-45b9bf72a3f4?w=600', 30),
  ('Túi Tote Canvas', 'Túi vải canvas dày, in logo thương hiệu, nhiều màu', 95000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 100),
  ('Mũ Bucket Hat', 'Mũ bucket vải dù, chống nắng tốt, nhiều màu tùy chọn', 120000, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600', 75)
on conflict do nothing;
