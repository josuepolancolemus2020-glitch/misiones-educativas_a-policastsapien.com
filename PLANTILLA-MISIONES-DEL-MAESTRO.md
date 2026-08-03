# 🎓 Plantilla de las MISIONES DEL MAESTRO

Molde de la serie de formación docente, tal como quedó establecido al construir
la primera («Dos siglos de leyes educativas en Honduras», agosto de 2026). No
son sugerencias: es lo que ya se acordó trabajando, y saltárselo cuesta otra
vuelta de correcciones.

Esta plantilla es para las misiones **del maestro**. Las del **alumno** siguen
`PLANTILLA-MISIONES.md`, que es otra cosa.

---

## ⭐ Prompt de arranque (copiar y pegar en una sesión NUEVA)

```
Sigue PLANTILLA-MISIONES-DEL-MAESTRO.

Nueva misión del maestro:
- Área: (metas / leyes / estrategias / datos / gestión / familia / tecnología)
- Tema: ______
- Referencia: misiones/docente-derechos-ninez/ y
  fichas/ficha-docente-derechos-ninez.html (NO releas otras misiones)

Al terminar: commit y push a main, como manda CLAUDE.md.
```

La referencia es la última misión escrita a propósito: trae el molde ya maduro
(recorrido explorable con pasos numerados y una caja aparte de «lo que no se
hace»). Si la misión es del área **metas**, lea además
`PROPUESTA-MISIONES-METAS-2026.md`: ahí están los argumentos, el mapa del
ecosistema y las advertencias de verificación.

---

## 1. Dónde vive cada cosa

| Pieza | Ruta |
|---|---|
| Misión | `misiones/docente-<slug>/<slug>.html` + `js/<slug>.js` + `css/<slug>.css` |
| Ficha | `fichas/ficha-docente-<slug>.html` (hoja común: `fichas/css/ficha-docente.css`) |
| Cortes de la ficha | `_dev/cortes/ficha-docente-<slug>.txt` |
| Registro en el temario | `js/tools/formacion-docente.js` |

⚠️ **La misión NO se registra en `js/data/misiones.js`.** Ese catálogo es del
alumno: meterla ahí la haría visible para todo el mundo. Tampoco engancha
`js/metas-registro.js`: aquí no hay evidencia de alumno que enviar, el avance es
del maestro y se queda en su teléfono.

Para publicarla, basta con agregarle `url:` a su tema en `MF_AREAS`. Los demás
temas se quedan con su «Pronto»: **es decisión del autor** y sirve de plan de
trabajo a la vista y de aviso al maestro de lo que viene.

---

## 2. Las once secciones

En este orden, cada una en un `<section class="sec">` con `.card` hijas:

1. La materia del tema, en formato explorable (en la primera fue una **línea de
   tiempo vertical**; en otra puede ser un recorrido por artículos, un árbol de
   decisiones o un caso guiado). Siempre: qué es, **en qué documento consta** y
   **qué le deja a su aula el lunes**.
2. Aprende (los hilos o ideas grandes que ordenan el tema).
3. Tarjetas de repaso (14) + memorama (6 parejas).
4. Quiz (9) con explicación inmediata.
5. Clasifica (4 grupos).
6. Completa la oración (8), tolerante a tildes y espacios.
7. Reto contra reloj.
8. Sopa de letras (8 palabras, cuadrícula generada y validada en el JS).
9. Casos: 5 situaciones reales de centro, con «💡 Ver una salida».
10. **Simulacro de concurso**: 20 preguntas de opción múltiple, sin pistas hasta
    calificar, listón en **75** como en el concurso real, y al final dice qué
    repasar. Es lo que más le interesa al maestro: no se omite.
11. Ficha, recursos y constancia.

⚠️ **La única excepción admitida a la sección 10, y cómo se hace.** Si el tema
**no cae en ningún concurso** (es el caso del área «Dominar M.E.T.A.S»: de la
propia plataforma no pregunta nadie), llamarlo «simulacro» sería el primer dato
falso de la misión. Entonces se conserva la mecánica entera (veinte preguntas,
una correcta, sin retroalimentación hasta calificar, listón en 75, letras
repartidas) y se le cambia el propósito. El precedente es
`misiones/docente-bienvenida-metas/`: ahí es un **diagnóstico de uso** con las
preguntas repartidas en cinco bloques, y al calificar no dice solo la nota, dice
qué bloque quedó flojo y por dónde empezar. **La excepción se consulta con el
autor antes de escribirla**, y no vale para las misiones de leyes: ahí el
simulacro es justo lo que el maestro viene a buscar.

---

## 3. Contratos técnicos que NO se tocan

Romperlos deja al maestro sin accesibilidad o rompe la sonda:

- La sección visible lleva `class="sec active"` (no `on`).
- Los botones de la barra: `class="nav-t" data-s="<id de la sección>"`.
- Existe `go(id)` global.
- La barra `nav.nav` va con `flex-wrap: wrap`: **nunca** un riel que se deslice
  de lado. En el teléfono, lo que se desliza no existe.
- Ídem cualquier lista larga: en vertical, no en riel horizontal.
- El pie incluye `<div class="cred-tools">` y, al final del HTML:
  `<script src="../../js/metas-presentacion.js"></script>`
  (agrega solo «🔎 Letra» y «📽️ Presentación» con el modo libro).
- `SAVE_KEY` propia por misión (`METAS_MD_<TEMA>_V1`), nunca compartida.

---

## 4. Redacción y color

- **Se habla de usted**, de colega a colega. Nada de «tú» ni de tono escolar.
- **Sin guiones largos** (regla 1-bis de la casa): dos puntos, paréntesis, coma
  o punto y seguido. Se comprueba con un `grep -c "—"` antes de publicar.
- Color **violeta** (`--pri: #6d28d9`), el de «Misiones del maestro». La
  normativa de colores por materia (rojo Sociales, azul Matemáticas…) **no
  aplica**: esto no es material del alumno y no debe confundirse con él.
- Ninguna letra concentra más del **40 %** de las respuestas correctas en el
  quiz ni en el simulacro. Se reparte a mano al escribir el banco.
- **Los nombres propios llevan mayúscula, también dentro de los juegos**
  (regla de la casa, en `CLAUDE.md`). La primera misión salió con las tarjetas
  en minúscula («marco aurelio soto», «la unah», «la ley fundamental de
  educación») y así se le mostraron a un maestro: eso le quita autoridad a
  todo lo demás. Se escribe **UNAH**, **La Gaceta**, **Ley Fundamental de
  Educación**, **Decreto 262-2011**; en minúscula queda **artículo 27**. Se
  comprueba con `node _dev/verifica-nombres-propios.js`, y los nombres nuevos
  de la misión se agregan a la lista `NOMBRES` de esa herramienta.

---

## 5. Las fuentes

Es material con el que un maestro va a un concurso: un dato malo le cuesta caro.

- Cada fecha, número de decreto y número de La Gaceta se verifica contra el
  documento oficial o su ficha en un portal del Estado (se.gob.hn, tsc.gob.hn,
  La Gaceta, RAE-DPEJ). **Nunca de memoria.**
- Lo que no se pudo verificar, no se afirma.
- ⚠️ **Buscar no es leer.** Un extracto de buscador NO acredita un número de
  artículo: los resúmenes de Studocu, Scribd, SlideShare y las presentaciones de
  estudiantes citan mal los artículos y a veces reproducen el proyecto de ley en
  vez del texto aprobado. Y cuidado con las corroboraciones falsas: oas.org y
  siteal.iiep.unesco.org alojan el mismo documento, así que coincidir no prueba
  nada. **Si la misión va a citar artículos, hay que tener el documento
  delante.** Cuando el entorno no alcance los portales del Estado, la salida es
  meter el PDF al repositorio (`_dev/leyes/`) y leerlo. Cómo se descubrió esto y
  qué cuesta saltárselo: `INVESTIGACION-ESTATUTO-DOCENTE.md`.
- La misión y la ficha llevan la lista de fuentes y la fecha de verificación.
- Si se corrige un dato, se corrige en las **dos**: se estudian juntas.

---

## 6. La ficha: diez páginas, y llenas

Norma traída de las misiones autodidacta (`NORMAS-MISIONES-FARO.md`, norma 6) y
adoptada para esta serie.

- **Exactamente 10 páginas** carta, cada una entre **215 y 252 mm**, letra de
  impresión **10 pt**. La última puede ir más corta.
- Hoja común `fichas/css/ficha-docente.css`. El botón de imprimir va DENTRO del
  `<div class="doc">` (si no, el repaginador no encuentra el cierre).
- Contenido: el tema por dentro, casos reales con su fuente, vocabulario,
  ejercicios para lápiz y la **pauta completa al final**, nunca en la misma
  página que su ejercicio.
- El pie de cada página lleva la autoría: es material que circula fotocopiado.

Herramientas (con `node _dev/servidor-estatico.js` corriendo):

```
_dev/mide-ficha-docente.html?f=<ficha>.html            mide las 10 páginas
_dev/mide-ficha-docente.html?f=<ficha>.html&bloques=1  lista cada bloque y su alto
_dev/mide-ficha-docente.html?f=<ficha>.html&cortes=1   propone los 10 cortes
node _dev/repagina-ficha.js fichas/<ficha>.html        los aplica
```

Dos cosas aprendidas repartiendo: el contenido total debe rondar los **2.200 a
2.300 mm** (más apretado que eso y no hay reparto posible), y **los bloques
grandes hay que partirlos** (una tabla de 130 mm no se reparte; dos de 65, sí).

⚠️ **El PDF es el único juez**: al final se imprime con Chrome headless y se
cuentan las hojas. Si no salen 10, la medida estaba mintiendo.

---

## 7. El pie de créditos (texto fijo de la serie)

```
🏛️ Proyecto Formación e Investigación Docente M.E.T.A.S

Desarrolladores: Docentes Josué E. Polanco y Evelyn S. Castellanos,
investigadores en acción. Este material se elabora con el apoyo de las mejores
herramientas de investigación profunda («Deep Research») disponibles en la
actualidad. Consulte siempre las fuentes citadas y, si encuentra un error,
agradeceremos que nos lo reporte.

«Cuanto mejor preparado esté, mejores serán sus decisiones. Al maestro que
estudia no se le impone: se le consulta.» 🎓

📧 josuepolancolemus2020@gmail.com   🌐 policastsapien.com
```

Botones del pie: `🔊 Sonido` · `🌙 Tema` · `🏅 Logros` · `🔄 Reiniciar XP`, más
los dos que inyecta `metas-presentacion.js`. El sonido es sintetizado con
WebAudio (nada que descargar: se estudia con datos contados). «Reiniciar XP»
pregunta antes y borra **solo** la clave de esa misión: los datos del aula no se
tocan.

---

## 8. Antes de publicar

1. `node --check` del JS de la misión.
2. `grep -c "—"` en misión y ficha: debe dar 0.
2-bis. `node _dev/verifica-nombres-propios.js`: ningún nombre propio en
   minúscula, tarjetas y juegos incluidos.
3. Sonda con Chromium a 390 px (molde: la de la primera misión). Comprueba
   secciones, juegos, sopa validada contra su cuadrícula, reparto de respuestas,
   pie y accesibilidad, y que **nada se corra en horizontal**.
4. Ficha medida y **impresa a PDF**: diez hojas.
5. **Sellar la versión**: `?v=NN` en `index.html`, `mision.html`,
   `consulta-nube.html`, `evaluaciones.html`, `registro.html` y `CACHE_NAME` en
   `sw.js`. Sin sello, el despliegue existe pero nadie lo ve.
6. Commit en español contando qué le cambia al maestro, y **push a `main`**:
   publicar es el final del trabajo, no un permiso que se pide.
