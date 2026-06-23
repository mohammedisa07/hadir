create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  price numeric not null default 0,
  category text not null,
  image text default '',
  description text default '',
  is_popular boolean not null default false,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_categories (
  id text primary key,
  name text not null,
  icon text not null default 'salad',
  color text not null default 'bg-green-600 text-white',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.set_menu_items_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_menu_items_updated_at on public.menu_items;

create trigger set_menu_items_updated_at
before update on public.menu_items
for each row
execute function public.set_menu_items_updated_at();

drop trigger if exists set_menu_categories_updated_at on public.menu_categories;

create trigger set_menu_categories_updated_at
before update on public.menu_categories
for each row
execute function public.set_menu_items_updated_at();

alter table public.menu_items enable row level security;
alter table public.menu_categories enable row level security;

drop policy if exists "Public menu read" on public.menu_items;
create policy "Public menu read"
on public.menu_items
for select
to anon
using (true);

drop policy if exists "Public menu write" on public.menu_items;
create policy "Public menu write"
on public.menu_items
for all
to anon
using (true)
with check (true);

drop policy if exists "Public category read" on public.menu_categories;
create policy "Public category read"
on public.menu_categories
for select
to anon
using (true);

drop policy if exists "Public category write" on public.menu_categories;
create policy "Public category write"
on public.menu_categories
for all
to anon
using (true)
with check (true);
