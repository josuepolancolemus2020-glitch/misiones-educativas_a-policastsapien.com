# PROPUESTA FINAL DEFINITIVA — «Portada de Tres Puertas» (base ganadora) + lo mejor de las otras dos

**Base:** «Una sola portada: Simplicidad Radical» (ganadora para 2 de 3 jueces: maestra rural e ingeniero).
**Injertos adoptados:** vista Padre propia y Banco de Evaluaciones (de «Tres Puertas», como Fase 2); Misiones escalable a 100+, regla «guiar por notas», caché de sugerencia y anti-callejón «Próximamente» (de «Mapa de Aventura», como Fases 2-3).

---

## 1) El concepto, en palabras sencillas

Hoy, cuando alguien abre M.E.T.A.S. en su teléfono, lo primero que ve son adornos: una cita, un saludo con otra cita, dos cajitas para elegir país y grado, y una tarjeta grande de Honduras. Las misiones —lo importante— quedan abajo, y casi todo lo demás está escondido detrás del menú de las tres rayitas (☰), que la mayoría de la gente nunca abre.

**La propuesta no construye nada nuevo y raro: ordena la casa que ya tenemos.**

- Al abrir la app, lo primero será: el saludo al niño, **«Tu siguiente paso»** (la misión que le toca hoy, con un botón grande de Continuar), y una pregunta clarísima: **«¿Qué quieres hacer hoy?»** con 4 botones grandotes: **Misiones, Rutas, Mi Progreso y Zona Docente**. Un toque y ya está adentro. Nadie necesita descubrir el menú de rayitas.
- La **Zona Docente** (antes se llamaba «Mi Perfil», un nombre que confundía) tendrá TODO lo del maestro junto y ordenado por lo que más se usa: **Registro de clase, Consulta en la nube y Panel docente** —que hoy están perdidos y nadie los encuentra— arriba de todo, y debajo Plan de Acción, Campeonísimo, Parte Mensual, Collage y Gobierno Escolar. Los 5 botones que hoy no hacen nada al tocarlos, **se quitan**: nada de promesas vacías.
- Los **padres y madres** ganan su primera puerta: una tarjeta en la portada que les muestra el avance de su hijo. En la Fase 2 esa puerta se vuelve una **página completa para el padre**: «esta semana hizo 3 misiones, su mejor nota fue 85», qué le toca ahora, un consejo para apoyar en casa y un botón para escribirle al maestro por WhatsApp.
- Lo bonito **no se pierde**: la tarjeta de Honduras con sus símbolos patrios y curiosidades, y el pensador del día, siguen ahí — solo bajan al final de la pantalla, plegaditos.
- El **selector de países se guarda en una gaveta** (standby): desaparece de la vista para que ningún niño curioso «apague» las misiones sin querer, pero el código queda dormido y listo; cuando haya misiones de El Salvador o Guatemala, se despierta cambiando una sola palabra.
  **Ya despertó (agosto de 2026).** El selector volvió a la portada y el inicio
  se pinta con los colores de la bandera que se elija. El catálogo sigue siendo
  hondureño: en los demás países la lista dice «en construcción» y ofrece un
  botón para volver a Honduras, que era la condición para encenderlo.
- Todo se hace en **pasos chiquitos, uno por uno, guardando (commit) después de cada paso** — si se va la luz a media tarea, la app queda funcionando igual que antes.

**Las 28 misiones no se tocan. Ni la telemetría, ni las rutas, ni el Campeonísimo, ni el modo presentación, ni el guardado sin internet.** Solo cambia la portada y el orden de las puertas.

---

## 2) Wireframe móvil final (360px)

### Portada (view-inicio reordenada) — Fase 1

```
┌────────────────────────────────┐
│ ☰   M.E.T.A.S.            🏅  │ ← campana → botón "Premios"
├────────────────────────────────┤   (abre insignias en Rutas)
│ 🎓 ¡Hola, Keylin!              │ ← saludo compacto, sin cita
├────────────────────────────────┤
│ ┌────────────────────────────┐ │
│ │ 🧭 TU SIGUIENTE PASO       │ │ ← reusa sugerenciaSiguiente()
│ │ Múltiplos y divisores ·    │ │   de Rutas (por NOTAS, no XP)
│ │ Etapa 2                    │ │   Sin notas aún → se oculta y
│ │ [ ▶ Continuar mi misión ]  │ │   queda la Misión destacada
│ └────────────────────────────┘ │
├────────────────────────────────┤
│ ¿Qué quieres hacer hoy?        │
│ ┌──────────┐  ┌──────────┐    │
│ │ 🚀       │  │ 🧭       │    │ ← rejilla 2×2, botones
│ │ Misiones │  │ Rutas    │    │   ~96px de alto, emoji
│ └──────────┘  └──────────┘    │   grande + texto
│ ┌──────────┐  ┌──────────┐    │
│ │ ⭐ Mi    │  │ 🧑‍🏫 Zona │    │ ← 🧑‍🏫 con fallback SVG/
│ │ Progreso │  │ Docente  │    │   texto (emoji ZWJ frágil)
│ └──────────┘  └──────────┘    │
├────────────────────────────────┤
│ Explorar por materia           │
│ [📖 Español·8] [🔢 Matem.·9]   │ ← conteos REALES calculados
│ [🌱 Natur.·6 ] [🌎 Social.·5]  │   desde MISSIONS (28)
├────────────────────────────────┤
│ 🎯 Misión destacada            │
│ [ tarjeta destacada actual ]   │
│ Continúa explorando (si hay)   │
├────────────────────────────────┤
│ ┌────────────────────────────┐ │
│ │ 👨‍👩‍👧 Para madres y padres  │ │ ← Fase 1: puente al avance
│ │ Vea el avance y los premios│ │   Fase 2: abre la vista
│ │ de su hijo/a           →   │ │   Padre completa
│ └────────────────────────────┘ │
├────────────────────────────────┤
│ 🇭🇳 Honduras                   │ ← tarjeta país INTACTA
│ símbolos · ¿Sabías que…? ‹ › │   (sin selector), al fondo
├────────────────────────────────┤
│ ▸ 💭 Pensador del día          │ ← pensador + frase motivac.
└────────────────────────────────┘   fundidos, plegados (details)
```

### Zona Docente (view-perfil renombrada) — Fase 1

```
┌────────────────────────────────┐
│ ← Zona Docente                 │
│ ── MIS REGISTROS ────────────  │
│ ┌──────────┐ ┌──────────┐     │
│ │📋 Registro│ │☁️ Consulta│    │ ← <a> a registro.html /
│ │ de clase  │ │ en la nube│    │   consulta-nube.html
│ └──────────┘ └─"con tu clave"─┘│   (hoy SIN enlace en index)
│ ┌──────────┐ ┌──────────┐     │
│ │🔐 Panel   │ │🖨️ Evalua-│    │ ← panel-docente.html
│ │ docente   │ │ciones     │    │   Evaluaciones: badge
│ └"correo y ─┘ └─[Pronto]──┘   │   «Pronto» (Fase 2 = banco
│   contraseña"                  │   imprimible real)
│ ── HERRAMIENTAS ─────────────  │
│ [📊 Plan de Acción]            │
│ [🏆 Campeonísimo]              │
│ [📅 Parte Mensual] [🖼️ Collage]│
│ [🗳️ Gobierno Escolar]          │ ← solo aquí (sale del drawer)
└────────────────────────────────┘
  (Rúbricas, Cronómetro, Prueba
   Formativa, Eval. Diagnóstica:
   ELIMINADOS — sin botones muertos)
```

### Vista Padre (view-padre, NUEVA) — Fase 2

```
┌────────────────────────────────┐
│ ← El avance de {nombre}        │
│ ┌────────────────────────────┐ │
│ │ 📈 Esta semana:            │ │ ← lee meta_v2 y
│ │ 3 misiones · mejor nota 85 │ │   METAS_REGISTRO_V1
│ │ en Fracciones ✔            │ │   (por NOTAS, XP decorativo)
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ 🧭 Qué le toca ahora:      │ │ ← reusa renderPasoCard()
│ │ «Múltiplos y divisores»    │ │
│ │ [ 👀 Acompañar la misión ] │ │
│ └────────────────────────────┘ │
│ 💡 Consejo del día para casa   │
│ [ 💬 Escribir al maestro ]     │ ← wa.me, número guardado 1 vez
│ ⚠️ Este resumen vive en el     │ ← aviso OBLIGATORIO
│    teléfono donde estudia      │
│ 🔑 Pronto: consulta desde tu   │ ← reserva el territorio del
│    casa con el código de lista │   futuro chatbot (codigo_lista)
└────────────────────────────────┘
```

### Drawer (☰, queda como camino secundario) — Fase 1

```
  PARA ESTUDIANTES
  🏠 Inicio · 🚀 Misiones · 🧭 Rutas · ⭐ Mi Progreso
  PARA DOCENTES
  🧑‍🏫 Zona Docente · 📋 Registro de clase · 🏆 Campeonísimo
  PARA PADRES (Fase 2)
  👨‍👩‍👧 Avance de mi hijo/a
  (la sección «Configuración» con 3 ítems «Pronto»: ELIMINADA)
```

---

## 3) Plan de implementación por pasos commiteables

**Regla de oro (plan cortes de energía):** cada paso = 1 commit que deja el sitio 100% funcional + copia al espejo `www/` en el MISMO commit (o `respaldo-rapido.cmd`). Verificar en consola del navegador tras cada paso que no hay TypeError (acoples duros: `#home-name` app.js:275, `#featured-card`/`#recent-list` 307-346, `#notif-btn` 1149 — **se mueven, jamás se eliminan ni renombran**).

### FASE 1 — Reordenamiento seguro (la base ganadora)

| # | Paso (1 commit c/u) | Cómo | Archivos | Esfuerzo |
|---|---|---|---|---|
| 1 | **Arreglar consulta-nube.html** (bug real): botón «Subir pendientes» siempre falla porque nunca carga `METAS_SB` | Añadir `<script src="js/metas-supabase.js"></script>` junto a la línea 132; tras rellenar la clave guardada (línea ~150): `if (document.getElementById('clave').value) consultar();` | consulta-nube.html, www/consulta-nube.html | Bajo |
| 2 | **Confirmación doble en «Borrar»** de registro.html (protege datos sin candados) | Segundo `confirm()` con texto claro antes de borrar eventos locales | registro.html, www/ | Bajo |
| 3 | **Países a STANDBY** (detalle completo en la sección 4) | Bandera inline + ocultar `#selectors-container` entero + normalizar `country='HN'` en `load()` | index.html, js/app.js, www/ | Bajo |
| 4 | **Conteos reales en chips de materia** (hoy mienten: 15 vs 28) | En `renderHome()`, `MISSIONS.filter(m=>m.materia===X).length` escrito en el `<em>` de cada `.subj-chip` (extender el forEach de app.js 287-297) | js/app.js, www/js/app.js | Bajo |
| 5 | **Campo `pais:'HN'` en los 28 objetos de MISSIONS** (preparación de escalabilidad, inofensivo hoy) | Añadir la propiedad a cada objeto en js/data/misiones.js | js/data/misiones.js, www/ | Bajo |
| 6 | **Rejilla «¿Qué quieres hacer hoy?»** — 4 botones grandes en Inicio | 4 `<button class="home-nav-btn" data-view>` en grid 2×2 + listener delegado con `switchView` (mismo patrón que drawer-item). Ícono 🧑‍🏫 con fallback SVG inline/texto (emoji ZWJ, regla del proyecto). El drawer NO se elimina | index.html, css/app.css, js/app.js (~6 líneas), www/ | Bajo |
| 7 | **Reordenar view-inicio**: saludo compacto arriba; pensador+cita fusionados en `<details>` plegado al fondo; tarjeta país al fondo (intacta); destacada y materias suben | Cortar/pegar bloques HTML dentro de la misma vista conservando IDs exactos. `#motiv-text` y la curiosidad comparten `tickRotation` (app.js 160-177): ambas quedan en view-inicio, la lógica no se toca | index.html (32-153), css/app.css, www/ | Bajo |
| 8 | **Zona Docente coherente**: renombrar «Mi Perfil»→«Zona Docente»; 3 `<a>` nuevos arriba (registro.html, consulta-nube.html «con tu clave», panel-docente.html «correo y contraseña»); borrar 4 tiles muertos; «Evaluaciones» queda con badge «Pronto»; Gobierno Escolar tile normal al final | h1 (línea 226) + drawer (808) con el mismo nombre; grep previo confirma que los divs muertos no tienen id ni listeners | index.html (223-286, 807-812), css/app.css, www/ | Bajo |
| 9 | **Drawer con secciones y sin ruido** | `.drawer-section-label` «Para estudiantes» / «Para docentes»; eliminar bloque Configuración (820-835, cero listeners); quitar entrada duplicada de Gobierno Escolar; «Registro de clase» con estilo normal (sin inline) | index.html (786-836), css/app.css, www/ | Bajo |
| 10 | **Campana → botón Premios** | NO eliminar `#notif-btn` (listener sin guard). Ícono 🏅, aria-label «Mis premios», handler → `switchView('view-rutas')` con scroll a insignias; borrar toast vacío y `#notif-dot` | index.html (27-30), js/app.js (1149-1151), www/ | Bajo |
| 11 | **Insignias también en Mi Progreso** con rótulo «Premios por notas de evaluación» | En `renderProgress` reutilizar `insigniasDeRuta` (556-564) + `RUTAS_ORDEN`, mismo HTML que la strip de Rutas; con null-check del contenedor | js/app.js, index.html, www/ | Bajo |
| 12 | **«Tu siguiente paso» en la portada** (guiada SIEMPRE por notas; XP = decoración) | Extraer app.js 729-755 a `renderPasoCard(targetEl)` reutilizable sobre `sugerenciaSiguiente()` (580-623); nuevo `<div id="home-paso">` con null-check; **caché por sesión** (recalcular solo si `METAS_REGISTRO_V1` cambió — teléfonos de gama baja); sin datos → ocultar y dejar la destacada; texto neutral «sugerido en este dispositivo» (el teléfono del maestro mezcla alumnos) | index.html, js/app.js, css/app.css, www/ | Medio |
| 13 | **Tarjeta «Para madres y padres»** (puente, Fase 1) | Tarjeta estática con lenguaje llano → por ahora `switchView('view-progreso')` (que ya muestra insignias por notas tras el paso 11); en Fase 2 apuntará a view-padre | index.html, www/ | Bajo |
| 14 | **Font Awesome local con CDN de respaldo** | Descargar css+webfonts a css/vendor/fontawesome/; `<link>` local PRIMERO y CDN como segunda `<link>` de fallback durante una versión; actualizar precache de sw.js y subir `CACHE_NAME` a meta-app-v15; los 4 botones nuevos de la rejilla usan emoji/SVG, no FA | index.html:10, sw.js, css/vendor/*, registro/consulta-nube/panel-docente si usan CDN, www/ | Medio |
| 15 | **Cierre de fase**: subir `CACHE_NAME`, probar en teléfono real (portada, rejilla, regreso de misión con `?view=misiones&filter`, Zona Docente, drawer) | Checklist manual + commit final de fase | sw.js, www/sw.js | Bajo |

### FASE 2 — El padre como usuario real + la herramienta estrella del maestro

| # | Paso | Cómo | Archivos | Esfuerzo |
|---|---|---|---|---|
| 16 | **Vista Padre (view-padre)**: resumen semanal por notas, «qué le toca ahora», consejo del día, WhatsApp al maestro | Nueva `.view` + case en `switchView` + `renderPadre()`: resumen desde `meta_v2` + eventos evaluacion/prueba_operativa de `METAS_REGISTRO_V1` (misma lectura que `rutasProgress` 519-533); reusar `renderPasoCard()`; `js/data/consejos-padres.js` (~30 consejos rotativos); número del maestro guardado en `METAS_PADRE_V1` → `wa.me/504XXXXXXXX`; aviso obligatorio «Este resumen vive en el teléfono donde tu hijo estudia»; tarjeta «🔑 Pronto: código de lista» (futuro chatbot). La tarjeta del paso 13 y el drawer apuntan aquí | index.html, js/app.js, js/data/consejos-padres.js (nuevo), css/app.css, www/ | Alto |
| 17 | **Banco de Evaluaciones imprimibles** (el tile «Pronto» se vuelve real) | Nueva `evaluaciones.html` (patrón registro.html: standalone, carga js/data/misiones.js): 28 misiones con color por materia + instrucción «toca 📝 Evaluación → elige Forma → Imprimir». **Sin tocar misiones**: el salto directo con ancla/`?eval=1` queda como gancho opcional de fase aprobada aparte por el maestro | evaluaciones.html (nuevo), index.html (tile → `<a>`), www/ | Medio |

### FASE 3 — Escalar a «un sin número de misiones» (cuando el catálogo crezca)

| # | Paso | Cómo | Archivos | Esfuerzo |
|---|---|---|---|---|
| 18 | **Vista Misiones escalable**: filas de pills unificadas con scroll horizontal; selector de Grado revivido como pill-filtro DENTRO de Misiones con chip visible «Mostrando: 7° a 9° [cambiar]»; agrupación por ruta con `<details>` cuando MISSIONS supere ~30 | El grade-select actual está muerto (cero listeners, confirmado); se le da vida aquí, nunca como filtro invisible | index.html, js/app.js (renderMissions), js/data/misiones.js, www/ | Medio |
| 19 | **Bottom-nav fija de 4 íconos** (opcional, medir primero si la rejilla 2×2 basta) | `<nav id="bottom-nav">`; css/app.css YA tiene media queries huérfanas .bottom-nav (1510, 1537); padding-bottom + safe-area; ocultar con teclado (focusin/focusout) y en vistas-herramienta; probar auto-ocultar header (1159-1209) en teléfono real ANTES de publicar | index.html, css/app.css, js/app.js, www/ | Medio |

---

## 4) Países en STANDBY — exactamente así

> **ESTADO: encendido desde agosto de 2026.** `METAS_PAISES_ON = true` en
> `index.html`. Lo de abajo se deja escrito porque explica cómo está armado el
> interruptor y qué hace cada pieza; el paso 6 (la salida del callejón) ya se
> cumplió. Si alguna vez hay que apagarlo, se pone `false` y todo vuelve a
> Honduras sin que nadie pierda su XP.
>
> Lo que se hizo al encenderlo, además de la palabra:
> - El selector de **Grado** sigue muerto, así que se quedó oculto (`hidden`)
>   en vez de aparecer con el de país: un menú que se mueve y no cambia nada
>   hace creer que la aplicación no responde. Revive en el paso 18.
> - La bandera de la tarjeta va con el **emoji del país**, nunca dibujada.
>   Se probó a pintarla con franjas de color (`flagBg` de `paises.js` y la
>   clase `.cc-flag-visual`, ambas escritas y sin usar desde antes) y se veía
>   limpia, pero a Honduras le faltaban las cinco estrellas y a los demás su
>   escudo: una bandera es un símbolo patrio, se muestra completa o no se
>   muestra. Las dos piezas se borraron para que nadie las reviva.
> - La barra de arriba del teléfono (`meta[name=theme-color]`) también cambia
>   de color; si no, queda el azul de Honduras sobre una pantalla roja.
> - El cambio de país vive en **`aplicarPais(code)`**, no dentro del listener
>   del `<select>`: lo llaman el selector y el botón «Volver a Honduras».

**Dormido pero vivo. Reactivar = cambiar UNA palabra.**

1. **Bandera única**, en index.html ANTES de `<script src="js/app.js">` (línea ~850):
   ```html
   <script>window.METAS_PAISES_ON = false;</script>
   ```
   El espejo `www/` hereda el mismo mecanismo. **Reactivar países = cambiar `false` por `true`. Nada más.**

2. **Ocultar el contenedor ENTERO** `.selectors-container` (index.html:59) — se le pone `id="selectors-container"` y en `init()` de app.js (tras ~línea 1007):
   ```js
   if (!window.METAS_PAISES_ON) document.getElementById('selectors-container')?.setAttribute('hidden','');
   ```
   Se oculta por JS, **no se borra HTML**. De paso desaparece el selector de Grado (control 100% muerto hoy) y no hay problema de grid descuadrado ni se necesita `:has()` (que falla en WebViews Android viejas — dispositivos objetivo).

3. **Rescate de atrapados (CRÍTICO, no opcional)** — en `load()` de app.js (70-76):
   ```js
   const st = Object.assign(blank(), JSON.parse(raw));
   if (!window.METAS_PAISES_ON) st.country = 'HN';
   return st;
   ```
   Un niño que ya tenía México guardado en `meta_v2` recupera sus 28 misiones **sin perder XP ni visitas** (no hace falta `save()`).

4. **Se conserva intacto y cargado:** `js/data/paises.js` (index.html:842 — quitarlo lanza ReferenceError y mata app.js: `renderCountryCard`/`applyCountryTheme`/`tickRotation` usan `COUNTRY_DATA` sin guard); la tarjeta «Honduras» completa con símbolos patrios, fotos webp, modal y curiosidades (contenido educativo valioso, solo baja de posición); el tema azul `applyCountryTheme('HN')`; y todo el gating `if (country!=='HN')` de app.js 287-303/424-442, que queda dormido porque country siempre será HN. El listener `change` (1028-1064) se queda: un select oculto nunca dispara.

5. **Réplica obligatoria** de (1)-(3) en `www/index.html` y `www/js/app.js` + subir `CACHE_NAME` de sw.js.

6. ✅ **Hecho (agosto de 2026).** `METAS_PAISES_ON = true` devolvió selector, temas y gating tal cual, y el empty-state «Próximamente» pasó a **«Misiones de [país]: en construcción» + botón «Volver a Honduras»** (`.empty-btn`, 44 px de alto): el callejón sin salida queda cerrado, porque en la vista Misiones no hay selector de país y quien elegía otro se quedaba sin misiones y sin salida. El campo `pais:'HN'` ya añadido en el paso 5 hace trivial el filtro por país del catálogo cuando llegue.

---

## 5) Qué NO se toca (frontera dura)

- **Las 28 misiones** (`misiones/*/*.html` + sus JS/CSS): ni una línea. Incluye printEval/printEvalOp, formas deterministas 1-30, pauta ZipGrade, gradeEval, secciones lúdicas.
- **js/metas-registro.js, js/metas-supabase.js, js/metas-presentacion.js**: la telemetría, el offline-first (outbox), el espejo de progreso Supabase y el modo presentación/libro quedan intactos. (La única edición cercana es AÑADIR el script de metas-supabase.js a consulta-nube.html — carga un archivo existente, no lo modifica.)
- **Rutas de aprendizaje**: `sugerenciaSiguiente`, `rutasProgress`, diagnósticos (`METAS_DIAG_V1`), mapa metro e insignias — solo se REUTILIZAN (renderPasoCard), su lógica no cambia.
- **Campeonísimo completo** (torneo, banco, anti-repetición) y su botón «Actualizar banco».
- **panel-docente.html** (su sesión ya persiste — patrón correcto) y el login/RLS de Supabase.
- **js/data/paises.js** y la tarjeta país de Honduras (contenido, fotos, modal, rotación de curiosidades con su timer compartido `tickRotation`).
- **Claves de localStorage existentes**: ninguna se renombra ni se borra (`meta_v2`, `METAS_REGISTRO_V1`, `METAS_DIAG_V1`, `METAS_CAMP_*`, `METAS_PLANACCION_V1`, `METAS_SYNC_URL`, etc.). Solo se crean nuevas: `METAS_PADRE_V1` (Fase 2).
- **IDs con acople duro**: `#home-name`, `#featured-card`, `#recent-wrap`/`#recent-list`, `#notif-btn`, `#missions-container`, `#rutas-container`, contenedores de progreso — se mueven de posición conservando el id exacto, jamás se eliminan.
- **Deep-links de regreso** `?view=misiones&filter=X` y `?view=rutas` (app.js 1016-1025): siguen funcionando sin cambio.
- **El drawer ☰**: no se elimina; queda como espejo secundario durante al menos una versión para no desorientar a los usuarios ya entrenados.