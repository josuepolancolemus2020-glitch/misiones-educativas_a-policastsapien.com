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
node _dev/audita-adjetivos-lectura.js    → ¿falta algún adjetivo en el inventario?
node _dev/valida-lectura-mision.js       → largo, mezcla, opciones, inventario, números
node _dev/verifica-nombres-propios.js    → mayúsculas de lugares y personas
node _dev/servidor-estatico.js      (en otra terminal)
node _dev/verifica-lectura-mision.js     → el minuto y el taller de los adjetivos
node _dev/verifica-lectura-numeros.js    → el taller de los números
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

## Normativa: la Convocatoria pregunta, no anota

En ✅ Controles hay dos cosas que se parecen y no son lo mismo. Un
**control** se ANOTA: el maestro ya sabe la respuesta y la marca sobre su
lista. Una **convocatoria** PREGUNTA: todavía no la sabe, y la respuesta
la dan las familias. Por eso la puerta lleva franja naranja y la palabra
«pregúntales»; el maestro tiene que ver la diferencia sin leer.

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

**Antes de publicar un cambio de la convocatoria:**

```
node _dev/servidor-estatico.js      (en otra terminal)
node _dev/verifica-convocatoria.js
```

Vigila las dos cifras que cuestan dinero —el día del evento y cuántos
buses— y las dos formas de perder una respuesta: contarla doble y no
contarla. La nube no se toca: se pone un Supabase de mentira con
`page.route`, así corre sin internet y sin ensuciar datos reales.

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
