# Plan: misiones de Español del primer parcial, 7.º a 11.º

Diagnóstico hecho el 22 de noviembre de 2026 sobre `main` en `f04b745` (v582),
en la rama `plan/espanol-primer-parcial`. **Aquí no hay misiones ni código**:
solo qué pide el currículo, qué ya tenemos, qué falta y en qué orden hacerlo
para tenerlo listo el 6 de diciembre.

Cómo leer las marcas:

- **[DCNB p. N]** o **[CNB p. N]**: lo dice el documento oficial, en esa página
  del PDF (la que muestra el visor, no el folio impreso; en el DCNB de III
  ciclo el folio impreso es el del visor más 4).
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

## 0. Lo primero que hay que saber: el currículo no reparte por parciales

1. **El DCNB de 7.º, 8.º y 9.º no dice qué va en cada parcial.** Se buscó
   «parcial», «mes», «semana», «unidad», «bimestre» y «trimestre» en las 111
   páginas de Comunicación de los tres grados: no aparece ninguna
   distribución en el año. El DCNB ordena el Español en **bloques** que corren
   todo el año:
   - Bloque 1, Lengua oral.
   - Bloque 2, Lengua escrita: Lectura.
   - Bloque 2, Lengua escrita: Escritura.
   - Expresión y creación literaria. En 7.º (p. 103) y 8.º (p. 139) el PDF lo
     rotula también «Bloque 2.», con el número equivocado; en 9.º (p. 176)
     dice «Bloque 3». Es el bloque 3.
   - Bloque 4, Reflexión sobre la lengua.
2. **El CNB de Media lo dice expresamente para 10.º**: «Cada docente puede
   considerar el orden en el que impartirá los contenidos de acuerdo con la
   realidad y contexto de la comunidad educativa» [CNB BCH p. 17, Notas].
3. **11.º BCH sí viene en cuatro unidades**, una por resultado de aprendizaje
   (RA1 a RA4) [CNB BCH p. 110]. El documento no dice que cada unidad sea un
   parcial, pero es la lectura natural si el año tiene cuatro parciales.
4. **No se encontró ninguna jornalización oficial de SEDUC por parciales**
   para Español de 7.º a 11.º. Se buscó en la web «jornalización»,
   «Programaciones Educativas Nacionales», «planificación por parciales» y
   «primer parcial». Lo único oficial que aparece:
   - Los libros de Español 2015 de SEDUC y la UPNFM, de los que la búsqueda
     muestra «4 unidades de 8 lecciones, una lección por semana, 5 horas en
     el III ciclo» y que siguen los bloques de las Programaciones (lengua
     oral, lectura, escritura) dentro de cada lección
     [pendiente de verificar: solo se vio el fragmento del buscador;
     `educatrachos.hn` y `se.gob.hn` no se pueden abrir desde este
     contenedor]. Libro de 7.º: `educatrachos.hn/media/documentos/recursos/LE-ESP7-2015-WEB.pdf`
     y su guía `GD-ESP7-2015-WEB.pdf`. De 8.º y 9.º no apareció libro 2015.
5. **Calendario**: la prensa publicó para 2026 cuatro parciales, el primero
   del 13 al 20 de abril (Radio HRN, 22 de enero de 2026)
   [pendiente de verificar: es fuente secundaria; el documento de SEDUC venía
   en un enlace de Google Drive que no se pudo abrir]. **El calendario 2027
   no está publicado.** Las misiones del 6 de diciembre son, entonces, para
   el primer parcial del año lectivo 2027.

**Consecuencia para el plan [criterio del plan].** Como la plataforma es para
cualquier centro del país y no hay reparto oficial, «primer parcial» se define
así:

- **7.º, 8.º y 9.º**: lo que **abre cada bloque** del DCNB, en el orden en que
  el DCNB lo escribe. Así lo cubre tanto el maestro que avanza bloque por
  bloque como el que, igual que el libro 2015, toca todos los bloques en cada
  semana. Lo que abre cada bloque es casi lo mismo en los tres grados, con
  más hondura cada año, y eso permite que **una misión sirva a los tres
  grados**.
- **10.º**: el RA1 (el discurso oral y la comunicación), que es lo primero
  que lista el programa.
- **11.º BCH**: la Unidad I, Fundamentos de la comunicación.
- **11.º BTP**: los primeros contenidos de su lista, que coinciden con la
  Unidad I del BCH más vicios del lenguaje, protocolo y entrevista laboral.

Antes de publicar conviene que Josué confirme este criterio con dos o tres
maestros de Español de centros distintos y, si se puede, con el índice de la
Unidad 1 del libro de 7.º (pregunta 1 de la sección 6).

---

## 1. Contenidos del primer parcial por grado

### 7.º grado [DCNB III ciclo, pp. 84 a 115]

| bloque | lo que abre el bloque (primer parcial) | página |
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

Lo que sigue en el año y **no** es del primer parcial según este criterio:
categorías gramaticales (p. 112), formación de palabras y vicios (p. 113),
relaciones semánticas, puntuación y ortografía (pp. 114 y 115), textos
funcionales y periodísticos (p. 92), poesía y teatro (pp. 105 y 106).

### 8.º grado [DCNB III ciclo, pp. 116 a 156]

| bloque | primer parcial | página |
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

| bloque | primer parcial | página |
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
Primer parcial [criterio del plan] = los contenidos del **RA1**, «Pronunciar
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

| misión (archivo) | para qué contenido sirve | grados | ¿primer parcial? | qué le falta |
|---|---|---|---|---|
| Los Tipos de Textos (`misiones/2y3ciclo-tipos-de-textos/tipos-de-textos.html`) | Tipos de texto narrativo, descriptivo, instructivo, expositivo, argumentativo [DCNB pp. 111 y 150]; modos de organizar el discurso [CNB 10.º] | 7.º, 8.º, 10.º | **Sí en 10.º**; en 7.º y 8.º es de más adelante | No trae la superestructura ni los tipos de descripción (topografía, cronografía, prosopografía, etopeya, retrato: 0 menciones). Sus bancos están congelados: no se le pueden meter preguntas sin romper claves impresas, por eso lo que falta va en una misión nueva (M6) |
| Marcadores Textuales (`misiones/2y3ciclo-marcadores-textuales/marcadores-textuales.html`) | Conectores, cohesión [DCNB pp. 111, 150, 188; CNB 10.º «los conectores, su clasificación y su uso»] | 7.º, 8.º, 9.º, 10.º | No (en 9.º es del bloque 4, después de lengua y habla) | Revisar que su clasificación coincida con la que usa el maestro de 10.º [pendiente de verificar] |
| Los Sustantivos (`misiones/2y3ciclo-sustantivos/sustantivos-II-III-ciclo-basica.html`) | Categorías gramaticales [DCNB p. 112; CNB 10.º CE2.1]; nivel morfológico del habla [CNB 11.º Unidad I] | 7.º, 10.º, 11.º | **Sí en 11.º** (nivel morfológico) y diagnóstico en 10.º | Nada urgente |
| Los Adjetivos (`misiones/2y3ciclo-adjetivos/adjetivos-II-IIICiclo.html`) | Igual que Sustantivos (calificativos, epítetos, determinantes) | 7.º, 10.º, 11.º | Igual | Nada urgente |
| El Adjetivo Avanzado (`misiones/bach-uni-adjetivos/adjetivos-avanzado.html`) | Categorías gramaticales en Media | 10.º, 11.º | Igual | Nada urgente |
| Los Pronombres (`misiones/2y3ciclo-pronombres/pronombres-II-III-ciclo-basica.html`) | Pronombres personal, demostrativo, relativo, posesivo, enclítico [DCNB p. 191]; voseo [DCNB p. 149] | 7.º, 9.º, 10.º, 11.º | Igual que Sustantivos; el voseo sirve de enlace con M2 | Nada urgente |
| Los Adverbios (`misiones/2y3ciclo-adverbios/adverbios-II-III-ciclo-basica.html`) | Categorías gramaticales | 7.º, 10.º, 11.º | Igual | Nada urgente |
| Los Verbos (`misiones/2y3ciclo-verbos/verbos-II-III-ciclo-basica.html`) | Accidentes del verbo [DCNB p. 112] | 7.º, 10.º, 11.º | Igual | **Ampliar después del 6 de diciembre**: tiempos compuestos con haber [p. 189], formas no personales [pp. 153 y 190] (gerundio y participio apenas aparecen), perífrasis verbales [p. 190], oración según la naturaleza del verbo [p. 153]. Ninguno es del primer parcial |
| La Acentuación (`misiones/2y3ciclo-acentuacion/acentuacion-II-III-ciclo-basica.html`) | Reglas generales, diptongo, hiato, diacrítico [DCNB pp. 115, 155, 156, 193] | 7.º, 8.º, 9.º | No | Acento enfático de 9.º (0 menciones) [p. 193]. Después del 6 de diciembre |
| Palabras que Piensan (`misiones/basica-palabras-que-piensan/`, Filosofía) | Roza el signo lingüístico [DCNB p. 110] | 7.º | Complemento | No es misión de Español: se enlaza desde M2, no se cuenta como cobertura |
| Fin de grado 7.º (`misiones/fin-de-grado-7mo/`) | Repaso del año | 7.º | No | Fuera de este plan |

**Resumen:** lo que ya existe cubre bien la gramática, la acentuación, los
conectores y los tipos de texto, que en 7.º, 8.º y 9.º son contenidos de
**después** del primer parcial. Para el primer parcial de Básica no hay casi
nada: faltan la comunicación, la oratoria, los niveles de la lengua, la
lectura por etapas, la escritura por etapas y la descripción y narración. En
10.º y 11.º las de gramática sí sirven desde el principio, pero solo como una
parte.

---

## 3. Misiones nuevas que faltan, en orden de prioridad

El orden sale de cuántos grados cubre cada una en el primer parcial y de si
sus datos se pueden acreditar ya.

Lo que lleva **cada** misión nueva, igual en las seis (la plantilla estándar
del motor, la de La Célula, `_privado/PLANTILLA-MISIONES.md`):

- Aprende, sección de detalle, laboratorio propio, 14 tarjetas, quiz de 9,
  Clasifica (4 grupos), Identifica (8), Completa (8), widgets, reto, sopa,
  generador de tareas, constancia y recursos.
- **Examen conceptual: 80 preguntas.** 40 en los bancos de siempre (10 de
  completar, 10 de verdadero o falso, 10 de selección, 10 pareados), de donde
  salen las formas 1 a 30, y 40 en los bancos «Nuevo», de donde salen las 31
  a 50. Es lo que el motor ya sabe repartir (`genEval` en
  `js/motor-mision.js`) y así la misión nace con sus 50 formas.
- **Pensamiento crítico: 20 casos como mínimo**, con los apartados de La
  Célula: Caso 2, Error 2, Decisión 2, Comparación 2, Causa 5 (saca 2),
  Efecto 7 (saca 3). Da 2·2·2·2·10·35 = 5 600 conjuntos, muy por encima de los
  50 distintos que pide la sonda y de los 200 «con holgura» de
  `docs/FALTANTES-BANCO-CRITICO.md`.
- Reglas: la correcta repartida entre letras (ninguna sobre 40 %), ninguna
  pregunta regala otra, nada solo con color, todo sin arrastrar, blancos de
  44 px. Ficha, QR (`_dev/genera-qr-mision.py`) y enlaces en los dos sentidos.
- Textos de lectura: escritos para la misión o de dominio público con su
  fuente. Nada copiado de un libro con derechos.

### M1 · `3ciclo-la-comunicacion` · La comunicación y sus funciones

- **Grados**: 7.º [DCNB p. 84], 8.º [p. 116], 9.º [p. 157], 10.º [CNB RA1,
  CE1.2], 11.º [CNB Unidad I]. **Los cinco.**
- **Temas de la ficha**: el circuito del habla (hablante, oyente, mensaje,
  código, canal, contexto); signos lingüísticos y paralingüísticos (entonación,
  gestos, el silencio); intención comunicativa explícita e implícita;
  fórmulas sociales de intercambio y lengua estándar; las seis funciones del
  lenguaje (para 10.º y 11.º, marcadas «Para Media»).
- **Actividades**: Identifica el elemento que falla en un mensaje; Clasifica
  señales (lingüística, paralingüística, gesto); Completa con la función del
  lenguaje; widget «¿qué quiso decir?» (intención implícita).
- **Laboratorio**: simulador del circuito del habla. Se elige una situación
  (un aviso en el acto cívico, una nota de voz, un mensaje de texto sin tono);
  el alumno «rompe» un elemento (cambia el código, quita el contexto, mete
  ruido en el canal) y ve qué le llega al oyente. Sin arrastrar: botones.
- **Examen**: 80 conceptuales, 20 casos críticos (malentendidos reales en
  mensajes escritos sin tono, por ejemplo).
- **Fuente de los datos**: el DCNB y el CNB nombran los elementos y las
  funciones. Las definiciones de cada función [pendiente de verificar: hace
  falta una fuente en `_dev/`, ver sección 6].

### M2 · `3ciclo-lengua-habla-norma` · La lengua que hablamos: lengua, habla, norma y niveles

- **Grados**: 7.º [pp. 86 y 110], 8.º [pp. 118 y 149], 9.º [pp. 160 y 187],
  10.º [CNB «Decir el discurso: los registros»], 11.º [vulgarismos y
  regionalismos en su Unidad IV; estereotipos discriminatorios en la I].
- **Temas de la ficha**: lengua, habla y norma; el signo lingüístico (7.º);
  variedades coloquial, estándar y formal; niveles de uso (formas orales,
  escritas y mixtas; modismos y jergas para 9.º); el español de Honduras y de
  América: seseo, yeísmo, voseo (8.º); registros según la disciplina (9.º y
  10.º); hablar sin discriminar (11.º).
- **Actividades**: Clasifica frases por nivel; Identifica el registro;
  widget «tradúcelo al registro»; tarea de recoger regionalismos de la casa.
- **Laboratorio**: «la misma noticia, cuatro bocas». Un mismo hecho se cuenta
  a un amigo, a la abuela, al director y en el periódico; el alumno elige las
  palabras y el laboratorio dice qué nivel quedó y si sirve para esa
  situación. Un segundo panel de rasgos del español de Honduras.
- **Examen**: 80 conceptuales, 20 casos críticos (por ejemplo, cuándo
  corregirle el habla a alguien es útil y cuándo lo humilla).
- **Fuente de los datos**: el DCNB nombra cada nivel y rasgo y pide
  «respeto hacia las diferentes formas de lengua» [p. 86]. **Las lenguas
  habladas en Honduras y la historia del español** [pendiente de verificar:
  no hay fuente en `_dev/`; sin ella esa parte no entra].

### M3 · `3ciclo-etapas-de-la-lectura` · Leer en tres etapas e investigar con fichas

- **Grados**: 7.º [pp. 88 a 90], 8.º [pp. 121 a 123], 9.º [pp. 162 a 164],
  10.º [CNB: la lectura y sus técnicas, fases de la comprensión lectora, ideas
  principales y secundarias, Normas APA], 11.º [Unidad I: reglas básicas de
  lectura, reporte de lectura].
- **Temas de la ficha**: etapa estructural (partes del libro y para qué
  sirve cada una), interpretativa (idea principal e ideas secundarias del
  párrafo) y crítica (resumen, sinopsis, mapa conceptual, juicio); fichas
  bibliográfica, hemerográfica y de trabajo (cita textual, resumen,
  paráfrasis, comentario); para Media, de la ficha a la referencia APA.
- **Actividades**: Identifica la parte del libro; Clasifica fichas;
  Completa una ficha bibliográfica; widget «¿principal o secundaria?».
- **Laboratorio**: «el libro desarmado»: un libro inventado con portada,
  índice, prólogo, glosario y bibliografía; el alumno contesta preguntas
  buscando en la parte correcta, y luego arma una ficha de cita y una de
  paráfrasis del mismo párrafo, y el laboratorio le señala si copió en la de
  paráfrasis.
- **Examen**: 80 conceptuales, 20 casos críticos (plagio, fuente dudosa,
  resumen que cambia el sentido).
- **Fuente**: el DCNB enumera las partes y las fichas. El formato APA 7
  [pendiente de verificar: falta una fuente en `_dev/` para el formato exacto].

### M4 · `3ciclo-oratoria-y-debate` · Hablar en público: oratoria y formas de expresión oral

- **Grados**: 7.º [pp. 84 y 85], 8.º [pp. 116 y 117], 9.º [p. 158], 10.º [CNB
  CE1.3 a CE1.5, oratoria y declamación], 11.º [técnicas grupales, entrevista,
  debate, mesa redonda, panel].
- **Temas de la ficha**: voz, respiración y dicción; expresión corporal;
  el receptor; charla, conferencia, debate, mesa redonda, foro, panel,
  asamblea, simposio, entrevista (con las definiciones que trae el DCNB en la
  p. 85); papeles (coordinador, moderador, ponente, público); el discurso y sus
  tipos (leído, memorizado, improvisado, ex tempore) para 9.º; la entrevista
  (propósito, guion, conclusiones).
- **Actividades**: Clasifica formas por cuántos hablan y quién decide;
  Identifica la forma que conviene a cada situación; Completa el guion de una
  entrevista; generador de temas de debate de la comunidad.
- **Laboratorio**: «arma el evento». Una situación del instituto (decidir el
  uso del dinero de la excursión, escuchar a tres especialistas, informar a
  los padres); el alumno elige forma, papeles y orden de turnos, y el
  laboratorio le explica qué pasa con su elección. Con un cronómetro de
  turnos para usarlo en clase de verdad.
- **Examen**: 80 conceptuales, 20 casos críticos.
- **Fuente**: el DCNB define las formas de expresión oral [p. 85]. Es la
  misión con menos datos por acreditar.

### M5 · `3ciclo-escribir-por-etapas` · Planear, escribir y revisar

- **Grados**: 7.º [pp. 95, 100 y 101], 8.º [pp. 131 y 136], 9.º [pp. 171 y
  174], 10.º [CNB: el proceso de escritura, el párrafo, coherencia pragmática,
  mantenimiento del referente], 11.º [Unidad II, que por el criterio del plan no es del primer parcial].
- **Temas de la ficha**: planeación (tema, búsqueda, selección, orden),
  textualización (esquema, borrador), revisión (progresión temática,
  coherencia, cohesión, léxico); el párrafo por su función (introductorio, de
  transición, de conclusión) y por su forma (narrativo, descriptivo,
  expositivo, argumentativo).
- **Actividades**: Ordena las etapas; Clasifica párrafos; Identifica el
  problema del borrador; tarea de escritura con lista de revisión.
- **Laboratorio**: «mesa de revisión»: un borrador con fallas (se pierde el
  referente, una idea repetida, falta el párrafo de transición) que el
  alumno corrige eligiendo entre opciones; el texto se rehace en pantalla.
- **Relación**: no repite los conectores; enlaza a Marcadores Textuales.
- **Examen**: 80 conceptuales, 20 casos críticos.

### M6 · `3ciclo-describir-y-narrar` · Describir y narrar: superestructuras

- **Grados**: 7.º [pp. 86, 104 y 105], 8.º [pp. 119, 141 a 143], 9.º [pp. 160 y
  179], 10.º [CNB: modos de organizar el discurso].
- **Temas de la ficha**: descripción objetiva y subjetiva; topografía,
  cronografía, prosopografía, etopeya, retrato; narración: planteamiento,
  nudo y desenlace (inicio, desarrollo, cierre); punto de vista del narrador
  (protagonista, testigo, objetivo, omnisciente) para 9.º.
- **Actividades**: Clasifica descripciones; Identifica el narrador;
  Ordena las partes de un relato; generador de «describe a…».
- **Laboratorio**: «la cámara del narrador»: el mismo hecho contado por
  cuatro narradores; el alumno cambia el punto de vista y ve qué sabe y qué
  no sabe cada uno.
- **Por qué no se amplía Los Tipos de Textos**: su examen está congelado del 1
  al 50; lo nuevo no tendría preguntas. Sí se enlazan las dos.
- **Examen**: 80 conceptuales, 20 casos críticos.

### Después del 6 de diciembre (no son del primer parcial o no hay fuente)

- **M7 · `3ciclo-tradicion-oral`**: leyenda, mito, fábula, cuento popular,
  anécdota, bombas, adivinanzas, refranes [7.º p. 103; 8.º pp. 139 y 140].
  Es del primer parcial según el criterio, pero los textos hondureños que
  necesita no tienen fuente en `_dev/` [pendiente de verificar]. Si se
  consigue la fuente antes del 3 de diciembre, entra en la última tanda.
- **Figuras retóricas** para 10.º (CE1.6) y la poesía de 7.º a 9.º.
- Ampliaciones de Los Verbos y La Acentuación (sección 2).

### Cobertura que queda el 6 de diciembre

| grado | contenidos del primer parcial | con M1 a M6 y lo existente |
|---|---|---|
| 7.º | 10 grupos | 9 (falta la tradición oral, M7) |
| 8.º | 10 | 9 (falta la tradición oral) |
| 9.º | 8 | 7 (falta el ensayo literario y el testimonio) |
| 10.º | RA1 completo | completo (figuras retóricas solo en parte) |
| 11.º BCH | Unidad I | completa salvo publicidad y propaganda, que va en M1 o queda para después [criterio del plan] |

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
   deuda (pregunta 3).
2. **Una sonda que acepte una misión nacida con 50 formas.** Las de
   `_dev/formas-oro/` y `verifica-formas-oro.js` congelan formas «de antes»;
   una misión nueva no tiene antes. Se congela con
   `genera-formas-oro.js` el día que Josué apruebe sus preguntas, igual que
   las tandas del banco grande.
3. **El catálogo**: seis entradas nuevas en `js/data/misiones.js` (materia
   `español`, Ruta de la Palabra). Falta decidir el ciclo que se muestra para
   una misión que sirve de 7.º a 11.º (pregunta 4).

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

---

## 5. Estimación: cuántas tandas hacen falta

**Medida de referencia**: las dos tandas del banco grande (18 y 21 de
noviembre) fueron seis misiones con 40 preguntas nuevas cada una, unos tres
días cada tanda contando la revisión de Josué. Una misión nueva completa
lleva 80 preguntas conceptuales, 20 casos críticos, unas 50 piezas de
actividades, un laboratorio propio y su ficha: es unas cuatro veces más
texto por misión. Con eso, **dos misiones nuevas por tanda** es lo que cabe
en dos o tres días con lectura cuidadosa.

| tanda | qué lleva | fechas | depende de |
|---|---|---|---|
| 0 | La crítica al motor (o la decisión de copiarla); sonda para misión nacida con 50 formas; fuentes que faltan subidas a `_dev/` | 23 y 24 nov | Respuestas a las preguntas 2 a 4 |
| 1 | **M1 La comunicación** y **M4 Oratoria** (las dos con datos ya acreditados por el DCNB) | 25 a 27 nov | Tanda 0; forma del bloque de ficha acordada el 25 |
| 2 | **M3 Etapas de la lectura** y **M2 Lengua, habla y norma** | 28 a 30 nov | Fuentes de APA y de lenguas de Honduras |
| 3 | **M5 Escribir por etapas** y **M6 Describir y narrar** | 1 a 3 dic | |
| 4 | Las seis fichas desde el motor de fichas (o el plan B), los seis QR, enlaces en los dos sentidos, catálogo, sello de versión | 4 y 5 dic | Motor de fichas |
| - | Margen y publicación | 6 dic | Merge aprobado por Josué |

**Total: cinco tandas (0 a 4)**, una por PR, sin merge hasta que Josué
apruebe cada una. Va justo: no hay margen para una tanda que se repita.

**Si se atrasa**, se corta por el final de la lista, no por la calidad: M1 a
M4 ya cubren los cinco grados en lo esencial del primer parcial. M5 y M6
pasan a la primera semana de enero, antes de que empiece el año lectivo.

---

## 6. Preguntas para Josué

1. **El criterio del primer parcial** (sección 0): «lo que abre cada bloque»
   en 7.º a 9.º, el RA1 en 10.º y la Unidad I en 11.º. ¿Vale, o hay un reparto
   de tu centro o de tu distrital que deba mandar? Si se pueden abrir
   `educatrachos.hn` y `se.gob.hn` desde el entorno, leo el índice del libro
   de 7.º y el calendario.
2. **Fuentes que faltan en `_dev/`** antes de escribir esos datos: una para
   las funciones del lenguaje y los rasgos del español (RAE: Ortografía o
   Diccionario panhispánico de dudas), una para el formato APA 7, una oficial
   para las lenguas de Honduras y otra para los textos de tradición oral
   hondureña. Sin ellas, esas partes quedan fuera.
3. **La prueba crítica**: ¿la pasamos al motor en la tanda 0 (recomendado),
   o las seis la copian y se migra después?
4. **El ciclo que muestra el catálogo** para misiones que sirven de 7.º a
   11.º: ¿`3ciclo` con «III Ciclo y Bachillerato», o dos entradas?
5. **11.º BTP** tiene 3 horas a la semana y otro orden. ¿Lo atendemos con las
   mismas misiones o queda fuera del primer parcial?
