# Anexos · Investigación de divulgación en redes

Informes completos de los cuatro agentes de investigación (1 de agosto de 2026), con sus fuentes. Acompañan a `INVESTIGACION-DIVULGACION-REDES.md`.


---

# Anexo A · Facebook y X: publicación automática (Graph API, agosto 2026)

# Publicación automática en Facebook (Página "PolicastSapiens") y X desde Antena — estado agosto 2026

**Nota metodológica**: WebSearch funcionó con normalidad y todo lo citado abajo sale de fuentes de 2025-2026. WebFetch directo a `developers.facebook.com` y a varias guías devolvió 403 (bloqueo anti-bot/proxy del entorno), así que los detalles de los docs oficiales de Meta llegan vía resúmenes de búsqueda y fuentes secundarias recientes; los pocos puntos que vienen de conocimiento propio van marcados **[a verificar]**.

---

## 1) Meta Graph API para Páginas

**Permisos para publicar como Página** (los antiguos `publish_pages`/`manage_pages` murieron en 2020):
- `pages_manage_posts` — crear/editar/borrar publicaciones de la Página (el permiso central).
- Sus dependencias obligatorias: `pages_read_engagement` y `pages_show_list`.
- Para el observatorio de Antena: `read_insights` (métricas) y, para leer/responder comentarios, `pages_read_user_content` + `pages_manage_engagement` **[a verificar los dos últimos nombres contra el doc oficial; son los vigentes desde 2020]**.

**Modo desarrollo sin App Review — la pregunta clave: SÍ funciona para el caso de Josué.** Una app en modo desarrollo tiene acceso a *todos* los permisos con **Standard Access**, pero solo sobre usuarios con rol en la app (Administrador, Desarrollador, Tester) **y las Páginas que esos usuarios administran**. Es decir: si Josué es admin de la app de Meta y admin de la Página PolicastSapiens, puede obtener `pages_manage_posts` y publicar en esa Página **sin pasar App Review jamás**. App Review / Advanced Access solo se exige cuando la app debe operar Páginas de terceros (clientes). Las publicaciones que hace la Página son públicas normales — el modo desarrollo restringe *quién puede autorizar la app*, no la visibilidad de lo que la Página publica **[matiz a verificar en la práctica con el primer post]**.

**Duración de tokens — sigue igual en 2026:**
- Token de usuario corto (~1-2 h) → se intercambia por **long-lived** (~60 días) vía `GET /oauth/access_token?grant_type=fb_exchange_token`.
- El **Page Access Token derivado de un user token long-lived** (vía `/me/accounts` o `/{page-id}?fields=access_token`) **sigue sin caducar por tiempo** ("expires: never" en el Access Token Debugger). Puede invalidarse por otras causas: cambio de contraseña, revocación de permisos, chequeo de seguridad de Meta o app inactiva mucho tiempo. Antena debe guardar ese token en Supabase (server-side, como ya hace) y tener un aviso de "reconectar" por si se invalida.

**Endpoints:**
- Texto/enlace: `POST /{page-id}/feed` con `message` y opcionalmente `link` (la vista previa del enlace la genera Facebook; personalizar título/imagen del link exige dominio verificado **[a verificar]**).
- **Programación nativa**: mismo endpoint con `published=false` + `scheduled_publish_time` (timestamp UNIX). Ventana documentada: **entre 10 minutos y 30 días** desde la petición (los docs de Meta citan 10 min–30 días; guías 2026 hablan de mínimo ~20 min en la práctica). Los posts programados por API aparecen en el Planner de Business Suite y se identifican con `is_published` / `scheduled_publish_time`. Ojo: hay reportes de posts programados por API que tardan en aparecer en el timeline.
- Fotos: `POST /{page-id}/photos` con `url` (imagen accesible por HTTPS) o `source` (multipart) + `caption`/`message`. Para foto+vídeo se menciona además `pages_manage_metadata` en algunas guías **[a verificar]**.
- **Versión**: Antena usa v21.0 → **se retira el 21 de enero de 2027** (garantía de 2 años desde su salida en oct-2024). La versión vigente es **v26.0** (feb-2026). Conviene subir la versión en las Edge Functions este año; los endpoints de publicación de Páginas no cambiaron en v26.

## 2) Fotos, carruseles y PDF

- **Una imagen (portada de la revista) con texto**: un solo `POST /{page-id}/photos` con `url` + `caption`. Es el patrón ideal: portada + texto + enlace al flipbook de Heyzine en el caption.
- **Varias imágenes en un post (multi-foto)**: (1) subir cada imagen a `/photos` con `published=false` y recoger los IDs; (2) `POST /{page-id}/feed` con `message` y `attached_media=[{"media_fbid":"ID1"},{"media_fbid":"ID2"},…]`. Compatible con programación añadiendo `published=false` + `scheduled_publish_time` al paso 2 **[combinación a verificar en prueba real; está documentada en guías]**. El "carrusel" con tarjetas y enlaces individuales es formato de anuncios, no de post orgánico.
- **PDF: NO se puede.** No existe endpoint para adjuntar documentos/PDF a un post de Página. El único sitio de Facebook que aceptaba archivos eran los Grupos (`/group/files`), y la **Groups API se descontinuó en 2024**. La vía correcta para la revista es exactamente la que ya tiene: imagen(es) de página a `/photos` + enlace al flipbook de Heyzine (suscripción ya pagada) en el texto.

## 3) Límites y riesgos

- **Rate limits de Páginas**: con Page token la cuota es **por Página**: 4.800 llamadas × usuarios "engaged" por ventana deslizante de 24 h, más topes de CPU (`total_cputime`, `total_time`); se monitorean en las cabeceras `X-App-Usage` / `X-Business-Use-Case-Usage`. Para el volumen de Antena (2-4 posts/quincena + recolector cada 4 h ≈ 6-10 llamadas/día) es irrelevante: está a órdenes de magnitud del límite.
- **Política de automatización**: Meta prohíbe el spam — publicar "manual o automáticamente a frecuencias muy altas" — pero **permite explícitamente la automatización por rutas autorizadas** (la Graph API lo es). Una revista educativa quincenal con posts espaciados no roza ninguna línea. El riesgo real de las cuentas pequeñas es la *combinación* de frecuencia + señales de inautenticidad, que aquí no existen.
- **Etiquetado de contenido IA en 2026**: los posts orgánicos llevan etiqueta "Made with AI" / "AI info" desde mayo de 2026, aplicada por autodeclaración del creador **o automáticamente cuando Meta detecta señales de industria (C2PA/IPTC) en los metadatos del archivo**. Implicaciones para la revista:
  - Un diseño de Canva **sin** funciones generativas → sin etiqueta.
  - Si se usa Magic Media u otra IA de Canva, el export puede llevar Content Credentials (C2PA) y Meta puede etiquetar el post automáticamente; hay falsos positivos documentados por metadatos residuales tras reeditar. La etiqueta **no es una sanción** ni recorta alcance por sí sola; las penalizaciones fuertes (rechazo, strikes, −80 % de alcance) aplican a **anuncios** sin declarar y a contenido **fotorrealista engañoso** (personas/eventos falsos), no a gráficas editoriales de una revista escolar. Buena práctica: si una imagen lleva IA generativa, declararlo; si no la lleva pero el export arrastra metadatos, reexportar limpio.

## 4) Alternativa sin API: Meta Business Suite

- **Gratis** y nativo: el Planner programa posts (fecha entre 20 min y hasta 75 días según ayuda oficial, aunque en la práctica muchos administradores reportan ~29-30 días en 2026), sugiere horarios "activos", permite editar/reprogramar, y publicar a varias Páginas a la vez (Facebook + Instagram). No hace posts recurrentes y no sirve para perfiles personales.
- **No tiene API pública ni exportación del planner**: es una interfaz humana. No hay forma de que un agente/script cargue el calendario de Business Suite programáticamente — la vía programática de Meta **es** la Graph API; de hecho lo programado por API aparece luego en el propio Planner, así que ambas conviven bien.
- **Cuándo conviene**: si Josué quisiera cero mantenimiento y le bastara con que Claude Code le *prepare* los textos e imágenes y él los pegue a mano cada quincena. **Cuándo no**: en cuanto se quiere el circuito completo automatizado (agente compone → Antena programa → pg_cron dispara → observatorio mide), que es el objetivo declarado. Recomendación híbrida: Antena como motor, y Business Suite solo como panel de verificación visual de lo programado.

## 5) X (Twitter) API en 2026

- **El free tier ya no existe para altas nuevas**: el 6 de febrero de 2026 X lo descontinuó y pasó a **pay-per-use** por defecto: ~$0.015 por post creado (**$0.20 si el post lleva enlace**), $0.005 por lectura. Históricamente el free tier había bajado de 1.500 a 500 posts/mes en 2024.
- **Cuentas existentes**: los suscriptores de pago (Basic/Pro) quedaron grandfathered (Basic se auto-migró a pay-per-use desde el 1-jun-2026); **los usuarios del free tier recibieron un crédito único de $10 y fueron migrados a pay-per-use**. Traducción para Antena: si su app de X estaba en free tier, hoy publica contra crédito/tarjeta; con 2-4 posts con enlace al mes son ~$0.40-0.80/mes — trivial, pero exige método de pago en el portal de desarrollador. Verificar el estado de la app en developer.x.com antes de despertar el compositor.
- **OAuth 2.0 de Antena sigue vigente**: Authorization Code + PKCE; access token de **2 horas**; con scope `offline.access` se recibe **refresh token de un solo uso, válido ~6 meses, que rota en cada refresh** (guardar siempre el nuevo). Hay reportes recurrentes en la comunidad de refresh tokens invalidados aleatoriamente: Antena debe tratar el fallo de refresh como "reconectar cuenta", no como error fatal — encaja con su esquema de reintentos.

## 6) Veredicto práctico

**Sí: la vía Antena/Graph API es viable sin App Review** para una Página propia administrada por su propio desarrollador. Es exactamente el escenario que Standard Access + modo desarrollo cubren. Pasos concretos:

1. **App de Meta** en developers.facebook.com (tipo Business/Otro), con Josué como Administrador. No hace falta verificación de empresa ni App Review mientras la app solo toque Páginas que él administra. No hace falta añadir testers (él ya es admin).
2. **Producto Facebook Login** con la redirect URI apuntando a la Edge Function OAuth de Antena (ya construida). Solicitar en el flujo: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `read_insights` (+ `pages_read_user_content`, `pages_manage_engagement` para la bandeja de comentarios del observatorio).
3. **Tokens**: intercambiar el user token por long-lived (`fb_exchange_token`), pedir `/me/accounts`, guardar el **Page Access Token (no caduca)** en Supabase server-side. Programar en el observatorio un chequeo mensual del token (`/debug_token`) para detectar invalidaciones.
4. **Publicar**: `/photos` (portada + caption con enlace Heyzine) para el post estrella; `/feed` + `attached_media` para multi-foto; `published=false` + `scheduled_publish_time` (10 min–30 días) si se quiere que programe Facebook en vez de pg_cron — aunque con pg_cron ya operativo en Antena, publicar "en el minuto" con la propia cola es igual de válido y mantiene un solo calendario. El modo "privada primero" (`published:false` + botón Hacer Pública) sigue soportado.
5. **Versión**: migrar las llamadas de v21.0 (muere 21-ene-2027) a v26.0.
6. **Riesgos residuales**: (a) una app en desarrollo sin actividad prolongada puede ser marcada inactiva por Meta — el recolector cada 4 h de la Fase 5b ya lo evita; (b) si algún día un colega quisiera conectar *su* página, habría que darle rol de tester o pasar App Review; (c) en X, confirmar el estado post-migración pay-per-use antes de reactivar el compositor.

---

**Fuentes:**
- https://developers.facebook.com/docs/pages-api/ y https://developers.facebook.com/docs/pages-api/getting-started/ (docs oficiales; acceso directo bloqueado en este entorno, contenido vía resultados de búsqueda)
- https://developers.facebook.com/docs/development/build-and-test/app-modes/
- https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived/
- https://developers.facebook.com/docs/graph-api/overview/rate-limiting/
- https://singhamandeep.com/facebook-page-api-permissions-app-review/ y https://singhamandeep.com/what-is-meta-advanced-access/
- https://zernio.com/blog/schedule-facebook-posts-via-api
- https://posteverywhere.ai/blog/post-to-facebook-api
- https://postproxy.dev/blog/facebook-graph-api-posting-guide/
- https://www.ayrshare.com/blog/post-a-series-of-facebook-images-as-a-carousel/
- https://phppot.com/php/publishing-multi-photo-stories-to-facebook-using-php-sdk/
- https://www.sociablekit.com/get-facebook-page-access-token-never-expire/
- https://ppc.land/meta-blocks-47-commerce-endpoints-as-graph-api-v26-0-lands-today/ y https://www.ayrshare.com/solutions/meta-graph-api-versioning-survival-kit-staying-ahead-of-v21-v22-and-beyond/
- https://transparency.meta.com/policies/community-standards/spam/
- https://www.auditsocials.com/blog/meta-ai-generated-content-label-policy-2026 y https://primotech.com/meta-to-labe/ y https://coinis.com/blog/meta-ai-content-labeling-facebook-instagram-ads-2026
- https://c2pa.ai/content-credentials-guide y https://aimetadatacleaner.com/blog/why-instagram-labels-photos-ai-minor-edits-2025
- https://www.crowbert.com/how-to-schedule-facebook-posts y https://litcommerce.com/blog/how-to-schedule-posts-on-facebook/ y https://sproutsocial.com/insights/schedule-facebook-posts/
- https://socialbee.com/blog/schedule-posts-on-facebook-groups/ (fin de la Groups API)
- https://www.socialcrawl.dev/blog/x-twitter-api-2026 y https://postproxy.dev/blog/x-api-pricing-2026/ y https://opentweet.io/how-to/x-api-pay-per-use-explained y https://www.blotato.com/blog/twitter-api-pricing
- https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code y https://devcommunity.x.com/t/access-token-with-offline-access-expire-in-2-hours/191921 y https://devcommunity.x.com/t/refresh-token-expiring-with-offline-access-scope/168899

---

# Anexo B · API de Heyzine y automatización del flipbook

INFORME — API de Heyzine y automatización del flipbook de la Revista PolicastSapiens

Nota metodológica: el entorno de esta sesión bloqueó el acceso directo a heyzine.com (el proxy denegó la conexión y WebFetch devolvió 403 incluso para sitios neutrales). Todo lo siguiente se reconstruyó con WebSearch (que sí devolvió contenido real de heyzine.com/developers y de reseñas de precios 2026) y con código fuente real de clientes de la API de Heyzine publicados en GitHub (Pipedream oficial, metorial, dos clientes C# y una app en producción que hace el "update"). Los puntos que no pude confirmar contra la página oficial van marcados como A VERIFICAR.

---

1) AUTENTICACIÓN Y PLAN

Hay dos credenciales distintas, ambas visibles en la cuenta de Heyzine (sección Developers/API):

- Client ID: identificador "público" que se usa en el enlace de conversión y en conversiones cliente-side, como parámetro `k` (o `client_id`). Existe uno de demo: `d3m0`.
- API Key: secreta, para los endpoints de gestión REST. Se manda en cabecera: `Authorization: Bearer API_KEY`.

Plan: según dos fuentes independientes de 2026 (FlipLink y ZenFlip), la API está disponible en TODOS los planes, incluido el gratuito (limitado a 5 flipbooks). Los planes 2026 ya no se llaman Pro/Advanced sino: Standard ($4/mes, $49/año — quita marca de agua, logo propio), Professional ($14/mes, $99/año — estadísticas completas, Google Analytics, formularios de leads, subdominio propio) y Premium ($29/mes, $203/año — dominio propio CNAME, bookshelf, protección avanzada). A VERIFICAR en heyzine.com desde su cuenta cuál de estos corresponde a su suscripción anual; con que la API funcione con su key actual (probar `GET /api1/limits`) basta para el flujo propuesto.

2) ENDPOINTS (base: `https://heyzine.com/api1`) — extraídos de clientes reales

Conversión (autentica con `client_id`/`k`):
- `GET|POST /api1/rest` — conversión SÍNCRONA desde URL de PDF. Responde JSON: `{id, url, thumbnail, pdf, meta:{num_pages, aspect_ratio}}`. No hay upload directo del archivo: el parámetro `pdf` debe ser un ENLACE DIRECTO al PDF, sin redirecciones, URL-encoded. Acepta también DOCX y PPTX.
- `GET /api1/async` — igual pero asíncrona (responde con `state`; se consulta luego con flipbook-details).
- Parámetros de conversión (nombres largos en POST JSON / cortos en query): `pdf`, `client_id`/`k`, `title`/`t`, `subtitle`/`s`, `description`/`d`, `template`/`tpl` (id de un flipbook existente cuyo diseño y controles se copian — no copia listas de acceso ni interacciones), `background_color`/`bg` (hex sin #), `logo` (URL, plan Standard+), `download`, `full_screen`, `share`, `prev_next`/`nav`, `show_info`, `private_note`, `tags`, `rtl`, `pe` (efecto de página).

ACTUALIZAR MANTENIENDO LA MISMA URL (lo crítico): la descripción oficial de la API dice explícitamente que permite "update existing flipbooks", y hay código en producción (rrobin27/Virtual-Obit-1.1, server.ts) que lo hace así: `POST /api1/rest` con el payload normal MÁS `"id": "<id del flipbook existente>"` — reemplaza el PDF del flipbook conservando URL y ajustes. Además, la función "Replace PDF" del panel web hace exactamente eso a mano ("puede quitar y reemplazar el PDF sin cambiar el enlace"). A VERIFICAR con una prueba: hacerlo primero contra un flipbook desechable, nunca directamente contra `c35d482d63`.

Gestión (Bearer API_KEY):
- `GET /flipbook-list` (filtros `search`, `tags`) — aquí se obtiene el `id` exacto del flipbook de la revista.
- `GET /flipbook-details?id=...` — devuelve `{id, title, subtitle, description, url, thumbnail, pdf, pages, tags, created, links, oembed}`.
- `POST /flipbook-delete` `{id}`.
- `GET /embed-code?id=...&maxwidth=&maxheight=` — código de incrustación.
- `POST /flipbook-social` `{id, title, description, thumbnail}` — metadatos para compartir en redes (útil para Antena: renovar la tarjeta social en cada número).
- Protección/acceso: `POST /access-setup`, `/access-add`, `/access-remove` (un cliente los llama `/update-password` y `/access-list`; los nombres exactos A VERIFICAR en la doc).
- Estanterías: `GET /bookshelf-list`, `GET /bookshelf-flipbooks?id=`, `POST /bookshelf-add|remove|social` — una "hemeroteca" de números anteriores, interesante para la revista.
- `GET /limits` (Bearer) — límites de uso de la API de la cuenta.
- `GET /api1/oembed?url=...&format=json` — PÚBLICO, sin auth (es el proveedor oEmbed oficial registrado en Wagtail/WordPress): devuelve el HTML de embed responsive.

3) "CONVERSION LINK" (alternativa sin código de servidor)

`https://heyzine.com/api1?pdf={URL_DEL_PDF}&k={CLIENT_ID}` (+ los parámetros cortos de arriba). Es un enlace que, al abrirse, convierte y REDIRIGE al flipbook resultante. Ejemplo documentado: `https://heyzine.com/api1?pdf=https://codingfocus.com/sample.pdf&k=d3m0`, y con plantilla: `...&k=d3m0&tpl=02d4d12c08593f3d10a5f61338758eaa0bf67abd.pdf`. Sirve para probar en un minuto, pero CREA flipbook nuevo con URL nueva — no sirve para mantener `c35d482d63`. Para eso hace falta el `/rest` con `id`.

4) VISOR Y LEGIBILIDAD EN TELÉFONO

- Efectos/modos de página: magazine, book, slider/presentación, coverflow y "one page" (una sola página). Para leer en teléfono, el modo una-página o slider es lo más legible; en vertical el visor ya muestra página única y reajusta por dispositivo.
- Controles configurables: zoom (pellizco/doble toque), pantalla completa, descarga del PDF, compartir, navegación.
- Fondos: color sólido (`background_color`) o imagen de plantilla.
- Texto NO seleccionable y SIN soporte real de lectores de pantalla: las páginas se renderizan como imagen; reseñas de usuarios confirman que los screen readers no leen el contenido. Paliativos: la función de audio del editor (leer en voz alta al pasar página) y dejar activado `download` para ofrecer el PDF.
- Conclusión honesta: NINGÚN ajuste del visor sustituye la letra grande del PDF de origen. La copia digital con tipografía agrandada (el patrón "01_Digital_..." de 27 págs.) sigue siendo necesaria; lo que cambia es que el agente puede producirla (Canva permite duplicar/redimensionar/editar por API-MCP, y además existe la app oficial "Heyzine Flipbooks" dentro de Canva: canva.com/apps/AAGOptJ-N6g).

5) ESTADÍSTICAS Y WEBHOOKS (para el observatorio de Antena)

- Panel de estadísticas (planes Professional/Premium): visitas, páginas más vistas, tiempo por página, clics en enlaces y media dentro del flipbook.
- NO existe endpoint REST público de estadísticas (busqué en toda la base de código indexada de GitHub: nada de `/stats`). La vía programática oficial es la integración con Google Analytics (heyzine.com/how-to/google-analytics-for-flipbooks/): conectar GA4 y que Antena jale las métricas con la GA4 Data API, igual que ya jala Graph API cada 4 h.
- Webhooks: solo para LEADS (formularios de captura del flipbook). Se configuran en la interfaz de Heyzine — no por API. Antena puede recibirlos en una Edge Function de Supabase y guardarlos junto a las métricas de Facebook/X.

6) LÍMITES Y DOMINIO PROPIO

- Gratis: 5 flipbooks, páginas ilimitadas, 1 GB de almacenamiento, marca de agua. De pago: conversiones ilimitadas; el almacenamiento cuenta PDF original + medios subidos (referencia oficial: con PDF de 2 MB y plan de 10 GB caben ~5,000 flipbooks). No hay un tope de MB por PDF publicado explícito en lo que pude leer (A VERIFICAR en el FAQ); una revista de 20-27 págs. está lejísimos de cualquier límite.
- Dominio propio: sí — subdominio personalizado en Professional y dominio completo vía CNAME en Premium (p. ej. `revista.policastsapien.com`). También se puede personalizar el slug del enlace (heyzine.com/how-to/customize-a-flipbook-url/), pero NO conviene tocar el de `c35d482d63` que ya está incrustado.

7) VEREDICTO — FLUJO AUTOMATIZADO RECOMENDADO

Preparación (una sola vez):
a. Copiar Client ID y API Key de la cuenta Heyzine a secretos del entorno del agente (o a Supabase Vault si lo orquesta una Edge Function de Antena).
b. `GET /api1/flipbook-list` con Bearer → localizar el `id` interno del flipbook cuya `url` es `https://heyzine.com/flip-book/c35d482d63.html`.
c. Ensayo de seguridad: crear un flipbook desechable (`POST /rest`), actualizarlo (`POST /rest` + `id`), confirmar que su URL no cambia, borrarlo (`/flipbook-delete`). Solo entonces autorizar el flujo contra producción.

Cada quincena:
1. Canva (por MCP): duplicar el número de imprenta sobre el patrón digital "01_Digital_Revista_Policast_Sapien" (letra agrandada, 27 págs.) y exportar a PDF — la exportación devuelve una URL directa temporal, que es justo lo que Heyzine exige.
2. `POST https://heyzine.com/api1/rest` con `{pdf: <URL export Canva>, id: <id del flipbook de la revista>, client_id: ..., title: "Revista PolicastSapiens — <edición>", template: <mismo id, para conservar estilos>}`.
3. Verificar: `GET /flipbook-details?id=...` (que `pages` ≈ 27 y `url` siga siendo `.../c35d482d63.html`).
4. `POST /flipbook-social` con título/miniatura del nuevo número (así el enlace se ve fresco al compartirlo por Antena en Facebook/X).
5. El sitio policastsapien.com NO SE TOCA: el iframe apunta a la misma URL de siempre.
6. Métricas: GA4 conectado al flipbook → Antena las jala por GA4 Data API; leads (si activa formulario) → webhook a Edge Function.

Plan B si el update por `id` no funcionara en su plan: el flujo genera el PDF digital y lo deja listo, y el maestro usa "Replace PDF" en el panel de Heyzine (2 clics, conserva el enlace) — la automatización pierde solo ese último paso.

FUENTES
- https://heyzine.com/developers (doc oficial API; leída vía resultados de búsqueda)
- https://heyzine.com/developers/demo
- https://heyzine.com/faq
- https://heyzine.com/how-to/visitor-statistics/
- https://heyzine.com/how-to/google-analytics-for-flipbooks/
- https://heyzine.com/how-to/customize-a-flipbook-url/
- https://heyzine.com/feature/canva-flipbook
- https://www.canva.com/apps/AAGOptJ-N6g/heyzine-flipbooks
- https://raw.githubusercontent.com/PipedreamHQ/pipedream/master/components/heyzine/heyzine.app.mjs (cliente oficial Pipedream: base `https://heyzine.com/api1/rest`, auth `k`)
- https://raw.githubusercontent.com/metorial/metorial/main/integrations/heyzine/src/lib/client.ts (cliente completo: /rest, /async, /flipbook-list, /flipbook-details, /flipbook-delete, /embed-code, /flipbook-social, /bookshelf-*, /update-password, /access-list, /oembed, /limits)
- https://raw.githubusercontent.com/Bosqora/Heyzine/main/Bosqora.Heyzine/Constants/Constants.cs y Models/HeyzineConversionRequest.cs (parámetros completos de conversión, endpoints access-*)
- https://raw.githubusercontent.com/rrobin27/Virtual-Obit-1.1/main/server.ts (update en sitio: POST /api1/rest con `id`)
- https://github.com/wagtail/wagtail (oEmbed oficial: `https://heyzine.com/api1/oembed`)
- https://fliplink.me/blog/heyzine-pricing-plans-alternatives (planes 2026: Standard $4 / Professional $14 / Premium $29 al mes; API en todos los planes)
- https://zenflip.io/en/blog/heyzine-pricing-2026 (límites del plan gratis: 5 flipbooks, 1 GB)
- https://composio.dev/toolkits/heyzine (webhooks de leads: se configuran en la UI, no por API)
- https://pipedream.com/apps/heyzine (descripción oficial de capacidades de la API, incl. "update existing flipbooks")
- https://appsumo.com/products/heyzine-flipbooks/reviews/ (limitación de screen readers / texto no seleccionable)

---

# Anexo C · Estrategia de divulgación en redes (Honduras, 2026)

He completado la investigación con WebSearch y WebFetch reales. Nota metodológica: las búsquedas funcionaron con normalidad; los intentos de leer directamente datareportal.com, ilifebelt.com y naranjaymediahn.com devolvieron 403 (bloqueo anti-bot), así que las cifras de esas fuentes provienen de los resúmenes de búsqueda y de notas de prensa que las citan. Todo lo demás está verificado en las fuentes listadas al final.

---

# Estrategia de divulgación en redes para la Revista PolicastSapiens (página de Facebook nueva, agosto 2026)

## 1) Qué funciona hoy en Páginas de Facebook educativas/culturales en Centroamérica

**El terreno hondureño.** Honduras tiene ~7.19 millones de internautas (65.8% de penetración) y 4.62 millones de identidades en redes sociales (42.3% de la población). Facebook sigue siendo la red útil para una revista: 4.45 millones de usuarios (61.9% de los internautas), con TikTok ya en 4.36 millones y Messenger en 2.55 millones. El uso es abrumadoramente móvil y de tarde-noche (los estudios regionales de iLifebelt sitúan la interacción principal en la tarde y desde el celular). Traducción práctica: la audiencia del maestro y de las familias está en Facebook, en el teléfono, después de clases.

**Alcance orgánico de una página nueva.** El alcance orgánico medio de una Página es hoy del 2-5% de sus seguidores por publicación (1-2% en muchos análisis), frente al ~16% de 2012. Para una página con 0 seguidores esto tiene una lectura contraintuitiva y liberadora: **al principio el alcance no vendrá de la base de seguidores (no existe) sino de los compartidos** — cada vez que alguien comparte, la publicación entra en el feed de sus amigos con la fuerza de "contenido de amigos", que el algoritmo prioriza. Por eso la métrica reina de los primeros meses es el compartido, no el like (ver punto 5).

**Penalización por formato (consenso 2025-2026):**
- **Reels / video corto**: el formato con más alcance, típicamente 2-3x el de una foto; la actualización de Meta de octubre de 2025 hace aflorar ~50% más Reels de creadores que publicaron ese día.
- **Fotos / álbumes**: segundo lugar; los álbumes destacan en compartidos.
- **Posts con enlace externo**: sistemáticamente el peor alcance — Facebook castiga lo que saca al usuario de la plataforma.

Regla operativa para la revista: **el enlace al flipbook de Heyzine no puede ser el formato dominante**. De cada 5-6 publicaciones, solo 1-2 llevan el enlace (y aun así, mejor como post de imagen con el enlace en el texto o primer comentario); el resto es valor autocontenido (imagen, video) que construye alcance.

**Frecuencia y horarios para una página pequeña.** Los datos de páginas con menos de 1,000 seguidores muestran que la mayor tasa de engagement (mediana 6.1%) se logra con pocas publicaciones de calidad, no con volumen; el estándar recomendado es **3-5 publicaciones/semana**, y para un maestro que trabaja solo, 3-4/semana es el punto sostenible. Horarios: los estudios globales apuntan a martes-miércoles de mediodía a 8 p.m. y franjas de media mañana; el patrón centroamericano (móvil, vespertino) sugiere probar **6:00-9:00 p.m. hora de Honduras** y dejar que el observatorio de Antena (que ya recoge métricas cada 4 h) dirima empíricamente en 4-6 semanas. Ventaja del proyecto: Antena ya tiene compositor con calendario; la frecuencia se decide una vez y se programa.

**Grupos de Facebook: el multiplicador real.** Los grupos alcanzan al 20-40% de sus miembros por publicación, contra el 1-6% de las páginas — un multiplicador de ~10x. Un post en un grupo activo de 10,000 docentes llega a 2,000-4,000 personas; la página sola, a decenas. La táctica correcta: el **maestro, desde su perfil personal**, comparte la publicación de la página (o publica nativo con crédito a la revista) en grupos de docentes hondureños **respetando las reglas de cada grupo** y aportando contexto, no spam ("Preparé este material sobre X para mi 6º-1, por si les sirve"). Los nombres concretos de grupos (docentes de Honduras por departamento, por asignatura, PROHECO, concursos docentes) no son verificables desde esta sesión — hay que mapearlos a mano dentro de Facebook; la búsqueda externa solo confirma la presencia oficial de la Secretaría de Educación y de Educatrachos, que también son destinos para etiquetar/mencionar cuando el contenido lo amerite.

## 2) De UNA revista de 20 páginas a un calendario quincenal

Patrón editorial probado ("atomización"): un activo grande se descompone en 10-15 piezas nativas, cada una con valor completo por sí misma, y solo algunas enlazan al original. Aplicado al ciclo quincenal (14 días, ~6-7 publicaciones a 3-4/semana, con margen para 1-2 extra):

| Día | Pieza | Formato | ¿Enlace? |
|---|---|---|---|
| D1 (lanzamiento) | **Portada del número** + "ya está en línea" | Imagen (portada de la copia digital de Canva) | Sí, al flipbook |
| D2-D3 | **Tarjeta-cita 1**: la frase más potente del artículo estrella | Imagen 1080x1350 con la cita, diseño de marca | No |
| D4-D5 | **Video corto**: portada animada o Video Overview + audio de NotebookLM (Audio Overviews en español desde abril 2025; Video Overviews en 80+ idiomas desde agosto 2025) resumiendo el artículo estrella en 60-90 s | Reel | No (enlace en comentario) |
| D6-D7 | **Tarjeta-cita 2 / dato curioso** de otra sección | Imagen | No |
| D8-D9 | **"Hilo" del artículo estrella**: el argumento en 4-6 imágenes (álbum/carrusel), una idea por lámina | Álbum de fotos | Última lámina: "léalo completo", enlace en comentario |
| D10-D11 | **Detrás de cámaras / aula**: cómo se hizo el número, o el contenido conectado con M.E.T.A.S | Foto + texto | Ocasional |
| D12-D13 | **Tarjeta para reenviar por WhatsApp** (ver punto 3) + pregunta a la audiencia | Imagen | No |
| D14 | **Recordatorio de cierre**: "último día antes del próximo número" + índice del número | Imagen | Sí |

Claves del patrón: (a) cada pieza se entiende sin salir de Facebook; (b) la copia digital de Canva ("01_Digital_Revista_Policast_Sapien", con letra agrandada) es la **fuente única** de las tarjetas — exportar páginas sueltas como PNG es trivial y automatizable desde el agente con las herramientas de Canva; (c) las preguntas al final de cada post ("¿usted qué opina?", "etiquete a un colega") alimentan la señal de "interacción significativa" que el algoritmo premia; (d) el mejor post de cada número se recicla como "lo más leído" en el ciclo siguiente. Todo el calendario se carga de una sola vez en el compositor de Antena.

## 3) Facebook + WhatsApp en Honduras: el dúo que ya está pagado

Verificado: **Tigo Honduras incluye WhatsApp y Facebook en sus Paquetigos prepago y en pospago; Claro Honduras vende planes con "redes ilimitadas"**. Consecuencia estructural: para muchas familias, ver una imagen en Facebook o reenviarla por WhatsApp es gratis, pero abrir policastsapien.com o el flipbook de Heyzine consume datos del paquete. Por eso:

- **La "tarjeta para reenviar" es la unidad estratégica**: imagen vertical (1080x1350 o 1080x1920 para Estados) que contiene TODO el valor (la cita, el dato, el consejo a la familia), con el logo de la revista y una URL corta al pie. Viaja gratis, sobrevive a la compresión de WhatsApp, y lleva la marca a donde el algoritmo no llega.
- **Instrucción explícita de reenvío**, en el tono de usted que ya usa el proyecto con las familias: "Reenvíe esta tarjeta a otra madre o padre de familia". El reenvío en WhatsApp es el "compartir" invisible: no se mide, pero multiplica.
- **Canal de WhatsApp de la revista** (o listas de difusión + Estados del número del maestro): comunicación unidireccional, los números de los seguidores no se exponen, los mensajes admiten imagen/video y pueden reenviarse. Es el canal de "suscripción" natural para las familias que ya usan WhatsApp con la escuela — y M.E.T.A.S ya genera mensajes de WhatsApp, así que el hábito existe.
- Secuencia por número: la portada y las 2 mejores tarjetas se publican en Facebook **y** se empujan por WhatsApp el mismo día; el flipbook queda como destino para quien tiene wifi.

## 4) Ética específica de redes (más estricta que el PDF)

**Menores.** UNICEF y Save the Children documentan que la difusión cotidiana de imágenes de niños ("sharenting", también institucional) tiene riesgos reales: las imágenes pueden descargarse y manipularse, y el dato más citado es que **el 72% del material incautado a pedófilos son imágenes cotidianas no sexualizadas tomadas de internet**. Las guías escolares (AEPD, INCIBE, FUHEM) añaden el matiz clave para este proyecto: **una autorización "para fines educativos" o para la revista NO cubre redes sociales** — el consentimiento debe ser específico por canal, informando qué se publica, dónde, con qué fin y cómo revocarlo; y la buena práctica es **no publicar imágenes identificables de alumnos "en abierto"** (página pública) aunque sí puedan ir en materiales de circulación controlada. Reglas recomendadas para la página:
1. Por defecto, **cero rostros identificables de menores**: planos de espaldas, manos trabajando, aula general, trabajos sin nombre completo.
2. Si un contenido exige rostro: autorización escrita **específica para redes**, consentimiento del propio niño (UNICEF recomienda involucrarlo desde los 9-10 años), y nunca combinar rostro + nombre + escuela + rutinas.
3. Derecho de retirada inmediata: cualquier familia puede pedir que se baje una imagen, sin explicaciones.
4. El estándar de la revista PDF no se hereda: redes es otro consentimiento.

**Moderación publicada.** La página debe tener una política de moderación visible (post fijado y sección "Información") con: qué es bienvenido (desacuerdo argumentado, preguntas), qué se oculta o elimina (insultos, ataques personales, datos de menores, spam, difamación), y que la decisión es del equipo editorial. Las guías institucionales en español siguen exactamente ese esquema (se aceptan críticas; se remueven difamación, acoso y ataques personales). Publicarla ANTES del primer conflicto convierte la moderación en aplicación de reglas, no en censura.

**IA con etiqueta.** Meta aplica desde 2024-2025 la etiqueta **"Info de IA"**: el contenido fotorrealista generado por IA, o audio/video que pueda inducir a error, debe declararse al publicar (Meta también lo detecta por metadatos de credenciales de contenido), y no declararlo arriesga reducción de alcance o sanción; los ajustes menores (recorte, color) no la requieren. Para la revista: el audio/video de NotebookLM **se declara** — activar la etiqueta al publicar y, además, escribirlo en el propio post ("Resumen en audio generado con inteligencia artificial a partir del número 12"). Para textos asistidos por IA no hay etiqueta obligatoria, pero una revista educativa que enseña pensamiento crítico gana credibilidad con una línea de transparencia estable ("Esta revista se produce con asistencia de IA y revisión del editor").

## 5) Medición: qué mirar de verdad (y qué ignorar)

**Jerarquía de métricas para una página nueva** (todas capturables por el recolector de Antena vía Graph API):
1. **Compartidos** — el único crecimiento posible sin base de seguidores.
2. **Alcance, separando seguidores vs. no seguidores** — el % de no seguidores mide si los compartidos y los grupos están funcionando.
3. **Comentarios (y si fueron respondidos)** — la bandeja de comentarios sin responder que ya tiene el observatorio es exactamente la métrica correcta: responder rápido alimenta el algoritmo.
4. **Clics al enlace** del flipbook (el "resultado de negocio" de cada número).
5. **Crecimiento semanal de seguidores** — tendencia, no cifra absoluta.
6. Likes: al final de la lista. El engagement medio de Facebook ronda un magro 0.15% sobre impresiones; en páginas <1,000 seguidores la mediana buena es ~6% sobre engagement — la escala pequeña juega a favor.

**Metas realistas a 6 meses desde cero** (educativa, hondureña, orgánica, sin pauta): los benchmarks de crecimiento "sano" hablan de 2-3% mensual sobre bases existentes, lo que en frío no aplica; para una página nueva con estrategia de grupos + WhatsApp, un rango honesto es **300-800 seguidores**, 1-2 publicaciones "outlier" por mes (alcance 5-10x la media, normalmente vía un grupo), 30-60 clics al flipbook por número, y 100% de comentarios respondidos en <24 h. Si a los 6 meses hay 500 seguidores que comparten, la página va bien; si hay 2,000 comprados o casuales que no interactúan, va mal.

**Cadencia de revisión.** Antena recolecta cada 4 h: perfecto para la máquina, excesivo para el humano. Ritmo recomendado: **15 minutos semanales** (comentarios + qué post ganó la semana), **revisión quincenal al cierre de cada número** (qué formato del ciclo anterior repetir/eliminar — aquí es donde el dato cambia decisiones), y **una mirada mensual de tendencia** (seguidores, alcance de no seguidores, mejor horario según los datos propios). El agente puede preparar ese resumen quincenal automáticamente desde los datos del observatorio.

## 6) Riesgos y cómo contenerlos

**Burnout del maestro-community-manager.** La evidencia sobre creadores en solitario converge: procesar por lotes ("batching") con calendario reduce 50-70% el tiempo frente a publicar sobre la marcha, y quienes trabajan con 3-5 pilares de contenido definidos producen ~60% más rápido con menos desgaste. Diseño anti-burnout para este proyecto: **una sola sesión de ~2 horas al cierre de cada número** produce las 6-7 piezas de la quincena (el agente genera borradores de tarjetas desde la copia digital de Canva; Antena las programa); responder comentarios en 2 ventanas fijas al día, nunca en tiempo real; el modo "privada primero" de Antena (published:false + botón Hacer Pública) es el amortiguador ideal — nada sale sin una mirada humana de 30 segundos, pero la producción no depende del ánimo del día. Regla de oro: si una quincena no hay energía, se publica solo la portada y el enlace; la revista es el producto, la página es el altavoz.

**Comentarios hostiles (la revista opina sobre el "Leviatán"/Estado).** La práctica profesional distingue: crítica argumentada → se responde una vez, públicamente y con altura, y no se re-responde; troleo e insulto → **ocultar, no borrar** (el autor y sus amigos siguen viéndolo, así que no escala; borrar sí escala), y el ocultado es reversible; acoso o amenaza → eliminar, reportar y bloquear. La política publicada del punto 4 es el escudo. Cautela específica hondureña: un docente es figura pública local y el clima político es inflamable; la página **opina en los artículos, no en los comentarios** — el debate partidario de coyuntura no se libra desde la cuenta de la revista.

**Voz personal vs. voz institucional.** Las guías para educadores (Ohio EA, ConnectSafely, distritos de EE. UU.) coinciden: cuentas separadas, expectativas de visibilidad claras, sin interacción con alumnos desde el perfil personal, y las opiniones personales marcadas como tales. Aplicado aquí: la **Página habla como la revista** ("nosotros", de usted a las familias, de tú al maestro lector, según la norma del proyecto); el **perfil personal de Josué** es el embajador que comparte en grupos y conversa como colega, pero sus opiniones personales no se publican desde la página ni viceversa. Beneficio lateral: si un comentario hostil apunta a la persona, la página no está obligada a responder; si apunta a la revista, la persona no tiene que sentirlo como ataque propio. Y las claves de la página deben vivir en Meta Business Suite con la página como activo transferible — la revista debe poder sobrevivir a su fundador.

---

## Fuentes

**Alcance, formatos y algoritmo (2025-2026)**
- https://sproutsocial.com/insights/organic-reach/
- https://blog.hubspot.com/marketing/facebook-organic-reach-declining
- https://blog.hootsuite.com/organic-reach-declining/
- https://hashmeta.com/insights/facebook-algorithm-changes-2025
- https://www.socialpilot.co/blog/facebook-algorithm
- https://fbgroupbulkposter.com/blog/facebook-organic-reach-2026
- https://www.brandwatch.com/blog/facebook-algorithm/

**Frecuencia y horarios**
- https://sproutsocial.com/insights/best-times-to-post-on-facebook/
- https://sproutsocial.com/insights/how-often-to-post-on-social-media/
- https://www.marketingscoop.com/marketing/cracking-the-code-on-facebook-posting-frequency-insights-from-13500-businesses/
- https://www.socialchamp.com/blog/how-often-should-you-post-on-facebook/

**Honduras y Centroamérica**
- https://datareportal.com/reports/digital-2025-honduras (fetch directo bloqueado; cifras vía resúmenes)
- https://proceso.hn/tiktok-asume-reinado-de-redes-sociales-en-honduras-con-4-5-millones-de-cuentas/
- https://ilifebelt.com/estudios/uso-de-internet-y-redes-sociales-en-honduras-2025/ (fetch directo bloqueado)
- https://www.tigo.com.hn/postpago
- https://www.claro.com.hn/personas/servicios/servicios-moviles/pospago/
- https://prepaid-data-sim-card.fandom.com/wiki/Honduras
- https://educatrachos.hn/ y https://www.facebook.com/educacionhnd/

**Reutilización de contenido y WhatsApp**
- https://editorialge.com/repurposing-strategies-for-articles/
- https://www.margaretbourne.com/how-to-repurpose-blog-content/
- https://sproutsocial.com/insights/social-media-calendar/
- https://blog.hubspot.es/marketing/canal-de-whatsapp
- https://burutu.eus/marketing-educativo-herramientas-de-whatsapp-en-los-centros-educativos/
- https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-audio-overviews-50-languages/
- https://blog.google/innovation-and-ai/models-and-research/google-labs/notebook-lm-audio-video-overviews-more-languages-longer-content/

**Ética: menores, moderación, IA**
- https://www.unicef.org/uruguay/crianza/digital/que-es-el-sharenting
- https://www.unicef.org/peru/crianza/seguridad-en-linea/sharenting-que-debes-saber-acerca-compartir-informacion-hijos-en-linea
- https://www.savethechildren.es/actualidad/imagenes-en-la-red-fuera-de-control-los-riesgos-del-sharenting
- https://www.incibe.es/menores/blog/como-difundir-como-centro-escolar-imagenes-de-los-menores-en-rrss
- https://www.aepd.es/prensa-y-comunicacion/blog/pueden-los-colegios-tomar-imagenes-de-los-alumnos-durante-su-actividad
- https://escuelainfantilpippi.fuhem.es/wp-content/uploads/2023/04/Guia-para-el-tratamiento-de-imagenes-de-menores-1-1.pdf
- https://www.cilsa.org/normas-de-convivencia-en-facebook/
- https://transparency.meta.com/governance/tracking-impact/labeling-ai-content/
- https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/
- https://influencermarketinghub.com/ai-disclosure-rules/

**Medición y benchmarks**
- https://www.socialinsider.io/blog/facebook-metrics/
- https://www.socialinsider.io/social-media-benchmarks/facebook
- https://buffer.com/insights/facebook-benchmarks
- https://www.nptechforgood.com/101-best-practices/social-media-statistics-for-nonprofits/
- https://www.swydo.com/blog/facebook-organic-metrics/

**Burnout, moderación de hostiles y voz del docente**
- https://skedsocial.com/blog/the-quiet-burnout-of-social-media-managers
- https://truescho.com/en/blog/batch-create-monthly-social-content-2026
- https://www.genexmarketing.com/2025/11/07/managing-social-media-burnout/
- https://www.agorapulse.com/blog/facebook-page-management-tips/hide-comments-on-facebook/
- https://www.acmstrategies.com/post/facebook-comment-moderation
- https://commentguard.io/what-does-it-mean-to-hide-a-comment-on-facebook/
- https://www.ohea.org/social-media-guidelines-for-educators/
- https://connectsafely.org/eduguide/
- https://www.philasd.org/communications/socialmediaguide/

**No verificable desde esta sesión** (marcar para comprobación manual dentro de Facebook): nombres y tamaños exactos de grupos de docentes hondureños, y los horarios óptimos específicos de la audiencia propia (deben salir de los datos del observatorio de Antena tras 4-6 semanas de publicación).

---

# Anexo D · Edición digital automática en Canva (verificación de primera mano)

# Edición digital automática de la Revista PolicastSapiens — investigación y veredicto (agosto 2026)

**Nota de método**: el conector MCP de Canva de esta sesión está activo y conectado a la cuenta del maestro, así que casi todo lo de abajo es **evidencia de primera mano** (leí los diseños reales e hice una prueba empírica de resize). WebFetch directo a canva.com, canva.dev y heyzine.com devolvió 403 a través del proxy del entorno; para esos puntos me apoyé en WebSearch y en la herramienta oficial de ayuda de Canva. Lo no verificado va marcado como "a verificar".

**Datos duros obtenidos de la cuenta de Canva del maestro** (verificados en esta sesión):

| Diseño | ID | Págs. | Lienzo | Cuerpo de texto |
|---|---|---|---|---|
| 01_Revista_Policast_Sapien (imprenta) | `DAHLlqKlZiQ` | 17 | 672×816 px (7×8,5″ @96dpi) | 13,33 px, interlineado 1,08–1,24 |
| 01_Digital_Revista_Policast_Sapien (patrón manual) | `DAHM8DQoFEs` | 27 | **672×816 px (¡el mismo!)** | 18,66–21,32 px, interlineado 1,14 |
| 02_Revista_Policast_Sapien (número actual) | `DAHOJXzRcDI` | 20 | 672×816 px | (misma familia de estilos) |

Hallazgo clave: **el maestro no agranda el lienzo para la edición digital; agranda la letra (~+40–60 %) sobre el mismo lienzo y deja que el contenido fluya a más páginas (17→27)**. Eso es reflow real, y es exactamente lo que hay que automatizar.

---

## 1) Magic Switch / Resize: probado empíricamente — NO sirve para agrandar la letra

Hice la prueba real: redimensioné `01_Revista` de 672×816 a 1344×1632 (2×) con `resize-design`. Resultado, elemento por elemento en la página 3:

- Cuerpo: 13,333 → 26,667 px (exactamente 2×)
- Titular: 32,417 → 63,706 px (2×)
- Kicker "ACTUALIDAD": 12,418 → 24,403 px (2×)
- Entradilla, folios, capitular: todo 2×, posiciones y grosores de línea también 2×.

Conclusiones:
- **Sí escala la tipografía proporcionalmente** con el lienzo. Es un cambio de lienzo con zoom uniforme: la relación letra/página queda idéntica.
- Por tanto **es inútil para la edición digital**: el flipbook escala la página al ancho del teléfono, así que lo único que importa es el tamaño de la letra *relativo a la página*, y Resize no lo cambia ni un punto.
- Crea un **diseño nuevo** (no toca el original). La prueba dejó creado `DAHRC3yMwAo` ("01_Revista_Policast_Sapien", 17 págs., 1344×1632) en la cuenta — el MCP no puede borrar diseños; el maestro puede eliminarlo o ignorarlo.
- Disponibilidad (según la ayuda oficial de Canva consultada vía MCP): Resize está en **Pro**, Business, Education, Enterprise y Nonprofit, y **cada uso descuenta del límite mensual de usos de IA**. Otro motivo para no meterlo en un flujo automático quincenal.

## 2) Connect API / MCP: SÍ se puede cambiar el tamaño de fuente por API

Verificado contra el esquema real del conector MCP de Canva de esta sesión. `edit-design` funciona con transacciones (`read-design` con `open_transaction:true` → operaciones → `commit`/`cancel`, con miniaturas antes/después para validar). Su operación **`format_text`** soporta, por elemento de texto:

- **`font_size`: 1–800 px (solo enteros** — ojo: los diseños del maestro usan tamaños fraccionarios tipo 13,3333; al reformatear por API se redondea);
- `line_height` 0,5–2,5; `color` hex; `font_weight` normal/bold (**no hay semibold**, que el titular sí usa — no tocar pesos existentes); `font_style`, `decoration`, `strikethrough`, `text_align`, `link`, listas (nivel y marcador).
- **No soporta**: cambiar familia tipográfica, letter-spacing, ni formatear un rango dentro de la caja (aplica a la caja entera; las negritas internas por regiones se leen con `read-design` pero `format_text` es a nivel de elemento).

Además: `replace_text` y `find_and_replace_text` (contenido), `resize_element` (en texto solo ancho; alto se recalcula → perfecto para reflow), `position_element`, `add_text` (con ancho = caja con salto de línea automático), `add_page` (hasta 8000 px), `reorder_page`, `delete_element`, `update_text_anchoring`, `group/ungroup`, `update_fill` (cambiar imagen de un marco), `insert_shape`, etc. `read-design` en modo transacción devuelve **todo el CDF**: cada caja con posición, tamaño, fontSize, interlineado, color y el texto por regiones (así saqué las tablas de arriba).

En la Connect API REST pública, la **Design Editing API ya está disponible de forma general en 2026** (leer y editar páginas y elementos, incluidos tamaño, posición y estructura); los tamaños de fuente se expresan en px. Para este proyecto da igual: el conector MCP ya expone todo lo necesario desde Claude Code sin escribir un cliente REST.

## 3) Alternativas de flujo (foco: legibilidad en móvil)

**(a) Plantilla "Digital" separada con reflow real — LA BUENA.** Es el patrón que el maestro ya hace a mano (mismo lienzo, letra 18,7–21,3 px, más páginas). Automatizable: `copy-design` de la edición digital anterior (o del número nuevo de imprenta) → leer todo el texto del diseño de imprenta → volcar y reformatear. Pros: única opción con reflow real (letra grande *y* líneas de largo legible, 45–70 caracteres); conserva la identidad visual Canva; el resultado vive en Canva y el maestro puede retocarlo. Contras: es la que más lógica de agente exige (paginar el texto desbordado, decidir qué imagen va en qué página); requiere validar miniaturas página a página.

**(b) Resize del diseño de imprenta — DESCARTADA** por la prueba del punto 1: escala todo proporcionalmente, legibilidad relativa idéntica, y encima gasta créditos de IA.

**(c) PDF de imprenta tal cual + zoom del flipbook — DESCARTADA.** Cuerpo de 13,3 px en una página de 672 px de ancho: en un teléfono de ~360 px de ancho la página se pinta a ~0,54× → letra efectiva de **~7 px**. Ilegible sin zoom; y con zoom, en Heyzine se hace pan por columna sobre una página **rasterizada como imagen** (la nitidez al ampliar depende de la resolución de render del plan). Es exactamente el problema que llevó al maestro a hacer la copia digital a mano.

**(d) HTML→PDF con Playwright (ya está en el proyecto) — PLAN B SÓLIDO.** Plantilla HTML a una columna, cuerpo 17–20 px, interlineado 1,5, imágenes exportadas de Canva; Chromium imprime a PDF con texto real y puede generar **PDF etiquetado** (`generateTaggedPDF`). Pros: determinista, gratis, sin créditos de Canva, control tipográfico total, el PDF más accesible de todas las opciones. Contras: pierde el acabado de diseño de Canva (la revista dejaría de "parecerse a sí misma"); hay que construir y mantener la plantilla; extracción de imágenes aparte.

## 4) Tipografía para leer en teléfono (y por qué la carta de imprenta fracasa)

- **Referencia universal**: cuerpo mínimo **16 px CSS** *renderizados en pantalla* (default de todos los navegadores y mínimo recomendado por las guías de mobile-friendliness); interlineado **≥1,5** para cuerpo (criterio WCAG 1.4.12); contraste **4,5:1** texto normal y **3:1** texto grande (≥24 px, o ≥18,7 px en negrita) (WCAG 1.4.3); texto ampliable al 200 % sin pérdida (1.4.4).
- **Traducido al lienzo de 672 px**: con la página a ancho completo en un teléfono de ~360–412 px, el factor es ~0,54–0,61. Para leer **sin zoom** en vertical harían falta ~26–29 px de cuerpo en el lienzo. El patrón manual del maestro (18,7–21,3 px → ~10–13 px efectivos) se lee con un zoom ligero o en horizontal, que es un compromiso razonable para no disparar el número de páginas. Recomendación concreta para el flujo: **cuerpo ≥19 px (ideal 22–24 px), interlineado 1,35–1,5** (el 1,08–1,24 de imprenta es demasiado prieto para pantalla), titulares ≥34 px, y ninguna caja de menos de 14 px salvo folios.
- **Contraste actual: aprobado.** Texto #000001 sobre fondo crema #f7f1e6 ≈ 17:1; titulares #102742 sobre crema ≈ 12:1. Ambos superan AAA. Los filetes dorados #b8862b son decorativos.
- **Por qué un PDF carta de imprenta se lee mal en flipbook móvil**: (1) se diseñó para leerse al 100 % a ~30 cm y el teléfono lo encoge a la mitad; (2) sus 2–3 columnas obligan a zoom+pan serpenteante por columna; (3) el flipbook rasteriza la página, así que el zoom amplía píxeles, no vectores; (4) interlineados de imprenta (1,1) empeoran aún más en pantallas pequeñas.

## 5) Accesibilidad de los exportes

- **El PDF de Canva lleva texto real, no curvas**, siempre que NO se marque "Flatten PDF" al exportar (aplanar convierte todo en imagen y mata selección y etiquetas). El exporte vía API/MCP (`export-design`, tipo `pdf`) no expone opción de aplanado: sale sin aplanar, con texto seleccionable. Caveat menor: alguna fuente con licencia restrictiva puede salir sin incrustar/convertida — comprobar una vez con `pdffonts`.
- Canva soporta **entradas de accesibilidad**: alt text, semántica de encabezados ("Edit text semantics"), idioma del documento y orden de lectura por capas, que se trasladan al PDF etiquetado; los evaluadores externos advierten que aun así **no es plenamente conforme con WCAG** (orden de lectura y errores de etiquetas frecuentes).
- **Heyzine es el eslabón inaccesible**: pinta las páginas como imágenes; los lectores de pantalla no leen el contenido (limitación reconocida; existe una función de audio por página como paliativo). Mitigación obligada y barata: **activar en Heyzine la descarga del PDF** y publicar también el enlace directo al PDF (texto real y seleccionable) junto al flipbook en policastsapien.com.

## 6) VEREDICTO: flujo recomendado para Claude Code

**Pipeline "Edición Digital" (opción a, nativa de Canva, vía MCP), por número:**

1. **Extraer**: `read-design` (con transacción de solo lectura, luego `cancel`) sobre el diseño de imprenta del número (p. ej. `DAHOJXzRcDI`): texto completo por regiones, orden, jerarquía (titular/kicker/cuerpo/pies, detectables por fontSize y fontRef) e IDs de imágenes.
2. **Clonar patrón**: `copy-design` de la última edición digital (`DAHM8DQoFEs` como plantilla de facto) → "0N_Digital_Revista_Policast_Sapien".
3. **Volcar y reformatear**: en la copia, `replace_text` sección a sección; `format_text` para garantizar cuerpo ≥19 px e interlineado ≥1,35; `resize_element`/`position_element` para las cajas; `add_page` cuando el texto desborde (regla ~40 % más de páginas que la de imprenta: 20 → ~27–28); `update_fill` para colocar las imágenes del número. Validar cada página con la miniatura post-edición y solo entonces `commit`.
4. **Exportar**: `get-export-formats` → `export-design` PDF (calidad pro, sin aplanar → texto seleccionable).
5. **Publicar**: subir el PDF a Heyzine. Heyzine ofrece API REST de conversión PDF→flipbook en planes de pago y la posibilidad de reemplazar el PDF de un flipbook conservando la URL (**a verificar** en la cuenta anual del maestro: heyzine.com/api-pdf-to-flipbook; el 403 del proxy me impidió confirmarlo); si la API no estuviera en su plan, este paso queda como único clic manual. Publicar además el enlace de descarga del PDF (accesibilidad).
6. **Retoque humano mínimo**: revisión visual del flipbook por el maestro antes de anunciarlo (portada, cortes de página, pies de foto). Todo lo demás es automatizable hoy con las herramientas ya conectadas.

**Plan B** si el volcado en Canva resulta frágil en la práctica (paginación caprichosa): interior HTML→PDF con Playwright (opción d, tipografía 17–20 px, PDF etiquetado) conservando en Canva solo portada y páginas gráficas, y fusionando PDFs. Más accesible, menos "Canva".

**Limpieza pendiente**: la prueba de resize dejó el diseño de test `DAHRC3yMwAo` (copia 2× de la revista 01) en la cuenta de Canva; puede borrarse desde la interfaz de Canva (el conector no borra diseños). No se modificó ningún diseño original (todas las transacciones de lectura se cancelaron).

---

**Fuentes**

- Evidencia de primera mano: conector MCP de Canva de esta sesión (esquema de `edit-design`/`format_text`, lecturas CDF de `DAHLlqKlZiQ`, `DAHM8DQoFEs`, `DAHOJXzRcDI` y prueba de resize → `DAHRC3yMwAo`), 1 ago 2026.
- [Resize designs and size limits — Canva Help](https://www.canva.com/help/resize/) · [Magic Resize — Canva Pro](https://www.canva.com/pro/magic-resize/) · [Everything about Canva Magic Resize — CapCut](https://www.capcut.com/resource/canva-magic-resize)
- [Canva Connect APIs — docs](https://www.canva.dev/docs/connect/) · [Changelog Connect APIs](https://www.canva.dev/docs/connect/changelog/) · [Launching to all: Connect APIs — Canva Developers Blog](https://www.canva.dev/blog/developers/launching-to-all-connect-api/) · [Design Editing API — Apps SDK docs](https://www.canva.dev/docs/apps/design-editing/) · [Canva newsroom: biggest API update](https://www.canva.com/newsroom/news/new-apis-data-connectors/)
- [PDF accessibility features — Canva Help](https://www.canva.com/help/pdf-accessibility-features/) · [Edit text semantics — Canva Help](https://www.canva.com/help/edit-text-semantics/) · [Making Canva PDFs Accessible — Allyant](https://support.allyant.com/support/solutions/articles/156000382271-making-canva-pdfs-accessible) · [Canva accessibility — Boise State](https://www.boisestate.edu/accessibility/home/resources/canva-accessibility-resources/) · [Guía KATS (mar 2026, PDF)](https://www.katsnet.org/wp-content/uploads/2026/03/Creating-and-Exporting-Accessible-PDFs-Using-Canva-Revised-3-19-26.pdf)
- [Heyzine](https://heyzine.com/) · [Reseña de accesibilidad de Heyzine — AppSumo](https://appsumo.com/products/heyzine-flipbooks/reviews/it-works-but-not-accessible-163162/) · [Heyzine Review — FlipHTML5](https://fliphtml5.com/blog/heyzine-review-why-heyzine-is-now-my-go-to-flipbook-maker/)
- [Mobile-first typography y WCAG — Kittl](https://www.kittl.com/blogs/mobile-first-typography-wcag-standards-fnt) · [Font size requirements WCAG — font-converters.com](https://font-converters.com/accessibility/font-size-requirements) · [Best font sizes for readability — GReadMe](https://www.greadme.com/blog/seo/best-font-sizes-for-readability-complete-guide) · [Mobile typography accessibility — fontfyi](https://fontfyi.com/blog/mobile-typography-accessibility/)