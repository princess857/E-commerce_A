create table if not exists public.products (
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  long_description text,
  price integer not null,
  old_price integer,
  discount integer default 0,
  category text not null,
  image text not null,
  colors text[] default array['Black', 'Brown', 'Beige'],
  sizes text[] default array[]::text[],
  rating numeric(2,1) default 4.5,
  review_count integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_created_at on public.products (created_at);

alter table public.products enable row level security;

drop policy if exists "Anyone can read products" on public.products;
create policy "Anyone can read products"
  on public.products for select
  using (true);

drop policy if exists "Only admins can insert products" on public.products;
create policy "Only admins can insert products"
  on public.products for insert to authenticated
  with check (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

drop policy if exists "Only admins can update products" on public.products;
create policy "Only admins can update products"
  on public.products for update to authenticated
  using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

drop policy if exists "Only admins can delete products" on public.products;
create policy "Only admins can delete products"
  on public.products for delete to authenticated
  using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

alter table public.profiles add column if not exists is_admin boolean default false;
