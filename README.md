# Bitácora de Iteraciones

App de una sola página (HTML/CSS/JS, sin build) para diseñar juegos de mesa: versiones del reglamento, problemas con soluciones a probar, y seguimiento de editoriales.

Funciona en tres modos de guardado y se autodetecta:

1. **localStorage** (por defecto): al abrir `index.html` sin más, los datos se guardan en ese navegador.
2. **Supabase** (nube): si rellenas `config.js`, pide login por correo y sincroniza tus datos entre dispositivos.
3. **Cowork**: si se ejecuta dentro de Claude/Cowork, usa su almacenamiento.

Arriba a la derecha tienes **Exportar (⤓)** e **Importar (⤒)** para respaldar o migrar tus datos como `.json`.

> **¿Solo quieres el camino más práctico paso a paso?** Mira **`GUIA-RAPIDA.md`** (GitHub + Vercel + Supabase, sin terminal). Este README es la referencia completa con todas las opciones.

---

## Probarla en local (sin nada más)

Abre `index.html` en tu navegador. Ya funciona (guarda en ese navegador). Nota: si la abres con doble clic en algunos navegadores, Supabase no cargará por CORS; para desarrollo con Supabase usa un servidor local, p. ej. `python3 -m http.server` y entra en `http://localhost:8000`.

---

## Parte A — Publicar en GitHub Pages

Necesitas una cuenta en https://github.com (gratis).

### Opción 1: por la web (sin comandos)

1. En GitHub, arriba a la derecha: **+ → New repository**. Nombre p. ej. `bitacora-iteraciones`. Marca **Public**. Crea el repo.
2. En el repo: **Add file → Upload files**. Arrastra el contenido de esta carpeta (`index.html`, `config.js`, `supabase-schema.sql`, `.gitignore`, `README.md`). **Commit changes**.
3. **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`. **Save**.
4. Espera 1–2 min y recarga: aparecerá la URL pública, del tipo `https://TU-USUARIO.github.io/bitacora-iteraciones/`.

### Opción 2: por línea de comandos (Git)

```bash
cd ruta/a/iteraciones-app
git init
git add .
git commit -m "Bitácora de iteraciones: primera versión"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/bitacora-iteraciones.git
git push -u origin main
```

Luego activa Pages como en el paso 3 de la Opción 1.

> Ya con esto tienes la app online guardando en localStorage. La Parte B añade la nube.

---

## Parte B — Añadir Supabase (nube + login)

Necesitas una cuenta en https://supabase.com (gratis).

1. **Crea un proyecto**: New project → nombre y contraseña de base de datos (guárdala) → Create. Espera a que termine.
2. **Crea la tabla y las reglas de seguridad**: menú **SQL Editor → New query**, pega TODO el contenido de `supabase-schema.sql` y pulsa **Run**. Debe decir *Success*.
3. **Configura el login por correo**: **Authentication → Sign In / Providers → Email**. Deja **Email** habilitado (magic link viene activado por defecto). En **Authentication → URL Configuration**, en *Site URL* y *Redirect URLs* añade la URL de tu GitHub Pages (p. ej. `https://TU-USUARIO.github.io/bitacora-iteraciones/`). Guarda.
4. **Copia tus claves**: **Project Settings → API** (o *Data API*). Copia el **Project URL** y la **anon public key**.
5. **Rellena `config.js`** con esos dos valores:
   ```js
   window.SUPABASE_CONFIG = {
     url: "https://TUPROYECTO.supabase.co",
     anonKey: "eyJhbGciOi...."
   };
   ```
6. Sube el `config.js` actualizado a GitHub (Upload files y commit, o `git add config.js && git commit -m "config supabase" && git push`).
7. Entra a tu URL de Pages: ahora pedirá tu correo, te enviará un **enlace de acceso**, y al volver tus datos se guardarán en Supabase.

### Migrar tus datos actuales a la nube
En la versión donde ya tienes datos (Cowork o localStorage), pulsa **Exportar (⤓)** para bajar el `.json`. Entra en la versión con Supabase (ya logueado) y pulsa **Importar (⤒)** para cargarlo. Reemplaza el contenido, así que hazlo sobre una cuenta nueva/vacía.

---

## Notas de seguridad
- La **anon key** de Supabase es pública por diseño (va en el cliente); por eso `config.js` se sube al repo sin problema. Lo que protege tus datos son las políticas **RLS** de `supabase-schema.sql`: cada usuario solo puede ver/editar su propia fila.
- No pongas nunca en `config.js` la *service_role key* (esa sí es secreta).
- Como GitHub Pages es público, **sin Supabase + login** cualquiera con la URL vería/editaría los datos de localStorage de su propio navegador (no los tuyos) — pero no habría sincronización ni copia central. El login de Supabase es lo que hace tus datos privados y compartidos entre tus dispositivos.
