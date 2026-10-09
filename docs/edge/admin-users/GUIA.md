# Panel de usuarios activos (Edge Function `admin-users`)

Muestra en el buzón del admin, pestaña **Usuarios**, la lista de cuentas con su **último acceso**. Esos datos (`last_sign_in_at`) están en `auth.users`, que solo se lee con la clave de servidor; por eso va en una Edge Function.

## Montaje
1. Supabase → **Edge Functions** → nueva función, nombre exacto **`admin-users`**, pega `edge-admin-users/index.ts`.
2. Despliega con **"Verify JWT" DESACTIVADO** (verifica el token ella misma; así el preflight CORS funciona).
3. **No requiere secrets nuevos**: usa los *Default secrets* `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
4. Requiere la tabla **`admins`** con tu correo (ya creada).

## Qué devuelve
Por cada usuario: correo, **@usuario** y nombre (desde `profiles`), fecha de **alta** (`created_at`), `last_sign_in_at` y `last_seen` (= `profiles.updated_at`). En la app, **"último acceso" = `last_seen`** (la última vez que abrió la app, que se actualiza en cada arranque), con respaldo a `last_sign_in_at`. Se ordenan por ese valor (lo más reciente arriba).

> Nota: `last_sign_in_at` solo cambia en un inicio de sesión real; por eso se prefiere `profiles.updated_at` para reflejar el uso real de la app.

## Probar
Abre el buzón como admin → pestaña **Usuarios**. Si da error 403, tu correo no está en `admins`. Otros errores salen con el mensaje de Supabase (mira **Edge Functions → admin-users → Logs**).
