# Auditoría técnica (I): arquitectura, calidad del código, rendimiento, dependencias y proceso

Cinco lentes (T1 arquitectura, T2 calidad y redundancia, T5 rendimiento, T8 dependencias, T10
pruebas y proceso), 60 hallazgos. **Doce están verificados** por el revisor adversarial; los
demás se quedaron sin revisar cuando se agotó el límite de uso, y están marcados como tales en
`crudo/tecnica-codigo-hallazgos.json`. Cada afirmación de este capítulo trae su medición.

## Resumen

Empiezo por lo que está bien, porque es más de lo que un informe de este tipo suele reconocer.
Los 341 archivos JavaScript del proyecto **pasan `node --check` sin un solo fallo**. Las siete
páginas probadas cargan en un móvil sin errores de página, sin identificadores duplicados y sin
desbordamiento horizontal. No hay ni un `console.log` olvidado. Los 776 nombres globales que
dejan los 25 scripts de la portada **no chocan entre sí**, gracias a una disciplina de prefijos
por herramienta que se ha respetado sin fallo. Las claves de Supabase publicadas son del tipo
publicable, no de servicio. Y `npm audit` no encuentra ninguna vulnerabilidad en producción.

Además hay tres precedentes de extracción de código común que funcionan: el andamio de los juegos
3D, el aparato de videos y el registro de evidencia. **El camino para arreglar lo que sigue ya
está probado dentro del propio proyecto.**

Dicho eso, hay cuatro problemas de fondo.

**El motor de las misiones está copiado 66 veces, y las copias ya divergieron.** El 27,7 % de las
líneas de JavaScript de las misiones son idénticas en diez o más de ellas. Pero no todas: la
función que corrige el quiz tiene **cinco versiones distintas**, la que califica la evaluación
ocho, la de completar diez. Veintiuna misiones dan retroalimentación pedagógica y tres segundos y
medio para leerla; treinta y una no. Es el mismo patrón que el propio proyecto documentó como
costoso en los juegos 3D, y ahí lo resolvió.

**La promesa de funcionar sin internet no se cumple la mitad del tiempo.** El service worker no
guarda el armazón de la aplicación en la primera visita, y cada despliegue **borra toda la caché**
del teléfono, incluidas las misiones que el alumno abrió con señal para usarlas sin ella. Van 170
versiones y unos 2,5 despliegues al día.

**Con el CDN caído la pantalla está en blanco 12,6 segundos.** Medido, en las cuatro páginas
probadas. La hoja de estilos de Font Awesome y la importación de fuentes de Google bloquean el
pintado. Abortándolas al instante, el primer pintado baja a 0,28 segundos. Y hay una página que
demuestra que se puede: la de las familias, sin ninguna dependencia externa, pinta en 52
milisegundos.

**No hay integración continua, y hoy hay dos sondas en rojo que nadie ha visto.** Ocho
publicaciones a producción en un solo día, 828 en total, sin que nada compruebe siquiera que el
código compila.

## Arquitectura

### El motor de las misiones, copiado 66 veces

`T1-01 + T2-01` · alta · deuda · esfuerzo semanas · impacto educativo 4/5 · comercial 4/5

| medida | valor |
|---|---|
| Líneas de JavaScript en `misiones/` | 109 177 |
| Líneas idénticas en 10 o más misiones | 27,7 % |
| Líneas idénticas en 5 o más | 38,1 % |
| Cuerpos de función presentes en 5 o más misiones | 281 |
| Funciones definidas en 20 o más misiones | 121 |
| Líneas redundantes medidas | 18 249 |

Lo que hace daño no es la duplicación en sí, es la **deriva**. La misma función corrige el quiz de
cinco maneras distintas según la misión. El revisor precisó bien el matiz: solo dos funciones son
de verdad byte-idénticas en las 66; el resto tiene entre cuatro y diez variantes. Eso **empeora**
el diagnóstico, no lo mejora.

Y la plantilla del proyecto institucionaliza el método: «copiar assets», «misma lógica; solo
cambian los bancos de datos». Con doscientas misiones serían unas 300 000 líneas de motor
duplicado, y cada arreglo del quiz, doscientas ediciones.

- Qué hacer, y el proyecto ya sabe cómo: extraer `js/motor-mision.js` siguiendo el precedente del
  andamio 3D. Incremental: las misiones nuevas nacen sobre el motor y la plantilla deja de decir
  «copia»; las 66 existentes migran por familias, empezando por las 33 que comparten el mismo
  andamio.

### Ochocientos treinta y seis nombres globales y un grafo implícito

`T1-07` · baja · riesgo · esfuerzo días

Los 24 scripts de la portada declaran 836 nombres de nivel superior. Hoy **no hay ni una
colisión**, y eso es mérito de la disciplina de prefijos. Pero es convención, no mecanismo: la
herramienta de convocatoria hace 361 referencias a funciones de la de Mi aula, y el registro de
evidencia se engancha a cada misión parcheando funciones globales. El orden de carga del HTML es
la única arquitectura de módulos que hay.

### La URL de Supabase está repetida en catorce archivos

`T1-12` · media · deuda · esfuerzo horas

No existe un módulo de configuración. La dirección aparece en 14 archivos y la clave en 17.
Cambiar de proyecto de Supabase es una búsqueda y reemplazo con riesgo.

## La promesa de funcionar sin internet

Es lo que más me preocupa de este capítulo, porque es la promesa central del producto y la que se
le hace por escrito al maestro.

### El service worker no guarda el armazón

`T2-06` · alta · faltante · esfuerzo horas · impacto educativo 4/5

La lista de precarga incluye traducciones al inglés, el andamio 3D, los videos y las páginas de
las familias, pero **no incluye la portada, ni el JavaScript principal, ni la hoja de estilos**.
El armazón solo entra en la caché de forma oportunista, es decir, **desde la segunda visita**.

Medido con un service worker real: tras la primera visita la caché tiene 35 entradas y la portada
no está entre ellas. Tras la segunda, 70.

### Y cada despliegue borra todo lo que el alumno tenía guardado

`T5-04 + T1-10` · alta · error · esfuerzo horas

Al activarse, el service worker elimina cualquier caché que no se llame como la versión nueva. Lo
que el alumno visitó (misiones, juegos 3D, el motor 3D bajado del CDN) vive en esa misma caché.

La normativa obliga a subir la versión en cada cambio. Se midieron **37 cambios en quince días**,
unos 2,5 al día. Cada uno le quita al alumno todo lo que tenía sin internet, y le cuesta volver a
bajar el armazón más cada misión que quiera reabrir.

- El arreglo mínimo es de horas: dos cachés, una de precarga que se reemplaza con la versión y
  una de uso que **nunca se borra**. El revisor añadió el cuidado que hay que tener: conviene
  ponerle un tope de tamaño, o el almacén crece sin fin en el teléfono.

### Con señal mala, la caché no se usa nunca

`T5-03` · alta · error · esfuerzo días

Para todo lo propio se pide siempre a la red, y solo se sirve la copia guardada **si el fetch
falla**. Con señal viva pero mala, que es el caso normal del aula, el alumno espera la red
completa en cada visita: unas 39 revalidaciones por página. No hay carrera contra un temporizador
que corte la espera.

Bajo 2G emulado, la portada tardó **102 segundos** en cargar.

### Y el alumno que llega por el QR nunca recibe el service worker

`T5-09` · media · incompleto · esfuerzo horas · impacto educativo 4/5

Solo la portada y la página de las familias lo registran. El alumno que entra por el código QR de
la ficha impresa, que es el camino que la propia normativa del proyecto declara principal, no
recibe nunca la promesa de funcionar sin internet.

### Tres mecanismos de versión que se estorban

`T1-10 + T2-07 + T10-05` · esfuerzo horas

Conviven el sellado manual `?v=NN` en 30 etiquetas, el nombre de la caché, y el pedir siempre a la
red. El sellado es **redundante** donde manda el service worker, e **incompleto** donde no llega:
65 de las 66 misiones cargan el registro de evidencia sin sello alguno, y el revisor contó que 76
de los 92 HTML de misiones no llevan ninguno. Además la precarga guarda las direcciones **sin**
el sello, así que nunca casan con las peticiones que sí lo llevan.

## El arranque

### El CSS externo deja la pantalla en blanco doce segundos

`T5-01` · alta · error · esfuerzo días · impacto educativo 5/5

| página | primer pintado con el CDN colgado |
|---|---|
| Portada | 12 640 ms |
| Misión de La Materia | 12 504 ms |
| Sólidos Geométricos | 12 528 ms |
| Números Decimales | 12 608 ms |
| **Con los externos abortados al instante** | **280 ms** |
| Página de las familias (sin externos) | 52 ms |

La causa está identificada con precisión: la hoja de Font Awesome desde el CDN y la importación
de fuentes de Google en la primera línea de la hoja de estilos principal. Las 66 misiones piden
además tres familias tipográficas.

En un aula con señal intermitente, doce segundos de pantalla en blanco son «la aplicación no
abre».

- Qué hacer: alojar las fuentes en el sitio como archivos con subconjunto latino, quitar la
  importación externa, y quedarse con el Font Awesome local que **ya está en el repositorio**.

### Dos coma cuatro megabytes de JavaScript para todos

`T5-02 + T2-05 + T1-09` · alta · esfuerzo días

La portada descarga y ejecuta 25 scripts, y alrededor del 78 % es herramienta del maestro:

| archivo | tamaño |
|---|---|
| Corpus de lectura | 980 KB |
| Mi aula | 341 KB |
| html2canvas | 199 KB |
| Convocatoria | 182 KB |
| Campeonísimo | 167 KB |
| Estadísticas | 97 KB |

Ninguna etiqueta lleva `defer` ni `async`, así que ni siquiera el analizador del navegador puede
adelantarse. Con la CPU ralentizada cuatro veces, el hilo principal está ocupado 7,8 segundos solo
en analizar ese JavaScript.

El auditor de rendimiento hizo una observación honesta que conviene recoger: **la premisa del
encargo no se cumplía**. El catálogo de misiones **no** se carga en cada misión, solo en dos del
docente. Eso es un acierto del proyecto y hay que decirlo.

- La función que cambia de vista ya centraliza el punto donde cargar cada herramienta al abrirla.
  El cambio es acotado.

### La memoria no es el problema

`T5` · dato

El montón de JavaScript de la portada es de 3,3 MB con 2 700 nodos. Un teléfono de 1 GB de RAM
**no sufre por memoria** aquí: sufre por la red y por el tiempo de analizar el código. Es un dato
útil porque descarta una hipótesis razonable.

## Errores que se tragan en silencio

### Setecientos setenta y nueve bloques `catch` vacíos

`T2-03` · alta · riesgo · esfuerzo días · impacto comercial 4/5

En 122 archivos, y concentrados justo donde más duelen:

| archivo | bloques vacíos |
|---|---|
| Mi aula | 35 |
| Sincronización del maestro | 24 |
| Aplicación principal | 17 |
| Página de las familias | 14 |

Un `catch` vacío convierte un fallo en silencio. En la sincronización eso significa que un
almacenamiento lleno, un JSON corrupto o una llamada rechazada **no dejan rastro**: el maestro
cree que sus listas y sus notas subieron, y no subieron. Solo cuatro de los 779 llevan un
comentario explicando por qué.

Es, junto con el borrado de caché, el hallazgo técnico que más me preocupa para el uso real,
porque produce pérdida de confianza sin producir un error visible.

- Qué hacer: una función central que al menos avise y acumule un contador visible en Ajustes
  («3 cosas no se pudieron guardar hoy»), y que en la sincronización marque el dato como
  pendiente en vez de descartarlo. Más una regla de linter para que no vuelvan a entrar.

## Dependencias

`npm audit` da **cero vulnerabilidades en producción**. Las tres que aparecen están en
dependencias de desarrollo de la línea de comandos de Capacitor y solo afectan a la máquina del
autor. Un audit aparte de las versiones que se cargan desde CDN tampoco devuelve avisos.

Lo que sí hay es una cadena de suministro sin ningún cierre y un peso desproporcionado:

- **Cero atributos de integridad y ninguna política de contenido** (`T8-03`). El motor 3D se
  inyecta sin hash y el service worker lo fija en la caché.
- **Font Awesome entero, unos 250 KB, en 65 misiones para una flecha de volver** (`T8-02`), sin
  respaldo local. Y la portada lo carga **dos veces**, local y desde CDN (`T8-09`, `T5-08`).
- **MathJax sin versión fija para cuatro fórmulas** (`T8-04`): sin señal, el alumno lee el código
  fuente de la fórmula en crudo. Está medido.
- **Three.js r128, de 2021, solo desde CDN** (`T8-05`). La promesa de «ábrelo una vez con señal y
  después funciona» depende de un tercero y no se precarga.
- **Las fuentes de Google en 81 páginas** (`T8-10`), en una plataforma para menores que promete
  funcionar sin internet: cada apertura con señal manda la dirección IP del niño a Google.

Lo bueno, y está comprobado con captura: **las misiones degradan con dignidad sin CDN**. Con
cdnjs y las fuentes de Google bloqueadas, la misión de Fracciones se lee y se usa entera, porque
la iconografía va por emoji. El cargador de Three.js tiene plazo de veinte segundos y pantalla de
aviso, lo que hace trivial alojarlo en el sitio.

### La aplicación de Android es otro producto

`T8-07 + T10-12` · alta · incompleto · esfuerzo días

La app se compila desde una copia congelada del sitio. Hoy esa copia tiene:

| | copia de la app | sitio |
|---|---|---|
| Versión de la caché | v48 | v170 |
| Misiones en el catálogo | 57 | 66 |
| Líneas de la portada | 1 024 | 1 092 |

Quien instaló el APK usa un producto **122 versiones atrás**, sin los videos, sin la Prueba de Fin
de Grado de 7º, sin los juegos 3D nuevos, y sin saberlo. Además esa copia se puede regenerar solo
en Windows, con `robocopy`, así que ni la integración continua ni nadie fuera de esa máquina
puede hacerlo.

La cadena de Android en sí está sana: targetSdk 36, un solo permiso (INTERNET), y el almacén de
claves fuera del repositorio.

## Pruebas y proceso

### Cero integración continua, 828 publicaciones directas

`T10-01` · alta · faltante · esfuerzo días

No existe ningún flujo de trabajo, ni hook de git, ni script que corra las sondas. Cada empujón a
la rama principal es un despliegue a producción sin que nada compruebe siquiera que el código
compila. Ocho publicaciones en un solo día.

Las 59 herramientas de `_dev/` solo corren si quien edita se acuerda, y **29 de las 59 ni
siquiera están mencionadas** en el manual del proyecto que las prescribe.

### Y hoy hay dos sondas en rojo que nadie ha visto

`T10-02` · media · error · esfuerzo horas

Es la prueba empírica de que el sistema de «acordarse» no funciona:

1. La sonda del Campeonísimo falla porque la hoja de estilos no tiene la clase para la materia
   Repaso General. La materia entró en el catálogo el 13 de agosto y no entró en el CSS: **el chip
   de esa materia sale sin color** en el torneo.
2. La sonda de Fin de Grado exige que el total sean 61 misiones cuando el catálogo tiene 66. Es un
   número escrito a mano, exactamente lo que la normativa del propio proyecto prohíbe.

### Treinta y seis de las 66 misiones no las mira ninguna sonda

`T10-04` · alta · incompleto · esfuerzo días

La cobertura está concentrada en Robótica, Programación, Fin de Grado y Fracciones. Ciencias
Naturales, Sociales, casi toda Matemáticas de segundo ciclo y buena parte de Español no tienen ni
una comprobación de que carguen sin error, de que la evaluación se genere, o de que el panel diga
el texto exacto que el registro de evidencia necesita leer para anotar la nota.

El validador genérico pasado sobre todas da **966 errores** porque solo entiende la plantilla
vieja, así que no sirve de puerta.

- Qué hacer: una sola sonda de humo de unas cuarenta líneas que recorra el catálogo, abra las 66
  misiones y exija cero errores de consola y el formato del panel de nota.

### Sin monitoreo y sin analítica

`T10-07` y `T10-08` · esfuerzo días

No hay captura de errores en producción: si una misión revienta en el teléfono de un niño, la
única forma de saberlo es que un maestro avise. La normativa acepta que «las pruebas finales se
hacen sobre el sitio publicado», pero no existe ningún canal que devuelva lo que pasa allí.

Y no hay ningún contador de uso: ni visitas, ni aperturas por misión, ni maestros activos. **Se
decide a ciegas qué construir.** Se invirtieron semanas en 18 juegos 3D, en la sección de videos
y en la Convocatoria sin saber qué se abre. Para la parte comercial esto es determinante: sin
serie de uso no hay informe de impacto que enseñarle a nadie.

### Veintiún archivos SQL sin registro de versión

`T10-10` · alta · riesgo · esfuerzo días

Todo el esquema vive en archivos que el autor copia a mano desde la tableta, en un orden que hay
que recordar. Ni el repositorio ni la base guardan qué se aplicó y cuándo. Un despliegue que llame
a una función nueva antes de que el SQL esté pegado falla en silencio para el maestro, y ninguna
sonda lo detecta porque **la nube se simula en todas las pruebas**. Este hallazgo coincide con lo
que encontró la lente de base de datos por su lado.

### El pipeline mínimo viable ya está casi escrito

Las 26 sondas que no necesitan navegador corren en **doce segundos en total**. Esa es la batería
rápida para un flujo de integración continua: solo falta el corredor.

1. Un `.gitignore` y Playwright como dependencia de desarrollo, para dejar de instalarlo y
   borrarlo a mano en cada sesión.
2. `npm run test:rapido` (las 26, menos de quince segundos) y `npm run test:navegador`.
3. Un flujo de GitHub Actions que corra la rápida en cada empujón y la de navegador de noche.
4. Una sonda de veinte líneas que compruebe que el sellado y el nombre de la caché coinciden.
5. Captura de errores en producción hacia una función de Supabase con límite y sin datos del
   alumno.

## Qué sobra

Es el apartado más fácil de ejecutar de todo el informe: son horas y liberan unos 100 MB.

| qué | medida | por qué |
|---|---|---|
| `html2canvas` copiado 67 veces | 13 MB idénticos | El alumno que abre cinco misiones baja cinco veces la misma librería, y solo sirve al final para la foto del diploma |
| `www/` | 55 MB, 527 archivos | Copia vieja del sitio, publicada en `/www/`, que además es lo que empaqueta la app |
| `node_modules` | 34 MB, 2 426 archivos | Ningún HTML lo referencia; es lo que obliga a instalar y borrar Playwright a mano |
| `mision.html` | página muerta | Carga un motor que **nunca existió** en el repositorio, nadie la enlaza, y la normativa manda sellarla en cada versión |
| `_dev/js-arch` | 192 líneas | Andamio abandonado con el router vacío y documentación que apunta a rutas inexistentes |
| Cuatro PNG sin referencia | 20 MB | En una misión de decimales; viajan en cada despliegue y dentro del APK |
| El logo | 186 KB | Un PNG de 508×418 píxeles pintado a 32×32 en las 74 misiones |
| 82 clases de CSS sin uso | 315 líneas | En la hoja principal |
| Cuatro funciones muertas | ~50 líneas | En Mi aula, declaradas y sin una sola referencia |

Y dos cosas más que no son peso sino riesgo:

- **El Campeonísimo baja el JavaScript de una misión y lo evalúa con `new Function`** (`T2-09`)
  para extraer sus bancos de preguntas. Funciona, pero es la clase de mecanismo que un revisor de
  seguridad institucional marca de inmediato.
- **Texto escrito por el maestro va a `innerHTML` sin escapar** en el Campeonísimo, el plan de
  acción, el collage y el gobierno escolar (`T2-08`). Coincide con lo que encontró la lente de
  seguridad por su cuenta, y allí está el detalle reproducido con capturas.

## Cobertura y límites

Todas las medidas de peso y tiempo son de Chromium en un móvil emulado contra el servidor local,
que **no comprime**: las cifras «en el cable» son estimaciones asumiendo que GitHub Pages sirve
con gzip, como documenta. El peso real de Three.js no se pudo medir porque el proxy bloquea el
CDN. El sitio en vivo no es alcanzable desde este entorno, así que las cabeceras y la caché reales
de Pages no se comprobaron.

Cuarenta y ocho de los 60 hallazgos de este capítulo **no pasaron por el revisor adversarial**:
son la lectura de un solo auditor, con su evidencia, pero sin el filtro que sí tuvieron las demás
áreas. Al retomar la auditoría, esta es la primera cola que hay que correr.
