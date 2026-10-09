# Personalizar los correos de Supabase (remitente y texto)

Por defecto los correos de acceso (invitación, restablecer contraseña…) llegan de **"Supabase Auth"** porque usan el correo compartido de Supabase. Para que lleguen como **Kaizen** hay dos cosas independientes:

- **Remitente (de "Supabase Auth" a "Kaizen")** → requiere configurar un **SMTP propio**.
- **Texto/diseño del correo** → se edita en las **plantillas de email** (esto se puede hacer aunque no cambies el remitente).

---

## A) Cambiar el remitente con SMTP propio (usando Resend)

Ya usas Resend para los avisos, así que lo aprovechamos.

### 1. Verifica tu dominio en Resend
Resend → **Domains → Add Domain** → añade tu dominio (p. ej. `tudominio.com`) y los registros DNS que te indique. Sin dominio verificado no puedes usar un remitente propio por SMTP (el `onboarding@resend.dev` no sirve para esto).

### 2. Credenciales SMTP de Resend
- Host: `smtp.resend.com`
- Puerto: `465` (SSL) o `587` (TLS)
- Usuario: `resend`
- Contraseña: tu **API Key** de Resend (`re_...`)

### 3. Activar SMTP propio en Supabase
Supabase → **Authentication → (Settings / Emails) → SMTP Settings** → activa **"Enable Custom SMTP"** y rellena:
- **Sender name**: `Kaizen`
- **Sender email**: una dirección de tu dominio verificado, p. ej. `no-reply@tudominio.com`
- **Host / Port / Username / Password**: los de Resend del punto 2.

Guarda. A partir de ahí, los correos de acceso saldrán como **Kaizen \<no-reply@tudominio.com\>**.

> Nota: el límite de envío pasa a ser el de tu cuenta Resend (más alto y fiable que el compartido de Supabase).

---

## B) Personalizar el texto de los correos

Supabase → **Authentication → Email Templates**. Edita las plantillas que uses (sobre todo **Invite user** y **Reset Password**): puedes cambiar el **asunto** y el **HTML**.

Variables útiles disponibles en las plantillas:
- `{{ .ConfirmationURL }}` — el enlace de acción (fijar contraseña / validar).
- `{{ .SiteURL }}` — la URL de tu app.
- `{{ .Email }}` — el correo del destinatario.
- `{{ .Data.full_name }}` — nombre (de los metadatos del usuario).

### Ejemplo para "Invite user"
**Asunto:** `Te damos acceso a Kaizen`

**Cuerpo (HTML):**
```html
<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
  <h2 style="margin:0 0 8px">Bienvenido a Kaizen</h2>
  <p>Hola{{ if .Data.full_name }} {{ .Data.full_name }}{{ end }}, tu acceso a <b>Kaizen — Iteration Design Manager</b> está listo.</p>
  <p>Pulsa el botón para fijar tu contraseña y entrar:</p>
  <p style="margin:20px 0">
    <a href="{{ .ConfirmationURL }}" style="background:#e8a33d;color:#2a1c06;text-decoration:none;padding:11px 18px;border-radius:8px;font-weight:bold">Activar mi cuenta</a>
  </p>
  <p style="font-size:12px;color:#666">Si el botón no funciona, copia este enlace: <br>{{ .ConfirmationURL }}</p>
</div>
```

Puedes hacer lo mismo con **Reset Password** (cambia el texto a "Restablecer tu contraseña de Kaizen").

---

## Resumen
- Solo con **plantillas** cambias el texto, pero el remitente sigue siendo "Supabase Auth".
- Con **SMTP propio (Resend + dominio verificado)** el remitente pasa a ser **Kaizen**.
- Lo ideal: hacer las dos cosas.
