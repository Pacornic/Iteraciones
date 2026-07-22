// Configuración de Supabase (opcional).
// Si dejas esto vacío, la app funciona igual guardando en el navegador (localStorage).
// Para activar la nube, rellena url y anonKey con los de tu proyecto Supabase
// (Supabase → Project Settings → Data API / API Keys). La anon key es pública por diseño:
// la seguridad la dan las políticas RLS de supabase-schema.sql.
window.SUPABASE_CONFIG = {
url: "",       // p. ej. "https://abcdxyz.supabase.co"
anonKey: ""    // p. ej. "eyJhbGciOi..."
};

window.SUPABASE_CONFIG = {
     url: "https://msukaisuigtvrtcxnepe.supabase.co/rest/v1/",
     anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdWthaXN1aWd0dnJ0Y3huZXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzI5MDIsImV4cCI6MjEwMDMwODkwMn0.jtw6k_1j36aeyLxH5H5n62jJLVIEKnNDqeecZTosiAE"
   };
