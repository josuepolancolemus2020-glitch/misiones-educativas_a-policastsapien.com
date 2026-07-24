# Estudio y plan — Fundamentos de Programación y Robótica en M.E.T.A.S

> Fecha: 24 de julio de 2026 · Estudio de viabilidad solicitado por el dueño del proyecto.

---

## 1. Veredicto: SÍ es viable, y con ventaja natural

**La plataforma está inusualmente bien preparada para estas dos materias**, por cuatro razones:

1. **Programación es la materia más "nativa" posible para M.E.T.A.S**: la plataforma ya es HTML/JS puro y offline. Un simulador de robot en cuadrícula, un ejecutor de secuencias de bloques o una tabla de trazas son widgets del mismo tamaño y complejidad que los que ya existen (el transportador SVG de Ángulos, la Rana Saltarina de Recta Numérica, el Cambista de Números Grandes). No se necesita ninguna librería externa ni internet.
2. **Robótica sin hardware es un enfoque pedagógico reconocido** ("robótica desconectada" + simuladores). En el contexto hondureño de aulas sin kits, el diseño correcto es: *unplugged primero, simulador en pantalla segundo, hardware real nunca requerido* (opcional si algún centro consigue kits).
3. **La arquitectura ya soporta materias nuevas sin tocar la base**: agregar una ruta son 2 líneas (`RUTAS` en `js/data/misiones.js` + `RUTAS_ORDEN` en `js/app.js`); la materia viaja como texto al registro y a Supabase (cero cambios de SQL ni de panel docente); el Campeonísimo y los diagnósticos se alimentan solos del `evalMCBank` de cada misión nueva.
4. **El estándar de evaluación calza perfecto**: el pensamiento computacional se evalúa de maravilla en papel (trazar el recorrido de un robot en una cuadrícula impresa, predecir salidas, detectar el bug) — todo determinista, con pauta 100% verificable, igual que división de decimales.

**Encaje curricular hondureño**: el DCNB de Educación Básica no trae asignatura de programación/robótica, pero el III Ciclo incluye el campo de **Tecnología**, y el pensamiento computacional refuerza directamente competencias de Matemáticas (secuencias, lógica, resolución de problemas). Propuesta de encaje: ofrecerlas como **materia complementaria/taller** — el pie normativo de las pruebas ya resuelve la duda administrativa con sus casillas ☐ *con valor en el parcial* / ☐ *solo de repaso*: cada docente decide cómo la pondera.

---

## 2. Diseño: dos rutas nuevas

### 💻 Ruta del Código — Fundamentos de Programación (7 etapas)

Color de materia nuevo: `tec` (sugerido: cian #0e7490). Público: II y III Ciclo.

| # | Misión | Contenido central | Widget estrella |
|---|---|---|---|
| 1 | **El Pensamiento Computacional** | Algoritmos de la vida diaria (la receta de las baleadas como algoritmo; instrucciones exactas vs ambiguas; descomponer problemas) | "El maestro robot": ordenar instrucciones desordenadas |
| 2 | **Secuencias: el Robot Mensajero** | Secuencias de instrucciones (avanza/gira); leer y escribir programas cortos | **Simulador de cuadrícula** (robot que recorre un mapa de aldea hondureña con flechas) |
| 3 | **Condicionales: el Robot Decide** | SI-ENTONCES-SINO; sensores como preguntas ("¿hay pared?") | Semáforo/laberinto con bifurcaciones |
| 4 | **Bucles: Repetir sin Cansarse** | REPETIR N VECES; patrones; bucle dentro de bucle (avanzado) | Dibujar figuras repitiendo pasos (cuadrado = repetir 4) |
| 5 | **Variables: las Cajitas de Memoria** | Guardar, leer y cambiar valores; contadores; el marcador del juego | Máquina de cajitas (mete/saca/suma) |
| 6 | **Detective de Bugs: la Depuración** | Encontrar y corregir errores en programas; leer con lupa; probar paso a paso | Programas con 1 error plantado (eco del "detective del error" del estándar) |
| 7 | **Mi Primer Programa Completo** (III Ciclo) | Integrar todo: eventos, secuencia+condicional+bucle+variable; pseudocódigo | Proyecto guiado en el simulador |

**Lenguaje**: bloques/pseudocódigo en español (AVANZA, GIRA DERECHA, SI…ENTONCES, REPETIR 4 VECES) — imprimible, sin sintaxis de lenguaje real. En la misión 7 se muestra la equivalencia con código real como cultura general.

### 🤖 Ruta de los Robots — Robótica (6 etapas)

| # | Misión | Contenido central | Puente con lo existente |
|---|---|---|---|
| 1 | **¿Qué es un Robot?** | Partes: sensores (sentidos), controlador (cerebro), actuadores (músculos); robot vs máquina vs electrodoméstico; robots en Honduras (maquila, agro, medicina) | — |
| 2 | **Sensores: los Sentidos del Robot** | Luz, distancia, tacto, temperatura; analogía con el cuerpo humano | Ruta del Cuerpo (sistema nervioso: receptor→cerebro→efector = sensor→controlador→actuador) |
| 3 | **Motores y Mecanismos** | Engranajes, poleas, palancas; transmisión de movimiento | Widget SVG de engranajes (¿hacia dónde gira?, ¿más rápido o más fuerte?) |
| 4 | **Electricidad para Robots** | Circuito básico (pila, interruptor, LED, motor); serie/paralelo elemental; seguridad | Misión La Energía (CCNN) |
| 5 | **Programando un Robot** | Aplicar la Ruta del Código a un robot simulado con sensores (integración de las dos rutas) | Simulador de cuadrícula + condicionales |
| 6 | **Robots que Resuelven Problemas** | Ciclo de diseño: problema→diseño→prueba→mejora; proyecto "el robot para la cosecha de café / para cruzar el río en invierno" | Rúbrica de diseño (proyecto) |

**Actividades desconectadas incluidas en cada misión** (para aula sin dispositivos): "programar" a un compañero con tarjetas de flechas, laberinto en el piso con cinta, engranajes de cartón, circuito dibujado. Van en la ficha didáctica imprimible.

---

## 3. Evaluación (el estándar completo desde el día uno)

Cada misión nace con las **dos pruebas** al estándar de división de decimales (30 formas deterministas, normativa impresa completa, calificación en pantalla, umbral 70 → +8 XP):

- **Programación → Prueba OPERATIVA** (es materia de destrezas). Modelo de secciones (100 pts):
  I. Ejecuta la secuencia (5×4=20) — dado un programa corto, marcar dónde termina el robot en la cuadrícula impresa · II. Predice la salida (5×2=10) — trazas rápidas · III. Completa el programa (5×4=20) — falta una instrucción para llegar a la meta (razonamiento inverso) · IV. Problemas de la vida real (3×10=30) — escribir el algoritmo corto para una tarea hondureña (hacer una baleada, repartir cuadernos, regar la huerta) con pauta por pasos clave · V. Retos de olimpiada (20) — el programa más corto que dibuja el patrón + **detective del bug**.
  *Las cuadrículas se imprimen como SVG determinista, igual que el transportador de Ángulos Básicos.*
- **Robótica → Prueba de PENSAMIENTO CRÍTICO** (contenido conceptual). Modelo: I. ¿Qué sensor necesita? (casos) · II. Corrige el error conceptual · III. Analiza el mecanismo (engranajes: dirección/velocidad) · IV. Comparación razonada (robot vs máquina simple; sensor vs actuador) · V. Diseña y justifica tu robot (rúbrica de 3 criterios).
- **Conceptual estándar** (Completar/VF/Selección/Pareados barajados) en ambas — alimenta diagnósticos y Campeonísimo automáticamente.
- **Ficha didáctica M.E.T.A.S de 7 páginas** por misión, con las actividades desconectadas.

---

## 4. Cambios de infraestructura (pequeños y de una sola vez)

1. `js/data/misiones.js`: `RUTAS += { codigo: {nombre:'Ruta del Código', emoji:'💻', color:'tec'}, robots: {nombre:'Ruta de los Robots', emoji:'🤖', color:'tec'} }` + registrar misiones con el siguiente id libre (hoy: 44+).
2. `js/app.js`: agregar `codigo` y `robots` a `RUTAS_ORDEN`.
3. CSS del catálogo (index): definir el color de materia `tec` (chips y tarjetas).
4. `js/data/diagnosticos.js`: 1 pregunta por misión nueva en sus rutas.
5. Nada más: Supabase, panel docente, registro y WhatsApp funcionan sin cambios (la materia es texto libre).

Decisiones de diseño ya tomadas por coherencia con la casa: sin librerías externas (los simuladores se escriben a mano en JS/SVG como los widgets actuales), todo offline, colores por materia, pareados siempre barajados, semillas 100000/200000+forma, y **sin Forma R** (sigue solo en división de decimales).

---

## 5. Plan de ejecución por tandas

| Tanda | Contenido | Entregable |
|---|---|---|
| **A. Cimientos + pilotos** | Infraestructura (rutas, color `tec`, diagnósticos) + 2 misiones piloto completas: 💻 *Secuencias: el Robot Mensajero* (con el simulador de cuadrícula, la pieza técnica nueva más importante) y 🤖 *¿Qué es un Robot?* — cada una con sus 2 pruebas y ficha | 2 misiones jugables en producción; validación del simulador en tablet e impresión de la cuadrícula en carta |
| **B. Ruta del Código completa** | Misiones 1, 3, 4, 5, 6 (reutilizando el simulador de la tanda A) | 6 misiones de programación |
| **C. Ruta de los Robots completa** | Misiones 2, 3, 4, 5, 6 (el simulador con sensores reutiliza el de Código) | 6 misiones de robótica |
| **D. Cierre** | Misión 7 de Código (proyecto integrador), preguntas curadas al Campeonísimo, actualización de manuales (maestro/alumno) y del catálogo | 13 misiones nuevas, 2 rutas completas |

Cada tanda con el modo de trabajo de siempre: agentes en paralelo, verificación independiente (sintaxis + determinismo + normativa), commit por checkpoint y sincronización de `www/`.

**Riesgo principal y su control**: el simulador de cuadrícula es la única pieza técnica realmente nueva (todo lo demás es plantilla probada). Por eso la tanda A lo construye primero y en una sola misión: si en la tablet o en la impresión aparece algún problema, se corrige antes de replicarlo en las otras ~8 misiones que lo usan.

---

## 6. Decisiones que te tocan a ti (con mi recomendación)

1. **¿Materia mostrada al alumno?** Recomiendo dos materias visibles: "Programación" y "Robótica" (más motivador que un genérico "Tecnología"), ambas con el mismo color `tec`.
2. **¿Ciclo objetivo?** Recomiendo II y III Ciclo (4º-9º), como la mayoría del catálogo; la misión 1 de cada ruta es accesible desde 4º.
3. **¿Color?** Cian/teal #0e7490 (libre hoy en la paleta; se distingue de mat/esp/cnat/csoc).
4. **¿Cuántas misiones?** El plan propone 7+6; se puede empezar con 4+4 si prefieres algo más corto.
5. **¿Kits de hardware?** El plan no los necesita nunca; si algún día se consiguen (micro:bit es el estándar escolar más barato), las misiones ya dejan al alumno listo para usarlos.
