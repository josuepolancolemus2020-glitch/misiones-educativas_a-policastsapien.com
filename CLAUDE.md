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

`padres.html` es una página autónoma —no carga ese archivo— y lleva su
propia copia de la regla (`grupoTxt`), marcada con la misma nota. Si cambia
una, cambia la otra: la madre y el maestro tienen que leer lo mismo.

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

**Antes de publicar un cambio en cualquiera de los dos informes:**

```
node _dev/servidor-estatico.js      (en otra terminal)
node _dev/verifica-una-hoja.js
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
