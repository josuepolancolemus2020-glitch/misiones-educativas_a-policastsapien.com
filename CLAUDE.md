# Cómo se trabaja en M.E.T.A.S.

Notas para quien retome este proyecto. No son sugerencias: son las reglas
que ya se acordaron trabajando, y romperlas cuesta caro en un aula real.

## Al terminar un cambio: commit y push, siempre

No hay que preguntar. Cada cambio terminado y probado se **commitea y se
sube a `main`**, que es de donde se publica el sitio
(metas.policastsapien.com, GitHub Pages). Publicar es el final del trabajo,
no un paso aparte.

Si el trabajo se hizo en una rama aparte, la rama **no es el final**: se
fusiona en `main` y se sube. Un cambio que se queda esperando permiso en
una rama es un cambio que el maestro no tiene. Tampoco se pregunta «¿lo
fusiono o abro un pull request?»: se publica.

Se publica aunque falte probarlo en el teléfono real. La plataforma
todavía tiene pocos usuarios y las pruebas finales se hacen **en línea,
sobre el sitio publicado**; si algo sale torcido, se arregla con otro
commit. Esperar cuesta más que corregir.

Solo se para a preguntar si el cambio **borra datos del maestro o de las
familias** (claves ya entregadas, listas, notas): ahí sí, primero se avisa.

Los mensajes de commit se escriben **en español, contando qué le cambia al
maestro**, no qué archivo se tocó. Se mira `git log` para tomar el tono.

## Empujar no es publicar: se comprueba el despliegue

`git push` dice que el commit llegó al repositorio. **No dice que el
sitio lo esté sirviendo.** El sitio se sirve desde **GitHub Pages, rama
`main`**, sin archivo de flujo de trabajo propio: Pages construye sola en
cada push. Antes de decir que algo está publicado hay que mirar cómo
quedó esa construcción:

```
https://api.github.com/repos/<usuario>/<repo>/actions/runs?per_page=20
```

y buscar **el `head_sha` del commit propio** en `completed / success`.
Sirve sin credenciales porque el repositorio es público.

⚠️ **Buscar el commit propio, no mirar la primera fila.** El 28 de agosto
de 2026 el listado enseñaba `completed / success` arriba del todo… del
commit ANTERIOR. El nuevo no tenía ejecución ninguna: Pages no la había
encolado siquiera, quince minutos después del push. Mirar la primera fila
habría dado el cambio por publicado. **No hay construcción** no es lo
mismo que **construcción fallida**, y se parecen mucho a la vista.

Y en `?status=queued` hay **zombis**: ejecuciones paradas desde el 3 de
julio y el 6 de agosto de 2026. No estorban a las nuevas, pero despistan
al que busque la suya por ahí.

Si no arranca ninguna, la salida es **empujar un commit nuevo**, que
provoca una construcción limpia.

Y un aviso para quien lo compruebe desde una sesión de Claude Code: el
proxy de esas sesiones **bloquea el dominio del sitio**, así que la
página en vivo no se puede pedir con `curl` desde ahí. `api.github.com`
sí responde, y por eso la comprobación va por la API.

## Sellar la versión en cada cambio

El teléfono del maestro guarda la aplicación en caché y se queda con la
versión vieja. Por eso, en **todo** cambio de HTML, CSS o JS hay que subir
el número en dos sitios:

- las etiquetas `?v=NN` de `index.html`, `mision.html`, `consulta-nube.html`,
  `evaluaciones.html` y `registro.html`;
- `CACHE_NAME` en `sw.js`.

Si no se sella, el despliegue existe pero nadie lo ve.

⚠️ **`CACHE_DATOS` no se sella nunca.** Desde el 6 de septiembre de 2026 `sw.js`
tiene dos cachés y hacen cosas distintas: `CACHE_NAME` lleva el armazón y se
renueva en cada despliegue —ese es el que se sube—, y `CACHE_DATOS` lleva lo
que el alumno y el maestro ya visitaron: las misiones, sus imágenes, el motor
de los juegos. Subirle el número a la segunda le borraría al alumno lo que
tenía guardado en el teléfono, que es exactamente lo que pasaba antes: había
una sola caché con la versión dentro, y **cada publicación se llevaba por
delante las misiones que él había abierto con señal para usarlas sin ella**.
Entre el 13 y el 28 de agosto de 2026 eso ocurrió 37 veces.

Y el armazón —`index.html`, `app.css`, `app.js`, `misiones.js` y los datos
pequeños de la portada— va precacheado en `ARMAZON`, para que la aplicación
abra sin señal **desde la primera visita**. A propósito NO están los 25 scripts
de la portada (2,8 MB): las herramientas del maestro entran solas en
`CACHE_DATOS` la primera vez que abre en línea, y ahora se quedan.

Se comprueba con un service worker de verdad, que es el punto ciego de siempre:

```
node _dev/servidor-estatico.js        (en otra terminal)
node _dev/verifica-service-worker.js
```

## Normativa: ninguna hoja de estilo viene de otro país

Una hoja de estilo **bloquea el pintado** hasta que llega. Si está en otro
servidor y en otro país, lo que bloquea es la señal del aula.

Medido el 9 de septiembre de 2026 con el CDN **colgado** —que es lo que hace
la señal de un pueblo: no rechaza la conexión, se traga los paquetes y no
contesta nunca—, antes de tocar nada:

| página | primer pintado |
|---|---|
| la portada | **no pintó en 2 minutos** |
| Las Fracciones | **no pintó en 2 minutos** |
| Sólidos Geométricos, Fin de Grado 6º, una ficha del maestro | no pintaron en 20 s |
| `padres.html`, que nunca pidió nada fuera | **88 ms** |

Pantalla en blanco, no lenta: **blanca, y sin final**. `padres.html` decía
dónde estaba el problema: sin CSS externo, 88 ms con el mismo CDN colgado.

Venían de fuera **81 páginas** pidiendo Google Fonts —74 misiones y 8 fichas
del maestro—, el `@import` de la primera línea de `css/app.css`, y **65
misiones** bajando Font Awesome entero. Hoy: **cero**. Ni una hoja de estilo,
ni un `preconnect`, ni un `@import` sale del sitio, en ninguna página. La
portada pinta en 428 ms y una misión en 200, con el CDN igual de colgado.

**Cinco reglas, y ninguna es de adorno:**

1. **Las letras se alojan, no se cambian por `system-ui`.** Fredoka es la cara
   de las misiones y Outfit la de la aplicación del maestro. Arreglar la
   espera cambiando la letra habría arreglado el problema cambiando el
   producto. Viven en `css/vendor/fuentes/`, con licencia SIL Open Font, que
   es exactamente para esto.
2. **Solo el subconjunto latino y el latin-ext**, y **cada `@font-face` con su
   `unicode-range`**. El latino trae todo lo del español —tildes, ñ, ¿, ¡ y el
   º de «6º-1»—; el latin-ext solo se baja en la página que lo necesita (la de
   los continentes tiene una `ł` y una `ż`). Del CDN venían además el
   cirílico, el griego, el hebreo y el vietnamita. Y por eso **la portada no
   se trae las tres letras de las misiones**: no se baja letra que no se pinta.
3. **`font-display: swap`, siempre.** El texto sale desde el primer momento
   con la letra del sistema y cambia cuando llega la nuestra. El alumno con
   mala señal **lee**; antes esperaba, y a veces para siempre.
4. ⚠️ **Nunca un `@import` remoto.** Es lo peor de los dos mundos: bloquea el
   pintado **y** va en cadena —el navegador tiene que bajar y leer `app.css`
   entera antes de enterarse de que hace falta otra cosa, en otro servidor—.
   Las letras van en su propio `<link>`, **antes** del CSS que las usa.
5. **No se trae una biblioteca de iconos por un icono.** Las 65 misiones —y
   `mision.html`— bajaban los 102 KB de Font Awesome, del otro lado del mundo
   y bloqueando, para pintar **uno**: la flecha de volver. Ahora es un SVG de
   cinco líneas que hereda el color y el tamaño (`currentColor`, `1em`), así
   que el CSS de las 65 no se tocó. Quien lo usa de verdad —la aplicación del
   maestro, con cuarenta iconos, y el juego de la Fábrica Geométrica, con
   catorce— se queda con él, pero **local**, que ya estaba en el repositorio.

**Cuando entre una misión o un juego nuevo, se le da el mismo trato**, y esto
pasa: el 9 de septiembre de 2026, mientras se hacía este cambio, entraron por
`main` una misión (Aspectos Cívicos) y un juego (Fábrica Geométrica) pidiendo
las letras y los iconos al CDN, como hacía todo lo demás. El juego traía
además una letra que no teníamos, **JetBrains Mono**; se alojó, no se cambió
por Fira Code —que también es monoespaciada y ya estaba—: la letra la eligió
quien hizo el juego. La sonda es la que lo caza, y de paso cazó `mision.html`,
que llevaba desde siempre bajándose Font Awesome entero por su flecha.

⚠️ **Y volvió a pasar el 11 de septiembre de 2026, con las dos misiones
siguientes de la Ruta de la Patria** —el Himno (68) y los próceres (69)—: las
dos se calcaron de una plantilla ANTERIOR al arreglo, así que traían otra vez
los tres `preconnect`, el `<link>` de Google Fonts con Fredoka, Nunito y Fira
Code, y Font Awesome entero por la flecha de volver. La 68 estuvo así
publicada. La lección no es «acordarse»: es que **al copiar una misión se copia
también lo que ya se arregló**, y lo único que lo caza es correr
`verifica-cdn-fuera` ANTES de publicar —la plantilla de la que se copia no se
actualiza sola—.

⚠️ **Y en `sw.js` había una mentira que nadie podía ver:** pre-cacheaba la
**CSS** de Google Fonts y nunca los `.woff2` de `fonts.gstatic.com`, así que
sin señal la letra no llegaba igual. Al armazón se le suma solo **Outfit**,
que es la letra de la portada —`index.html` sí abre sin señal la primera
vez—; las de las misiones **no**, y no es un olvido: una misión que no se
visitó en línea no está en la caché, así que guardarle la letra sería guardar
la letra de una página que todavía no existe.

**Lo que sí puede venir de fuera, y por qué.** Three.js en los 18 juegos 3D y
MathJax en la misión de áreas del círculo: los dos son `<script>`, no hojas de
estilo. Three.js lo carga el propio juego detrás de su telón, con su aviso de
«hace falta internet la primera vez» y su normativa propia; MathJax va con
`async`, que por definición no está en el camino crítico.

**Y queda dicho lo que NO se tocó:** los 18 juegos 3D declaran `Fredoka` en su
CSS y **nunca la han cargado** —llevan la letra del sistema desde siempre—. Se
dejan como están: darles ahora la letra buena les mueve la maquetación, y esos
paneles están medidos al píxel y tienen sonda propia.

⚠️ **Y algo que hay que saber al medir una maquetación desde hoy:** hasta el 9
de septiembre de 2026 las letras venían del CDN y **llegaban tarde**, así que
toda medida tomada en una sonda se tomaba con la letra del SISTEMA, no con la
nuestra. Se vio en el juego de la Fábrica Geométrica: acostado (740×360) su
botón «Vaciar los huecos» caía 4 px por debajo del borde en cuanto la letra
llegaba a tiempo —o sea, en el teléfono de cualquiera que tuviera señal—, y la
sonda lo daba por bueno porque medía antes de que llegara. Ahora las letras
están puestas desde el primer momento y **lo que mide la sonda es lo que ve el
alumno**. Las sondas que cuentan hojas de papel —informes, fichas, boletos,
listados— siguen todas en verde, y desde hoy cuentan con la letra de verdad.

**Antes de publicar un cambio de las tipografías o de los enlaces de la
cabecera:**

```
node _dev/servidor-estatico.js     (en otra terminal)
node _dev/verifica-cdn-fuera.js
```

Lee **del archivo** todas las páginas y todas las hojas de estilo del
repositorio —abrirlas con Playwright no lo corre nadie, y las cuenta ella,
que no se escriben— para lo que se multiplica al copiar una misión: que no se
cuele una hoja de estilo externa, que quien pinta con una de esas letras la
enlace, y que **nadie cargue Font Awesome entero por una flecha** —con
catorce iconos de verdad sí vale, y eso pasa en un juego—. Y abre tres con los tres servidores **colgados** —no abortados:
abortar sería hacerle un favor al código viejo—: que pinten, que no salga ni
una petición hacia ellos, que la letra que se ve sea la nuestra y salga del
sitio, y que la flecha se vea y **se pueda tocar**.

## Normativa: los datos del maestro se FUSIONAN, no se eligen

Un maestro usa el teléfono en el aula y la PC por la noche. Hasta el 9 de
septiembre de 2026 el espejo del aula comparaba las dos copias **enteras** y
se quedaba con la más nueva. Medido con dos equipos y la nube de mentira:

| | |
|---|---|
| pasa lista en el **teléfono** a las 9:00, sin señal | se guarda ahí |
| pone una nota en la **PC** a las 20:00 | sube a la nube |
| vuelve la señal en el teléfono | **la asistencia del día desaparecía** |

Y no era solo eso: el teléfono **ni siquiera llegaba a subirla** —la daba por
resuelta— y el botón «Recuperar» **no aparecía**, porque solo salía con el
aula vacía. Al revés pasaba lo mismo: con el reloj del teléfono adelantado, la
que se perdía era la nota de la PC. Las dos direcciones perdían.

Un día de asistencia son 43 nombres que el maestro ya no puede reconstruir: no
estaba mirando, estaba dando clase.

Ahora no se elige una copia: se **fusionan las dos, dato por dato**
(`js/metas-fusion-aula.js`). Después del arreglo, en el mismo caso: la
asistencia está, la nota está, y la copia fusionada **sube**, que es lo que
impide que mañana el otro equipo vuelva a mandar la suya a medias.

**Cinco reglas, y ninguna es de adorno:**

1. **Tres versiones, no dos.** Se guarda la **BASE** —lo último que este
   equipo y la nube tuvieron igual, en `METAS_DOCSYNC_BASE_V1`—, y es lo único
   que distingue *lo que alguien añadió* de *lo que el otro borró*. Sin base
   solo se puede UNIR, y unir revive un alumno que el maestro quitó; con base
   se borra de verdad. Ocupa el doble de sitio, y si el almacén del teléfono
   se llena, esa clave se cae de la base y se pasa a unir: quedarse sin base
   es un incordio, perder la asistencia del día no.
2. **Las listas se emparejan por su identidad, no por su posición.** Se busca
   un campo único —`id` en colectas, controles, bitácora, convocatorias y
   análisis; `f` en un día de asistencia; `num` en un alumno— y si no hay
   ninguno se usa **el contenido**. Las tomas de lectura no llevan `id` y
   varias caen el mismo día: ahí el contenido es la identidad buena, porque
   una toma no se edita, se añade.
3. ⚠️ **Editar gana a borrar.** Si un equipo borró algo y el otro lo cambió,
   se queda lo cambiado. Devolverle al maestro un alumno que borró se arregla
   en dos toques; quitarle una nota que acaba de escribir, no.
4. **Solo cuando los dos cambiaron LO MISMO manda el reloj.** Es el único
   sitio donde se elige, y por eso el reloj ya casi no decide nada.
5. ⚠️ **La fusión no sabe ni un nombre de campo de este proyecto**, y es a
   propósito. Con la lista de campos dentro se quedaría vieja en la primera
   herramienta nueva —y no daría ningún error: pasaría a perder ese dato en
   silencio, que es justo lo que vino a arreglar.

**Dos redes debajo, para cuando la fusión no se pueda hacer:**

- Si `MetasFusion` no está o devuelve `null` (algo no es JSON, o los dos lados
  no tienen la misma forma), **se hace lo de siempre**: gana la más nueva. Por
  eso el `<script>` va antes del espejo y el espejo lo llama con `typeof`: si
  un día no carga, la aplicación sigue funcionando como antes.
- Y una fusión **no puede devolver menos de la mitad** de la copia más llena.
  Borrar media aula en una sincronización no pasa; un error en la fusión sí
  podría. Ante la duda, lo de siempre.

⚠️ **Y «Recuperar» ahora sale con el aula llena.** El respaldo guarda POR QUÉ
se hizo: el de «Empezar de nuevo» es el deshacer de un borrado total y solo
tiene sentido con el aula vacía; el de una sincronización que pisó datos es lo
contrario, y ese botón tiene que verse **aunque el aula esté llena**. Se
muestra cuando la copia guardada tiene algo que ahora **no está**. Y recuperar
ya no pisa: **fusiona** lo guardado con lo que haya, porque devolver la
asistencia de ayer no puede borrar la nota de hoy.

⚠️ **Un equipo sin cambios pendientes SIEMPRE baja lo de la nube.** Antes se
comparaban versiones incluso sin nada que subir, y un teléfono con el reloj
adelantado dos años —que los hay— se quedaba **congelado para siempre**: veía
su aula de siempre mientras la PC seguía trabajando. Si aquí no hay nada
pendiente, la nube ya tiene lo nuestro, así que lo que traiga distinto es más.

**Antes de publicar un cambio del espejo o de la fusión:**

```
node _dev/prueba-fusion-aula.js        → la fusión, caso por caso y sin navegador
node _dev/servidor-estatico.js         (en otra terminal)
node _dev/verifica-fusion-sync.js      → los dos equipos, con la nube de mentira
```

El primero cuesta un segundo a propósito: es el que hay que poder correr cada
vez que se toca. Vigila lo que cuesta caro —que no se pierda una asistencia,
una nota, una toma de lectura ni **una clave de familia ya entregada**—, que
borrar borre, que editar gane a borrar, que sin base no se borre nada y que
ante lo raro devuelva `null` en vez de inventar. El segundo comprueba lo que
solo se ve abriendo la aplicación: que el espejo la use, que la copia
fusionada **suba**, que los dos equipos acaben con lo mismo y que sin la
fusión no reviente nada.

### Lo que NO se hizo, y por qué

- **Partir `METAS_ADMIN_V1` en una llave por grupo.** Con la fusión dato por
  dato ya no hace falta para no perder trabajo, y partirla toca
  `registros-admin.js` entero —5 000 líneas— con una migración de los datos
  que el maestro ya tiene. El beneficio que quedaría es de tamaño de la
  petición, no de seguridad del dato.
- **La hora del servidor en vez de `Date.now()`.** Sigue siendo mejor, pero
  con la fusión el reloj solo decide cuando los dos equipos cambiaron el mismo
  dato, que es el caso raro. Antes decidía siempre.
- **Los respaldos y la retención.** El plan gratuito no trae copias y esto no
  se arregla con código: es la decisión de pasar a plan de pago, que es del
  autor. Lo que sí se hizo es que la nube **no se duerma**.

## Normativa: la alumna ve primero lo de SU grado — y no se le esconde nada

Medido el 9 de septiembre de 2026, antes de tocar nada, con una alumna de 4º
que YA había escrito su grado al entrar en su primera misión:

| | |
|---|---|
| tarjetas en la lista | **67** |
| las cinco primeras | Los Adjetivos · Los Verbos · Los Sustantivos · Los Pronombres · **El Adjetivo Avanzado** (de Bachillerato) |
| buscar «cuarto» | **0 resultados** |
| buscar «4to» | **0 resultados** |

Las mismas 67, en el mismo orden, para ella y para uno de 9º. **Cuatro de los
cinco recorridos de la auditoría se atascaron ahí**, en la primera pantalla.

El dato existía y no se usaba: `js/data/dcnb-map.js` dice en qué grados entra
cada misión, y su cabecera pedía **no usarlo en ninguna vista del estudiante**
para que ningún niño se sintiera señalado por trabajar contenido de un grado
inferior. El miedo es legítimo; lo que estaba mal era el remedio, porque el
precio lo pagaba ella entera: **esconderle el dato no la protege de nada, la
deja perdida**.

**Tres reglas, y son las que quitan el estigma sin quitar la ayuda:**

1. **Se ORDENA, nunca se filtra.** Lo suyo va primero; lo demás sigue ahí,
   entero y a un dedo. La sonda cuenta que los dos montones sumen SIEMPRE el
   catálogo completo.
2. ⚠️ **Solo se rotula lo que SÍ es suyo.** Hay un «📚 Para 4º grado» encima de
   sus misiones y **nada** encima de las otras que diga de qué grado son:
   «También puedes con estas», y ya. Un «esto es de 2º» es exactamente lo que
   había que evitar, y la sonda comprueba que ese segundo rótulo no nombre
   ningún grado.
3. **Nunca se adivina.** 47 de las 67 dicen «II y III Ciclo», que vale igual
   para 4º y para 9º: repartirlas a los seis grados pondría 47 tarjetas en
   todos y el orden no diría nada. Donde no hay dato, no hay rótulo. Las
   fuentes son dos y ninguna se inventa: el mapa del DCNB, y el campo `grade`
   **cuando nombra UN grado** —que no es un detalle: las Pruebas de Fin de
   Grado no están en el mapa y son justo lo que más le importa a la alumna de
   ese grado—.

⚠️ **Y dentro de su montón NO vale el orden del catálogo.** Esto se vio
midiendo, después de creerlo terminado: doce misiones son **espirales** —el
DCNB retoma la gramática y la ortografía los seis años—, están al principio
del catálogo, y con el orden de siempre lo primero que veían la de 4º y el de
9º volvía a ser lo mismo: Los Adjetivos, Los Verbos, Los Sustantivos. **La
mitad del arreglo se perdía justo en la primera pantalla**, que es donde se
atascaron los recorridos. Ahora sube antes **lo más suyo**: cuantos menos
grados comparte una misión, más arriba. La de 4º empieza por Números Grandes y
Valor Posicional; el de 9º, por lo suyo.

⚠️ **No se le pregunta el grado otra vez.** Ya lo escribió al entrar en su
primera misión (`METAS_ALUMNO_V1`), y la lectura de lo que escribió a mano
—«4», «4º», «4to A», «cuarto», «6º-1», «61»— es la misma que hace
`estParteGrupo` en la pantalla del maestro.

⚠️ **Y el chip se guarda en SU PROPIA llave** (`METAS_GRADO_VISTA_V1`), nunca
dentro de `METAS_ALUMNO_V1`: esa identidad **viaja pegada a cada resultado que
llega al maestro**, y una preferencia de vista no tiene por qué entrar en el
expediente de nadie. La sonda lo comprueba tocando otro chip y mirando que el
grado del alumno no cambie.

**El buscador también encuentra por grado.** «cuarto», «4to» y «4º» daban 0, 0
y 1; ahora dan las 29 que son suyas. El `º` no es una tilde y por eso no lo
quitaba `sinTildes`: se normaliza aparte.

**Los chips van a 44 px**, la regla de siempre. Las píldoras de materia de al
lado se quedaron más bajas de antes; hacer la nueva igual de pequeña habría
sido copiar el problema en vez de dejarlo donde está.

**Antes de publicar un cambio del grado o del catálogo:**

```
node _dev/prueba-grado-alumno.js       → de qué grado es cada misión, sin navegador
node _dev/servidor-estatico.js         (en otra terminal)
node _dev/verifica-grado-alumno.js     → la pantalla de la alumna
```

El primero cuesta un segundo y es el que hay que correr al tocar el catálogo o
el mapa del DCNB: que ningún grado se quede sin misiones, que no se invente
ninguna, que se ordene de lo más suyo a lo más compartido y que **la primera
pantalla de la de 4º no sea la del de 9º**. El segundo abre la aplicación: que
el chip salga marcado solo, que se pueda tocar, que no desaparezca ni una
tarjeta, que el segundo rótulo **no nombre ningún grado**, que «Todos» los
quite, que la elección aguante cerrar la aplicación y que **no toque el
expediente del alumno**.

### Lo que NO se hizo, y por qué

- **Contenido distinto por nivel.** 47 misiones sirven el mismo texto a un niño
  de 9 años y a uno de 15. Eso es meses de escritura, no una pantalla, y sigue
  siendo el problema de fondo. Lo de aquí es que al menos encuentre lo suyo.
- **Filtrar por grado.** Se descarta a propósito: ocultar es lo que convierte
  el dato en una etiqueta. Con ordenar y rotular solo lo suyo, el estigma no
  aparece por ningún lado y la ayuda sí.
- **Rellenar el mapa del DCNB de las 20 que no lo tienen** (Robótica,
  Programación, E. Cívica, Inglés). Once de ellas no están en el DCNB
  hondureño, así que no es un olvido: es que no hay grado que ponerles.

## Normativa: la nube no se duerme en vacaciones

El plan gratuito de Supabase **pausa el proyecto tras siete días sin una sola
petición**, y el calendario hondureño tiene un hueco de tres meses: de
noviembre a febrero las aulas están cerradas y nadie abre la aplicación.

Lo que le cuesta al maestro no es una pantalla lenta: en febrero entra a
preparar el año, no le carga la lista de su aula y **da por hecho que perdió
el trabajo del curso pasado**. No lo pierde —los datos siguen ahí—, pero eso
él no lo sabe, y reactivar el proyecto es a mano y desde el panel de Supabase.

Lo evita `.github/workflows/no-dormir-supabase.yml` con una lectura **cada
tres días**. Tres y no siete a propósito: con siete, una sola ejecución que se
retrase —GitHub retrasa los `schedule`— ya deja pasar el plazo. La dirección y
la clave se **leen de los archivos del repositorio** (`js/metas-docente-sync.js`
y `js/metas-sugerencias.js`) para que no haya dos sitios que digan lo mismo. Y
**falla a propósito** si la nube no contesta bien: enterarse por un correo del
CI cuesta un minuto; enterarse en febrero, con el maestro delante, cuesta su
confianza.

⚠️ **La petición va a `/auth/v1/health`, NO a la raíz de la API REST**, y la
diferencia no es de estilo: `/rest/v1/` contesta **401 «Secret API key
required»** a cualquier clave publicable —esa puerta pide clave secreta, a
propósito— y **una clave secreta no puede vivir en un repositorio público**. La
salud del servicio de cuentas sí abre con la publicable, va con la cabecera
`apikey` (la puerta de entrada la exige en todo), no toca ninguna tabla, no
devuelve un dato de nadie, y basta: lo que evita la pausa es que la petición
**llegue al proyecto**.

⚠️ **Y se tocan las DOS nubes**, no una. La de M.E.T.A.S lleva las aulas del
maestro; la de F.A.R.O es por donde salen las **sugerencias que escriben los
alumnos** y por donde entran los **videos de las misiones**. Si esa segunda se
duerme, el alumno escribe su sugerencia, se queda en la cola y nadie la lee
nunca. Se toca desde aquí porque es desde aquí desde donde se la llama, aunque
su panel viva en otro repositorio.

⚠️ **Esto se publicó el 8 de septiembre sin poder probarse y estuvo roto tres
días.** El proxy de las sesiones de Claude Code **bloquea también el dominio de
Supabase**, así que no había forma de comprobarlo desde aquí; se dio por bueno
y la primera ejecución de verdad —lanzada a mano el 9 de septiembre— falló, y
las dos siguientes también, hasta imprimir el cuerpo de la respuesta y leer
«Secret API key required». Habría seguido fallando cada tres días, **sin
despertar nada**, hasta febrero. La lección, y vale para todo lo que este
entorno no alcanza: **lo que no se puede probar aquí se lanza a mano en GitHub
y se mira el resultado** —`workflow_dispatch` está puesto justo para eso—, y
mientras no se haya visto en verde, no está hecho.

⚠️ **Lo que esto NO resuelve:** GitHub apaga los `schedule` de un repositorio
que lleve **60 días sin un solo empujón**. Hoy se publica casi a diario, así
que no aplica; el día que aplique, la respuesta de verdad es el plan de pago
—no se pausa y trae copias diarias—, que es una decisión del autor.

## Normativa: el SQL de Supabase se pega en el chat, SIEMPRE

Los archivos `SUPABASE-*.sql` —y los de `supabase/sql/` del proyecto de la
revista— **no se ejecutan solos**: hay que abrirlos, copiarlos enteros y
pegarlos a mano en el SQL Editor de Supabase. Y eso lo hace el autor
**desde el teléfono o la tableta**, casi siempre sin el repositorio
delante.

Por eso: cuando un cambio necesite correr SQL, **el código va escrito en
la respuesta del chat**, entero y listo para copiar. No vale con decir
«está en `supabase/sql/buzon_lector.sql`»: buscar un archivo dentro de
GitHub desde una tableta es exactamente el paso donde el trabajo se queda
parado una semana.

Con el código van tres cosas más, y las tres hacen falta:

1. **En qué orden** se corre, si son varios archivos.
2. **Si hay que volver a correr algo que ya se corrió**, y por qué. Pasa
   más de lo que parece: añadir una clase nueva al Buzón obligó a
   re-correr los dos archivos, porque la lista de clases vive dentro de
   las funciones.
3. **Cómo se comprueba** que quedó puesto, sin tener que fiarse del
   «Success» del editor.

Se pega **el archivo completo**, no un trozo. Son idempotentes a
propósito: correrlos dos veces no rompe nada, y un recorte pegado a
medias sí.

## Normativa: el catálogo crece, y el texto tiene que saberlo

Cuántas misiones hay **no es un dato del proyecto: es una foto**. Hoy son 57
porque ese es el avance de hoy; el plan es cubrir el currículo entero de
Básica en sus tres ciclos y de Media, y después mirar hacia las currículas
de Latinoamérica. Un material que dice «son 57 misiones» envejece en la
semana siguiente, y peor: le sugiere al maestro que eso es todo lo que va a
haber.

Dos reglas, y la primera es la que de verdad resuelve:

1. **Donde haya JavaScript, el número se cuenta, no se escribe.** El
   catálogo vive en `js/data/misiones.js` (`MISSIONS`, `RUTAS`), que es puro
   dato y se puede cargar en cualquier página. Las misiones del maestro lo
   cargan y pintan las cifras al vuelo (`CAT` en su JS, con marcadores
   `{{MISIONES}}`, `{{RUTAS}}`, `{{MATERIAS}}` en el texto). Así el día que
   entre la misión 58 el texto se corrige solo.
2. **En papel, donde no hay JavaScript** (fichas imprimibles, manuales), el
   número se escribe **fechado y con el rumbo a la vista**: «hoy son 57 y
   siguen entrando», nunca «son 57». La ficha se imprime y se guarda un año
   entero en una gaveta.

Lo mismo vale para las demás cifras del producto (rutas, materias, formas,
herramientas): se cuentan, y si se escriben, se fechan.

## Normativa: cómo se escribe un grupo

Un grupo **siempre** se lee `6º-1` — sexto grado, sección 1. Nunca `6 1`
(dos números sueltos) ni `61` (parece sesenta y uno).

La regla vive en **`adGradoSeccion`** (`js/tools/registros-admin.js`), con
su explicación al lado. Todo lo que junte grado y sección para mostrarse
pasa por ahí: pantallas, documentos impresos y mensajes de WhatsApp. Si
alguna vez hay que cambiar el formato, se cambia ahí y en ningún otro sitio.

`padres.html` y `salida.html` son páginas autónomas —no cargan ese archivo— y
llevan su propia copia de la regla (`grupoTxt`), marcada con la misma nota. Si
cambia una, cambian las tres: la madre y el maestro tienen que leer lo mismo.

## Normativa: la barra de grupos se ordena con el dedo

Un maestro con dos colegios llega a tener **diez o doce grupos** en la
barra de Mi aula, y los que abre a diario son dos o tres. El orden en que
se crearon no es el orden en que se usan: a partir del quinto hay que ir
leyendo chip por chip. Por eso se **arrastran** (`adGruposArrastrar`, en
`js/tools/registros-admin.js`) y el orden se guarda con sus grupos.

Cuatro reglas, y las cuatro salen de que esto se usa con el dedo:

1. **No se usa `draggable` del navegador**: es de ratón y en un teléfono
   no existe. Se hace con eventos de puntero, que valen para los dos.
2. **Se agarra manteniendo tocado** (~380 ms), no al primer roce. Un
   toque corto **sigue siendo cambiar de grupo** —que es lo que se hace
   cuarenta veces al día— y un dedo que baja para deslizar la página no
   puede llevarse un grupo por delante. Con ratón basta con arrastrar.
3. **El hueco enseña dónde va a caer**, y mientras se mueve la página no
   desliza (`touchmove` con `preventDefault`).
4. **Al soltar NO se repinta la pantalla.** La barra ya está en el orden
   nuevo, y repintarla justo al soltar le arranca de debajo del dedo el
   elemento que iba a recibir el toque. Solo se guarda y se retira la
   pista.

**El nombre del colegio solo se pinta si hay más de uno.** Con once
grupos de la misma escuela, repetir «JOHN ARNOLD COOK» once veces no
distingue nada y duplicaba el alto de la barra: eran seis renglones de
chips en un teléfono antes de llegar a lo suyo. Con dos colegios vuelve,
porque entonces es lo único que separa un 6º del otro.

Y el chip activo va **relleno**, no solo con el borde de otro color: en
la pantalla de un teléfono al sol un borde de milímetro y medio no se
distingue, y equivocarse de grupo es pasar lista en el aula que no era.

```
node _dev/servidor-estatico.js       (en otra terminal)
node _dev/verifica-orden-grupos.js
```

La sonda mueve un grupo **con el dedo** (eventos de puntero de verdad,
no `dragAndDrop`): que se mueva, que el orden aguante cerrar la
aplicación, que un deslizamiento no revuelva la barra, que un toque corto
siga cambiando de grupo y que moverlo NO cambie de grupo.

## Lo que NO se toca

Estas cosas trabajan con los **dígitos pelados** del grado y de la sección.
Meterles adornos invalida claves que ya están impresas y repartidas:

- `paCodigoAlumno` (`js/tools/plan-accion.js`) y `adClaveFamilia`
  (`js/tools/registros-admin.js`): arman la **clave de familia**;
- las llaves de `localStorage` (`METAS_CODIGOS_V1`, `'G:<id>'`);
- los códigos de votación del Gobierno Escolar y Campeonísimo;
- los nombres de archivo de descargas (sin acentos ni `º`).

Antes de tocar algo de aquí: si el cambio hace que una tira ya entregada
deje de funcionar, no se hace.

## Cómo se le habla a cada quien

- **Al maestro, de tú**: «Entra con tu cuenta», «tus alumnos».
- **A la familia, de usted**: «Sepa cómo va su hijo o hija», «pregúntele».
- Se habla de **lo que la persona gana**, no de lo que hace el programa.
  «Sepa hoy cómo va su hijo» sirve; «consultar el módulo de notas», no.
- Nada de tecnicismos: el usuario es un maestro con 43 alumnos y un
  teléfono, muchas veces sin señal y a veces sin luz.

## Normativa: un informe, una hoja carta — en cualquier computadora

Los informes de 📈 Estadísticas se imprimen **en lote**: el maestro manda
los 42 de su grado y se va a hacer otra cosa. Si una hoja se parte, la
firma queda huérfana en la página siguiente y el estropicio se descubre
con **52 hojas ya impresas** y la tinta gastada. Pasó de verdad, en
agosto de 2026, y de ahí sale esta regla.

**42 alumnos tienen que dar 42 páginas.** Ni una más.

Lo que lo sostiene, en `estInformeCss()` y en `estImprimirInforme()`:

- **Altura con colchón.** En carta con los márgenes de 10 mm del `@page`
  caben 259,4 mm (980 px). El `min-height` de la hoja es de **248 mm**
  (937 px) y el contenido más largo medido llega a 933. El colchón no es
  de adorno: si el navegador ignora el `@page` y pone los suyos (Firefox
  usa 12,7 mm y deja 960 px), la hoja **sigue cabiendo**.
- **Las observaciones se cortan por ALTO, no por cantidad.** Cinco
  viñetas cortas caben; tres largas, no. `estObsQueCaben` estima
  renglones a 124 caracteres cada uno —medido, no a ojo— y corta al
  llegar al presupuesto. Vienen ordenadas de más grave a menos, así que
  lo que se cae por el borde es lo menos urgente.
- **La observación del maestro tiene tope** (`EST_OBS_MAX`, 500) y se
  imprime como párrafo corrido: ocho renglones sueltos ocupan el triple
  que el mismo texto seguido.
- **Nada se parte por dentro**: `break-inside: avoid` en la hoja y en el
  pie de firmas.

Lo mismo vale para las **fichas del Control de lectura**, y ahí la
tensión es más fina: el maestro pide letra grande —la ficha la lee un
niño— y los textos crecen con el grado (58 palabras en 2º, hasta 200 en
9º) sobre la misma hoja. Los tamaños de `LEC_FICHA_FZ` y
`LEC_FICHA_PORLINEA` son **los más grandes que caben, medidos**, y hay
una segunda condición que no se ve venir: **ningún renglón del texto
puede partirse en dos**, porque el número del final es el conteo
acumulado y descolgado no sirve para nada.

**Antes de publicar un cambio en cualquiera de los informes o fichas:**

```
node _dev/servidor-estatico.js      (en otra terminal)
node _dev/verifica-una-hoja.js         → informes del alumno y del grado
node _dev/verifica-fichas-lectura.js   → las 400 fichas de lectura
node _dev/verifica-boletos.js          → los boletos de la Convocatoria (siete tiras por hoja)
```

Mide con media `print`, el ancho útil de una carta y **el número de
páginas del PDF**, que es la verdad de la impresora. Medir una hoja
suelta en la pantalla ancha **miente**: las columnas se estiran y el
texto ocupa menos alto del que ocupará en el papel. Y hay que medir el
**lote entero**, no un alumno: el largo cambia de uno a otro según sus
observaciones, su práctica y sus tomas de lectura.

Si hace falta sitio para algo nuevo, se recorta **espacio en blanco o lo
que calcula la máquina**, nunca el tamaño de letra del cuerpo: el
informe se lee en una reunión con la familia, muchas veces con poca luz.

## Normativa: una misión no está terminada sin su ficha, y la ficha sin su QR

La misión vive en la pantalla; el aula tiene 43 alumnos y tres teléfonos.
Publicar una misión sin su **ficha didáctica imprimible** es publicarla
para tres. Por eso una misión nueva no se da por terminada hasta que
tiene sus tres piezas:

| pieza | dónde |
|---|---|
| la ficha | `fichas/ficha-<slug>.html` |
| su QR | `img/qr-mision-<slug>.png` |
| el enlace en los dos sentidos | la ficha en `fichas/index.html` **con el conteo del encabezado**, y el bloque 📄 en la sección Recursos de la misión |

El `<slug>` es la carpeta de la misión sin el prefijo del ciclo:
`misiones/2ciclo-volumen-cuerpos/` → `ficha-volumen-cuerpos.html` y
`qr-mision-volumen-cuerpos.png`.

**El QR no se escribe a mano y no se copia de otra ficha.** Se genera del
catálogo y se vuelve a leer para comprobar a dónde lleva:

```
pip install --user segno opencv-python-headless   (no van en el repositorio)
python3 _dev/genera-qr-mision.py 62 63 64 65 66   # o sin ids: los que falten
python3 _dev/genera-qr-mision.py --revisa         # solo comprobar
```

Sale de `MISSIONS`, así que la dirección no se teclea; y se decodifica
antes de dar el trabajo por bueno, porque un QR equivocado no lo descubre
nadie hasta que ya se repartieron cuarenta fotocopias. Va con corrección
de errores **alta**: la ficha se doblará y se fotocopiará. Y el PNG se
escribe de 1 bit a 300×300 —pesa 1 KB en vez de 10— porque quien lo abre
lo baja con los datos de su teléfono.

### El QR se comprueba MIRÁNDOLO, y el lector de la sonda miente

El 11 de septiembre de 2026 se pasó la revisión por los 68 QR del proyecto y
salieron **cuatro averías distintas**, todas invisibles hasta entonces:

| lo que se encontró | cuántos |
|---|---|
| fichas que piden un QR que **no existe** (hueco roto en el papel) | **14** |
| QR **ilegibles** publicados | **3** |
| QR con un **marco negro** que se comía la zona de silencio | **23** |
| misiones acusadas de tener el QR de otra, **sin tenerlo** | **1** |

Y ninguna se veía, porque **la revisión vieja deducía el nombre del archivo**
de la carpeta de la misión. Eso falla en los dos sentidos: `2y3ciclo-adjetivos`
y `bach-uni-adjetivos` dan **el mismo nombre**, así que acusaba a un archivo
perfectamente correcto; y tres fichas llevan años con un QR cuyo nombre no se
parece al de su carpeta, así que **ni los abría**.

**Ahora el hilo va al revés y no adivina:** misión → **su ficha** → el `<img>`
del QR. Las 68 misiones enlazan a su ficha desde Recursos, así que el hilo no
se rompe, y de paso el archivo se escribe donde la ficha lo está pidiendo —no
en un nombre por convenio que luego no mira nadie—.

⚠️ **Y el decodificador de OpenCV NO basta para dar un QR por bueno.** Con la
corrección de errores **alta** que pide esta misma normativa —la ficha se dobla
y se fotocopia—, las direcciones de este sitio dan códigos de **versión 9**, y
ese lector falla en unos cuantos por muy bien escritos que estén. Los QR viejos
que sí leía estaban hechos con **menos corrección**, que es justo lo que no se
quiere. Bajar la corrección para que la sonda pasara habría sido **cambiar el
producto para aprobar el examen**.

Se comprueba por dos caminos y hacen falta los dos: se **lee** con OpenCV —que
es lo más parecido a lo que hará el teléfono de la familia—, y cuando no puede,
se compara el dibujo **módulo a módulo** contra el QR que le toca a esa
dirección. Lo segundo demuestra más que lo primero: que el archivo es
exactamente ese código.

⚠️ **El margen del PNG va en BLANCO.** Iba en negro, y eso dejaba una raya de
lado a lado en las dos columnas de los extremos: se comía la **zona de
silencio**, el blanco que un lector necesita alrededor para encontrar el
código. Con esa raya, cuatro QR no se dejaban leer y el resto quedaba al filo
—y el papel se fotocopia y se dobla, así que la tolerancia que sobra es la que
salva el QR arrugado—. La zona de silencio es ahora de **4 módulos**, la de la
norma; iba en 2.

⚠️ **Y la dirección se escapa.** Hay una misión cuyo archivo lleva espacios y
una tilde (`angulos-bisectriz_II y III-Ciclo_Básica.html`): dentro del QR eso
va con sus `%20` y su `%C3%A1`. Su QR ya estaba bien escrito; era la
herramienta la que lo comparaba contra la ruta cruda y lo daba por ajeno.

**Lo que esto NO alcanza:** los QR **no van precacheados** en el armazón, así
que entran en `CACHE_DATOS` la primera vez que alguien abre esa ficha en línea,
y esa caché no se sella nunca —a propósito—. El maestro que ya tenía una ficha
guardada en el teléfono **se queda con el QR viejo**. A quien la abra desde hoy
le llega el bueno. No se sube `CACHE_DATOS` por esto: borrarle al alumno las
misiones que guardó cuesta más que un QR viejo en un teléfono.

**Antes de publicar una ficha, se cuentan sus hojas:**

```
node _dev/verifica-ficha-paginas.js ficha-<slug>     (o sin nombre: todas)
```

Cada página declarada tiene que ser **una** hoja impresa. Una que se
parte en dos son 43 hojas de más en el fotocopiado del grado. La sonda
imprime a PDF de verdad y cuenta las páginas del PDF, que es la verdad de
la impresora; medir en la pantalla ancha **miente**, porque las columnas
se estiran y el texto ocupa menos alto del que ocupará en el papel.

Y mira **las dos ediciones**. Cinco fichas de Robótica traen traducción
de autor y el motor de idioma cambia el HTML de cada hoja entera
(`data-i18n="p1".."p7"`): el inglés puede partirse justo donde el español
cabe. Así estuvo `ficha-robots-problemas`, con su hoja 3 saliendo en dos,
sin que nadie lo notara — porque la sonda solo miraba el español.

### El corte de las hojas NO se decide a ojo

Las fichas se armaron a mano: alguien miró la pantalla y decidió dónde
cortaba cada hoja. A ojo se acierta hasta que se corrige una errata y el
párrafo crece dos renglones; entonces la hoja se pasa del papel, se parte
en dos y el pie que dice «Página 3» sale en la cuarta. **Así estaban 19
fichas** en agosto de 2026 —la peor medía 350 mm donde el papel deja
257,4— y nadie lo supo hasta contar las páginas del PDF.

El corte lo reparte una herramienta:

```
node _dev/reparte-hojas-ficha.js                (las que hoy se parten)
node _dev/reparte-hojas-ficha.js ficha-<slug>   (una)
node _dev/reparte-hojas-ficha.js --revisa       (sin escribir)
```

**No recorta contenido ni toca el tamaño de letra**: mueve dónde cae el
corte, y nada más. Lo comprueba la sonda de páginas, y de paso el texto
tiene que salir palabra por palabra igual que antes.

Lo que la sostiene, y que no se puede improvisar:

- **El tope es 248 mm por hoja**, no los 257,4 que deja el papel. El
  colchón no es de adorno: si el navegador ignora el `@page` y pone los
  suyos (Firefox usa 12,7 mm y deja 254 mm), la hoja **sigue cabiendo**.
  Es la misma cifra y la misma razón que en el informe del alumno.
- **Se mide la HOJA entera y con el ancho del papel**, no el hueco del
  contenido en una ventana ancha: el pie va dentro del relleno de abajo y
  el margen del último bloque también cuenta. Medir solo el contenido
  dejaba diez milímetros fuera de la cuenta.
- **Se mide el tramo pintado, no la suma de los bloques**: entre dos
  bloques seguidos los márgenes se colapsan, y sumar cierra la hoja antes
  de tiempo.
- **Primero el mínimo de hojas, después el reparto**: con las hojas ya
  fijas se busca el corte que deja la hoja más cargada lo más liviana
  posible, para que el aire sobrante se reparta.
- **Un título nunca cierra una hoja**: baja con lo que encabeza.
- **La hoja del docente no se toca**: se imprime suelta y no se
  fotocopia, así que ni recibe ni cede.
- **Manda el mínimo de hojas, no las que la ficha traía.** Si ahora caben
  en menos, se imprimen en menos: cada hoja de más son 43 hojas de más en
  el fotocopiado del grado.
- **La ficha que hoy cabe y ya está en su mínimo se deja en paz.** Rehacer
  un corte que funciona mueve texto sin ganar nada. Para volver a mirar
  también esas —después de tocar el CSS, por ejemplo— está `--todas`.

### El aire del CSS ya está apretado: no se aprieta más, y la letra no se toca

En agosto de 2026, con las 19 fichas repartidas, ocho seguían gastando una
hoja de más. La segunda pasada fue **quitarle aire al CSS común**: márgenes
de los títulos, relleno de las cajas y de las celdas, hueco entre párrafos
—**nunca el tamaño de letra del cuerpo**, que la ficha se lee en un pupitre
y a veces con mala luz—. Con eso, siete de las ocho bajaron a siete hojas, y
al volver a mirar las que ya cabían salieron siete más que también encogían.

Los valores de esa pasada (`h2` 8px/6px, `p` 5px, `td` 2px, `.caja` 7px/6px,
`.ilus` 8px/7px, `.pagina` 22px de pie…) son **los más apretados que siguen
leyéndose bien, medidos**. No son un punto de partida para seguir
recortando: si mañana hace falta sitio, se recorta contenido o se acepta la
hoja, no se baja el cuerpo de la letra ni se aprieta más el renglón.

La que más costó fue `ficha-programando-robot`, y no por el español —que
cabía— sino porque **su inglés pedía tres milímetros más**: los dos idiomas
comparten los contenedores, así que van al mismo número de hojas y manda el
que más pide. Esos tres milímetros NO se sacaron apretando más el CSS común:
salieron de un error suyo. La fila de rótulos de la cuadrícula de trazado
(A…E, 1…5) heredaba `height: 34px` de las casillas, así que un renglón de
letras ocupaba lo que una casilla para escribir; liberarla y bajar la casilla
de 34 a 32 px —siguen siendo 8,5 mm para marcar una X— dejó la ficha en siete
hojas.

La lección es esa: **cuando falte un milímetro, se busca el aire mal puesto
de esa ficha, no un recorte más para las 74**.

Al tocar el CSS hay que **rearmar las fichas de Fin de Grado**, que salen de
`_dev/fin-de-grado/cabeza.html` y no se editan a mano:

```
node _dev/arma-ficha-fin-de-grado.js 4to   (y 5to, 6to, 7mo)
```

Ahí la dieta se nota de verdad: 4º pasó de 32 hojas a 29 y 7º de 34 a 32.

⚠️ **Si la ficha es bilingüe, las dos ediciones se reparten a la vez.**
No tienen que cortar por el mismo sitio —cada contenedor recibe el HTML
que le dé el diccionario—, pero sí tener el **mismo número de hojas**, y
el `-en.js` se vuelve a escribir bloque a bloque. Ahí hay dos cosas que
costaron caro: el archivo rehecho **tiene que compilar** (uno con un error
de sintaxis no da la cara —el botón 🌐 se queda mudo y la bilingüe imprime
en español—, así que la herramienta lo compila antes de guardarlo), y los
rótulos `/* PÁGINA N */` **viajan con su contenido**, porque alguno lleva
dentro una nota que hace falta («la Columna B conserva el orden del
español: la pauta vale igual»).

Y si la ficha gana o pierde una hoja, **la misión y el índice lo dicen**: el
«Guía de estudio de N páginas» de la sección Recursos y el «· N páginas» de
la tarjeta en `fichas/index.html` se corrigen solos, que si no el maestro
manda a fotocopiar la cuenta vieja.

Y en la ficha manda la normativa del papel de más arriba: la selección
múltiple lleva su círculo para **rellenar**, nunca la ✗.

## Normativa: el Control de lectura dentro de una misión

Hay **dos** controles de lectura y no hacen lo mismo. Confundirlos
estropea el dato del alumno, así que la diferencia se respeta:

- **📖 Lectura de Mi aula** (`js/tools/lectura-fluidez.js`) la maneja el
  **maestro**: escucha al niño, cuenta los errores y marca las
  respuestas. Mide velocidad, **precisión** y comprensión.
- **📖 Lectura dentro de la misión** (`js/tools/lectura-mision.js`) la
  hace el **alumno solo**, un minuto, con las preguntas en pantalla.
  Mide velocidad y comprensión, **y nada más**. La precisión NO se
  estima: un niño no puede leer en voz alta y contarse los tropiezos a
  la vez, y un dato inventado es peor que ningún dato. La pantalla se lo
  dice, para que no crea que le falta algo.

La **banda de palabras por minuto es una sola** y vive en
`js/data/lectura-normas.js`. Las dos herramientas se la preguntan; nadie
escribe una cifra de velocidad en otro sitio.

**Dónde está:** en la misión de los adjetivos
(`misiones/2y3ciclo-adjetivos/`) y en la de los números grandes
(`misiones/1ciclo-segundo-grado/`), con cinco lecturas por grado de 4º
a 9º en cada una.

**El motor no sabe de qué tema son los textos ni qué actividades toca
hacer con ellos.** Ofrece cinco FORMAS y cada misión declara su taller:

| forma | qué hace | en adjetivos | en números |
|---|---|---|---|
| `comprension` | las cinco preguntas, una a la vez | ❓ ¿Qué entendiste? | ❓ ¿Qué entendiste? |
| `cazar` | tocar sobre el texto lo que cumple algo | 🎯 los adjetivos | 🎯 los números mayores que mil |
| `dosGrupos` | clasificar en una de dos clases | 🗂️ ¿califica o determina? | — |
| `tresOpciones` | elegir entre tres | ✏️ ¿cómo lo decía el texto? | 🔢 lee el número |
| `ordenar` | tocar fichas en el orden correcto | — | 📊 de menor a mayor |

Para estrenar la sección en otra misión: se escribe su corpus y su
taller en un archivo (`lectura-<tema>.js`), se añaden cinco líneas al
HTML y se llama a `LecturaMision.montar(...)`. **Si hace falta una
forma nueva, se añade al motor y la heredan todas** — no se copia el
motor.

### La lectura no es la meta: es la materia prima

Un minuto de cronómetro deja un número —las palabras por minuto— y poco
más. Lo que aprovecha el texto es lo que viene después: **cuatro
actividades sobre esa misma lectura**, que el motor arma solo.

1. **❓ ¿Qué entendiste?** — las cinco preguntas, **una a la vez y en
   letra grande**. Iban las cinco juntas y en letra chica: en un
   teléfono eso es un muro de texto y el niño contesta por contestar.
2. **🎯 Caza de adjetivos** — los toca sobre el texto que acaba de leer
   en voz alta. Aquí está la razón de que la lectura viva dentro de la
   misión y no en Mi aula.
3. **🗂️ ¿Califica o determina?** — clasifica los que cazó, cada uno
   dentro de su oración. Encontrar no es lo mismo que saber qué clase
   de adjetivo es.
4. **✏️ ¿Cómo lo decía el texto?** — vuelve de memoria a buscar el
   adjetivo exacto, entre tres que salen de esa misma lectura.

**Mientras se lee, la pantalla no pide nada.** Se llegó aquí quitando
dos cosas, las dos porque el maestro las probó en el aula y distraían de
leer, que es justo lo que se está midiendo:

- un **selector de modo de marcado** («marco yo» / «se marca sola»)
  puesto antes de arrancar: el niño se ponía a probar los dos modos y
  llegaba al minuto sin haber leído nada;
- el **marcado con el dedo mientras leía**, con el texto pintándose
  detrás: acababa pendiente de que el dedo no se le adelantara.

Queda la toma clásica, la misma que el maestro hace en papel: se lee en
voz alta y ya. Al sonar el minuto —y solo entonces— el texto se vuelve
tocable y se marca de **un solo toque** la última palabra leída; hasta
que no marque no aparece el botón de seguir, porque sin esa marca no hay
palabras por minuto que calcular. `_dev/verifica-lectura-mision.js`
comprueba las dos mitades: que durante el minuto tocar el texto no haga
nada, y que después sí.

Las actividades de una lectura **no cambian entre intentos** (se barajan
con una semilla sacada de su id). La misión le pide al alumno que relea
el mismo texto dos o tres días —es lo que más sube la fluidez— y con
actividades distintas cada vez no podría notar que va mejorando.

### La misma lectura, en papel

En un aula de 43 hay tres o cuatro teléfonos. Por eso la lectura y sus
actividades se imprimen, y salen en **tres hojas exactas**: la lectura
con su conteo acumulado por renglón y la actividad que se hace sobre ese
mismo texto; las demás actividades; y la clave del maestro, que **no se
fotocopia**. Cada hoja de más son 43 hojas de más.

El motor no sabe de qué tema son los textos, así que tampoco sabe decir
en papel «subraya los adjetivos»: cada actividad de cazar trae su
`enPapel`. Sin ella se usa la instrucción de pantalla, que dirá
«tócalos» — se entiende, pero está peor.

Los tamaños de `LM_FZ` y `LM_PORLINEA` son **los más grandes que caben,
medidos**, y van siempre en pareja: si el renglón se parte en dos, el
número del final —que es el conteo acumulado— queda descolgado y la hoja
deja de servir para tomar la lectura. Se comprueba con
`_dev/verifica-impresion-lectura.js`, que cuenta las páginas del PDF.

### El mando del minuto va abajo

El cronómetro, la instrucción y los botones van **debajo del texto**, no
encima. Al cumplirse el minuto el alumno acaba de leer la última línea y
tiene los ojos en el final del texto; con la orden de marcar arriba del
todo se quedaba parado creyendo que la pantalla se había trabado. Se
queda pegado abajo (`sticky`) para que no se pierda de vista en los
textos largos, y por eso mismo el texto lleva un hueco al final del alto
del panel: si no, el último renglón queda tapado y no se puede ni leer ni
tocar al marcar.

En las actividades hay **atrás**, y volver deja **mirar, no rehacer**: lo
contestado sigue contestado y con su corrección puesta. El puntaje lo
pone el alumno, no el botón.

### En el proyector: el texto ENTERO, y la letra la mide la máquina

En el aula hay un proyector y tres teléfonos. El maestro proyecta la
lectura en la pared y sus 43 alumnos la copian en el cuaderno; sin
fotocopiadora es la única forma de que un texto le llegue a todos el
mismo día. Y ahí la pantalla ya no es un teléfono en la mano: **el que
copia desde su pupitre no hace scroll**, así que lo que se queda fuera
de la pared, para él no existe.

De ahí salen tres reglas:

1. **El tamaño de la letra no se escribe: se busca.** Se prueban de
   mayor a menor (`LM_TAMS`) y se queda con el más grande con el que el
   texto cabe entero por encima del mando. Escribir una cifra no sirve:
   la lectura de 2º tiene 58 palabras y la de 9º doscientas, y lo que
   llena la pared con una deja a medias la otra. Lo que se guarda del
   maestro es el **retoque** de A− y A+, no el tamaño: así se lo dice
   una vez y no en cada una de las cinco lecturas del grado.
2. **El interlineado va pegado al tamaño** (`altoDe`). Un renglón grande
   necesita menos aire para no perderse, y en la pared ese aire de más
   son renglones enteros que se caen de la pantalla.
3. **📽️ pone la lectura a pantalla completa**, y ahí hay dos cosas que
   parecen detalles y no lo son: el z-index no basta —la misión mete su
   contenido en un `.main` con contexto de apilamiento propio, así que se
   les quita el z-index a los padres mientras dure—, y el modo
   `body.letra-grande` que traen varias misiones infla **todos** los
   `<span>` un 25 % con `!important`: cada palabra del texto es un
   `<span>`, y con dos sitios mandando sobre el tamaño no acierta
   ninguno. Manda el ajuste (`.lm-manda`), que arranca midiendo lo que
   la misión pintaba antes para que nadie lea más pequeño que ayer.

**Mientras corre el minuto, A−, A+ y 📽️ desaparecen.** Es la misma regla
de siempre: ya se quitó de esta pantalla un selector de modos porque el
niño se ponía a probarlo y llegaba al minuto sin haber leído una línea.
El maestro deja la letra puesta antes de arrancar, que es como se
proyecta de verdad.

**El cronómetro grande NO existe: el minuto se mide con un reloj de arena
pequeño.** Eran un número de dos dedos de alto y una barra de lado a
lado, y entre los dos se llevaban un cuarto de la pantalla; al cumplirse
el minuto lo que quedaba era un «0» rojo enorme y una barra vacía, que no
le dicen nada a nadie y siguen tapando. Ahora el minuto se cuenta con un
`⏳ 42` chiquito, **en las dos pantallas**. Vive DENTRO de la franja
cuando la hay —en el teléfono la franja no está pegada al pie de la
pantalla, así que un reloj clavado abajo se caería encima de las
pestañas— y **se muda a la esquina cuando se proyecta**, porque entonces
la franja se esconde y se lo llevaría con ella.

**Y proyectando, al arrancar se va la franja ENTERA.** El que copia desde
su pupitre acababa mirando la cuenta atrás en vez del texto. Queda el
reloj de la esquina con el «terminé» al lado —ese botón vivía en la
franja, y sin él quien acabe antes de los 60 s no tendría cómo decirlo—.
La franja **vuelve al cumplirse el minuto**, que es cuando hay que marcar
hasta dónde llegó y seguir; para entonces ya nadie está leyendo. Vuelve
también si se sale de la pantalla completa a media lectura: fuera del
proyector la franja es lo único que hay, y sin ella el alumno se queda
mirando un texto quieto.

**Las preguntas y las actividades crecen con el texto** (`--lm-esc`, la
proporción entre lo ajustado y lo que la misión pintaba). Con el texto
enorme en la pared, las opciones salían de 17 px y desde el fondo del
aula no se leían. Se multiplican todas por lo mismo, así que en el
teléfono —donde la escala es 1— nada cambia. Proyectando, A− y A+
aparecen también **en la esquina de las actividades**: el maestro no
tiene por qué volverse a la lectura para agrandar una pregunta.

Dos cosas NO escalan, y las dos por el mismo motivo: **la franja** y **el
título de la tarjeta**. El ajuste mide el sitio que dejan; si crecieran
con la letra se morderían la cola —franja más alta, menos sitio, letra
más chica— y A+ se quedaba sin efecto, compensado por su propio
crecimiento. Por si acaso, el ajuste vuelve a medir el hueco **con cada
tamaño que prueba**, no una sola vez al principio.

Lo comprueba `_dev/verifica-lectura-mision.js` en una pantalla de aula
(1280×720): que el texto se vea entero, que el mando no pase de 130 px
de alto, que 📽️ agrande la letra sin perder el final del texto, que al
arrancar no quede nada que toquetear ni más cronómetro que el reloj de
la esquina, que la franja vuelva sola al acabar el minuto y al salir de
la pantalla completa, y que la pregunta y sus opciones salgan de un
tamaño que se lea desde el fondo del aula.

### Reglas del corpus de una misión (`lectura-<tema>.js`)

- **Cinco lecturas por grado**, con el largo dentro de la banda de
  palabras del grado —la misma del corpus de Mi aula—, porque el texto
  tiene que poder leerse en cerca de un minuto al ritmo de ese grado.
- **Cinco preguntas** con la mezcla de tipos del grado y **tres opciones
  cada una**: aquí las contesta el alumno en la pantalla.
- **Lo que la actividad va a marcar tiene que estar completo.** En los
  adjetivos se escribe a mano (`adjs`, `dets`) porque no hay forma de
  deducirlo: un participio es adjetivo o verbo según la oración. En los
  números NO se escribe: lo saca `js/data/lectura-numerales.js` del
  propio texto, porque «cuarenta y dos mil» vale lo que vale siempre y
  una lista a mano solo añadiría erratas. La regla es la misma en los
  dos casos, y es esta:
- **`adjs` y `dets` son el INVENTARIO COMPLETO, no una muestra.** Es la
  regla que más cuesta y la que no se puede saltar: con ellas el alumno
  caza adjetivos tocándolos, así que un adjetivo que falte es la
  pantalla diciéndole que se equivocó **cuando acertó**, y de paso el
  resultado le presume «17 adjetivos» donde había 27. Tienen que
  aparecer **tal cual** en el texto —se compara palabra contra palabra,
  no con `indexOf`.
- **`neutros`** es la zona gris de ESA lectura: la palabra que ahí hace
  de pronombre y no de adjetivo («todos íbamos sucios»), el participio
  que ahí es verbo («fueron atrapadas»). Tocarlas no suma ni resta y la
  pantalla lo explica. Los artículos y los identificativos discutidos
  (mismo, propio) no van por lectura: viven en
  `js/data/lectura-clases.js`, que es también de donde las herramientas
  sacan la clase cerrada de los determinativos.

**Antes de publicar un cambio del corpus o del motor:**

```
node _dev/prueba-numerales.js            → ¿lee bien los números? (cincuenta casos)
node _dev/prueba-acentos.js              → ¿separa sílabas y clasifica el acento?
node _dev/audita-adjetivos-lectura.js    → ¿falta algún adjetivo en el inventario?
node _dev/valida-lectura-mision.js       → largo, mezcla, opciones, inventario, números
node _dev/verifica-nombres-propios.js    → mayúsculas de lugares y personas
node _dev/servidor-estatico.js      (en otra terminal)
node _dev/verifica-lectura-mision.js     → el minuto y el taller de los adjetivos
node _dev/verifica-lectura-numeros.js    → el taller de los números
node _dev/verifica-impresion-lectura.js  → las tres hojas de papel
```

El **lector de numerales** tiene prueba propia porque es el que le dice
al alumno cuánto vale «trescientos cuarenta y cinco mil»: si se
equivoca, no falla una pantalla, le enseña un número mal. La prueba
incluye una ida y vuelta sobre miles de valores —escribirlos en
palabras y volverlos a leer— que es la que de verdad lo sostiene.

El **auditor** existe porque los determinativos son clase cerrada y los
calificativos no: de los primeros afirma («este está en el texto y no lo
clasificaste»), de los segundos solo propone candidatos por terminación
para que un humano mire la oración. «cortado» es adjetivo en «el zacate
recién cortado» y verbo en «ha cortado»; eso no lo decide una lista.

Lo que de verdad vigila el último: **que el minuto dure un minuto y que
al cumplirse todo se detenga**. Un cronómetro que sigue corriendo detrás
de una pantalla congelada le regala palabras por minuto que el niño no
leyó, y ese número acaba en su expediente y en el informe que firma su
madre. El tiempo no se espera de verdad: se adelanta el reloj del
navegador (`page.clock`), porque una comprobación que cuesta un minuto
por caso no la corre nadie antes de publicar.

## Normativa: las Pruebas de Fin de Grado son una SERIE

La Secretaría aplica una prueba al terminar cada grado y evalúa **dos
materias en el mismo día**: Matemáticas y Español. La misión que repasa
esa prueba no es una misión más, y por eso no vive en Matemáticas ni en
Español: estrena su propia materia, **Repaso General** (`repaso`, morado
`#7c3aed`), y su propia ruta, la **Ruta de la Meta** (`meta`, 🎯). Un
maestro que busca «el repaso de fin de año» no lo busca dentro de una
materia; lo busca aparte, y ahí está.

La primera es **6º** (`misiones/fin-de-grado-6to/`, id 58, etapa 1 de la
ruta). Está escrita para que las demás se calquen: **4º, 5º, 7º, 8º y 9º
salen de ella**, cambiando el contenido y no el motor. Lo que sigue es lo
que hay que tocar y lo que NO hay que tocar para estrenar un grado.

### Estrenar un grado: dónde se toca

Los archivos del grado nuevo, con el mismo patrón de nombre (`5to`,
`7mo`… la carpeta manda y el resto la sigue):

- `misiones/fin-de-grado-<grado>/fin-de-grado-<grado>.html` + su `css/` y
  su `js/` (se copia la de 6º y se cambia el contenido);
- `fichas/ficha-fin-de-grado-<grado>.html` (se ARMA, ver más abajo);
- `_dev/fin-de-grado/<grado>/contenido.json` (el contenido de la ficha);
- `img/qr-mision-fin-de-grado-<grado>.png` (el QR de la portada de la
  ficha: sin él, el papel no lleva a la misión);
- `_dev/test-determinismo-fin-de-grado-<grado>.js`.

Y el catálogo, que es donde se olvida algo y la misión no aparece:

| archivo | qué se añade |
|---|---|
| `js/data/misiones.js` | la misión, con `subject:'repaso'`, `color:'rep'`, `ruta:'meta'` y la **etapa siguiente** |
| `js/data/diagnosticos.js` | sus preguntas dentro de la ruta `meta` |
| `fichas/index.html` | la ficha en la sección `m-rep`, y **el conteo del encabezado** |
| `_dev/verifica-fin-de-grado.js` | el total de misiones y **cuántas cuenta el chip Repaso General** |

La materia y la ruta ya están puestas (`js/app.js`, `css/app.css`,
`index.html`, `js/tools/campeonismo.js`): un grado nuevo **no las vuelve a
tocar**.

⚠️ **El `SAVE_KEY` lleva el grado dentro** (`repaso_fin_grado_6to_v1`). Si
dos grados comparten la llave, el alumno que juega la de 5º le borra el
avance al de 6º en el mismo teléfono, que en un aula con tres teléfonos
prestados pasa el primer día.

### Veinte formas, y cada una siembra su azar

Esta misión trae **20 formas** y no 30 como las demás: cada forma abarca
el temario del año entero, así que son veinte exámenes largos y no
veinte variaciones de un tema. `EVAL_FORMAS = 20`.

Son **tres pruebas** y cada una tiene su semilla, para que dos pruebas de
la misma forma no salgan con el mismo azar:

| prueba | semilla | qué viaja al registro |
|---|---|---|
| conceptual de Matemáticas | `_evalRng(0 + forma)` | `forma` |
| conceptual de Español | `_evalRng(500000 + forma)` | `100 + forma` |
| operativa | `_evalRng(100000 + forma)` | `forma` |

Lo de `100 + forma` en Español no es capricho: el registro guarda un solo
número de forma, y sin separarlas la Forma 3 de Español y la Forma 3 de
Matemáticas se confunden en la Evidencia del maestro. Y el panel de
resultado se sigue leyendo `Resultado: N/100 pts` **exactamente así**:
`js/metas-registro.js` lo lee con esa forma para anotar la nota.

### Lo contestado no se pierde, y tampoco se le pega a otra prueba

Son cien preguntas de la conceptual más 19 cuentas de la operativa, en un
teléfono prestado. Cambiar de materia regeneraba el examen entero y recargar
lo regeneraba otra vez: el alumno tocaba la otra pestaña y volvía a la nada.
Se guarda **la forma y lo contestado** (`SAVE_KEY + '_resp'` y `'_resp_op'`),
nunca el HTML: la prueba es determinista, así que con la misma forma se vuelve
a armar igual y las respuestas se ponen encima. Guardar el HTML habría metido
medio megabyte por materia en el almacén del teléfono.

Dos reglas, y la segunda cuesta más caro que la primera:

1. **Con forma fija el contador NO avanza.** Rearmar su examen para
   devolvérselo no puede gastarle la forma siguiente.
2. ⚠️ **La forma no basta: se guarda una HUELLA del examen armado.** Las
   preguntas salen del banco con `_pickF`, así que el día que entre una
   pregunta nueva —y aquí se publica varias veces al día— la Forma 5 ya no
   arma las mismas veinte. Devolverle entonces lo contestado le pegaría sus
   respuestas encima de OTRAS preguntas, y esa nota sale como
   `Resultado: N/100 pts` **al expediente del alumno**. Si la huella no
   coincide no se devuelve nada, se le dice por qué y lo guardado se tira.
   Si el resumen fallara devuelve `''`, que no coincide con nada: la duda se
   salda perdiendo las respuestas, nunca calificándolas mal.

⚠️ **Y los dos botones «Nueva …» llaman a `evalNueva()` / `evalOpNueva()`,
que preguntan antes de borrar.** De ese `onclick` cuelga `_injectFormaSel` el
**selector de Forma** —el que usa el maestro para imprimir la misma prueba
para los 43—: al cambiar el botón hay que cambiar el ancla, o el selector
desaparece **sin un solo error en la consola**.

### El impreso de esta misión NO se encoge a una hoja

Es la **excepción pedida**, y está puesta a propósito: la prueba abarca
todas las preguntas del temario y encogerlas para que quepan en una hoja
las deja ilegibles. Aquí NO va el buscador de zoom que traen las demás
misiones. Lo que sí se respeta, y lo comprueba la sonda:

- **cada prueba sale con el color de su materia**: azul `#1565c0` la de
  Matemáticas, dorado `#c49000` la de Español. El maestro reconoce el
  examen por el color sin leerlo, que es como se reparten 43 hojas;
- **la pauta arranca en hoja aparte** (`page-break-before:always`): se
  imprime suelta y no se fotocopia;
- **se rellena el círculo, nunca la ✗** (la normativa general de arriba);
- la clave **ZipGrade** va en la pauta.

### Las fracciones se escriben como en el cuaderno

`js/metas-fracciones.js` convierte «3/4» en la fracción apilada, con la
raya en medio. Se aplica **al pintar**, no en los bancos de datos: los
bancos siguen en texto plano, que es lo que se puede buscar y corregir.
Adoptarlo en otra misión es una línea de `<script>`.

Dos avisos que costaron caro:

1. **Lo que mueve elementos por su texto tiene que guardar el original.**
   El clasificar leía `textContent` para llevar la ficha del banco a su
   columna, y con la fracción apilada «3/4» se lee «34». El texto de
   verdad va en `dataset.txt`.
2. **La fracción apilada engorda el renglón.** Al ponerla, el examen de
   Matemáticas se pasaba de hoja: 43 hojas de más por grado, descubiertas
   con la fotocopiadora andando. Se arregló **quitando aire, nunca tamaño
   de letra** (el examen se lee en un pupitre), y la sonda mide **las 20
   formas** de las dos pruebas impresas, no una.

### La ficha se ARMA, no se escribe a mano

La ficha de Fin de Grado no repasa un tema: repasa el año y las dos
materias, y pasa de **treinta hojas**. Cortar treinta hojas a ojo deja
hojas a medio llenar, y cada hoja de más son 43 hojas de más en el
fotocopiado del grado. Por eso el corte lo hace una herramienta:

```
node _dev/arma-ficha-fin-de-grado.js 6to
```

Lee `_dev/fin-de-grado/<grado>/contenido.json` y la cabecera compartida
`_dev/fin-de-grado/cabeza.html`, y escribe la ficha. Para un grado nuevo
se escribe **su `contenido.json`** (el `meta` de la portada más los
bloques de teoría, actividades, simulacro y errores) y se corre la
herramienta; lo que se publica es el HTML resultante, plano y editable a
mano como las demás fichas.

Cómo reparte las hojas, que es lo que no se puede improvisar:

- **se mide en el navegador CON EL ANCHO DEL PAPEL**, no en pantalla
  ancha: en pantalla ancha las columnas se estiran y el texto ocupa menos
  alto del que ocupará en el papel;
- **se mide el tramo pintado, no la suma de los bloques**: entre dos
  bloques seguidos los márgenes se colapsan, y sumar cierra la hoja antes
  de tiempo (así salieron las hojas 2 y 10 a medio llenar);
- **primero el mínimo de hojas, después el reparto**: con las hojas ya
  fijas se elige el corte que deja la hoja más cargada lo más liviana
  posible, para que el aire sobrante se reparta en vez de amontonarse en
  la última;
- **un título nunca cierra una hoja**: baja con lo que encabeza;
- **los recuadros de escribir se estiran** hasta llenar lo que sobre. Una
  hoja de tarea a medio llenar invita a contestar en dos renglones.

Las hojas llevan **la franja del color de su materia** (azul
Matemáticas, dorado `#b45309` Español) y el marco morado de Repaso
General; el alumno sabe qué está estudiando sin leer el título. La pauta
y la nota del docente van **en hojas sueltas al final**.

### Antes de publicar un cambio de una Prueba de Fin de Grado

```
node _dev/servidor-estatico.js              (en otra terminal)
node _dev/verifica-fin-de-grado.js          → la misión, las dos pruebas, el impreso y el catálogo
node _dev/verifica-fin-de-grado-respuestas.js → que no le borre las respuestas al alumno
node _dev/test-determinismo-fin-de-grado-<grado>.js  → las 20 formas y sus cuentas
node _dev/verifica-ficha-paginas.js ficha-fin-de-grado-<grado>  → una página, una hoja
node _dev/verifica-nombres-propios.js       → mayúsculas de leyes, lugares y personas
node _dev/mide-reparto-respuestas.js        → que la correcta no caiga siempre en la misma letra
```

`verifica-ficha-paginas.js` sirve para **cualquier** ficha del proyecto y
cuenta las páginas del PDF, que es la verdad de la impresora. Al pasarlo
por las fichas viejas salieron **19 que se partían al imprimir** (la peor,
`ficha-programando-robot`, medía 350 mm donde el papel deja 257,4). Ya
están repartidas: cómo se hizo y qué NO se puede improvisar está en «El
corte de las hojas NO se decide a ojo», más arriba.

**Nota de entorno:** estas herramientas necesitan Playwright, que en el
entorno de trabajo se instala aparte (`npm install --no-save playwright`)
y **se borra al terminar**, porque `node_modules` va versionado en este
repositorio y si no queda el árbol sucio.

## Normativa: la prueba operativa pregunta lo que la misión enseña

La evaluación de una misión viene en dos: la **conceptual** —definiciones,
V/F, selección, pareados— y la **operativa**, que es la de HACER. La
segunda se copia de misión en misión y ahí es donde se tuerce: se hereda
la forma del examen de otro tema, se le cambian los números y queda un
examen que mide bien… otra cosa.

Le pasó a **Las Fracciones** (`misiones/2y3ciclo-fracciones/`). La
operativa traía cinco bloques de rellenar huecos —operar, simplificar,
comparar, completar la equivalente y ordenar— y **tres preguntaban casi lo
mismo**: comparar dos fracciones y ordenar cinco son la misma destreza dos
veces, y simplificar y amplificar son la misma cuenta en los dos sentidos.
Mientras tanto, media misión no salía por ninguna parte: el **dibujo de la
parte pintada** —con el que la misión ARRANCA—, la fracción **impropia y
su número mixto**, y los **problemas** del recreo, que son el widget con
el que la misión termina. Se reordenó a seis secciones, una por lo que la
misión enseña y en el orden en que se aprende:

| sección | de dónde sale en la misión | pts |
|---|---|---|
| I. ¿Qué fracción está pintada? | 🍕 ¿Qué es una fracción? · 🔬 la representación | 20 |
| II. Clasifica y convierte | 📊 la tabla de tipos · 🗂️ Clasifica · el Reto | 20 |
| III. Simplifica y completa la equivalente | ✂️ Simplificar · 🧩 Empareja equivalentes | 12 |
| IV. Suma y resta de fracciones | ✏️ Completa la operación | 25 |
| V. Ordena las fracciones | 🔢 Ordena las Fracciones | 8 |
| VI. Problemas de la vida real | 🍕 Situación → Respuesta | 15 |

Cuatro cosas que costaron caro y que valen para cualquier misión que se
reforme igual:

1. **El dibujo va en SVG, nunca en fondos de CSS.** El navegador imprime
   «sin gráficos de fondo» de fábrica, y ahí la parte pintada —que ES la
   pregunta— sale en blanco. El relleno de un SVG se imprime siempre.
2. **La fracción del dibujo se genera IRREDUCIBLE.** Si se pintaran 6 de
   8, «6/8» y «3/4» serían las dos correctas y la pauta solo lleva una: en
   papel el maestro marcaría mal media aula. Reducir ya se pregunta en su
   sección.
3. **Barajar puede devolver el orden que se pide.** Una de cada ciento
   veinte, el grupo de «ordena las fracciones» salía ya ordenado y eran
   cuatro puntos regalados al que no tocó nada —y esa nota llega al
   expediente—. Se baraja hasta que salga otra cosa.
4. **«Escríbela como número mixto» se califica como número mixto.** 7/4
   vale lo mismo que 1 3/4 y no es la respuesta a lo que se preguntó;
   «13/4» pegado son trece cuartos. Se aceptan las formas en que se
   escribe a mano («1 3/4», «1 y 3/4», «1-3/4») y ninguna más.

Y el presupuesto de papel manda: **el examen entero cabe en UNA hoja
carta**. El documento se ajusta solo buscando el zoom más grande con el
que cabe, así que pasarse no se ve como una hoja de más —se ve como un
examen encogido que el alumno lee con lupa en el pupitre—. El piso son
**93 %**, y lo vigila `verifica-fracciones-apiladas.js` en las 30 formas.
Si hace falta sitio, se recorta contenido o se quita aire; **el tamaño de
letra del cuerpo no se toca**.

**Antes de publicar un cambio de la prueba operativa de Fracciones:**

```
node _dev/servidor-estatico.js                       (en otra terminal)
node _dev/verifica-prueba-operativa-fracciones.js    → las seis secciones, los dibujos y la nota
node _dev/verifica-fracciones-apiladas.js            → la fracción apilada y la hoja que no se encoge
```

El primero vigila lo que cuesta caro: que las secciones sumen 100, que
**el dibujo diga la verdad** (las partes pintadas del SVG contra la clave,
en las 30 formas) y que su fracción no se pueda simplificar, que
contestando bien TODO dé 100 y en blanco dé 0 —que es la cuenta que acaba
en el expediente del alumno—, que los problemas se puedan resolver, que la
misma Forma vuelva a salir igual y que la hoja impresa lleve sus cuatro
dibujos con su línea y la pauta en hoja aparte.

## Normativa: la Convocatoria pregunta, no anota

La Convocatoria vive en **📣 Comunicados**, que es donde vive todo lo que
sale hacia las familias. Ahí hay dos cosas que se parecen y no son lo
mismo: un **aviso** INFORMA y se acabó; una **convocatoria** PREGUNTA y
se queda esperando la respuesta. Por eso la puerta lleva franja naranja y
la palabra «pregúntales»; el maestro tiene que ver la diferencia sin
leer.

Estuvo primero en ✅ Controles y se movió: ahí el maestro la buscaba
entre sus listas de fichas y meriendas, y un **control** es lo contrario
de esto —se ANOTA, porque él ya sabe la respuesta—. La puerta está en
**un solo sitio**; si algún día vuelve a salir en los dos, el maestro
acabará con dos convocatorias distintas para la misma salida.

Va **antes del candado de la lista de alumnos**: el enlace se manda al
grupo de toda la escuela y no necesita la lista del aula para nada, así
que un maestro que todavía no ha metido a sus alumnos tiene que poder
usarla igual.

Vive en `js/tools/convocatoria.js` (pantalla del maestro), `salida.html`
(pantalla del padre) y `SUPABASE-CONVOCATORIA.sql` (las dos tablas y sus
RPC, con RLS cerrada).

Nació de un problema con fecha: hay que contratar buses para el sábado y
el número de gente se sabe el viernes, contando mensajes sueltos en un
grupo de WhatsApp. Un bus de más es dinero tirado; uno de menos deja
niños en el portón.

**Cuatro reglas, y ninguna es de adorno:**

1. **El padre NO necesita clave de familia.** El enlace se manda al grupo
   de TODA la escuela, no al del grado: ahí hay padres sin clave que no
   la van a pedir un domingo. Por eso escriben el nombre del alumno y
   tocan su grado. Meterle un candado a esta pantalla la mata.
2. **Se cuenta por PERSONAS, no por alumnos.** En una excursión va el
   niño y va la mamá; el bus no distingue. Un conteo de alumnos deja
   media flota de gente parada.
3. **La respuesta no se pierde.** Si falla el internet al mandarla, la
   pantalla se la manda al maestro por WhatsApp ya escrita —nombre,
   grupo y cuántos van—. Un padre que cree que contestó y no, es un
   asiento pagado de más.
4. **Contestar dos veces CORRIGE, no suma.** La `huella` —nombre del
   alumno + grado + sección, normalizados— es la llave única de la fila.
   Sin ella, la madre que se equivocó de número paga un bus entero.

Lo que sale sin PIN es el evento y **cuántos van en total**; los nombres
y los teléfonos, nunca. El enlace anda suelto en un grupo de cientos de
personas.

Las fechas se parten a mano (`convFecha`, `aFecha`): `new Date('2026-08-15')`
se lee en UTC y en Honduras enseña el día ANTERIOR. Un padre que lee el
día equivocado no llega.

### El arranque empuja al padre; NUNCA toca las cuentas del maestro

Una lista en cero no la estrena nadie: el primero que abre el enlace
entiende que la salida no va a salir y se espera «a ver si se llena» —y
como todos hacen lo mismo, no se llena nunca—. Por eso el maestro puede
arrancar el conteo con un número suyo (`arranque`), que se le SUMA al que
ve el padre.

**La regla que no se negocia: ese número no entra en `convTotales`.** Los
buses, el dinero y la lista de los que van se calculan solo con las
respuestas de verdad. Si el arranque se colara ahí, el maestro
contrataría un bus para gente que no existe y lo pagaría de su bolsa —
que es exactamente lo que esta herramienta existe para evitar. En su
pantalla las dos cifras salen **separadas y rotuladas** (`.ad-cv-espejo`,
con otro fondo a propósito): arriba lo real, abajo «lo que ve el padre».

Y el aviso al maestro va escrito en la pantalla, porque el precio lo
paga él: si pone 80 y el sábado llegan 20, la familia que leyó «quedan
pocos asientos» se dio cuenta, y la convocatoria del año que viene ya no
la cree nadie.

### El reloj cierra de verdad

El padre ve un reloj bajando hasta el cierre, con sus segundos. Dos
cosas:

- **Sin hora, se cierra al ACABAR el día** (`cierreMs`). Si «11 de
  agosto» se tomara como las 00:00, ese mismo día 11 la madre que iba a
  contestar se encuentra el reloj en cero.
- **Al llegar a cero se cierra la lista, no se queda en 00:00:00.** Un
  reloj en cero con el botón de contestar debajo promete un asiento que
  el servidor va a rechazar.

Los segundos se redondean **hacia arriba** en las dos pantallas: si
faltan tres días clavados se lee «3 días 00:00:00», no «2 días
23:59:59».

### El boleto: un folio, dos pantallas

Quien contesta se lleva un **boleto** con folio; el maestro lo imprime
(siete tiras por hoja carta, con colilla para su firma) y se lo entrega **al
recibir el aporte**: es el recibo de la familia y el pase para subir al
bus. En el portón, con cuarenta familias apuradas, «yo contesté» no se
puede comprobar.

⚠️ **El folio se calcula en dos archivos y tiene que dar lo mismo**:
`convFolio`/`convHuella` (`js/tools/convocatoria.js`) y
`folioDe`/`huellaDe` (`salida.html`). No viaja por la nube a propósito —
sale del código de la convocatoria y de la huella del alumno, así que
funciona sin internet y no hizo falta tocar el servidor. Si las dos
cuentas se separan, el papel que el maestro entrega no es el que la
madre lleva en la galería. **Si cambia una, cambia la otra.**

El boleto **solo se le da si la respuesta ENTRÓ**. Sobre un envío que se
quedó sin señal sería un asiento que nadie apartó.

### La familia sin teléfono: apuntarla a mano y su boleto en blanco

El enlace no llega a todo el mundo, y no por descuido: **hay familias sin
teléfono y sin internet**. Esas no contestan nunca; le dicen al maestro
«yo mando a la niña» en el portón. Si la herramienta solo supiera de la
nube, esas familias se quedarían fuera de las cuentas y sin recibo del
dinero que pagaron —justo las que menos pueden reclamar después—.

Se resuelve con **dos cosas, y no hacen lo mismo**:

| | qué hace | cuándo |
|---|---|---|
| 🖊️ **Apuntar a mano** | la mete en las cuentas y le imprime su boleto lleno con los demás | con el teléfono en la mano |
| 🎟️ **Boleto en blanco** | papel con folio, para llenar con lápiz | en el portón, cobrando en el momento |

El papel **no cuenta solo**, y las dos pantallas lo dicen: al volver al
aula, esas colillas se pasan a Apuntar a mano.

**Apuntar a mano — tres reglas:**

1. **Se guarda en `c.manual`, NUNCA en `c.resp`.** `convTraer` reemplaza
   `resp` entero con lo que venga de la nube; ahí dentro, lo apuntado se
   perdería en el primer «Traer las respuestas» y el maestro no se
   enteraría hasta el portón.
2. **SÍ entra en `convTotales`, y esto es lo contrario del arranque.** El
   arranque es un número de empuje —gente que no existe— y por eso no
   cuenta; los apuntados a mano son personas con nombre y apellido que
   suben al bus y pagan. Lo que sí queda fuera es el **espejo**: el padre
   ve lo que sabe la nube (`nubePersonas` + arranque), nunca el total. Su
   pantalla no le miente en ninguna de las dos direcciones.
3. **Contarlos dos veces cuesta un bus.** La llave es la **misma huella**
   que usa el servidor (nombre + grado + sección, normalizados): apuntar
   dos veces al mismo corrige, y si esa familia acaba contestando el
   enlace, la fila de a mano se marca y deja de contar —pero **no se
   borra sola**: lo que el maestro escribió lo quita él.

**El boleto en blanco — dos reglas:**

1. **El folio no se repite jamás.** Se numeran corridos (`R4TP-M01`,
   `M02`…) y el contador vive en la convocatoria (`blancos`), así que el
   lote del jueves arranca donde acabó el del lunes. Y no pueden chocar
   con uno de la nube: aquellos son cuatro letras de `CONV_ALFA`, que no
   tiene ni 0 ni 1. Que se salte números no rompe nada; que se repitan, sí.
2. **Misma tira, misma colilla, mismas siete por hoja.** En el portón
   nadie tiene que notar que ese se llenó a mano, y el folio va impreso en
   las **dos mitades**: es lo que empareja la colilla del maestro con el
   papel de la familia.

### Quién ya pagó: se anota aquí, no en un cuaderno aparte

La convocatoria PREGUNTA quién va; el **control de aportes** anota **quién
ya pagó**. Son dos cosas y las dos hacen falta el mismo viernes: con la
primera se contratan los buses, con la segunda se sabe si el dinero
alcanza para pagarlos. En un cuaderno aparte esto se pierde de las dos
maneras, y las dos cuestan lo mismo: se le cobra dos veces a la madre que
ya pagó —y el maestro queda mal delante de ella— o sube al bus quien no ha
dado nada y la diferencia la pone él.

⚠️ **No sirve la colecta de 💰 Economía**, y por eso hay dos. Aquella se
lleva por **número de lista**, así que solo sabe de los alumnos del grupo
propio; aquí contesta la escuela entera —el enlace se manda al grupo
grande— y buena parte de los que van son de otros grados, sin número en
ninguna lista suya. El puente a Economía sigue donde estaba para quien
quiera llevar allí las cuentas de su propio grupo.

**Cuatro reglas:**

1. **Se guarda en `c.pagos`, NUNCA dentro de `c.resp`.** «Traer las
   respuestas» reemplaza `resp` entero con lo que venga de la nube: un
   pago guardado ahí se borraría solo, y el maestro se enteraría
   cobrándole otra vez a quien ya le pagó. Es la misma razón por la que
   los apuntados a mano viven en `c.manual`.
2. **La llave es la huella de siempre** (nombre + grado + sección). El
   pago sigue pegado a su familia venga del enlace o del cuaderno, y no
   se despega si después se corrige cuántas personas van.
3. **Se guarda el MONTO, no un sí/no.** El abono es lo normal: la madre
   trae L 100 de los L 250 el lunes y el resto el jueves. Lo que se le
   sigue debiendo **se calcula**, nunca se escribe. Un toque en la fila la
   deja pagada por lo que le toca —el caso de nueve de cada diez— y el
   segundo abre la casilla para el abono o para quitar la marca; es la
   misma forma de anotar que ya tiene la colecta de Economía, a propósito.
4. **El pago no viaja a la nube.** Por el enlace sale el evento y cuántos
   van en total; quién pagó y cuánto es plata de las familias y se queda
   en el equipo, igual que los teléfonos.

**El aviso de cobro va solo a los que deben.** La plantilla «💵 Falta el
aporte» lleva `quien: 'deben'` y el marcador `{falta}` —lo que queda
debiendo—, no `{aporte}`: a quien abonó L 100 de L 250 hay que pedirle
150, no 250 otra vez. Y a la que pagó el lunes no se le pide nada:
pedirle dos veces el mismo dinero es la forma más rápida de que deje de
leer los mensajes del maestro.

⚠️ **`CONV_AVISO_COBRO` guarda cuál plantilla es la del cobro.** Si se
mete un aviso nuevo en medio de `CONV_AVISOS`, el botón «Cobrarles a los
que faltan» abriría el que no era.

### El listado por grado: la pantalla anota, el papel cobra

En la pantalla el control sirve para **anotar**; la hoja sirve para
**cobrar**, que es otra cosa: se cobra de pie, en el recreo o en el
portón, sin la aplicación delante y con el lápiz en la mano.

- **La primera hoja es el resumen** —cuánto se esperaba, cuánto hay y
  cuánto falta, grado por grado, con las rayas de firma—. Es la que se
  entrega y la que se firma; sin ella hay que sumar seis hojas a mano
  delante del director.
- **Sale compacto: los grupos van seguidos.** Empezó saliendo una hoja
  por grupo siempre, y cuando contesta la escuela entera eso son doce
  grupos de tres o cuatro familias: **trece hojas** con dos dedos de
  tinta y el resto en blanco. En un aula sin fotocopiadora propia cada
  hoja se paga. Ahora las mismas 42 familias caben en **tres**. Lo que
  se recortó fue aire: el encabezado va una vez y no doce, el renglón de
  totales de cada grupo se calla porque **la franja del grado ya dice lo
  mismo**, y las firmas van una vez al final. El **tamaño de letra del
  cuerpo no se toca**: esta hoja se lee de pie en el portón y a veces con
  mala luz.
- **Y se puede volver a una hoja por grado**, con su botón en la ventana
  de impresión (`body.reparto`). Esa forma no se tira, porque es la que
  sirve para **repartir**: la de 6º-1 al maestro de 6º-1, con su
  encabezado y su firma, que si no habría que fotocopiar la hoja para
  dársela a dos personas. Las dos formas **dicen lo mismo**; lo único que
  cambia es dónde parte la hoja. Y **el grupo es grado + sección**:
  «6º-1» y «6º-2» son dos listas, dos maestros y dos hojas.
- **Los grupos NO llevan `break-inside: avoid`.** Se probó y sale más
  caro: el grupo que no cabe entero en lo que queda de hoja se va
  completo a la siguiente y deja media página en blanco —justo lo que se
  estaba quitando—. Lo que sí se cuida es que la franja del grado no se
  quede sola al pie (`thead { break-after: avoid }`).
- **El encabezado va en el `<thead>`** para que el navegador lo repita en
  cada página. Un grupo de 43 familias pasa a la segunda hoja, y una hoja
  suelta sin el nombre del grado ni las columnas no se puede ni leer ni
  archivar.
- **Al que debe algo se le deja su raya para escribir**, también al que
  abonó a medias: va a traer el resto y hay que apuntarlo en su renglón.
- **Los anchos van en un `<colgroup>`**, no en la fila de los rótulos. Con
  `table-layout` fijo el navegador mira la PRIMERA fila, y esa es la
  franja del grado —una sola celda con `colspan`—: los anchos escritos
  abajo se ignoran y las nueve columnas salen todas iguales.
- **Las nueve columnas suman 195 mm y no 196.** El milímetro que sobra no
  es de adorno: con `border-collapse` el borde de fuera cuenta medio píxel
  a cada lado y a 196 clavados la tabla se pasaba del papel. Lo que se
  corta por la derecha es **la firma**, que es lo único de esa hoja que no
  se puede volver a poner.

### El día de la salida: la subida al bus

Las listas sirven hasta el viernes; el sábado empieza el portón, y ahí lo
que hay son **dos maestros, cuarenta familias, un bus con el motor
andando y gente que llega a pagar en ese momento** —porque siempre hay
quien paga a última hora—. Con un cuaderno eso se resuelve de dos
maneras y las dos salen caras: se sube al que no ha dado nada, o se para
la fila entera mientras se busca un nombre en la lista de la escuela.

🚌 **Subida al bus** es el **pase de lista del bus**, y se ve igual a
propósito: los mismos chips que el maestro toca todos los días. El día
de la salida no es día de aprender una pantalla nueva. Vive en
`js/tools/convocatoria.js` (`convAbordo`, `convHtmlAbordoDentro`,
`convAbordoTocar`).

**Cuatro reglas, y ninguna es de adorno:**

1. **Se guarda en `c.abordo`, NUNCA dentro de `c.resp`.** Es la razón de
   siempre —`convTraer` reemplaza `resp` entero con lo que venga de la
   nube—, y aquí significaría perder la cuenta de **quién está DENTRO
   del bus** con el bus a punto de salir. Tampoco viaja a la nube:
   `convDatosPublicos` es lista cerrada y `abordo` no está en ella. Por
   el enlace sale cuántos van, nunca quién se montó.
2. **Un toque sube a la familia entera.** Con cuarenta en fila, cada
   toque de más es un minuto de portón. El **segundo** toque abre la
   casilla, que es donde caben las dos cosas raras y reales: que
   vinieran menos de los que dijo, y que el maestro se equivocara de
   chip (el **0** la baja del bus).
3. **Al que debe no se le sube en silencio.** Su chip va en **ámbar con
   lo que falta** —el mismo ámbar del abono— y al tocarlo la pantalla
   pregunta si ya lo dio. Es la última vez que el maestro tiene delante
   a esa madre con el dinero en la cartera: al que sube sin pagar no se
   le vuelve a ver hasta la semana siguiente, y la diferencia la pone
   él. Lo cobrado ahí **se anota como pago normal** (misma huella, mismo
   `c.pagos`), así que el lunes no se le cobra dos veces.
4. **Se cuentan personas, no familias.** Los asientos son de personas:
   va el niño y va la mamá. Y lo que se cuenta al subir es **lo que de
   verdad se montó**, no lo que se había apuntado.

**Los que pagan a última hora van en su propia fila, fuera del bus.**
Con dos maestros, uno sube a los que están al día por la puerta y el
otro cobra en la acera; si la fila del dinero tapa la puerta, no suben
ni unos ni otros. La tarjeta 💵 **Cobran aquí, fuera del bus** lista solo
a los que deben **y no han subido**, con un botón que **anota el pago y
los sube en el mismo toque**. Al que no lleva el teléfono se le imprime
el listado por grado de 💵 Quién ya pagó, que es el mismo papel.

⚠️ **Al subir a alguien NO se repinta la pantalla entera**
(`convAbordoRepintar`, sin `renderAdmin`). Es la misma regla de la cola
de avisos y de la barra de grupos: el maestro está a mitad de una lista
larga, con un nombre escrito en el buscador, y un salto al principio de
la página en cada familia que sube es lo que hace que cierre la
aplicación y siga en un papel. Se repinta **también el control de
pagos** (`#cv-pagos`), porque lo cobrado en el portón tiene que verse
ahí en el momento: si no, el maestro creería que no se guardó.

Dos detalles que salen del portón y no de la pantalla: **el buscador
encuentra por folio**, que es lo que la familia enseña —no dice su
nombre completo—, y **⏳ Todavía no han subido** lleva el teléfono con
📞 para llamar antes de arrancar. Cinco minutos de espera cuestan menos
que dejar a un niño en el portón.

### Quitar a quien se apuntó por error

El enlace anda suelto en un grupo de cientos de personas, y por ahí entra
lo que tiene que entrar y también lo otro: la **prueba que hizo el propio
maestro** para ver cómo se veía, el que se equivocó de convocatoria, el
nombre escrito de broma. Eso cuenta personas, cuenta dinero y cuenta
**asientos**: se contrata un bus para gente que no existe. Hasta ahora
solo se podía quitar lo apuntado a mano.

Cada respuesta del enlace lleva su **🗑 Quitar**, y lo quitado se ve en
**🗑 Quitados de la lista**, al final de la pantalla, con su botón para
devolverla. Cuatro reglas:

1. **Se guarda en `c.quitados`, NUNCA borrando de `c.resp` a secas.**
   `convTraer` reemplaza `resp` entero con lo que venga de la nube: lo
   borrado ahí volvería en el primer «Traer las respuestas» y el maestro
   se enteraría contando gente en el portón. Es la misma razón por la que
   viven aparte los pagos y lo apuntado a mano.
2. **Se borra también en el servidor** (`metas_conv_quitar`, con el PIN),
   para que el «ya somos 37» que ve el padre deje de contarla. Sin señal
   se esconde igual aquí y **se reintenta al traer las respuestas** —y se
   reintenta con todo lo que el servidor siga mandando, aunque ya haya
   dicho que lo borró: si la fila vuelve a venir, es que allá sigue—.
   Mientras no entre, el espejo de «lo que ve el padre» **la sigue
   contando**, porque eso es lo que él ve.
3. ⚠️ **Si la familia vuelve a contestar, VUELVE A SALIR.** Es la regla
   que no se puede saltar. Esconder una huella para siempre es perder una
   respuesta en silencio: la madre cree que apartó su asiento y el niño se
   queda en el portón. Por eso el escondite guarda la marca de tiempo de
   la fila (`act`, que viene del servidor) y se suelta solo en cuanto
   llega una distinta.
4. **Se puede devolver.** El maestro quita renglones con cuarenta nombres
   delante y el teléfono en la mano. Si el servidor ya la borró, la fila
   guardada vuelve como **apuntada a mano** —misma huella, o sea el mismo
   folio de boleto que la familia tiene guardado en su teléfono—.

Lo quitado **no viaja a la nube**: `convDatosPublicos` es una lista
cerrada de lo que sube, y `quitados` no está en ella.

### El aviso en lote: se escribe una vez y se manda cuarenta

La convocatoria PREGUNTA y ahí se acaba, pero entre el «sí voy» y el bus
pasan cinco días y siempre hay algo que decir: que vengan por el boleto,
que cambió la hora, que falta el aporte, que llovió. Eso se venía
haciendo escribiendo el mismo mensaje cuarenta veces y copiando a mano el
nombre de cada alumno; a la décima el maestro lo manda al grupo de la
escuela, donde la mitad no lo lee y la otra mitad no sabe si es para
ella.

El aviso se escribe **una vez, con marcadores** (`{alumno}`, `{grupo}`,
`{folio}`, `{aporte}`…) y la pantalla lo personaliza y va abriendo el
chat de cada familia.

⚠️ **No se manda de un golpe, y no es un descuido.** WhatsApp no deja
escribirle a cuarenta números desde una página web sin pagar su servicio
de empresa. Prometerlo sería mentirle al maestro. Lo que sí se quita es
todo lo demás —escribir, buscar el contacto, acordarse de por quién
iba—, y quedan tres toques por familia.

**Cinco reglas:**

1. **La cuenta no se pierde.** A quién ya se le mandó se guarda en el
   equipo (por `huella`, la de siempre). El maestro manda doce, le toca
   clase, cierra la aplicación y vuelve al trece. Sin esto, a la segunda
   interrupción hay familias que reciben el mismo aviso tres veces y
   otras ninguna.
2. **El que no tiene teléfono se ve, con su nombre.** Son las mismas
   familias de los boletos en blanco. Si no salieran en pantalla, el
   maestro cerraría creyendo que avisó a todos.
3. **Cambiar de plantilla empieza una tanda nueva**, y por eso la cuenta
   vuelve a cero: si se conservara, a los doce que ya recibieron el aviso
   del boleto no les llegaría nunca el del cambio de hora. Retocar el
   texto a mano NO reinicia nada —eso es corregir una errata a media
   tanda.
4. **El número lleva país.** El padre escribe ocho dígitos, que es como
   se marca aquí; `wa.me` sin el país abre WhatsApp sin chat. El prefijo
   sale del número del **propio maestro** (`convPrefijo`), así que esto
   mismo sirve en Guatemala o El Salvador sin tocar código.
5. **Saltar no es borrar.** La familia saltada vuelve al FINAL de la
   cola: se saltó porque no era el momento, no para dejarla sin avisar.

**El mensaje se retoca familia por familia.** La plantilla sirve para las
veintisiete, pero siempre hay una a la que hay que decirle otra cosa
(«usted ya me trajo el aporte, solo venga por el boleto»). Por eso la
burbuja verde **no es una vista previa: es la casilla donde se escribe**
lo que va a salir a ese número. Lo que se cambia ahí se guarda por
`huella` (`aviso.retoques`), así que aguanta cerrar la aplicación, y
**manda sobre la plantilla**: si después se cambia el mensaje de todas,
el retoque NO se pisa —se escribió a propósito para ella— y la pantalla
lo dice con su etiqueta, que se deshace de un toque. Los retoques se van
con la tanda cuando se cambia de plantilla.

⚠️ **De quién es el mensaje que hay en la casilla se lee de
`_convAvMuestra`, nunca de una variable capturada al pintar.** La cola
cambia de familia en cada envío, pero la parte de arriba de la tarjeta se
pinta una sola vez: al escribir en el mensaje de todas se rellenaba la
casilla con los datos de la familia que tocaba al ENTRAR. Parecía un
adorno mal puesto y dejó de serlo en cuanto la casilla se pudo retocar:
ese texto es el que se guarda y el que sale por WhatsApp, así que la
tercera madre recibía el folio de la primera y las dos llegaban al portón
con el mismo número de boleto.

El botón de mandar va **arriba** y lo de escribir el aviso, abajo —igual
que el mensaje para el grupo—. El aviso se escribe una vez; el botón se
toca cuarenta, y si al volver de WhatsApp hubiera que pasar por las
plantillas y los marcadores para llegar a él, se abandona en la quinta
familia.

⚠️ **Dos elementos no pueden compartir `id`.** El botón «Mandarlo por
WhatsApp» se llamaba `cv-wa` igual que el campo del teléfono del maestro;
como el botón se pinta antes, `getElementById` lo devolvía a él y al
guardar una convocatoria publicada `c.wa` se llenaba con el `value` vacío
de un `<button>`. El número del maestro se borraba del equipo Y de la
nube, sin ruido — y ese es justo el número al que la pantalla del padre
manda la respuesta cuando se le cae el internet.

**Antes de publicar un cambio de la convocatoria:**

```
node _dev/servidor-estatico.js       (en otra terminal)
node _dev/verifica-convocatoria.js   → el padre, el maestro, el arranque, el reloj, el folio, el aviso en lote y los pagos
node _dev/verifica-boletos.js        → los boletos impresos, contando las páginas del PDF
node _dev/verifica-listado-pagos.js  → el listado de aportes por grado, contando las páginas del PDF
```

⚠️ **Lo que se le manda a la nube se comprueba ANTES de recargar la
página.** Con el service worker ya instalado, las llamadas de la página
recargada no pasan por el `page.route` de la sonda y no hay nada que
mirar: una comprobación puesta después del `reload` pasa siempre, diga lo
que diga el código.

El primero vigila las dos cifras que cuestan dinero —el día del evento y
cuántos buses—, las cuatro del control de aportes —que un pago **no se
pierda** al traer las respuestas, que un abono **corrija en vez de
sumar**, que el cobro le llegue **solo al que debe** y por **lo que le
falta**, y que la plata de las familias **no salga por el enlace**—, las dos formas de perder una respuesta —contarla doble y
no contarla—, que el arranque no se cuele en las cuentas del maestro, que
el folio del padre sea el del maestro, que **el contador de los blancos
quede guardado** para que la segunda tanda no repita la primera, y las
cuatro del apuntado a mano: que **cuente**, que **no se pierda** al traer
las respuestas, que **no cuente dos veces** si esa familia además
contesta el enlace, y que **no se le cuele al padre** por el espejo.
Vigila también el aviso en lote: que a cada familia le llegue **su**
nombre y **su** folio y no los de la anterior, que el número salga con el
país delante, que la cuenta sobreviva a cerrar la aplicación, que cambiar
de plantilla la reinicie, que el sin teléfono salga con su nombre y que
guardar no le borre al maestro su propio WhatsApp. Y las cuatro del
retoque: que lo escrito para una familia **salga por WhatsApp aunque no
se haya salido del campo**, que **no se le pegue a la siguiente**, que
aguante cerrar la aplicación y que cambiar el mensaje de todas **no se lo
borre por detrás**. Y las cinco de quitar a quien se apuntó por error:
que **deje de contar**, que **no vuelva sola** al traer las respuestas,
que **sí vuelva si esa familia contesta otra vez**, que el borrado se le
pida al servidor **con el PIN** y se reintente sin señal, y que lo
quitado **no viaje a la nube**. El
segundo cuenta las páginas del PDF: 42 familias tienen que dar **6
hojas**, ni una más; el boleto tiene que seguir siendo una TIRA ancha y no
un cuadro con un hueco en medio; y el que sale en blanco tiene que llevar
sus rayas para escribir y el folio impreso **en las dos mitades**. El
tercero mide el listado de aportes: que **nada se salga del ancho del
papel** —lo que se corta por la derecha es la firma—, que **no gaste
hojas de balde** (42 familias de doce grupos, en tres hojas y no en
trece), que la forma de **repartir** siga dando una hoja por grupo con su
encabezado y su firma, que estén el nombre, el folio y el teléfono de
cada familia, que **la suma de los grados dé el total** del resumen y que
todo el que deba algo lleve **su raya para escribir**. La nube no se
toca: se pone un Supabase de mentira con `page.route`, así corre sin
internet y sin ensuciar datos reales.

## Normativa: estrenar una materia se hace en NUEVE archivos

Estrenar una materia no es añadir una misión con un `subject` nuevo: es una
puerta en la portada, una barra en el progreso, un gajo en la ruleta del
Campeonísimo, una fila en el banco de evaluaciones y un nombre en la boleta.
Si falta uno, no da error: da una materia a medias, y el maestro se entera
buscando el examen que no aparece.

**E. Cívica** (`cívica`, clase `civ`, verde del pino `#3f6212`) se estrenó el 8
de septiembre de 2026 con la misión **Aspectos Cívicos de Honduras** (id 67,
Ruta de la Patria 🇭🇳, etapa 1). Lo que hubo que tocar, y en ese orden:

| archivo | qué se añade |
|---|---|
| `js/data/misiones.js` | la ruta en `RUTAS` y la misión con su `subject`, `color`, `ruta` y `etapa` |
| `js/app.js` | la etiqueta en `SUBJECT_LABELS`, la barra en `subjects` y la ruta en `RUTAS_ORDEN` |
| `css/app.css` | los tokens `--civ/-bg/-border` y **diez** clases: `.subj-chip`, `.pill` (con su `--pill-rgb`), `.mc-icon`, `.mc-subj`, `.ruta-pct`, `.ruta-bar-fill`, `.camp-ms-bh-`, `.camp-sa-`, `.camp-sp-` y `.camp-q-header-` |
| `index.html` | el chip de materia y la píldora del filtro |
| `js/tools/campeonismo.js` | la fila de `CAMP_SUBJECTS` (la ruleta se genera sola de ahí) |
| `evaluaciones.html` | la fila de `ORDEN`, o sus exámenes no tienen dónde imprimirse |
| `js/tools/registros-admin.js` | el nombre largo para la boleta |
| `js/tools/plan-accion.js` | la fila de `PA_HIST_MATERIAS`: sin ella la materia sale en el selector como «Cívica» a secas, sin emoji ni nombre largo |
| `js/data/diagnosticos.js` | las preguntas de la ruta, sacadas del `evalMCBank` |

⚠️ **El color no se elige a ojo: se mide.** Se calcula la distancia de color
contra las materias que ya existen (app y Campeonísimo, que NO usan los mismos
códigos) y se toma una familia cromática libre. El verde oliva salió porque el
amarillo-verdoso era el único hueco: el verde de C. Naturales es un teal
(`#0d9488`) y a la vista no se confunden. Dos azules o dos rojos rompen la
regla de siempre —el maestro reconoce el examen por el color sin leerlo— aunque
los códigos sean distintos. El script de la medición está contado en
`PLANTILLA-MISIONES.md`.

**Los conteos NO se escriben.** El `<em>1 misión</em>` del chip y el
`<span class="n">1 ficha</span>` del índice de fichas son marcadores: el
JavaScript los sobrescribe contando. Se dejan puestos para que la página no
parpadee vacía, pero cambiarlos a mano no sirve de nada.

**Lo comprueba `node _dev/test-campeonismo-tec.js`** (está en `npm test`): mira
que `CAMP_SUBJECTS` y `misiones.js` digan las mismas materias y que estén las
tres clases CSS de cada una. Es la que caza la materia a medias.

### La materia de E. Cívica no es Ciencias Sociales

Se pensó meterla ahí y se descartó: el maestro que busca «el repaso de los
símbolos patrios» en septiembre no lo busca dentro de Sociales, igual que no
busca la prueba de fin de grado dentro de Matemáticas. Es la misma razón por la
que Repaso General estrenó materia propia.

Y va en su propia ruta, la **Ruta de la Patria**, no en la Ruta del Tiempo: el
civismo no se estudia como pasado. Los símbolos, el Himno y las fechas cívicas
se usan HOY, en el acto del lunes y en el desfile del 15 de septiembre.

### El contenido cívico se verifica, y sus fuentes están anotadas

Los datos de esta misión los pregunta el **Cuestionario Cívico** que se vende en
las papelerías y que muchos centros toman como examen de septiembre. Un dato
malo aquí no falla una pantalla: le enseña al alumno la respuesta equivocada
para el examen que va a hacer la semana siguiente.

De dónde salió cada cosa:

- **El currículo**, del repositorio: `_dev/dcnb/dcneb-basica-i-ciclo-43-ciencias-sociales-primer-grado.md`
  («Identifican los símbolos patrios», «Explican como los símbolos patrios
  cuentan la historia de nuestra nación»), la expectativa de II ciclo
  «Distinguen y respetan los símbolos patrios», y la lista de héroes que el
  DCNB nombra por su nombre en `dcnb-prebasica-2015-07-comunicacion-3de7.md`:
  Francisco Morazán, José Cecilio del Valle, José Trinidad Cabañas, José
  Trinidad Reyes y Dionisio de Herrera, con sus fechas de nacimiento.
- **Los símbolos y sus fechas**, de `js/data/paises.js` (que ya los traía) más
  verificación cruzada.

⚠️ **Lo que NO se escribió, y a propósito: los números de decreto donde las
fuentes se contradicen.** El de la flor nacional aparece como No. 17 y como
No. 96 según quién lo cuente; el del árbol, con dos fechas (1927 y 1928). Se
escribe el AÑO, que es lo que el cuestionario pregunta y lo que nadie discute,
y se deja fuera el número. Es la misma lección de
`INVESTIGACION-ESTATUTO-DOCENTE.md`: **buscar no es leer**, y un número de
decreto sacado de un extracto de buscador no acredita nada. El día que entre a
`_dev/leyes/` el PDF de La Gaceta con esos decretos, se ponen.

**Antes de publicar un cambio de esta misión o de la materia:**

```
node _dev/verifica-mision-nueva.js misiones/2y3ciclo-aspectos-civicos/aspectos-civicos.html
node _dev/verifica-nombres-propios.js
node _dev/servidor-estatico.js       (en otra terminal)
METAS_BASE=http://localhost:8123 node _dev/verifica-mision-navegador.js misiones/2y3ciclo-aspectos-civicos/aspectos-civicos.html
node _dev/verifica-ficha-paginas.js ficha-aspectos-civicos
```

⚠️ **El escape `\U0001F1ED` es de Python y JavaScript NO lo entiende.** Se
publicó así el 8 de septiembre de 2026: en el Laboratorio de la misión, donde
iba la bandera 🇭🇳, el alumno leía **«U0001F1EDU0001F1F3»**. JS solo sabe de
`\uXXXX` y `\u{XXXXX}`, los dos con **u minúscula**; con la mayúscula se come
la barra y pinta el texto pelado.

Se coló por donde se cuela siempre: los bancos de datos se escribieron con un
guion de Python, y ahí `'\\U0001F1ED'` deja el escape crudo en el archivo. Y no
lo cazó **ninguna** de las 66 sondas, porque el archivo **compila**: `node
--check` lo da por bueno, el navegador no dice nada y el estropicio solo se ve
mirando la pantalla. Es el mismo daño que ya vigila `verifica-sintaxis.js`, así
que ahí entró la comprobación. **En los emojis se escribe el carácter de
verdad**, como en las otras 74 misiones.

⚠️ **`verifica-nombres-propios.js` NO puede pedir «Lempira» con mayúscula a
secas.** En minúscula es la MONEDA («1 lempira con 25 centavos»), que es como
sale en las misiones de decimales y en las de fin de grado: pedirlo daba seis
fallos con el texto perfectamente escrito. Se comprueba «cacique Lempira», que
es inequívoco.

## Normativa: la letra del Himno vive en UN archivo

El Himno Nacional tiene su propia misión (`misiones/2y3ciclo-himno-nacional/`,
id 68, Ruta de la Patria, etapa 2) y no está dentro de la de símbolos patrios.
No es reparto de contenido: en **sexto y en noveno** se pregunta todos los años
lo mismo —**escribe una estrofa del Himno y explícala**—, y para contestar eso
hace falta la letra ENTERA, verso por verso, con su vocabulario. Un resumen de
cuatro renglones dentro de una misión de símbolos no da para eso.

Y ahí está lo que de verdad manda en esta misión: **la letra existe en dos
sitios que una persona lee** —la pantalla y la ficha que se fotocopia— y **no
puede haber dos originales**. Si alguien corrige una coma en la ficha, a partir
de ese día el alumno estudia una letra y el maestro le corrige por la otra.
Por eso:

- **La letra vive en `js/data/himno.js`**, y solo ahí. Trae el coro y las siete
  estrofas con sus versos, el tema de cada parte, su explicación, el
  vocabulario y el dato. También el **coro CANTADO** aparte, que no es lo
  mismo (ver abajo).
- **La misión no la escribe: la pinta.** `pintarHimnoMapa()`,
  `pintarHimnoLista()` y `pintarEjemploCantado()` arman las secciones desde
  ese archivo, y `parteData` del Laboratorio también. En el HTML de la misión
  **no hay un solo verso escrito a mano**.
- **La ficha sí es HTML plano**, como las otras 74 —se arma con un guion y lo
  que se publica es el resultado—, así que ahí la copia es inevitable. Lo que
  no es inevitable es que se separen.

Eso lo vigila una sonda propia:

```
node _dev/verifica-himno.js
```

Compara la ficha contra `js/data/himno.js` **verso por verso** (los 64 del
Himno más los 8 del coro cantado), comprueba que la misión no lleve la letra
escrita a mano, y hace una tercera cosa que costó encontrar: **que las citas
del JS de la misión digan lo que dice el Himno**. Las actividades citan versos
a propósito —«¿de qué parte es este verso?»—, así que prohibirlas no sirve; lo
que enseña mal es una cita recortada. Ya cazó una: la operación decía
«marcharemos a la muerte» donde el verso dice **«marcharemos, ¡oh patria!, a la
muerte»**, y así es como el alumno lo habría escrito en el examen.

Solo se juzga lo que **pretende** ser una cita: lo que comparte con el Himno
una tirada de **cuatro palabras seguidas**. Con eso se quedan fuera solos los
«¡Bien hecho!» y los títulos, sin listarlos uno por uno. Y se compara sin
distinguir mayúsculas ni signos, porque «Infame eslabón» encabeza una tarjeta
y en el Himno va a media frase.

Hay **una excepción, nombrada y con su motivo** dentro de la sonda: el caso de
pensamiento crítico donde una alumna copia el coro MAL, con las repeticiones
que se cantan. Ese error está escrito a propósito y es lo que se le pide
detectar.

### Se escribe de un modo y se canta de otro

Cantando se repite: «Tu bandera, **tu bandera** es un lampo de cielo». Esas
repeticiones **las pide la música**, no el poema. Escrito, el verso va una sola
vez — y copiar el coro con las repeticiones es el error más común del examen.

Por eso `HIMNO_CORO_CANTADO` va **aparte** de los versos del coro, y la misión
enseña las dos formas una al lado de la otra. Lo que se compara contra la ficha
son las dos: 64 + 8 = **72 versos**.

⚠️ Y dos cosas que parecen erratas y **no lo son**: **«enseñastes»** con -s en
la sexta estrofa (sin esa letra al verso decasílabo le falta una sílaba) y
**«tan sólo»** con tilde en la tercera. Están anotadas dentro de `himno.js`
para que nadie las «arregle».

### Los versos van numerados, y no es adorno

En un teléfono de 360 px se parten **65 de los 72 versos** —medido—, porque un
verso de diez sílabas no cabe de ancho. Sin el número, el alumno no sabe si lo
que baja es el mismo verso o el siguiente, y lo que el examen le pide contar es
justo eso: son **ocho**, ni siete ni nueve.

La otra salida era encogerle la letra hasta que cupieran, y **se descartó
medida**: a 16 px se parten 20 de 72, pero la misión arranca en
`body.letra-grande` a propósito y esta se lee en el pupitre. El número va en el
margen (`.hn-n`, `position:absolute`) para que el verso que se parte baje
alineado con su propio texto y no debajo de la cifra. La ficha impresa lleva lo
mismo (`.estrofa .v i`).

**Antes de publicar un cambio de esta misión o de la letra:**

```
node _dev/verifica-himno.js                 → la pantalla y el papel, verso por verso
node _dev/verifica-mision-nueva.js misiones/2y3ciclo-himno-nacional/himno-nacional.html
node _dev/verifica-nombres-propios.js
node _dev/verifica-ficha-paginas.js ficha-himno-nacional
node _dev/servidor-estatico.js       (en otra terminal)
METAS_BASE=http://localhost:8123 node _dev/verifica-mision-navegador.js misiones/2y3ciclo-himno-nacional/himno-nacional.html
```

Si se toca la letra, la ficha **se vuelve a repartir** (`node
_dev/reparte-hojas-ficha.js ficha-himno-nacional`): son nueve hojas y un
párrafo que crece dos renglones parte una en dos.

## Normativa: a quién se nombra prócer lo decide el DCNB, no el gusto de nadie

La tercera misión de la Ruta de la Patria son los **héroes y próceres**
(`misiones/2y3ciclo-proceres-heroes/`, id 69, etapa 3). Se hace con el mismo
patrón que el Himno y por la misma razón: lo que aquí se pregunta son **datos
duros** —el año, el lugar, el apodo, el día del calendario cívico— y esos datos
acaban en dos sitios que una persona lee, la pantalla y la ficha que se
fotocopia. Un dígito de diferencia no es un matiz: es la pregunta del examen de
septiembre contestada mal, y el alumno estudiando lo que su maestro le va a
corregir en rojo.

Por eso:

- **Los datos viven en `js/data/proceres-honduras.js`**, y solo ahí. De cada
  uno: `clave`, `nombre`, `apodo`, `emoji`, `clase`, `epoca`, `papel`, `hizo`,
  `porque`, `dato`, y `nacio`/`fecha`/`nota` cuando los hay.
- **La misión no los escribe: los pinta.** `pintarProceresMapa()`,
  `pintarProceresLista()` y `pintarProceresDiferencia()` arman las secciones
  desde ese archivo, y de ahí salen también el Laboratorio, las tarjetas de
  repaso, el memorama y los pareados —se **generan**, no se copian—. En el HTML
  de la misión no hay un solo dato escrito a mano.
- **La ficha sí es HTML plano**, como las otras 75, así que ahí la copia es
  inevitable. Lo que no es inevitable es que se separen: eso lo vigila
  `node _dev/verifica-proceres.js`, dato por dato y dentro del recuadro de cada
  personaje, para que un dato que se cuele en el del vecino —que es lo que pasa
  al copiar y pegar un bloque— salga como fallo.

**A QUIÉNES se nombra no es una elección del autor.** La expectativa del DCNB
los nombra con estas palabras: «Identifican la participación de algunos
personajes como: Francisco Morazán, Dionisio de Herrera, José Trinidad Reyes,
Marco Aurelio Soto, Ramón Rosa, en la historia de Honduras»
(`_dev/dcnb/dcneb-basica-i-ciclo-45-ciencias-sociales-tercer-grado-1de2.md`). El
mismo documento nombra a José Cecilio del Valle y a José Trinidad Cabañas, y a
Lempira 51 veces. Y **la sonda no lleva esa lista escrita**: la lee de la cita
que el propio archivo de datos trae en su cabecera, así que no puede quedarse
vieja por su cuenta.

⚠️ **«Héroe» y «prócer» NO son una casilla limpia para todos.** Un héroe
defiende a su pueblo; un prócer ayuda a fundar la nación. Lempira es el Héroe
Nacional y eso no lo discute nadie; a **Morazán se le llama las dos cosas con
razón** —construyó como prócer y murió por su idea como héroe—. Preguntárselo
al alumno como si tuviera una sola respuesta sería calificarle mal una
respuesta buena, así que: las actividades de clasificar usan **solo lo que no
se discute** (tres ejes que no son el binario héroe/prócer), quien se llama de
las dos formas lleva su campo `nota`, y **la hoja del docente avisa de cómo
corregirlo**. La sonda comprueba que ese aviso esté: sin él la ficha pregunta
algo con dos respuestas buenas y solo acepta una.

⚠️ **Y la definición de héroe y de prócer tiene que ser la MISMA que la de
Aspectos Cívicos** (id 67). Son las dos primeras etapas de la misma ruta y el
alumno las abre seguidas: no puede leer dos definiciones distintas de lo mismo.
No se comparan letra por letra —son dos redacciones, una larga y otra de una
línea—: se busca la tirada de palabras más larga que las dos comparten, y si
alguien cambia «defiende a su pueblo» en un solo sitio, se cae y la sonda se
pone roja. Es la misma técnica con la que la sonda del Himno juzga una cita.

⚠️ **Lo que NO se escribe, y a propósito.** La fecha de nacimiento de José
Trinidad Reyes: el DCNB lo nombra pero no la trae, y un dato sacado de un
extracto de buscador no acredita nada. Es la misma lección de los números de
decreto de la flor y del árbol nacionales, y la de
`INVESTIGACION-ESTATUTO-DOCENTE.md`: **buscar no es leer**. El día que entre la
fuente, se pone.

**Y hay una sección SIN NOMBRES, que tampoco es un olvido.** El DCNB pide una
segunda cosa: «Explican la contribución y el costo pagado por las mujeres, los
indígenas y los afrocaribeños en la historia del país». Nombrar a alguien ahí
obligaría a verificarlo y este repositorio todavía no tiene con qué; inventar
una biografía para cumplir el currículo sería justo lo que la normativa
prohíbe. Lo que sí se hace —y es lo que el DCNB pide de verdad, con su
«investigación explicativa»— es plantearlo y mandar al alumno a averiguarlo en
**su** municipio, que es donde están los nombres que ningún libro trae. La
sonda comprueba que esa sección siga en el papel: es lo primero que se cae al
recortar una ficha para ganar una hoja.

**Antes de publicar un cambio de esta misión o de los datos:**

```
node _dev/verifica-proceres.js              → la pantalla y el papel, dato por dato
node _dev/verifica-mision-nueva.js misiones/2y3ciclo-proceres-heroes/proceres-heroes.html
node _dev/verifica-nombres-propios.js
node _dev/verifica-ficha-paginas.js ficha-proceres-heroes
node _dev/servidor-estatico.js       (en otra terminal)
METAS_BASE=http://localhost:8123 node _dev/verifica-mision-navegador.js misiones/2y3ciclo-proceres-heroes/proceres-heroes.html
```

Si se tocan los datos, la ficha **se vuelve a repartir** (`node
_dev/reparte-hojas-ficha.js ficha-proceres-heroes`): son siete hojas y un
párrafo que crece dos renglones parte una en dos.

## Normativa: la estrella se gana

Medido abriendo las 74 misiones y **sin tocar nada**: 34 daban estrellas de
regalo, **125 en total**, con el XP en 0. El alumno entraba, no tocaba nada,
y ya tenía cuatro estrellas.

| sección | misiones que la regalaban al abrir |
|---|---:|
| `s-evaluacion` | 34 |
| `s-aprende` | 33 |
| `s-tipos` | 32 |
| `s-errores` | 20 |
| `s-tareas` | 5 |
| `s-estructura` | 1 |

Y por el otro lado el puntaje se inflaba: el XP **se volvía a ganar
recargando** —`xpTracker`, el que recuerda qué tarjeta ya pagó, no se
guardaba, así que las mismas 14 tarjetas pagaban otra vez, y la pantalla
promete «(primera vez)» en **84 páginas**—; cada toque en «Calificar»
regalaba **+8 XP**; y el Reto felicitaba con «¡Bien hecho!» y desbloqueaba
su logro **con 0 de 8**.

Un puntaje que se consigue sin aprender no motiva: **enseña que el puntaje
no significa nada**. Y esa cifra sale en la Constancia que el alumno le
enseña a su familia. Es la misma regla que este proyecto ya escribió para
los videos —«ver un video no da XP ni marca la sección como hecha, porque
nadie puede comprobar que el niño lo miró»— sin aplicarla al resto.

Vive en **`js/estrella-ganada.js`**, en `STATIC_ASSETS` de `sw.js`, y **no
toca ni una línea de ninguna misión**: todo son envoltorios sobre `fin`,
`genEval`, `gradeEval`, `genTask` y `pts`, que viven copiados en las 74. Es
el mismo permiso que ya tienen el andamio de los juegos 3D, los videos, la
barra de secciones y el teclado.

**Cinco reglas, y ninguna es de adorno:**

1. ⚠️ **Antes del primer toque del alumno no se gana nada.** Es la regla que
   de verdad resuelve: cubre de un golpe las tres secciones de leer que se
   marcaban en el arranque **y** la prueba que algunas misiones pre-generan
   ahí mismo, sin tener que saber cuáles son ni en qué misión.
2. ⚠️ **Por eso el `<script>` va en el `<head>`, no al final del body.** Es
   lo único que hace que funcione: así su oyente de `DOMContentLoaded` queda
   registrado ANTES que el de la misión y llega a envolver `fin()` antes de
   que el arranque lo llame. Cargado al final llegaría tarde y las estrellas
   ya estarían puestas — **sin dar un solo error**. La sonda lo mira.
3. **Generar la PRUEBA no es hacerla.** `genEval` marcaba `s-evaluacion`:
   tocar «Nueva Evaluación» y no contestar nada daba la estrella. Ahora la
   da `gradeEval`, y **paga una sola vez**; al segundo «Calificar» se le
   devuelve la barra a donde estaba **y se le dice por qué**, que una barra
   que sube y baja sin explicación es un teléfono que el niño da por trabado.

   ⚠️ **`genTask` NO va en esa lista**, y esto se vio tarde: la sección de
   tareas **no tiene calificación** —el alumno pide sus ejercicios y los
   resuelve en el cuaderno—, así que deshacer también su marca la dejaba
   **imposible de completar para siempre**. Ahí basta la regla del primer
   toque: si los pidió él, la ganó; si los generó el arranque, no.
4. **La sección de solo leer se gana LLEGANDO AL FINAL** —y quedándose un
   momento, no de paso al cambiar de pestaña—. Es lo único comprobable en
   una sección que solo tiene texto.

   ⚠️ **Y la lista no se escribe en ningún sitio**: son exactamente las
   secciones que la propia misión intentó marcar al abrir. El autor ya sabía
   cuáles eran; lo que había que cambiar era cuándo.

   ⚠️ La prueba y las tareas **quedan fuera de esa lista a propósito**
   (`CON_ACTIVIDAD`): tienen su propia forma de ganarse, y ponerles el
   centinela del final devolvería el regalo por otra puerta —bajar hasta el
   final del examen daría la estrella sin contestar una pregunta—.
5. ⚠️ **Lo ya ganado NO se le quita a nadie.** `loadProgress` devuelve las
   estrellas guardadas escribiendo directo en `done`, sin pasar por `fin`,
   así que por ahí no se toca nada; y el envoltorio de `fin` mira **si la
   sección ya estaba** antes de la llamada. Sin ese detalle se le borraba al
   alumno una estrella de ayer: el arranque vuelve a llamar a `fin`, que no
   hace nada porque ya está, y el envoltorio la quitaba igual. Costó una
   prueba que salió con la estrella desaparecida después de recargar.

**Y el elogio depende del resultado.** El Reto decía «¡Bien hecho!» en verde
con 0 de 8. Ahora el mensaje sube por tramos —90 / 70 / 40—, el verde se
apaga por debajo de 40, y el logro «Héroe del Reto» pide 70 %. Eso sí son
**64 ediciones en las misiones**, porque el texto es de cada una; dos ya lo
hacían bien con su propio criterio (`retoOk>=5`) y se dejaron en paz.

⚠️ **Una edición con guion tiene que comprobar que la variable que mete
existe ahí.** `node --check` no lo caza: al condicionar el logro con
`pct>=70` en las 66, en dos misiones `pct` no existe en ese ámbito —usan
`retoOk`— y habrían reventado el Reto al terminarse el tiempo. Se
revisó después, no antes, y por poco.

**Antes de publicar un cambio del puntaje:**

```
node _dev/servidor-estatico.js          (en otra terminal)
node _dev/verifica-estrella-ganada.js
```

Lee del archivo **las 74** —que el aparato esté y que esté en el `<head>`—,
y en el navegador hace lo que de verdad importa: abrir y **no tener ni una
estrella**, que generar la prueba no la dé y calificarla sí, que calificar
otra vez **no vuelva a pagar**, que la sección de leer se gane **llegando al
final y no asomándose**, que la prueba **no** esté entre las de leer, y que
recargar **no vuelva a pagar las mismas tarjetas** pero **sí conserve** lo
ganado.

## Normativa: se puede usar sin el dedo y con la vista cansada

Dos cosas que se midieron el 7 de septiembre de 2026 y que dejaban gente
fuera de la aplicación entera, no de una pantalla.

### El zoom no se bloquea nunca

`user-scalable=no` estaba en **21 páginas**: la portada, `mision.html`,
`camp-vivo.html` y **los 18 juegos 3D**. Android Chrome lo respeta, así que
un maestro présbita y un alumno con baja visión **no tenían salida
ninguna** — la aplicación del maestro tiene rótulos de 11-12 px.

La etiqueta buena, que es la que ya usaban las otras 162 páginas, es esta y
**no hay dos formas de escribirla**:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Quitarlo no trae el zoom accidental al tocar rápido: `css/app.css` y
`css/parque-3d.css` ya llevan `touch-action: manipulation` en botones y
chips, que es lo que apaga el zoom del doble toque **sin apagar el pellizco**.
Si alguna vez se añade una pantalla con controles que se tocan a ritmo, el
`touch-action` va en el control, nunca en el `<meta>`.

### Las actividades se hacen sin el dedo

Medido abriendo las 74 misiones sección por sección: **2 314 elementos que
responden al clic y a los que el teclado no llegaba**. Clasifica,
Identifica, Empareja, el memorama, las analogías. Un alumno con discapacidad
motora podía leer la teoría entera y **no hacer una sola actividad**.

⚠️ **Y el patrón que ya estaba en 18 misiones NO servía.** `centena.js` pone
`role="button"` y `tabindex="0"` en las fichas del banco, pero **un `<div>`
así no responde a Enter ni a la barra espaciadora**: eso solo lo hace un
`<button>` de verdad. Comprobado en el navegador: se enfoca, se ve
enfocado, y al pulsar Enter no pasa nada; con un clic sí. Copiarlo a las
otras 56 habría repartido **1 141 paradas de tabulador que no llevan a
ninguna parte** — peor que no poder llegar, porque promete.

Vive en **dos archivos compartidos** —`css/teclado-actividades.css` y
`js/teclado-actividades.js`, los dos en `STATIC_ASSETS` de `sw.js`—, como el
andamio de los juegos 3D, el aparato de videos y la barra de secciones.

**Cinco reglas, y ninguna es de adorno:**

1. **La tecla se atiende UNA vez, en el documento.** Las actividades rehacen
   su HTML en cada pregunta; un oyente por elemento habría que volver a
   poner cada vez y se olvidaría en alguna. Se mira quién tiene el foco y se
   le da el clic.
2. **La barra espaciadora se para** (`preventDefault`). Sin eso, además de
   contestar **desliza la página una pantalla entera** —medido: 643 px— y el
   alumno pierde de vista lo que estaba haciendo.
3. ⚠️ **Se salta lo NATIVO, no lo enfocable.** Es la distinción que costó la
   primera versión: las fichas de `centena.js` ya traen `tabindex="0"`, así
   que «ya llega el teclado» las dejaba fuera —y son justo las que se
   enfocan y no hacen nada—.
4. ⚠️ **Una cuadrícula no se convierte en cuarenta paradas.** La sopa trae
   **144 celdas**: tabular 144 veces para cruzar una actividad no es
   accesibilidad, es una trampa. Por encima de 40 hermanos iguales se deja
   fuera —y la sopa, además, se saca **por su nombre**, porque tiene teclado
   propio (más abajo)—. El memorama (16) y el crucigrama (16) sí entran:
   esas son las opciones del juego.
5. **Lo que ya CONTIENE un control no se toca.** El velo que cierra el panel
   de logros lleva dentro sus botones: hacerlo parada añade un salto que no
   hace falta y duplica el del botón que ya está dentro.

**Y el foco tiene que VERSE**, que es la otra mitad. Un foco invisible es el
mismo callejón sin salida. Va un **doble anillo** —uno del color del fondo y
otro del de la misión— porque el contorno de un solo color se pierde encima
de una ficha oscura, que es lo que pasaba en `.wb-item`; es el mismo recurso
que el chip activo de la barra de grupos. Las **8 misiones del maestro no
tenían ninguna regla de foco**: ahí es el único anillo que hay.

⚠️ **Al medir un elemento recién enfocado hay que esperar.** Las fichas
llevan `transition: all .2s`, así que preguntar en el instante de enfocar
devuelve el valor VIEJO. Eso dio dos falsas alarmas seguidas: una con el
fondo de la barra de secciones y otra con este anillo.

### La sopa de letras: una parada, y las flechas por dentro

Era el único agujero que esta normativa dejaba escrito y sin tapar. Son **65
misiones del alumno y 8 del maestro**, 144 celdas cada una, donde el alumno que
no puede arrastrar podía leer la teoría entera y **no encontrar una sola
palabra**.

Lo que hizo falta no fue inventar un juego nuevo: **el juego con teclas ya
existía y nadie lo sabía**. El `pointerup` de las 65 del alumno tiene una rama
para cuando el dedo NO se movió —toca una celda, toca la otra, y la palabra
queda entre las dos—, y las 8 del maestro no tienen arrastre ninguno: son dos
toques. Así que el teclado **no imita el arrastre**, que es lo que con teclas no
se puede hacer: hace los mismos dos toques, y por eso el alumno con teclado
juega al mismo juego que su compañero y no a una versión de repuesto.

Vive en los **mismos dos archivos compartidos** (`js/teclado-actividades.js` y
`css/teclado-actividades.css`), así que **no se tocó ni una de las 73 misiones**.

**Seis reglas, y ninguna es de adorno:**

1. ⚠️ **UNA parada de tabulador, no 144.** Es la regla 4 de arriba cumplida, no
   saltada: al tabulador se entra una vez y se sale una vez; por dentro se anda
   con las flechas. La sonda lo cuenta tabulando de verdad.
2. **Las flechas NO deslizan la página** (`preventDefault`). Es la misma regla
   de la barra espaciadora: el alumno está mirando la cuadrícula y una flecha
   que además mueve la pantalla le quita de la vista justo lo que lee.
3. ⚠️ **El cursor sobrevive al repintado.** Las dos variantes rehacen la
   cuadrícula entera —la del maestro, en CADA toque—. Sin devolver el foco a la
   misma casilla, se cae al `<body>` en cuanto marca la primera letra y el
   alumno se queda fuera de la sopa sin saber por qué: un teléfono trabado.
4. **El principio se puede soltar** (Esc, o Enter otra vez en la misma celda).
   Con el dedo se suelta tocando fuera; con el teclado, sin esto, una marca
   puesta por error no se quita.
5. ⚠️ **El estado es UNO, el del juego.** El principio marcado se guarda en la
   variable de la propia misión (`sopaFirstClickCell`), no en una nuestra; y en
   las del maestro, que la guardan donde desde fuera no se ve, **soltar es
   volver a tocar esa celda**. Si no, el que marca con el dedo y remata con la
   tecla —lo normal con teclado y pantalla táctil— acaba con dos principios
   marcados y ninguna palabra encontrada. Costó un fallo de sonda: Esc borraba
   la marca de aquí y dejaba la de allá, y la palabra siguiente no salía nunca.
6. **Y se dice cómo se juega.** Es la regla de la barra de secciones: «se podía
   deslizar desde siempre; lo que faltaba era decirlo». La ayuda de teclas sale
   **solo cuando la cuadrícula tiene el foco**, para no robarle pantalla al que
   juega con el dedo.

⚠️ **Y si una misión no trae con qué rematar la palabra, ahí no se pone
teclado.** Es la lección de `centena.js`: una parada de tabulador que promete y
no cumple es peor que no poder llegar.

⚠️ **De paso salió una avería que llevaba ahí desde el principio**, y la cazó la
sonda nueva: el marcado general agrupa por la CLASE del elemento, así que en
cuanto el alumno encontraba una palabra sus celdas pasaban a `sopa-c hallada`,
formaban un grupo de cuatro —por debajo del tope de 40— y se volvían **cuatro
paradas de tabulador que no llevaban a ninguna parte**. Estaba pasando en las 8
misiones del maestro. Por eso la sopa se saca **por su nombre** (`#sopaGrid`) y
no por el tope.

⚠️ **Y la sonda vieja no abría la sopa.** Buscaba la sección por su nombre
escrito a mano, `s-sopa`, y las 8 del maestro la llaman `sec-sopa`; como `go()`
apaga todas las secciones, dejaba la página **en blanco** y la comprobación
pasaba igual, midiendo otra cosa. Ahora la sección se busca por **dónde vive la
cuadrícula**.

### El tamaño de letra del maestro: una variable, no una cascada

Medido el 9 de septiembre de 2026 con el aula de 43 alumnos sembrada y un
teléfono de 390 px: de los **281 textos que el maestro tiene delante, 171
estaban por debajo de 14 px** y 41 por debajo de 12; el más pequeño, **9**.
Por pantalla: Mi aula 51 % de sus textos bajo 14 px, Plan de Acción 88 %,
Parte Mensual 83 %. Con el zoom del navegador ya desbloqueado tenía una
salida, pero el pellizco en un teléfono de 360 px obliga a deslizar de lado
en cada renglón, y pasar lista son 43 renglones.

**Los dos caminos descartados siguen descartados**, y por eso están escritos:
el `+25 %` en cascada de las misiones rompe la maquetación por 764 px, y
`zoom` sobre el contenedor **desalinea las coordenadas del puntero** y con eso
se lleva por delante el arrastre de la barra de grupos.

Lo que sí funciona: **una variable que multiplica cada `font-size` de
`css/app.css`** (`--metas-fz`), con su botón **Aa** en
`js/letra-maestro.js`. No se compone al anidarse —cada declaración se
multiplica una vez—, no toca una sola coordenada del puntero, y a 1 pinta
exactamente lo de siempre.

**Siete reglas, y ninguna es de adorno:**

1. ⚠️ **A 1 tiene que pintar lo de siempre, y se comprueba elemento por
   elemento.** Son **633 declaraciones** convertidas de golpe: la única forma
   de hacerlo sin cambiarle la pantalla a nadie hoy es medir los 841
   elementos visibles antes y después y exigir los 841 idénticos. Salieron
   idénticos.
2. ⚠️ **El tope es 1,45 y está MEDIDO, no elegido.** A 1,6 los 43 chips de la
   lista de asistencia **recortan el nombre del alumno** (`.ad-chip-nom`,
   21 px de texto en 19 de hueco) y a 1,8 la tabla de Notas SACE **se sale
   del teléfono**. A 1,45 no se sale ni se recorta nada, en las ocho
   pestañas de Mi aula y a 360 px. El día que alguien quiera subirlo,
   primero se arregla el chip de asistencia. Los pasos son 100 · 115 · 130 ·
   145, y **la sonda los lee del aparato**, no los escribe.
3. **No se baja de lo de siempre.** El problema es que la letra es pequeña;
   un paso «más pequeña» solo serviría para que alguien se quede sin poder
   leer la pantalla y sin saber por qué. El botón **cicla y vuelve a
   normal**, que es el mismo gesto del **Aa** de los dieciocho juegos 3D.
4. ⚠️ **Se guarda en SU PROPIA llave** (`METAS_LETRA_V1`), nunca dentro de
   `METAS_ADMIN_V1`: esa llave viaja a la nube y se fusiona dato por dato con
   el otro equipo del maestro. Es la misma razón por la que el chip de grado
   de la alumna vive aparte.
5. ⚠️ **Se aplica en el `<head>`, antes del primer pintado.** Al final del
   body la pantalla abriría pequeña y daría un salto justo cuando el maestro
   ya puso el dedo. Misma razón que `estrella-ganada.js`. Y va en el
   `ARMAZON` de `sw.js`, porque sin señal tiene que aplicarse igual.
6. **El botón va en los encabezados COMPACTOS** —las trece pantallas donde
   el maestro trabaja—, a **44 px** aunque sus vecinos midan 38: hacerlo
   igual de pequeño habría sido copiar el problema, la misma decisión que
   con los chips de grado.

   ⚠️ **En el encabezado de la portada NO cabe, y está medido:** con la
   marca, el hamburguesa, Actualizar y la medalla, sus 124 px de botones
   acaban en el píxel **361 de un teléfono de 360** —la medalla se sale y
   Actualizar deja de poder tocarse—. Además es la pantalla que menos lo
   necesita: su texto está en 15 px, no en 11. Se pone desde cualquier
   pantalla del maestro y vale para toda la aplicación.
7. ⚠️ **La marca de la portada NO escala**, y es la única excepción de la
   hoja (`.brand-logo` y `.brand-sub`). Es la misma razón por la que en la
   lectura proyectada no escalan la franja ni el título: el encabezado mide
   el sitio que deja, y si crece con la letra se muerde la cola. Medido: con
   la marca creciendo, a 1,45 el encabezado pasaba de 82 a **123 px de
   alto** —un sexto de la pantalla del alumno— y los botones se iban 14 px
   fuera del teléfono. Y no se gana nada: el subtítulo son 8,5 px
   decorativos que nadie lee para trabajar.

**Y el papel no crece.** Los informes y las fichas salen de una ventana
aparte que no hereda la variable, y por si acaso `app.css` la fuerza a 1 en
`@media print`: 42 alumnos tienen que seguir dando 42 páginas.

**Lo que esto NO toca son las misiones**, y no es un olvido: cada misión trae
su propio CSS y su propio `body.letra-grande`, que es el ajuste del alumno.
Son dos superficies y dos mecanismos —`app.css` viste la portada, la lista de
Misiones y las pantallas del maestro; el HTML de cada misión se viste solo—.
El día que se unifiquen, se unifican los dos ajustes a la vez o quedará uno
mandando sobre el otro, que es exactamente lo que ya pasó en la lectura
proyectada y costó una normativa entera.

⚠️ **Todo `font-size` nuevo de `app.css` va multiplicado por la variable.**
Es lo que se multiplica al escribir CSS aquí, y la sonda lo cuenta: un
rótulo que se queda en 11 px mientras el resto crece se lee **peor** que
antes, porque ya no tiene con qué compararse. Así se cazaron los dos únicos
que había —los rótulos de los logos en Notas SACE, que traían el tamaño en
el atributo `style` desde `registros-admin.js`—.

**Antes de publicar un cambio del tamaño de letra:**

```
node _dev/servidor-estatico.js         (en otra terminal)
node _dev/verifica-letra-maestro.js
```

Vigila lo que cuesta caro: que la hoja entera pase por la variable (con las
dos excepciones contadas, no escritas), que el aparato vaya en el `<head>` y
en el armazón, que el botón se pueda tocar a 44 px y **no se cuele en la
portada**, que cada paso agrande sin que nada se salga ni se recorte en las
ocho pestañas, que **todos los textos crezcan lo mismo**, que las pantallas
del alumno **no empeoren** respecto a la escala 1, que **el arrastre de la
barra de grupos siga funcionando con la letra en el tope** —que es lo que
descarta volver a intentar `zoom`—, que el papel valga 1, y que el ajuste
aguante cerrar la aplicación **sin tocar los datos del maestro**.

**Antes de publicar un cambio del teclado o del zoom:**

```
node _dev/servidor-estatico.js       (en otra terminal)
node _dev/verifica-teclado.js
```

Lee del archivo **las 184 páginas** para el zoom y **las 74 misiones** para
las dos piezas. Y en el navegador hace lo que de verdad importa: **clasifica
una ficha sin tocar la pantalla** —tabulando de verdad, no llamando a
`focus()`—, comprueba que Enter la selecciona, que la barra espaciadora la
deja en su columna **y no desliza la página**, que el foco **se ve** (midiendo
después de la transición), y que la sopa **no** se haya vuelto 144 paradas —y
que, siendo una sola, se pueda **encontrar una palabra entera sin tocar la
pantalla**, en las dos variantes: la del alumno y la del maestro, que por
dentro no juegan igual—.

## Normativa: la barra de secciones va ARRIBA, y no se va

La barra de pestañas de una misión (`<nav class="nav">`, con sus chips
`.nav-t`) es el único mapa que tiene el alumno: dentro de cada sección
solo hay una flecha hacia adelante, de una en una y en orden. No hay
«atrás», no hay salto, y no hay forma de ver dónde está ni cuánto falta.

Estaba **al final del documento y sin pegar**. Medido en las 74 misiones
con un teléfono de 360×640, antes de tocar nada:

| | |
|---|---|
| misiones donde la barra quedaba **fuera de la primera pantalla** | **74 de 74** |
| dónde empezaba, mediana | **3 156 px = 4,9 pantallas** |
| la peor | **6 180 px = 9,7 pantallas** |
| pestañas | de 11 a 20, en hasta **7 filas** |
| pegajosas | **0** |

⚠️ **Y lo que de verdad costaba no era la distancia: la barra y el
contenido se peleaban.** `go()` termina en `scrollTo({top:0})`, así que el
alumno bajaba 2,2 pantallas hasta la barra, tocaba «Evaluación», la página
saltaba arriba **y la barra pasaba a estar a 7,7 pantallas** —porque
depende del alto de la sección que se esté viendo—. Usarla dos veces
seguidas eran dos viajes completos, y la distancia cambiaba en cada uno.

**La respuesta ya estaba en el repositorio:** las 8 misiones del maestro
tenían la barra justo detrás del encabezado. Eran las 66 del alumno las que
la llevaban al final, porque se copió el archivo 66 veces.

Vive en **dos archivos compartidos** —como el andamio de los juegos 3D y el
aparato de videos, y por la misma razón—: `css/barra-secciones.css` y
`js/barra-secciones.js`, los dos en `STATIC_ASSETS` de `sw.js`. **La misión
no lleva ni una línea de esto**: solo los engancha.

**Seis reglas, y ninguna es de adorno:**

1. **Pegajosa, no solo arriba.** En una sección de catorce pantallas, una
   barra fija arriba del documento se pierde igual en cuanto el alumno
   empieza a trabajar. Es lo contrario del mando del minuto de la lectura,
   que va ABAJO porque ahí están los ojos del que acaba de leer: aquí no
   hay un sitio donde estén los ojos, así que tiene que estar siempre.
2. **UNA fila que se desliza de lado**, no siete. Y **hay que decir que se
   desliza** (las sombras de los extremos): es la regla 8 de los juegos 3D
   —«se podía deslizar desde siempre; lo que faltaba era decirlo»—.
3. **El chip activo se trae a la vista solo**, moviendo `scrollLeft` a
   mano. ⚠️ **Nunca con `scrollIntoView`**: ese arrastra también la página
   y le movería de debajo del dedo lo que está leyendo.
4. **No se toca `go()`.** Vive copiada en las 74 misiones. El JS compartido
   escucha los cambios de clase de la barra con un `MutationObserver`, así
   que sirve igual si el cambio vino de la pestaña, de la flecha del final
   de una sección o de `abrirSeccionDelEnlace()` al volver de un juego 3D.
5. **44 px de blanco de toque**, la misma regla de los juegos 3D: aquí
   equivocarse de pestaña es perder el sitio en una misión de catorce
   pantallas.
6. ⚠️ **El `<link>` va DESPUÉS del CSS de la misión.** De ahí saca su color
   (`--nav-bg`, `--pri`), y así sobrescribe el `position:static` de la
   misión **por orden y sin un solo `!important`**. Si se colara antes, la
   barra volvería al fondo sin dar un solo error. La sonda lo mira.
7. ⚠️ **La barra tiene que ser OPACA, y ocho no lo eran.** Las 8 misiones
   del maestro traen el `<nav>` sin fondo: quieto al final del documento no
   se notaba, pegado arriba se vería el contenido pasar por debajo. El JS
   les mide el de la página y lo pone en el marco, y **solo a esas**: las 66
   del alumno traen el suyo en `--nav-bg` y su modo oscuro lo cambia solo.

   ⚠️ Y se mide **una vez al montar, nunca al cambiar de tema**: `.nav`
   lleva un `transition: background .3s`, así que leer el color en el
   instante del cambio devuelve el VIEJO. Eso ya dio una falsa costura y
   una corrección que no hacía falta.

**Y no es solo deslizar:** la barra es `role="tablist"` y las secciones son
`role="tabpanel"`. Estando al final, el tablist se anunciaba **después** de
los veinte paneles: quien usa un lector de pantalla oía la misión entera
antes de enterarse de que había pestañas.

### Cómo se pone en una misión nueva

Dos líneas, y ninguna toca el aparato:

```html
<link rel="stylesheet" href="../../css/barra-secciones.css">   <!-- tras el CSS de la misión -->
<script src="../../js/barra-secciones.js"></script>            <!-- al final del body -->
```

**Lo que NO se hizo, y a propósito:** agrupar las 19 pestañas en cuatro
(Aprende · Practica · Juega · Evalúa). Eso es cambiarle el nombre a lo que
el maestro ya dice en voz alta en el aula —«abran Predice»— y es contenido
misión por misión, no CSS. Con una fila que se desliza y el chip activo
traído a la vista, navegar ya funciona sin tocar el contenido de ninguna.

**Antes de publicar un cambio de la barra:**

```
node _dev/servidor-estatico.js            (en otra terminal)
node _dev/verifica-barra-secciones.js
```

Lee del archivo **las 74** —abrirlas con Playwright cuesta siete minutos y
una comprobación así no la corre nadie— para lo que se multiplica al copiar
una misión: que estén las dos piezas y que el CSS vaya en su sitio. Y abre
tres a propósito distintas (la del hallazgo, la más larga y una con videos
montados) más la pantalla del maestro, para lo que solo se ve abriéndolas:
que la barra se vea al abrir sin deslizar, que aguante con la sección a
medio leer, que **cambiar de sección no obligue a volver a buscarla** —que
era el bucle roto—, que se pueda hacer dos veces seguidas, que el chip
activo se vea y **se pueda tocar** (el guardián de siempre: ¿hay algo
encima?), y que vaya ANTES de las secciones en el documento.

## Normativa: los juegos 3D viven aparte, y no tocan la misión

Hay **dieciocho** juegos en tres dimensiones —hoy: seis por misión y tres
misiones con parque, y siguen entrando—, cada uno en su propio archivo
HTML al lado de su misión.

**Ya NO son autocontenidos, y eso fue a propósito.** Lo eran, y salió
caro: el andamio —el cargador de Three.js, el telón, los velos,
`alTocar`, `vigilarHueco`, `ajustarVelos` y unas 130 líneas de CSS—
estaba COPIADO doce veces, cerca de un tercio de cada archivo. Cuando el
lienzo se sentó encima de los botones de responder hubo que arreglarlo
en doce sitios; el `touch-action`, en siete; el centrado de los paneles,
en doce. Y una de las doce copias se quedó sin el
`width/height:100%!important` del lienzo sin que nadie lo notara. Con
veinte misiones más, eso no se sostiene.

El andamio vive en **dos archivos**, y todos los juegos los cargan:

```html
<link rel="stylesheet" href="../../css/parque-3d.css">
<script src="../../js/3d/parque-3d.js"></script>
```

| dónde | qué hay |
|---|---|
| `css/parque-3d.css` | la franja de arriba, el hueco del dibujo, los mandos, los velos, el panel que se aprieta, y la capa del festejo (confeti, racha, avisos) |
| `js/3d/parque-3d.js` | `Parque3D.arrancar`, `.cargar3D`, `.quitarCarga`, `.alTocar`, `.vigilarHueco`, `.ajustarVelos`, `.respiro`, `.cerrar`, `.acierto`, `.fallo`, `.festejarFin`, `.confeti`, `.aviso`, `.giroConElDedo`, `.tirar` |
| el HTML del juego | su color de misión (los tokens `--acento…`), sus propias reglas, su lógica y sus cuentas |

Los dos archivos van en **`STATIC_ASSETS` de `sw.js`**: sin ellos los
juegos dejan de funcionar sin internet, y esa promesa está escrita en su
propia pantalla.

**El andamio hace SOLO, sin que el juego lo pida**, y un juego nuevo no
lo tiene que copiar ni llamar:

- Monta **Aa** (la letra crece; se guarda UNA vez para los dieciocho en
  `j3d_letra_v1`, como el retoque del proyector de las lecturas: es un
  AJUSTE compartido, no el avance de un juego, que sigue siendo de cada
  llave) y **⛶ pantalla completa** (si el navegador no sabe, el botón ni
  aparece) en la franja de arriba.
- **Re-ata todo `<button onclick=…>` al toque Y al clic** (`atarOnclicks`):
  la regla 7 estaba cumplida solo en los botones de responder y catorce
  juegos tenían «Empezar» y «Siguiente» con el onclick pelado.
- **Aplica el respiro él mismo** cuando un velo se abre (respira su
  panel) o se cierra (respira la franja de mandos): la regla 10 se
  olvidaba en casi todos los juegos, que es la misma lección de
  `ajustarVelos`.

Lo que el juego SÍ llama, cuando pasa lo suyo: **`Parque3D.acierto()`**
al acertar (confeti + racha 🔥 compartida + vibración corta — sin
sonido, A PROPÓSITO: cuarenta teléfonos pitando en un aula no ayudan a
nadie), **`.fallo()`** al fallar (la racha vuelve a cero, sin castigo
que suene feo), **`.festejarFin()`** en la medalla grande,
**`.giroConElDedo(alGirar, alToque)`** para arrastrar/tocar el dibujo
(captura el puntero —el ratón soltado fuera ya no deja la figura pegada
al cursor—, distingue arrastre de toque midiendo LOS DOS ejes, ignora
toques sobre chapas que floten encima, y un dedo por vez), y
**`.tirar(obj)`** al vaciar grupos 3D (dispone geometrías y materiales:
`remove()` solo los saca del árbol y la memoria de la tarjeta se iba
comiendo en las sesiones largas). Los juegos con racha PROPIA (el
Relámpago, Cerco o Pintura) no llaman a `acierto()` —dos rachas en
pantalla confunden—: usan `confeti()` y `aviso()` sueltos.

`touch-action:none` del `#lienzo` también vive en el CSS común: la
sonda lo exige en cuanto un juego escucha `pointermove`, y ahora que el
arrastre es del andamio, su regla también.

Dos cosas siguen ESCRITAS en el HTML de cada juego y no se mueven: el
telón `#velo-carga` y la pantalla `#velo-red` de «hace falta internet la
primera vez». Tienen que estar pintadas antes de que corra una sola
línea de JavaScript; un telón que aparece cuando el JS ya arrancó llega
tarde justo el rato en que hace falta. Lo que el andamio maneja es su
comportamiento, no su marcado.

En **Volumen de Cuerpos** (`misiones/2ciclo-volumen-cuerpos/`):

| archivo | qué enseña |
|---|---|
| `juego-constructor-cubitos-3d.html` | cubo y prisma: V = l × a × h |
| `juego-fabrica-latas-3d.html` | cilindro: V = 3.14 × r² × h |
| `juego-desafio-tanque-3d.html` | capacidad: 1 m³ = 1 000 litros |
| `juego-laberinto-unidades-3d.html` | la escalera cúbica, de mil en mil |
| `juego-duelo-dimensiones-3d.html` | área (2 medidas) o volumen (3) |
| `juego-tetris-volumen-3d.html` | sumar volúmenes y empacar |

En **Sólidos Geométricos** (`misiones/2ciclo-solidos-geometricos/`):

| archivo | qué enseña |
|---|---|
| `juego-contador-partes-3d.html` | caras, aristas y vértices · Euler |
| `juego-armador-patrones-3d.html` | el patrón se dobla y cierra (o no) |
| `juego-revolucion-3d.html` | cuerpos de revolución |
| `juego-fabrica-solidos-3d.html` | prisma o pirámide · el apellido de la base |
| `juego-caza-solidos-3d.html` | reconocerlos fuera del libro |
| `juego-relampago-solidos-3d.html` | clasificar rápido, contrarreloj |

En **Perímetro y Área de Cuadriláteros**
(`misiones/2ciclo-perimetro-cuadrilateros/`), que hasta entonces no tenía
ni un juego que tocar:

| archivo | qué enseña |
|---|---|
| `juego-cercador-3d.html` | perímetro: la orilla, en metros |
| `juego-pintor-canchas-3d.html` | área: la superficie, en metros cuadrados |
| `juego-cerco-o-pintura-3d.html` | decidir QUÉ se mide y en qué unidad |
| `juego-terreno-grande-3d.html` | mismo perímetro, distinta área |
| `juego-cuarto-en-l-3d.html` | figuras compuestas: descomponer y sumar |
| `juego-fabrica-cuadrilateros-3d.html` | las cuatro fórmulas, en vivo |

El temario sale del **DCNB, Quinto Grado, Bloque 3 (Medidas)**, página
395 de `dcneb-basica-ii-ciclo.pdf`: concepto de área, fórmulas del
cuadrado, rectángulo, rombo, romboide y trapecio, «exploran figuras
equivalentes en cuanto a su área (composición y descomposición de
figuras)» y —con esas palabras— «construyen diversos cuadrados y
rectángulos, conociendo el perímetro».

**Los dos que más valen son el tercero y el cuarto.** El tercero es la
confusión clásica —perímetro o área— y por eso la decisión va ANTES de
la cuenta: en el examen el alumno no se equivoca multiplicando, se
equivoca eligiendo qué calcular y después multiplica perfectamente lo
que no era. Y el cuarto **en papel no se puede hacer**: con 24 m de
malla se pueden cercar un 11 × 1, un 8 × 4 o un 6 × 6, y adentro caben
11, 32 o 36 m²; en el cuaderno son tres cuentas sueltas que nadie
compara, y aquí es el mismo cerco cambiando de forma con los mismos
postes mientras el suelo de adentro crece.

**Los dos juegos de sólidos que no se pueden hacer en papel son los que
más valen**, y por eso están: doblar un patrón necesita cartulina,
tijeras y media hora —con 43 alumnos eso se hace una vez al año, si se
hace—, y girar el sólido para contar las caras de atrás no lo permite
ningún dibujo. El resto de la misión ya se puede hacer en el cuaderno.

Se abren **en otra pestaña** desde el Parque de Juegos 3D de la misión y
desde el widget de su mismo tema. Que estén aparte no es desorden: cada
uno carga Three.js y su propio bucle de dibujo, y meterlos dentro de la
misión le pondría ese peso encima al alumno que solo va a hacer el quiz.

**Diez reglas, y ninguna es de adorno.** Las que llevan 🏗️ **ya no se
copian**: viven en el andamio y las heredan todos los juegos, los de hoy
y los que vengan detrás. Tocarlas ahí las toca en todos a la vez, que es
exactamente para lo que se sacó.

1. **El π es 3.14**, el del libro de sexto, igual que en el resto de la
   misión. Si la pantalla calcula con el π largo y el alumno con 3.14,
   los números no coinciden y él cree que se equivocó. La sonda falla si
   `Math.PI` aparece en una cuenta que ve el alumno (girar la cámara sí
   puede usarlo: eso no lo ve nadie).
2. **Cada juego guarda su avance en SU llave**, todas con el prefijo
   `j3d_` (`j3d_cubitos_v1`, `j3d_latas_v1`, `j3d_tanque_v1`,
   `j3d_laberinto_v1`, `j3d_duelo_v1`, `j3d_tetris_v1`,
   `j3d_contador_v1`, `j3d_patrones_v1`, `j3d_revolucion_v1`,
   `j3d_fabsolidos_v1`, `j3d_caza_v1`, `j3d_relampago_v1`), y **no
   escribe en la de su misión**. La misión guarda su estado entero de un
   golpe: un juego abierto en otra pestaña le borraría al alumno el XP
   que acaba de ganar. La misión solo **lee** esas llaves, para pintar
   la medalla de cada tarjeta.
3. 🏗️ **Three.js se baja del CDN (r128), pero primero se mira si ya está
   puesto** (`if (window.THREE) return listo()`). Eso es lo que permite
   probarlos sin internet —la sonda le pone un Three.js de mentira— y lo
   que dejaría guardar mañana una copia dentro del sitio **cambiando una
   línea**, no doce. Está en `Parque3D.cargar3D`, con su plazo de 20 s
   para rendirse: la señal mala no siempre falla, muchas veces se queda
   colgada y no contesta nunca.
4. **Sin red, la pantalla lo DICE.** Un juego que se queda negro parece
   roto y no se vuelve a abrir. El aviso promete que abriéndolo una vez
   con señal después funciona sin ella, y eso **lo cumple `sw.js`**: la
   rama de recursos externos ahora GUARDA lo que baja, que antes solo
   leía de la caché. Si se toca esa rama, se rompe la promesa.
5. 🏗️ ⚠️ **Y con señal MALA, tampoco se puede tocar nada hasta que el
   motor llegue.** Todos llevan un telón (`#velo-carga`, z-index 30)
   —escrito en su HTML, que tiene que estar pintado antes de que corra
   un solo JavaScript— que **`Parque3D.arrancar` levanta** cuando el
   motor llega o cuando se sabe que no va a llegar, nunca antes. Sin él, el
   alumno impaciente toca «Empezar» mientras Three.js viene bajando, el
   juego revienta por dentro —`armar()` sin escena— y se queda en una
   pantalla muerta: ni pregunta, ni botones, ni aviso. Con buena señal
   no se nota nunca; con la señal del aula, pasa siempre. **Se escapó a
   producción en los doce juegos** porque la sonda inyectaba Three.js ya
   puesto y esa carrera no existía; ahora la sonda retrasa el CDN a
   propósito y toca todo lo que hay durante la espera.
6. **La vuelta cae en el Parque de Juegos 3D** (`#s-juegos3d`), no al
   principio de la misión: el que sale de un juego va a abrir otro, y
   buscar el Parque entre dieciocho pestañas —que en un teléfono se
   deslizan— es donde se abandona. Lo hace `abrirSeccionDelEnlace()` en
   cada misión, que lee `location.hash`.
7. 🏗️ **Se juega con el dedo, y eso trae tres reglas de CSS que no son
   de adorno.** Nada de `draggable` ni de teclas como único mando:
   cruceta en pantalla en los que hace falta, y en el constructor el
   mismo dedo gira la vista (si arrastra) o pone un cubito (si no). Y:
   - **`touch-action: none` va en `#lienzo`, NUNCA en el `body`.** Ahí
     hace falta, para arrastrar y girar sin que la página se deslice;
     en el body se lleva por delante el toque de toda la página.
   - **Los botones de responder se atan al toque Y al clic**
     (`alTocar`), y el primero que llegue se queda con la jugada. Un
     navegador de tableta que no sintetice el clic dejaría al alumno
     con la pregunta en pantalla y sin poder contestarla.
   - **Los velos van `position: fixed`, no `absolute`.** En un teléfono
     la barra de direcciones aparece y desaparece; con `absolute` el
     panel del resultado se ancla al documento y puede quedar medio
     fuera justo cuando hay que leerlo.
8. 🏗️ **La pantalla corta también es una pantalla.** El teléfono acostado
   y —sobre todo— **la letra del sistema agrandada**, que es una opción
   de accesibilidad y la usa quien no ve bien, dejaban botones fuera
   del mundo: los paneles se cortaban por arriba sin poder recuperarse
   (centrar con `align-items:center` y desplazar con `overflow-y:auto`
   es una trampa: el desplazamiento no llega a negativos, y por eso el
   panel se centra con `margin:auto`), y las filas de botones se salían
   por la DERECHA, donde no hay desplazamiento que valga. Las reglas:
   toda fila de botones **baja de línea** (`flex-wrap`), los mandos se
   desplazan por dentro antes que salirse (`max-height:72vh`), y por
   debajo de 430 px de alto el panel **se aprieta para que quepa** —se
   recorta el aire, no el texto que hay que leer—. Y ningún blanco de
   toque baja de **44 px**: es lo que un dedo acierta sin mirar. Y
   cuando aun así no cabe, **el juego lo dice**: `ajustarVelos()` mira
   diez veces por segundo si el panel entra en la ventana, lo aprieta
   si no (`.velo.apretado`) y, si sigue sin caber, enciende un
   «▼ desliza para ver el botón» (`.velo.desliza`). Se podía deslizar
   desde siempre; lo que faltaba era decirlo.
10. 🏗️ **Después de cambiar de pantalla, un respiro antes de aceptar
   toques** (`Parque3D.respiro`). En varios juegos lo nuevo sale en los MISMOS píxeles que
   lo viejo —las respuestas donde estaban los ataques, la pregunta
   siguiente donde estaba la anterior, el cuarto donde estaba el botón
   de seguir—, y el segundo toque de un dedo impaciente contestaba algo
   que el alumno no había visto: le rompía la racha, le quitaba
   segundos o le cazaba un objeto equivocado. Son 330-400 ms en los que
   no se acepta nada **y se ve apagado**, que es la otra mitad: un
   botón encendido que no contesta es un teléfono que el niño da por
   trabado.
9. 🏗️ ⚠️ **El lienzo 3D no puede salirse de su hueco, y esto es lo que
   más caro costó.** Three.js escribe el tamaño del lienzo en el `style` EN
   LÍNEA del `<canvas>`, y ese style **gana sobre el CSS**. El reparto
   de la pantalla cambia solo —al aparecer las opciones, la franja de
   abajo crece y el hueco del dibujo encoge—, sin que la ventana se
   mueva un píxel, así que `resize` no salta. El lienzo se quedaba con
   el alto viejo, se salía **133 px por debajo** y, como `#lienzo` está
   posicionado y la franja no lo estaba, quedaba ENCIMA de los botones
   de responder: se veían perfectos y el dedo no los tocaba nunca. Un
   maestro se quedó con la pregunta en pantalla y sin forma de
   contestarla. Van cuatro cierres, y los cuatro se quedan:
   `Parque3D.vigilarHueco(ajustar)` (un `ResizeObserver` sobre
   `#lienzo` que rehace el tamaño —este solo ya lo arregla, y además
   mantiene la proporción de la cámara), `overflow:hidden` en `#lienzo`,
   `width/height:100% !important` en su `canvas` y
   `position:relative;z-index:2` en la franja de mandos.

   Y una trampa que sacó a la luz el andamio: la regla del `canvas` va
   con **`#lienzo > canvas:not([id])`**. Un juego puede meter dentro del
   hueco un lienzo suyo —el minimapa de 112 px del Laberinto de las
   Unidades—, y ese no puede estirarse a pantalla completa: taparía el
   dibujo entero. El lienzo que crea Three.js nunca lleva `id`; el que
   pinta el juego lo lleva siempre, porque lo busca desde su
   JavaScript. Esa es la señal que los separa.

Y una que es de contenido: **las respuestas equivocadas que se le
ofrecen al alumno son el error de verdad**, no números al azar. Al cubo
se le ofrece el área de una cara y su superficie; a la conversión, el
÷10 y el ÷100 de las unidades lineales. Un distractor absurdo se
descarta sin pensar y no enseña nada.

**Antes de publicar un cambio de los juegos 3D:**

```
node _dev/servidor-estatico.js             (en otra terminal)
node _dev/verifica-juegos-3d.js            → los seis del volumen
node _dev/verifica-juegos-3d-solidos.js    → los seis de los sólidos
node _dev/verifica-juegos-3d-perimetro.js  → los seis de perímetro y área
```

Las sondas comparten el Three.js de mentira
(`_dev/three-de-mentira.js`): si un juego nuevo usa una pieza que ese
archivo no tiene, se le añade **ahí**, y no se copia el archivo.

Y comparten también **los guardianes** (`_dev/lib-sonda-3d.js`): el
andamio leído del archivo, que lo que se ve se pueda tocar, la pantalla
corta, la señal mala, el toque con el ratón, el CDN colgado y el sin
internet. Estaban copiados en dos archivos de mil líneas, y ahí se vio
lo que cuesta: la lista de piezas de Three.js permitidas se había
separado —una tenía `LatheGeometry` y la otra no—, así que un juego del
volumen que la usara habría fallado y el mismo juego en sólidos, no. Con
esto, la sonda de un parque nuevo son veinte líneas:

```js
const lib = require('./lib-sonda-3d');
const M = lib.marcador();
const G = lib.parque({ raiz:RAIZ, dir:DIR, base:BASE, juegos:JUEGOS,
                       toques:TOQUES, vuelta:'perimetro-cuadrilateros.html',
                       ok:M.ok });
G.revisarAndamio();          // el archivo, antes de abrirlo
…lo suyo, con G.abrir(nav, juego, true)…
await G.guardianes(nav);     // los seis de siempre
M.resumen();
```

Cada sonda vigila las cuentas de sus juegos, una por una. En el volumen: los volúmenes, las
áreas, los litros de los seis tanques y sesenta conversiones; que el
laberinto **siempre tenga salida** y las puertas estén en el camino; que
los cuatro pedidos de la fábrica **se puedan clavar** dentro del 1 % con
los mandos que hay. En los sólidos: que las caras, aristas y vértices
cuadren con **la tabla del Bloque 5** de la misión y con Euler, de 3 a
10 lados; que los seis patrones tengan las caras que dicen y que el de
los seis en fila siga marcado como que **no cierra**; y las dos trampas
del tema, que son las que hay que defender a muerte —**el cono no cuenta
como pirámide** ni como poliedro, y **el prisma triangular no pasa por
pirámide cuadrangular** aunque los dos tengan 5 caras: lo que los separa
son los vértices—.

En perímetro y área: que el perímetro sea la suma de los lados y el área
cuadre con la figura —las dos se calculan aparte en la sonda, a partir de
las esquinas del terreno, así que coincidir significa que los dos
hicieron bien la misma cuenta—; que el DISTRACTOR sea el error de verdad
y se llame por su nombre (comprar el área de malla, o el perímetro de
baldosas); que haya un piso donde **el perímetro es MAYOR que el área**,
porque sin ese caso el alumno aprende una regla falsa que le funciona
hasta el examen; que en el romboide y el trapecio **la altura no sea
ninguno de sus lados**, que es la trampa del tema; que en «el terreno más
grande» la malla NO cambie al probar formas y gane de verdad el cuadrado
—o, cuando el cuadrado exacto no cabe con lados enteros, el que más se le
parece—; que las dos formas de partir el cuarto en L den lo mismo y la
tercera de verdad NO valga; y que los seis pedidos de la fábrica **se
puedan cumplir** con los mandos que hay.

Todas comprueban además **que lo que se ve se pueda tocar**: recorren
el juego con medidas de teléfono (393×873 y 360×640) y en cada momento
preguntan, control por control, si el elemento que recibiría el toque es
ese control o hay algo encima —saltándose los velos abiertos, que tapan
a propósito—. Es el guardián de la avería del lienzo, y delata al
culpable por su nombre: `{"txt":"Cono","tapa":"CANVAS"}`. Y hay un matiz
que costó una falsa alarma: un mando que se salió de SU PROPIA franja —la
de mandos se desplaza por dentro con la letra del sistema grande— no es
un botón tapado, sino un botón al que se llega deslizando. Por eso el
guardián desliza y vuelve a preguntar antes de acusar; la avería de
verdad no se escapa, porque un lienzo derramado sigue encima después de
deslizar. Comprueban
también **la señal mala** —que el telón tape mientras baja el motor, que
no quede ni un botón alcanzable por debajo y que el juego llegue
entero— y **tocan los botones con el ratón, no llamando a la función**:
así se ve el botón tapado o desplazado, que llamando por dentro pasa.

⚠️ **El Three.js de mentira tiene que MENTIR POCO.** Su `setSize` estaba
vacío, y por eso la avería del lienzo fue invisible para la sonda y se
fue a producción dos veces: sin ese `style` en línea, el lienzo nunca se
salía en la prueba. Ahora hace lo mismo que el de verdad. Cuando se le
añada una pieza nueva, que se parezca al original en lo que TOCA AL
DOM, no solo en que no reviente. Comprueban también que sin internet el juego avise, que
solo se usen piezas de Three.js que existen en r128 —un nombre mal escrito no da
la cara hasta que el juego se abre delante del niño— y la misión: que la
pestaña esté, que las seis tarjetas enlacen y que los juegos **no hayan
escrito** en el progreso de la misión.

Lo que la sonda **no** puede mirar es el dibujo en 3D: pone un Three.js
de mentira para poder correr sin tarjeta gráfica ni internet. Que la
pantalla se vea bien hay que mirarlo con los ojos, una vez, en el
teléfono —que es como se prueba todo aquí—.

## Normativa: el Buzón del lector recoge, no publica

`buzon.html` es una página **pública y autónoma** de M.E.T.A.S, pero lo que
recoge **no es de M.E.T.A.S**: cae en la herramienta de Redacción de la
revista quincenal, que vive en otro proyecto y detrás de una puerta con
contraseña. Esa rareza no es un descuido, es la única forma de que
funcione: una aplicación privada no puede recibir visitas de la calle.

Un lector cualquiera manda **una nota, una opinión, una denuncia, una
sugerencia**, o pide que le **cubran un evento de su escuela** en la
sección Aulas en acción. Con una o dos fotos. El enlace va impreso en la
revista como **código QR** y suelto en grupos de WhatsApp.

Y hay una sexta puerta que **no es material de revista**: 🎓 quien quiere
saber más de **M.E.T.A.S** o necesita ayuda con ella. La revista
promociona la plataforma en sus páginas, y sin esta puerta el maestro que
se interesaba no tenía dónde tocar. Va por el mismo sitio pero con su
propio camino: sin título, sin las condiciones de lo que se publica —solo
permiso para contactarle—, y en la bandeja no se convierte en nota, se le
responde.

Se parece a la Convocatoria y **no es lo mismo**: la convocatoria PREGUNTA
por un evento concreto y muere con él; el buzón RECOGE, siempre, y lo que
llega tiene una persona detrás esperando una llamada.

**Cinco reglas, y ninguna es de adorno:**

1. **La página no nombra a la revista.** Se pidió expreso: el enlace
   circula solo por grupos de gente que no tiene por qué saber de quién
   es. `_dev/verifica-buzon.js` lo comprueba en el código fuente y en las
   cinco pantallas ya pintadas.
2. **El enlace no lleva código y no caduca.** La convocatoria sí lo lleva
   (`?c=R4TP`), porque pregunta por una salida y se acaba. Este va
   **impreso en papel**, y el papel se guarda: el número del año pasado
   seguiría en una gaveta con un QR que ya no lleva a ninguna parte. La
   dirección es una sola y para siempre.
3. **Nombre y teléfono, siempre.** No es burocracia: es lo que separa una
   nota de un anónimo. El teléfono **no se publica nunca** y sirve para
   llamar y confirmar. Sin nombre, sin teléfono o sin aceptar los
   requisitos, el envío no sale de la pantalla **ni entra en el servidor**:
   las dos puertas lo comprueban.
4. **Lo escrito no se pierde.** Si falla el internet queda guardado en el
   teléfono, se reintenta al volver a abrir el buzón y se ofrece por
   WhatsApp ya escrito. Un lector que cree que mandó su denuncia y no la
   mandó es una denuncia que nadie va a echar de menos, porque nadie sabe
   que existió.
5. **Se puede corregir, y se puede retirar.** Con su folio y su teléfono
   el lector recupera lo que mandó y lo cambia **sobre la misma fila**:
   mismo folio, un solo envío en la bandeja. Mandarlo de nuevo no sirve
   —la huella lleva dentro el principio del texto, así que al cambiar la
   primera línea entra como envío nuevo y quedan dos casi iguales.

   Solo mientras esté sin atender. En cuanto la redacción lo convierte en
   nota ya lo leyó, llamó y lo comprobó: si el texto pudiera cambiar por
   debajo, **lo verificado y lo impreso dejarían de ser lo mismo**. Esa
   puerta la cierra el servidor, no la pantalla.

   Y borra lo suyo sin pedirle permiso a nadie. Una denuncia da miedo al día
   siguiente, y esa puerta tiene que existir de verdad, no en un párrafo
   de buenas intenciones. Ahí no hay papelera **a propósito**: una
   papelera es justo lo que él está pidiendo que no exista.

**Los requisitos de ética se firman con su versión** (`ETICA_VERSION`, hoy
`2026-08`). Si mañana cambian, la fila sigue diciendo cuáles aceptó **ese**
lector: un reclamo dentro de un año se resuelve mirando el dato y no la
memoria de alguien. Si se cambia el texto de los requisitos, **se sube la
versión**.

Las fotos se **achican en el teléfono** antes de mandarse (1600 px, y
bajando hasta entrar en el tope). Una foto de cámara moderna pesa cinco
megas y por el internet de un pueblo no sube nunca: el lector ve la rueda
girar y se va. El tope lo hace cumplir **también el servidor**, porque la
pantalla la escribe cualquiera.

**Antes de publicar un cambio del buzón:**

```
node _dev/servidor-estatico.js      (en otra terminal)
node _dev/verifica-buzon.js
```

Vigila lo que cuesta caro: que no se cuele el nombre de la revista, que no
entre un anónimo, que con fotos se declare el permiso, que mandar dos veces
CORRIJA en vez de duplicar, y que lo escrito no se pierda. La nube no se
toca: se pone un Supabase de mentira con `page.route`.

La otra mitad —la bandeja donde cae todo esto, el QR y el paso de envío a
nota— vive en el repositorio de la revista, con su propia sonda.

## Normativa: los videos de una misión los pone F.A.R.O, no el alumno

**Pedido por el autor el 28 de agosto de 2026**, estrenado en «Las
Fracciones» (`misiones/2y3ciclo-fracciones/`) y llevado ese mismo día a
**Matemáticas entera**: las veinte misiones de la materia tienen su
pestaña 🎬. Van detrás las demás materias. Por eso vive en
`js/videos-mision.js` y `css/videos-mision.css`, y **no dentro de la
misión**: es el mismo permiso que ya tiene el andamio de los juegos 3D, y
por la misma razón. Un aparato copiado a todas las misiones se arregla en
una y se queda roto en las demás — y con veinte montajes ya puestos eso
dejó de ser una advertencia y pasó a ser aritmética.

Y el número no se escribe en el código: la sonda **cuenta** cuántas lo
montan leyendo las misiones, así que la materia siguiente entra sin tocar
esta cuenta ni la de nadie.

Qué resuelve: el alumno que no entendió el texto quiere que se lo
expliquen. En un aula sin proyector y con tres teléfonos, «búscalo en
YouTube» es mandarlo a una pantalla donde lo que sale después no lo
eligió nadie.

**Los videos los pone el administrador desde F.A.R.O.** Es el espejo de
las Sugerencias: allí la pantalla pública está aquí y lo recogido cae en
la aplicación privada; aquí se escribe allá y se lee en la pantalla del
alumno. El otro extremo del cable es `js/tools/metas-videos.js` en el
repositorio de F.A.R.O y la tabla `supabase/sql/metas_videos.sql`.

**Y el alumno no puede agregar videos, pero eso NO lo decide esta
pantalla.** Una comprobación en el navegador se salta con la consola en
diez segundos. Lo que lo sostiene es que con la clave publicable que va
en este repositorio **no existe una puerta de escritura**: lo único que
se puede llamar es una función que lee lo publicado.

### Las tres capas, y por qué son tres

| capa | qué aporta | dónde |
|---|---|---|
| catálogo | permanente, versionado, funciona sin nube y **sin haber corrido el SQL** | `js/data/videos-misiones.js` |
| nube | se añade un video desde la tableta y aparece sin desplegar | tabla `metas_videos`, en F.A.R.O |
| lo guardado | la lista se ve sin señal (los videos, no) | `localStorage` |

Manda la nube cuando coinciden en `id`, y una **lápida** de la nube
quita un video escrito en el catálogo —sin eso, un video retirado desde
F.A.R.O seguiría en pantalla—. Y **la sección dice siempre de dónde
salió lo que enseña**: si la nube no contestó, el maestro tiene que
poder saber que está viendo lo que traía la misión y no creer que nadie
ha puesto nada.

### Nueve reglas, y ninguna es de adorno

1. ⚠️ **En `yt` van ONCE caracteres, nunca una dirección.** Ese dato
   acaba dentro del `src` de un `<iframe>`, que es el peor sitio del
   HTML donde puede acabar algo escrito por una persona: una comilla
   cierra el atributo y lo que siga se convierte en un atributo de
   verdad. En vez de escapar mejor, se le quita al dato la capacidad de
   hacer daño: en `[A-Za-z0-9_-]` no hay comillas, ni espacios, ni dos
   puntos, ni barras, así que **`javascript:` no se puede ni escribir**.
   Lo comprueban `vmId()` aquí y el `check` de la columna allá; las dos
   hacen falta, porque la pantalla no puede fiarse de la base y la base
   no puede fiarse de la pantalla.
2. **Hay fachada: hasta que el alumno no toca ▶ no sale UNA SOLA
   petición hacia YouTube.** Seis videos serían seis reproductores y
   varios megas en la conexión de un pueblo, por una sección que a lo
   mejor nadie abre.
3. **Al terminar el video cae una tapa nuestra.** Es lo que cumple «que
   no salga de la misión»: al acabar, YouTube pinta su parrilla de
   sugerencias con «Ver en YouTube», y por ahí se va el niño. La tapa
   **no ofrece salir a YouTube**.
4. ⚠️ **UN VIDEO A LA VEZ.** Pedido por el autor el 28 de agosto de
   2026: «cuando uno se esté reproduciendo que otro no se pueda
   reproducir». Dos videos abiertos son **dos audios sonando**, y en un
   aula con tres teléfonos prestados eso pasa el primer día: el niño
   toca el segundo sin parar el primero y ya no se entiende ninguno.

   Se resuelve **cerrando el anterior**, no trabando el nuevo
   (`cerrarOtros`). Trabarlo obligaría a encontrar antes cómo parar el
   que suena —un paso más y un botón más— y ese es justo el punto donde
   el alumno se sale de la sección. Cerrar no le quita nada: el video
   cerrado **vuelve a su miniatura** y su quiz sigue en la tarjeta, a la
   vista. Y no basta con pausar por la API: se quita el `<iframe>` del
   documento, que es lo único que apaga el sonido cuando la API no
   llegó.

   La excepción es la tarjeta que tiene el **quiz abierto**: ahí el video
   ya está parado y en pantalla hay respuestas recién marcadas. Esa solo
   se calla, no se cierra.
5. **Si la API de YouTube no llega, NO se tapa nada.** El video puede
   estar viéndose perfectamente; taparlo sería el peor fallo posible.
   Solo queda una tira pequeña debajo por si no se ve. Se pierde la
   tapa del final, y eso se acepta a cambio de no romper lo que
   funciona.
6. **Cuando el video no se puede ver, la pantalla lo DICE**, con el
   motivo de verdad (el dueño no lo deja incrustar, el video ya no
   existe, la red lo bloquea). Un cuadro negro y mudo parece la
   aplicación rota, y una aplicación que parece rota no se vuelve a
   abrir. Es la misma regla de los juegos 3D. Y **solo ahí** aparece la
   salida a YouTube: ofrecerla siempre sería poner la puerta de salida
   al lado del video.
7. **Los anuncios NO se pueden quitar, y no se finge.** No existe un
   parámetro de YouTube que lo haga y `youtube-nocookie.com` corta el
   rastreo, no la publicidad. Lo que se hace es recortar el video
   (`ini`/`fin`), elegir canales que no monetizan, y avisar de **Brave**,
   que es un **navegador** —no un buscador— que sí los bloquea.

   ⚠️ **El aviso se dice UNA VEZ y ARRIBA de la sección.** Estuvo debajo
   de cada video y el autor lo pidió quitar el 28 de agosto de 2026
   mirando su teléfono: con seis videos, el mismo párrafo de tres
   renglones salía seis veces, alargaba la sección justo donde hay que
   barrer para encontrar el video que se busca, y un aviso repetido seis
   veces no se lee seis veces —se deja de leer la primera—. Sigue
   **siempre a la vista y nunca escondido en un menú**, que es la razón
   por la que existe: quien instala el navegador es el maestro o la
   familia, y solo se acuerdan de mirarlo el día que sale un anuncio.
   Tampoco se repite dentro del panel de «no se pudo ver aquí»: está
   arriba, en esa misma pantalla.
8. **Ver un video no da XP ni marca la sección como hecha.** Nadie puede
   comprobar que el niño lo miró, y un puntaje que se consigue dándole
   al play y yéndose es un puntaje regalado. Sí queda apuntado en la
   Evidencia del maestro: un video abierto le dice que el tema no se
   entendió con el texto.
9. **La clave del catálogo es de cada misión.** Al copiar el bloque a
   otra misión se hereda, y dos misiones acabarían compartiendo videos.
   Es la misma trampa que la clave del almacén de la repisa de enlaces
   de F.A.R.O, y la sonda la mira.

### El quiz del propio video

Al terminar, si el video trae preguntas, la tapa **pregunta por lo que
acaba de ver**. La primera versión mandaba al Quiz de la misión y era un
salto raro: aquel pregunta por el tema entero, no por el video, y además
se lleva al alumno de la sección sin comprobar nada. Las escribe quien
eligió el video, en F.A.R.O, y son opcionales: un video sin preguntas
conserva la tapa de siempre.

**Hasta diez por video** (eran tres hasta el 28 de agosto de 2026, cuando
el autor lo subió: un video largo, o el que repasa un tema entero, pide
más). ⚠️ Ese número vive en **tres sitios** y los tres tienen que decir lo
mismo: el tope de `vmPreguntas` aquí, `MVID_MAX_PREG` en F.A.R.O y el
`check` de `metas_videos.sql`. Si el de aquí se queda corto, las
preguntas de más **no dan ningún error**: se guardan bien allá y se caen
en silencio antes de llegar a la pantalla, y eso se descubre —si se
descubre— mirando el teléfono de un niño.

Seis decisiones, y ninguna es de adorno:

1. **Una pregunta a la vez y en letra grande.** Misma lección que la
   lectura de las misiones: las tres juntas y en letra chica son un muro
   de texto en un teléfono, y el niño contesta por contestar.
2. **Se corrige EN EL SITIO, no al final.** Si la corrección llega
   después de tres preguntas, ya no se acuerda de por qué contestó eso.
   Y no se distingue solo por el color: la buena lleva ✓ y la fallada ✗,
   porque uno de cada doce niños no distingue el rojo del verde.
3. **No da XP.** Sigue siendo la regla de la sección; aquí además las
   preguntas se pueden acertar a la tercera. Lo que sí queda es el
   resultado en la **Evidencia del maestro** (`video_quiz`, con aciertos
   y total), que es el dato que de verdad le sirve: un video visto y tres
   preguntas falladas le dice que el tema sigue sin entenderse.
4. **Se puede saltar.** Un quiz obligatorio al final de un video es la
   forma más rápida de que no se abra ningún video más.
5. ⚠️ **`ok` es el ÍNDICE de la correcta, nunca su texto.** Si fuera el
   texto, corregirle una tilde a la opción dejaría la pregunta sin
   respuesta buena y nadie se enteraría hasta que un niño la fallara. Y
   una pregunta que no se puede contestar —sin texto, con una sola
   opción, o con el `ok` apuntando fuera de la lista— **se descarta
   entera** antes de pintarla: es preferible un video sin quiz a un quiz
   trabado del que un niño solo no puede salir.
6. **El quiz está SIEMPRE a la vista, y se resuelve sin ver el video.**
   Pedido por el autor el 28 de agosto de 2026, con estas palabras: «hay
   usuarios que podrían no ver el video hasta el final» y «que siempre
   esté visible el quiz». Y no es una comodidad: la tapa del final **solo
   cae cuando YouTube dice que el video terminó**, y hay videos que no se
   terminan nunca —el alumno que ya entendió lo suyo en el minuto dos, el
   que pierde la señal a mitad, el que entra solo a repasar—. Los tres se
   quedaban sin las preguntas, y el maestro sin el dato de la Evidencia,
   que es lo único que esa sección le devuelve.

   Es **un botón y uno solo**, `🧠 Resuelve el Quiz`, en el cuerpo de la
   tarjeta. Empezó siendo dos piezas —una marca que decía «3 preguntas al
   final» y, al abrir el video, un aviso con su botón— y **las dos se
   escondían por turnos**: la marca al abrir el video, el aviso al abrir
   las preguntas. Ahora no se esconde nunca: antes de tocar ▶, con el
   video corriendo y con las preguntas ya en pantalla.

   **Y el texto no explica nada.** Decía «no hace falta verlo entero:
   puedes contestarlas cuando quieras», que era aclarar con palabras algo
   que ahora se ve solo, porque el botón está ahí desde el principio.
   Dice «Resuelve el Quiz» y ya.

   Tocarlo con el quiz ya abierto **no lo rehace**: lo trae a la vista.
   Rehacerlo borraría las respuestas que el alumno acaba de marcar, y un
   botón siempre presente que a veces no hace nada es un teléfono que el
   niño da por trabado.

   Al abrirlo **el video se calla** —por la API, y si no llegó, por el
   `postMessage` que el reproductor entiende de fábrica, que para eso ya
   va `enablejsapi=1` en la dirección—. Uno sonando detrás de las
   preguntas es la forma más rápida de que no se conteste ninguna. Y si
   nunca se abrió el video, el botón de la tapa dice **«Ver el video»**,
   no «Verlo otra vez»: no puede prometer una repetición que no hubo.

   ⚠️ **Y «Verlo otra vez» tiene que DESMARCAR el «ya se tapó».** Es lo
   que más cuesta y no se ve venir: sin eso, el alumno que contestó por
   adelantado y volvió a ver el video se quedaba **sin tapa** al llegar
   el final de verdad, o sea con la parrilla de sugerencias de YouTube y
   su «Ver en YouTube» en pantalla —que es exactamente lo que esta
   sección existe para evitar—.

   En la Evidencia del maestro queda `sin_terminar`, y le cambia la
   lectura del dato: dos preguntas falladas de un video visto entero
   dicen que el tema no se entendió; las mismas dos de un video cortado
   en el minuto dos dicen otra cosa.

⚠️ **Con quiz, la tapa SALE del hueco 16/9 del video** (`vm-marco-quiz`).
El hueco en un teléfono de 393 px mide 221 px de alto y una pregunta con
tres opciones pide el doble: se veía el enunciado cortado por arriba y
«Saltar» por abajo. Poder deslizar no basta —regla 8 de los juegos 3D— y
aquí lo que se corta es la pregunta.

### Cómo se monta en una misión nueva

Tres cosas, y ninguna toca el aparato. Están escritas al final de
`js/videos-mision.js`: el `<link>` del CSS **después** del de la misión
(se tiñe de su `--pri` y su `--sec`), el bloque `#s-videos` con su
pestaña, y los tres `<script>` al final con la llamada a
`VideosMision.montar(...)`.

**La pestaña 🎬 va detrás de 📖 Aprende**, y el bloque detrás de esa
sección. Es el orden de la cabeza del alumno: leyó y no lo entendió, y lo
que quiere es que se lo expliquen. La flecha «siguiente» de Aprende **no
se toca**: sigue llevando a donde llevaba. Ver un video no es un paso
obligatorio de la misión —no da XP ni marca nada—, así que tampoco puede
meterse en medio del camino del que no lo necesita.

⚠️ **Y la clave de `montar()` es la CARPETA de la misión.** Es lo único
que hay que cambiar al copiar el bloque, y es justo lo que se olvida: no
da un error, da los videos de otro tema en la pantalla de un niño.
Montarlas de veinte en veinte a mano es garantizarlo, así que el montaje
se hizo con un guion y **lo comprueba la sonda en todas** (la 11), que
además avisa si dos misiones comparten clave.

### ⚠️ El service worker no toca lo que se transmite

Esto costó un video que se reproducía **un segundo** y saltaba al final,
el mismo día del estreno. El fallo no estaba en el reproductor: la rama
de recursos externos de `sw.js` servía **cache-first todo lo ajeno**, y
un video no es un archivo —son cientos de trozos pedidos por rangos de
bytes, y cada respuesta vale para ESE rango—. Servirle uno guardado le
hace concluir que el flujo se acabó.

Se escribió para el motor de los juegos 3D, que sí es un archivo suelto.
Ahora, antes de la caché, se apartan dos cosas y hacen falta las dos:

- **la casa de YouTube entera por nombre** (los trozos vienen de
  `googlevideo.com`, no de `youtube.com`);
- **cualquier petición con cabecera `range`**, venga de donde venga —el
  día que se incruste un audio de otro sitio, el mismo fallo volvería
  con otra cara.

Se sale sin `respondWith`: lo atiende el navegador, que sabe hacerlo.

**Y la sonda no podía cazarlo:** Playwright arranca sin service worker,
así que en la prueba esa rama no existe. Por eso la sonda lee `sw.js`
**del archivo**, como hace `lib-sonda-3d` con el andamio de los juegos.
Es el mismo punto ciego ya apuntado a cuenta de la convocatoria.

**Antes de publicar un cambio de los videos:**

```
node _dev/servidor-estatico.js       (en otra terminal)
node _dev/verifica-videos-mision.js
```

Vigila lo que cuesta caro: que por el `src` del iframe no pase nada que
no sean once caracteres (se le tiran nueve direcciones envenenadas), que
el alumno no tenga dónde escribir, que no se llame a YouTube hasta que
toque ▶, que la tapa del final **tape de verdad** —se pregunta quién
recibiría un toque en el centro del video, que es el mismo guardián que
caza el lienzo derramado de los juegos 3D—, que sin API no se tape nada,
que la nube pise al catálogo y la lápida quite, y que ver un video no
toque el progreso de la misión.

Y desde el 28 de agosto de 2026, tres comprobaciones más. La **3-bis**
mira que el aviso de Brave salga **una sola vez y por encima de la
lista**, con dos videos y también con uno abierto. La **3-ter**, que
**solo suene un video**: al abrir el segundo tiene que quedar UN
reproductor, el primero volver a su miniatura y poder abrirse otra vez.
Y la **3-quater**, el quiz siempre a la vista —que el botón se vea antes
de tocar ▶ y siga viéndose con las preguntas en pantalla, que diga
«Resuelve el Quiz» y que en la sección no quede ni rastro del «no hace
falta verlo entero», que abra las preguntas **sin abrir el reproductor y
sin una sola petición a YouTube**, que volver a tocarlo no borre lo
contestado, que quede apuntado `sin_terminar`, y la que de verdad cuesta:
que después de resolverlo por adelantado, **ver el video y llegar al
final devuelva la tapa**—.

Y desde que esto vive en más de una misión, dos cosas más. La **11** lee
del archivo TODAS las que lo montan —abrirlas con Playwright cuesta un
minuto largo y una comprobación así no la corre nadie— y mira lo que se
multiplica al copiar el bloque: que estén las tres piezas, que el catálogo
las conozca (que es lo que las hace funcionar sin nube), que el CSS vaya
después del de la misión y, sobre todo, **que ninguna haya heredado la
clave de otra**. La **12** abre una de ellas de verdad, y a propósito **no
la del estreno**: lo que solo se ve abriéndola es que el `go()` de esa
misión conteste, que es de quien depende el botón de la tapa del final.

## Normativa: las Sugerencias de una misión salen del teléfono

El botón **💬 Sugerencias** de cada misión lleva años ahí y durante todo
ese tiempo **no llegó a nadie**. Guardaba lo escrito en el almacén de
ESE teléfono, y para leerlo había que abrir la Evidencia de misiones en
el mismo aparato: el del niño que escribió. Nadie lo leyó nunca.

Un botón que promete «tu mensaje ayuda a mejorar M.E.T.A.S» y guarda en
un cajón cerrado es **peor que no tener botón**: quien lo usó se queda
tranquilo creyendo que avisó, y la errata sigue ahí el curso siguiente.

Ahora salen. El camino, entero:

| dónde | qué hace |
|---|---|
| `js/metas-registro.js` | el botón y la ventana de escribir |
| `js/metas-sugerencias.js` | el puente: cola, reintento y envío |
| `supabase/sql/metas_sugerencias.sql` **(en el repositorio de F.A.R.O)** | la tabla y su única puerta |
| `js/tools/metas-sugerencias.js` **(en F.A.R.O)** | la bandeja donde se atienden |

**Van al proyecto de Supabase de F.A.R.O, no al de M.E.T.A.S.** No es un
descuido: los resultados los consulta el maestro y por eso viven en el
proyecto de M.E.T.A.S; las sugerencias las lee el **administrador**, que
trabaja en F.A.R.O. Es el mismo camino que ya hace `buzon.html`. Por eso
el puente es un archivo aparte y no un tipo más en los `TIPOS` de
`metas-supabase.js`: son **dos destinos distintos**, y esa cola es la
que lleva las notas de los alumnos, así que no se toca para añadir un
camino nuevo.

**Cuatro reglas, y ninguna es de adorno:**

1. **No se pierde.** Sin señal se guarda y sale al abrir la siguiente
   misión. Es el caso normal, no el raro: el aula está en un pueblo.
2. **Un «no» del servidor no es siempre el mismo «no».** «Texto de tres
   letras» no va a entrar nunca y se tira de la cola; «el freno del día»
   entra mañana y se guarda. Juntarlos atasca la cola o pierde mensajes
   buenos, y las dos cosas se descubren tarde.
3. **Reintentar CORRIGE, no duplica.** La llave es el `evento_id` que ya
   trae cada registro. El teléfono no sabe si el primer envío entró.
4. **Va la dirección exacta de la página**, no solo la carpeta: las
   misiones no se llaman `index.html`. Sin ella, arreglar una errata
   empieza por buscar la misión entre más de sesenta, que es justo el
   paso donde el arreglo se pospone.

Lo escrito **también sigue en el registro local**, como siempre: esto
solo AÑADE la salida, no cambia la Evidencia de misiones.

**Antes de publicar un cambio de las sugerencias:**

```
node _dev/servidor-estatico.js         (en otra terminal)
node _dev/verifica-sugerencias-faro.js
```

Vigila lo que cuesta caro: que salgan, que salgan **al proyecto
correcto**, que lleven la misión y la sección, que sin internet esperen
en vez de perderse, que un reintento no deje gemelas y que las que
llevaban meses atrapadas en los teléfonos salgan también. La nube no se
toca: se pone un Supabase de mentira con `page.route`.

## Normativa: en papel, el círculo se RELLENA — la ✗ es para lo que está mal

Vale para **todo ejercicio impreso de selección múltiple**: fichas de
lectura, hojas de la lectura de una misión, evaluaciones, cualquier hoja
con opciones. La instrucción es:

> **Rellena el círculo de la letra de la respuesta correcta.**

Nunca «marca con una ✗». En el aula la **✗ significa MALO**: es lo que el
maestro pone encima de lo que está errado, y el alumno lo lee así desde
primer grado. Pedírsela para señalar lo **correcto** enseña dos cosas
contrarias con el mismo signo, y el niño que ya sabe leer una hoja
corregida duda de cuál es cuál.

Por eso las opciones se imprimen **con su círculo al lado** (`.lp-op i`,
`.lf-op i`) y lo que se le pide es rellenarlo, como en cualquier hoja de
respuestas. Donde la opción no lleva letra —dos grupos con su nombre—, se
dice «rellena el círculo del grupo».

La frase vive en **una sola constante** (`RELLENA`, en
`js/tools/lectura-mision.js`) y no se reescribe a mano en cada actividad.
`_dev/verifica-impresion-lectura.js` comprueba que ninguna hoja pida la
✗; si aparece, falla.

Fuera de la selección múltiple la ✗ sí sirve para lo que siempre ha
servido —marcar un error, señalar una casilla en una cuadrícula—, y ahí
se deja.

## Normativa: los nombres propios llevan mayúscula, también en los juegos

Vale para **todo texto que ve una persona**: tarjetas de repaso, quiz,
memorama, respuestas correctas, sopa, casos, fichas impresas y mensajes.
Se escribe **Marco Aurelio Soto**, **UNAH**, **UNESCO**, **La Gaceta**,
**Ley Fundamental de Educación**, **Decreto 262-2011**, **Acuerdo
1358-SE-2014**, **Constitución de la República**, **Secretaría de
Educación**, **Honduras**. En minúscula van **artículo 27** y los nombres
comunes (la ley, el decreto, cuando no nombran uno concreto).

No es preciosismo. Esta normativa nació porque las tarjetas de la primera
misión del maestro salieron en minúscula («el presidente marco aurelio
soto y su ministro ramón rosa») y así se le mostraron a un maestro: en
material que circula entre colegas y sirve para preparar un concurso, una
minúscula en el nombre de una ley o de una persona le quita autoridad a
todo el trabajo, por bien verificado que esté el dato.

El error entra porque el texto se escribe «como se pronuncia» y nadie
vuelve a leer catorce tarjetas buscando mayúsculas. Por eso se comprueba
con una herramienta, antes de publicar:

```
node _dev/verifica-nombres-propios.js
```

Revisa `misiones/` y `fichas/`. Si añade una misión con nombres propios
nuevos (una institución, una ley, un municipio), **agréguelos a la lista
`NOMBRES`** de esa herramienta: la lista es el comprobador.

Dos excepciones, y están anotadas dentro: la misión de sustantivos y su
ficha escriben los nombres propios en minúscula **a propósito**, porque
el ejercicio consiste en que el alumno los corrija.

Cuando la respuesta se compara sin distinguir mayúsculas (`norm` en
«Completa la oración»), **la primera de la lista es la que se le muestra
al maestro cuando falla**: esa va escrita bien («1358-SE-2014», no
«1358-se-2014»). Aceptar todas las formas no cuesta nada; mostrar una mal
escrita, sí.

## Normativa: un símbolo patrio se muestra completo o no se muestra

Vale para la bandera, el escudo y el himno, de Honduras y **de cualquier
otro país** que aparezca en la plataforma. No se le quita nada, no se
«simplifica» y no se sustituye por una versión parecida.

La regla nació en la tarjeta «Explorando» de la portada. Se pintó ahí la
bandera con franjas de color en CSS: se veía limpia, cargaba al instante y
funcionaba sin internet, pero **a Honduras le faltaban las cinco estrellas**,
a El Salvador, Guatemala, Nicaragua, Costa Rica y México su escudo, y a
Panamá sus estrellas. Bonita y rápida no alcanza: era la bandera del país
mostrada incompleta, en una plataforma que se usa para enseñar civismo.

En la práctica: **el emoji del país** (🇭🇳, 🇸🇻, 🇬🇹…) trae la bandera entera,
no pesa nada y funciona sin conexión; es lo que usa la tarjeta. Si algún día
se quiere una bandera grande, se pone la imagen real del país con todo lo
suyo. Nunca un degradado, nunca «solo las franjas». La nota larga y el porqué
están en `js/data/paises.js`.

## Normativa: el icono de la aplicación instalada no se recorta

Cuando el maestro instala M.E.T.A.S desde su navegador —«Añadir a la pantalla
de inicio», que es como llega la aplicación a un teléfono de un pueblo—, lo que
le queda es el **logo del editorial**. Y ahí el teléfono NO lo enseña tal cual:
Android le pone su **máscara** encima —círculo, cuadrado redondeado o gota,
según la marca— y se queda con lo de dentro. Solo está garantizado el **círculo
central del 80 %** del lienzo.

El 9 de septiembre de 2026 el logo nuevo entró por `main` como una imagen
suelta, y así medía el icono que había:

| | antes | hoy |
|---|---|---|
| el logo dentro del icono `any` | **60 % del ancho** (el resto era un aro azul y aire) | **90 %** |
| el logo dentro del icono `maskable` | 60 %, y la tinta **se salía 53 px** de la zona segura | **74 %, dentro** |
| archivos | 2, y el mismo servía para las dos cosas | 4, dos por familia |
| lo que pesan | 140 KB | **115 KB** |

**Lo que cuesta caro es que esto NO SE VE AL PUBLICAR.** El archivo se sube
bien, el navegador lo enseña entero en la pestaña, el manifest no da un solo
error… y en la pantalla de inicio el logo sale con **«EDITORIAL» cortado por
los lados**. Se descubre —si se descubre— mirando el teléfono de alguien que ya
la instaló.

**Cinco reglas, y ninguna es de adorno:**

1. ⚠️ **`any` y `maskable` son DOS archivos, nunca uno con los dos propósitos.**
   Era lo que había (`"purpose": "any maskable"`), y obliga a elegir: o el icono
   sale diminuto en todas partes —para que quepa en el recorte— o Android se
   come el nombre de quien publica. Son dos trabajos distintos: el `any` lo
   enseña el navegador casi entero y llena el 90 %; el `maskable` va entero
   dentro del círculo del 80 %.
2. ⚠️ **El tamaño no se escribe: se MIDE, y se mide la TINTA.** Inscribir la
   *caja* del logo en la zona segura lo dejaba en el **60 %** del ancho, porque
   las esquinas de la caja están vacías. Buscando el círculo más pequeño que
   contiene la tinta de verdad sube al **74 %** — el mismo recorte y un icono
   un cuarto más grande. Lo hace `_dev/genera-iconos-app.py`; a ojo no se
   acierta y encima cambia con cada logo.
3. **Del círculo se deja un colchón** (97 %). El borde de la tinta se decide con
   un umbral, así que el halo más claro del antialiasing queda fuera de la
   cuenta; sin colchón el logo sale tangente al recorte y ese halo se lo lleva
   la máscara. Es la misma cifra y la misma razón que los 248 mm de la hoja
   carta.
4. ⚠️ **El fondo es blanco y OPACO, nunca transparente.** iOS pone lo
   transparente sobre **negro**, y este logo es azul marino: desaparecería. Y
   una máscara de Android sobre esquinas transparentes deja el icono con el
   fondo en nada. El logo se diseñó sobre blanco; se guarda sobre blanco.
5. **El original se queda en el repositorio** (`img/logo-oficial.jpg`). Sin él,
   el próximo cambio se haría recortando a mano el icono ya recortado, que es
   como se pierde un logo.

⚠️ **Los iconos van precacheados y llevan sellado.** Están en `STATIC_ASSETS` de
`sw.js`, así que un teléfono con el service worker puesto **seguiría enseñando
el icono viejo para siempre** si no se sube `CACHE_NAME`. Es la normativa de
sellado de siempre, y aquí muerde aunque no se haya tocado una línea de HTML.

⚠️ **`img/logo.png` NO es este logo y no se toca.** Es el de **M.E.T.A.S** —el
cerebro con «M.E.T.A.S» escrito arriba— y va de marca de agua dentro de las 74
misiones (`.xp-back-logo`). El del editorial es el de la aplicación instalada.
Son dos marcas y cada una tiene su sitio.

**Cuando entre un logo nuevo, se le da el mismo trato:** se deja el original en
`img/logo-oficial.jpg`, se corre el generador y se sella. No se recorta a mano
y no se copia un icono de otro tamaño.

```
pip install --user pillow        (no va en el repositorio)
python3 _dev/genera-iconos-app.py          → arma los cuatro
python3 _dev/genera-iconos-app.py --revisa → solo mide, no escribe
node _dev/verifica-iconos-app.js           → los abre y los mide
```

La sonda no mira el papeleo: **abre los PNG y busca la tinta píxel a píxel**
—lee el PNG con `zlib`, que viene con Node, así que no añade una dependencia—.
Comprueba que ningún archivo sirva a las dos familias, que la tinta del
`maskable` **quepa en el círculo del 80 %** y que además lo aproveche (que no
salga diminuto, que era el fallo del anterior), que el `any` llene el lienzo,
que ninguno lleve canal alfa, que los cuatro estén en `sw.js` y que el original
siga ahí. Cuando algo se sale, **dice el píxel exacto** que la máscara se
llevaría.

### Lo que NO se hizo, y por qué

- **Quitarle la palabra «EDITORIAL» al icono.** Es lo que manda el manual de
  cualquier icono pequeño, y aquí sería cambiar el producto para arreglar la
  medida: el logo lo eligió el autor. Se le da todo el tamaño que el recorte
  permite y se deja entero, que es la misma decisión que alojar las tipografías
  en vez de cambiarlas por `system-ui`.
- **Un `apple-touch-icon` de 180 px propio.** iOS ya baja el de 192 y una
  reducción de 192 a 180 no se ve; el archivo de más sí se baja.
- **Los iconos de la app de Android** (`android/app/src/main/res/mipmap-*`).
  Esos son los del APK de Capacitor, que no se descarga de un navegador. El día
  que se compile, se rearman ahí con las herramientas de Android Studio.

## Normativa: el Kit de Capacitación no le miente al que fotocopia

`kit-capacitacion.html` es la hoja que se reparte en las capacitaciones, y es
papel de verdad: se fotocopia por participante y se guarda. **No tiene una sola
línea de JavaScript**, así que sus cifras van escritas a mano — y una cifra
escrita a mano envejece sola, porque nadie vuelve a leer el Kit para
comprobarla.

Envejeció dos veces, y las dos se descubrieron mirando:

- Decía «**57 misiones**» y «**11 rutas**» cuando ya eran 68 y 13. Y peor que
  la cifra: su lista de materias no nombraba **E. Cívica** —los símbolos
  patrios y el Himno, que es lo que se estudia en septiembre— ni **Repaso
  General**, con las Pruebas de Fin de Grado. La cifra vieja se nota; la
  materia que falta, no: el maestro **no se entera de que existe**.
- Y el pie prometía «**una hoja** por participante» cuando el Kit sale en
  **cuatro**. Quien fotocopiaba para treinta leía 30 hojas donde hacen falta
  120, y los últimos se quedaban sin el guion y sin la lista de comprobación.

**Las cifras van FECHADAS y con el rumbo a la vista** —«hoy, en septiembre de
2026, son 68 y siguen entrando»—, que es la regla del papel de más arriba y
aquí toca porque no hay forma de contarlas al vuelo. Un «son 68» a secas le
dice al maestro que eso es todo lo que va a haber, y esta hoja se guarda un año
en una gaveta.

Y lo comprueba una sonda, para no volver a descubrirlo mirando:

```
node _dev/servidor-estatico.js            (en otra terminal)
node _dev/verifica-kit-capacitacion.js
```

⚠️ **Los números no se escriben dentro de la sonda**: se cuentan del catálogo
(`js/data/misiones.js`) y del **PDF**, que es la verdad de la impresora. Una
sonda con el número dentro se pondría roja el día que entre una misión sin que
nada esté roto, y eso enseña a no mirarla.

Mira cinco cosas, y las cinco salen de una avería de verdad: que la cifra de
misiones y la de rutas sean las que hay, que no se haya quedado dentro una
cifra vieja de otra tanda, que vayan fechadas, que **el párrafo que presenta el
catálogo nombre TODAS las materias** —y se busca solo ahí, porque una materia
nombrada de pasada en otro sitio taparía que se cayó de la lista—, y que **el
pie prometa las hojas que de verdad salen**.

Al añadir una materia o al crecer el Kit, la sonda dice qué falta por
actualizar. Y si el Kit gana una hoja, el pie se corrige: cada hoja de más son
treinta hojas de más en la capacitación.

## Normativa: la respuesta correcta se reparte entre las letras

Medido el 12 de septiembre de 2026 con `_dev/mide-reparto-respuestas.js`: de
las **77 misiones, 53 tenían sesgo** en algún banco. La peor —los adverbios—
ponía el **100 %** de las respuestas de «Completa la oración» en la «a». Otras
tres andaban por el 75-88 %.

Eso no es un detalle de estilo. **El alumno que no estudió y marca todo «a» se
lleva tres cuartos de la sección**, y esa nota entra en su expediente igual que
la del que sí la resolvió. Y al que sí estudia le enseña lo contrario de lo que
la misión quiere enseñarle: que adivinar funciona.

La regla es que **ninguna letra pase del 40 %**, y la comprueba
`verifica-mision-nueva` en `qzData` (clave `c`), `evalMCBank` (clave `a`) y
`cmpData` (clave `c`).

El arreglo lo hace una herramienta, porque son 49 misiones todavía:

```
node _dev/reparte-respuestas.js --revisa <carpeta>   (solo enseña qué haría)
node _dev/reparte-respuestas.js <carpeta> [otra…]
node _dev/mide-reparto-respuestas.js                 (después, siempre)
```

**No toca el contenido ni cuál es la respuesta buena**: solo en qué posición se
ofrece. Mueve la correcta y deja las demás en su orden relativo.

**Cuatro reglas, y ninguna es de adorno:**

1. ⚠️ **En varios bancos la letra va escrita DENTRO del texto de la opción**
   («a) Modificar al verbo»). Al mover hay que volver a numerarlas, o el alumno
   ve dos «b)» y ninguna «d)». La herramienta lo detecta sola: renumera cuando
   TODAS las opciones de la fila traen su letra.
2. ⚠️ **Hay listas cuyo orden SÍ dice algo, y esas no se tocan.** «1/2 = ___/4»
   ofrece 1 · 2 · 4, en orden, que es como se leen. Se detectan solas: si todas
   las opciones son números o fracciones y van de menor a mayor (o al revés),
   la fila se queda como está.
3. ⚠️ **Una misión con edición en inglés NO se reparte con la herramienta.** Su
   `-en.js` lleva el banco **índice a índice** con el español: mover uno solo le
   cambia la respuesta correcta al alumno que estudia en inglés. Esas van a
   mano y las dos a la vez.
4. **Se reparte a partes iguales, no justo por debajo del 40 %.** Con cuatro
   opciones el azar es el 25 %: una letra al 40 % sigue siendo una pista. El
   objetivo es `ceil(filas / letras)` y el 40 % queda como el techo que no se
   pasa nunca.
5. ⚠️ **Las cuentas NO son la secuencia, y esto costó una segunda pasada.** La
   primera versión movía filas de arriba abajo, así que las que no hacía falta
   tocar —todas con la letra del sesgo— se quedaban AMONTONADAS AL FINAL. El
   banco de Respiratorio quedaba `adacdacdcacbbbb`: 27 % por letra en la cuenta
   y **las cuatro últimas preguntas seguidas en la «b»**. En un examen de quince
   eso se ve desde el pupitre, y el que lo note tiene las últimas cuatro
   regaladas — lo mismo que veníamos a quitar.

   Por eso se reparte en dos pasos: primero CUÁNTAS de cada letra y después EN
   QUÉ ORDEN.
6. ⚠️ **Y el orden se BARAJA; no vale «que nunca se repita la anterior».** Es lo
   primero que sale y deja la racha en 1 siempre, que es otro patrón: quien lo
   note sabe que la siguiente no es la que acaba de marcar, y pasa de acertar 1
   de 4 a 1 de 3. Sería cambiar un sesgo grande por uno pequeño, pero cambiarlo
   por otro. Se baraja con **semilla** —el mismo archivo da siempre el mismo
   reparto, así volver a correr la herramienta no ensucia el diff— y solo se
   rechaza lo que de verdad se ve: **tres o más seguidas iguales**. Dos pasan,
   porque en una lista al azar pasan, y una lista donde nunca pasan ya no
   parece azar.

   `mide-reparto-respuestas.js` **informa** de la racha más larga, pero no falla
   por ella: en una lista al azar de quince, una racha de tres sale casi la
   mitad de las veces, y darla por avería sería pintar de rojo un banco sano.

⚠️ **Dos cosas del detector de «listas ordenadas» que hubo que medir:** la coma
es separador de MILES, no decimal —leer «400,000» como cuatrocientos declaraba
ordenada una lista por un motivo inventado—; y una lista que BAJA empezando por
la correcta no es un menú, es «escribí la respuesta y detrás me inventé
distractores más pequeños». En el catálogo entero hay **63 listas que suben**
—en 58 la correcta no va primera, o sea que son menús de verdad— y solo **10
que bajan**; de esas, las **4** que empiezan por la correcta son las cuatro el
mismo caso (`347 · 34.7 · 3,470 · 0.0347`: el error de correr la coma). Esas
se mueven; las otras seis, no.

Y **antes de guardar, el archivo tiene que compilar**: la herramienta le pasa
`node --check` a un temporal y solo entonces escribe. Es la lección de siempre
—un error de sintaxis no da la cara, el navegador se calla y la misión se pinta
igual—, y aquí mordió de una forma tonta: el temporal se llamaba `.probando`,
`node --check` no sabe qué hacer con esa extensión y **fallaba siempre**, así
que la red de seguridad no dejaba escribir nunca. El temporal acaba en `.js`.

⚠️ **Y de paso salió un punto ciego que llevaba tiempo:**
`verifica-mision-nueva` buscaba los archivos del HTML **sin quitarles el
sellado** (`js/adverbios.js?v=1`). En las **16 misiones** que lo llevan no abría
ni uno de sus JS: daba «falta el archivo», después cuarenta «el HTML llama a X
y no existe en el JS» —con todo perfectamente puesto— y, lo que de verdad
costaba, **se saltaba el reparto de respuestas con un aviso**. O sea: a esas 16
la regla del 40 % no se les pedía, y nadie lo sabía. Es la misma familia que la
sonda que sale roja sin avería: una que se rinde con un aviso y sigue enseña a
no mirarla.

⚠️ **Y las cinco de Robótica con traducción de autor van APARTE.** Su `-en.js`
lleva el banco índice a índice; la herramienta las reconoce y se niega, con su
aviso. `robots-problemas` es de las más sesgadas que quedan (89 % en la «b») y
sigue esperando a que se haga a mano, con las dos ediciones a la vez.

⚠️ **Y la herramienta busca el JS de la misión por lo que TIENE DENTRO, no por
su nombre.** Deducirlo de la carpeta acierta en la mayoría y falla justo donde
duele: `potencias-raices` tiene seis JS y el primero por orden alfabético es
`interaccion_cuadrados.js`; `bach-uni-adjetivos` se llama `app.js`, y
`angulo-bisectriz`, `angulos.js`. Manda el que trae los bancos.

**Lo que queda:** 33 misiones (eran 53 el 12 de septiembre de 2026). Se van
haciendo por tandas, mirando el diff —cada fila movida es una línea que alguien
tiene que leer— y corriendo después la sonda de la misión.

## Comentarios en el código

En español, y explicando **por qué** está así, no qué hace la línea. Casi
todo comentario del proyecto nace de un problema real en el aula; contarlo
evita que alguien lo «arregle» de vuelta al problema.

## Normativa: las sondas se corren de una vez, y solas

Este archivo tiene nueve listas de «antes de publicar, corre esto». Nadie las
corría todas: se corría la de lo que uno acababa de tocar y las demás se
quedaban rojas meses. El 6 de septiembre de 2026 se corrieron todas por primera
vez y **tres estaban en rojo**, ninguna de esa semana. Una de ellas llevaba **58
fallos que no eran averías**: pedía cosas que este repositorio no cumple a
propósito.

Ahora se corren de un golpe, y en dos tandas porque cuestan cosas distintas:

```
npm test                       → las 32 rápidas: solo leen archivos, 12 s
npm run test:navegador         → las 24 de Playwright, con su servidor
```

El **servidor estático lo levanta y lo baja la propia herramienta**
(`_dev/corre-sondas.js`): era el paso que más se olvidaba, y una sonda sin
servidor no dice «falta el servidor», dice que la página está rota.

**Las sondas se descubren solas.** Una sonda nueva entra en la tanda sin tocar
nada. Lo que queda fuera va nombrado uno por uno **con su motivo** dentro de la
herramienta —son las doce que *escriben* fichas o piden argumentos— y se
**imprime esa lista al terminar**: una exclusión callada es la forma más fácil
de que una sonda se quede fuera un año sin que nadie lo note.

⚠️ **Una sonda que sale roja cuando todo está bien enseña a no mirarla.** De ahí
salen dos reglas:

- **Los números se cuentan, no se escriben** — también dentro de las sondas.
  `verifica-fin-de-grado.js` comparaba contra el literal `61` y empezó a fallar
  el día que entró la misión 62, sin que nada estuviera roto.
- ⚠️ **Una sonda que busca un texto prohibido quita los COMENTARIOS antes de
  buscar.** Ha mordido tres veces: `verifica-legal` con la promesa retirada,
  `verifica-barra-secciones` con un archivo que explica por qué no hace falta
  `!important` —y se acusaba a sí mismo—, y `verifica-teclado` con el
  comentario de `camp-vivo.html` que cuenta que ahí **se quitó** el
  `user-scalable=no`. El sitio donde se explica por qué algo ya no está es
  justo donde ese algo sigue escrito.
- ⚠️ **La sonda que finge la nube abre la página SIN service worker**
  (`SIN_SW`, en `_dev/lib-navegador.js`). Cuando el service worker toma el
  control —`sw.js` hace `skipWaiting()` y `clients.claim()`, así que lo toma
  sin recargar—, las peticiones pasan por él, y las que pasan por él
  **`page.route` no las intercepta**: se van a la nube de verdad, allí se
  quedan colgadas, y la sonda ve una pantalla que no se pinta nunca. Estuvo
  tapado por un accidente durante meses: la instalación pre-cacheaba dos
  direcciones de CDN que en la sonda no contestan, así que tardaba lo
  suficiente y a las sondas les daba tiempo. El 9 de septiembre de 2026 esas
  dos direcciones se fueron y `verifica-convocatoria` se puso roja **sin que
  nada del producto estuviera roto**. Son ocho sondas y ya lo llevan; la que
  SÍ tiene que abrir con service worker es `verifica-service-worker`.
- **El desfase de `www/` avisa, no falla.** Esa copia va atrasada *a propósito*
  hasta que se compila la app de Android, así que darlo por fallo pintaba de
  rojo el estado normal del repositorio. Lo que sí hace falta saber es cuánto le
  falta, y eso lo dice.
- **Una sonda pide su regla solo a quien la necesita, y sabe quién es
  mirando.** `verifica-barra-xp` le exigía a las ocho misiones del maestro la
  media query de los 430 px. Se empezó a ponérsela y, al medir antes de darlo
  por bueno, resultó que **su barra no se sale**: lleva cuatro elementos y solo
  la barra de progreso no se encoge. La del alumno lleva siete, y el que la
  desborda es el nivel (`.xp-lvl`).

  ⚠️ **Y ponérsela habría sido un estropicio, no un arreglo**: esa regla
  esconde el rótulo `.xp-lbl` porque en la barra del alumno es redundante —al
  lado va «⭐ N»—. En la del maestro es **la única palabra que hay**: al lado
  tiene un número pelado. Ahora la sonda mira el HTML de cada misión para saber
  si lleva `.xp-lvl`, en vez de fiarse de una lista escrita a mano que
  envejecería con la misión siguiente.

### El CI las corre por su cuenta

`.github/workflows/sondas.yml`, en dos niveles: las rápidas **en cada empujón**,
las de navegador **de noche** (07:00 UTC) y en cada pull request.

**Esto NO frena la publicación.** Pages construye por su cuenta en cada empujón
a `main`, sin depender de ese archivo: el CI solo avisa, aparte. Un maestro no
se queda sin su cambio porque una sonda se caiga — que es la normativa de
siempre: publicar y corregir, no esperar.

Playwright **no se versiona**: el trabajo de noche lo instala con
`npm install --no-save playwright`, igual que se hace a mano, porque
`node_modules` va versionado en este repositorio.

### En vez de un linter, que todo compile

`_dev/verifica-sintaxis.js` pasa `node --check` por los archivos versionados
(hoy 366 y subiendo). Es lo que de verdad cuesta caro aquí: **un error de
sintaxis no da la cara**. El navegador se calla, deja de ejecutar ese archivo y la página se
pinta igual — ya pasó con un `-en.js` mal cerrado, que dejaba el botón 🌐 mudo y
la ficha bilingüe imprimiendo en español. Y no añade una sola dependencia.

Y vigila una segunda cosa de la misma familia, la que **sí compila**: los
escapes **`\U0001F1ED`**, que son de Python y JavaScript no entiende. Ahí no
hay error que ver: el archivo corre y el alumno lee el código en la pantalla.
Está contado entero en la normativa de E. Cívica, que es donde se publicó.

⚠️ Y esta sonda **quita los comentarios antes de buscar**, porque su propio
bloque explica el problema escribiendo el escape: sin eso se acusaba a sí
misma. Es la **cuarta** vez que muerde la misma trampa.

## Detalles del repositorio

- Sin framework ni compilación: HTML, CSS y JS planos que se sirven tal cual.
- `www/` es la copia que usa Capacitor para la app de Android. **No se edita
  a mano**: se regenera con `npm run build:www` en Windows. Está desfasada
  a propósito hasta que se compila la app.
- Los datos del maestro viven en `localStorage` y se sincronizan solos
  (`js/metas-docente-sync.js`); la nube es Supabase, con las funciones RPC
  documentadas en los archivos `SUPABASE-*.sql`.
- Se prueba con Playwright y Chromium contra un servidor local antes de
  subir. Los fallos de red hacia Supabase en ese entorno son normales.

## Las fuentes oficiales están en el repositorio: úselas

No hay que salir a buscar en internet lo que ya está aquí, y menos citarlo de
memoria. En `_dev/` viven los documentos con los que se escriben las misiones:

- **`_dev/leyes/`** — Estatuto del Docente, Código de la Niñez, manuales del
  SACE. Su `README.md` cuenta qué hay y qué falta.
- **`_dev/dcnb-pdf/`** — el currículo oficial: Prebásica y los tres ciclos de
  Básica. **Falta Educación Media**; hasta que entre, no se afirma nada de
  Media.
- **`_dev/dcnb/`** — ese mismo currículo convertido a Markdown y **troceado
  por área y grado**, con `INDICE.md`.

**Cómo se consulta el DCNB sin gastar de más:** se abre `_dev/dcnb/INDICE.md`,
se busca el archivo del área y grado que interesa, y se abre **ese**. Una
consulta cuesta unos 4.000 tokens. Abrir los PDF completos cuesta más de cuatro
millones, y no caben. Por eso está troceado: no es manía de orden.

Se regenera con `python3 _dev/dcnb-a-markdown.py _dev/dcnb-pdf/*.pdf`
(necesita `pip install pymupdf`). Antes de convertir un documento nuevo se
prueba **una** página con `--prueba N` y se mira cómo salen las tablas.

**El PDF es el que acredita.** El Markdown salió de una conversión automática y
sirve para trabajar y para buscar; el número de un artículo, de una expectativa
de logro o de un bloque **se confirma en el PDF** antes de publicarlo. Y hay
páginas cuyo contenido es una imagen: ahí el Markdown no tiene nada, el índice
las señala y hay que ir al PDF.

Esto nació de un problema real, contado entero en
`INVESTIGACION-ESTATUTO-DOCENTE.md`: se escribió una misión citando artículos
hallados con buscador, y estaban mal. **Buscar no es leer.**
