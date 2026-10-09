// Supabase Edge Function: admin-users
// Devuelve la lista de usuarios (correo, @usuario, nombre, alta y ÚLTIMO
// ACCESO) para el panel de admin. Usa la service_role (solo servidor) y
// solo responde si quien llama es administrador (tabla "admins").
//
// Despliega con "Verify JWT" DESACTIVADO (verifica el token ella misma).
// No requiere secrets nuevos: usa SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.

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

  // Verificar admin
  const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
  const { data: u, error: ue } = await admin.auth.getUser(token);
  const callerEmail = u?.user?.email ?? "";
  if (ue || !callerEmail) return json({ error: "No autenticado" }, 401);
  const { data: adm } = await admin.from("admins").select("email").eq("email", callerEmail).maybeSingle();
  if (!adm) return json({ error: "No autorizado (no eres admin)" }, 403);

  // Perfiles (para @usuario y nombre)
  const { data: profs } = await admin.from("profiles").select("user_id, username, name, updated_at");
  const byId: Record<string, any> = {};
  (profs ?? []).forEach((p: any) => { byId[p.user_id] = p; });

  // Usuarios de Auth (incluye last_sign_in_at)
  const out: any[] = [];
  let page = 1;
  // paginación simple (hasta 10 páginas de 200 = 2000 usuarios)
  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return json({ error: error.message }, 500);
    const users = data?.users ?? [];
    for (const usr of users) {
      const p = byId[usr.id] ?? {};
      const meta: any = usr.user_metadata ?? {};
      out.push({
        id: usr.id,
        email: usr.email,
        username: p.username ?? "",
        name: p.name ?? meta.full_name ?? meta.nombre ?? "",
        created_at: usr.created_at,
        last_sign_in_at: usr.last_sign_in_at,
        last_seen: p.updated_at ?? null,
      });
    }
    if (users.length < 200) break;
    page++;
  }

  return json({ users: out });
});
