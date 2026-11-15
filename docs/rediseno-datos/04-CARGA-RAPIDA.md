# 4. Carga rápida desde los papeles (y formato para importar escaneos)

Fase 1: diseño. La base nueva **empieza vacía** y no se migra nada
automáticamente. Esta pantalla es el camino para que el docente vuelva a tener
su aula en una tarde, copiando de lo que tiene impreso: la lista, el cuadro de
notas y el cuaderno de colectas.

## 4.1 Principios

- **Todo pasa por una vista previa** que el docente confirma. Nada se guarda
  mientras escribe o pega.
- **Lo que se confirma son filas normales**: cada alumno, nota y pago entra a
  la cola como una operación de una fila (`03`, sección 3.7), con su id
  generado **una vez** (`crypto.randomUUID`), en el momento de armar la vista
  previa. Si el docente toca
  «Guardar» dos veces, o se corta la señal a la mitad, no se duplica nada: los
  ids ya existen y el segundo envío es el mismo.
- **Nada se empareja por número de lista.** Las notas y los pagos se unen al
  alumno por su fila en la pantalla (que ya tiene id); al importar un archivo,
  por identidad y, si no hay, por nombre completo exacto (normalizado).
- **Se puede hacer por partes y en días distintos.** Lo ya guardado aparece
  como guardado; lo nuevo se suma sin pisar lo anterior.
- Lenguaje del aula, de tú, sin palabras técnicas. Accesible: botones de 44
  px, nada dicho solo con color (✓ / ✗ / ⚠ además del color), nada que obligue
  a arrastrar.

## 4.2 Los cuatro pasos

```
 ① Tu aula        ② Tus alumnos        ③ Notas              ④ Colectas
 escuela, grado,  pegar o escribir     elegir asignatura    concepto, sugerido,
 sección, año,    la lista             y parcial; una       fecha; lo que dio
 asignaturas                           columna de números   cada alumno
                        │                     │                    │
                        └──────── vista previa y «Guardar» en cada paso ──────┘
```

Cada paso se puede saltar y retomar. Arriba hay una tira con los cuatro pasos
y una marca ✓ en los que ya tienen algo guardado.

### ① Tu aula

Escuela, código del centro, grado, sección (se muestra como `6º-1` con
`adGradoSeccion`), año lectivo, jornada y la lista de asignaturas (viene
llena con las del grado según el DCNB; se quitan o se añaden). Las fechas de
los parciales se pueden dejar para después.

Antes de crear: si ya existe un aula con la misma escuela, grado, sección y
año, se abre esa en vez de crear otra.

### ② Tus alumnos

Una tabla con estas columnas: **N.º de lista**, **Nombre completo**, **Número
de identidad**, **País del documento** (Honduras por defecto), Sexo, Fecha de
nacimiento, Encargado, Teléfono, Clave de familia que ya tiene.

Se llena de tres maneras: escribiendo fila por fila; pegando desde una hoja
de cálculo o desde el SACE (el pegado reconoce columnas por el encabezado o
por la forma: 13 dígitos = identidad, F/M = sexo); o importando un archivo
(4.4).

Validación en cada fila, al momento:

| caso | qué ve el docente |
|---|---|
| identidad con guiones o espacios (`0801-2015-12345`) | se guarda sin separadores; en pantalla se sigue viendo con guiones |
| documento hondureño con un número de dígitos distinto de 13 | ⚠ «El número de identidad tiene 12 dígitos; debe tener 13» |
| documento de otro país (por ejemplo, el CUI de Guatemala, una partida de nacimiento o un pasaporte) | se elige el país y el tipo; se acepta de 4 a 25 letras y números. Solo para Honduras se exige el formato de 13 dígitos |
| identidad vacía | se permite; marca discreta «falta identidad» (gris, con ícono) |
| misma identidad que otra fila de la tabla o que un alumno ya guardado | ✗ «Esta identidad ya es de **Ana María López Cruz** (n.º 12)». No se puede guardar esa fila |
| mismo nombre completo que otra fila o que un alumno ya guardado (sin importar tildes, mayúsculas ni espacios dobles) | ⚠ **solo aviso**: «Ya tienes a **Ana María López Cruz** (n.º 12)». Si a uno de los dos le falta la identidad, al guardar se pregunta «¿Es la misma persona?» con dos botones; si las dos identidades son distintas, se guardan los dos (homónimos). La identidad es la única regla dura |
| número de lista repetido | ⚠ aviso suave; se permite (es solo visual) |
| clave de familia que ya tiene la familia (opcional) | se acepta **solo si estaba en tus datos anteriores** (la base la busca en el archivo congelado de tu cuenta). Si no: ✗ «Esa clave no está en tus datos anteriores; deja la casilla vacía y se genera una nueva». Vacía: la base genera una nueva de 10 símbolos (`K7QMX-4PA2B`) |
| nombre con menos de dos palabras | ⚠ «¿Falta el apellido?» |

La comprobación contra lo ya guardado usa `metas.alumno_choques` cuando hay
señal y la copia local cuando no. Al guardar, `metas.alumno_crear` une sola
a quien tiene la misma identidad y pregunta cuando coincide el nombre sin
identidad (`03`, sección 3.6), así que dos aparatos cargando la misma lista sin
señal no acaban con alumnos repetidos.

### ③ Notas

El docente elige **asignatura** y **parcial** (o «Recuperación»). La pantalla
muestra la lista de alumnos ya guardados, en orden de lista, con **una
casilla** por alumno. Se escribe o se pega una columna de números.

| caso | qué ve el docente |
|---|---|
| número entre 0 y 100 | ✓ |
| decimal (`85,5`) | se acepta; el SACE pide enteros, así que se avisa «el SACE usa números enteros» |
| fuera de 0 a 100, letras, vacío | ✗ en esa casilla; vacío = «sin nota», no se guarda nada |
| ese alumno ya tiene nota en esa asignatura y parcial | se muestra la guardada al lado; si la nueva es distinta, la fila queda marcada «cambia de 78 a 85» y al confirmar se **edita** la fila existente (nunca se crea otra) |
| se pegan más números que alumnos | ✗ «Pegaste 44 notas y la lista tiene 43 alumnos». No se reparte nada |

Personalidad e inasistencias para el SACE tienen su propia pestaña con el
mismo mecanismo (letras S/MB/B; días 0 a 999).

### ④ Colectas

1. Concepto, aporte **sugerido** por alumno y fecha del acuerdo.
2. La lista de alumnos con una casilla «Dio» (L), otra «Fecha» y otra
   opcional «N.º de recibo viejo». Atajos:
   «✓ dio lo sugerido» en cada fila (un toque, sin arrastrar).
3. Casilla para marcar a quién **no le corresponde**, y, si le corresponde
   menos (hermanos, beca parcial), cuánto le corresponde a él
   (`monto_aplicable`). A quien no le corresponde **no le falta nada**.
   Varios pagos del mismo alumno (abonos) se escriben en renglones separados,
   cada uno con su fecha; cada abono tendrá su propio recibo.
4. **Control contra el papel**: el docente escribe «Total que tengo anotado
   en el cuaderno». La pantalla compara con la suma calculada de lo escrito y
   muestra «Coincide ✓» o «Diferencia: L 50.00 ✗». Se puede guardar igual con
   diferencia, pero tiene que tocar «Guardar con la diferencia».
5. Gastos de la colecta: fecha, concepto, monto.

**Gastos del docente** (en el mismo paso, pestaña aparte): un renglón por
gasto con fecha, tipo, concepto, a quién se cobra, si tiene recibo y monto;
debajo de cada uno, un renglón por **cada reembolso** ya recibido (fecha y
monto). El estado y los días de espera no se escriben: los calcula la app.

**Número de recibo.** Cada pago guardado recibe de la base un número nuevo,
único en todo el sistema y que no cambia nunca (`RC-27-K7QM-0001`: año, serie
del docente, correlativo). No sale del número de lista. El número viejo, si lo
hay, queda al lado como «Recibo anterior» para que la familia lo reconozca.

Validación de montos:

| caso | qué ve el docente |
|---|---|
| `150`, `150.00`, `150,50`, `L 150` | se entiende como 150.00 / 150.50 (coma o punto con **1 o 2** cifras = centavos) |
| `1,500` o `1.500` | **se pregunta**: «¿**Mil quinientos** (L 1,500.00) o **uno con cincuenta** (L 1.50)?», dos botones. Nunca se adivina |
| más de dos decimales | ✗ «Los centavos llevan dos cifras» |
| 0 o vacío | «no dio» (no se crea un pago) |
| negativo o letras | ✗ |
| mayor que el sugerido | se permite (hermanos, donación); se muestra «más que lo sugerido» |
| mayor que 10 veces lo sugerido | ⚠ «¿Seguro? Es 10 veces lo sugerido» (para atrapar un cero de más) |
| ese alumno ya tiene pagos en esta colecta | se muestran al lado («ya dio L 50.00 el 3 de marzo»). Lo que se escribe aquí es un **abono más**, con su propio recibo; nunca cambia el pago guardado. Para corregir un pago guardado se usa «Corregir» en la colecta (anula y reemplaza) |
| «N.º de recibo viejo» (opcional) | si la familia ya tiene un recibo del sistema anterior, se copia aquí (`RC-03EX-12`). Se valida la forma `RC-` + letras y números + `-` + número; no se puede repetir en otro pago |

Los montos se manejan como texto decimal hasta llegar a la base (`numeric`)
y vuelven como texto: nunca pasan por un número de coma flotante. En pantalla
y en la cola se guardan como cadena `"150.50"`; las sumas de control usan
centavos enteros (ver `03`, sección 3.11).

## 4.3 La vista previa

Antes de guardar, en cada paso:

```
Vas a guardar en 6º-1 · Escuela (ficticia) Las Flores · 2027

  Alumnos nuevos ............ 41   ✓
  Alumnos que ya estaban .... 2    (no se tocan)
  Falta identidad ........... 3    ⚠ se guardan igual
  Filas con error ........... 1    ✗ no se guardan  [ver cuál]

            [ Volver a revisar ]      [ Guardar 41 alumnos ]
```

- Las filas con ✗ **no** se guardan y la pantalla dice cuáles y por qué.
- Al tocar «Guardar», las filas entran a la cola en orden (alumnos antes que
  sus familias, colectas antes que sus pagos) y la pantalla pasa a «Guardando…»
  y luego «Guardado», como en el resto de la app.

## 4.4 Formato para importar datos extraídos de documentos escaneados

Pensado para más adelante: un programa (o un servicio de lectura de
documentos) lee las fotos del cuadro de notas o del cuaderno de colectas y
produce **un archivo** con este formato. La app lo abre en la **misma vista
previa** de 4.3: nada se guarda sin que el docente lo vea y lo confirme.

- Esquema: `formato-importacion.schema.json` (JSON Schema 2020-12).
- Ejemplo con datos **ficticios**: `ejemplo-importacion.json`.

Reglas del formato:

1. **Sin ids de la base.** El archivo no trae uuids ni números de lista como
   llave. Cada alumno trae una `ref` local («a1», «a2»…) solo para unir sus
   notas y pagos dentro del mismo archivo. **La importación nunca reutiliza un
   id que venga en un archivo**: aunque un archivo traiga un campo `id`, se
   ignora; cada fila nueva recibe un id generado en el aparato al armar la
   vista previa (`crypto.randomUUID`).
2. **Emparejar con lo guardado**: por `identidad` (país + documento), que une
   sola. Si no hay identidad y el nombre coincide, se **pregunta** «¿Es la
   misma persona?» con dos botones (como en 4.2). Si coincide con dos, el
   docente elige. **Nunca** por número de lista ni por posición.
3. **Montos y notas como texto** (`"150.00"`, `"85"`), tal como se leyeron.
   La app los valida con las mismas reglas de 4.2.
4. **Confianza y procedencia** por dato: `confianza` (0 a 1) y `fuente`
   (página y celda o renglón). La vista previa marca en amarillo, con ⚠ y la
   palabra «revisar», todo lo que tenga confianza menor que 0.9, y deja ver el
   recorte de la foto si el archivo trae la imagen.
5. **El archivo no decide**: un dato que contradice a uno ya guardado se
   muestra como «cambia de X a Y», y el docente lo acepta o lo descarta fila
   por fila. Por defecto, los cambios a datos ya guardados vienen **sin
   marcar**.
6. Versionado: `"formato": "metas-importacion/1"`. Un archivo de otra versión
   se rechaza con una frase clara.

### Lo que la vista previa mostraría con `ejemplo-importacion.json`

| dato | resultado |
|---|---|
| identidad de «Alumna Ficticia Uno» `0000-2015-00001` | se limpia a 13 dígitos ✓ |
| identidad de «Alumno Ficticio Dos» `0000201500O02` (confianza 0.62) | ✗ trae una letra O en lugar de un cero; ⚠ «revisar», con el recorte de la foto |
| «Alumna Ficticia Tres» sin identidad | se guarda con la marca «falta identidad»; trae su clave de familia ya entregada `3-QXWZ` |
| nota `7O` (confianza 0.55) | ✗ no es un número; ⚠ «revisar» |
| pago `50,00` | se entiende como 50.00 ✓ |
| total en papel L 150.00 contra lo sumado L 125.00 | «Diferencia: L 25.00 ✗»; hay que tocar «Guardar con la diferencia» o corregir |
| «Alumno Ficticio Cuatro», documento de Guatemala (CUI) | se acepta: el formato de 13 dígitos solo se exige a documentos hondureños |
| pago de «Alumna Ficticia Uno» con `recibo_anterior` `RC-03EX-01` | se guarda con su recibo nuevo (lo numera la base) y el viejo al lado |
