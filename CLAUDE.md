# M.E.T.A.S — guía corta para trabajar en este repositorio

## Qué es

M.E.T.A.S (metas.policastsapien.com) es una plataforma educativa gratuita para
el maestro hondureño de Básica: misiones interactivas por materia y ciclo, cada
una con su examen, su ficha imprimible y su QR, más las herramientas del
maestro (Mi aula: asistencia, notas SACE, equipos, informes, convocatorias,
plan de acción, parte mensual). El usuario real es un maestro con 43 alumnos,
tres teléfonos, a veces sin señal y con la fotocopiadora como única salida.

La vara: lo que se publica tiene que ser lo mejor que se sabe hacer hoy.
Curiosidad, nunca enganche (sin rachas que castiguen, sin XP regalado). Cada
dato que se afirma se puede acreditar con una fuente que está en `_dev/`.

## Estructura de carpetas

| carpeta / archivo | qué hay |
|---|---|
| `index.html`, `mision.html`, `evaluaciones.html`, `registro.html`, `consulta-nube.html` | páginas de la aplicación |
| `padres.html`, `salida.html`, `buzon.html` | páginas autónomas para familias y lectores |
| `css/` | `app.css` y hojas compartidas de las misiones; `css/vendor/fuentes/` aloja las letras |
| `js/` | lógica de la app; `js/data/` catálogo y datos (`misiones.js` = `MISSIONS`, `RUTAS`); `js/tools/` herramientas del maestro; `js/3d/` andamio de los juegos 3D |
| `misiones/<ciclo>-<slug>/` | cada misión: su HTML, `css/`, `js/` (y juegos 3D, animación) |
| `fichas/` | fichas imprimibles `ficha-<slug>.html` y su índice |
| `img/` | imágenes, QR de misiones (`qr-mision-<slug>.png`), iconos |
| `_dev/` | sondas, armadores de fichas, fuentes oficiales (`leyes/`, `dcnb/`, `dcnb-pdf/`). No se publica |
| `sw.js` | service worker: `CACHE_NAME` (armazón) y `CACHE_DATOS` (lo visitado) |
| `www/`, `android/` | copia para Capacitor (Android). `www/` no se edita a mano |
| `docs/historial/` | contexto histórico y normativas detalladas |

Sin framework ni compilación: HTML, CSS y JS planos servidos tal cual.

## Cómo se publica

- El sitio se sirve con **GitHub Pages desde la rama `main`** (Jekyll, sin
  workflow propio; `_config.yml` excluye lo que no es del sitio).
- `git push` no es publicar: se confirma en
  `https://api.github.com/repos/<usuario>/<repo>/actions/runs?per_page=20`
  buscando el `head_sha` del commit propio en `completed / success`. No mirar
  la primera fila; si no hay construcción, se empuja un commit nuevo con algo real.
- Mensajes de commit en español, contando qué le cambia al maestro.
- Antes de borrar datos del maestro o de las familias (claves, listas, notas),
  se pregunta.

## Reglas de código esenciales

1. **Sellar la versión** en todo cambio de HTML/CSS/JS: subir `?v=NN` en
   `index.html`, `mision.html`, `consulta-nube.html`, `evaluaciones.html`,
   `registro.html` y `CACHE_NAME` en `sw.js`. **`CACHE_DATOS` no se sella nunca.**
2. **Nada de CSS externo**: ni Google Fonts, ni `@import` remoto, ni Font
   Awesome por una flecha. Las letras se alojan con `font-display: swap`.
3. **Los números se cuentan, no se escriben**: el catálogo está en
   `js/data/misiones.js`; en papel, las cifras se fechan.
4. **Grupos** siempre como `6º-1`, vía `adGradoSeccion`
   (`js/tools/registros-admin.js`). No tocar `paCodigoAlumno`,
   `adClaveFamilia`, llaves de `localStorage` ni códigos ya entregados.
5. **Datos del maestro se fusionan** (`js/metas-fusion-aula.js`), no se elige
   una copia. Preferencias de vista van en su propia llave, nunca en
   `METAS_ADMIN_V1` ni `METAS_ALUMNO_V1`.
6. **Accesibilidad**: nunca `user-scalable=no`; blancos de toque de 44 px;
   nada dicho solo con color (✓/✗ además del color); todo se hace sin arrastrar.
7. **Papel**: un informe = una hoja carta (tope de 248 mm); no se baja el
   tamaño de letra del cuerpo; selección múltiple = "rellena el círculo", no ✗.
8. **Una misión nueva** no está terminada sin ficha, QR generado con
   `_dev/genera-qr-mision.py` y enlaces en los dos sentidos.
9. **Bilingües**: al cambiar una cadena española, cambiar también su clave en
   el `-en.js` y en `js/metas-i18n.js`.
10. **Datos que pinta la pantalla viven en un solo archivo** de `js/data/`
    (Himno, próceres, poderes, Constitución, IA, filosofía). Las fichas que se
    arman con `_dev/arma-*.js` no se editan a mano.
11. **Exámenes**: la correcta repartida entre letras (ninguna > 40 %); ninguna
    pregunta regala la respuesta de otra.
12. **Lenguaje**: al maestro de tú, a la familia de usted; sin tecnicismos;
    nombres propios con mayúscula; sin guiones largos en lo que se lee.
13. **SQL de Supabase**: los `SUPABASE-*.sql` se pegan a mano en el SQL Editor;
    cuando un cambio los necesite, el SQL completo va en la respuesta del chat,
    con orden, si hay que re-correr algo y cómo comprobarlo.
14. Comentarios en español, explicando **por qué**, no qué.

## Cómo correr las pruebas

```
npm test                    # sondas rápidas (solo leen archivos)
npm run test:navegador      # sondas con Playwright; levanta su propio servidor
```

Playwright no va versionado: se instala con `npm install --no-save playwright`
y se borra al terminar (`node_modules` está en el repositorio). Para una sonda
suelta:

```
node _dev/servidor-estatico.js     # en otra terminal
node _dev/verifica-<algo>.js
```

El CI (`.github/workflows/sondas.yml`) corre las rápidas en cada push y las de
navegador de noche; no frena la publicación.

## Fuentes oficiales

Las leyes y el currículo están en `_dev/leyes/`, `_dev/dcnb-pdf/` y
`_dev/dcnb/` (troceado por área y grado, empezar por `_dev/dcnb/INDICE.md`).
El PDF es el que acredita. Buscar no es leer.

Para contexto histórico consulta docs/historial/ solo si es necesario.
