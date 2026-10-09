// Supabase Edge Function: notify-signup
// Envía un email al administrador cuando entra una nueva solicitud de acceso.
// Se dispara desde un Database Webhook (INSERT en public.signup_requests).
//
// Variables de entorno (Secrets) necesarias:
//   RESEND_API_KEY  -> clave de API de Resend
//   ADMIN_EMAIL     -> correo donde quieres recibir el aviso
//   MAIL_FROM       -> (opcional) remitente; por defecto "Kaizen <onboarding@resend.dev>"
//   HOOK_SECRET     -> (opcional) un texto secreto; si lo pones, el webhook debe
//                      enviar la cabecera "x-hook-secret" con el mismo valor.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "";
const FROM = Deno.env.get("MAIL_FROM") ?? "Kaizen <onboarding@resend.dev>";
const HOOK_SECRET = Deno.env.get("HOOK_SECRET") ?? "";

function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  if (HOOK_SECRET) {
    const got = req.headers.get("x-hook-secret") ?? "";
    if (got !== HOOK_SECRET) return new Response("Unauthorized", { status: 401 });
  }

  let body: any = {};
  try { body = await req.json(); } catch (_) { /* ignore */ }
  const r = body?.record ?? body ?? {};

  const nombre = r.nombre ?? "";
  const apellido = r.apellido ?? "";
  const email = r.email ?? "";
  const username = r.username ?? "";

  const html = `
    <h2>Nueva solicitud de acceso a Kaizen</h2>
    <p><b>Nombre:</b> ${esc(nombre)} ${esc(apellido)}</p>
    <p><b>Usuario:</b> @${esc(username)}</p>
    <p><b>Correo:</b> ${esc(email)}</p>
    <p>Entra en la app y apruébala desde el buzón (✉).</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [ADMIN_EMAIL],
      subject: `Kaizen · nueva solicitud de ${nombre || email || "acceso"}`,
      html,
    }),
  });

  const txt = await res.text();
  return new Response(txt, {
    status: res.ok ? 200 : 500,
    headers: { "Content-Type": "application/json" },
  });
});
