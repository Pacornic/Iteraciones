// Supabase Edge Function: approve-signup
// El administrador, desde el buzón de la app, aprueba una solicitud y esta
// función CREA/INVITA al usuario y le envía el correo automáticamente.
//
// Seguridad: usa la service_role (solo en el servidor). Verifica que quien
// llama es un administrador (su correo está en la tabla "admins") antes de
// hacer nada. Despliega esta función con "Verify JWT" DESACTIVADO
// (verificamos el token nosotros mismos, y así el preflight CORS funciona).
//
// Secrets: usa los "Default secrets" que Supabase ya provee
//   SUPABASE_URL  y  SUPABASE_SERVICE_ROLE_KEY  (no hay que crearlos).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(o: unknown, status = 200) {
  return new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  // 1) Verificar que quien llama es un administrador
  const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
  const { data: u, error: ue } = await admin.auth.getUser(token);
  const callerEmail = u?.user?.email ?? "";
  if (ue || !callerEmail) return json({ error: "No autenticado" }, 401);
  const { data: adm } = await admin.from("admins").select("email").eq("email", callerEmail).maybeSingle();
  if (!adm) return json({ error: "No autorizado (no eres admin)" }, 403);

  // 2) Datos de la solicitud
  let body: any = {};
  try { body = await req.json(); } catch (_) { /* ignore */ }
  const email = String(body.email ?? "").trim();
  if (!email) return json({ error: "Falta el correo" }, 400);
  const meta = {
    nombre: body.nombre ?? "",
    apellido: body.apellido ?? "",
    full_name: `${body.nombre ?? ""} ${body.apellido ?? ""}`.trim(),
    requested_username: body.username ?? "",
  };

  // 3) Invitar al usuario (envía el correo para fijar contraseña)
  const { error: ie } = await admin.auth.admin.inviteUserByEmail(email, { data: meta });

  if (ie) {
    const msg = (ie.message ?? "").toLowerCase();
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      // Ya existía: enviarle un enlace para restablecer contraseña
      await admin.auth.resetPasswordForEmail(email);
      if (body.id) await admin.from("signup_requests").update({ status: "approved" }).eq("id", body.id);
      return json({ ok: true, note: "existing" });
    }
    return json({ error: ie.message }, 500);
  }

  // 4) Marcar la solicitud como aprobada
  if (body.id) await admin.from("signup_requests").update({ status: "approved" }).eq("id", body.id);
  return json({ ok: true });
});
