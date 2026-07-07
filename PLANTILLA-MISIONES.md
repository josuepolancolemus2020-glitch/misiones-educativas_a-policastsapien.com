# 🧩 PLANTILLA DE MISIONES — Guía rápida (M.E.T.A.S)

Receta para crear una **misión nueva** rápido y **ahorrando tokens**.
En una sesión nueva basta con decir: **"Sigue PLANTILLA-MISIONES para una misión de [materia], tema [X]"**.

---

## ⭐ Prompt de arranque (copia y pega en una sesión NUEVA)

```
Sigue PLANTILLA-MISIONES.

Nueva misión:
- Materia: (español / matemáticas / naturales / sociales)
- Tema: ______
- Grado: II y III Ciclo (o el que sea)
- Debe incluir: juegos lúdicos interactivos (+ lo que quieras agregar)

Reglas de ahorro y calidad:
- Usa como plantilla la misión MÚLTIPLOS, DIVISORES Y PRIMOS
  (misiones/2ciclo-multiplos-divisores-primos, id 28): ya trae TODOS los
  estándares de UX aprobados (incluye memorama y evaluación conceptual
  calificable en línea). NO releas misiones más viejas.
- Aplica completo el checklist "Estándares de UX aprobados" de esta plantilla.
- Varía los widgets (2 del Lab + 3 de la sección Widgets): crea 5 nuevos
  adecuados al contenido de la misión.
- Sin capturas de pantalla (solo validación automática).
- NO revises el despliegue en vivo; solo haz push a main.
- Al final NO instales en el teléfono (lo haré yo por lotes con el .bat).
```

> Ajusta las reglas si quieres capturas o instalación; por defecto, así es lo más económico.

---

## 🎨 Estándares de UX aprobados (obligatorios en TODA misión nueva)

1. **Colores por materia**: matemáticas = AZUL (#1565c0); el ROJO es de Ciencias
   Sociales. Nada de acentos rojos en misiones de mate, tampoco al imprimir:
   los elementos paralingüísticos de las pruebas (títulos de sección, líneas,
   "Obtenido de…", encabezado de la pauta) van en el color de la materia.
2. **Predice** (primera impresión, debe encantar): cada predicción lleva su
   explorador interactivo ("🔍 Explorar la pista") que induce a la respuesta
   jugando: medir distancias, animaciones, tocar y descubrir.
3. **Flashcards**: reverso en minúscula. ⚠️ CAUSA RAÍZ del bug histórico:
   NUNCA usar `class="fa"` en el div del reverso — Font Awesome 6 mapea las
   letras a-z y los dígitos 0-9 a ICONOS con forma de MAYÚSCULA e impone su
   fuente (ninguna regla `text-transform` puede arreglarlo porque el glifo
   mismo es mayúsculo; las tildes ú/á delatan el bug al caer a la fuente
   normal). La clase correcta es `fca` y el CSS blindado obligatorio:
   `#fcA{font-family:'Nunito','Fredoka',sans-serif !important;font-weight:600 !important;font-style:normal !important;text-transform:lowercase !important;}`
   (corregido en las 28 misiones el 2026-07-05, commit c8e995f).
4. **Clasifica**: seleccionar y colocar (SIN arrastre). Si hay un elemento
   seleccionado y se toca uno ya colocado, se INSERTA el seleccionado en esa
   caja (no se saca el tocado); solo sin selección el toque devuelve al banco.
5. **Reto final**: botón "🔀 Variar pareja" con varios pools de ejercicios
   (`retoPairs`) + etiqueta `retoPairLbl`; resultados verificados por script.
   En el TEXTO de los ejercicios usar solo caracteres seguros: **"vs"** para
   comparar (NUNCA ⚖ u otros emojis exóticos: en varios teléfonos se ven como
   símbolos rotos/incomprensibles).
6. **Sopa de letras**: palabras en 8 direcciones (incluidas inversas),
   generadas y validadas con script Node; botón "🔦 Linterna (-2 XP)" que
   ilumina 3 s las palabras pendientes y avisa que usarla cuesta puntos.
7. **Tareas**: generadores ALEATORIOS e infinitos (no bancos fijos) con
   instrucción clara por tipo, para que el alumno se autoasigne práctica en
   casa o el docente las copie en el pizarrón. Tipos probados: ubicar en la
   recta / operaciones en columna / problemas con ruta de 4 pasos / número
   escondido ▢ / pirámides numéricas / pensamiento matemático (adaptar al tema).
8. **Prueba operativa**: ejercicios tipo olimpiada matemática (problemas
   breves, cadenas de operaciones, número escondido, pirámides…); el examen
   cabe en UNA página y la pauta va en la siguiente (`page-break-before`).
   En rectas o figuras impresas, las marcas sin número llevan "•" (nunca
   espacios en blanco).
9. **Pautas de todas las pruebas**: letra grande (tablas ≈11pt, título ≈13pt)
   para docentes con problemas de vista; solo se amplía la pauta, el examen no.
10. **Juego de memoria (memorama)**: OBLIGATORIO en la sección Flashcards, como
    segunda tarjeta. Parejas concepto↔pista/ejemplo (6 pares), +1 XP por pareja
    (primera vez) y +2 XP al completar, con confeti. Copiar el patrón `memoPairs`
    / `buildMemo` / `flipMemo` + CSS `.memo-*` de la misión id 28.
11. **Evaluación conceptual TAMBIÉN interactiva**: además de imprimir, debe
    poder resolverse EN LÍNEA y calificarse igual que la operativa: inputs de
    texto en Completar (con lista `acc` de respuestas aceptadas y normalización
    sin tildes), radios con `value` en V/F y Selección, `<select>` de letras en
    Pareados, botón "🧮 Calificar prueba" (`gradeEval()`) y panel de resultado
    /100 con desglose. Referencia: misión id 28.
12. **Juegos lúdicos en TODAS las secciones**: cada sección debe sentirse como
    juego (exploradores en Predice, mini-quiz en cada bloque de Aprende,
    widgets con racha/puntaje/confeti, memorama, reto contra reloj, sopa con
    linterna). El estudiante debe sentir "placer de aprender": feedback
    inmediato, animaciones y recompensas visibles.

> Implementación de referencia completa: `misiones/2ciclo-multiplos-divisores-primos/`
> (id 28, incluye TODOS los estándares 1-12). La id 27 (recta numérica) es la
> referencia anterior y NO trae memorama ni evaluación conceptual calificable.

---

## 🔁 Qué hace el asistente (pasos internos)

1. **Carpeta**: `misiones/2y3ciclo-<slug-del-tema>/` con `js/` y `css/`.
2. **Copiar assets** desde `misiones/2ciclo-recta-numerica/`: `html2canvas.min.js`
   y el `.css` (ya incluye los estilos de los estándares: clasifica por selección,
   linterna de sopa, exploradores de predice, rectas y pirámides).
3. **Re-tematizar CSS** (solo 4-5 ediciones): `--bg`, `--border`, `--pri`, `--sec`,
   los dos overrides de `--pri-gl/--sec-gl` en modo oscuro, el gradiente del `.hero`
   y la marquesina `.hero::before`.
4. **Escribir el JS** (`<slug>.js`): misma lógica; solo cambian los **bancos de datos**
   (fcData, qzData, classGroups, idData, cmpData, widgets, retoPairs, sopaSets, eval*,
   task*, crit*, parteData del Lab) + títulos, niveles, logros y `SAVE_KEY`.
5. **Escribir el HTML** (`<slug>.html`): mismas 13 secciones e IDs; solo cambia el
   contenido de Aprende / Tipos / Lab y los textos visibles. **Los IDs y las funciones
   onclick NO se cambian** (el JS depende de ellos). Incluir SIEMPRE, después de los
   scripts propios de la misión:
   `<script src="../../js/metas-registro.js"></script>`
   (capa de registro local de evidencia: sesiones, secciones y notas de gradeEval /
   gradeEvalOp quedan en localStorage y el docente las exporta desde `registro.html`.
   No requiere ningún cambio en el JS de la misión: se engancha solo a las funciones
   estándar `fin`, `gradeEval` y `gradeEvalOp`, y lee la nota del panel
   `#evalAutoResult` / `#evalOpAutoResult` — por eso el texto "Resultado: X/100 pts"
   de esos paneles NO debe cambiar de formato. Además inyecta solo: el modal de
   identificación del alumno (nombre/código + grado + código del maestro, 1 sola vez
   por dispositivo) y los botones "📤 Enviar resultados" y "👤 Cambiar alumno"
   (para dispositivos compartidos) dentro de `.diploma-actions` de la constancia —
   por eso ese div y el input `.diploma-input` deben conservar sus clases estándar).
   E inmediatamente antes de esa línea, incluir también:
   `<script src="../../js/metas-presentacion.js"></script>`
   (accesibilidad de aula compartida: letra grande predeterminada — el botón
   "🔎 Letra" la vuelve pequeña —, botón "📽️ Presentación" con proporciones para
   proyector + escala A−/A+, y modo 📖 Libro por tarjetas. Se engancha solo: usa
   `.cred-tools` del pie, `.main`, las secciones `.sec` con tarjetas `.card` hijas
   directas y la función `go()` — por eso esas clases y esa función deben conservar
   sus nombres estándar).
6. **Registrar** en `js/data/misiones.js` con el **siguiente id libre** (revisar el
   archivo; NO asumir count+1) y con su **Ruta de Aprendizaje**: campos `ruta`
   (numero | forma | palabra | planeta | cuerpo) y `etapa` (posición en la
   secuencia de esa ruta). El alumno nunca ve "Ciclo/Grado": eso queda solo como
   metadato docente en `grade`/`cycle` y en los encabezados imprimibles de las
   evaluaciones. Integración completa con las 3 fases de rutas:
   - **Badge del héroe** de la misión: `EMOJI-RUTA Ruta … · Etapa n de N · Materia`
     (ej. `🧭 Ruta del Número · Etapa 4 de 8 · Matemática`; la etapa 0 se escribe
     "Punto de partida"). Emojis de ruta: 🧭 Número, 📐 Forma, ✍️ Palabra,
     🌎 Planeta, 🧠 Cuerpo.
   - Si la misión se inserta **entre** etapas existentes, renumerar `etapa` en las
     misiones siguientes de esa ruta y actualizar el "de N" en los badges de TODA
     la ruta (el catálogo y el mapa se actualizan solos porque usan `rutaLabel()`).
   - **Diagnóstico**: añadir 1 pregunta representativa del `evalMCBank` nuevo a
     `js/data/diagnosticos.js` en la ruta correspondiente, con su campo `etapa`,
     manteniendo el orden de básico → avanzado.
   - Si nace una **ruta nueva**, añadirla a `RUTAS` en `js/data/misiones.js` y a
     `RUTAS_ORDEN` en `js/app.js`. (El mapa, "Tu siguiente paso" e insignias no
     necesitan más cambios: todo se deriva de `ruta`/`etapa` y del registro.)
7. **Validar** (barato y confiable):
   - `node --check js/<slug>.js`
   - sopas: que cada palabra coincida con su grid
   - que todas las funciones `onclick` e `id` del HTML existan en el JS
8. **Propagar** a `www/`, `android/app/src/main/assets/public/` y
   `android/app/build/intermediates/assets/debug/mergeDebugAssets/public/`
   (la carpeta de la misión + `js/data/misiones.js`).
9. **Commit** en rama nueva → `git checkout main` → `git merge --ff-only` → `git push origin main`.

---

## ✅ Checklist de la misión (13 secciones, "tier completo")

- [ ] Aprende (3 tarjetas: intro + comparativa + mapa de tipos)
- [ ] Sección de detalle (estructura / tabla comparativa / chips)
- [ ] Lab interactivo (4 "partes" × 4 "aspectos")
- [ ] Flashcards (14) · Quiz (9)
- [ ] Clasifica (4 grupos) · Identifica (8) · Completa (8)
- [ ] Widgets (Ordena, Identifica, Empareja, Situación→respuesta)
- [ ] Reto (3 parejas) · Sopa (2 grids válidos)
- [ ] Generador de Tareas (identify/classify/complete/explain)
- [ ] Evaluación Conceptual (TF15/MC15/CP15/PR15) + Pensamiento Crítico (5×20)
- [ ] Constancia + Recursos + footer estándar
- [ ] `<script src="../../js/metas-presentacion.js"></script>` al final del HTML (letra grande predeterminada + modo presentación + modo libro)
- [ ] `<script src="../../js/metas-registro.js"></script>` al final del HTML (registro de evidencia)
- [ ] Registrada en `misiones.js` con id libre · propagada · commit/push a main

---

## 📱 Instalar en el teléfono (hazlo por LOTES, no por misión)

1. Conecta el teléfono por USB con **Depuración USB autorizada**
   (verifica: `adb devices` debe mostrar `device`, no `unauthorized`).
2. Doble clic en **`sincronizar-e-instalar.bat`** (raíz del proyecto)
   o en terminal: `npm run install:android`.
3. Espera **"LISTO: la app se instaló en el teléfono"**.

Notas:
- El `java` del sistema es Java 8 (insuficiente). Ya está fijado el JDK 21 de
  Android Studio en `android/gradle.properties` (`org.gradle.java.home`).
- Si aparece `AccessDeniedException` en `mergeDebugAssets`: borra
  `android/app/build/intermediates/assets` y reintenta.

---

## 🌐 Despliegue web (GitHub Pages)

- El sitio se publica desde `main`:
  https://josuepolancolemus2020-glitch.github.io/misiones-educativas_a-policastsapien.com/
- Tras el `push` tarda **~1-15 min** (a veces la cola de Pages va lenta).
- Para confirmar sin gastar en la sesión: revisa el sitio tú mismo y **recarga
  forzada** (el service worker es "red primero", así que una recarga normal basta).
- El código correcto se puede verificar en el contenido crudo (no depende del build):
  `raw.githubusercontent.com/.../main/js/data/misiones.js`.

---

## 💸 Consejos para que rindan los tokens

1. **Sesión nueva por misión (o cada 2-3).** Un chat largo re-cobra todo el historial
   en cada mensaje: arrancar fresco es el mayor ahorro.
2. **No revisar el despliegue en vivo dentro de la sesión.**
3. **Sin capturas** salvo que dudes del diseño.
4. **Especificación completa en el primer mensaje** (materia, tema, grado, incluir X).
5. **Instalar en Android por lotes**, no tras cada misión.
6. **Modelo:** para misiones de patrón repetido, `/model` a **Sonnet** (más económico);
   reserva **Opus** para temas difíciles o contenido delicado.
```
