-- Esquema para la Bitácora de Iteraciones en Supabase.
-- Pégalo entero en Supabase → SQL Editor → New query → Run.
-- Guarda todo el estado de la app como un único JSON por usuario, protegido por RLS
-- (cada usuario solo puede leer/escribir su propia fila).

create table if not exists public.app_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

-- Un usuario solo ve y modifica su propia fila.
drop policy if exists "own row select" on public.app_state;
create policy "own row select" on public.app_state
  for select using (auth.uid() = user_id);

drop policy if exists "own row insert" on public.app_state;
create policy "own row insert" on public.app_state
  for insert with check (auth.uid() = user_id);

drop policy if exists "own row update" on public.app_state;
create policy "own row update" on public.app_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
