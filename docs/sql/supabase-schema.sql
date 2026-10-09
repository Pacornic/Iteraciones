-- Esquema para Kaizen (Iteration Design Manager) en Supabase.
-- Modelo POR USUARIO: cada cuenta tiene su propia fila con sus datos, aislada del resto.
-- Así tú y un amigo (o varias personas) podéis usar la misma app sin veros los datos.
--
-- Pégalo entero en Supabase → SQL Editor → New query → Run.

create table if not exists public.app_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

-- Cada usuario solo ve y edita SU fila.
drop policy if exists "own row select" on public.app_state;
create policy "own row select" on public.app_state
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "own row insert" on public.app_state;
create policy "own row insert" on public.app_state
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "own row update" on public.app_state;
create policy "own row update" on public.app_state
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- IMPORTANTE: no borres usuarios que tengan datos (al borrar el usuario se borran sus datos).
-- Para restringir el acceso, desactiva "Allow new users to sign up" en Authentication.

-- (Opcional) Si habías creado la tabla del modelo compartido, puedes borrarla:
-- drop table if exists public.app_shared;


-- =====================================================================
-- SOLICITUDES DE ACCESO (aprobación manual de altas)
-- Cualquiera (sin sesión) puede ENVIAR una solicitud; solo tú (usuario
-- con sesión) puedes verlas y gestionarlas. Mantén "Allow new users to
-- sign up" DESACTIVADO: la gente solicita aquí y tú creas el usuario a
-- mano en Authentication → Users → Add user con el correo aprobado.
-- =====================================================================

create table if not exists public.signup_requests (
  id         uuid primary key default gen_random_uuid(),
  nombre     text,
  apellido   text,
  email      text not null,
  status     text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.signup_requests enable row level security;

-- Enviar solicitud: permitido a cualquiera (anónimo o autenticado).
drop policy if exists "signup insert any" on public.signup_requests;
create policy "signup insert any" on public.signup_requests
  for insert to anon, authenticated with check (true);

-- Ver / gestionar: solo usuarios con sesión (tú).
drop policy if exists "signup select auth" on public.signup_requests;
create policy "signup select auth" on public.signup_requests
  for select to authenticated using (true);

drop policy if exists "signup update auth" on public.signup_requests;
create policy "signup update auth" on public.signup_requests
  for update to authenticated using (true) with check (true);

drop policy if exists "signup delete auth" on public.signup_requests;
create policy "signup delete auth" on public.signup_requests
  for delete to authenticated using (true);
