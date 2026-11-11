# PLAN — Kit de Autocapacitación Técnica M.E.T.A.S
### Actividad metalingüística: aprender de lo que construimos

**Para:** Josué Polanco (autor del sistema)
**Objetivo:** que puedas explicar M.E.T.A.S en todos sus aspectos —generales y
específicos, funciones, seguridad, decisiones técnicas— ante un ingeniero que
te interpele o cuestione, con seguridad y con tus propias palabras.
**Fecha del plan:** 17 de julio de 2026

---

## 1. Qué es este kit (y qué no es)

- **No es** documentación para programadores (eso ya existe en los .md del repo).
- **Es** material de ESTUDIO para el autor: cada módulo te lleva de la vista
  panorámica al detalle, con diagramas, lectura guiada del código real,
  una actividad metalingüística («explícalo con tus palabras») y una batería
  de **preguntas de interpelación con respuesta modelo** — el simulacro del
  ingeniero que cuestiona.
- Formato: **páginas HTML imprimibles tamaño carta** (mismo molde que
  kit-capacitacion.html), una por módulo: `kit-auto-1.html` … `kit-auto-8.html`.
  Diagramas en SVG embebido (imprimen nítidos, sin internet).

## 2. Los 8 módulos

### Módulo 1 — Panorama: ¿qué es M.E.T.A.S técnicamente?
- App web estática (HTML/CSS/JS puro, sin frameworks ni compilación) +
  PWA (service worker, instalable) + APK Android (Capacitor) + nube Supabase.
- **Diagrama maestro:** los 4 frentes (web GitHub Pages · PWA · APK · nube)
  y quién usa cada uno (alumno, maestro, familia, dirección).
- Interpelación tipo: *«¿Dónde está tu servidor?»* → no hay servidor propio:
  frontend estático en GitHub Pages + backend-as-a-service (Supabase).
  *«¿Y si GitHub o Supabase se caen?»* → offline-first: la app funciona sin red.

### Módulo 2 — El frontend: mapa de piezas
- `index.html` (13 vistas), las **57 misiones** (estructura de
  3 archivos, 14 secciones), Zona Docente y sus 7 herramientas
  (`js/tools/`: plan-accion, registros-admin, campeonismo, gobierno-escolar,
  parte-mensual, collage-maker, pwa-install), páginas satélite
  (`padres.html`, `panel-docente.html`, `consulta-nube.html`, `registro.html`,
  `camp-vivo.html`, `evaluaciones.html`) y capas comunes (`metas-registro.js`,
  `metas-dialogos.js`, `metas-presentacion.js`).
- **Diagrama:** árbol del repositorio con responsabilidad de cada carpeta.
- Interpelación: *«¿Por qué no usaste React/Angular?»* → respuesta modelo
  (cero dependencias frágiles, imprime/carga en escuelas con internet pobre,
  mantenible por una persona, sin build step).

### Módulo 3 — Datos locales: el corazón offline-first
- localStorage como fuente de verdad: familia de claves `METAS_*`
  (ADMIN_V1, PLANACCION_V1, SB_OUTBOX_V1, CAMP_*, DIAG_V1…).
- El patrón **outbox**: cola local → envío cuando hay red → reintento tras
  corte de luz → deduplicación por `evento_id` en el servidor.
- Espejo del maestro multi-dispositivo (`metas-docente-sync.js`).
- **Diagrama de flujo:** una calificación desde que el alumno termina la
  evaluación hasta que el padre la lee en su teléfono.
- Interpelación: *«¿Qué pasa si se va la luz a media prueba?»*,
  *«¿localStorage no se llena?»* (topes MAX_OUTBOX=1000, LOTE_MAX=200).

### Módulo 4 — La nube Supabase: tablas, funciones y roles
- Recorrido por los ~20 archivos `SUPABASE-*.sql` como HISTORIA del sistema:
  qué tabla/función nació en cada uno y por qué (resultados, plan_accion,
  docente_estado+papelera, aula, avisos, conducta, roles, reset por correo…).
- Las RPC como única puerta de entrada (`metas_guardar`, `metas_guardar_plan`,
  `metas_consultar_plan_padre`, `_metas_docente_ok`…): el cliente nunca toca
  las tablas directamente.
- **Diagramas:** entidad-relación simplificado + secuencia
  maestro → RPC → tabla → RPC → padre.
- Interpelación: *«¿Cómo evitas que un alumno vea las notas de otro?»*,
  *«¿Qué es RLS y dónde está activa?»*.

### Módulo 5 — Seguridad (el módulo más interpelable) ⭐
- Por qué la clave `anon/publishable` VA en el código y **no es una fuga**
  (solo permite lo que RLS + RPC autorizan; la `service_role` jamás sale).
- Las capas: escrituras exigen PROF+contraseña (`_metas_docente_ok`),
  rate-limit por IP real de Cloudflare (`cf-connecting-ip`, no falsificable),
  RLS con igualdad exacta, DELETE/UPDATE sin WHERE bloqueados (error 21000).
- **Minimización de datos de menores:** código de aula en vez de nombre,
  claves de familia por alumno, anti-fuga de nombres en contenidos.
- Casos reales resueltos como estudio de caso: cruce de aula multi-cuenta
  (a3641d2), duplicado del asistente (fea2521), auditoría ultracode 14 jul.
- **Diagrama:** las capas de defensa como anillos (dispositivo → red → RPC →
  RLS → datos).
- Interpelación dura: *«Vi tu clave de API en el código fuente»*,
  *«¿Cumples con protección de datos de menores?»*, *«¿Qué pasa si te roban
  el teléfono?»* — cada una con respuesta modelo de 3-4 frases.

### Módulo 6 — Distribución y ciclo de vida
- GitHub Pages + dominio propio (metas.policastsapien.com, CNAME, HTTPS),
  service worker VERSIONADO (hoy v27: por qué se sube el número en cada
  cambio), APK firmado (keystore, versionCode, targetSdk, Play Store),
  plan de cortes de energía (commit por paso), ciclo anual de la nube
  (archivado antes de nov 2026, límite Free ~500 MB).
- **Diagrama:** el viaje de un cambio: editar → commit → push → Pages →
  sw actualiza teléfonos → `npm run sync` → APK.
- Interpelación: *«¿Cómo despliegas?»*, *«¿Cuánto te cuesta la
  infraestructura?»* (≈ $0 + dominio).

### Módulo 7 — Decisiones de ingeniería: los porqués
- El módulo metalingüístico por excelencia: cada decisión con su
  alternativa rechazada y su costo asumido. Vanilla JS vs framework ·
  offline-first vs siempre-en-línea · Supabase vs servidor propio ·
  3 archivos por misión vs generador · formas deterministas (mulberry32) ·
  localStorage vs IndexedDB · limitaciones conocidas y su mitigación.
- **FAQ adversarial completa:** ~20 preguntas de ingeniero escéptico
  («esto no escala», «esto no es profesional», «¿y los tests?») con
  respuestas honestas — incluyendo qué SÍ es una deuda técnica real.

### Módulo 8 — Glosario + simulacro final
- Glosario de ~60 términos técnicos en tus palabras (RPC, RLS, PWA, outbox,
  idempotente, upsert, rate-limit, CNAME, keystore…).
- **Simulacro de interpelación:** 30 preguntas mezcladas de todos los
  módulos, primero sin respuestas (autoevaluación), respuestas modelo al
  final. Criterio de logro: responder 25+ sin mirar.

## 3. Método de trabajo (cómo lo haremos)

1. **Un módulo por tanda de trabajo** — cada uno se estudia del código REAL
   (yo leo los archivos y verifico cada afirmación antes de escribirla;
   nada de memoria: el kit no puede tener errores si te van a interpelar).
2. Cada módulo se entrega imprimible + commit + push, usable de inmediato.
3. **Orden completo:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 (de lo general a lo
   específico, la seguridad después de entender la nube).
4. **Ruta exprés** si la interpelación llega pronto: 1 → 4 → 5 → 7
   (panorama, nube, seguridad y porqués cubren el 80% de lo cuestionable).
5. Actividad metalingüística fija al final de cada módulo: explicárselo en
   voz alta a alguien no técnico (Evelyn, Jael) — si lo puedes enseñar,
   lo sabes.

## 4. Estado

- [x] Módulo 1 — Panorama → `kit-auto-1.html` (17 jul 2026) y misión
      interactiva en F.A.R.O (id 3). Cifras actualizadas el 26 jul 2026.
- [x] Módulo 2 — Frontend → `kit-auto-2.html` y misión interactiva en F.A.R.O
      (id 4, `modulo-2-frontend`), ambos del 26 jul 2026. Las cifras del kit 1
      se pusieron al día ese mismo día y los dos kits cumplen la norma 1-bis.
- [ ] Módulo 3 — Datos locales
- [ ] Módulo 4 — Nube Supabase
- [ ] Módulo 5 — Seguridad ⭐
- [ ] Módulo 6 — Distribución
- [ ] Módulo 7 — Decisiones
- [ ] Módulo 8 — Glosario y simulacro
