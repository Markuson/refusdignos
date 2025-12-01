# Project brief

Autor: Marc Usón
Estado: En revisión
Categoría: Brief
Última edición: October 17, 2025 10:35 PM

## Índice del Documento

1. Resumen Ejecutivo
2. Objetivos y No-Objetivos
3. Usuarios y Casos de Uso
4. Alcance por Iteración (I→V)
5. Arquitectura de Información y Contenido
6. Notas UX y Pantallas Clave
7. Enfoque Técnico
8. Rendimiento y SEO
9. Riesgos y Supuestos
10. Métricas de Éxito
11. Cronograma y Hitos

---

## 1) Resumen Ejecutivo

**Nombre del proyecto:** RefugiosLibresDignos

**Dominio:** Sitio web para una organización dedicada a la rehabilitación de refugios de montaña en los Pirineos.

**Visión:** Comunicar la misión de devolver dignidad a los refugios libres del Pirineo, mostrar los refugios rehabilitados, **inspirar respeto y cuidado por los espacios compartidos**, captar colaboradores y colaboradores, y permitir en el futuro la autogestión del contenido, donaciones y venta de merchandising.

**Estrategia por iteraciones:**
- **Iteración I (MVP):** Sitio **estático** con Astro, con contenido codificado directamente en el código. Secciones: **Proyecto**, **Refugios** (carrusel de tarjetas), **Contacto** (redes sociales + formulario de contacto), **Colaboradores**. Cada **Refugio** tendrá una página individual con carrusel de imágenes, descripción y a qué asociación está brindado.
- **Iteración II:** Conexión con **Strapi CMS** para gestión completa del contenido (refugios, imágenes, colaboradores, páginas estáticas, navegación).
- **Iteración III:** Añadir **mapa interactivo** de los Pirineos con los refugios geolocalizados y enlaces a sus fichas.
- **Iteración IV:** Añadir **alta de socios** con registro y **métodos de pago** adecuados para patrocinios y cuotas (proveedor y flujo por definir y estudiar).
- **Iteración V:** Incorporar una **tienda online** con merchandising (plataforma y logística por definir).

**Motivo de elección de Astro:** Arquitectura estática e “islands architecture”, alto rendimiento y excelente experiencia de desarrollo. Perfecto para lanzar un MVP rápido y escalar progresivamente.

**Resultados esperados (Iteración I):**
- Desplegar un sitio en producción de forma rápida y fiable.
- Obtener puntuaciones de Lighthouse ≥95 en escritorio y ≥90 en móvil.
- Diseñar componentes y estructura de contenido que luego puedan mapearse fácilmente a modelos en Strapi.

**Fuera de alcance (Iteración I):** CMS, mapa interactivo, **alta de socios/autenticación y pagos**, y tienda.

---

## 2) Objetivos y No-Objetivos

### Objetivos Principales

1. **Visibilidad y Comunicación:** Dar a conocer la misión y las actividades de la organización a través de una presencia web clara y atractiva.
2. **Documentación de Proyectos:** Mostrar de manera visual y accesible cada refugio rehabilitado, su historia, su función y los colaboradores que lo han hecho posible.
3. **Despliegue Rápido:** Crear una primera versión estática que pueda estar en línea en el menor tiempo posible.
4. **Base para Escalabilidad:** Diseñar la arquitectura y el código con una futura integración con CMS en mente.
5. **Rendimiento Máximo:** Optimizar el sitio para tiempos de carga mínimos, puntuaciones altas en Lighthouse y cumplimiento de buenas prácticas SEO.
6. **Accesibilidad:** Asegurar que el contenido sea navegable y legible para todos los usuarios, incluyendo accesibilidad básica (WCAG AA donde sea posible).
7. **Captación de Socios/Colaboradores (futuras iteraciones):** Definir y habilitar un flujo de **alta de socios** con autenticación y pagos, evaluando opciones de proveedor (Stripe, Redsys, PayPal) y requisitos legales/fiscales.
8. **Preparar Iteraciones Futuras:** Dejar sentadas las bases para mapa, donaciones y tienda.

### No-Objetivos (Iteración I)

1. No se incluirá **gestión dinámica de contenido** (esto se introduce en la Iteración II con Strapi).
2. No habrá **alta de socios/autenticación ni pagos** en la primera versión, aunque **sí es un objetivo estratégico** a abordar desde la Iteración IV.
3. No se prioriza **optimización para SEO internacional** (solo enfoque local inicial en España o Pirineos).
4. No se desarrollará **mapa interactivo** ni **e-commerce** todavía.
5. No se implementará **panel administrativo** ni funcionalidades internas.

---

## 3) Usuarios y Casos de Uso

### Tipos de Usuario

1. **Visitantes generales:** Personas interesadas en conocer la organización y sus actividades. Buscan información general y fotografías de los refugios.
2. **Socios y colaboradores potenciales:** Individuos o empresas interesadas en apoyar el proyecto. Necesitan conocer cómo colaborar, realizar aportaciones o registrarse como socios.
3. **Socios activos:** Usuarios con registro futuro (Iteración IV) que podrán gestionar su perfil, ver beneficios o aportar económicamente.
4. **Miembros del equipo de la organización:** Usuarios internos que en el futuro (Iteración II+) gestionarán el contenido desde el CMS.

### Casos de Uso Clave

1. Un visitante accede al sitio, descubre el proyecto y navega por los refugios rehabilitados.
2. Un patrocinador potencial consulta la sección “Colaboradores” y contacta mediante el formulario.
3. Un futuro socio completa un formulario de alta (Iteración IV) y realiza un pago de inscripción o donación.
4. Un administrador (organización) actualiza contenido desde el CMS (Iteración II+).
5. Un usuario navega por el mapa (Iteración III) y accede a la ficha de un refugio específico.

---

## 4) Alcance por Iteración (I→V)

### Iteración I — Sitio Estático (MVP)

- Estructura básica del sitio en Astro con rutas estáticas.
- Secciones: Proyecto, Refugios, Contacto, Colaboradores.
- Carrusel de refugios con enlaces a fichas individuales.
- Formulario de contacto funcional (envío por email o servicio externo simple).
- Diseño responsive con optimización de imágenes y lazy loading.
- Despliegue en **Vercel**.

### Iteración II — Integración con CMS (Strapi)

- Conexión con API de Strapi para obtener contenido dinámico.
- Panel administrativo para gestionar refugios, colaboradores y secciones informativas.
- Adaptación del front-end para consumir contenido desde Strapi.
- Autenticación básica del panel (solo para administradores).

### Iteración III — Mapa Interactivo

- Implementación de mapa (Mapbox o Leaflet) con marcadores de refugios.
- Enlaces dinámicos desde los marcadores a las fichas correspondientes.
- Optimización de rendimiento y carga progresiva del mapa.

### Iteración IV — Alta de Socios y Pagos

- Creación de sistema de registro de socios (usuarios externos).
- Integración con pasarela de pago (Stripe, PayPal o Redsys) para aportaciones y cuotas.
- Sección “Hazte Socio” con explicación, beneficios y flujo de alta.
- Panel básico para socios (gestión de datos personales y pagos).

### Iteración V — Tienda Online y Donaciones Avanzadas

- Implementación de una tienda simple (merchandising).
- Integración con CMS y sistema de pagos existente.
- Gestión de stock y pedidos básica.
- Optimización SEO y campañas de visibilidad.
- Preparación para multilenguaje si se requiere.

## 5) Arquitectura de Información y Contenido

### 5.1 Mapa del Sitio (Iteración I)

- **/** Inicio: hero + resumen del proyecto + CTA a Refugios y Colaboradores.
- **/proyecto**: misión, historia, equipo, metodología, impacto.
- **/refugios**: listado en carrusel y grid responsive.
- **/refugios/[slug]**: ficha del refugio con carrusel de imágenes, descripción, personas o comunidades a las que se brinda el refugio, y datos básicos.
- **/colaboradores**: listado de logos con enlaces y breve descripción.
- **/contacto**: redes sociales + formulario (envío por email/service).
- **/legal** (footer): aviso legal, privacidad, cookies.

### 5.2 Tipos de Contenido y Campos (modelado pensando en Strapi)

**Refugio**
- `titulo` (string)
- `slug` (string, único)
- `descripcionCorta` (text)
- `descripcionLarga` (rich text)
- `brindadoA` (string)
- `estado` (enum: planificado, en-obra, finalizado)
- `localizacion` (lat, lng) — se poblará en Iteración III
- `imagenes` (galería: {url, alt, pie})
- `fechaPublicacion` (date)
- `seo` ({title, description, ogImage})

**Patrocinador**
- `nombre` (string)
- `logo` (media)
- `url` (string)
- `tipo` (enum: empresa, institución, particular)
- `descripcion` (text, opcional)

**Página Estática** (Proyecto, Contacto, Legal)
- `titulo` (string)
- `slug` (string)
- `contenido` (rich text + bloques)
- `seo` ({title, description, ogImage})

**Ajustes del Sitio**
- `navegacion` (array de {label, href})
- `redes` (array de {plataforma, url})
- `footer` (rich text)
- `contactoEmail` (string)

### 5.3 Estructura de URLs y Slugs

- Inicio: `/`
- Proyecto: `/proyecto`
- Refugios (listado): `/refugios`
- Refugio: `/refugios/[slug]`
- Colaboradores: `/colaboradores`
- Contacto: `/contacto`
- Legal: `/legal`

Reglas: slugs kebab-case, únicos; redirecciones 301 si cambian en el futuro.

### 5.4 Componentes de Contenido (Astro, estático)

- `Hero`: título, subtítulo, CTA.
- `Section`: wrapper semántico con heading.
- `CardRefugio`: imagen, título, estado, mini-descripción, enlace.
- `Carousel`: deslizable con controles accesibles.
- `Gallery`: lightbox opcional (defer).
- `LogoWall`: grid de colaboradores.
- `ContactForm`: validación, envío a endpoint externo.
- `Footer` y `Navbar` con navegación accesible.

### 5.5 SEO y Metadatos

- Etiquetas por página: `<title>`, `<meta name="description">`, Open Graph y Twitter Cards.
- Sitemap XML y `robots.txt` (estático, generado en build).
- Marcado estructurado JSON-LD básico para artículos/organización.
- Imágenes con `alt` obligatorio y `width/height` fijos.

### 5.6 Accesibilidad (A11y)

- Contraste AA mínimo.
- Navegación por teclado, `:focus` visibles.
- `aria-label` en controles de carrusel y galería.
- Etiquetas en formulario y mensajes de error legibles.

### 5.7 Estrategia de Medios

- Formatos preferentes: AVIF/WEBP con fallback JPEG.
- Variantes responsive: `srcset` y `sizes`.
- Compresión en build y lazy loading.
- Carpeta `/public/media/` en Iteración I; mover a CDN/Strapi Media Library en Iteración II.

### 5.8 Taxonomías futuras (opcional)

- **Región** (Val d’Aran, Alto Pirineo, etc.)
- **Dificultad de acceso** (baja, media, alta)

### 5.9 Gobernanza de Contenido

- Estilo editorial: tono cercano y factual, máximo 300–500 palabras por ficha.
- Revisión: 4 ojos antes de publicar (en CMS, roles Editor/Publisher en Iteración II).
- Calendario: actualización trimestral mínima o por hito de obra.

### 5.10 Evolución por Iteración

- **I:** Contenido hardcoded en ficheros `.md` locales.
- **II:** Migración a modelos de Strapi equivalentes. Scripts de importación.
- **III:** Completar `localizacion` y capas del mapa.
- **IV:** Páginas y copy de “Hazte socio” y flujo de pagos.
- **V:** Catálogo de productos y categorías en CMS.

---

## 6) Notas UX y Pantallas Clave

### 6.1 Principios de Diseño UX

1. **Claridad ante todo:** El usuario debe entender de inmediato quiénes son y qué hacen.
2. **Velocidad percibida:** Todo debe cargar y responder casi instantáneamente; priorizar interacciones ligeras.
3. **Jerarquía visual simple:** Máximo 3 niveles de profundidad visual.
4. **Enfoque humano:** Mostrar los refugios como proyectos humanos, no solo arquitectónicos.
5. **Coherencia:** Paleta, tipografía y espaciado consistentes en todo el sitio.
6. **Accesibilidad:** Navegación por teclado, contraste adecuado y textos descriptivos.

### 6.2 Identidad Visual y Tono

### Paleta de Colores

| Rol | Color | Código | Uso principal | Descripción |
| --- | --- | --- | --- | --- |
| **Color Primario** | Forest Green | `#284c3e` | Encabezados, texto principal, fondo de la barra de navegación, botones primarios (CTAs) | Base sólida y confiable, evoca naturaleza y estabilidad. |
| **Color Secundario (Acento 1)** | Sunrise Orange/Red | `#E78A33` | Botones secundarios, elementos interactivos (hover), cajas informativas o acentos visuales de alto impacto | Energía y atención. |
| **Color Secundario (Acento 2)** | Lime/Light Green | `#648D21` | Iconos de características, etiquetas, fondos ligeros de secciones de contenido | Aporta frescura y vitalidad. |
| **Color Base** | Pure White | `#FFFFFF` | Fondo principal, cajas de texto, áreas de máxima legibilidad | Diseño limpio y moderno. |
| **Color Terciario (Texto/Detalle)** | Off-White/Light Gray | `#f7f4ef` | Subtítulos, notas, bordes o líneas divisorias | Suaviza contrastes y mantiene legibilidad. |
| **Color Fondo Claro** | Light Warm Background | `#f9f8f4` | Fondos alternativos suaves, áreas de contenido secundario | Fondo cálido muy sutil para alternancia de secciones. |
| **Neutral Cálido (Opcional)** | Tan/Beige | `#D8C28E` | Fondos de tarjetas, testimonios, pie de página | Tacto cálido, terroso y acogedor. |

### Guía de Estilo UI (botones, fondos, tipografía y estados de interacción)

### Botones

- **Primarios:** fondo `#284c3e` (Forest Green), texto blanco, borde 4px redondeado, hover `#648D21` (Lime Green), transición 0.2s.
- **Secundarios:** borde `#E78A33` (Sunrise Orange), texto `#E78A33`, hover fondo `#E78A33` con texto blanco.
- **Desactivados:** fondo `#f7f4ef`, texto `#648D21` a 50% opacidad.

### Fondos

- Fondo principal: blanco puro `#FFFFFF`.
- Fondo secundario (secciones alternas): off-white `#f7f4ef`.
- Fondo terciario (áreas suaves): light warm `#f9f8f4`.
- Secciones destacadas o alternadas: beige cálido `#D8C28E` o verde claro `#648D21` con 10% opacidad.

### Tipografía

- **Fuente base:** Inter, sans-serif.
- **Jerarquía:**
    - H1: 40–48px, color `#284c3e`, peso 700.
    - H2: 32px, color `#27582E`, peso 600.
    - H3: 24px, color `#648D21`, peso 600.
    - Texto base: 16–18px, color `#27582E`.
    - Texto secundario: 14px, color `#f7f4ef`.

### Estados de Interacción

- **Hover:** transiciones suaves (0.2–0.3s), cambio de color o sombra leve.
- **Active/Focus:** contorno `2px solid #E78A33`, fondo más oscuro o sombra interior.
- **Links:** color `#E78A33`, hover con subrayado animado.
- **Inputs:** borde `#27582E` en focus, placeholder gris claro.

### 6.3 Estructura Global del Layout

**Cabecera (Navbar):** logo, navegación principal, botón de contacto o CTA “Hazte socio”.

**Cuerpo:** contenido modular dividido por secciones (hero, texto, carruseles, galerías).

**Pie (Footer):** información legal, enlaces de redes sociales, créditos y contacto.

### 6.4 Pantallas Clave (Iteración I)

### 1. Página de Inicio

- **Hero:** imagen de un refugio y mensaje inspirador (“por determinar”).
- **Bloque Proyecto:** resumen con CTA a sección “Proyecto”.
- **Bloque Refugios:** carrusel con 3–4 refugios destacados.
- **Bloque Colaboradores:** grid de logos.
- **CTA final:** “Apoya el proyecto” (lleva a contacto o futura zona de socios).

### 2. Página Proyecto

- Introducción a la organización.
- Imágenes de obras y voluntarios.
- Bloque con texto sobre valores, impacto y visión.
- Enlace a sección de Colaboradores.

### 3. Página Refugios

- Grid/carrusel de tarjetas con imagen, nombre, ubicación y estado.
- Filtro por región (Iteración III) y orden por fecha.

### 4. Ficha de Refugio

- Galería principal (carrusel).
- Descripción breve y larga.
- Datos clave: altitud, ubicación aproximada, estado del proyecto.
- Sección “Brindado a”: texto corto explicativo.

### 5. Página Contacto

- Enlaces a redes sociales.
- Formulario de contacto simple con validación.
- Mensaje de agradecimiento tras envío.

### 6. Página Colaboradores

- Listado visual de logos.
- Breve descripción de cada patrocinador.
- CTA “Súmate como socio”.

### 6.5 Pantallas Futuras (Iteraciones II–V)

- **Iteración II:** interfaz de gestión de contenido desde CMS; diseño coherente con front-end.
- **Iteración III:** mapa interactivo con marcadores.
- **Iteración IV:** flujo de alta de socios con pasos claros (datos, método de pago, confirmación).
- **Iteración V:** tienda minimalista (productos en grid, ficha, carrito y checkout sencillo).

### 6.6 Navegación y Flujo de Usuario

1. Entrada por Inicio → exploración de Proyecto o Refugios.
2. Desde Refugios → ficha detallada → posible regreso o compartir.
3. Desde Contacto o CTA → alta o mensaje.
4. Flujo sin callejones sin salida, siempre con navegación visible y accesible.

### 6.7 Recomendaciones para UI (Iteración I)

- Uso de animaciones sutiles (fade/slide) para evitar distracción.
- Botones grandes, contrastados y etiquetados.
- Formularios con validación inline.
- Carruseles accesibles y con scroll táctil.

### 6.8 Wireframes (descripción conceptual)

- **Inicio:** estructura vertical en bloques.
- **Proyecto:** una imagen + texto lateral.
- **Refugios:** grid 3 columnas responsive → 1 columna móvil.
- **Ficha Refugio:** header con imagen destacada, galería bajo descripción.
- **Contacto:** layout centrado con formulario y enlaces laterales.

### 6.9 UX Evolutivo

- **I:** contenido estático, navegación básica.
- **II:** contenido dinámico vía CMS.
- **III:** mapa interactivo y filtros.
- **IV:** flujo de socios y pagos.
- **V:** tienda + personalización de usuario.

### 6.10 Medición de Experiencia

- Tiempo medio en página.
- Tasa de rebote.
- Ratio de clics en CTA “Hazte socio”.
- Feedback cualitativo de usuarios y socios (encuestas).

---

## 7) Enfoque Técnico

### 7.1 Stack Tecnológico

### Frontend

- **Framework principal:** [Astro](https://astro.build/) — arquitectura de islas, rendimiento alto, enfoque estático.
- **Lenguajes:** TypeScript + HTML + CSS (TailwindCSS).
- **Animaciones:** Uso preferente de **Astro Transitions** para animaciones simples, evitando dependencias externas. Solo se considerará **Framer Motion** en casos complejos y justificados.
- **Gestión de formularios:** formulario HTML estándar + integración con servicio de backend (Formspree o Netlify Forms en MVP).

### Backend (Iteración II+)

- **CMS:** Strapi (headless, Node.js, API REST/GraphQL).
- **Base de datos:** PostgreSQL tanto en desarrollo como en producción (sin SQLite).
- **Hosting:** Strapi Cloud, Railway o Vercel Functions + base PostgreSQL externa (Neon, Supabase o Render).

### Infraestructura

- **Despliegue:** Vercel (frontend).
- **CDN:** integrado con Vercel para assets e imágenes optimizadas.
- **Control de versiones:** GitHub (repositorio principal).
- **Integración continua:** GitHub Actions (lint, build, test, deploy).

### 7.2 Arquitectura General

1. **Iteración I (MVP Estático)**
    - Páginas generadas estáticamente (`.md` o `.mdx` como fuente de datos).
    - Contenido renderizado en build time.
    - Sin dependencias de servidor o base de datos.
    - Despliegue automático en Vercel.
2. **Iteración II (CMS Dinámico)**
    - Astro obtiene contenido de Strapi mediante API.
    - Sincronización mediante fetch en build o revalidación incremental.
    - API protegida con token de acceso.
    - CMS hospedado aparte (Strapi Cloud o VPS).
3. **Iteración III (Mapa Interactivo)**
    - Componente React o nativo de Astro.
    - Librería: Leaflet o Mapbox GL JS.
    - Carga diferida y lazy loading para rendimiento óptimo.
4. **Iteración IV (Socios y Pagos)**
    - Integración con **Patreon API** como opción principal para gestión de socios y patrocinios.
    - Alternativas a explorar: **Ko-fi**, **Buy Me a Coffee**, o módulo propio basado en Stripe.
    - Sistema de verificación mediante OAuth o token de acceso de Patreon.
    - Integración opcional con página personalizada “Hazte socio” que redirija a la plataforma de patrocinio elegida.
5. **Iteración V (Tienda Online)**
    - Uso de Strapi como catálogo.
    - Pasarela de pago compartida con módulo de socios o integrada en CMS.
    - Flujo: producto → carrito → checkout → confirmación.

### 7.3 Principios de Desarrollo

1. **Performance-first:** priorizar tamaño del bundle y renderizado estático.
2. **Mínimas dependencias:** utilizar funciones nativas o de Astro antes de instalar librerías externas.
3. **Progresivo:** añadir complejidad solo cuando aporte valor funcional.
4. **Modular:** cada sección (Proyecto, Refugios, Contacto) en su propio módulo/component.
5. **Accesible:** componentes semánticos, etiquetas ARIA, navegación por teclado.
6. **Documentado:** uso de comentarios JSDoc y README por carpeta.

### 7.4 Integraciones y APIs

- **Email/Formularios:** Formspree, EmailJS o Netlify Forms (fase I).
- **Mapas:** Leaflet / Mapbox GL (fase III).
- **Pagos y membresías:** Patreon API (principal), Stripe o PayPal como alternativas.
- **Analytics:** Plausible Analytics o Google Analytics 4.

### 7.5 Estrategia de Datos y CMS

- Modelos: Refugio, Patrocinador, Página Estática, Ajustes del Sitio.
- Control de versiones de contenido en Strapi mediante entornos.
- Migración desde `.md` a CMS mediante script ETL.
- Sincronización incremental con fallback local.

### 7.6 Seguridad y Cumplimiento

- HTTPS obligatorio en todos los entornos.
- Sanitización de entradas y validación de formularios.
- Tokens de API en Strapi rotados cada 90 días.
- Política de privacidad y cookies conforme a RGPD.

### 7.7 Monitoreo y Mantenimiento

- Monitoreo de rendimiento (Vercel Analytics, Lighthouse CI).
- Backup diario de CMS.
- Auditorías de accesibilidad cada 6 meses.
- Renovación de dependencias trimestral.

### 7.8 Escalabilidad y Futuro

- Migración posible a SSR (Astro + Server Islands) si se requiere autenticación avanzada.
- **No se contempla multilenguaje ni conversión a PWA.**
- Módulo de membresía ampliable (Stripe Customer Portal o Patreon tiers).

### 7.9 Roadmap Técnico (Resumen)

| Iteración | Hito Técnico | Herramientas | Resultado |
| --- | --- | --- | --- |
| I | Sitio estático con Astro | Markdown, Vercel | MVP desplegado |
| II | Integración con CMS | Strapi, PostgreSQL | Contenido dinámico |
| III | Mapa interactivo | Leaflet / Mapbox | Interactividad geográfica |
| IV | Alta de socios y pagos | Patreon API / Stripe | Gestión de membresías |
| V | Tienda online | Strapi + Stripe | E-commerce básico |

---

# 8) Rendimiento y SEO

### 8.1 Objetivos de Rendimiento

1. **Lighthouse ≥95** en escritorio y **≥90** en móvil.
2. **First Contentful Paint (FCP)** < 1.5 s.
3. **Largest Contentful Paint (LCP)** < 2.5 s.
4. **Total Blocking Time (TBT)** < 150 ms.
5. **CLS (Cumulative Layout Shift)** < 0.1.
6. Tamaño total del bundle < 200 KB (Iteración I).

### 8.2 Estrategia de Optimización

### Capa de build (Astro)

- Renderizado estático por defecto (SSG).
- Carga parcial (islas) solo donde haya interactividad.
- Dividir bundles automáticamente por página.
- Minificación y tree-shaking mediante Vite.

### Imágenes

- Uso de componentes `astro:assets` para optimización automática.
- Generación en build de versiones WebP y AVIF.
- Carga diferida (lazy) de imágenes y componentes multimedia.
- Compresión previa y metadatos controlados.

### CSS y JS

- CSS en línea solo para estilos críticos.
- TailwindCSS purgado y minificado en build.
- Evitar librerías pesadas; preferir utilidades nativas de Astro o CSS.
- Scripts diferidos (`defer` o `type="module"`).

### Tipografía

- Carga local de fuentes (Inter) para reducir dependencias externas.
- `font-display: swap` para mejorar LCP.

### Caching y CDN

- Cacheo en Vercel CDN por ruta estática.
- Headers `Cache-Control` ajustados para HTML (0) y assets (31536000).

### 8.3 Accesibilidad (a efectos de rendimiento)

- Imágenes con `alt` obligatorio.
- Colores contrastados según WCAG AA.
- Evitar animaciones excesivas que bloqueen renderizado.
- Navegación por teclado garantizada.

### 8.4 Estrategia SEO

### Configuración básica

- Título y descripción dinámicos por página (Astro Head API).
- Etiquetas meta estándar: title, description, og:title, og:image, twitter:card.
- Sitemap XML y `robots.txt` generados en build.
- Canonical tags automáticas según URL.

### Contenido

- Estructura jerárquica de headings coherente (H1 → H3 máximo).
- URLs limpias y semánticas.
- Slugs amigables (`kebab-case`).
- Uso de palabras clave naturales relacionadas con: *refugios libres, montaña, Pirineos, voluntariado, rehabilitación*.

### Marcado estructurado (Schema.org)

- `Organization` para la entidad principal.
- `Place` y `TouristAttraction` para refugios individuales.
- `BreadcrumbList` en todas las páginas internas.

### Enlaces y redes

- Enlaces salientes con `rel="noopener noreferrer"`.
- Etiquetas sociales Open Graph completas.
- Imagen OG optimizada (< 200 KB, 1200x630px).

### 8.5 Monitoreo SEO y Métricas

- Google Search Console (indexación y cobertura).
- Google Analytics 4 / Plausible (engagement y tráfico).
- Ahrefs o Screaming Frog (rastreos trimestrales).
- Revisión mensual de Core Web Vitals.

### 8.6 Checklist de Rendimiento (Iteración I)

- [ ]  Lighthouse ≥95/90 (desktop/móvil)
- [ ]  CSS purgado
- [ ]  Imágenes WebP y lazy loading
- [ ]  Scripts deferidos
- [ ]  Fonts locales optimizadas
- [ ]  Sitemap y `robots.txt` generados
- [ ]  OG tags y meta description por página
- [ ]  Validación de accesibilidad básica (WCAG AA)

### 8.7 Evolución por Iteración

- **I:** Estático, optimización total en build.
- **II:** Carga dinámica desde Strapi con caching incremental.
- **III:** Carga diferida del mapa (lazy y condicional).
- **IV:** Optimización de flujos de socios (formularios y autenticación externa).
- **V:** Monitoreo de tienda y SEO de productos.

---

## 9) Riesgos y Supuestos

### 9.1 Principales Riesgos Identificados

| Categoría | Riesgo | Descripción | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- | --- | --- |
| **Técnico** | Dependencia del CMS | Posibles incompatibilidades o fallos en actualizaciones de Strapi. | Media | Alta | Fijar versiones y probar antes de actualizar. |
| **Técnico** | Latencia API Strapi | Respuesta lenta del CMS remoto en producción. | Media | Media | Implementar cacheo en Astro y CDN. |
| **Técnico** | Integración Patreon | Cambios en la API o limitaciones de autenticación. | Media | Alta | Abstraer capa de integración; plan B con Stripe o Ko-fi. |
| **Rendimiento** | Exceso de dependencias | Degradación de tiempos de carga. | Baja | Alta | Usar solo Astro Transitions y librerías mínimas. |
| **Infraestructura** | Fallo en despliegue Vercel o CMS | Inaccesibilidad temporal del sitio. | Baja | Media | Monitoreo activo y backups automáticos. |
| **Legal** | Cumplimiento RGPD | Posible incumplimiento en tratamiento de datos de formularios o socios. | Media | Alta | Redactar política de privacidad y revisar flujos de datos. |
| **Financiero** | Coste de servicios externos | Patreon, hosting CMS o mapas pueden generar gastos imprevistos. | Media | Media | Evaluar planes gratuitos o de bajo coste. |
| **Operativo** | Contenido desactualizado | Falta de mantenimiento del contenido o retrasos de cliente. | Media | Media | Establecer responsables internos y recordatorios trimestrales. |
| **UX/UI** | Saturación visual o accesibilidad baja | Diseño sobrecargado o difícil de usar. | Baja | Media | Validar con test de usuarios antes del lanzamiento. |

### 9.2 Riesgos de Proyecto (Planificación)

1. **Alcance excesivo:** expansión prematura a funcionalidades no previstas (donaciones, tienda) antes de consolidar MVP.
2. **Dependencia de decisiones del cliente:** retrasos por falta de materiales o validaciones.
3. **Integración progresiva del CMS:** posibles ajustes estructurales al pasar de contenido `.md` a dinámico.
4. **Limitaciones del equipo:** disponibilidad limitada o cambios en roles técnicos.

**Mitigación general:** fases cortas, entregas funcionales por iteración, documentación clara y priorización estricta.

### 9.3 Supuestos del Proyecto

1. El contenido inicial (textos, imágenes, logotipos) será proporcionado por la organización antes del desarrollo de la Iteración I.
2. La conexión a Strapi y PostgreSQL estará disponible al inicio de la Iteración II.
3. Las APIs externas (Patreon, Leaflet/Mapbox) estarán accesibles y con claves de desarrollo válidas.
4. La infraestructura de Vercel se mantendrá estable y disponible durante el ciclo de vida del proyecto.
5. El desarrollador dispone de experiencia previa en Astro, Tailwind y Strapi.
6. El cliente acepta que la web sea monolingüe y sin PWA (por decisión estratégica).

### 9.4 Riesgos Residuales (Aceptados)

- Pérdida temporal de contenido no crítico en caso de fallo de CMS (respaldo manual disponible).
- Dependencia continua de servicios externos (Vercel, Patreon, Strapi Cloud).
- Riesgo menor de obsolescencia tecnológica a largo plazo (Astro y Strapi son frameworks activos y mantenidos).

### 9.5 Plan de Contingencia

1. **Fallo de CMS:** restauración desde backup y carga temporal de contenido estático.
2. **Caída de Patreon o Stripe:** reemplazo inmediato por enlaces de donación directa o formulario provisional.
3. **Problemas de rendimiento:** rollback a última versión estable + auditoría Lighthouse.
4. **Cambios legales (RGPD):** revisión con consultoría externa y actualización de textos legales.

### 9.6 Seguimiento de Riesgos

- Revisión trimestral de riesgos técnicos y legales.
- Uso de tablero (Notion o GitHub Projects) con estado: *Identificado → En mitigación → Cerrado*.
- Actualización automática tras cada iteración del proyecto.

---

# RefugiosLibresDignos — Sección 10: Métricas de Éxito

> Versión 1.0 • Propietario: Analista Técnico • Última actualización: 14/10/2025
> 

### 10.1 Objetivo General

Medir el impacto técnico, funcional y comunicativo del sitio web **Refugios Libres Dignos** para asegurar su efectividad en rendimiento, mantenimiento y difusión del proyecto.

### 10.2 Métricas de Rendimiento Técnico

| Indicador | Descripción | Meta | Herramienta |
| --- | --- | --- | --- |
| **Lighthouse Score** | Puntuación de rendimiento general | ≥95 desktop / ≥90 móvil | Google Lighthouse, Vercel Analytics |
| **Tiempo de carga inicial (FCP)** | Tiempo hasta primer renderizado de contenido | <1.5 s | Chrome DevTools, Web Vitals |
| **LCP (Largest Contentful Paint)** | Tiempo hasta renderizado principal | <2.5 s | Lighthouse |
| **TBT (Total Blocking Time)** | Tiempo bloqueado por scripts | <150 ms | Lighthouse |
| **CLS (Cumulative Layout Shift)** | Estabilidad visual | <0.1 | Web Vitals |
| **Tamaño del bundle JS** | Peso total de JS cargado | <200 KB | Vite, Bundle Analyzer |
| **Uptime del sitio** | Porcentaje de disponibilidad | ≥99.9% | UptimeRobot / Vercel |

### 10.3 Métricas de Contenido y Usabilidad

| Indicador | Descripción | Meta | Herramienta |
| --- | --- | --- | --- |
| **Tiempo medio en página** | Promedio de permanencia de usuarios | >60 s | Google Analytics 4 / Plausible |
| **Tasa de rebote** | Porcentaje de usuarios que abandonan tras una sola vista | <40% | Google Analytics 4 / Plausible |
| **Navegación sin errores** | Clicks sin enlaces rotos | 100% | Screaming Frog / manual |
| **CTR de CTA “Hazte socio”** | Ratio de clics en botón principal | >5% | Google Analytics 4 / evento personalizado |
| **Ratio de formularios enviados** | Formularios completados con éxito | >80% | Backend logs / Formspree |

### 10.4 Métricas de SEO y Visibilidad

| Indicador | Descripción | Meta | Herramienta |
| --- | --- | --- | --- |
| **Páginas indexadas** | Número de URLs indexadas en Google | 100% de páginas públicas | Google Search Console |
| **Posicionamiento de palabras clave** | Ranking medio para palabras objetivo (“refugios libres Pirineos”) | Top 10 | Ahrefs / GSC |
| **Clics orgánicos mensuales** | Tráfico orgánico proveniente de buscadores | +10% mensual | GSC |
| **Backlinks relevantes** | Enlaces entrantes de medios o socios | ≥10 | Ahrefs / manual |

### 10.5 Métricas de Mantenimiento y Escalabilidad

| Indicador | Descripción | Meta | Herramienta |
| --- | --- | --- | --- |
| **Frecuencia de despliegue** | Cada nueva versión funcional publicada | ≥1 por iteración | GitHub Actions |
| **Tiempo medio de corrección de errores** | Tiempo entre detección y resolución | <48 h | GitHub Issues |
| **Tasa de éxito en builds** | Builds sin error | 100% | CI logs |
| **Backup CMS completado** | Frecuencia de respaldo exitoso | Diario | Strapi Cloud / scripts personalizados |

### 10.6 Métricas de Comunidad y Participación (Iteraciones IV–V)

| Indicador | Descripción | Meta | Herramienta |
| --- | --- | --- | --- |
| **Nuevos socios registrados** | Altas a través de Patreon u otro sistema | +10/mes tras lanzamiento | Patreon API / Strapi |
| **Aportaciones totales** | Ingresos o donaciones mensuales | Crecimiento sostenido ≥10%/mes | Patreon / Stripe dashboard |
| **Interacciones sociales** | Clics en enlaces de redes sociales | +20% trimestral | Analytics / UTM |

### 10.7 Seguimiento y Reporte

- Revisión mensual de métricas clave.
- Informe trimestral con tendencias y análisis de evolución.
- Dashboard de control centralizado (Plausible o Google Data Studio).
- Ajuste de objetivos tras cada iteración según datos reales.

### 10.8 Éxito Final del Proyecto

El proyecto se considerará **exitoso** si cumple simultáneamente:
1. Lanzamiento del MVP en producción con Lighthouse ≥90 móvil.
2. Navegación fluida y sin errores.
3. CMS funcional y contenido gestionado sin asistencia técnica.
4. Sistema de socios o patrocinio activo.
5. Feedback positivo (>80% satisfacción en encuestas internas).

## 11) Cronograma y Hitos

### 11.1 Enfoque General de Planificación

El desarrollo del proyecto **Refugios Libres Dignos** se estructura por iteraciones incrementales. Cada iteración entrega un bloque funcional completo y verificable, priorizando rendimiento y estabilidad antes de añadir nuevas características.

Duración estimada por iteración: **4 a 6 semanas**.

El cronograma puede ajustarse según disponibilidad del desarrollador y la entrega de materiales por parte del cliente.

### 11.2 Cronograma Tentativo (por Iteración)

| Iteración | Fase | Duración estimada | Objetivos principales | Entregables |
| --- | --- | --- | --- | --- |
| **I** | MVP Estático | 4 semanas | Crear sitio Astro con contenido `.md` y secciones básicas | Sitio funcional desplegado en Vercel |
| **II** | Integración CMS | 6 semanas | Conectar con Strapi + PostgreSQL | CMS operativo + contenido dinámico |
| **III** | Mapa Interactivo | 5 semanas | Implementar mapa Leaflet con ubicaciones de refugios | Mapa funcional y optimizado |
| **IV** | Socios y Pagos | 6 semanas | Integrar Patreon API o alternativa | Flujo de alta de socios operativo |
| **V** | Tienda Online | 6 semanas | Añadir módulo de tienda y checkout | Tienda mínima funcional + gestión desde CMS |

### 11.3 Hitos Principales

| Hito | Descripción | Fecha estimada | Dependencias |
| --- | --- | --- | --- |
| **H1** | Finalización de diseño y estructura base Astro | Semana 4 | Inicio del proyecto |
| **H2** | Sitio estático desplegado (MVP) | Semana 5 | H1 |
| **H3** | Integración Strapi + migración contenido | Semana 10 | H2 |
| **H4** | Validación de mapa interactivo | Semana 15 | H3 |
| **H5** | Integración Patreon/Stripe para socios | Semana 21 | H4 |
| **H6** | Tienda funcional y flujo de pago completado | Semana 27 | H5 |
| **H7** | Revisión global + auditoría Lighthouse | Semana 28 | H6 |

### 11.4 Dependencias y Condiciones

1. El cliente debe entregar textos, imágenes y logotipos antes del inicio de la Iteración I.
2. Las credenciales de acceso a Strapi, PostgreSQL y APIs externas deben estar disponibles antes de la Iteración II.
3. Patreon API o alternativa seleccionada debe estar configurada antes de la Iteración IV.
4. La comunicación y aprobación de cada iteración debe realizarse antes de avanzar a la siguiente.

### 11.5 Hitos de Validación Técnica

| Validación | Criterio | Herramienta |
| --- | --- | --- |
| **Rendimiento** | Lighthouse ≥95 escritorio / ≥90 móvil | Google Lighthouse |
| **Accesibilidad** | Cumplimiento WCAG AA | Axe DevTools |
| **SEO** | 100% indexación y metadatos correctos | Google Search Console |
| **Seguridad** | HTTPS + headers correctos | Mozilla Observatory |
| **CMS** | CRUD completo desde panel Strapi | Manual / Postman |

### 11.6 Mantenimiento y Actualización

- Mantenimiento evolutivo tras la Iteración V: 1 revisión cada 3 meses.
- Backup automático diario del CMS.
- Auditoría técnica y de contenido semestral.
- Revisión del stack y dependencias cada 6 meses.

### 11.7 Cierre de Proyecto

El proyecto se considerará **completado** cuando:
1. Todas las iteraciones estén implementadas y verificadas.

2. El CMS sea completamente funcional.

3. La integración de Patreon o equivalente esté activa.

4. El sitio esté desplegado con métricas de rendimiento y SEO conforme a los objetivos establecidos.

5. Se haya entregado documentación técnica final (readme, guías de despliegue y mantenimiento).