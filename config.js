// Configuración de Supabase (opcional).
// Si dejas esto vacío, la app funciona igual guardando en el navegador (localStorage).
// Para activar la nube, rellena url y anonKey con los de tu proyecto Supabase
// (Supabase → Project Settings → Data API / API Keys). La anon key es pública por diseño:
// la seguridad la dan las políticas RLS de supabase-schema.sql.
window.SUPABASE_CONFIG = {
  url: "",       // p. ej. "https://abcdxyz.supabase.co"
  anonKey: ""    // p. ej. "eyJhbGciOi..."
};
