-- =====================================================================
-- ARREGLO: permitir que un invitado SALGA de un proyecto compartido.
-- (Quitarse a sí mismo de "members" lo bloqueaba la política de seguridad.)
-- Esta función (con permisos elevados) solo deja que te quites A TI MISMO.
-- Pégalo en Supabase -> SQL Editor -> Run.
-- =====================================================================

create or replace function public.leave_shared_game(p_game uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := (auth.jwt()->>'email');
begin
  update public.shared_games
     set members = (select array(select e from unnest(members) as e where e <> v_email))
   where id = p_game and v_email = any(members);
end;
$$;

grant execute on function public.leave_shared_game(uuid) to authenticated;
