-- =====================================================================
-- AVISO DE SOLICITUD POR EMAIL (alternativa al Database Webhook por UI)
-- Crea un disparador que llama a tu Edge Function al insertarse una
-- solicitud de acceso. Equivale al webhook, pero montado con SQL.
--
-- ANTES DE EJECUTAR:
--   1) Sustituye la URL de abajo por la de TU función
--      (Edge Functions -> tu función -> copia la URL).
--   2) Si cambiaste el HOOK_SECRET, ponlo igual que en los Secrets.
-- =====================================================================

create extension if not exists pg_net;

create or replace function public.notify_signup_webhook()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url     := 'https://TU_REF.functions.supabase.co/notificaciones',   -- <<< CAMBIA ESTA URL
    headers := jsonb_build_object(
                 'Content-Type', 'application/json',
                 'x-hook-secret', 'kz7Q2f9XpR4mL8vB1tN6sW3dH0yU5aZ'      -- mismo valor que el secret HOOK_SECRET
               ),
    body    := jsonb_build_object('record', to_jsonb(NEW))
  );
  return NEW;
end;
$$;

drop trigger if exists trg_notify_signup on public.signup_requests;
create trigger trg_notify_signup
  after insert on public.signup_requests
  for each row execute function public.notify_signup_webhook();
