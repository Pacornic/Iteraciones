# Documentación de Kaizen

Material de referencia del proyecto. **La web solo necesita `index.html` y `config.js`** (en la raíz del repo); esta carpeta es documentación/respaldo y no la usa la app.

## Manuales
- `MANUAL-USUARIO.md` / `.pdf` — qué puede hacer cada usuario en cada sección.
- `DOCUMENTACION-TECNICA.md` / `.pdf` — arquitectura y montaje (GitHub, Vercel, Supabase), modelo de datos, funciones y seguridad.

## SQL (`sql/`) — orden de ejecución en Supabase (SQL Editor)
1. `supabase-schema.sql` — `app_state` + `signup_requests`.
2. `shared-games-schema.sql` — `profiles` (@usuario), `shared_games`, `game_invites`, función de aceptar.
3. `admins-schema.sql` — `admins` + restringe solicitudes a admins (pon tu correo).
4. `leave-game-fix.sql` — función para salir de un compartido.
5. `announcements-schema.sql` — anuncios del admin.
6. `webhook-trigger.sql` — (opcional) dispara el email al recibir una solicitud (pon tu URL de función).
- `backup-app-state.sql` — copia de seguridad puntual de los datos.

## Funciones Edge (`edge/`) — se despliegan en Supabase → Edge Functions
- `notify-signup/` — email al admin cuando llega una solicitud.
- `approve-signup/` — aprobar con un clic (invita al usuario). Verify JWT off.
- `admin-users/` — lista de usuarios con último acceso (pestaña Usuarios en Ajustes). Verify JWT off.
Cada una incluye su `GUIA.md`.

## Correos (`email/`)
- `GUIA.md` — personalizar remitente (SMTP propio) y plantillas.
- `SMTP-SIN-DOMINIO.md` — cómo tener remitente propio sin comprar dominio (Brevo).
