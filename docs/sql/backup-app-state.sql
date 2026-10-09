-- COPIA DE SEGURIDAD de tus datos actuales ANTES de tocar nada.
-- Qué hace: duplica la tabla app_state en una tabla nueva con fecha.
-- NO borra ni cambia nada de lo que ya tienes. Es solo una foto de respaldo.
--
-- Cómo usarlo: Supabase -> SQL Editor -> New query -> pega esto -> Run.

create table if not exists public.app_state_backup_20261004 as
  select * from public.app_state;

-- Comprobar cuántas filas (usuarios) se copiaron:
select count(*) as filas_respaldadas from public.app_state_backup_20261004;

-- NOTA: si algún día necesitas restaurar los datos de un usuario desde esta
-- copia, no lo hagas a ciegas: avísame y te doy el comando exacto para tu caso.
-- Cuando ya no necesites la copia, puedes borrarla con:
--   drop table if exists public.app_state_backup_20261004;
