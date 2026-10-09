# Kaizen — Manual de usuario

**Kaizen (Iteration Design Manager)** es una aplicación para diseñar juegos de mesa: llevar sus ideas e iteraciones, redactar y versionar el reglamento, guardar un prototipo jugable, mantener una bitácora de notas y preparar las ferias con sus citas con editoriales. Puedes trabajar tú solo o **compartir un juego** con otras personas para iterar en equipo.

---

## 1. Acceso y cuenta

### Solicitar acceso
El registro es por **aprobación**. En la pantalla de acceso pulsa **"¿No tienes cuenta? Solicitar acceso"** y rellena **nombre, apellido, usuario (@) y correo**. Verás el mensaje de que tu solicitud se revisará y, cuando se apruebe, recibirás un correo para validar tu cuenta.

> No se crea ninguna cuenta al solicitar: solo se envía la petición al administrador.

### Entrar
Con la cuenta ya creada y validada, entra con **correo + contraseña**.

### No recuerdo mi contraseña
En la pantalla de acceso pulsa **"¿No recuerdas tu contraseña? restablecer"**, escribe tu correo y recibirás un enlace. Al volver desde ese enlace, la app te pedirá definir una **nueva contraseña**.

### Primer acceso: elegir tu @usuario
La primera vez que entras, la app te pide elegir un **@usuario único** (3–20 caracteres: letras, números o _). Te identifica para compartir proyectos. Lo puedes cambiar luego en Ajustes.

### Saludo e identidad
Bajo la cabecera verás **"Hola, {tu nombre}"**.

### Ajustes (icono ⚙, arriba a la derecha)
Desde Ajustes puedes:
- Cambiar tu **nombre**.
- Cambiar tu **@usuario**.
- Cambiar tu **contraseña**.
- Ver tu **correo** (no editable).

Si eres **administrador**, Ajustes tiene dos pestañas: **Cuenta** (lo anterior) y **Usuarios**, donde ves las cuentas activas con su **último acceso** (la última vez que abrieron la app) y la fecha de alta.

### Buzón (icono ✉, arriba a la derecha)
- **Todos los usuarios**: tus **invitaciones a proyectos** (Aceptar / Rechazar) y los **anuncios** del administrador.
- **Solo el administrador**: el buzón se organiza en dos pestañas:
  - **Solicitudes** — las de acceso **pendientes** (al abrir). Al pulsar **Aprobar**, al solicitante se le **invita automáticamente** y recibe un correo para fijar su contraseña (no hay que crear el usuario a mano).
  - **Anuncios** — cuadro para **publicar anuncios** para todos los usuarios.
- Los **anuncios** llegan al buzón de cada usuario **dentro de la app** (no por email).
- La lista de **usuarios activos** (con su último acceso) ya **no** está en el buzón: se ha movido a **⚙ Ajustes → pestaña Usuarios** (solo admin).
- El icono **se enciende en ámbar** con un número cuando hay algo nuevo sin leer (invitaciones, anuncios o, para el admin, solicitudes). Al abrir el buzón se marca como visto.
- El icono aparece solo si eres administrador o si tienes invitaciones/anuncios pendientes.

> Nota para el administrador: además del buzón, puedes recibir un **email** en el momento en que alguien solicita acceso (ver la documentación técnica, apartado del aviso por email).

### Copias de seguridad (iconos ⤓ / ⤒)
- **⤓ Exportar**: descarga un `.json` con todos tus juegos y ferias.
- **⤒ Importar**: carga un `.json` (reemplaza tus datos actuales).

### Cerrar sesión (icono ⎋)
Cierra la sesión actual.

---

## 2. Inicio (áreas)

Al entrar aterrizas en una **portada** con dos áreas:
- **Diseño** — tus juegos.
- **Ferias** — la preparación de ferias con editoriales.

Pulsa un área para entrar. Vuelves a esta portada con **"← Inicio"** o pulsando el **logo Kaizen**. La estructura está pensada para poder añadir más áreas en el futuro.

---

## 3. Área Diseño (tus juegos)

Los juegos se agrupan en tres zonas, separadas por una línea, y dentro de cada zona se ordenan **por último modificado (lo más reciente arriba)**:

1. **Activos** — tus juegos en marcha (y los que te han compartido).
2. **Draft** — ideas en bruto, sin definir aún. Tiene su propio botón **"＋ Idea en bruto"**.
3. **En pausa** — juegos aparcados.

### Crear
- **＋ Nuevo juego**: crea un juego en la zona **Draft**; cuando esté listo lo pasas a Activos desde su menú ⋯ ("Marcar como activo").
- **＋ Idea en bruto**: también crea un juego en Draft (atajo desde esa zona).

### La tarjeta de cada juego muestra
- La **versión** actual (vN o "Sin versión").
- Cuántas ideas tienes **en curso** y **resueltas**.
- La **última edición**.
- **▶ proto** si tiene prototipo cargado.
- Un **icono de compartido** (abajo a la derecha) si el juego está compartido (ver sección 5).

### Menú ⋯ de un juego propio
- **Renombrar**.
- **Marcar como activo / Mover a Draft / Poner en pausa** (según dónde esté).
- **⇄ Compartir diseño**.
- **Eliminar juego**.

---

## 4. Dentro de un juego

Un juego tiene cuatro pestañas: **Inicio · Bitácora · Reglas · Proto**.

### 4.1 Inicio — ideas e iteraciones
Lista de ideas/cambios del juego, agrupados por estado y con la más reciente arriba.

- **＋ Añadir idea**: crea una idea.
- Al abrir una idea (panel lateral), puedes editar **en línea** su **Nombre**, **Idea**, **Notas** y **"Apunta a"** (apartado del reglamento). Nada se guarda hasta pulsar **Guardar cambios** (abajo). Cierras con **Cerrar**.
- **Estados**: *Por probar*, *OK* (funciona/implementado), *Descartada*, *Testing*. Al pulsarlos se guardan al instante.
- **APP idea**: botón que marca una idea cuyo impacto se prueba en la app. Si está activo, aparece el flujo de app: **⚙ Pendiente de implementar** y botón **Marcar como implementada** (✓).
- **APP solo**: en "Apunta a" puedes elegir "APP solo (no va al reglamento)" — útil para ideas 100% de la app; oculta "Llevar al reglamento". Solo aparece si la idea tiene **APP idea** activado.
- **Llevar al reglamento**: cuando una idea está en OK (y no es "APP solo"), la incorpora a un apartado del borrador de reglas (queda "pendiente de consolidar").
- Orden de botones en la ficha: Marcar como implementada → Llevar al reglamento → Guardar cambios → Eliminar.

### 4.2 Bitácora — muro de notas / conversación
Un muro tipo chat, en **orden cronológico** (lo nuevo abajo), para soltar ideas y pensamientos.

- Escribe en el campo de abajo y pulsa **Publicar**. El campo crece con el texto.
- **Imágenes**: adjúntalas con el botón **+** o **pégalas directamente con Ctrl/Cmd+V** (una captura, por ejemplo). Se comprimen automáticamente.
- Cada post muestra **autor (@usuario)**, fecha y, si es tuyo, **Editar / Eliminar**.
- Toca una imagen para **ampliarla**.
- En juegos **compartidos**, la bitácora es colaborativa: funciona como conversación entre quienes tienen acceso.

### 4.3 Reglas — borrador y versiones
Dos sub-vistas: **Borrador** y **Versiones**.

**Borrador** — el reglamento en 7 apartados fijos:
- Escribe en cada apartado directamente, o pulsa **⤢ Ampliar** para editarlo en un **popup grande** (cómodo en móvil); dentro, **Guardar** cierra y actualiza.
- Si llevaste ideas al reglamento, aparecen como **pendientes de consolidar**.
- Para guardar: **✓ Guardar cambios en vN** (actualiza la versión actual) o **＋ Crear versión vN+1** (congela una nueva).

**Versiones** — historial:
- Abre una versión para **leerla**, **🖨 Imprimir** (genera PDF), **Restaurar al borrador** o **Eliminar**.

### 4.4 Proto — prototipo jugable
- **Subir HTML del juego**: lo juegas embebido en la propia app.
- **⤢ Pantalla completa** (abre en pestaña nueva), **Vista móvil**, **⤓ Descargar** (copia de respaldo del HTML antes de reemplazar), **Reemplazar**, **Quitar**.

---

## 5. Compartir un juego

Permite trabajar un mismo juego entre varios usuarios registrados.

### Compartir
En el menú **⋯** de un juego propio → **⇄ Compartir diseño**. El juego pasa a ser compartido y se abre el panel para invitar.

### Invitar
Escribe el **@usuario** (o el nombre) y elige de la lista. Si no existe, verás "Ese usuario no existe". **Nunca se muestran los correos.** La persona debe estar registrada y haber entrado al menos una vez.

### El icono de compartido (esquina inferior derecha de la tarjeta)
- **Gris**: compartido, aún sin invitar a nadie.
- **Ámbar**: invitación enviada, pendiente de aceptar.
- **Azul**: al menos otro usuario la ha aceptado. Al pasar el ratón, el tooltip muestra **con quién** está compartido.

### Aceptar una invitación
Al invitado le aparece en el **buzón ✉** y en un **banner** dentro de Diseño. Al **Aceptar**, el juego aparece en su dashboard con el icono de compartido. Puede **Rechazar**.

### Quién puede qué
- **Editar** (ideas, reglas, bitácora, proto): el dueño y los invitados.
- **Compartir / invitar / quitar miembros / dejar de compartir / eliminar**: solo el **dueño** (desde el icono de compartido).
- Un invitado puede **Salir del proyecto** (desde el icono de compartido).
- El **⋯** de un juego compartido permite **Renombrar** (lo ven todos).

### Seguimiento de cambios
- En la tarjeta y dentro del juego se muestra **"último cambio por {usuario}"**.
- Si dos personas guardáis a la vez, al segundo se le **avisa** y se recarga la versión más reciente (no se pisan cambios en silencio).

---

## 6. Área Ferias

Prepara cada feria y tus citas con editoriales.

### La portada de Ferias
- **＋ Nueva feria**: nombre, **fechas** (calendario Desde → Hasta) y lugar.
- Se separan en **Próximas ferias** (arriba) y **Ferias pasadas** (abajo).
- Menú **⋯** de una feria: **Editar feria**, **Marcar como pasada / próxima**, **Eliminar feria**.

### Dentro de una feria
Junto al nombre verás las fechas. Dos vistas:

**Por juego** — para ver cómo va cada juego entre editoriales. Cada juego lista las editoriales que lo vieron, con su **estado** y **feedback**, un mini-resumen (p. ej. "1 quiere proto · 1 interesado"), y la fecha/stand/contacto separados por "|". Las editoriales van con color (estable por editorial).

**Agenda** — tus citas ordenadas cronológicamente y **agrupadas por día** ("Miércoles 21 de octubre de 2026"). Cada editorial muestra su color, un **checkbox de realizada**, la meta (fecha | stand | contacto) y los juegos con su estado.

### Crear / editar una cita
**＋ Nueva cita** (en cualquiera de las dos vistas) abre el editor:
- **Editorial** (nombre).
- **Fecha y hora**: calendario + hora y **minutos de 5 en 5**.
- **Lugar / stand** y **persona de contacto**.
- **Juegos que le enseño**: añade juegos de tu catálogo; a cada uno le pones **estado** (*Pendiente · No interesa · Interesado · Quiere proto*) y su **feedback**.
- El **estado** de cada juego se guarda al instante; **Guardar cita** persiste el resto.
- **Checkbox de realizada**: marca que la cita ya ocurrió (se refleja en las dos vistas).

### Aviso de solapes
Al guardar una cita, si su hora **coincide** o queda a **menos de 30 minutos** de otra cita de esa feria, te avisa (puedes guardar igualmente).

---

## 7. Dónde se guardan tus datos

- Tus juegos y ferias se guardan en la nube (tu espacio privado). Cada usuario ve solo lo suyo y lo que le han compartido.
- Haz copias con **⤓ Exportar** de vez en cuando; puedes recuperarlas con **⤒ Importar**.
