# Plantilla de fichas: cómo se arma la ficha de una misión

Desde el 26 de noviembre de 2026 una ficha nueva no se escribe a mano. Se
escribe su **bloque** (datos) y la arma `_dev/arma-ficha.js`. Las 80 fichas
hechas a mano siguen valiendo tal como están y van pasando al bloque en
tandas de seis (ver `_privado/PLAN-FICHAS-MOTOR.md`).

## Qué archivos hay

| archivo | qué es |
|---|---|
| `misiones/<carpeta>/js/ficha.js` | el bloque `FICHA` de la misión. La página de la misión **no** lo carga: el alumno no lo descarga |
| `_dev/arma-ficha.js` | el armador. Escribe `fichas/<archivo>.html`, plano y con su CSS dentro |
| `_dev/fichas-motor/ficha.css` | el CSS de todas las fichas, una sola vez. El armador lo incrusta |
| `_dev/lib-ficha.js` | el lector de fichas y la regla de la copia. Lo usan dos sondas y el armador |
| `_dev/verifica-ficha-no-copia-examen.js` | la sonda: la práctica de la ficha no es el examen |
| `_dev/fichas-copia-pendientes.json` | cuántas preguntas copia hoy cada ficha vieja. Solo baja |

## El camino, de principio a fin

```
node _dev/arma-ficha.js <carpeta>                      # escribe la ficha
node _dev/verifica-ficha-paginas.js <archivo>          # cada hoja cabe (tope 248 mm)
node _dev/verifica-ficha-no-copia-examen.js --anota    # baja las pendientes
node _dev/verifica-examen-sin-pistas.js                # ninguna pregunta regala otra
npm test
```

Si una hoja se pasa, se mueve el corte en `hojas` del bloque o se acorta una
pregunta. **No se baja el tamaño de la letra.** `node _dev/arma-ficha.js
--revisa` dice, sin escribir, si la ficha publicada es la que sale del bloque
(sirve para saber si alguien la editó a mano).

## La forma del bloque

```js
const FICHA = {
  archivo: 'ficha-<slug>',          // sin .html. No se cambia: hay QR impresos con esa dirección
  mision: 'Los Tipos de Textos',    // como sale en el título y en el pie
  asignatura: 'Español',            // decide la paleta (lista en PALETAS, arma-ficha.js)
  nivel: 'Educación Básica',
  tema: '…',
  qr: 'qr-mision-<slug>.png',       // en img/. Se genera con _dev/genera-qr-mision.py

  estilos: `…`,                     // opcional: el CSS que es solo de esta ficha
  objetivos: ['…', '…'],

  hojas: [                          // cada arreglo es una hoja carta, en orden
    [ { objetivos: true }, { h2: '📚 1. …' }, { p: '…' }, … ],
    [ … ],
    [ { h2: '✍️ 7. ¡Ponte a Prueba! Actividades' },
      { practica: 'completar' }, { practica: 'vf' }, { practica: 'seleccion', hasta: 3 } ],
    [ { practica: 'seleccion', desde: 4 }, { practica: 'pareados' } ],
    [ { felicitacion: true }, { rubrica: true } ]
  ],

  practica: {
    completar: [ { q: '… ___ …', a: 'respuesta', ensaya: 'cp-…' } ],
    vf:        [ { q: '…', a: true, ensaya: 'tf-…' } ],
    seleccion: [ { q: '…', o: ['…', '…', '…', '…'], a: 2, ensaya: 'mc-…' } ],
    pareados:  { intro: '<div class="historia">…</div>',   // opcional
                 columnaA: 'Columna A', columnaB: 'Columna B', anchoA: '42%',
                 pares: [ { term: '…', def: '…', ensaya: 'pr-…' } ] }
  },

  felicitacion: '…',
  rubrica: { filas: [ ['actividad', 'lugar'], … ], nota: '…' },
  notaDocente: '…'
};
```

### Los bloques de una hoja

| bloque | qué pinta |
|---|---|
| `{ objetivos: true }` | el título «Objetivos de Aprendizaje» y la lista numerada |
| `{ h2: '…' }` | título de sección. Con `pegado: true` va sin margen arriba (cuando abre la hoja) |
| `{ h3: '…' }` | subtítulo |
| `{ p: '…' }` | párrafo |
| `{ caja: 'idea', html: '…' }` | recuadro. Clases: `idea`, `regla`, `truco`, `hn` |
| `{ tabla: { cab: […], filas: [[…]] } }` | tabla; la primera columna va resaltada. `k: 'normal'` deja que esa columna parta renglón; `k: false` la deja sin resaltar |
| `{ html: '…' }` | HTML tal cual, para lo que es de esta ficha (un dibujo, un recuadro propio) |
| `{ practica: 'completar' }` | una sección de la práctica, entera o un tramo (`desde`, `hasta`) |
| `{ felicitacion: true }`, `{ rubrica: true }` | el recuadro final y la rúbrica |

La cabecera (nombre, número de lista, título, asignatura, tema y QR) va sola
en la hoja 1. La **hoja del docente** va sola al final: la pauta se calcula de
las respuestas del bloque, no se escribe.

### Lo que el armador pone solo

- La pauta de las cuatro secciones.
- La numeración y los pies de página.
- La Columna B de los pareados, barajada con semilla (el nombre de la ficha)
  y sin que ningún pareado caiga en su propia fila.
- El CSS único con la paleta de la materia.

### Lo que el armador se niega a armar

- Una pregunta de la práctica que copia una del examen de su misión.
- Un completar sin su hueco `___`, o con dos.
- Un verdadero o falso con menos de 30 % o más de 70 % de verdaderos.
- Una selección con la correcta más del 40 % de las veces en la misma letra.
- Un `ensaya` que no nombra un dato (`k`) de los bancos del examen.
- Una sección de la práctica que no sale entera y en orden en las hojas.
- Una ficha que el lector de las sondas no lee igual que el bloque.

## La práctica no es el examen

La rúbrica manda resolver «Ponte a Prueba» un día antes del examen. Si la
práctica son las preguntas del banco, el alumno ya vio la hoja. La práctica
**ensaya los mismos datos con otras preguntas**:

1. **Otro ejemplo para la misma idea.** El examen pregunta con «Lava el arroz.
   Luego, ponlo a hervir»; la ficha, con «Dobla la hoja por la mitad. Después,
   recorta por la línea».
2. **El verdadero o falso vuelto del revés.** El examen dice «En una receta, el
   orden de los pasos no importa» (falso); la ficha, «Si se cambian de lugar
   los pasos de un instructivo, el resultado puede salir mal» (verdadero).
3. **Pareados de aplicar.** El examen une el término con su definición; la
   ficha, con un ejemplo (un trozo de una historia corta que va encima).
4. **Otro formato para el mismo dato**, cuando ayuda.

Cada pregunta anota en `ensaya` la `k` del dato del examen que ensaya. No
hace falta ensayar todos los datos, pero la sonda dice cuántos.

**No se usan en la práctica** los fragmentos ni los ejemplos del examen, ni los
de la teoría de la ficha que el banco nuevo ya pregunta.

La regla que aplica la sonda (`mismaPregunta`, en `_dev/lib-ficha.js`): una
pregunta copia a otra del mismo tipo si dicen lo mismo, o comparten el 80 % de
sus palabras de contenido, **y** tienen la misma respuesta. Un verdadero o
falso con la respuesta al revés no es copia.

## Lo demás sigue igual

- **Ninguna pregunta de la ficha regala la respuesta de otra**: lo mide
  `verifica-examen-sin-pistas.js`, que lee la ficha entera como una sola prueba.
- **Cada hoja cabe en una carta** con tope de 248 mm.
- **Datos con fuente.** Lo que la ficha afirma se acredita en `_dev/`. Sin
  fuente, se dice sin el superlativo o no se dice.
- **Lenguaje**: al alumno de tú, sin guiones largos, nombres propios con
  mayúscula.
- **Bilingües**: las ocho de Robótica tienen edición en inglés
  (`fichas/js/*-en.js`). Al pasarlas al bloque hay que traducir cada pregunta
  nueva. Van en la última tanda.
- **El banco nuevo del examen cita la ficha por su hoja** («Ficha, página 2
  (3. La estructura narrativa…)»). Si una sección cambia de hoja, se corrige
  esa `fuente` en el JS de la misión.

## Lista para dar por terminada una ficha armada

- [ ] `node _dev/arma-ficha.js <carpeta>` la escribe sin negarse.
- [ ] `node _dev/verifica-ficha-paginas.js <archivo>`: tantas páginas como hojas.
- [ ] `node _dev/verifica-ficha-no-copia-examen.js --anota`: la ficha sale de
      las pendientes.
- [ ] `node _dev/verifica-examen-sin-pistas.js` en verde.
- [ ] La nota del docente dice que la práctica cambió y desde cuándo (quien
      tenga impresa la pauta vieja calificaría mal la hoja nueva).
- [ ] La misión enlaza la ficha y el QR de la ficha lleva a la misión.
- [ ] Sello: una ficha es HTML del sitio. Se sube `CACHE_NAME` al final.
