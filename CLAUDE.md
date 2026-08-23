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

## Sellar la versión en cada cambio

El teléfono del maestro guarda la aplicación en caché y se queda con la
versión vieja. Por eso, en **todo** cambio de HTML, CSS o JS hay que subir
el número en dos sitios:

- las etiquetas `?v=NN` de `index.html`, `mision.html`, `consulta-nube.html`,
  `evaluaciones.html` y `registro.html`;
- `CACHE_NAME` en `sw.js`.

Si no se sella, el despliegue existe pero nadie lo ve.

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

## Normativa: los juegos 3D viven aparte, y no tocan la misión

Hay **doce** juegos en tres dimensiones, seis por misión, cada uno en
**su propio archivo HTML, autocontenido**, al lado de su misión.

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

**Los dos juegos de sólidos que no se pueden hacer en papel son los que
más valen**, y por eso están: doblar un patrón necesita cartulina,
tijeras y media hora —con 43 alumnos eso se hace una vez al año, si se
hace—, y girar el sólido para contar las caras de atrás no lo permite
ningún dibujo. El resto de la misión ya se puede hacer en el cuaderno.

Se abren **en otra pestaña** desde el Parque de Juegos 3D de la misión y
desde el widget de su mismo tema. Que estén aparte no es desorden: cada
uno carga Three.js y su propio bucle de dibujo, y meterlos dentro de la
misión le pondría ese peso encima al alumno que solo va a hacer el quiz.

**Siete reglas, y ninguna es de adorno:**

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
3. **Three.js se baja del CDN (r128), pero primero se mira si ya está
   puesto** (`if (window.THREE) return listo()`). Eso es lo que permite
   probarlos sin internet —la sonda le pone un Three.js de mentira— y lo
   que dejaría guardar mañana una copia dentro del sitio sin tocar los
   seis archivos.
4. **Sin red, la pantalla lo DICE.** Un juego que se queda negro parece
   roto y no se vuelve a abrir. El aviso promete que abriéndolo una vez
   con señal después funciona sin ella, y eso **lo cumple `sw.js`**: la
   rama de recursos externos ahora GUARDA lo que baja, que antes solo
   leía de la caché. Si se toca esa rama, se rompe la promesa.
5. ⚠️ **Y con señal MALA, tampoco se puede tocar nada hasta que el
   motor llegue.** Todos llevan un telón (`#velo-carga`, z-index 30)
   que se levanta en `listo()` y en `falla()`, nunca antes. Sin él, el
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
7. **Se juega con el dedo, y eso trae tres reglas de CSS que no son
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

Y una que es de contenido: **las respuestas equivocadas que se le
ofrecen al alumno son el error de verdad**, no números al azar. Al cubo
se le ofrece el área de una cara y su superficie; a la conversión, el
÷10 y el ÷100 de las unidades lineales. Un distractor absurdo se
descarta sin pensar y no enseña nada.

**Antes de publicar un cambio de los juegos 3D:**

```
node _dev/servidor-estatico.js           (en otra terminal)
node _dev/verifica-juegos-3d.js          → los seis del volumen
node _dev/verifica-juegos-3d-solidos.js  → los seis de los sólidos
```

Las dos sondas comparten el Three.js de mentira
(`_dev/three-de-mentira.js`): si un juego nuevo usa una pieza que ese
archivo no tiene, se le añade **ahí**, y no se copia el archivo.

Vigilan las cuentas una por una. En el volumen: los volúmenes, las
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

Las dos comprueban además **la señal mala** —que el telón tape mientras
baja el motor, que no quede ni un botón alcanzable por debajo y que el
juego llegue entero— y **tocan los botones con el ratón, no llamando a
la función**: así se ve el botón tapado o desplazado, que llamando por
dentro pasa. Comprueban también que sin internet el juego avise, que
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

## Comentarios en el código

En español, y explicando **por qué** está así, no qué hace la línea. Casi
todo comentario del proyecto nace de un problema real en el aula; contarlo
evita que alguien lo «arregle» de vuelta al problema.

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
