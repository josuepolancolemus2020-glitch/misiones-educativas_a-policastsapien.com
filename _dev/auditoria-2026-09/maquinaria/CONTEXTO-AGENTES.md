# Contexto común para los agentes de la auditoría de M.E.T.A.S.

## Qué es M.E.T.A.S.
Plataforma educativa hondureña (Misiones Educativas Tecnológicas Asincrónicas y
Sincrónicas) para 4º–9º grado de Educación Básica, hecha por una familia
(Polanco-Castellanos). Publicada como sitio ESTÁTICO en GitHub Pages
(metas.policastsapien.com) — sin framework ni compilación: HTML, CSS y JS planos.
PWA con service worker (`sw.js`) y envoltorio Android con Capacitor (`android/`, `www/`).

- Repositorio: `/home/user/misiones-educativas_a-policastsapien.com` (rama de trabajo: `claude/metas-comprehensive-audit-yw28pm`).
- **`CLAUDE.md` (128 KB, raíz) es el manual de normas del creador.** Léelo (o las partes relevantes a tu lente) ANTES de auditar: explica por qué está cada cosa como está. El usuario pidió expresamente: **«No protejas las decisiones existentes del creador. Busca deliberadamente qué está mal, qué está incompleto, qué está sobrediseñado y qué debería eliminarse.»** Una justificación escrita en CLAUDE.md NO convierte una decisión en correcta: júzgala por sus méritos para un aula hondureña real (43 alumnos, tres teléfonos, señal mala, maestro con poco tiempo).
- Documentos de contexto en la raíz: `MANUAL-MAESTRO.md`, `MANUAL-ALUMNO.md`, `MANUAL-PADRE.md`, `PROPUESTA-*.md`, `INVESTIGACION-HOMESCHOOL-2026.md`, `AUDITORIA-CHATBOT-PADRES.md`, `_dev/AUDITORIA-EVALUACIONES-DETALLE.md`, `_dev/docs/*.md`, `PLANTILLA-MISIONES.md`.

## Estructura
- `index.html` (1 000+ líneas, 14 vistas en un solo documento: inicio, misiones, rutas, progreso, ajustes, padre, perfil, formación, admin (=«Mi aula» del maestro), gobierno, plan-accion, parte-mensual, campeonismo, collage) + `js/app.js` (3 333 líneas) + `css/app.css` (5 372 líneas).
- Herramientas del maestro en `js/tools/`: `registros-admin.js` (6 120 líneas: grupos, listas, asistencia, notas, controles, colectas), `convocatoria.js` (3 415: convocatorias/buses/boletos/pagos), `campeonismo.js` (2 337), `lectura-mision.js` (1 934), `estadisticas-alumno.js` (1 583), `plan-accion.js` (1 368), `collage-maker.js`, `lectura-fluidez.js`, `gobierno-escolar.js`, `formacion-docente.js`, `parte-mensual.js`, `pwa-install.js`.
- Núcleo compartido: `js/metas-registro.js` (registro de evidencia de misiones), `js/metas-supabase.js` (cola de envío a la nube), `js/metas-docente-sync.js` (sincronización de datos del maestro), `js/metas-sugerencias.js`, `js/metas-i18n.js`, `js/metas-dialogos.js`, `js/metas-presentacion.js`, `js/metas-fracciones.js`, `js/metas-videos.js`, `js/videos-mision.js` (1 141), `js/3d/parque-3d.js` (andamio de 18 juegos 3D con Three.js r128 desde CDN).
- Datos: `js/data/misiones.js` (catálogo `MISSIONS`, `RUTAS`: 66 misiones, 12 rutas, 9 materias), `js/data/dcnb-map.js` (mapa misión→grado→mes del DCNB), `js/data/diagnosticos.js`, `js/data/lectura-textos.js` (5 668 líneas de corpus de lectura), `lectura-normas.js`, `videos-misiones.js`, `campeonismo-bank.js`, `paises.js`, etc.
- Misiones: `misiones/<ciclo>-<slug>/<archivo>.html` + `css/` + `js/` (74 carpetas; 66 en catálogo + 8 «misiones del maestro» `docente-*`). Cada misión es un HTML grande autónomo con su propio JS (flashcards, quiz, memorama, arrastrar, completar, sopa de letras, reto cronometrado, laboratorio SVG, evaluación imprimible…).
- Fichas imprimibles: `fichas/ficha-<slug>.html` (79) con QR en `img/qr-mision-<slug>.png`.
- Páginas autónomas: `padres.html` (asistente/chatbot para familias, con «clave de familia»), `salida.html` (respuesta de padres a una convocatoria), `buzon.html` (buzón de lectores de una revista), `consulta-nube.html`, `evaluaciones.html`, `registro.html`, `panel-docente.html`, `camp-vivo.html`, `kit-auto-*.html`, `kit-capacitacion*.html`, `mision.html`.
- Nube: Supabase. Proyecto M.E.T.A.S. `https://uljjgrikyigdrkbikcxo.supabase.co` (clave anon publicada en `js/metas-supabase.js`, `js/metas-docente-sync.js`, `js/app.js`); proyecto F.A.R.O. `https://bzrnjvalpwlcnpszvwim.supabase.co` (`js/metas-sugerencias.js`, `buzon.html`). Todo va por RPC (`/rest/v1/rpc/...`). SQL en `SUPABASE-*.sql` (raíz), que el autor pega a mano en el editor de Supabase. Autenticación del maestro: cuenta propia (nombre, correo, contraseña) creada vía RPC `metas_docente_alta_v2`, guardada en `localStorage` `METAS_DOCENTE_V1`; los alumnos NO tienen cuenta (escriben su nombre y el nombre del maestro dentro de la misión); las familias usan una «clave de familia» (nº de lista + 4 letras).
- Datos del maestro en `localStorage` (`METAS_ADMIN_V1` grupos; `METAS_DOCENTE_V1`; `METAS_PLANACCION_V1`; `METAS_ALUMNO_V1`; `METAS_PADRE_V1`; llaves `G:<id>`, etc.) sincronizados a la nube.
- Pruebas: sondas con Playwright en `_dev/verifica-*.js`, `_dev/test-*.js` (no hay CI; `npm test` falla a propósito). Documentos fuente en `_dev/dcnb/` (DCNB en Markdown troceado por área y grado, con `INDICE.md`), `_dev/dcnb-pdf/`, `_dev/leyes/`.
- `www/` es una copia desfasada para Capacitor (no se edita). `node_modules/` va VERSIONADO en el repositorio.
- F.A.R.O. es la aplicación privada del administrador, en OTRO repositorio (no accesible aquí).

## Herramientas disponibles para ti
- Servidor estático YA CORRIENDO: `http://localhost:8123` (sirve la raíz del repo). No lo mates ni levantes otro en ese puerto. Si no responde: `node _dev/servidor-estatico.js &` desde la raíz del repo.
- Playwright instalado FUERA del repo, con ayudante listo:
  ```js
  const { abrir } = require('/tmp/claude-0/-home-user-misiones-educativas-a-policastsapien-com/02a7cafe-4837-5e15-b34e-a616fb5254ca/scratchpad/pw/abrir.js');
  const { browser, page, errores } = await abrir({ movil: true });   // 393×873, táctil; movil:false → 1280×720
  await page.goto('http://localhost:8123/index.html', { waitUntil: 'load' });
  ```
  Para pantalla chica: `await page.setViewportSize({ width: 360, height: 640 })`. Guarda capturas en tu carpeta de trabajo y MÍRALAS con la herramienta Read (acepta PNG). `axe-core` está en `.../scratchpad/pw/node_modules/axe-core/axe.min.js` (inyectar con `page.addScriptTag({ path })`).
- La nube NO se toca: apaga o simula Supabase con `await page.route('**/rest/v1/rpc/**', r => r.abort('failed'))` o contesta JSON falso como hacen `_dev/verifica-convocatoria.js` (línea ~103) y `_dev/verifica-orden-grupos.js`. Para sembrar un maestro: `localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify({codigo:'ABCD12', clave:'x', nombre:'Prof. Prueba', correo:'p@x.hn'}))`; para sembrar grupos: ver `_dev/verifica-orden-grupos.js` líneas 45-55 (`METAS_ADMIN_V1`). Para entrar a una vista: `document.querySelectorAll('.view').forEach(v=>v.classList.remove('active')); document.getElementById('view-admin').classList.add('active'); renderAdmin();`.
- Las peticiones a `cdnjs`, `supabase.co`, YouTube pueden fallar por el proxy del entorno: es normal, no es un hallazgo en sí (pero SÍ es hallazgo cómo se comporta la app cuando fallan).

## Reglas de trabajo (obligatorias)
1. **Solo lectura sobre el repositorio.** No edites, no crees ni borres archivos dentro de `/home/user/misiones-educativas_a-policastsapien.com`. No corras `git` que cambie estado (nada de add/commit/checkout/stash/reset). No corras `npm install` dentro del repo.
2. Tus archivos temporales van en `/tmp/claude-0/-home-user-misiones-educativas-a-policastsapien-com/02a7cafe-4837-5e15-b34e-a616fb5254ca/scratchpad/<tu-etiqueta>/` (créala).
3. **Evidencia concreta o no cuenta:** `archivo:línea`, salida de un comando, número medido, ruta de una captura. Distingue hecho de opinión. Si no pudiste comprobar algo, dilo.
4. Escribe en **español**. Máximo **12 hallazgos**, los más importantes; no rellenes. Un hallazgo = un problema (no mezcles tres en uno). Cada uno con recomendación concreta.
5. Busca a propósito las cuatro categorías que pidió el usuario: **qué está mal, qué está incompleto, qué está sobrediseñado, qué debería eliminarse.** Y también qué falta.
6. Severidad: `critica` = pérdida de datos, seguridad, nota equivocada en un expediente, imposibilidad de usar la función; `alta` = usuario se pierde/abandona, error frecuente, riesgo comercial serio; `media` = fricción o deuda notable; `baja` = pulido.
7. Esfuerzo (estimado para UNA persona con el repo delante): `horas` (<1 día), `dias` (1–5), `semanas` (1–4), `meses`.
8. `impacto_educativo` e `impacto_comercial`: 0–5.
9. Reconoce lo que está BIEN cuando sea verdad (en el resumen ejecutivo), pero el encargo es encontrar problemas.
