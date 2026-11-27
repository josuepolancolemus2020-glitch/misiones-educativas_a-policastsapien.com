# Plan: misiones de Español del primer parcial, 7.º a 11.º

Diagnóstico hecho el 22 de noviembre de 2026 sobre `main` en `f04b745` (v582),
en la rama `plan/espanol-primer-parcial`. **Aquí no hay misiones ni código**:
solo qué pide el currículo, qué ya tenemos, qué falta y en qué orden hacerlo
para tenerlo listo el 6 de diciembre. Corregido el mismo día con lo que
dijo Josué: SEDUC reparte por meses y el primer parcial es febrero y marzo.
**Rehecho el 24 de noviembre** con las programaciones mensuales oficiales de
7.º a 9.º, que ya están en el repositorio (commit `631c625`).

Cómo leer las marcas:

- **[DCNB p. N]** o **[CNB p. N]**: lo dice el documento oficial, en esa página
  del PDF (la que muestra el visor, no el folio impreso; en el DCNB de III
  ciclo el folio impreso es el del visor más 4).
- **[Prog. 7-9, PDF p. N]**: lo dice la programación mensual oficial de
  SEDUC, `_dev/dcnb-pdf/programacion-espanol-7-9.pdf`, en esa página del
  visor (el folio impreso es 4 menos).
- **propuesta, pendiente de confirmar con la programación mensual**: el mes
  en que va un contenido de 10.º u 11.º. No hay programación mensual de Media
  en el repositorio, así que ninguno de esos meses es oficial.
- **[criterio del plan]**: decisión mía, razonada, que ningún documento
  oficial dice. Se puede cambiar.
- **[pendiente de verificar]**: no lo pude confirmar. No se usa como dato
  hasta que alguien lo acredite con una fuente que quede en `_dev/`.

Fuentes leídas (todas en el repositorio):

| grado | documento | páginas | trozo convertido |
|---|---|---|---|
| 7.º | `_dev/dcnb-pdf/dcneb-basica-iii-ciclo.pdf` | 84 a 115 | `_dev/dcnb/dcneb-basica-iii-ciclo-24` a `-26` |
| 8.º | el mismo | 116 a 156 | `-27` a `-30` |
| 9.º | el mismo | 157 a 194 | `-31` a `-34` |
| 10.º BCH | `_dev/dcnb-pdf/cnb-media-bch-ciencias-y-humanidades.pdf` | 11 a 17 | `cnb-media-bch-...-05-espanol-decimo-grado.md` |
| 11.º BCH | el mismo | 109 a 113 | `cnb-media-bch-...-18-espanol-undecimo-grado.md` |
| 10.º y 11.º BTP | `cnb-media-btp-administracion-empresas-2025.pdf` | 12 a 18 y 94 a 105 | `cnb-media-btp-administracion-empresas-2025-06` y `-17` |

Los contenidos de 7.º, 8.º y 9.º se sacaron del Markdown y se comprobaron
página por página con `pdftotext` sobre el PDF.

---

## 0. De dónde sale el primer parcial

**Desde el 24 de noviembre de 2026 las programaciones mensuales oficiales de
SEDUC están en el repositorio** (commit `631c625`):

- `_dev/dcnb-pdf/programacion-espanol-7-9.pdf` (50 páginas), «Programaciones
  de Español y Matemáticas» de séptimo a noveno grado, que según su
  presentación «servirán para orientar mes a mes su labor en el aula»
  [PDF p. 3].
- Su Markdown en `_dev/dcnb/programacion-espanol-7-9-*.md` (índice en
  `_dev/dcnb/INDICE.md`).

Cómo está hecha: por grado, una página por mes; **febrero y marzo van en un
solo bloque, que es el primer parcial**; luego abril, mayo, junio y así hasta
octubre. Cada página tiene tres franjas, **Lengua oral, Lectura y Escritura**,
con el estándar a la izquierda y los contenidos conceptuales y actitudinales
a la derecha. No trae una franja aparte de reflexión sobre la lengua: la
gramática, la ortografía y el vocabulario van dentro de las tres.

**Cómo se cita en este plan:** `[Prog. 7-9, PDF p. N]`, con la página que
muestra el visor. El folio impreso es 4 menos (la p. 7 del PDF lleva impreso
«3»). Ojo con el Markdown: el convertidor rotuló como «Presentación» los
trozos 01 y 02, pero el 01 ya trae la programación de 7.º.

| grado | febrero y marzo | Markdown |
|---|---|---|
| 7.º | PDF p. 7 (folio 3) | `programacion-espanol-7-9-01-presentacion-1de2.md` |
| 8.º | PDF p. 15 (folio 11) | `programacion-espanol-7-9-03-comunicacion-1de4.md` |
| 9.º | PDF p. 23 (folio 19) | `programacion-espanol-7-9-04-comunicacion-2de4.md` |

Las tres páginas se leyeron en el PDF con `pdftotext -layout`, columna por
columna, no solo en el Markdown.

**Lo que sigue sin programación mensual:** 10.º y 11.º. Para Media solo está
el CNB, que no trae meses y que para 10.º deja el orden al docente: «Cada
docente puede considerar el orden en el que impartirá los contenidos de
acuerdo con la realidad y contexto de la comunidad educativa» [CNB BCH p. 17,
Notas]. 11.º BCH viene en cuatro unidades sin fechas [CNB BCH p. 110]. Por eso
**10.º y 11.º siguen como propuesta** sobre el CNB.

**El DCNB por bloques** (`_dev/dcnb-pdf/dcneb-basica-iii-ciclo.pdf`) queda como
referencia de fondo en la sección 1-bis: dice qué entra en el año, pero no en
qué mes.

### Si llegan programaciones de Media

Cuando se suban a `_dev/dcnb-pdf/`:

1. Nombrarlas sin acentos ni espacios, que digan nivel, grado y área (por
   ejemplo `programacion-espanol-10-bch.pdf`), como pide `_dev/dcnb-pdf/README.md`.
2. Probar una página: `python3 _dev/dcnb-a-markdown.py _dev/dcnb-pdf/<archivo>.pdf --prueba 10`.
3. Convertir: `python3 _dev/dcnb-a-markdown.py _dev/dcnb-pdf/<archivo>.pdf`.
4. Cambiar las filas «propuesta» de 10.º y 11.º por el contenido oficial con
   su página, y revisar si alguna misión cambia de parcial.

---

## 1. Febrero y marzo por grado

### 7.º grado · oficial [Prog. 7-9, PDF p. 7]

| franja | contenidos de febrero y marzo | misión |
|---|---|---|
| Lengua oral | La conversación en lengua estándar. Lenguaje verbal y no verbal | N1 |
| Lengua oral | Charlas y trabajo de equipo | N1 |
| Lengua oral | Superestructuras: la narración (el cuento de tradición oral) y la descripción (personajes) | N2 |
| Lengua oral | Concordancia, claridad, corrección, coherencia en el texto | N5 |
| Lengua oral | Sinónimos y antónimos. Lenguaje científico-técnico. Lenguaje popular, regional | N1, N6 |
| Lectura | Textos informativos: el periódico | N3 |
| Lectura | Textos funcionales: cartas personales | N3 |
| Lectura | Textos literarios: el cuento; descripción de personajes | N2 |
| Lectura | Síntesis: resúmenes, sinopsis | N4 |
| Lectura | Relación léxica: sinónimos, antónimos. Uso del diccionario. Vocabulario técnico. Regionalismos | N6 |
| Lectura | Diferencias entre lenguaje literario y no literario. Denotación y connotación | N6 |
| Lectura | Rapidez y corrección en la lectura. Textos y libros de su preferencia | N4 (lecturas de la misión) |
| Escritura | Planeación de textos; producción: borrador, revisión y versión final; el cuento | N5, N2 |
| Escritura | Esquemas y planes. Citas bibliográficas. Fichas bibliográficas | N4 |
| Escritura | Textos expositivos: informe interpretativo | N3 |
| Escritura | Párrafos descriptivos, narrativos y expositivos | N5 |
| Escritura | Uso de conectores. Reglas ortográficas | Marcadores Textuales, La Acentuación |
| Escritura | Sinónimos, antónimos | N6 |

Estándar de las tres franjas que también cuenta: «Utilizan y comprenden
lenguaje libre de discriminación sociocultural, étnica y de género» (N1).

### 8.º grado · oficial [Prog. 7-9, PDF p. 15]

| franja | contenidos de febrero y marzo | misión |
|---|---|---|
| Lengua oral | La conversación en lengua estándar: lenguaje verbal y no verbal. Entonación, énfasis y pausas | N1 |
| Lengua oral | Charlas. Diálogos | N1 |
| Lengua oral | Esquema estructural de la narración: inicio, desarrollo y cierre. Cuento de autores nacionales e hispanoamericanos | N2 |
| Lengua oral | El párrafo: concordancia, corrección, coherencia, claridad. La oración gramatical: sujeto, verbo, complemento | N5 |
| Lengua oral | «Perífrasis verbales: sinónimos y antónimos» (así viene escrito; ver nota) | N6 |
| Lengua oral | Lenguaje científico-técnico. Lenguaje popular y familiar | N1 |
| Lectura | Partes del libro, su función y su uso: glosario, capítulos, bibliografía | N4 |
| Lectura | Textos informativos: el periódico. La lectura como medio de transmisión de cultura | N3 (el periódico); la lectura como medio de transmisión de cultura, N2 (tanda 3) |
| Lectura | Textos funcionales: cartas de lector. Acta | N3 |
| Lectura | Textos narrativos: el cuento en Honduras. Descriptivos: biografía | N2 |
| Lectura | El comentario crítico, resúmenes, sinopsis | N4 |
| Lectura | El contexto: sinónimos, antónimos. Diccionarios especializados. Vocabulario técnico y científico | N6 |
| Lectura | Denotación y connotación. Lenguaje literario y no literario | N6 |
| Escritura | Planeación; borrador, revisión y versión final | N5 |
| Escritura | Texto funcional: carta personal, carta de venta | N3 |
| Escritura | Esquemas y planes. Citas bibliográficas. Fichas bibliográficas y hemerográficas. Resúmenes, sinopsis | N4 |
| Escritura | Textos literarios: cuento. Textos expositivos: la noticia | N2, N3 |
| Escritura | Tipos de párrafos por su forma elocutiva: descriptivos, narrativos, expositivos, persuasivos | N5 |
| Escritura | Uso de conectores: conjunciones temporales | Marcadores Textuales |
| Escritura | Reglas de acentuación | La Acentuación |

### 9.º grado · oficial [Prog. 7-9, PDF p. 23]

| franja | contenidos de febrero y marzo | misión |
|---|---|---|
| Lengua oral | La conversación en lengua estándar: verbal y no verbal. Fórmulas sociales de intercambio | N1 |
| Lengua oral | Charlas. Asambleas escolares | N1 |
| Lengua oral | Textos narrativos: el cuento de tradición oral. Esquema estructural: punto de vista (quien narra) | N2 |
| Lengua oral | Acentuación correcta: agudas, llanas, esdrújulas y sobresdrújulas | La Acentuación |
| Lengua oral | «Perífrasis verbales: sinónimos y antónimos» (ver nota) | N6 |
| Lengua oral | Lenguaje científico-técnico. Lenguaje popular, culto | N1 |
| Lectura | El periódico: postura, línea editorial, titulares, secciones, tipo de lectores | N3 |
| Lectura | Textos de consulta: diccionarios, atlas y enciclopedias especializadas | N4 |
| Lectura | Textos literarios: narrativos. El ensayo | N2 (narrativos); el ensayo, N5 |
| Lectura | La investigación fuera del libro: periódicos, revistas, otros (etapa analítica, interpretativa y evaluativa) | N4 |
| Lectura | Prefijos, sufijos. El contexto. Diccionarios especializados. Sinónimos y antónimos | N6 |
| Lectura | Lenguaje técnico. Neologismos. Polisemia. Siglas y acrónimos | N6 |
| Lectura | Denotación y connotación | N6 |
| Escritura | Planeación; borrador, revisión y versión final | N5 |
| Escritura | Texto funcional: el reglamento | N3 |
| Escritura | Esquemas y planes. Fichas bibliográficas y hemerográficas. Resúmenes | N4 |
| Escritura | Textos literarios: el ensayo | N5 |
| Escritura | Oraciones compuestas por coordinación: copulativas, disyuntivas, adversativas y explicativas | N5 |
| Escritura | Reglas de acentuación: agudas, llanas, esdrújulas y sobresdrújulas | La Acentuación |
| Escritura | Lenguaje científico-técnico; lenguaje popular, regional. Polisemia | N1, N6 |

**Notas sobre las tres páginas:**

- **«Perífrasis verbales: sinónimos y antónimos»** viene así en 8.º y 9.º, en
  la fila del estándar de lenguaje libre de discriminación. Puede ser una
  errata de la programación (las perífrasis verbales son un tema de
  gramática; sinónimos y antónimos, de vocabulario). Se trata en N6 como
  sinónimos y antónimos, y **las perífrasis verbales quedan pendientes de
  verificar** con Josué antes de enseñarlas como de febrero y marzo.
- **El estándar de lectura fluida** dice «a un promedio de x-y palabras por
  minuto (Sujeto a comprobación experimental en Honduras durante el año
  académico 2007)». No trae la cifra: ninguna misión da una meta de palabras
  por minuto.
- **No están en febrero y marzo**, aunque se pensaron para el plan anterior:
  - la oratoria con debate, panel y mesa redonda (abril en 7.º y 8.º; mesa
    redonda en abril en 9.º) [PDF pp. 8, 16 y 24];
  - el artículo de opinión y la argumentación (abril en 8.º y 9.º) [PDF
    pp. 16 y 24];
  - la homonimia (abril en 8.º y 9.º) [PDF pp. 16 y 24];
  - lengua, habla y norma (mayo en 8.º) [PDF p. 17];
  - la leyenda (abril en 7.º y 8.º), la topografía y la prosopografía (abril
    en 7.º) [PDF pp. 8 y 16];
  - **los parónimos no aparecen en ningún mes** de la programación de 7.º a 9.º.

### 10.º grado · propuesta, pendiente de confirmar con una programación mensual de Media (sobre el CNB BCH pp. 11 a 17)

| mes | criterio del CNB | contenido | misión |
|---|---|---|---|
| febrero | CE1.1, CE1.2 | La comunicación y sus elementos; funciones del lenguaje; elementos no verbales de la oralidad | N1 (apartado «Para Media») |
| febrero | CE2.1 (diagnóstico) | Categorías gramaticales | Sustantivos, Adjetivos, Pronombres, Verbos, Adverbios, El Adjetivo Avanzado |
| febrero | CE2.5 | La escritura como proceso: planificación, ejecución y revisión | N5 |
| marzo | CE1.5 | Situaciones comunicativas; el contexto y las personas del discurso | N1 |
| marzo | CE1.6 | Registros y procedimientos retóricos | N1 (registros); figuras retóricas, después |
| marzo | CE2.6, CE3.5 | Modos de organizar el discurso; relaciones semánticas | Los Tipos de Textos, N2, N6 |

### 11.º grado BCH · propuesta, pendiente de confirmar con una programación mensual de Media (sobre la Unidad I del CNB BCH p. 110)

| mes | criterio del CNB | contenido | misión |
|---|---|---|---|
| febrero | CE1.1, CE1.2 | Reglas básicas de lectura, redacción y expresión oral; reporte de lectura | N4, N5, N1 |
| febrero | RA1 (contenido) | Nivel morfológico del habla | Las cinco de gramática y El Adjetivo Avanzado |
| marzo | RA1 (contenido) | Estereotipos discriminatorios; lenguaje sin discriminación | N1 |
| marzo | CE1.3 | Técnicas grupales; la entrevista; el debate, la mesa redonda y el panel | **sin misión el 6 de diciembre** (la oratoria pasa al segundo parcial de Básica) |
| marzo | CE1.3 | Publicidad y propaganda | sin misión (después) |

**11.º BTP** [CNB BTP pp. 94 a 105], 3 horas por semana: **las mismas
misiones que el BCH** (decisión de Josué, 24 de noviembre), más vicios de
lenguaje y protocolo, que quedan para después.

---

## 1-bis. Referencia: el DCNB por bloques (sin meses)

Lo que el DCNB pone en todo el año. Sirve para ver qué viene después y para
los grados de Media; el mes lo manda la programación de la sección 1.

### 7.º grado [DCNB III ciclo, pp. 84 a 115]

| bloque | lo que abre el bloque | página |
|---|---|---|
| 1. Lengua oral | Contextos discursivos formales; la conversación en lengua estándar; fórmulas sociales de intercambio; indicadores de la intención comunicativa; los signos y la comunicación; el circuito del habla (hablante, oyente, mensaje, código, contexto) | 84 |
| 1. Lengua oral | Oratoria: propósitos comunicativos, estilística oral, voz, respiración y dicción, importancia del receptor. Formas de expresión oral: charlas, trabajos de equipo, asambleas escolares, paneles, foros, conferencias, debates, mesa redonda (el DCNB define cada una) | 84 y 85 |
| 1. Lengua oral | La entrevista; la escucha en presencia de interlocutores; contenido semántico del discurso (idea básica, intencionalidad explícita e implícita) | 85 |
| 1. Lengua oral | Niveles de uso de la lengua: formas orales (popular, familiar, vulgar, regionalismos), escritas (culto, científico o técnico, literario) y mixtas (publicitario, periodístico) | 86 |
| 1. Lengua oral | Superestructuras textuales: descripción y narración, semejanzas y diferencias | 86 |
| 2. Lectura | Etapas de la lectura: estructural o analítica (partes del libro: portada, índice, introducción, prólogo, cuerpo, bibliografía, glosario, anexo), interpretativa y crítica o evaluativa (resumen, sinopsis, mapa conceptual, juicio) | 88 |
| 2. Lectura | Lectura de investigación: fichas bibliográficas; el párrafo; fichas de trabajo (cita textual, resumen textual, resumen parafraseado, comentario personal); fichas hemerográficas | 89 y 90 |
| 2. Escritura | Estrategias de producción de textos: planeación, textualización (esquemas, borradores, citas bibliográficas) y revisión (progresión temática, coherencia y cohesión, léxico, diccionario) | 95 |
| 3. Literatura | Textos de tradición oral del país e internacionales: la leyenda, el mito, la fábula, el cuento de tradición oral, la anécdota | 103 |
| 4. Reflexión | Teoría lingüística: lengua, habla y norma; el signo lingüístico; historia del español (origen y formación); variedad lingüística (coloquial, estándar, formal); formas del lenguaje (oral, escrito, mímico, convencional) | 110 |

Estas tablas muestran lo que **abre** cada bloque del DCNB, no lo que va en
febrero y marzo. La programación (sección 1) mezcla en febrero y marzo cosas
del principio de un bloque con cosas de su mitad (por ejemplo el periódico,
los sinónimos y la ortografía de 7.º), y deja para más adelante otras que
abren un bloque (lengua, habla y norma; la entrevista). Manda la programación.

### 8.º grado [DCNB III ciclo, pp. 116 a 156]

| bloque | lo que abre el bloque | página |
|---|---|---|
| 1. Lengua oral | Contextos discursivos formales; signos lingüísticos y paralingüísticos en la conversación; fórmulas sociales de intercambio; mensajes orales, emisión y recepción | 116 |
| 1. Lengua oral | Oratoria: propósitos, estilística oral, voz, respiración y dicción, la expresión corporal, importancia del receptor | 116 |
| 1. Lengua oral | Formas de expresión oral: charla, diálogo, asamblea, debate, mesa redonda, foro, panel, conferencia, entrevista, trabajo en grupo. El discurso memorizado | 117 |
| 1. Lengua oral | La escucha (contenido semántico, intencionalidad); medios de comunicación social, la escucha mediatizada; niveles de uso de la lengua (las mismas formas que 7.º) | 118 |
| 1. Lengua oral | Superestructuras: descripción por tipo (topográfica, cronográfica, retrato, prosopográfica, etopeya) y narración (planteamiento, nudo, desenlace) | 119 |
| 2. Lectura | Etapas de la lectura (igual que 7.º) y significación social de la lectura | 121 y 122 |
| 2. Lectura | Lectura de investigación: fichas bibliográficas, el párrafo (idea principal e ideas secundarias), fichas de trabajo, fichas hemerográficas | 123 |
| 2. Escritura | Estrategias de producción de textos (igual que 7.º) | 131 |
| 3. Literatura | Tradición oral: el cuento popular, el mito, la fábula, las bombas, las adivinanzas, los refranes | 139 y 140 |
| 4. Reflexión | Teoría lingüística: lengua, habla y norma; español de América; influencia de las lenguas indígenas; lenguas habladas en Honduras; español hablado en Honduras (regionalismos, variedad) y rasgos del español de América (seseo, yeísmo, leísmo, voseo) | 149 |

### 9.º grado [DCNB III ciclo, pp. 157 a 194]

| bloque | lo que abre el bloque | página |
|---|---|---|
| 1. Lengua oral | Contextos discursivos formales; signos lingüísticos y paralingüísticos; fórmulas sociales; mensajes orales; oratoria (con la expresión corporal) | 157 |
| 1. Lengua oral | Formas de expresión oral: asamblea, debate, mesa redonda, foro, **simposio**, panel, charlas, conferencias. **El discurso**: concepto, cualidades del orador, tipos (leído, memorizado, improvisado, ex tempore), preparación | 158 |
| 1. Lengua oral | La escucha presencial o mediatizada; medios de comunicación social (radio, televisión) | 159 |
| 1. Lengua oral | Niveles de uso de la lengua, ahora con **modismos y jergas**; superestructuras descripción y narración | 160 |
| 2. Lectura | Etapas de la lectura y lectura de investigación con fichas (igual que 8.º) | 162 a 164 |
| 2. Escritura | Estrategias de producción de textos (igual que 7.º) | 171 |
| 3. Literatura | El ensayo literario; el testimonio; la autobiografía | 176 y 177 |
| 4. Reflexión | Teoría lingüística: lengua, habla y norma; variedades lingüísticas; **registros de distintas disciplinas**; estructura de textos argumentativos y enunciativos; coherencia | 187 |

### 10.º grado [CNB BCH pp. 11 a 17; el BTP de Administración, pp. 12 a 18, trae el mismo bloque de contenidos conceptuales]

Programa de 200 horas, 5 por semana. Sin orden obligatorio (ver sección 0).
La propuesta de la sección 1 parte de los contenidos del **RA1**, «Pronunciar
los discursos orales considerando sus elementos y características»:

- La comunicación y sus elementos (emisor, receptor, canal, mensaje, código,
  contexto) y las **funciones del lenguaje**: referencial, estética,
  metalingüística, fática, emotiva y apelativa (CE1.2).
- Elementos no verbales de la oralidad.
- El contexto en la pragmática y en el análisis del discurso; las personas del
  discurso.
- Modos de organizar el discurso (narración, descripción, argumentación,
  explicación, diálogo).
- Decir el discurso: los registros y los procedimientos retóricos; figuras
  retóricas en textos poéticos (CE1.6).
- Estrategias discursivas: escuchar, argumentar, negociar, consensuar (CE1.4);
  oratoria y declamación (actitudinales).

Aparecen también temprano en la lista, y conviene tenerlos a mano para el
diagnóstico de entrada: **las categorías gramaticales** (CE2.1) y **la lectura
y sus técnicas, ideas principales y secundarias** (RA3).

### 11.º grado

**BCH** [CNB BCH pp. 109 a 113], 160 horas, 4 por semana. **Unidad I,
Fundamentos de la comunicación (RA1)**:

- Reglas básicas de lectura, redacción y expresión oral.
- Los estereotipos discriminatorios de tipo étnico, de género o religioso.
- Técnicas grupales.
- Nivel morfológico del habla.
- Procedimentales: reporte de lectura; causas más comunes de discriminación;
  la entrevista; publicidad y propaganda; el debate, la mesa redonda y el panel.

**BTP de Administración de Empresas** [CNB BTP pp. 94 a 105], 120 horas, 3 por
semana, sin unidades. Sus primeros contenidos: reglas básicas de lectura,
redacción y expresión oral; vicios de lenguaje (barbarismo, anfibología);
ortografía y léxico; la entrevista laboral; género periodístico (la prensa en
Honduras); protocolo (atención al público, informes orales); técnicas
grupales; nivel morfológico del habla. [pendiente de verificar: el BTP de
Sistematización Informática, `cnb-media-btp-sistematizacion-informatica-12-2025-18-espanol.md`,
no se leyó entero; se supone igual al de Administración porque el texto que
se comparó coincide.]

---

## 2. Misiones de Español que ya existen y para qué sirven

Hay 9 misiones de Español en el catálogo (`js/data/misiones.js`, materia
`español`, Ruta de la Palabra) y una de Filosofía que roza el tema. Las ocho
de «II y III Ciclo» tienen examen conceptual de 40 preguntas (formas 1 a 30) y
prueba de pensamiento crítico. Solo Los Tipos de Textos tiene ya el banco
grande de las formas 31 a 50, **congelado** con su clave.

| misión (archivo) | febrero y marzo (programación) | grados | qué le falta |
|---|---|---|---|
| La Acentuación (`misiones/2y3ciclo-acentuacion/acentuacion-II-III-ciclo-basica.html`) | **Sí**: reglas ortográficas en 7.º [PDF p. 7]; reglas de acentuación en 8.º [p. 15]; agudas, llanas, esdrújulas y sobresdrújulas en lengua oral y escritura de 9.º [p. 23] | 7.º, 8.º, 9.º | Nada para febrero y marzo. El acento enfático de 9.º (0 menciones) es de más adelante [DCNB p. 193] |
| Marcadores Textuales (`misiones/2y3ciclo-marcadores-textuales/marcadores-textuales.html`) | **Sí**: uso de conectores en 7.º [p. 7]; conjunciones temporales en 8.º [p. 15] | 7.º, 8.º, 10.º | Revisar que trate las conjunciones temporales por su nombre [pendiente de verificar] |
| Los Tipos de Textos (`misiones/2y3ciclo-tipos-de-textos/tipos-de-textos.html`) | **Sí, de fondo**: los estándares de los tres grados piden crear e interpretar textos descriptivos, narrativos, expositivos y persuasivos [pp. 7, 15 y 23] | 7.º a 10.º | La superestructura narrativa y el punto de vista van en N2. Sus bancos están congelados del 1 al 50: no se le agregan preguntas |
| Los Sustantivos, Los Adjetivos, Los Pronombres, Los Adverbios (`misiones/2y3ciclo-*/`) | Solo de apoyo: la oración gramatical de 8.º (sujeto, verbo, complemento) [p. 15] se apoya en ellas | 7.º, 10.º, 11.º | Nada. En 10.º y 11.º sirven desde el principio (categorías gramaticales, nivel morfológico) |
| Los Verbos (`misiones/2y3ciclo-verbos/verbos-II-III-ciclo-basica.html`) | Apoyo para la oración (el verbo como núcleo) | 7.º, 10.º, 11.º | Perífrasis verbales: 0 menciones. Si Josué confirma que la línea «Perífrasis verbales» de 8.º y 9.º va en serio, hay que ampliarla; si es errata, no. Lo demás (tiempos compuestos, formas no personales) después del 6 de diciembre |
| El Adjetivo Avanzado (`misiones/bach-uni-adjetivos/adjetivos-avanzado.html`) | No aplica (Media) | 10.º, 11.º | Nada |
| Palabras que Piensan (`misiones/basica-palabras-que-piensan/`, Filosofía) | Complemento de denotación y connotación | 7.º a 9.º | No cuenta como cobertura; se enlaza desde N6 |
| Fin de grado 7.º (`misiones/fin-de-grado-7mo/`) | No | 7.º | Fuera de este plan |

**Resumen:** con la programación delante, lo que ya existe cubre más de lo que
parecía con el DCNB solo: **la acentuación y los conectores son de febrero y
marzo** en 7.º, 8.º y 9.º. Lo que falta es todo lo demás del bloque: la
conversación y los niveles de la lengua, el cuento, el periódico y los textos
funcionales, las fichas y la síntesis, el párrafo y la oración, y el
vocabulario.

---

## 3. Misiones nuevas, revisadas contra el bloque oficial

### 3.1 Qué pasó con las seis del plan anterior

| antes | qué pasa | por qué [Prog. 7-9] |
|---|---|---|
| M1 La comunicación | **Se mantiene, fusionada en N1.** El circuito del habla y las funciones del lenguaje quedan como apartado «Para Media» | La conversación en lengua estándar y lo verbal y no verbal están en febrero y marzo de los tres grados [pp. 7, 15, 23]; las funciones del lenguaje no están en la programación de Básica, sí en el CNB de 10.º |
| M2 Lengua, habla y norma | **Se parte.** Los niveles de uso (científico-técnico, popular, regional, familiar, culto) pasan a N1. Lengua, habla y norma **se mueve a mayo** | Niveles en febrero y marzo [pp. 7, 15, 23]; lengua, habla y norma en mayo de 8.º [p. 17] |
| M3 Etapas de la lectura | **Se mantiene** como N4, con más peso en fichas, síntesis y partes del libro | Fichas en los tres grados; partes del libro en 8.º; investigación fuera del libro con sus etapas en 9.º [pp. 7, 15, 23] |
| M4 Oratoria y debate | **Se mueve al segundo parcial** (abril y mayo), junto con el artículo de opinión. En febrero y marzo solo quedan charlas, trabajo de equipo, diálogos y asambleas, que van en N1 | Debate, panel y mesa redonda son de abril [pp. 8, 16, 24] |
| M5 Escribir por etapas | **Se mantiene** como N5, y suma el párrafo y la oración | Planeación, borrador, revisión y versión final en los tres grados; el párrafo y la oración en 8.º; la coordinación en 9.º [pp. 7, 15, 23] |
| M6 Describir y narrar | **Se mantiene, fusionada en N2** (el cuento). La topografía, la prosopografía y la etopeya **se mueven** a abril o después | En febrero y marzo: el cuento de tradición oral, el esquema inicio, desarrollo y cierre, el punto de vista, la descripción de personajes y la biografía [pp. 7, 15, 23]; topografía y prosopografía en abril de 7.º [p. 8] |

**Faltaban, y entran:** N3 (el periódico y los textos funcionales) y N6 (las
palabras y sus significados). Los dos están en febrero y marzo de los tres
grados.

**De la lista de ejemplos de Josué:**

| tema | ¿febrero y marzo? | dónde queda |
|---|---|---|
| Texto de opinión y argumentación | No como texto: el artículo de opinión es de abril en 8.º y 9.º [pp. 16 y 24]. Sí está el estándar «Expresan y fundamentan sus opiniones» y «Escriben juicios valorativos» en los tres grados, el comentario crítico en 8.º [p. 15] y el ensayo en 9.º [p. 23] | Opinar con razones y el comentario crítico, en N4; el ensayo, en N5. El artículo de opinión, primera misión del segundo parcial |
| Tradición oral hondureña | Sí: el cuento de tradición oral en 7.º y 9.º; el cuento en Honduras y de autores nacionales en 8.º | N2 |
| El párrafo y sus ideas | Sí: el párrafo en 8.º; párrafos por forma elocutiva en 7.º y 8.º; ideas globales, principales y secundarias en el estándar de lectura de los tres grados | N5 |
| La oración simple y compuesta | Sí: la oración gramatical (sujeto, verbo, complemento) en 8.º; oraciones compuestas por coordinación en 9.º | N5 |
| Homonimia, polisemia, parónimos | Polisemia sí, en 9.º [p. 23]. Homonimia no: es de abril [pp. 16 y 24]. **Parónimos no aparecen en ningún mes** | N6 trata la polisemia; la homonimia, segundo parcial; los parónimos, fuera |

### 3.2 Lo que lleva cada misión nueva

Igual en las seis (la plantilla estándar del motor, la de La Célula,
`_privado/PLANTILLA-MISIONES.md`):

- Aprende, sección de detalle, laboratorio propio, 14 tarjetas, quiz de 9,
  Clasifica (4 grupos), Identifica (8), Completa (8), widgets, reto, sopa,
  generador de tareas, constancia y recursos.
- **Examen conceptual: 80 preguntas.** 40 en los bancos de siempre (10 de
  completar, 10 de verdadero o falso, 10 de selección, 10 pareados), de donde
  salen las formas 1 a 30, y 40 en los bancos «Nuevo», de donde salen las 31
  a 50. Es lo que el motor ya sabe repartir (`genEval` en `js/motor-mision.js`).
- **Pensamiento crítico: 20 casos como mínimo**, con los apartados de La
  Célula: Caso 2, Error 2, Decisión 2, Comparación 2, Causa 5 (saca 2), Efecto
  7 (saca 3). Da 2·2·2·2·10·35 = 5 600 conjuntos, muy por encima de los 50
  distintos que pide la sonda.
- **Cada contenido marcado por grado** («7.º», «8.º», «9.º», «Para Media»),
  porque una misión sirve a varios grados con hondura distinta.
- Reglas: la correcta repartida entre letras (ninguna sobre 40 %), ninguna
  pregunta regala otra, nada solo con color, todo sin arrastrar, blancos de
  44 px. Ficha, QR (`_dev/genera-qr-mision.py`) y enlaces en los dos sentidos.
- Textos de lectura: escritos para la misión o de dominio público con su
  fuente. Nada copiado de un libro con derechos.
- **Cruce con otras materias (STEAM).** Lecturas, ejemplos y ejercicios de
  Ciencias Naturales, Ciencias Sociales, Matemáticas y Cívica. El objetivo,
  las preguntas y la ficha son de **Español**; la otra materia pone el tema
  del texto o la situación. Cada dato de la otra materia sale de una fuente
  que ya está en el repositorio (un archivo de `js/data/` con sus fuentes, una
  misión publicada o el DCNB de esa área en `_dev/dcnb/`) y se anota en el
  comentario del `contenido.js`. Si la misión de origen marca un dato como
  dudoso, no se usa. Si no hay fuente, el dato no entra o queda **pendiente de
  verificar**. Las cifras inventadas para un ejercicio se dicen inventadas.

### 3.3 Las seis, en orden de prioridad

El orden: primero lo que está en febrero y marzo **de los tres grados** y no
depende de fuentes que faltan; al final lo que necesita textos con fuente.

#### N1 · `3ciclo-n1-conversacion` · Conversar en lengua estándar: lo verbal, lo no verbal y los niveles de la lengua

Nombre de carpeta provisional; se fija al escribirla.

- **Febrero y marzo**: 7.º [p. 7], 8.º [p. 15], 9.º [p. 23]. Para Media: 10.º
  CE1.1, CE1.2, CE1.5, CE1.6; 11.º estereotipos discriminatorios.
- **Temas de la ficha**: la conversación en lengua estándar; lenguaje verbal y
  no verbal; entonación, énfasis y pausas (8.º); fórmulas sociales de
  intercambio (9.º); charlas, trabajo de equipo, diálogos y asambleas
  escolares (cómo se preparan y cómo se respeta el turno); niveles de la
  lengua: científico-técnico, popular, regional, familiar, culto; lenguaje
  libre de discriminación. Para Media: el circuito de la comunicación y las
  funciones del lenguaje.
- **Actividades**: Clasifica frases por nivel; Identifica la señal no verbal;
  Completa la fórmula social que falta; widget «dilo en lengua estándar»;
  tarea de recoger expresiones regionales en la casa.
- **Laboratorio**: «la misma noticia, cuatro bocas». Un mismo hecho se cuenta
  a un amigo, a la abuela, al director y en una charla; el alumno elige
  palabras, entonación y pausas, y el laboratorio dice qué nivel quedó y si
  sirve para esa situación. Sin arrastrar: botones.
- **Cruces con otras materias**:
  - *Ciencias Naturales*: el mismo fenómeno en lenguaje científico-técnico y
    en lenguaje popular (la fotosíntesis o un ecosistema). Fuente: la misión
    Los Ecosistemas (`misiones/2y3ciclo-ecosistemas/`).
  - *Matemáticas*: «cociente» y «residuo» frente a «lo que le toca a cada uno»
    y «lo que sobra». Fuente: la misión División de decimales
    (`misiones/2y3ciclo-division-decimales/`).
  - *Ciencias Sociales*: el lenguaje regional y las lenguas de Honduras. El
    DCNB de 8.º nombra chortí, tol, tawaka, miskito, pech, garífuna e inglés
    criollo, y la zona lenca [DCNB p. 149]. Dónde se hablan y cuántos las
    hablan, pendiente de verificar.
  - *Cívica*: una asamblea escolar para decidir algo del grado, y un artículo
    de la Constitución dicho en lengua culta y explicado a un niño, con
    `js/data/constitucion-honduras.js` y solo lo que ese archivo acredita.
- **Examen**: 80 conceptuales, 20 casos críticos (malentendidos por el tono,
  burlas por la forma de hablar de otro).
- **Fuentes que faltan**: las definiciones de las funciones del lenguaje para
  el apartado de Media [pendiente de verificar]. Lo de Básica sale de la
  programación y del DCNB.

#### N2 · `3ciclo-n2-cuento` · El cuento: de la tradición oral a los autores de Honduras

- **Febrero y marzo**: 7.º cuento de tradición oral, descripción de
  personajes, escribir un cuento [p. 7]; 8.º esquema inicio, desarrollo y
  cierre, cuento de autores nacionales e hispanoamericanos, el cuento en
  Honduras, la biografía [p. 15]; 9.º cuento de tradición oral y punto de
  vista [p. 23]. Para Media: modos de organizar el discurso (10.º).
- **Temas de la ficha**: qué es la tradición oral; el esquema del cuento
  (inicio, desarrollo, cierre); la descripción de personajes; quién narra
  (protagonista, testigo, narrador que lo sabe todo); la biografía como texto
  descriptivo; escribir un cuento corto.
- **La lectura como medio de transmisión de cultura** (8.º, [Prog. 7-9, PDF
  p. 15]; el DCNB la trae como contenido actitudinal: «Reconoce la lectura
  como medio de comunicación y de transmisión de cultura de los pueblos»,
  pp. 89 y 122). **Decidido el 26 de noviembre, al revisar el PR 61: va aquí,
  en la tanda 3**, y no en N3 ni en N4, que no se tocan. Lleva una tarjeta de
  redacción nuestra (el DCNB la nombra y no la explica) y dos preguntas en el
  examen: una de verdadero o falso y una de selección. El cuento de tradición
  oral es el mejor ejemplo: lo que una comunidad cuenta pasa de una
  generación a otra.
- **Actividades**: Ordena las partes de un cuento; Identifica quién narra;
  Clasifica rasgos de un personaje (cómo es por fuera, cómo es por dentro);
  generador de «cuenta lo que te contaron en tu casa».
- **Laboratorio**: «la cámara del narrador»: el mismo suceso contado por tres
  narradores; el alumno cambia quién narra y ve qué sabe y qué no sabe cada
  uno.
- **Cruces con otras materias**:
  - *Ciencias Naturales*: un cuento de tradición oral inventado para la
    misión sobre una gran tormenta, con los datos del huracán Mitch que
    acredita la misión Desastres Naturales (`misiones/2y3ciclo-desastres-naturales/`).
  - *Ciencias Sociales*: la biografía de un prócer, con lo que
    `js/data/proceres-honduras.js` da por verificado y nada más.
  - *Matemáticas*: la línea de tiempo de una biografía: cuántos años pasaron
    entre dos hechos, con fechas de `js/data/proceres-honduras.js`.
  - *Cívica*: quién narra en el Himno Nacional, con la letra de
    `js/data/himno.js`.
- **Examen**: 80 conceptuales, 20 casos críticos.
- **Fuentes que faltan**: textos de tradición oral hondureña y cuentos de
  autores nacionales [pendiente de verificar: no hay ninguno en `_dev/`, y los
  cuentos de autores con derechos no se pueden copiar; se citan con autor y
  obra y se trabaja con fragmentos breves o con textos de dominio público].
  Por eso va última: si las fuentes no llegan, sale con cuentos escritos para
  la misión y la lista de autores queda pendiente.

#### N3 · `3ciclo-n3-periodico` · El periódico y los textos de todos los días

- **Febrero y marzo**: 7.º el periódico, cartas personales, informe
  interpretativo [p. 7]; 8.º el periódico, cartas de lector, acta, carta
  personal, carta de venta, la noticia [p. 15]; 9.º el periódico (postura,
  línea editorial, titulares, secciones, tipo de lectores), el reglamento
  [p. 23].
- **Temas de la ficha**: partes y secciones del periódico; titular y noticia
  (qué, quién, cuándo, dónde, cómo, por qué); postura y línea editorial (9.º);
  la carta personal, la carta de lector y la carta de venta; el acta; el
  reglamento; el informe interpretativo.
- **Actividades**: Clasifica textos por su función; Identifica la sección del
  periódico; Completa un acta; generador de titulares.
- **Laboratorio**: «la redacción del periódico escolar»: con los mismos
  hechos, el alumno arma una noticia, una carta de lector y un acta, y el
  laboratorio le muestra qué cambia en cada una.
- **Cruces con otras materias**:
  - *Ciencias Naturales y Sociales*: una noticia sobre la Biosfera del Río
    Plátano. Fuente: la misión Áreas Protegidas
    (`misiones/2y3ciclo-areas-protegidas-de-honduras/`).
  - *Cívica*: el acta de una asamblea escolar y un reglamento del aula
    escrito por artículos, como `js/data/constitucion-honduras.js`.
  - *Ciencias Naturales*: una carta de lector que pide prepararse para la
    temporada de lluvias, con lo que acredita la misión Desastres Naturales
    (alertas, COPECO).
  - *Matemáticas*: leer la gráfica o la tabla de una noticia; los números,
    inventados y dichos como inventados.
- **Examen**: 80 conceptuales, 20 casos críticos (titular engañoso, noticia
  sin fuente).

#### N4 · `3ciclo-n4-leer-para-investigar` · Leer para investigar: el libro, las fichas y la síntesis

- **Febrero y marzo**: 7.º síntesis (resúmenes, sinopsis), esquemas y planes,
  citas bibliográficas, fichas bibliográficas [p. 7]; 8.º partes del libro
  (glosario, capítulos, bibliografía), comentario crítico, fichas
  bibliográficas y hemerográficas [p. 15]; 9.º textos de consulta, la
  investigación fuera del libro con sus etapas analítica, interpretativa y
  evaluativa, fichas [p. 23]. Para Media: reporte de lectura (11.º), lectura
  y sus técnicas (10.º).
- **Temas de la ficha**: las partes del libro y para qué sirve cada una; la
  ficha bibliográfica y la hemerográfica; el resumen y la sinopsis; el
  comentario crítico (opinar con razones); las tres etapas de la lectura;
  diccionarios, atlas y enciclopedias.
- **Actividades**: Identifica la parte del libro; Completa una ficha
  bibliográfica; Clasifica resumen, sinopsis y comentario; widget «¿idea
  principal o secundaria?».
- **Laboratorio**: «el libro desarmado»: un libro inventado con portada,
  índice, capítulos, glosario y bibliografía; el alumno busca respuestas en
  la parte correcta, arma la ficha del libro y escribe un resumen; el
  laboratorio le señala si copió frases enteras.
- **Cruces con otras materias**:
  - *Ciencias Naturales*: un texto expositivo sobre cómo se descubrió la
    célula para resumir y fichar. Fuente: la misión La Célula
    (`misiones/2y3ciclo-la-celula/js/contenido.js`, que trae a Hooke).
  - *Ciencias Sociales*: los viajes de Colón para la sinopsis y el
    comentario crítico. Fuente: `js/data/viajes-colon.js`, sin las fechas de
    desembarco que ese archivo marca como discutidas.
  - *Ciencias Sociales*: el atlas como texto de consulta (9.º), con la
    misión Geografía de Honduras (`misiones/2y3ciclo-geografia-de-honduras/`).
  - *Matemáticas*: una tabla o una gráfica como técnica de síntesis.
  - *Cívica*: la ficha bibliográfica de la Constitución (datos de edición
    pendientes de verificar hasta que esté en `_dev/leyes/`).
- **Examen**: 80 conceptuales, 20 casos críticos (copiar sin citar, fuente
  dudosa, resumen que cambia el sentido).
- **Fuentes que faltan**: el formato exacto de cita para Media (APA 7)
  [pendiente de verificar]. En Básica se usa la ficha bibliográfica tal como
  la nombra la programación.

#### N5 · `3ciclo-n5-escribir` · Escribir por etapas: el párrafo y la oración

- **Febrero y marzo**: los tres grados planean, escriben borrador, revisan y
  pasan a versión final [pp. 7, 15, 23]; 7.º concordancia, claridad,
  corrección, coherencia y párrafos descriptivos, narrativos y expositivos;
  8.º el párrafo, la oración gramatical (sujeto, verbo, complemento) y
  párrafos persuasivos; 9.º el ensayo y las oraciones compuestas por
  coordinación (copulativas, disyuntivas, adversativas, explicativas). Para
  Media: la escritura como proceso (10.º CE2.5); reglas básicas de redacción
  (11.º).
- **Temas de la ficha**: planear (tema, propósito, destinatario, formato);
  borrador, revisión y versión final; el párrafo y su idea principal; tipos
  de párrafo por su forma; concordancia, claridad y coherencia; la oración:
  sujeto, verbo y complemento; oraciones compuestas por coordinación; el
  ensayo corto (9.º).
- **Actividades**: Ordena las etapas; Clasifica párrafos; Identifica sujeto,
  verbo y complemento; Completa con la conjunción que coordina; tarea de
  escritura con lista de revisión.
- **Laboratorio**: «mesa de revisión»: un borrador con fallas (falta
  concordancia, una idea repetida, dos oraciones que piden coordinarse); el
  alumno corrige eligiendo entre opciones y ve el texto rehecho.
- **Relación**: no repite los conectores ni la acentuación: enlaza a
  Marcadores Textuales y a La Acentuación.
- **Cruces con otras materias**:
  - *Ciencias Naturales*: el informe de un experimento de los estados de la
    materia, párrafo por párrafo. Fuente: la misión La Materia
    (`misiones/2y3ciclo-la-materia/`).
  - *Ciencias Naturales*: oraciones de sujeto, verbo y complemento sobre la
    célula, con La Célula.
  - *Matemáticas*: escribir el procedimiento de un problema de división de
    decimales y revisarlo.
  - *Ciencias Sociales*: un borrador sobre la civilización maya para revisar
    la coherencia, con la misión Los Mayas y las Culturas Precolombinas,
    **sin** las tres valoraciones que el plan del motor anota como sin fuente.
  - *Cívica*: un ensayo corto (9.º) sobre una norma de convivencia del aula.
- **Examen**: 80 conceptuales, 20 casos críticos.

#### N6 · `3ciclo-n6-palabras` · Las palabras y sus significados

- **Febrero y marzo**: sinónimos y antónimos y el diccionario en los tres
  grados; 7.º vocabulario técnico y regionalismos; 7.º a 9.º denotación y
  connotación, lenguaje literario y no literario; 8.º el contexto y los
  diccionarios especializados; 9.º prefijos, sufijos, neologismos, polisemia,
  siglas y acrónimos [pp. 7, 15, 23]. Para Media: relaciones semánticas (10.º
  CE3.5).
- **Temas de la ficha**: sinónimos y antónimos según el contexto; cómo usar
  el diccionario y los especializados; vocabulario técnico; regionalismos;
  denotación y connotación; prefijos y sufijos; neologismos; polisemia;
  siglas y acrónimos.
- **Actividades**: Clasifica palabras (denotación o connotación); Completa
  con el sinónimo según el contexto; Identifica el prefijo; widget «¿qué
  significa aquí?» (polisemia).
- **Laboratorio**: «la fábrica de palabras»: con prefijos y sufijos dados el
  alumno arma palabras, el laboratorio dice si existen y qué significan, y en
  un segundo panel una misma palabra cambia de sentido según la oración.
- **Cruces con otras materias**:
  - *Ciencias Naturales*: prefijos y sufijos del lenguaje científico
    (foto-síntesis, eco-sistema), con la misión Los Ecosistemas.
  - *Matemáticas y Ciencias Naturales*: polisemia de «raíz» (la de la planta
    y la de un número), con las misiones Potencias y Raíces
    (`misiones/2ciclo-potencias-raices/`) y Los Ecosistemas.
  - *Cívica y Ciencias Naturales*: siglas como COPECO, con la misión
    Desastres Naturales.
  - *Tecnología*: neologismos de la inteligencia artificial, con
    `js/data/ia-conceptos.js`.
  - *Cívica*: denotación y connotación en un verso del Himno, con `js/data/himno.js`.
- **Examen**: 80 conceptuales, 20 casos críticos.
- **Fuentes que faltan**: qué significa cada prefijo y sufijo y qué palabras
  nuevas acepta la RAE [pendiente de verificar: hace falta el diccionario o
  la ortografía de la RAE como fuente en `_dev/`].

### 3.4 Lo que queda para el segundo parcial y después

- **Primera misión del segundo parcial (abril y mayo)**: oratoria y debate
  con el artículo de opinión y la argumentación (lo que era M4) [Prog. 7-9,
  PDF pp. 8, 16 y 24].
- **Abril y mayo**: la homonimia; la leyenda; topografía y prosopografía
  [pp. 8, 16, 24]; lengua, habla y norma en 8.º [p. 17].
- **Después del 6 de diciembre**: ampliar Los Verbos con las perífrasis, si
  la línea de la programación no es errata; figuras retóricas para 10.º;
  técnicas grupales y publicidad para 11.º.

### 3.5 Cobertura del bloque oficial el 6 de diciembre

| grado | filas de febrero y marzo (sección 1) | cubiertas con N1 a N6 y lo existente |
|---|---|---|
| 7.º | 18 | 18 |
| 8.º | 20 | 20 (la línea de perífrasis, solo como sinónimos y antónimos) |
| 9.º | 20 | 20 (igual) |
| 10.º | propuesta | casi completa; figuras retóricas, después |
| 11.º BCH y BTP | propuesta | falta la oratoria y la publicidad |

---

## 4. Cómo encaja con el motor y con las fichas, para no hacer el trabajo dos veces

### El motor de misiones

Hoy hay dos archivos:

- `js/motor-misiones.js`: el examen por formas, el reparto de la crítica, el
  banco grande, la puerta `mision.html?m=<carpeta>` y el centro en la hoja
  impresa. Lo cargan todas las misiones.
- `js/motor-mision.js`: **toda la plantilla estándar** (XP, guardado,
  navegación, tarjetas, quiz, clasifica, identifica, completa, widgets, reto,
  tareas, sopa, examen conceptual, diploma). La única misión que lo usa es La
  Célula, con su contenido en `misiones/2y3ciclo-la-celula/js/contenido.js`
  (solo datos) y lo propio en `la-celula-propio.js`.

**Las seis misiones nuevas nacen sobre `motor-mision.js`**, como La Célula:
una página, un `contenido.js` con solo datos y un `<carpeta>-propio.js` con el
laboratorio (`MotorMisiones.registrarLaboratorio`). Nada de copiar los 90 KB
de un JS viejo de Español. Así cada misión nueva es contenido, que es lo que
de verdad cuesta escribir, y no hay que migrarlas después.

**Lo que hay que resolver antes de la primera misión (tanda 0):**

1. **La prueba crítica todavía vive en el archivo propio de la misión**
   (`genEvalCrit` y `critApartados` en `la-celula-propio.js:30`). Si las seis
   la copian, son seis copias más para migrar. Propuesta: pasar `genEvalCrit`
   y `printEvalCrit` con los apartados de La Célula a `motor-mision.js`, que
   lean el banco del `contenido.js`. Es trabajo de motor; si se prefiere no
   tocar el motor ahora, la alternativa es copiarla y anotar las seis como
   deuda. **Decidido por Josué el 24 de noviembre: se pasa al motor en la
   tanda 0.**
2. **Una sonda que acepte una misión nacida con 50 formas.** Las de
   `_dev/formas-oro/` y `verifica-formas-oro.js` congelan formas «de antes»;
   una misión nueva no tiene antes. Se congela con
   `genera-formas-oro.js` el día que Josué apruebe sus preguntas, igual que
   las tandas del banco grande.
3. **El catálogo**: seis entradas nuevas en `js/data/misiones.js` (materia
   `español`, Ruta de la Palabra). Falta decidir el ciclo que se muestra para
   una misión que sirve de 7.º a 11.º. **Decidido por Josué el 24 de
   noviembre: una sola entrada por misión, con el ciclo «III Ciclo y
   Bachillerato».**

**Hecho en la tanda 0 (25 de noviembre, rama `motor/prueba-critica-al-motor`):**

- **Punto 1.** `genEvalCrit`, `printEvalCrit` y `critApartados` viven en
  `js/motor-mision.js`. La misión pone en su `contenido.js` los seis bancos
  (`critCaseBank`, `critErrorBank`, `critDecisionBank`, `critCompareBank`,
  `critCauseBank`, `critEffectBank`), `critCaseQuestions`, `critCaseGuides`,
  `critDecisionGuide` y `critTextos` con los rótulos de su tema: `caso`,
  `decision`, `decisionPregunta`, `decisionPreguntaHoja` (opcional, la versión
  corta para el papel) y `comparacionPregunta`. Sin banco crítico el motor
  esconde la pestaña y no da error. `verifica-misiones-motor.js` exige la
  prueba entera o nada. La Célula quedó idéntica: sus 50 formas salen byte a
  byte iguales en pantalla (con la pauta), en la hoja impresa, en los datos y
  en el progreso guardado, comparadas en el navegador antes y después.
- **Punto 2.** Una misión nueva se anota en `_dev/formas-oro/_nacidas.json`
  el día que nace. La vigila `_dev/verifica-mision-nacida.js`: los ocho
  bancos del examen con 10 preguntas o más, las 50 formas conceptuales
  distintas y del banco, y si trae crítica, 20 casos o más y 50 formas
  distintas. No congela nada. Cuando Josué aprueba las preguntas,
  `node _dev/genera-formas-oro.js <carpeta>` congela las 50 formas de las dos
  pruebas de una vez y la saca de la lista. Una misión sin referencia que no
  está en la lista sigue en rojo (puede ser una referencia perdida).

**Lo que la tanda 0 vio y no arregló** (para que una misión nueva nazca solo
con `contenido.js` + `<carpeta>-propio.js`):

1. **El motor pide todos los datos de los widgets, con nombres heredados.**
   Se probó quitando cada declaración del `contenido.js` de La Célula, una
   por una: sin `TEXTOS`, `SAVE_KEY`, `ACHIEVEMENTS`, `fcData`, `qzData`,
   `classGroups`, `idData`, `cmpData`, `routeSets`, `neuronPartes`,
   `neuroPairs`, `enfermedadData`, `retoPairs`, los cuatro bancos del examen
   o `EVAL_FORMAS`, la página revienta al cargar. Como el arranque va en
   cadena, un dato que falta deja sin iniciar todo lo que viene después (el
   laboratorio y el panel de logros). No impide nacer si cada misión escribe
   las trece piezas, pero `neuronPartes` o `enfermedadData` no dicen nada en
   una misión de Español, y no hay forma de dejar fuera un widget que no le
   sirve. Dos salidas: documentar en `_privado/PLANTILLA-MISIONES.md` qué
   widget pinta cada nombre (hoy no lo dice), o que el motor arranque cada
   widget por separado y se salte el que no tiene datos. Conviene decidirlo
   antes de la tanda 1.
2. **La página no la arma el motor.** Cada misión copia `la-celula.html`
   (unas 660 líneas, 13 secciones, `TOTAL_SECTIONS` atado a ellas) y cambia a
   mano lo que lleva el nombre escrito: los títulos del examen y el
   encabezado de la prueba crítica en pantalla («… · La Célula · Educación
   Básica»). `verifica-mision-nueva.js` no busca restos del nombre de otra
   misión. Riesgo: una misión de Español que dice «La Célula» en su
   encabezado. Salidas: una sonda que busque títulos de otras misiones en el
   HTML, o que el motor escriba esos títulos con `TEXTOS.titulo`.
3. **El sello.** La prueba crítica pasó de `la-celula-propio.js` a
   `motor-mision.js` sin subir `?v=` (los tres archivos de La Célula siguen en
   `?v=565`) ni `CACHE_NAME`, como se pidió: el sello va en la tanda 4. Un
   teléfono que juntara el motor guardado de antes con el archivo propio
   nuevo se quedaría sin prueba crítica. Si esta tanda se fusiona a `main`
   antes de la 4, se sella al fusionar.

**Hecho en la tanda 1 (26 de noviembre, primer commit, solo motor):** los
puntos 1 y 2 de arriba.

- **Punto 1.** `js/motor-mision.js` arranca cada paso por su cuenta
  (`_arranca`). El widget sin datos no se pinta y esconde su tarjeta; la
  sección que se queda vacía esconde su pestaña y la flecha que llevaba a ella
  salta a la que sigue; el que revienta lo dice en la consola sin llevarse a
  los demás. `MotorMisiones.arranque` guarda qué pasó con cada paso. Los
  cuatro widgets con nombre heredado tienen nombre por lo que hacen, y los de
  antes siguen valiendo de respaldo:

  | antes | ahora | qué pinta |
  |---|---|---|
  | `routeSets` | `ordenaData` | Widgets: ordena la secuencia |
  | `neuronPartes` | `describeData` | Widgets: de la descripción al nombre (`desc`, `ans`, `opts`) |
  | `neuroPairs` (`trans`, `func`) | `emparejaData` (`term`, `resp`) | Widgets: de un término a lo suyo |
  | `enfermedadData` (`disease`, `characteristic`) | `situacionData` (`term`, `resp`) | Widgets: de un caso a su respuesta |
  | `idData[].art` | `idData[].busca` | Identifica: lo que se pide tocar |

  Los ids de la página van igual (`describeOpts`, `emparejaTerm`,
  `situacionTerm`, `fbDescribe`… y los botones `nextDescribe()`,
  `resetDescribe()`, `resetEmpareja()`, `resetSituacion()`). `fcData`,
  `qzData`, `classGroups`, `cmpData` y `retoPairs` no cambian de nombre: ya
  nombran su widget y los leen por ese nombre otras herramientas
  (`verifica-mision-nueva.js`, `mide-reparto-respuestas.js`). `TEXTOS`,
  `SAVE_KEY`, `ACHIEVEMENTS`, los niveles, las sopas y las tareas tienen valor
  de reserva. Lo único que el motor no suple es el examen. El nivel no se
  escribe en la hoja impresa: el encabezado limpio (`js/motor-misiones.js`)
  deja «Evaluación · Tema · Materia», así que una misma hoja sirve de 7.º a
  11.º sin decir «Educación Básica».
  La Célula quedó igual: sus 50 formas congeladas salen idénticas. Lo prueba
  `verifica-motor-arranque.js` (quita cada dato de La Célula, uno por uno, y
  carga los nombres nuevos) y, de noche, `verifica-motor-arranque-navegador.js`.
- **Punto 2.** Se eligió la sonda: `verifica-titulos-ajenos.js`. Cada misión
  de la plantilla lleva su `TEXTOS.titulo` en sus ocho sitios (pestaña,
  og:title, `<h1>`, los dos encabezados de examen, los dos títulos de examen
  en pantalla y la constancia), su og:url es la suya, y en lo que se lee de
  la página no aparece el título de otra misión, salvo dentro de un enlace a
  esa misión. También mira que dos misiones no compartan `SAVE_KEY`.
- **La lista de nacidas se anota fuera de `formas-oro/`.** La tanda 1 no
  podía tocar `_dev/formas-oro/`, y la lista vivía ahí. Ahora
  `_dev/lib-formas.js` lee dos: `_dev/formas-oro/_nacidas.json` (la de antes,
  vacía) y `_dev/misiones-nacidas.json`, donde están N5 y N1. Al congelar,
  `genera-formas-oro.js` saca la misión de la que la tenga. **Pendiente de
  decisión de Josué:** dejarlo así o volver a una sola lista.
- **La ficha de una nacida se vigila desde su bloque.** `arma-ficha.js` sabe
  armarla en la memoria sin pedir el QR (`enMemoria`), y con eso
  `verifica-ficha-no-copia-examen.js` y `verifica-examen-sin-pistas.js` le
  exigen a la práctica lo mismo que a una ficha armada, desde hoy.
- **Página y CSS.** N5 y N1 comparten, letra por letra, todo lo que no es de
  cada una (se armaron con una misma plantilla de trabajo a partir de la
  página de La Célula; el HTML que queda en el repositorio es plano y se
  edita a mano). Paleta: la de Marcadores Textuales.

**Lo que la tanda 1 dejó para la 4** (además de lo que ya decía la tabla de
la sección 5): el enlace de cada misión a su ficha (hoy la tarjeta de
Recursos dice que la ficha llega con el catálogo), la etapa de la Ruta de la
Palabra en la insignia del encabezado (hoy dice «Ruta de la Palabra · Español
· 7.º a 11.º grado»), una pregunta de cada misión en
`js/data/diagnosticos.js`, y volver a medir las hojas de las dos fichas ya
armadas (`verifica-ficha-paginas.js`). El nombre de los archivos
(`n5-escribir`, `n1-conversacion`: la carpeta sin el prefijo del ciclo) se
puede cambiar hasta que se generen los QR; después ya no.

**Hecho en la tanda 2 (26 de noviembre): N4 y N3.** Las dos nacen sobre la
plantilla, con la forma de N5 y N1 (página, `contenido.js`,
`<archivo>-propio.js` y `js/ficha.js`), anotadas en
`_dev/misiones-nacidas.json` y sin nada congelado.

- **N4 · `3ciclo-n4-leer-para-investigar` · Leer para investigar**
  (`n4-leer-para-investigar.html`). Laboratorio «el libro desarmado», con un
  libro inventado («Un mundo que no se ve») y tres pasos: buscar cada
  respuesta en su parte, armar la ficha y resumir un capítulo; el resumen se
  escribe en un recuadro y el laboratorio señala las frases copiadas (seis
  palabras seguidas iguales al texto), sin decir que entiende lo escrito.
  Cruces: el descubrimiento de la célula (misión La Célula), los viajes de
  Colón (`js/data/viajes-colon.js`, sin días de desembarco) como tabla y como
  sinopsis, y los colores de las alertas (Desastres Naturales).
  **No se hizo la ficha bibliográfica de la Constitución**: sus datos de
  edición siguen sin estar en `_dev/leyes/`.
- **N3 · `3ciclo-n3-periodico` · El periódico y los textos de todos los días**
  (`n3-periodico.html`). Laboratorio «la redacción del periódico escolar»:
  con unos mismos hechos inventados se arma una noticia, una carta de lector
  y un acta. Cruces: Río Plátano (misión Áreas Protegidas), la alerta
  temprana y COPECO (Desastres Naturales), el reglamento por artículos y una
  tabla de lluvia con números inventados y dichos inventados. No nombra
  ningún periódico real ni la línea editorial de ninguno.
- **Redacción nuestra.** El DCNB nombra y no define casi nada de lo que
  estas dos misiones enseñan (para qué sirve cada parte del libro, qué datos
  lleva cada ficha, qué es una noticia, un titular o una sección). Cada
  cabecera de `contenido.js` lo lista. En N4 la ficha bibliográfica se
  enseña por sus datos, **sin un orden obligatorio**, y APA solo se nombra en
  «Para Media». En N3, las seis preguntas y «titular, encabezado y cuerpo»
  se aplican a la noticia, aunque el DCNB (p. 97) los dice de la crónica.
- **Las fichas.** Las dos traen su bloque; la práctica ensaya una por una
  las 40 del banco de las formas 1 a 30. Armadas en la memoria y medidas con
  un QR prestado, cada una sale en 7 hojas; la hoja más llena tiene 240.8 mm
  de contenido (N3, hoja 2) y 237.9 mm (N4, hoja 3). Hay que volver a
  medirlas en la tanda 4 con su QR.
- **Sello v587** al final de la tanda.

**Lo que la tanda 2 deja para la 4**, además de lo que dejó la 1: lo mismo
para N4 y N3 (catálogo, QR, ficha impresa, enlace a la ficha desde Recursos,
insignia de la Ruta, pregunta en `js/data/diagnosticos.js`), y enlazar entre
sí las misiones nuevas cuando estén en el catálogo (hoy Recursos solo enlaza
a misiones publicadas). En N3 el reglamento del grado se dice «apegado al
reglamento de toda la escuela» y no «reglamento general», porque la sonda de
nombres propios toma «reglamento general» por un nombre.

**Decidido al revisar el PR 61 (26 de noviembre):**

- «La lectura como medio de transmisión de cultura» (8.º, [Prog. 7-9, PDF
  p. 15]) estaba asignada a N3 en la sección 1 y no se trató en N3 ni en N4.
  **Pasa a N2 «El cuento», en la tanda 3**, con una tarjeta de redacción
  nuestra y dos preguntas (una de verdadero o falso y una de selección). La
  sección 1 y la 3.3 ya lo dicen.
- En N3, la pregunta `cp-periodico` del banco de las formas 31 a 50 se
  cambió por `cp-hecho`; `cp-postura` y `cp-linea` se separaron (la postura es
  ante un asunto concreto; la línea editorial, lo que el periódico defiende
  siempre), y `cp-numero` ya no admite «fecha».
- En N4 se igualó el largo de las opciones de selección: la correcta era la
  más larga en 15 de las 20 del examen y en 9 de las 10 de la práctica, y
  quedó en 4 de 20 y en 1 de 10. Al escribir N6 y N2 hay que medirlo desde el
  principio. Las letras repetidas en una hoja (tres de cinco) se dejan: las
  reparte el motor.
- Cada definición que es redacción nuestra lo dice ahora también en el
  `curriculo` de su pregunta, no solo en la cabecera.

**Hecho en la tanda 3 (27 de noviembre): solo N6.** N2 «El cuento» queda
para otra tanda (no se tocó).

- **N6 · `3ciclo-n6-palabras` · Las palabras y sus significados**
  (`n6-palabras.html`). Misma forma que las otras cuatro (página,
  `contenido.js`, `n6-palabras-propio.js` y `js/ficha.js`), anotada en
  `_dev/misiones-nacidas.json` y sin nada congelado. Laboratorio «la fábrica
  de palabras», con dos paneles: en el primero se elige una palabra base
  (cargar, contar, borrar, correcto, zapato, color) y se le pone un prefijo, un
  sufijo o los dos; en el segundo, una misma palabra (raíz, hoja, red, nube)
  cambia de significado en tres oraciones y el laboratorio señala la pista
  del contexto. Cruces: el manglar y «las guarderías del mar» (Los
  Ecosistemas), la raíz cuadrada de 196 (Potencias y Raíces Cuadradas),
  COPECO (Desastres Naturales), «red neuronal» (`js/data/ia-conceptos.js`) y
  el verso «Tu bandera es un lampo de cielo» (`js/data/himno.js`).
- **Sin RAE.** En `_dev/` sigue sin haber diccionario ni ortografía de la
  RAE, así que: el laboratorio no dice que una palabra «no existe», dice que
  «no está en la lista de este laboratorio» y manda al diccionario (es lo que
  pide el DCNB, p. 113); los neologismos son ejemplos de uso común y de
  ninguno se afirma que la RAE lo acepte; los prefijos y los sufijos son de
  todos los días y se dan con el significado que tienen en sus palabras de
  ejemplo. Lo que hay que verificar cuando llegue la fuente está listado en
  la cabecera de `contenido.js` y en el PR: el significado de cada prefijo y
  sufijo, si bio-, geo-, foto-, tele-, micro- y eco- se llaman prefijos (así
  los llama el DCNB, «prefijos griegos»), la definición de acrónimo y los
  neologismos de ejemplo.
- **Redacción nuestra.** Casi todas las definiciones (sinónimo, antónimo,
  contexto, denotación, connotación, prefijo, sufijo, neologismo, polisemia,
  sigla, acrónimo): la programación y el DCNB las nombran y no las definen.
  Va dicho en la cabecera y en el `curriculo` de cada pregunta.
- **Siglas.** Solo cinco, todas con su nombre acreditado en el repositorio:
  COPECO, ONU, UNAH, IHSS e IA. Los nombres falsos que sirven de distractor
  están dichos inventados en su `curriculo`.
- **Sin etiquetas de grado a la vista.** La página dice «III Ciclo» y ninguna
  tarjeta lleva «7.º», «8.º» ni «9.º» (decisión de Josué). El grado de cada
  pregunta sigue en su campo `grado`, que la pantalla no pinta. El bloque de
  la ficha tampoco pone etiquetas en los títulos: el reparto por grado va en
  la nota del docente. N5, N1, N4 y N3 todavía las muestran: se quitan en la
  tanda 4, cuando los indicadores por grado pasen a Recursos.
- **Lo medido** (reglas de la revisión de la tanda 2): la correcta es la
  opción más larga en 3 de las 20 selecciones del examen y en 1 de las 10 de
  la práctica (la más corta se midió al revisar el PR 62: ver abajo); ninguna de las 20 respuestas de completar del examen está
  escrita en otro de los 80 enunciados, ni ninguna de las 10 de la práctica
  en el resto de su hoja; cada completar tiene una sola respuesta (el nombre
  que se enseñó o la palabra que sale de armar las piezas del enunciado).
- **La ficha.** Armada en la memoria y medida con un QR prestado sale en 8
  hojas (4 de teoría, 3 de práctica y la del docente); la más llena tiene
  230.8 mm de contenido. Hay que volver a medirla en la tanda 4 con su QR.
- **La mitad del examen es de 9.º.** Prefijos, sufijos, neologismos,
  polisemia, siglas y acrónimos están en febrero y marzo solo en 9.º [Prog.
  7-9, PDF p. 23], y son la mitad de los temas de N6: 38 de las 80
  preguntas llevan `grado: '9.º'`. El estándar de lectura de 7.º y 8.º ya pide «palabras con
  múltiples significados, acrónimos y siglas» [pp. 7 y 15] y el DCNB de 7.º
  trae la formación de palabras (p. 113), pero no en ese bimestre. Pendiente
  de decisión de Josué: dejarlo así (como N3, que pregunta la línea
  editorial) o separar un examen de 7.º y 8.º.
- **Una segunda lectura.** Antes del PR las 80 preguntas y la práctica se
  leyeron otra vez, una por una, buscando respuestas dobles, distractores
  que se descartan solos y preguntas que regalan otra. Salieron 22
  hallazgos, ninguno grave, y se aplicaron: entre ellos, que COPECO no se
  forma con las iniciales sino con dos letras de cada palabra (la guía ya
  lo dice), que en Honduras el de la computadora es «mouse» y no «ratón»
  (el ejemplo pasó a «nube» y «navegar») y que «cafetal» no se parte limpio
  (el ejemplo de -al es «maizal»).
- **Sello v588** al final de la tanda.

**Decidido al revisar el PR 62 (27 de noviembre):**

- **Lo que dice la RAE**, dicho por Josué (la fuente sigue sin estar en
  `_dev/`): el diccionario (DLE) llama a bio-, geo-, tele-, micro- y foto-
  «elementos compositivos», no prefijos, y define la sigla como
  «abreviación gráfica». N6 mantiene la forma del DCNB («prefijos que
  vienen del griego») y lleva una nota breve en la guía y en la ficha con
  el nombre del diccionario; y ya no dice que la sigla sea una palabra.
- **Los 38 de 80 de 9.º se quedan.** La nota del docente avisa que la
  misión cubre los tres grados y que prefijos, sufijos, neologismos, siglas
  y polisemia son sobre todo de 9.º.
- **El `nivel` de la ficha** es «III Ciclo y Bachillerato», como N1, N3 y
  N4. La nota de la rúbrica con «usted» se queda (es plantilla común) y la
  ficha de 8 hojas también.
- **Ni la más larga ni la más corta.** La correcta era la opción más corta
  demasiadas veces. Quedó así, contando solo cuando es la única: en el
  examen, la más larga en 3 de 20 y la más corta en 4 de 20; en la
  práctica, 1 y 3 de 10. Al escribir N2 hay que medir las dos.
- **Preguntas cambiadas:** `mc-ero` usa «cartero» («carpintero» viene del
  latín y no se forma con -ero); `mc-abundante` cambia un distractor;
  `cp-contingencias` lleva pista de función; `cp-rapido` pasó a `cp-llorar`,
  sin pista de letras; el falso de IHSS dice «es un acrónimo, porque se lee
  de corrido» (`tf-ihss-acronimo`). Como esa frase deja escrita la palabra
  «acrónimo» y lo que quiere decir, el completar que la pedía
  (`cp-acronimo`) ya no podía caer con ella: pasó a `cp-ia`, que pregunta
  de qué palabra es inicial la «I» de «IA».
- **«Inteligencia artificial» va en minúsculas**, como la escribe la RAE
  (dato de Josué). La sonda de nombres propios pide las dos mayúsculas
  cuando las dos palabras van seguidas y en minúscula; no se cambió la
  sonda ni se enseñó la mayúscula: en N6 el nombre solo aparece abriendo
  frase («Inteligencia artificial») y `cp-ia` no lo escribe de corrido. Es
  la misma salida que «reglamento de toda la escuela» en N3. Queda para
  decidir si la sonda debe dejar de pedir esas mayúsculas en todo el sitio.
- En la nota de los pareados de la práctica, el ejemplo de -al es
  «platanal».

**Lo que la tanda 3 deja para la 4**, además de lo que dejaron la 1 y la 2:
lo mismo para N6 (catálogo, QR, ficha impresa, enlace a la ficha desde
Recursos, insignia de la Ruta, pregunta en `js/data/diagnosticos.js`), pasar
los indicadores por grado a Recursos y quitar las etiquetas de grado de N5,
N1, N4 y N3.

### Las fichas como motor (empieza el miércoles 25)

En el repositorio no hay todavía un documento de ese trabajo, así que esto
se escribe con lo que ya existe: hoy cada ficha es un HTML plano en
`fichas/`, y algunas se arman desde los datos con `_dev/arma-*.js` (por
ejemplo `_dev/arma-ficha-lenguaje.js` arma Palabras que Piensan desde
`js/data/filosofia-lenguaje.js`), luego se reparten las hojas con
`_dev/reparte-hojas-ficha.js` y se comprueban con `_dev/verifica-ficha-paginas.js`.

Para no hacer dos veces:

- **Ninguna ficha de Español nueva se escribe a mano.** Su contenido (temas,
  actividades, pauta) va desde el principio dentro del `contenido.js` de la
  misión, en un bloque propio, para que el motor de fichas lo lea cuando
  exista.
- **La forma de ese bloque se acuerda el 25**, con quien haga el motor de
  fichas, antes de escribir la primera ficha. La tanda 1 escribe las misiones
  y deja el bloque de la ficha con la forma acordada.
- **Plan B**: si el 3 de diciembre el motor de fichas no está, las seis se
  arman con un `_dev/arma-ficha-espanol.js` al estilo de `arma-ficha-lenguaje.js`,
  leyendo el mismo bloque. Lo escrito no se pierde.
- Las fichas de Español que ya existen (9) no se tocan en este trabajo.

**Hecho el 26 de noviembre (rama del motor de fichas, aprobado por Josué):**
el motor de fichas existe y es un armador, `_dev/arma-ficha.js`. La forma del
bloque quedó acordada y está en `_privado/PLANTILLA-FICHAS.md`:

- **El bloque no va dentro de `contenido.js`**: va en su propio archivo,
  `misiones/<carpeta>/js/ficha.js`, que la página de la misión no carga. Así
  el alumno no descarga la ficha y cambiarla no obliga a resellar la misión.
  La tanda 1 escribe ese archivo con la forma de la plantilla.
- **La práctica de la ficha no copia el examen.** Cada pregunta de «Ponte a
  Prueba» ensaya un dato del examen (`ensaya` nombra su `k`) con otra
  pregunta. El armador se niega a armar una práctica copiada y lo vigila
  `_dev/verifica-ficha-no-copia-examen.js`. Para una misión nueva esto quiere
  decir escribir 40 preguntas de práctica además de las 80 del examen.
- **El plan B ya no hace falta**: no habrá `_dev/arma-ficha-espanol.js`.
- La ficha piloto fue Los Tipos de Textos, una de las 9 de Español que ya
  existían. Las otras 8 pasan al bloque en su tanda
  (`_privado/PLAN-FICHAS-MOTOR.md`).

---

## 5. Estimación: cuántas tandas hacen falta

**Medida de referencia**: las dos tandas del banco grande (18 y 21 de
noviembre) fueron seis misiones con 40 preguntas nuevas cada una, unos tres
días cada tanda contando la revisión de Josué. Una misión nueva completa
lleva 80 preguntas conceptuales, 20 casos críticos, unas 50 piezas de
actividades, un laboratorio propio y su ficha: unas cuatro veces más texto
por misión. Con eso, **dos misiones nuevas por tanda** es lo que cabe en dos o
tres días con lectura cuidadosa.

La cuenta no cambia con la programación (siguen siendo seis misiones); cambian
cuáles y en qué orden.

| tanda | qué lleva | fechas | depende de |
|---|---|---|---|
| 0 | La prueba crítica al motor (`genEvalCrit` y `printEvalCrit` a `js/motor-mision.js`, leyendo el banco del `contenido.js`); sonda para una misión nacida con 50 formas; forma del bloque de ficha acordada con el motor de fichas | 24 y 25 nov | Nada: ya decidido |
| 1 | **N5 Escribir por etapas** y **N1 Conversar en lengua estándar** (los tres grados, sin fuentes externas que falten) | 26 a 28 nov | Tanda 0 |
| 2 | **N4 Leer para investigar** y **N3 El periódico y los textos de todos los días** | 29 nov a 1 dic | |
| 3 | **N6 Las palabras y sus significados** y **N2 El cuento** | 2 y 3 dic | Fuente de la RAE para N6; textos de tradición oral y cuentos hondureños para N2 (si no llegan, sale con cuentos escritos para la misión) |
| 4 | Las seis fichas desde el motor de fichas (o el plan B), los seis QR, enlaces en los dos sentidos, las seis entradas del catálogo con «III Ciclo y Bachillerato», sello de versión | 4 y 5 dic | Motor de fichas |
| - | Margen y publicación | 6 dic | Merge aprobado por Josué |

**Total: cinco tandas (0 a 4)**, una por PR, sin merge hasta que Josué
apruebe cada una. La tanda 3 queda más corta (dos días) porque la 0 empezó un
día después; si se atrasa, **N2 pasa a la primera semana de enero**: el
cuento es lo único del bloque que depende de textos con fuente, y las otras
cinco cubren 16 de las 18 filas de 7.º, 18 de las 20 de 8.º y 19 de las 20 de
9.º.

---

## 6. Preguntas para Josué

Respondidas el 24 de noviembre:

- ~~El reparto de febrero y marzo~~: las programaciones mensuales de 7.º a 9.º
  ya están en el repositorio y la sección 1 sale de ellas. 10.º y 11.º siguen
  como propuesta.
- ~~La prueba crítica~~: al motor, en la tanda 0.
- ~~El ciclo del catálogo~~: una sola entrada, «III Ciclo y Bachillerato».
- ~~11.º BTP~~: las mismas misiones que el BCH.

Abiertas:

1. **«Perífrasis verbales: sinónimos y antónimos»** en febrero y marzo de 8.º
   y 9.º [Prog. 7-9, PDF pp. 15 y 23]: ¿es errata o se enseñan las perífrasis
   en el primer parcial? Si van en serio, hay que ampliar Los Verbos.
2. **Fuentes que faltan en `_dev/`**: la RAE (diccionario u ortografía) para
   prefijos, sufijos y neologismos de N6 y para las funciones del lenguaje de
   Media; textos de tradición oral hondureña y cuentos de autores nacionales
   para N2; el formato APA 7 para Media; dónde se habla cada lengua de
   Honduras y cuántos la hablan; la Constitución en `_dev/leyes/`.
3. **Programaciones mensuales de Media**: si existen, subirlas para cambiar
   las filas «propuesta» de 10.º y 11.º (pasos en la sección 0).

Agregados el 24 nov los programas oficiales de 10.º y 11.º (BCH y BTP, Versión Preliminar 2025) en `_dev/dcnb/programa-*.md`; sin reparto por meses. Pendiente revisar con Josué si reemplazan la propuesta sobre el CNB para Media y si los parónimos (presentes en 10.º) vuelven como apartado Para Media.
