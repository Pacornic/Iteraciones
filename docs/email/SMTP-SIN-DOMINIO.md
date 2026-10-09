# Correos personalizados SIN dominio (SMTP con verificación de un solo remitente)

Supabase ya no deja editar el asunto/cuerpo de los correos ni cambiar el remitente **mientras uses su correo compartido**: pide **SMTP propio**. Para tenerlo sin comprar dominio, usamos un proveedor que permita **verificar una sola dirección de correo** (en vez de un dominio). Aquí con **Brevo** (gratis, ~300 correos/día). Alternativas equivalentes: Mailjet, SMTP2GO.

## 1. Crear cuenta y verificar tu remitente en Brevo
1. Crea cuenta gratis en https://www.brevo.com.
2. **Senders, Domains & Dedicated IPs → Senders → Add a sender**: pon tu nombre ("Kaizen") y tu **correo** (p. ej. tu Gmail). Brevo te manda un correo de verificación: ábrelo y confirma.

## 2. Obtener las credenciales SMTP
En Brevo → **SMTP & API → SMTP**:
- **Server/Host**: `smtp-relay.brevo.com`
- **Port**: `587`
- **Login**: el correo de tu cuenta Brevo
- **Password**: genera una **SMTP key** (botón "Generate a new SMTP key") y cópiala.

## 3. Activar SMTP propio en Supabase
Supabase → **Authentication → (Emails / Settings) → SMTP Settings** → activa **Enable Custom SMTP** y rellena:
- **Sender name**: `Kaizen`
- **Sender email**: el correo que verificaste en Brevo
- **Host**: `smtp-relay.brevo.com`  ·  **Port**: `587`
- **Username**: tu login de Brevo  ·  **Password**: la SMTP key
Guarda.

## 4. Ahora sí: editar las plantillas
Supabase → **Authentication → Email Templates**. Ya te deja editar **Subject** y **Body**. Sugerencias de asunto:
- **Invite user**: `Te damos acceso a Kaizen`
- **Reset Password**: `Restablece tu contraseña de Kaizen`
- **Confirm signup**: `Confirma tu cuenta de Kaizen`

(En `email-personalizacion/GUIA.md` tienes una plantilla de cuerpo HTML de ejemplo para la invitación.)

## Aviso de entregabilidad
Enviar con un **"From" de Gmail** a través de un tercero puede hacer que algún correo caiga en **spam** (por las reglas DMARC de Gmail). Para un uso pequeño suele funcionar; si quieres máxima fiabilidad y que ponga tu marca, lo ideal a futuro es un **dominio propio** verificado (en Brevo o Resend). Mientras tanto, pide a los usuarios que miren spam la primera vez.
