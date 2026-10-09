-- =====================================================================
-- COMPARTIR JUEGOS entre usuarios registrados (Kaizen)
-- Aditivo y seguro: SOLO crea tablas/función nuevas. NO toca app_state
-- ni tus datos actuales. Pégalo en Supabase -> SQL Editor -> Run.
-- (Si salta el aviso de "destructive"/RLS, es por crear tablas: es seguro.)
-- =====================================================================

-- 0) Directorio de usuarios registrados.
-- Cada usuario, al entrar, apunta su propio correo/nombre aquí. Sirve para
-- validar al invitar ("ese usuario no existe") y para mostrar nombres.
-- Lo pueden LEER todos los usuarios con sesión; cada uno solo ESCRIBE su fila.
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  name       text,
  username   text,
  updated_at timestamptz not null default now()
);

-- Por si la tabla ya existía sin la columna:
alter table public.profiles add column if not exists username text;

-- @usuario único (sin distinguir mayúsculas/minúsculas).
create unique index if not exists profiles_username_lower_uidx
  on public.profiles (lower(username)) where username is not null;

-- Guardar el nick deseado también en la solicitud de acceso (para verlo al aprobar).
alter table public.signup_requests add column if not exists username text;

alter table public.profiles enable row level security;

drop policy if exists "pf select" on public.profiles;
create policy "pf select" on public.profiles
  for select to authenticated using ( true );

drop policy if exists "pf upsert insert" on public.profiles;
create policy "pf upsert insert" on public.profiles
  for insert to authenticated with check ( auth.uid() = user_id );

drop policy if exists "pf upsert update" on public.profiles;
create policy "pf upsert update" on public.profiles
  for update to authenticated using ( auth.uid() = user_id ) with check ( auth.uid() = user_id );


-- 1) Juegos compartidos. Cada fila = un juego compartido.
create table if not exists public.shared_games (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid references auth.users(id) on delete set null,
  owner_email     text not null,
  data            jsonb not null default '{}'::jsonb,   -- el juego (mismo formato que un juego propio)
  members         text[] not null default '{}',          -- correos que YA tienen acceso (han aceptado)
  rev             bigint not null default 1,             -- contador de versión (para avisar de conflictos)
  updated_at      timestamptz not null default now(),
  updated_by      text,                                  -- correo del último que guardó
  updated_by_name text,                                  -- nombre del último que guardó
  created_at      timestamptz not null default now()
);

alter table public.shared_games enable row level security;

-- Ver: dueño o miembro (por correo del token).
drop policy if exists "sg select" on public.shared_games;
create policy "sg select" on public.shared_games
  for select to authenticated
  using ( (auth.jwt()->>'email') = owner_email or (auth.jwt()->>'email') = any(members) );

-- Crear: solo autenticado y como dueño de lo que crea.
drop policy if exists "sg insert" on public.shared_games;
create policy "sg insert" on public.shared_games
  for insert to authenticated
  with check ( (auth.jwt()->>'email') = owner_email );

-- Editar: dueño o miembro (colaboración plena).
drop policy if exists "sg update" on public.shared_games;
create policy "sg update" on public.shared_games
  for update to authenticated
  using ( (auth.jwt()->>'email') = owner_email or (auth.jwt()->>'email') = any(members) )
  with check ( (auth.jwt()->>'email') = owner_email or (auth.jwt()->>'email') = any(members) );

-- Borrar: solo el dueño.
drop policy if exists "sg delete" on public.shared_games;
create policy "sg delete" on public.shared_games
  for delete to authenticated
  using ( (auth.jwt()->>'email') = owner_email );


-- 2) Invitaciones a un juego compartido.
create table if not exists public.game_invites (
  id            uuid primary key default gen_random_uuid(),
  game_id       uuid not null references public.shared_games(id) on delete cascade,
  email         text not null,          -- correo invitado (en minúsculas)
  inviter_email text,                    -- quién invita
  game_name     text,                    -- nombre del juego (para mostrar en la invitación)
  status        text not null default 'pending',  -- pending | accepted | declined
  created_at    timestamptz not null default now()
);

alter table public.game_invites enable row level security;

-- Ver: el invitado (su correo) o quien invitó.
drop policy if exists "gi select" on public.game_invites;
create policy "gi select" on public.game_invites
  for select to authenticated
  using ( (auth.jwt()->>'email') = email or (auth.jwt()->>'email') = inviter_email );

-- Crear invitación: autenticado y como quien invita.
drop policy if exists "gi insert" on public.game_invites;
create policy "gi insert" on public.game_invites
  for insert to authenticated
  with check ( (auth.jwt()->>'email') = inviter_email );

-- Rechazar/actualizar: el invitado sobre su invitación; o quien invitó (cancelar).
drop policy if exists "gi update" on public.game_invites;
create policy "gi update" on public.game_invites
  for update to authenticated
  using ( (auth.jwt()->>'email') = email or (auth.jwt()->>'email') = inviter_email );

-- Borrar: invitado o quien invitó.
drop policy if exists "gi delete" on public.game_invites;
create policy "gi delete" on public.game_invites
  for delete to authenticated
  using ( (auth.jwt()->>'email') = email or (auth.jwt()->>'email') = inviter_email );


-- 3) Aceptar invitación de forma segura.
-- El invitado aún no es miembro, así que no puede añadirse solo por RLS.
-- Esta función (con permisos elevados) solo permite aceptar TU PROPIA
-- invitación: te añade a members y marca la invitación como aceptada.
create or replace function public.accept_game_invite(p_invite uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := (auth.jwt()->>'email');
  v_game  uuid;
begin
  select game_id into v_game
  from public.game_invites
  where id = p_invite and email = v_email and status = 'pending';

  if v_game is null then
    raise exception 'Invitación no válida o no es tuya';
  end if;

  update public.shared_games
     set members = (select array(select distinct e from unnest(members || array[v_email]) as e))
   where id = v_game;

  update public.game_invites set status = 'accepted' where id = p_invite;
end;
$$;

grant execute on function public.accept_game_invite(uuid) to authenticated;
