-- =====================================================================
-- ANUNCIOS: mensajes del administrador para TODOS los usuarios.
-- Aparecen en el buzón de cada usuario. Solo los admins pueden publicar.
-- Requiere tener ya creada la tabla "admins" (admins-schema.sql).
-- Pégalo en Supabase -> SQL Editor -> Run.
-- =====================================================================

create table if not exists public.announcements (
  id         uuid primary key default gen_random_uuid(),
  text       text not null,
  created_by text,
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

-- Leer: cualquier usuario con sesión.
drop policy if exists "ann select" on public.announcements;
create policy "ann select" on public.announcements
  for select to authenticated using ( true );

-- Publicar: solo admins.
drop policy if exists "ann insert admin" on public.announcements;
create policy "ann insert admin" on public.announcements
  for insert to authenticated
  with check ( exists (select 1 from public.admins a where a.email = (auth.jwt()->>'email')) );

-- Borrar: solo admins.
drop policy if exists "ann delete admin" on public.announcements;
create policy "ann delete admin" on public.announcements
  for delete to authenticated
  using ( exists (select 1 from public.admins a where a.email = (auth.jwt()->>'email')) );
