# Aprobar usuarios con un clic desde la app (Edge Function `approve-signup`)

Con esto, al pulsar **Aprobar** en el buzón del admin, la app **crea/invita al usuario y le envía el correo** automáticamente — sin ir a Supabase a "Invite user".

Cómo funciona: la app llama a una Edge Function que usa la **service_role** (secreta, solo en el servidor). La función comprueba que quien llama es un **admin** (su correo está en la tabla `admins`) y entonces invita al usuario con la API de administración de Supabase.

## Montaje
1. **Crea la Edge Function** en Supabase → Edge Functions → nueva función, nombre exacto **`approve-signup`**, y pega `edge-approve-signup/index.ts`.
2. **Despliega con "Verify JWT" DESACTIVADO**. (La función verifica el token por sí misma, y así el preflight CORS del navegador funciona.)
3. **Secrets**: no hace falta crear ninguno nuevo. La función usa los *Default secrets* que Supabase ya provee: `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
4. Requisitos previos ya montados: la tabla **`admins`** (admins-schema.sql) con tu correo, y la **Site URL** de Authentication apuntando a tu dominio (para que el enlace del correo lleve a Kaizen).

## Comportamiento
- **Aprobar** → se invita al correo (recibe un enlace para fijar su contraseña) y la solicitud queda marcada como *Aprobada*.
- Si ese correo **ya tenía cuenta**, en vez de invitar se le envía un **enlace para restablecer la contraseña** (la app te lo indica).
- El **@usuario** que pidió al registrarse se guarda en sus metadatos; al entrar por primera vez, la app se lo pre-rellena en "Elige tu usuario" (puede cambiarlo).

## Probar
En el buzón (como admin), pulsa **Aprobar** en una solicitud. Debe llegarle el correo de invitación a esa persona. Si falla, mira **Edge Functions → approve-signup → Logs** (403 = tu correo no está en `admins`; otros errores muestran el mensaje de Supabase/Auth).

> No sustituye nada de seguridad: solo un admin puede aprobar, y la clave service_role nunca sale del servidor.
