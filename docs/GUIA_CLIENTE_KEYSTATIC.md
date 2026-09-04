# Guía: cómo añadir un refugio nuevo en el panel de administración

Esta guía explica, paso a paso, cómo entrar en el panel de administración del sitio
(`/keystatic`) y publicar un refugio nuevo sin necesitar ayuda de un desarrollador:
iniciar sesión, rellenar los datos del refugio, subir las fotos y guardar los cambios.

## Antes de empezar

Para poder guardar cambios necesitas una cuenta de GitHub con permiso de escritura
sobre el repositorio del proyecto. Esto se configura una única vez -- si todavía no
tienes acceso, pídeselo al desarrollador antes de continuar. Sin ese permiso puedes
entrar en el panel, pero cualquier intento de guardar fallará.

## 1. Cómo entrar en el panel

1. Abre <https://refugioslibresdignos.com/keystatic> en el navegador.
2. Pulsa **"Log in with GitHub"** e inicia sesión con tu cuenta de GitHub (la misma
   a la que se te dio acceso).
3. Tras autorizar el acceso, volverás automáticamente al panel, donde verás el
   **Dashboard** con la colección **"Refugios"**.

## 2. Cómo crear un refugio nuevo

1. En el Dashboard, entra en la colección **"Refugios"**.
2. Pulsa **"Create"** para abrir un formulario en blanco.
3. Rellena los campos. Estos son los que verás, con el nombre exacto que tiene cada
   uno en el formulario:

   | Campo en el formulario | Obligatorio | Qué es |
   |---|---|---|
   | **Título** | Sí | Nombre del refugio. |
   | *(slug/URL, debajo de Título)* | Se rellena solo | Al escribir el Título, este campo genera automáticamente la dirección web de la página del refugio. Al crear un refugio nuevo puedes editarlo antes de guardar si quieres una URL distinta -- pero **una vez creado y publicado el refugio, no lo cambies**: cambiaría su dirección pública y los enlaces antiguos dejarían de funcionar. |
   | **Ubicación** | Sí | Dónde se encuentra el refugio. |
   | **Altitud** | No | Altitud del refugio. |
   | **Capacidad** | No | Número de plazas. |
   | **Descripción corta** | Sí | Resumen breve que aparece en el listado de refugios y en la portada. |
   | **Descripción larga** | Sí | Descripción completa que aparece en la página propia del refugio. |
   | **Brindado a** | No | A quién está dedicado o brindado el refugio, si aplica. |
   | **Título SEO** | No | Título alternativo para buscadores (Google). Si lo dejas vacío, se usa el Título normal. |
   | **Descripción SEO** | No | Descripción alternativa para buscadores. Si lo dejas vacío, se usa la Descripción corta. |
   | **Imágenes** | Sí (mínimo 1 foto) | Ver el siguiente apartado -- sin al menos una foto no podrás guardar. |

   Al final del formulario verás también un campo grande de texto llamado
   **"Contenido (no utilizado)"**: como indica su nombre, no se usa en ningún refugio
   -- déjalo vacío y no le des importancia.

## 3. Cómo subir las fotos

La sección **"Imágenes"** es donde añades las fotos del refugio directamente desde tu
ordenador o móvil -- no hace falta subirlas a ningún otro sitio antes.

1. En la sección **"Imágenes"**, añade un elemento nuevo (botón **"+" / "Add"**).
2. Dentro de cada elemento verás dos campos:
   - **Imagen**: pulsa el botón **"↑ Subir a Cloudinary"** y elige la foto desde tu
     dispositivo. Verás una barra de progreso ("Subiendo… %") y, al terminar, una
     vista previa de la imagen. Si quieres cambiarla por otra, usa el mismo botón
     (ahora con el texto **"↑ Reemplazar archivo"**).
   - **Texto alternativo**: escribe una frase corta describiendo la foto (por
     ejemplo, "Vista exterior del refugio en invierno"). Es obligatorio y ayuda a la
     accesibilidad y al posicionamiento en buscadores.
3. Repite el proceso para añadir todas las fotos que quieras. El orden en que las
   colocas es el orden en que se mostrarán en la página del refugio -- puedes
   arrastrar cada elemento para reordenarlo. Puedes eliminar una imagen ya añadida
   desde el propio elemento si te has equivocado.
4. Formatos aceptados: JPG, JPEG, PNG, WEBP y GIF, hasta 15 MB por archivo.

**El refugio no se puede guardar con cero fotos** -- es un requisito del formulario,
no un error si el botón de guardar no responde: añade al menos una imagen primero.
Esto también aplica al editar un refugio ya existente: si solo le queda una foto, no
podrás eliminarla sin añadir antes otra que la sustituya.

**Si la subida de una foto falla**, verás un mensaje en rojo bajo el botón de subida
(por ejemplo, un error de red o de conexión). En ese caso, comprueba tu conexión a
internet y vuelve a intentarlo con el mismo botón. Si el error persiste tras varios
intentos, avisa al desarrollador -- puede ser un problema de configuración, no algo
que puedas arreglar desde el panel.

## 4. Cómo guardar

Cuando hayas rellenado los campos obligatorios y subido al menos una foto, pulsa
**"Save"** (o **"Create"**, según la pantalla) al fondo del formulario. Si falta
algún campo obligatorio o alguna foto, el panel te lo indicará señalando el campo
correspondiente en rojo -- no hace falta que adivines qué falta.

Para eliminar un refugio existente, ábrelo y usa la opción **"Delete entry"**. Esta
acción no se puede deshacer desde el panel: piénsalo dos veces antes de confirmar.

## 5. Cuánto tarda en aparecer en la web

Guardar un cambio en el panel crea automáticamente una actualización en el repositorio
del proyecto, que dispara una nueva publicación del sitio. Este proceso es automático
y no requiere ninguna acción adicional por tu parte: no hace falta "publicar" en
ningún otro sitio, basta con guardar en el panel. El sitio tarda un rato en
reconstruirse y publicarse -- si al cabo de unos minutos todavía no ves el cambio,
espera un poco más y recarga la página forzando que no use la versión guardada en
caché (`Ctrl+Shift+R` en Windows/Linux, `Cmd+Shift+R` en Mac) antes de avisar al
desarrollador.

Un refugio nuevo con Título "Ejemplo" aparecerá en
`https://refugioslibresdignos.com/refugios/ejemplo` (la URL exacta es la que se ve en
el campo debajo de Título, ver apartado 2), además de en el listado de
`/refugios` y, si aplica, en la portada.

## Consejos rápidos

- No cambies el campo de slug/URL (debajo de Título) de un refugio ya publicado:
  rompe su dirección web y cualquier enlace que ya se haya compartido.
- Si necesitas ayuda con el acceso (no puedes iniciar sesión o guardar cambios te da
  error de permisos), contacta con el desarrollador -- es un problema de permisos de
  GitHub, no de este panel.
- Puedes editar o eliminar un refugio ya publicado igual que uno nuevo: ábrelo desde
  el listado de la colección "Refugios", haz los cambios y pulsa "Save".
