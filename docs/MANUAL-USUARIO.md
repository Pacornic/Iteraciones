# Kaizen — Manual de usuario

Qué puedes hacer en cada apartado. Última actualización: octubre 2026.

## Acceso

Entras con tu correo y contraseña (cuenta en la nube, Supabase). Si tu cuenta necesita aprobación, un administrador la autoriza. Sin cuenta, la app funciona en modo local en ese navegador (sin nube ni compartir). Si olvidaste la contraseña, usa "No recuerdo mi contraseña".

## Inicio (dashboard)

La pantalla principal reúne todo de un vistazo:

- **De un vistazo:** juegos activos, ideas por probar y la feria en curso o próxima ("hoy / en N días"; "Sin ferias próximas" si no hay).
- **Idea rápida:** escribe una idea y elige a qué juego va (o "Draft (nuevo)" para crear un juego en borrador). Se guarda como idea "Por probar".
- **Tarea rápida:** escribe una tarea y elige el juego (solo activos) o **General** (tarea sin juego, solo visible en Inicio). Botón Guardar.
- **Tus áreas:** tres accesos — **Diseño** (bombilla), **Ferias** y **Editoriales**.
- **Tareas pendientes:** todas tus tareas sin terminar agrupadas por juego (y las de General), con ✓ para completarlas, ✕ para borrarlas y un selector para **moverlas** a otro juego o a General.
- **Ideas pendientes:** las ideas en Testing/Por probar de tus juegos **activos**; pulsa para ir al juego.
- **Actividad en compartidos:** últimos cambios de otras personas en juegos compartidos.
- **Seguir donde lo dejaste:** accesos rápidos a los juegos recientes.

Desliza hacia abajo (pull-to-refresh) en el móvil para recargar.

## Diseño (lista de juegos)

- Muestra tus juegos **Activos** (mezclados con los compartidos, ordenados por recientes), **Draft** y **En pausa**.
- **＋ Nuevo juego** crea uno (empieza en Draft; luego lo pasas a activo).
- El menú **⋯** de cada tarjeta: Renombrar, mover a Activo/Draft/Pausa, **Compartir** y Eliminar.
- Los juegos compartidos muestran el icono ⇄ (con quién) y su menú para gestionar o salir.

## Dentro de un juego

Pestañas: **Ideas · Tareas · Board · Reglas · Proto**.

### Ideas
- **＋ Añadir idea**. Cada idea tiene estado: **Por probar**, **Testing**, **OK** o **Descartada** (acento de color a la izquierda para identificarlas). Se ordenan con las más tocadas recientemente arriba (Testing y Por probar juntas).
- Al abrir una idea: nombre, estado, **APP idea** (si afecta a una versión digital), idea, notas y apartado del reglamento al que apunta.
- **Llevar al reglamento:** si una idea funciona, la vuelcas al borrador del reglamento. Si ya está, el botón se deshabilita ("Ya está en el reglamento") y, si la editas, se reactiva como "Actualizar reglamento".
- Botón **Editoriales** para ir al seguimiento con editoriales de este juego.

### Tareas
- Lista de pendientes del juego; añade con Enter o el botón, marca ✓, borra ✕, o **mueve** la tarea a otro juego/General. Las más recientes arriba; las hechas abajo.

### Board
- Notas con texto e **imágenes** (adjuntar o pegar) y **dibujo a mano** (✎): abre un lienzo grande para dibujar con el dedo/ratón, con colores, Deshacer (↶) y Limpiar; el dibujo se adjunta a la nota. Botón **Guardar** además del Enter.

### Reglas
- Reglamento por secciones, con **versiones**: guardas versiones del borrador y consultas el histórico.

### Proto
- Sube un **prototipo jugable en HTML**; se ve embebido, con pantalla completa y descarga.

## Ferias

- **＋ Nueva feria** con nombre, fechas y lugar. En el menú ⋯: editar, marcar como pasada, eliminar.
- Dentro de una feria, dos vistas: **Agenda** (por fecha) y **Por juego**.
- **＋ Nueva cita:** editorial, fecha/hora, lugar, persona de contacto y los **juegos que enseñas**. Al guardar, el panel se cierra.
- Cada juego en la cita tiene un **estado**: Pendiente, **Proto dejado**, **Interesado** o Descartado.
  - Con **Interesado** o **Proto dejado** aparece el bloque **Pendiente** (seguimiento) con casillas: Enviar proto/PNP/reglas/vídeo/SellSheet y **Agendar TTS**. Lo que marques crea **tareas automáticas** en ese juego, p. ej. "Enviar PNP + Reglas a {Editorial}" y "Agendar TTS a {Editorial}". (En Proto dejado no sale "Enviar proto".)
  - Marcar Interesado/Proto dejado/Descartado crea automáticamente el **seguimiento** en Editoriales, tomando la primera línea del log del feedback de la cita.
- Al **marcar una cita como hecha** pasa a la sección **Completadas** (abajo). En "Por juego", las reuniones se ordenan por estado.

## Editoriales (Tracking)

Seguimiento de cada juego con las editoriales interesadas, hasta que se firme o se descarte. Dos pestañas:

- **Activos:** por cada juego, un mini-tablero **Kanban** con tres columnas — **Interesado · Proto dejado · En Testing** — y las editoriales como tarjetas. En la cabecera del juego, **✕ N descartada(s)** te lleva a los descartados de ese juego.
- **Descartados:** lista por juego de las editoriales que descartaron, con el **último feedback** registrado (que puede ser el de la feria). Pulsa para ver el log completo.

Al pulsar una editorial entras a su **ficha (página de log)**:
- Nombre de la editorial y **estado** (Interesado, Proto dejado, En Testing, Firmado, Descartado).
- **Historial de iteraciones** en tabla (Fecha · Quién · Comentario), lo más reciente arriba. Cada línea se marca como **Yo → editorial**, **Editorial → yo** o **Nota**; puedes cambiar la dirección pulsando la etiqueta.
- **Añadir iteración:** escribe un comentario, elige la dirección y "Añadir al log".
- Botón **Ideas del juego →** para saltar a las ideas de ese juego.
- **＋ Nuevo seguimiento** (desde la lista) para crear una relación juego↔editorial a mano si el contacto no vino de una feria.

## Compartir juegos

Desde el menú ⋯ de un juego → **Compartir**: invitas por @usuario. Los invitados lo ven y editan; los cambios se sincronizan y, ante conflicto simultáneo, se conserva la versión más reciente. Puedes dejar de compartir (vuelve a ser privado) o, si eres invitado, salir del proyecto.
