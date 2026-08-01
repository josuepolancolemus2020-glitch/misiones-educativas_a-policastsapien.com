# Investigación · Divulgación automatizada: Facebook, Antena, Heyzine y la edición digital

Segunda investigación, hermana de `INVESTIGACION-REVISTA-QUINCENAL.md`. Hecha
el 1 de agosto de 2026 con verificación de primera mano (el código de Antena,
la cuenta de Canva por el conector, pruebas empíricas) y cuatro estudios web
con fuentes de 2025-2026. Responde: cómo automatizar la divulgación de estos
proyectos en redes sociales, qué papel juega Antena, cómo se automatiza la
edición digital de letra grande para Heyzine, y cómo despertar la página de
Facebook PolicastSapiens sin que consuma al maestro.

---

## 1. El descubrimiento central: las piezas ya existen y encajan

Esta investigación esperaba diseñar un sistema; lo que encontró fue un sistema
**ya construido en un 80 %** al que le faltan tres cables:

- **Antena no es una idea: es un producto.** En F.A.R.O ya funciona el OAuth a
  X y a Páginas de Facebook (los tokens viven solo en el servidor, con lista de
  correos autorizados y RLS en las ocho tablas), un compositor de publicaciones
  programadas con calendario mensual, el reloj que publica cada minuto
  (pg_cron + reintentos con espera creciente), el modo **«privada primero»**
  en Facebook (`published: false` y botón *Hacer pública* — nada sale sin
  mirada humana), y el observatorio de la Fase 5b: métricas del feed cada 4
  horas, historia de seguidores y bandeja de comentarios sin responder. El
  compositor está dormido por decisión de la Fase 5b, no por falla.
- **La edición digital de letra grande es 100 % automatizable.** Verificado
  contra la cuenta real de Canva: la de imprenta usa cuerpo de 13,3 px y la
  digital que haces a mano usa 18,7–21,3 px **sobre el mismo lienzo de
  672×816** (por eso el Nº 01 pasó de 17 a 27 páginas: la letra crece y el
  contenido fluye). El conector de Canva puede reproducir eso: `copy-design` +
  `format_text` (tamaño 1–800 px e interlineado por caja de texto) +
  `export-design` a PDF con texto real (sin aplanar).
- **Heyzine tiene API en todos los planes** y permite **actualizar el flipbook
  existente conservando la URL** (`POST /api1/rest` con el `id` del flipbook):
  tu enlace `heyzine.com/flip-book/c35d482d63.html`, incrustado en
  policastsapien.com, no cambia jamás — **el sitio no se toca**.
- **Facebook no exige App Review para tu caso.** Una app de Meta en modo
  desarrollo con acceso estándar puede publicar con `pages_manage_posts` en
  las Páginas que administra su propio desarrollador. Tú eres el desarrollador
  y el administrador de la Página PolicastSapiens: Antena puede publicar sin
  revisión de Meta, hoy. Los permisos que su OAuth ya pide son los correctos.

Los tres cables que faltan: (1) que `antena-publicar` sepa adjuntar **fotos**
(la tabla ya tiene `media_path` y el bucket `antena-media` existe; el código
hoy solo envía texto); (2) crear la app de Meta y conectar la Página; (3) el
guion del agente que produce la edición digital y las tarjetas de cada número.

## 2. Lo verificado de primera mano (no supuesto)

| Pieza | Verificación |
|---|---|
| Antena: OAuth X/FB, compositor, calendario, privada-primero, cron, observatorio | Código leído completo (`js/tools/antena.js`, 5 Edge Functions, 5 SQL) |
| Permisos FB que pide Antena | `pages_show_list, pages_read_engagement, pages_read_user_content, pages_manage_posts, read_insights` — justo los de publicar y observar |
| Canva: cuerpos de texto reales | Imprenta 13,33 px / digital manual 18,66–21,32 px, mismo lienzo 672×816 |
| `format_text` cambia tamaño de letra por código | Esquema real del conector (1–800 px, enteros; interlineado 0,5–2,5) |
| Resize/Magic Switch NO sirve | Prueba empírica: a 2× escala TODO proporcionalmente; la legibilidad relativa queda idéntica (y gasta créditos de IA) |
| Exportación PDF/PNG automática | Confirmada; PNG hasta 25 000 px para tarjetas |
| Heyzine API | Endpoints reconstruidos de clientes reales en producción (Pipedream oficial, metorial y otros): `/api1/rest` (+`id` = actualizar), `/flipbook-list`, `/flipbook-details`, `/embed-code`, `/flipbook-social`, `/bookshelf-*`, `/limits`, oEmbed público |
| X API 2026 | El nivel gratuito murió el 6-feb-2026; hoy es pago por uso (~$0.015/post, ~$0.20 si lleva enlace) — céntimos al mes, pero exige método de pago en developer.x.com |

Advertencia de limpieza: la prueba de resize dejó un diseño de test en tu
cuenta de Canva (`DAHRC3yMwAo`, copia 2× de la revista 01). Puedes borrarlo
desde Canva; **ningún diseño original se modificó** (las transacciones de
lectura se cancelaron sin guardar).

## 3. La arquitectura completa: un ciclo quincenal de divulgación

El día 14 del ciclo editorial (ver la primera investigación) termina con el
PDF del número publicado. Ahí empieza este segundo ciclo, todo disparable por
una rutina programada de Claude Code:

```
PDF de imprenta listo (D14)
   │
   ├─ 1. EDICIÓN DIGITAL (Canva, por el agente)
   │     copy-design del patrón digital → volcar textos del número nuevo
   │     → format_text: cuerpo ≥19 px (ideal 22–24), interlineado 1,35–1,5
   │     → validar miniaturas página a página → commit
   │     → export-design PDF (texto real, sin aplanar)
   │
   ├─ 2. FLIPBOOK (Heyzine, por el agente)
   │     POST /api1/rest con {pdf: <URL del export>, id: <flipbook de la revista>}
   │     → misma URL de siempre → policastsapien.com NO se toca
   │     → /flipbook-social: renovar título y miniatura del enlace
   │
   ├─ 3. TARJETAS (Canva, por el agente)
   │     export-design PNG de portada + 4-6 páginas/citas del número
   │     → tarjetas 1080×1350 listas para Facebook y WhatsApp
   │
   ├─ 4. CALENDARIO (Antena, por el agente + tu visto bueno)
   │     insertar 6-7 publicaciones programadas del ciclo (tabla §4)
   │     en antena_publicaciones, TODAS en modo privada-primero
   │     → tú las repasas en el teléfono y las vas haciendo públicas
   │     → pg_cron las publica; el observatorio las mide cada 4 h
   │
   └─ 5. RESUMEN (Antena → agente)
         al cierre del ciclo, informe de 1 página: qué post ganó,
         compartidos, alcance de no seguidores, comentarios pendientes
```

### Lo que hay que construir (en orden, cada pieza es pequeña)

1. **La app de Meta** (una vez, ~30 min): crearla en developers.facebook.com
   contigo como administrador, producto Facebook Login, redirect URI a la Edge
   Function de Antena que ya existe. Sin verificación de empresa, sin App
   Review. Conectar la Página desde Antena con el botón que ya está.
2. **Fotos en `antena-publicar`** (una tarde): al publicar, si la fila tiene
   `media_path`, subir la imagen con `POST /{page-id}/photos` (con `url`
   firmada del bucket `antena-media`) en lugar de solo texto; para álbumes,
   subir cada foto con `published=false` y adjuntarlas con `attached_media`.
   De paso, subir las llamadas de Graph API v21.0 → v26.0 (v21 muere el 21 de
   enero de 2027).
3. **El guion de la edición digital** (el trabajo grande del agente, se afina
   en 2-3 números): extracción del texto del diseño de imprenta, volcado al
   patrón digital, reglas de desborde (≈40 % más páginas), validación visual.
4. **El guion de tarjetas + carga del calendario** (sencillo una vez que 3
   funciona).
5. **Ensayo de Heyzine en un flipbook desechable** antes de tocar el real:
   crear uno de prueba, actualizarlo con `id`, confirmar que la URL no cambia,
   borrarlo. Solo entonces autorizar el flujo contra `c35d482d63`.
6. **Opcional**: conectar Google Analytics al flipbook (Heyzine no da API de
   estadísticas; su vía programática es GA4, y Antena podría jalarlas después
   con la misma lógica del recolector).

### El caso X (Twitter)

Antena ya lo soporta técnicamente, pero desde febrero de 2026 la API de X es
de pago por uso (el nivel gratuito se descontinuó; publicar un post con enlace
cuesta ~$0.20). Con 4-6 posts al mes son céntimos, pero exige registrar método
de pago en el portal de desarrollador. Recomendación: **empezar solo con
Facebook + WhatsApp** (donde está tu audiencia y el costo es cero) y decidir X
más adelante con datos del observatorio.

## 4. El calendario de contenido: de 1 revista salen 14 días de divulgación

Regla de oro verificada en los datos de 2025-2026: el alcance orgánico de una
Página ronda el 2-5 %, los posts con enlace externo son los más castigados, y
**los compartidos son el único crecimiento real de una página nueva**. Por
eso el enlace al flipbook va solo en 1-2 de cada 6 piezas; el resto es valor
autocontenido que viaja solo.

| Día | Pieza | Formato | ¿Enlace? |
|---|---|---|---|
| D1 | Portada + «ya está en línea el Nº» | Imagen (portada digital) | Sí, al flipbook |
| D2-3 | Tarjeta-cita del artículo estrella | Imagen 1080×1350 | No |
| D4-5 | Audio/video de NotebookLM (60-90 s) resumiendo el artículo estrella | Reel (declarado como IA) | En comentario |
| D6-7 | Tarjeta-dato de otra sección | Imagen | No |
| D8-9 | El argumento del artículo estrella en 4-6 láminas | Álbum | Última lámina |
| D10-11 | Aula / detrás de cámaras / M.E.T.A.S | Foto + texto | Ocasional |
| D12-13 | **Tarjeta para reenviar por WhatsApp** + pregunta a la audiencia | Imagen | No |
| D14 | Índice del número + «mañana sale el próximo» | Imagen | Sí |

Tres claves hondureñas:

- **La tarjeta para reenviar es la unidad estratégica.** Los paquetes de Tigo
  y Claro incluyen Facebook y WhatsApp, pero abrir el flipbook consume datos:
  la tarjeta contiene TODO el valor (cita, dato, consejo con el logo y una URL
  corta al pie), viaja gratis y llega donde el algoritmo no llega. Con la
  instrucción explícita, en el tono de usted del proyecto: «Reenvíe esta
  tarjeta a otra madre o padre de familia».
- **Los grupos de docentes son el multiplicador** (alcanzan 20-40 % de sus
  miembros contra 1-6 % de una página): compartes desde tu perfil personal,
  respetando las reglas de cada grupo y aportando contexto de colega, no spam.
  El mapeo de grupos concretos se hace dentro de Facebook (no es verificable
  desde fuera).
- **Horario**: probar 6-9 p. m. hora de Honduras, 3-4 publicaciones por
  semana, y dejar que el observatorio dirima con tus propios datos en 4-6
  semanas.

## 5. Ética en redes: más estricta que en el PDF

- **Menores: cero rostros identificables por defecto** en la página pública.
  Espaldas, manos, trabajos, aula general. La autorización que sirve para la
  revista **no cubre redes**: el consentimiento es específico por canal (qué,
  dónde, para qué, cómo se revoca). Si una pieza exige rostro: autorización
  escrita específica para redes + consentimiento del propio niño + jamás
  rostro-nombre-escuela juntos. Derecho de retiro inmediato y sin
  explicaciones. (El dato que lo justifica: la mayoría del material incautado
  a depredadores son fotos cotidianas tomadas de internet.)
- **Política de moderación publicada antes del primer conflicto** (post fijado
  + sección Información): qué es bienvenido (desacuerdo argumentado), qué se
  oculta (insulto, ataque personal, datos de menores) y qué se elimina y
  reporta (acoso, amenaza). Técnica: **ocultar, no borrar** — el troll y sus
  amigos siguen viendo su comentario y no escala.
- **La página opina en los artículos, no en los comentarios.** La revista ya
  le habla al Leviatán con nombre propio; en Facebook eso atrae coyuntura
  partidaria. Crítica argumentada: una respuesta pública con altura, una sola
  vez. La Página habla como la revista («nosotros»); tu perfil personal es el
  embajador en grupos — voces separadas, por protección mutua.
- **Etiqueta de IA de Meta**: el audio/video de NotebookLM se declara al
  publicar (y en el propio texto: «Resumen en audio generado con IA a partir
  del número»). Las gráficas de Canva sin IA generativa no llevan etiqueta; si
  un export arrastra metadatos de Content Credentials, Meta puede etiquetarlo
  solo — no es sanción, pero mejor declarar que ser etiquetado.
- **Anti-burnout**: una sola sesión de ~2 horas al cierre de cada número deja
  la quincena entera programada (el agente produce, tú apruebas); comentarios
  en 2 ventanas fijas al día, nunca en tiempo real; y si una quincena no hay
  energía, se publica solo la portada con el enlace — **la revista es el
  producto; la página es el altavoz**.

## 6. Medición: qué mirar y qué metas ponerse

Jerarquía para una página nueva (todo lo captura ya el observatorio):

1. **Compartidos** — el único crecimiento posible sin base de seguidores.
2. **Alcance de no seguidores** — mide si grupos y WhatsApp funcionan.
3. **Comentarios respondidos** — la bandeja de Antena es exactamente esta
   métrica; responder rápido alimenta el algoritmo.
4. **Clics al flipbook** — el «resultado» de cada número.
5. Seguidores como tendencia semanal. Los likes, al final.

Metas honestas a 6 meses desde cero, orgánico, en Honduras: **300-800
seguidores que comparten**, 1-2 posts «outlier» al mes (normalmente vía un
grupo), 30-60 clics al flipbook por número, 100 % de comentarios respondidos
en menos de 24 h. Quinientos seguidores que comparten valen más que dos mil
que no interactúan. Ritmo humano: 15 minutos semanales + la revisión
quincenal al cierre (donde el dato sí cambia decisiones) — el agente prepara
ese resumen desde el observatorio.

## 7. Advertencias honestas

- El proxy de esta sesión **bloqueó el acceso directo** a policastsapien.com,
  heyzine.com y developers.facebook.com: esos detalles llegaron por búsqueda
  con fuentes de 2025-2026 y por código de clientes reales, y los puntos
  finos van marcados «a verificar» en los informes de los agentes. Los tres
  ensayos obligados antes de producción: (1) actualizar un flipbook
  **desechable** de Heyzine por API y confirmar que su URL no cambia; (2) el
  primer post de la app de Meta en modo desarrollo (confirmar que se publica
  público y visible); (3) el estado de tu app de X tras la migración a pago
  por uso, solo si decides usar X.
- El sitio policastsapien.com no está entre los repositorios de esta sesión
  (solo M.E.T.A.S y F.A.R.O), pero la arquitectura lo vuelve irrelevante: la
  URL del flipbook no cambia, así que el sitio no necesita ediciones por
  número.
- En tu cuenta de Canva quedó el diseño de prueba `DAHRC3yMwAo` (test de
  resize, borrable). Ningún original fue modificado.
- Heyzine renderiza las páginas como imagen: los lectores de pantalla no leen
  el flipbook. Mitigación barata: dejar activada la descarga del PDF (texto
  real) y publicar también el enlace directo al PDF junto al flipbook.

## 8. Por dónde empezar

1. Crear la **app de Meta** y conectar la Página PolicastSapiens desde el
   botón de Antena que ya existe (30 minutos, una sola vez).
2. **Ensayo Heyzine** con flipbook desechable; localizar el `id` del real con
   `/flipbook-list`.
3. Construir el **guion de la edición digital** y probarlo con el Nº 02
   (contra una copia, nunca contra el original).
4. Extender **`antena-publicar` con fotos** y subir a Graph API v26.
5. Producir el primer **ciclo de 14 días** completo con el Nº 03: edición
   digital → Heyzine → tarjetas → calendario en Antena en modo
   privada-primero → tu visto bueno pieza por pieza.
6. Publicar la **política de moderación** y preparar los consentimientos de
   imagen específicos para redes antes del primer post con personas.
7. A las 4-6 semanas: primera revisión de datos del observatorio y ajuste de
   horarios/formatos con evidencia propia.

Los cuatro informes completos de los agentes (Facebook/Graph API, API de
Heyzine, estrategia y edición digital, con todas sus fuentes) quedan
disponibles como anexos de esta investigación.
