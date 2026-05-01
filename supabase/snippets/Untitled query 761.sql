-- 1. Habilitar extensiones necesarias
create extension if not exists "uuid-ossp";

-- 2. Crear tabla de Perfiles (extensión de auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  status text default 'trialing',
  trial_start_date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- 3. Tabla de Edificios (Torres)
create table public.buildings (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  address text,
  owner_name text,
  owner_ci text,
  status text default 'active',
  created_at timestamp with time zone default now()
);

-- 4. Tabla de Unidades (Departamentos)
create table public.units (
  id uuid default uuid_generate_v4() primary key,
  building_id uuid references public.buildings on delete cascade,
  unit_number text not null,
  floor text,
  price numeric not null,
  bedrooms int,
  bathrooms int,
  has_balcony boolean default false,
  sq_meters numeric,
  status text default 'available',
  created_at timestamp with time zone default now()
);

-- 5. Tabla de Inquilinos
create table public.tenants (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  email text,
  phone text,
  ci text not null,
  address text,
  created_at timestamp with time zone default now()
);

-- 6. Tabla de Contratos
create table public.contracts (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants on delete restrict,
  unit_id uuid references public.units on delete restrict,
  start_date date not null,
  end_date date not null,
  monthly_amount numeric not null,
  deposit_amount numeric,
  status text default 'active',
  contract_url text,
  created_at timestamp with time zone default now()
);

-- 7. Tabla de Gastos (Expenses)
create table public.expenses (
  id uuid default uuid_generate_v4() primary key,
  building_id uuid references public.buildings on delete cascade,
  unit_id uuid references public.units on delete cascade,
  amount numeric not null,
  category text,
  description text,
  expense_date date default current_date,
  created_at timestamp with time zone default now()
);

-- 8. Tabla de Pagos
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  contract_id uuid references public.contracts on delete cascade,
  amount numeric not null,
  receipt_number text unique,
  payment_date timestamp with time zone default now(),
  month_covered text,
  created_at timestamp with time zone default now()
);

-- 9. Habilitar Realtime
alter publication supabase_realtime add table public.payments, public.expenses, public.units;