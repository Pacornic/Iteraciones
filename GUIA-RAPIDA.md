# Guía rápida — montar la Bitácora online (camino más práctico)

Objetivo: tener la app en una web pública, con tus datos en la nube y sincronizados, **sin usar la terminal**. Tiempo total: ~25-30 min. Todo con cuentas gratuitas.

Vas a usar tres servicios, cada uno con su papel:
- **GitHub** → guarda el código (y permite que Vercel se actualice solo).
- **Vercel** → publica la web y te da la URL. Se redespliega solo con cada cambio y genera previews.
- **Supabase** → guarda tus datos en la nube con login por correo.

Sigue los pasos EN ESTE ORDEN (cada uno necesita algo del anterior).

---

## Paso 1 · Subir el código a GitHub (5 min)

1. Crea una cuenta en https://github.com si no la tienes.
2. Arriba a la derecha: **+ → New repository**.
3. Nombre: `bitacora-iteraciones`. Visibilidad: **Public**. Pulsa **Create repository**.
4. En la página del repo vacío, pulsa **uploading an existing file** (o **Add file → Upload files**).
5. Arrastra los archivos de la carpeta `iteraciones-app`: `index.html`, `config.js`, `supabase-schema.sql`, `.gitignore`, `README.md`, `GUIA-RAPIDA.md`.
6. Abajo, pulsa **Commit changes**.

Ya tienes el código en GitHub. (Todavía no funciona la nube; eso es el Paso 3.)

---

## Paso 2 · Publicar en Vercel (5 min)

1. Entra en https://vercel.com y regístrate con **Continue with GitHub** (así se conectan solos).
2. Pulsa **Add New… → Project**.
3. En *Import Git Repository*, busca `bitacora-iteraciones` y pulsa **Import**.
4. No cambies nada (Framework Preset = *Other*; es un sitio estático). Pulsa **Deploy**.
5. Espera ~1 min. Te dará una URL tipo `https://bitacora-iteraciones.vercel.app`. **Cópiala**, la necesitas en el Paso 3.

Con esto la app ya está online (guardando en el navegador). Cada vez que cambies algo en GitHub, Vercel se actualiza solo.

---

## Paso 3 · Crear la base de datos en Supabase (10 min)

1. Crea una cuenta en https://supabase.com (puedes entrar con GitHub).
2. **New project** → ponle nombre y una contraseña de base de datos (guárdala en algún sitio) → **Create new project**. Espera a que termine de crearse (~1-2 min).
3. **Crear la tabla y la seguridad**: menú lateral **SQL Editor → New query**. Abre `supabase-schema.sql`, copia TODO su contenido, pégalo y pulsa **Run**. Debe decir *Success*.
4. **Activar el login por correo**: menú **Authentication → Sign in / Providers**. Asegúrate de que **Email** está habilitado (el enlace mágico viene activo por defecto).
5. **Decir a Supabase cuál es tu web**: menú **Authentication → URL Configuration**.
   - En **Site URL** pon tu URL de Vercel (la del Paso 2).
   - En **Redirect URLs** añade esa misma URL. Guarda.
6. **Copiar tus claves**: menú **Project Settings → API**. Apunta dos cosas:
   - **Project URL** (algo como `https://xxxx.supabase.co`).
   - **anon public** key (una cadena larga que empieza por `eyJ...`).

---

## Paso 4 · Conectar la app con Supabase (3 min)

1. Vuelve a tu repo en GitHub y abre el archivo **`config.js`**.
2. Pulsa el lápiz (**Edit**) y rellena con tus dos valores del Paso 3:
   ```js
   window.SUPABASE_CONFIG = {
     url: "https://xxxx.supabase.co",
     anonKey: "eyJ...."
   };
   ```
3. **Commit changes**. Vercel detecta el cambio y redespliega solo en ~1 min.
4. Abre tu URL de Vercel: ahora te pedirá el **correo**, te enviará un **enlace de acceso**, y al volver tus datos se guardarán en la nube. ✅

---

## Paso 5 · Llevar tus datos actuales a la nube (2 min)

1. Abre la versión donde ya tienes tus juegos (la de aquí) y pulsa **Exportar (⤓)** arriba a la derecha: baja un `.json`.
2. Abre tu web de Vercel ya logueado y pulsa **Importar (⤒)**, elige ese `.json` y confirma.

Ojo: importar **reemplaza** todo lo que haya en esa cuenta, así que hazlo la primera vez, sobre la cuenta vacía.

---

## Checklist final
- [ ] Repo en GitHub con los archivos subidos.
- [ ] Proyecto en Vercel desplegado y con URL.
- [ ] `supabase-schema.sql` ejecutado (Success).
- [ ] Email activado y URL de Vercel en *URL Configuration*.
- [ ] `config.js` con `url` y `anonKey` reales, commiteado.
- [ ] Entras con tu correo y ves/guardas datos.
- [ ] Datos migrados con Exportar/Importar.

## Si algo falla
- **No pide login / dice localStorage**: `config.js` está vacío o mal → revisa `url` y `anonKey`.
- **El enlace del correo no entra / error de redirect**: la URL de Vercel no está en *Redirect URLs* de Supabase (Paso 3.5). Deben coincidir exactamente (con la barra final).
- **"permission denied" o no guarda**: no se ejecutó `supabase-schema.sql` o falló el RLS → repite el Paso 3.3.
- Los nombres exactos de algún menú pueden variar un poco entre versiones; búscalos por su función.

> ¿Prefieres GitHub Pages en vez de Vercel? También vale (mira el README). Vercel se recomienda por los *previews* por cambio y el redespliegue automático.
