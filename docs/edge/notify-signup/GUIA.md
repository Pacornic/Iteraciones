# Aviso por email al recibir una solicitud de acceso (Edge Function + Resend)

Objetivo: cuando alguien pulsa "Solicitar acceso", te llega un email al instante para que la apruebes. No necesitas servidor propio: una pequeña función en Supabase envía el correo a través de **Resend**.

Piezas: **Resend** (envía el correo) + **Edge Function** de Supabase (`notify-signup`) + **Database Webhook** (la dispara al insertarse una solicitud).

---

## 1. Resend (proveedor de correo)
1. Crea una cuenta gratuita en https://resend.com.
2. Ve a **API Keys** y crea una clave. Guárdala (empieza por `re_...`).
3. Remitente:
   - Para empezar/probar, puedes enviar desde `onboarding@resend.dev` (remitente de prueba de Resend) **siempre que el destinatario sea tu propio correo**.
   - Para un remitente propio (p. ej. `avisos@tudominio.com`), verifica tu dominio en Resend → **Domains**.

## 2. Edge Function en Supabase
Tienes dos formas; usa la que te sea cómoda.

### Opción A — Panel de Supabase (sin CLI)
1. Supabase → **Edge Functions** → **Create a new function** → nombre: `notify-signup`.
2. Pega el contenido de `index.ts` (está en esta misma carpeta) y **Deploy**.
3. En **Edge Functions → (notify-signup) → Settings**, marca que **no requiere JWT** (o "Verify JWT" = off), porque el webhook no manda sesión de usuario; la protección la damos con `HOOK_SECRET`.

### Opción B — CLI de Supabase
```bash
# instala la CLI: https://supabase.com/docs/guides/cli
supabase login
supabase link --project-ref TU_PROJECT_REF
supabase functions new notify-signup        # crea la carpeta
# copia el index.ts de esta carpeta dentro de supabase/functions/notify-signup/
supabase functions deploy notify-signup --no-verify-jwt
```

## 3. Secrets (variables de entorno de la función)
En Supabase → **Edge Functions → Secrets** (o `supabase secrets set`), define:
- `RESEND_API_KEY` = tu clave de Resend.
- `ADMIN_EMAIL` = el correo donde quieres recibir el aviso.
- `MAIL_FROM` = (opcional) `Kaizen <onboarding@resend.dev>` o tu remitente verificado.
- `HOOK_SECRET` = inventa un texto largo y aleatorio (lo usarás en el webhook).

Por CLI sería, por ejemplo:
```bash
supabase secrets set RESEND_API_KEY=re_xxx ADMIN_EMAIL=tucorreo@ejemplo.com HOOK_SECRET=una-cadena-larga-aleatoria
```

## 4. Database Webhook (lo que dispara la función)
1. Supabase → **Database → Webhooks** → **Create a new hook**.
2. **Table**: `public.signup_requests`. **Events**: `INSERT`.
3. **Type**: HTTP Request, **Method**: `POST`.
4. **URL**: la de tu función, del tipo
   `https://TU_PROJECT_REF.functions.supabase.co/notify-signup`
   (la ves en Edge Functions).
5. **HTTP Headers**: añade una cabecera
   `x-hook-secret: <el mismo valor que pusiste en HOOK_SECRET>`.
6. Guarda.

## 5. Probar
Desde la app, envía una **solicitud de acceso** de prueba. Deberías recibir el email en `ADMIN_EMAIL` en unos segundos.

---

## Notas y resolución de problemas
- Si no llega: revisa **Edge Functions → Logs** (verás si la función se ejecutó y la respuesta de Resend) y **Database → Webhooks → (tu hook) → Logs**.
- Error 401 en los logs de la función: el `x-hook-secret` del webhook no coincide con `HOOK_SECRET`.
- Resend devuelve error de remitente: usa `onboarding@resend.dev` enviándote a ti mismo, o verifica tu dominio.
- Esto **no cambia** el flujo de aprobación: sigues aprobando desde el buzón y creando el usuario en Supabase. Solo añade el aviso por correo.
