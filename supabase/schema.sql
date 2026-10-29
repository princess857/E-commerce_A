create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carts (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  quantity integer not null check (quantity > 0),
  color text not null default 'Black',
  size text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.wishlists (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.reviews (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_reviews_product_id on public.reviews (product_id);
create index if not exists idx_reviews_user_id on public.reviews (user_id);

alter table public.profiles enable row level security;
alter table public.carts enable row level security;
alter table public.wishlists enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can read their cart" on public.carts;
create policy "Users can read their cart"
  on public.carts for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can add to their cart" on public.carts;
create policy "Users can add to their cart"
  on public.carts for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their cart" on public.carts;
create policy "Users can update their cart"
  on public.carts for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can remove from their cart" on public.carts;
create policy "Users can remove from their cart"
  on public.carts for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can read their wishlist" on public.wishlists;
create policy "Users can read their wishlist"
  on public.wishlists for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can add to their wishlist" on public.wishlists;
create policy "Users can add to their wishlist"
  on public.wishlists for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can remove from their wishlist" on public.wishlists;
create policy "Users can remove from their wishlist"
  on public.wishlists for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Anyone can read reviews" on public.reviews;
create policy "Anyone can read reviews"
  on public.reviews for select to authenticated
  using (true);

drop policy if exists "Users can add reviews" on public.reviews;
create policy "Users can add reviews"
  on public.reviews for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their reviews" on public.reviews;
create policy "Users can update their reviews"
  on public.reviews for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their reviews" on public.reviews;
create policy "Users can delete their reviews"
  on public.reviews for delete to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();
