-- =====================================================================
-- ADMIN: quién puede ver/gestionar las SOLICITUDES DE ACCESO.
-- Antes, cualquier usuario con sesión podía ver las solicitudes (fallo).
-- Con esto, solo los correos de la tabla "admins" las ven y gestionan.
-- Enviar una solicitud sigue siendo público (eso no cambia).
--
-- Pégalo en Supabase -> SQL Editor -> Run. IMPORTANTE: cambia el correo
-- de abajo por TU correo de administrador antes de ejecutar.
-- =====================================================================

create table if not exists public.admins ( email text primary key );

alter table public.admins enable row level security;

-- Cada usuario solo puede comprobar SU propia fila (saber si es admin),
-- sin ver la lista completa de administradores.
drop policy if exists "adm select own" on public.admins;
create policy "adm select own" on public.admins
  for select to authenticated using ( (auth.jwt()->>'email') = email );

-- >>> CAMBIA ESTE CORREO POR EL TUYO <<<
insert into public.admins(email) values ('pacornic@gmail.com') on conflict do nothing;

-- Restringir las solicitudes de acceso a admins (ver/actualizar/borrar).
drop policy if exists "signup select auth"  on public.signup_requests;
drop policy if exists "signup select admin" on public.signup_requests;
create policy "signup select admin" on public.signup_requests
  for select to authenticated
  using ( exists (select 1 from public.admins a where a.email = (auth.jwt()->>'email')) );

drop policy if exists "signup update auth"  on public.signup_requests;
drop policy if exists "signup update admin" on public.signup_requests;
create policy "signup update admin" on public.signup_requests
  for update to authenticated
  using ( exists (select 1 from public.admins a where a.email = (auth.jwt()->>'email')) )
  with check ( exists (select 1 from public.admins a where a.email = (auth.jwt()->>'email')) );

drop policy if exists "signup delete auth"  on public.signup_requests;
drop policy if exists "signup delete admin" on public.signup_requests;
create policy "signup delete admin" on public.signup_requests
  for delete to authenticated
  using ( exists (select 1 from public.admins a where a.email = (auth.jwt()->>'email')) );

-- (El insert público de solicitudes se mantiene como estaba: "signup insert any".)
