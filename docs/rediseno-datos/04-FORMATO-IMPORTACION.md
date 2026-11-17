# 4b. Formato del archivo de importación (`metas-importacion/1`)

Revisión 11. Complementa a `04-CARGA-RAPIDA.md` (4.4). Es el formato EXACTO
que acepta «Importar un archivo» en Mi aula (Alumnos → Pegar una lista →
📂 Importar un archivo), lo lee `js/datos/importar.js` y lo valida el
esquema `formato-importacion.schema.json` (JSON Schema 2020-12). El ejemplo
completo, con datos **ficticios**, es `ejemplo-importacion.json` (al final de
esta página).

## 1. Reglas que no cambian

1. **Un archivo, un aula.** Trae el aula y lo que es de ella: alumnos y sus
   familias, notas, colectas con sus pagos y gastos. También puede traer los
   gastos del docente («Gastos de mi bolsillo») y el inventario del aula.
2. **Sin ids de la base.** Cada alumno y cada colecta llevan una `ref` local
   («a1», «c1») solo para unir sus notas y sus pagos dentro del archivo. Un
   campo `id` que venga en el archivo no se usa nunca.
3. **Nada se guarda sin la vista previa.** La pantalla muestra qué es nuevo
   (✓), qué ya estaba (no se toca), qué cambia un dato guardado (viene SIN
   marcar), qué se leyó con duda (⚠ revisar), qué hay que responder (dos
   botones) y qué no se puede guardar (✗ y por qué). Solo al tocar
   «Guardar N datos nuevos» entra a la cola, una vez.
4. **No se importa dos veces lo mismo.** Cada fila nueva recibe un id que sale
   de su contenido (ver 5). Volver a abrir el mismo archivo muestra todo como
   «ya estaba» y el botón dice «No hay nada nuevo en este archivo». Lo mismo si
   el archivo se importa en otro aparato, con o sin señal.
5. **Números como texto, tal como se leyeron.** Notas y montos van como texto
   (`"85"`, `"150.00"`, `"50,00"`). La app los valida con las reglas de 4.2 y
   nunca los pasa por un número con decimales flotantes (regla 19).
6. **Versión.** `"formato": "metas-importacion/1"`. Un archivo de otra versión
   se rechaza con la frase «Ese archivo es de otra versión. Pide el archivo de
   importación de M.E.T.A.S, versión 1.»

## 2. El dato «leído» (`texto_leido`)

Todo lo que viene de leer un papel (nombre, identidad, nota, monto) puede ir
de dos formas:

```json
"85"
```

```json
{ "texto": "7O", "confianza": 0.55,
  "fuente": { "archivo": "lista", "pagina": 1, "renglon": 2, "columna": "Nota",
              "recorte": [0.62, 0.11, 0.2, 0.03] } }
```

| campo | tipo | qué es |
|---|---|---|
| `texto` | texto, hasta 160 | lo que se leyó, sin corregir |
| `confianza` | número de 0 a 1 | menor que **0.9**: la fila sale con ⚠ «revisar: se leyó con duda» |
| `fuente` | objeto | de qué archivo, página, renglón y columna salió; `recorte` = x, y, ancho, alto de 0 a 1 |

## 3. El archivo, sección por sección

Arriba: `formato` (obligatorio), `origen` (obligatorio), `aula`
(obligatorio) y, si los hay, `alumnos`, `notas`, `colectas`, `pagos`,
`gastos_docente`, `inventario`. Nada más (otro campo hace el archivo inválido).

### 3.1 `origen`

| campo | obligatorio | qué es |
|---|---|---|
| `tipo` | sí | `escaneo`, `hoja_calculo`, `manual` o `sace` |
| `generado_at` | sí | fecha y hora ISO 8601 en que se armó el archivo |
| `programa` | no | qué lo armó, hasta 80 letras |
| `archivos` | no | lista de `{ id, nombre, paginas }` de las fotos o papeles leídos; `fuente.archivo` apunta a ese `id` |

### 3.2 `aula`

| campo | obligatorio | regla |
|---|---|---|
| `escuela` | sí | 1 a 160 letras |
| `codigo_centro` | no | hasta 30 |
| `grado` | sí | 0 (Prebásica) a 12 |
| `seccion` | sí | 1 a 3 letras o números; se muestra como `6º-1` |
| `anio_lectivo` | sí | 2020 a 2100 |
| `asignaturas` | no | nombres; se suman a las que ya tenga el aula |

Si el docente ya tiene un aula con la misma escuela (sin importar tildes ni
mayúsculas), grado, sección y año, se usa esa. Si no, se crea.

### 3.3 `alumnos` (hasta 99)

| campo | obligatorio | regla y qué ve el docente |
|---|---|---|
| `ref` | sí | `a1`, `a2`… (letra minúscula y hasta 19 letras, números, `_` o `-`) |
| `nombre_completo` | sí | dato leído; 3 a 120 letras. Con una sola palabra: ⚠ «¿Falta el apellido?» |
| `identidad` | no | dato leído; se limpian guiones y espacios. Hondureña: 13 dígitos (con una letra: ✗ «trae una letra donde va un número»; con otra cantidad: ✗ «tiene 12 dígitos; debe tener 13»). Otro país: 4 a 25 letras y números. Vacía: ⚠ «Falta identidad» y se guarda igual |
| `documento_pais` | no | dos letras ISO, `HN` si falta |
| `documento_tipo` | no | `identidad` (si falta), `cui`, `partida`, `pasaporte`, `otro` |
| `num_lista` | no | 1 a 99. Solo visual: **nunca** se usa para emparejar |
| `sexo` | no | `F` o `M` |
| `fecha_nacimiento` | no | `AAAA-MM-DD` |
| `encargado` | no | nombre del encargado (va a la familia) |
| `telefono` | no | 8 a 20 números, espacios, `+`, `(`, `)` o `-`; si no se entiende, ⚠ y se guarda la familia sin él |
| `clave_familia` | no | la clave que la familia ya tiene en papel, como `15-K7QM` (ver 3.4) |

**Emparejar con lo guardado** (por alumno, en el aula):

- misma identidad y país: es el mismo alumno, «ya estaba»;
- mismo nombre (sin importar tildes, mayúsculas ni espacios) y a uno de los
  dos le falta la identidad: «¿… es la misma persona que ya tienes (n.º 12)?»
  con [Es la misma] [Es otra persona]. Sin respuesta, esa fila no se guarda;
- la misma identidad dos veces en el archivo: ✗ en la segunda.

### 3.4 Familias (de `alumnos`)

Un alumno con `clave_familia`, `encargado` o `telefono` trae su familia. Si el
alumno ya tiene familia, «ya estaba».

| la clave del archivo… | qué pasa |
|---|---|
| está en la copia de las claves viejas del docente (`metas.claves_archivo`, tomada en el paso 1) | se **conserva**: la familia sigue entrando con la tira que ya tiene |
| era de **otro niño** en esa copia | «En tus datos anteriores, la clave 1-K7QM era de **Ana López**. ¿Es la misma familia?» [Sí] [No, darle una nueva] |
| ya abre **otra familia** | ⚠ «Esa clave ya es de la familia de Ana: se le da una nueva. Entrega tira nueva» |
| no está en la copia | ⚠ «Esa clave no está en tus datos anteriores: se le da una nueva. Entrega tira nueva» |
| sin señal (no se pudo leer la copia) | ⚠ «La clave … se comprueba cuando haya señal»; la base la acepta o la rechaza (`MT020`) |

Pasado el paso 4 (claves viejas vencidas) la base ya no conserva ninguna:
pone una nueva y la tira nueva sale en «Mi aula».

### 3.5 `notas`

| campo | obligatorio | regla |
|---|---|---|
| `alumno` | sí | `ref` de un alumno del archivo |
| `asignatura` | sí | nombre; si el aula no la tiene, se crea |
| `periodo` | sí | `I`, `II`, `III`, `IV` o `REC` (recuperación) |
| `componente` | no | `final` (si falta), `acumulativo`, `examen` |
| `valor` | sí | dato leído; 0 a 100; `85,5` se acepta con ⚠ «El SACE usa números enteros»; letras o fuera de rango: ✗ |

Si ese alumno ya tiene nota en esa asignatura, parcial y componente: igual,
«ya estaba»; distinta, «Cambiar de 78 a 85» **sin marcar**. Solo si el
docente la marca, se edita la fila existente (nunca se crea otra).

### 3.6 `colectas`

| campo | obligatorio | regla |
|---|---|---|
| `ref` | sí | `c1`, `c2`… |
| `concepto` | sí | 1 a 120 letras |
| `monto_sugerido` | sí | dato leído; monto (ver 3.10) |
| `fecha` | sí | `AAAA-MM-DD`, la del acuerdo |
| `total_en_papel` | no | dato leído; lo que dice el cuaderno |
| `no_corresponde` | no | lista de `ref` de alumnos a quienes no les toca (no les falta nada) |
| `gastos` | no | lista de `{ fecha, concepto (1 a 160), monto }` de la colecta |

Una colecta con el mismo concepto y la misma fecha que una ya guardada en el
aula es esa misma. **Control contra el papel**: si `total_en_papel` no es
igual a la suma de los pagos que se van a guardar, sale «Total en el cuaderno
L 150.00 · sumado L 100.00 · Diferencia: L 50.00 ✗» y la colecta, con sus
pagos, gastos y exenciones, **espera** hasta tocar «Guardar con la diferencia».

### 3.7 `pagos`

| campo | obligatorio | regla |
|---|---|---|
| `colecta` | sí | `ref` de una colecta del archivo |
| `alumno` | sí | `ref` de un alumno del archivo |
| `monto` | sí | dato leído; `0` o vacío = «no dio», no se crea pago |
| `fecha` | sí | `AAAA-MM-DD` |
| `recibo_anterior` | no | `RC-` + 2 a 8 letras o números + `-` + 1 a 4 números (`RC-03EX-01`). Si ya está en otro pago del docente: ⚠ y este se guarda sin él |

Cada renglón es un abono, con su propio recibo nuevo (lo numera la base:
`RC-27-K7QM-0001`); el viejo queda al lado. Más que lo sugerido: «Más que lo
sugerido»; más de 10 veces: ⚠ «¿Seguro? Es más de 10 veces lo sugerido».

### 3.8 `gastos_docente` («Gastos de mi bolsillo»)

| campo | obligatorio | regla |
|---|---|---|
| `fecha` | sí | `AAAA-MM-DD` |
| `concepto` | sí | 1 a 160 letras |
| `monto` | sí | dato leído; mayor que cero |
| `tipo` | no | `copias`, `transporte`, `materiales`, `refrigerio`, `servicio`, `otro` (si falta) |
| `cobrar_a` | no | a quién se le cobra, hasta 120 (`Dirección` si falta) |
| `tiene_recibo` | no | `true` / `false` |
| `escuela` | no | si falta, la del aula |
| `reembolsos` | no | lista de `{ fecha, monto, quien_pago }`: lo que ya le devolvieron |

El estado («me lo pagaron» o pendiente) no se escribe: se calcula de los
reembolsos. Los gastos son del docente, no del aula: el mismo gasto (fecha,
concepto y monto) en otro archivo es el mismo gasto.

### 3.9 `inventario` (Inventario del aula)

| campo | obligatorio | regla |
|---|---|---|
| `fecha` | sí | `AAAA-MM-DD` |
| `nombre` | sí | 3 a 120 letras |
| `dueno` | no | `mio` (del docente), `escuela` (si falta) o `donado` |
| `categoria` | no | `tecnologia`, `mobiliario`, `didactico`, `libros`, `aseo`, `deporte`, `otro` |
| `cantidad` | no | entero desde 1 |
| `valor` | no | dato leído; monto por unidad |
| `nota` | no | hasta 200 (para lo que no es donado) |
| `donante` | no | hasta 120 (para lo donado) |
| `tiene_recibo` | no | `true` / `false` |

El inventario todavía vive en el blob (corte 3): se suma al de este aparato y
viaja con la sesión (`metas.blob_guardar`).

### 3.10 Montos

`150`, `150.00`, `150,50`, `L 150` = 150.00 / 150.50. `1,500` o `1.500`
**se pregunta** con dos botones: «¿Quisiste decir L 1,500.00 o L 1.50?».
Tres o más decimales: ✗ «Los centavos llevan dos cifras». Negativo o letras: ✗.
La pregunta respondida se queda a la vista con ✓ en lo elegido.

## 4. El orden al guardar

Aula → asignaturas → alumnos → familias → notas → colectas → «no le
corresponde» → pagos → gastos de colecta → gastos del docente → reembolsos →
inventario. Cada fila entra a la cola como una operación normal (03, 3.7):
sin señal se queda en el aparato y sale sola cuando vuelve.

## 5. Por qué no se duplica (cómo se arma cada id)

Cada id es un uuid (versión 8, RFC 9562) hecho con SHA-256 de la cuenta del
docente y de lo que identifica a la fila, nunca del orden en el archivo:

| fila | sale de |
|---|---|
| aula | escuela + grado + sección + año |
| asignatura | aula + nombre |
| alumno | aula + identidad (o el nombre, y cuántas veces se repite en el archivo) |
| familia | alumno |
| nota | alumno + asignatura + parcial + componente |
| colecta | aula + concepto + fecha |
| pago | colecta + alumno + monto + fecha + recibo anterior + cuántos iguales hay en el archivo |
| gasto de colecta | colecta + fecha + concepto + monto + repetición |
| gasto del docente | fecha + concepto + monto + repetición |
| reembolso | gasto + fecha + monto + repetición |
| bien del inventario | fecha + nombre + dueño + repetición |

Y cada operación lleva un id que sale del de su fila. Así, si el mismo dato
llega dos veces a la base (el mismo archivo en dos aparatos, o «Guardar» dos
veces sin señal), la base reconoce la MISMA operación y responde «ya
estaba». Un archivo vuelto a escanear con un pago más trae solo ese pago.

## 6. Cómo comprobar un archivo antes de dárselo al docente

```bash
python3 -c "import json, jsonschema; jsonschema.Draft202012Validator(json.load(open('docs/rediseno-datos/formato-importacion.schema.json')), format_checker=jsonschema.FormatChecker()).validate(json.load(open('mi-archivo.json'))); print('cumple el formato')"
```

Pruebas: capa B (B13: vista previa, guardar, reimportar en el mismo aparato
y en otro sin señal, totales = suma de los pagos) y capa C (C16: la vista
previa en el navegador, con sus preguntas, y reimportar sin duplicar).

## 7. Ejemplo ficticio (`ejemplo-importacion.json`)

Lo que muestra la vista previa con este archivo, sin responder nada:

| dato | resultado |
|---|---|
| aula `6º-1 · Escuela Ficticia Las Flores · 2027` | nueva (o la que ya exista) |
| «Alumna Ficticia Uno Prueba», `0000-2015-00001`, clave `2-PRBA` | ✓; la identidad se limpia a 13 dígitos; la clave se conserva si está en la copia del docente |
| «Alumno Ficticio Dos Prueba», identidad `0000201500O02` (confianza 0.62) | ✗ «trae una letra donde va un número» y ⚠ revisar; su nota y su pago tampoco se guardan |
| «Alumna Ficticia Tres Prueba», sin identidad, clave `3-QXWZ` | ✓ con ⚠ «Falta identidad»; la clave no estaba: se le da una nueva y hay que entregar tira |
| «Alumno Ficticio Cuatro Prueba», CUI de Guatemala | ✓ (los 13 dígitos solo se piden al documento hondureño) |
| nota `7O` (confianza 0.55) | ✗ no es una nota; ⚠ revisar |
| nota `85,5` | ✓ con ⚠ «El SACE usa números enteros» |
| colecta: cuaderno L 150.00, sumado L 100.00 | «Diferencia: L 50.00 ✗»; espera a «Guardar con la diferencia» |
| pago de a1 con `RC-03EX-01` | se guarda con su recibo nuevo y el viejo al lado |
| dos abonos de L 25.00 de a3 | dos pagos, cada uno con su recibo |
| gasto «Pintura para el aula» `1,500` | «¿Quisiste decir L 1,500.00 o L 1.50?» con dos botones |
| gasto «Copias de la guía de lectura» L 120.00 con su reembolso | queda como «me lo pagaron» |
| inventario: parlante (mío) y 5 diccionarios (donados) | se suman al inventario del aula |

```json
{
  "formato": "metas-importacion/1",
  "origen": {
    "tipo": "escaneo",
    "generado_at": "2027-02-10T15:20:00-06:00",
    "programa": "lector de documentos (ejemplo)",
    "archivos": [
      { "id": "lista", "nombre": "foto-lista.jpg", "paginas": 1 },
      { "id": "cuaderno", "nombre": "foto-cuaderno-colecta.jpg", "paginas": 1 }
    ]
  },
  "aula": {
    "escuela": "Escuela Ficticia Las Flores",
    "codigo_centro": "000000000",
    "grado": 6,
    "seccion": "1",
    "anio_lectivo": 2027,
    "asignaturas": ["Español", "Matemáticas", "Ciencias Naturales", "Estudios Sociales"]
  },
  "alumnos": [
    {
      "ref": "a1", "num_lista": 1,
      "nombre_completo": { "texto": "Alumna Ficticia Uno Prueba", "confianza": 0.98,
                           "fuente": { "archivo": "lista", "pagina": 1, "renglon": 1 } },
      "identidad": { "texto": "0000-2015-00001", "confianza": 0.95,
                     "fuente": { "archivo": "lista", "pagina": 1, "renglon": 1, "columna": "Identidad" } },
      "sexo": "F", "fecha_nacimiento": "2015-04-12",
      "encargado": "Madre Ficticia Uno", "telefono": "9999-0001", "clave_familia": "2-PRBA"
    },
    {
      "ref": "a2", "num_lista": 2,
      "nombre_completo": { "texto": "Alumno Ficticio Dos Prueba", "confianza": 0.97,
                           "fuente": { "archivo": "lista", "pagina": 1, "renglon": 2 } },
      "identidad": { "texto": "0000201500O02", "confianza": 0.62,
                     "fuente": { "archivo": "lista", "pagina": 1, "renglon": 2, "columna": "Identidad",
                                 "recorte": [0.62, 0.11, 0.2, 0.03] } },
      "sexo": "M"
    },
    { "ref": "a3", "num_lista": 3, "nombre_completo": "Alumna Ficticia Tres Prueba", "sexo": "F",
      "encargado": "Padre Ficticio Tres", "clave_familia": "3-QXWZ" },
    { "ref": "a4", "num_lista": 4, "nombre_completo": "Alumno Ficticio Cuatro Prueba",
      "identidad": "0000000000001", "documento_pais": "GT", "documento_tipo": "cui", "sexo": "M" }
  ],
  "notas": [
    { "alumno": "a1", "asignatura": "Matemáticas", "periodo": "I", "valor": { "texto": "85", "confianza": 0.99 } },
    { "alumno": "a2", "asignatura": "Matemáticas", "periodo": "I", "valor": { "texto": "7O", "confianza": 0.55 } },
    { "alumno": "a3", "asignatura": "Matemáticas", "periodo": "I", "valor": "92" },
    { "alumno": "a4", "asignatura": "Matemáticas", "periodo": "I", "valor": "85,5" },
    { "alumno": "a1", "asignatura": "Español", "periodo": "I", "valor": "90" }
  ],
  "colectas": [
    {
      "ref": "c1", "concepto": "Excursión al museo (ficticia)", "monto_sugerido": "50.00", "fecha": "2027-02-01",
      "total_en_papel": { "texto": "150.00", "confianza": 0.9,
                          "fuente": { "archivo": "cuaderno", "pagina": 1, "renglon": 12 } },
      "no_corresponde": ["a4"],
      "gastos": [ { "fecha": "2027-02-05", "concepto": "Entradas", "monto": "40.00" } ]
    }
  ],
  "pagos": [
    { "colecta": "c1", "alumno": "a1", "monto": "50.00", "fecha": "2027-02-02", "recibo_anterior": "RC-03EX-01" },
    { "colecta": "c1", "alumno": "a2", "monto": { "texto": "50,00", "confianza": 0.93 }, "fecha": "2027-02-03" },
    { "colecta": "c1", "alumno": "a3", "monto": "25.00", "fecha": "2027-02-03" },
    { "colecta": "c1", "alumno": "a3", "monto": "25.00", "fecha": "2027-02-10" }
  ],
  "gastos_docente": [
    { "fecha": "2027-02-05", "tipo": "copias", "concepto": "Copias de la guía de lectura", "cobrar_a": "Dirección",
      "monto": "120.00", "tiene_recibo": true,
      "reembolsos": [ { "fecha": "2027-02-20", "monto": "120.00", "quien_pago": "Dirección" } ] },
    { "fecha": "2027-02-08", "tipo": "materiales", "concepto": "Pintura para el aula", "cobrar_a": "Sociedad de Padres",
      "monto": { "texto": "1,500", "confianza": 0.95 } }
  ],
  "inventario": [
    { "fecha": "2027-01-20", "nombre": "Parlante (ficticio)", "dueno": "mio", "categoria": "tecnologia",
      "cantidad": 1, "valor": "850.00", "tiene_recibo": true },
    { "fecha": "2027-01-25", "nombre": "Diccionarios (ficticios)", "dueno": "donado", "categoria": "libros",
      "cantidad": 5, "donante": "Familia Ficticia Cinco" }
  ]
}
```

## 8. Si el archivo no traía familias: «Preparar claves de familia»

Un aula traída sin la sección de familias deja a cada alumno sin fila en
`metas.familias`, y sin esa fila no hay tira en el talonario. En **Mi aula ›
Alumnos**, junto a «Pegar una lista», el botón **🔑 Preparar claves de
familia** (`js/datos/claves-familia.js`) arma, con señal, la vista previa de
las fichas que faltan en el aula que se ve. No guarda nada hasta «Guardar».
No es `metas.familias_preparar_claves_nuevas` (esa pone la tira siguiente a
fichas que ya existen) y no la llama.

Lee los alumnos del aparato, las fichas del docente en la base (todas sus
aulas) y sus claves de antes (`metas.claves_archivo`). Para cada alumno que
sigue en el aula y no tiene ficha:

| caso | qué propone |
|---|---|
| una sola clave libre con su mismo nombre (sin tildes ni mayúsculas), y nadie más sin ficha con ese nombre | conservarla, si el número de la clave cuadra con su número de lista; si no cuadra, **pregunta** |
| la clave de su número de lista era de otro nombre que ya no está en la lista | **pregunta**: «En tus datos anteriores, la clave 15-K7QM era de … ¿Es la misma familia?» [Sí] [No, darle una nueva] |
| una sola clave sin nombre con su número, y nadie más sin ficha con ese número (en ninguna de sus aulas) | conservarla |
| varias claves posibles (dos con el 15, el mismo nombre repetido) | **pregunta** cuál, con un botón por clave y «Ninguna, darle una nueva» |
| ninguna | la base pone una nueva: «Se le da una clave nueva. Entrega tira nueva» |
| la clave con su nombre ya abre la familia de otro alumno | nueva, y el aviso dice de quién |
| ya tiene ficha | «ya estaba»; no se toca |

Libre quiere decir que no la usa ninguna ficha del docente (ni como clave ni
como siguiente) ni ya se le propuso a otro alumno en esta misma vista previa.
Una clave que un nombre del archivo le da a OTRO alumno suyo no se le ofrece
a este por el número. Sin respuesta, esa fila no se anota.

Al guardar: `crear('familias', { id, aula_id, alumno_id, clave? })` con el id
y la operación que salen del alumno (como en 5: `familia` + alumno). La
clave se manda solo cuando se conserva; la base la acepta si estaba en la
copia de ESE docente (`metas._clave_era_mia`) y, si no se manda, sortea una
de 10 símbolos. Tocar dos veces, u otro aparato con el mismo plan, cae en la
misma fila. La lista de alumnos muestra la clave de cada uno, solo para leer.

Pruebas: capa B, B14; capa C, C17.
