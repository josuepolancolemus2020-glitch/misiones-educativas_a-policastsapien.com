# Auditoría técnica (I): arquitectura, calidad del código, rendimiento, dependencias y proceso

Cinco lentes (T1 arquitectura, T2 calidad y redundancia, T5 rendimiento, T8 dependencias, T10
pruebas y proceso), 60 hallazgos. **Los 60 están verificados** por un revisor adversarial: doce
en la primera corrida y los otros 48 el 9 de septiembre, contra el código de ese día
(`d940fe0`, con las 20 modificaciones de la primera lista ya aplicadas). Esa segunda revisión no
tumbó ninguno como falso, pero encontró **doce que ya estaban corregidos** y ajustó la severidad
de otros diez; cada uno lleva su nota debajo del identificador, y la tabla completa va al final.
Cada afirmación de este capítulo trae su medición.

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

> ✓ **Confirmado el 9 de septiembre** (`T2-01`). Matiz del revisor: Evidencia actualizada: 325 cuerpos / 20 311 líneas / 67 copias (no 281 / 18 249 / 66). Esfuerzo semanas se mantiene; empezar por lo byte-idéntico en las 67 (_injectFormaSel, _evalRng, showToast) que es un archivo común más un sed, y dejar…

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

> ✅ **Corregido antes de esta revisión** (`T2-06`, comprobado el 9 de septiembre contra `d940fe0`): sw.js:33-70 tiene ahora ARMAZON (index.html, app.css, app.js, misiones.js, dcnb-map.js, grado-alumno.js, letra-maestro.js, las fuentes…) que se precachea en install (sw.js:150-156); buscarCopia (sw.js:181-186) hace `c.match(peticion, { ignoreSearch: true })`, así que el precache sin ?v= sí sirve a las peticiones con ?v=; y…

La lista de precarga incluye traducciones al inglés, el andamio 3D, los videos y las páginas de
las familias, pero **no incluye la portada, ni el JavaScript principal, ni la hoja de estilos**.
El armazón solo entra en la caché de forma oportunista, es decir, **desde la segunda visita**.

Medido con un service worker real: tras la primera visita la caché tiene 35 entradas y la portada
no está entre ellas. Tras la segunda, 70.

### Y cada despliegue borra todo lo que el alumno tenía guardado

`T5-04 + T1-10` · alta · error · esfuerzo horas

> ✅ **Corregido antes de esta revisión** (`T5-04`, comprobado el 9 de septiembre contra `d940fe0`): sw.js:18-21 define CACHE_APP = 'meta-app-v197' y CACHE_DATOS = 'meta-datos-v1'; el activate (sw.js:175-181) borra solo las claves que empiezan por 'meta-app-' y no son la actual, y todo lo que se baja en runtime —misiones, imágenes, Three.js opaco— se escribe en CACHE_DATOS (sw.js:243 y :288), que sobrevive al sellado. El…

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

> ✅ **Corregido antes de esta revisión** (`T5-03`, comprobado el 9 de septiembre contra `d940fe0`): Lo central del hallazgo —sin plazo, la caché no se usa nunca con red lenta pero viva, y se guardan respuestas !ok— está corregido en sw.js: PLAZO_RED = 3000 (sw.js:186), Promise.race entre la red y el plazo con caída a buscarCopia (sw.js:239-252), y guardar() descarta lo que no sea ok u opaque (sw.js:205-210). Queda un residuo:…

Para todo lo propio se pide siempre a la red, y solo se sirve la copia guardada **si el fetch
falla**. Con señal viva pero mala, que es el caso normal del aula, el alumno espera la red
completa en cada visita: unas 39 revalidaciones por página. No hay carrera contra un temporizador
que corte la espera.

Bajo 2G emulado, la portada tardó **102 segundos** en cargar.

### Y el alumno que llega por el QR nunca recibe el service worker

`T5-09` · media · incompleto · esfuerzo horas · impacto educativo 4/5

> ✓ **Confirmado el 9 de septiembre** (`T5-09`). Matiz del revisor: Registrar '/sw.js' (ruta absoluta, ámbito raíz) desde un archivo que ya carguen todas las misiones —js/barra-secciones.js o js/estrella-ganada.js van hoy en las 74 y en STATIC_ASSETS— y desde js/3d/parque-3d.js para los juegos abiertos en pestaña nueva. Ojo…

Solo la portada y la página de las familias lo registran. El alumno que entra por el código QR de
la ficha impresa, que es el camino que la propia normativa del proyecto declara principal, no
recibe nunca la promesa de funcionar sin internet.

### Tres mecanismos de versión que se estorban

`T1-10 + T2-07 + T10-05` · esfuerzo horas

> ✅ **Corregido antes de esta revisión** (`T2-07`, comprobado el 9 de septiembre contra `d940fe0`): El hecho que daba peso al hallazgo —«las entradas de STATIC_ASSETS van sin ?v= y caches.match nunca las empareja»— ya no es cierto: sw.js:183-185 y :266 usan `ignoreSearch: true`, y la sonda verifica-service-worker.js:52 lo exige. Lo que queda es opinión sobre el ritual: el ?v= sigue teniendo un valor real que el hallazgo…

> ↕ **Severidad ajustada por el revisor del 9 de septiembre** (`T10-05`: media → baja): Bajar a `baja`. La recomendación (un `_dev/sella.js` + 10 líneas en `npm test` que fallen si algún `?v=` ≠ `CACHE_NAME`) sigue valiendo, y de paso decidir qué hacer con los 16 `?v=` huérfanos de las misiones (o sellarlos con el resto o quitarlos). El riesgo…

Conviven el sellado manual `?v=NN` en 30 etiquetas, el nombre de la caché, y el pedir siempre a la
red. El sellado es **redundante** donde manda el service worker, e **incompleto** donde no llega:
65 de las 66 misiones cargan el registro de evidencia sin sello alguno, y el revisor contó que 76
de los 92 HTML de misiones no llevan ninguno. Además la precarga guarda las direcciones **sin**
el sello, así que nunca casan con las peticiones que sí lo llevan.

## El arranque

### El CSS externo deja la pantalla en blanco doce segundos

`T5-01` · alta · error · esfuerzo días · impacto educativo 5/5

> ✅ **Corregido antes de esta revisión** (`T5-01`, comprobado el 9 de septiembre contra `d940fe0`): Era cierto en 9ce2ac1 y hoy no queda ni una hoja de estilo externa. index.html:14-19 carga css/vendor/fuentes/fuentes.css (local, @font-face con unicode-range y font-display:swap) antes de app.css; css/app.css:1-5 ya no tiene el @import (solo un comentario que lo cuenta); index.html:26-28 carga Font Awesome únicamente local.…

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

> ✓ **Confirmado el 9 de septiembre** (`T5-02`). Matiz del revisor: Cifras de hoy: 28 scripts / 2,50 MB raw / 714 KB gz (no 25 / 2,44 MB). La recomendación sigue valiendo: un cargador perezoso en switchView para view-admin/gobierno/plan-accion/campeonismo/estadísticas/lectura, y lectura-textos.js solo al abrir 📖 Lectura. Hay…

> ✓ **Confirmado el 9 de septiembre** (`T2-05`). Matiz del revisor: Cambiar el título: no bloquea el primer pintado, bloquea la primera pantalla USABLE (62 s a 400 kbps). Lo demás se sostiene: 980 KB de lectura-textos.js y ~1 MB de herramientas del maestro en la portada del alumno. `defer` en los 28 es de una hora y no cambia…

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

`T2-03` · media · riesgo · esfuerzo días · impacto comercial 4/5

> ↕ **Severidad ajustada por el revisor del 9 de septiembre** (`T2-03`: alta → media): Bajar a media: es un fallo condicionado al almacén lleno, no cotidiano, y la subida sí avisa. Corrección concreta y de horas, no de días: en metas-docente-sync.js:312 y :332 comprobar que setItem ENTRÓ (releer la clave) antes de escribir la meta y la base; si…

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
- **Font Awesome entero, unos 250 KB, en 65 misiones para una flecha de volver** (`T8-02` ✅ corregido), sin
  respaldo local. Y la portada lo carga **dos veces**, local y desde CDN (`T8-09` ✅ corregido, `T5-08`).
- **MathJax sin versión fija para cuatro fórmulas** (`T8-04`): sin señal, el alumno lee el código
  fuente de la fórmula en crudo. Está medido.
- **Three.js r128, de 2021, solo desde CDN** (`T8-05`). La promesa de «ábrelo una vez con señal y
  después funciona» depende de un tercero y no se precarga.
- **Las fuentes de Google en 81 páginas** (`T8-10` ✅ corregido), en una plataforma para menores que promete
  funcionar sin internet: cada apertura con señal manda la dirección IP del niño a Google.

Lo bueno, y está comprobado con captura: **las misiones degradan con dignidad sin CDN**. Con
cdnjs y las fuentes de Google bloqueadas, la misión de Fracciones se lee y se usa entera, porque
la iconografía va por emoji. El cargador de Three.js tiene plazo de veinte segundos y pantalla de
aviso, lo que hace trivial alojarlo en el sitio.

### La aplicación de Android es otro producto

`T8-07 + T10-12` · alta · incompleto · esfuerzo días

> ↕ **Severidad ajustada por el revisor del 9 de septiembre** (`T8-07`: alta → media): Bajar de alta a media: la parte pública (sitio viejo en /www/) ya está cerrada y el APK no se distribuye, así que hoy no hay alumnos usando la copia vieja que se sepa. Queda la decisión de producto: o `build:www` portable en Node corrido en CI con versionCode…

> ✓ **Confirmado el 9 de septiembre** (`T10-12`). Matiz del revisor: Mantener media, pero con un riesgo que el auditor no nombra: el `metas-docente-sync.js` de `www/` es el de agosto —el que comparaba las dos copias enteras y se quedaba con la más nueva—; un maestro con la APK en la tableta y la web en la PC vuelve a perder la…

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

> ✅ **Corregido antes de esta revisión** (`T10-01`, comprobado el 9 de septiembre contra `d940fe0`): Hoy existe `.github/workflows/sondas.yml` (commit del 6 de septiembre): el trabajo `rapidas` corre `node _dev/corre-sondas.js` en CADA empujón a cualquier rama y el trabajo `navegador` (Playwright, `timeout-minutes: 60`) en pull request, a mano y cada noche a las 07:00 UTC. `package.json` ya tiene `test` y `test:navegador` (el…

No existe ningún flujo de trabajo, ni hook de git, ni script que corra las sondas. Cada empujón a
la rama principal es un despliegue a producción sin que nada compruebe siquiera que el código
compila. Ocho publicaciones en un solo día.

Las 59 herramientas de `_dev/` solo corren si quien edita se acuerda, y **29 de las 59 ni
siquiera están mencionadas** en el manual del proyecto que las prescribe.

### Y hoy hay dos sondas en rojo que nadie ha visto

`T10-02` · media · error · esfuerzo horas

> ✅ **Corregido antes de esta revisión** (`T10-02`, comprobado el 9 de septiembre contra `d940fe0`): (a) `node _dev/test-campeonismo-tec.js` hoy imprime «✅ TODO EN VERDE: materias, banco, estilos y ruleta al día»; la sonda ya no pide `.camp-ws-` (comentario en `_dev/test-campeonismo-tec.js:189`: era la ruleta vieja de cuatro sectores) y `css/app.css` sigue sin esa clase porque no hace falta. (b)…

Es la prueba empírica de que el sistema de «acordarse» no funciona:

1. La sonda del Campeonísimo falla porque la hoja de estilos no tiene la clase para la materia
   Repaso General. La materia entró en el catálogo el 13 de agosto y no entró en el CSS: **el chip
   de esa materia sale sin color** en el torneo.
2. La sonda de Fin de Grado exige que el total sean 61 misiones cuando el catálogo tiene 66. Es un
   número escrito a mano, exactamente lo que la normativa del propio proyecto prohíbe.

### Treinta y seis de las 66 misiones no las mira ninguna sonda

`T10-04` · media · incompleto · esfuerzo días

> ↕ **Severidad ajustada por el revisor del 9 de septiembre** (`T10-04`: alta → media): Severidad media, esfuerzo horas: la sonda de humo son ~40 líneas sobre `lib-navegador` recorriendo `MISSIONS` (goto en 393×873, cero errores de consola, `genEval()` produce el panel con `Resultado: N/100 pts`). Y NO retirar `verifica-mision-nueva.js`: lo que…

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

> ↕ **Severidad ajustada por el revisor del 9 de septiembre** (`T10-07`: alta → media): Severidad media. Aviso de entorno que el auditor no da: el proxy de estas sesiones bloquea Supabase, así que el RPC `metas_error_v1` habría que probarlo con `workflow_dispatch` como se hizo con `no-dormir-supabase.yml` (que estuvo roto tres días por no poder…

> ✓ **Confirmado el 9 de septiembre** (`T10-08`). Matiz del revisor: Mantener media. Condición que el auditor omite y aquí importa: el contador tiene que ser sin dato personal ni identificador estable del niño (Código de la Niñez), y la puerta anónima de escritura se cerró en septiembre precisamente por seguridad — el RPC…

No hay captura de errores en producción: si una misión revienta en el teléfono de un niño, la
única forma de saberlo es que un maestro avise. La normativa acepta que «las pruebas finales se
hacen sobre el sitio publicado», pero no existe ningún canal que devuelva lo que pasa allí.

Y no hay ningún contador de uso: ni visitas, ni aperturas por misión, ni maestros activos. **Se
decide a ciegas qué construir.** Se invirtieron semanas en 18 juegos 3D, en la sección de videos
y en la Convocatoria sin saber qué se abre. Para la parte comercial esto es determinante: sin
serie de uso no hay informe de impacto que enseñarle a nadie.

### Veintiún archivos SQL sin registro de versión

`T10-10` · media · riesgo · esfuerzo días

> ↕ **Severidad ajustada por el revisor del 9 de septiembre** (`T10-10`: alta → media): Severidad media. La sonda `verifica-esquema.js` que compare la versión esperada con `metas_esquema_version()` no puede correr en este entorno (proxy) pero SÍ en el CI con `workflow_dispatch`, que es justo el camino que CLAUDE.md ya prescribe para lo que aquí…

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

Los 48 hallazgos de este capítulo que la primera corrida dejó sin revisar pasaron por el revisor
adversarial el 9 de septiembre; los veredictos están en la sección siguiente y en
`crudo/tecnica-codigo-hallazgos.json` (campos `revision`, `correccion`, `resuelto`).

## Revisión adversarial del 9 de septiembre de 2026 (tecnica-codigo)

Los 48 hallazgos de esta área que se quedaron sin revisor en la primera corrida pasaron el 9 de septiembre por un revisor adversarial, contra el código de ese día (`d940fe0`, con las 20 modificaciones ya aplicadas). Resultado: **36 siguen en pie** (12 con la severidad ajustada), **12 eran ciertos y ya están corregidos**, y **0 se cayeron**.

### Confirmados y ya corregidos

| ID | título | qué lo corrige |
|---|---|---|
| T2-06 | El service worker no precachea el armazón: tras cada despliegue la app deja de funcionar sin señal hasta la segunda visita en línea | sw.js:33-70 tiene ahora ARMAZON (index.html, app.css, app.js, misiones.js, dcnb-map.js, grado-alumno.js, letra-maestro.js, las fuentes…) que se precachea en install (sw.js:150-156); buscarCopia (sw.js:181-186) hace `c.match(peticion, { ignoreSearch: true })`, así que el precache sin ?v= sí sirve a las peticiones con ?v=; y activate (sw.js:162-170) solo borra `meta-app-*` viejos y conserva CACHE_DATOS. Corrido hoy `_dev/verifica-service-worker.js` con SW real: «/index.html, /css/app.css, /js/app.js, /js/data/misiones.js quedan guardados a la PRIMERA visita» y «un despliegue crea meta-app-v198, borra el viejo y la misión guardada SIGUE ahí». Todo en verde. |
| T2-07 | El ritual de sellar ?v= en 30 etiquetas es redundante con el network-first del SW y hoy ni siquiera casa con el precache | El hecho que daba peso al hallazgo —«las entradas de STATIC_ASSETS van sin ?v= y caches.match nunca las empareja»— ya no es cierto: sw.js:183-185 y :266 usan `ignoreSearch: true`, y la sonda verifica-service-worker.js:52 lo exige. Lo que queda es opinión sobre el ritual: el ?v= sigue teniendo un valor real que el hallazgo minimiza —GitHub Pages sirve con max-age=600 y en la PRIMERA visita (sin SW controlando) o en un navegador sin SW, un index.html nuevo con app.js viejo de la caché HTTP es exactamente el desfase que el sello evita—. Que sean 30 ediciones a mano es un coste de proceso, no un defecto que le llegue a un alumno o maestro; y hoy no produce ningún efecto negativo. |
| T2-11 | No hay linter, ni CI, ni un comando que corra las 46 sondas: la calidad depende de acordarse | package.json:10-11 → `"test": "node _dev/corre-sondas.js"` y `test:navegador`; existe `.github/workflows/sondas.yml` (rápidas en cada push, navegador de noche) y `no-dormir-supabase.yml`; _dev/corre-sondas.js levanta y baja el servidor y descubre solas las 73 sondas (verifica/test/prueba); _dev/verifica-sintaxis.js hace `node --check` sobre 366 archivos y caza los escapes `\U`. Lo que queda del hallazgo es menor: no hay eslint (sigue sin `no-empty`, ver T2-03) y las tres funciones muertas siguen ahí con 0 referencias (registros-admin.js:1999 adInvDuenoEt, :2003 adInvDuenoLargo, :4903 adPrintSace; `valOf` de :3648 es una const local, no una función muerta). Eso no sostiene una severidad alta ni el título «no hay CI». |
| T8-02 | Font Awesome entero desde cdnjs en 65 misiones para una sola flecha de volver, sin SRI y sin respaldo local | El 9 de septiembre se quitó Font Awesome de las misiones: `grep -rl font-awesome misiones/*/*.html` → 0; la flecha es ahora un SVG inline en cada misión (`misiones/2y3ciclo-fracciones/fracciones.html:36 <svg class="xp-back-arrow" … stroke="currentColor">`) y `mision.html` tampoco enlaza FA. El único HTML de misiones con clases `fa-solid` es `juego-fabrica-geometrica.html:16`, que carga la copia LOCAL `css/vendor/fontawesome/css/all.min.css` para catorce iconos de verdad. Lo vigila `_dev/verifica-cdn-fuera.js`. |
| T8-09 | index.html carga Font Awesome dos veces (local + CDN) y el sw.js precachea la versión de CDN que ninguna misión usa | `index.html:28` enlaza solo `css/vendor/fontawesome/css/all.min.css`; la línea del CDN 6.4.0 ya no existe (`grep -rn cdnjs index.html mision.html sw.js` → 0). `sw.js:130-132` precachea la copia local y sus dos woff2 (`fa-solid-900`, `fa-regular-400`), no la URL de cdnjs. Fuera de `www/` no queda ninguna referencia a font-awesome en cdnjs en todo el repositorio (las 57+2 que salen en el grep global están todas bajo `www/`). |
| T8-10 | Google Fonts (Fredoka, Nunito, Fira Code) desde fonts.googleapis.com en 81 páginas de una plataforma para menores que promete funcionar sin internet | Las letras se alojan desde el 9 de septiembre: `css/vendor/fuentes/fuentes.css` con Fredoka, Nunito, Fira Code, Outfit y JetBrains Mono en woff2 latino/latin-ext, cada `@font-face` con `unicode-range` y `font-display: swap` (fuentes.css:40-105); 86 páginas enlazan esa hoja; `grep -rl fonts.googleapis --include=*.html --include=*.css` fuera de www → solo comentarios (index.html:14, mision.html:9, app.css:2, fuentes.css:4,31). Fichas: 0. La parte de «Fira Code declarada en 66 hojas» deja de costar nada: con `@font-face` local el navegador solo baja la familia que la página pinta de verdad. Y Outfit, que el hallazgo daba por huérfana, es hoy la letra del armazón (`sw.js:44`). Lo vigila `_dev/verifica-cdn-fuera.js`. |
| T5-01 | CSS externo bloqueante: con el CDN colgado la pantalla queda en blanco 12,6 s en todas las páginas | Era cierto en 9ce2ac1 y hoy no queda ni una hoja de estilo externa. index.html:14-19 carga css/vendor/fuentes/fuentes.css (local, @font-face con unicode-range y font-display:swap) antes de app.css; css/app.css:1-5 ya no tiene el @import (solo un comentario que lo cuenta); index.html:26-28 carga Font Awesome únicamente local. grep de fonts.googleapis\|cdnjs.cloudflare\|fonts.gstatic en *.html y *.css fuera de www/_dev/node_modules: 4 archivos y los 4 son comentarios (mision.html:9, index.html:14, app.css:2, fuentes.css:4,31); grep de <link href="https://…"> en todas las misiones: solo rel=canonical. Lo comprueba _dev/verifica-cdn-fuera.js. |
| T5-03 | El service worker es network-first con cache:'no-cache' y sin plazo: en 2G lento la caché no se usa nunca | Lo central del hallazgo —sin plazo, la caché no se usa nunca con red lenta pero viva, y se guardan respuestas !ok— está corregido en sw.js: PLAZO_RED = 3000 (sw.js:186), Promise.race entre la red y el plazo con caída a buscarCopia (sw.js:239-252), y guardar() descarta lo que no sea ok u opaque (sw.js:205-210). Queda un residuo: sigue siendo network-first con cache:'no-cache' para todo lo local, así que cada visita revalida cada recurso, pero acotado a 3 s por oleada de peticiones y con 304 rápido cuando la caché HTTP está caliente; no es el «~40 s en 2G» del hallazgo. Ese residuo no justifica mantenerlo abierto; lo que sí deja el arreglo nuevo (mezcla de versiones y crecimiento sin poda de CACHE_DATOS) va en hallazgos_que_faltaron. |
| T5-04 | Cada cambio de versión borra TODA la caché offline, incluidas las misiones ya visitadas (37 borrados en 15 días) | sw.js:18-21 define CACHE_APP = 'meta-app-v197' y CACHE_DATOS = 'meta-datos-v1'; el activate (sw.js:175-181) borra solo las claves que empiezan por 'meta-app-' y no son la actual, y todo lo que se baja en runtime —misiones, imágenes, Three.js opaco— se escribe en CACHE_DATOS (sw.js:243 y :288), que sobrevive al sellado. El propio comentario de cabecera cuenta los 37 borrados del hallazgo. Comprobado también que desde el 28 de agosto hubo 32 commits de sw.js y CACHE_DATOS sigue en v1. |
| T10-01 | Cero integración continua: 828 publicaciones directas a producción sin ninguna comprobación automática | Hoy existe `.github/workflows/sondas.yml` (commit del 6 de septiembre): el trabajo `rapidas` corre `node _dev/corre-sondas.js` en CADA empujón a cualquier rama y el trabajo `navegador` (Playwright, `timeout-minutes: 60`) en pull request, a mano y cada noche a las 07:00 UTC. `package.json` ya tiene `test` y `test:navegador` (el `exit 1` desapareció). La API de GitHub lo confirma: el flujo «Sondas» sale `completed / success` en 4c10911, d940fe0, 7aebec3, 506cddc, 37508f5… (todos los empujones del 8 y 9 de septiembre), más una ejecución `schedule` en verde el 9 a las 12:08. Lo de «29 herramientas sin nombrar en CLAUDE.md» (hoy 39 de 86) ya no tiene consecuencia: `corre-sondas.js` las descubre solas leyendo `_dev/` y nombra una por una las que excluye. Lo único de la recomendación que NO se adoptó es condicionar el despliegue de Pages a que las rápidas pasen: el propio yml lo dice («Esto NO frena la publicación»), y con 12 s de sondas rápidas sería barato, pero es una decisión distinta del hallazgo «cero CI». |
| T10-02 | Dos sondas fallan hoy y nadie lo sabe: regresión real en el Campeonísimo y un conteo escrito a mano en Fin de Grado | (a) `node _dev/test-campeonismo-tec.js` hoy imprime «✅ TODO EN VERDE: materias, banco, estilos y ruleta al día»; la sonda ya no pide `.camp-ws-` (comentario en `_dev/test-campeonismo-tec.js:189`: era la ruleta vieja de cuatro sectores) y `css/app.css` sigue sin esa clase porque no hace falta. (b) `_dev/verifica-fin-de-grado.js:28-32` explica que el número «se cuenta del catálogo» y la línea 173 compara contra `TOTAL_MISIONES` calculado (`ok(\`el filtro Todas cuenta ${TOTAL_MISIONES} misiones\`…)`), no contra el literal `'61'`. Además ambas corren ahora en el CI (T10-01), que era la mitad del argumento. |
| T10-03 | No hay un corredor único: 59 scripts sueltos, cinco formas distintas de arrancar Chromium y un puerto equivocado | Existe `_dev/lib-navegador.js` (una sola forma de encontrar Chromium: `CHROMIUM_BIN`, `METAS_CHROMIUM` o el de Playwright, líneas 38-51) y lo usan 45 sondas; solo 2 archivos llaman `chromium.launch` y uno es la propia biblioteca. Existe `_dev/corre-sondas.js`, que descubre `_dev/*.js`, separa con/sin navegador por `require('./lib-navegador')`, levanta y baja el servidor en 8123 (líneas 81-111) y devuelve código de salida único; expuesto como `npm test` y `npm run test:navegador`. Residuos menores que no sostienen el hallazgo: `_dev/verifica-mision-navegador.js:13` sigue con `'http://localhost:8080'` por defecto (CLAUDE.md la manda correr con `METAS_BASE=http://localhost:8123`), y el corredor es secuencial (`spawnSync`, línea 96), sin el `xargs -P` recomendado — aceptable porque va de noche. |
