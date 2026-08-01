# Investigación · La Revista PolicastSapiens quincenal: automatización, ética y alcance

Investigación hecha el 1 de agosto de 2026 a partir de la Revista Nº 02 (20
páginas), el código de M.E.T.A.S y de F.A.R.O, el conector de Canva verificado
en vivo, y cuatro estudios de contexto (ética de la divulgación, educación
hondureña, automatización editorial y distribución). Responde cuatro preguntas:
cómo automatizar la revista, cómo contribuye a la expansión de M.E.T.A.S, qué
ética exige la divulgación, y qué influencia puede tener en el pensamiento
educativo hondureño.

---

## 1. Lo que ya está construido (verificado, no supuesto)

La sorpresa de esta investigación es que **la mitad del sistema ya existe**:

- **La sala de redacción ya funciona.** La herramienta Redacción de F.A.R.O
  (`js/tools/redaccion.js`) no es un borrador de idea: es una redacción
  quincenal completa. Ediciones con número y fecha de cierre calculada por
  quincena (1–15 / 16–fin de mes), notas por sección con estados
  (💭 idea → ✏️ borrador → 👁 revisión → ✅ listo), autor por miembro de la
  familia, titulares de portada, banco de ideas para material futuro,
  autoguardado con cola offline, y **exportación a Markdown** ordenada por
  secciones, pensada —lo dice su propio comentario de cabecera— «para maquetar
  la revista en otro programa». Hasta los límites de palabras por nota están
  comentados en el SQL como «recuadro de Canva»: la herramienta nació ya
  apuntando a la maquetación.

- **El conector de Canva funciona y ve la revista.** Verificado en vivo en esta
  sesión: la cuenta tiene la Revista Nº 02 (diseño `DAHOJXzRcDI`, 20 páginas de
  672×816), tres variantes del Nº 01, la carpeta `REVISTA_POLICAST-SAPIEN` y un
  kit de marca. Se pudo **leer el diseño página por página** (cada página con su
  identificador, listo para ediciones dirigidas) y la **exportación automática a
  PDF está confirmada** (también JPG, PNG, PPTX). Lo que **no** existe todavía:
  ninguna plantilla de marca con campos de autollenado (la búsqueda devolvió
  vacío), así que el autollenado es una mejora futura, no el punto de partida.

- **Las dos aplicaciones están bien separadas.** F.A.R.O y M.E.T.A.S usan
  proyectos de Supabase distintos. La revista puede leer el material de
  Redacción sin rozar jamás los datos del aula (claves de familia, listas,
  notas), que el CLAUDE.md declara intocables.

- **F.A.R.O es privado por decisión, y eso condiciona el flujo.** Desde el 28 de
  julio las tablas de Redacción están cerradas con seguridad por fila: solo la
  familia las lee. La automatización **no** debe abrir ese candado. El puente
  correcto es el que ya existe: el botón «Exportar» de Redacción, que entrega el
  Markdown de la edición. Una persona de la casa exporta; la máquina maqueta.

- **El sitio aún no tiene sección de revista.** En M.E.T.A.S no hay ninguna
  página que muestre los números publicados: hoy la revista vive solo en Canva y
  en el PDF que se comparte a mano. Ahí está el hueco que la automatización
  llena.

---

## 2. El flujo quincenal propuesto

La línea editorial ya declarada en la propia revista —«la prosa es propia a mi
estilo, la IA solo es una herramienta que potencia»— coincide con el estándar
profesional (AP, Reuters: la salida de una IA se trata como material sin
verificar; nada se publica sin revisión humana). El flujo respeta eso: **la
máquina hace lo mecánico, el criterio y la prosa son tuyos**.

### El ciclo de 14 días

| Días | Qué pasa | Quién |
|---|---|---|
| D1 | Se abre la edición en Redacción (ya lo hace sola: número y cierre por quincena) y se llenan los 8 huecos de sección desde el banco de ideas | Tú (10 min) |
| D2–D9 | Redacción de las notas en F.A.R.O, en sesiones de 45–60 min. La IA asiste en investigación, contraste de datos y títulos alternativos; la prosa es tuya | Tú, con Claude de documentalista |
| D10 | Congelación: lo que no está en estado ✅ Listo pasa al banco para el próximo número. Se pulsa «Exportar» y el Markdown de la edición llega a Claude Code | Tú (5 min) |
| D11 | Claude Code prepara el número: verifica cifras y citas contra fuentes, ordena el Markdown por secciones, marca lo que no pudo verificar, propone pies de foto y entradillas donde falten | Claude, con tu revisión |
| D11–D12 | Maquetación: Claude clona el diseño del número anterior (`copy-design`), vuelca los textos aprobados página a página (`edit-design`, guiado por la lectura del diseño), sube imágenes nuevas, y deja comentarios en el propio diseño (`comment-on-design`) señalando desbordes y decisiones que son tuyas | Claude |
| D12–D13 | Retoque humano en el editor de Canva desde el teléfono: portada, equilibrio visual, fotos. Nunca copiar-pegar texto: eso ya lo hizo la máquina | Tú (2–3 h) |
| D13 | Cierre: checklist (sección 4), tu visto bueno explícito | Tú |
| D14 | Salida: exportación a PDF, compresión a ≤5 MB, publicación en el sitio, difusión por WhatsApp, depósito en archivo | Claude |

Con este reparto, un número cuesta **10–14 horas por quincena repartidas en
goteo**, de las cuales solo 3–4 son de maquetación —contra el número entero
hecho a mano que hoy compite con la aplicación por el mismo tiempo (la página 13
del Nº 02 lo confiesa: «teníamos previsto realizar esta revista quincenal,
pero… nos mantiene muy ocupados»).

### Cómo se dispara cada quincena

Claude Code permite programar una rutina quincenal (los días 1 y 16 de cada
mes, por ejemplo) que abra sesión sola, tome el Markdown exportado, ejecute los
pasos D11 y D14 y te avise cuando el diseño esté listo para tu retoque. Tu
teléfono recibe el aviso; tú decides. **Nada se exporta ni se publica sin tu
aprobación**: la compuerta humana es parte del diseño, no una cortesía.

### Qué hay que construir (en orden)

1. **La plantilla maestra en Canva** (una sola vez): duplicar el Nº 02 y
   convertirlo en «molde»: portada, índice y una página modelo por sección con
   cajas de texto estables (título, entradilla, cuerpo, pie de foto). Los
   límites de palabras de Redacción se ajustan a esas cajas — ya existen los
   campos para eso.
2. **La sección Revista en el sitio** : una página `revista.html` autónoma
   (patrón `padres.html`) con los números publicados: lectura HTML ligera por
   artículo para quien no puede descargar un PDF con poca señal, y el PDF como
   edición facsímil. Publicar ahí obliga al sellado de versión (`?v=NN` en las
   cinco páginas y `CACHE_NAME` en `sw.js`), como manda el CLAUDE.md.
3. **El guion de cierre**: comprimir el PDF exportado a ≤5 MB (los paquetes de
   datos hondureños castigan las descargas pesadas), generar la variante en
   escala de grises imponible en folleto (20 págs. media carta = 5 hojas carta a
   doble cara) para fotocopiar, y nombrar los archivos sin acentos ni «º», como
   las demás descargas del proyecto.
4. **Más adelante, si el plan de Canva lo permite**: convertir la plantilla
   maestra en plantilla de marca con campos de autollenado
   (`create-brand-template-draft` → `publish-brand-template`), que hace la
   maquetación determinista. Requiere verificar el plan (las API de autollenado
   han estado restringidas a planes altos; **Canva para Educación es gratuito
   para docentes** con credencial y conviene solicitarlo de todas formas).
5. **Plan B, 100 % propio**: si Canva estorba, el interior de la revista puede
   generarse desde el mismo Markdown con HTML de imprenta + Chromium/Playwright
   (que el proyecto ya usa para pruebas), dejando en Canva solo portada y
   páginas de arte. Reproducible, sin conexión, y gratis.

---

## 3. Cómo contribuye a la expansión de M.E.T.A.S

La revista y la aplicación se empujan una a la otra, y la automatización
refuerza el ciclo:

- **La revista es el órgano de difusión que la aplicación no tiene.** Cada
  número ya recomienda una misión (el Sistema Nervioso, el Pensamiento
  Computacional) y explica qué gana el maestro y la familia. Una cadencia
  quincenal constante convierte esa recomendación en cita fija: 26 oportunidades
  al año de que un maestro nuevo pruebe la aplicación.
- **La aplicación alimenta a la revista con evidencia real.** La sección
  «Recurso Educativo» ya cita resultados del Plan de Acción (30 formas de
  examen, notas de excelencia, la prueba conceptual). Ese es el contenido que
  ninguna otra publicación hondureña puede ofrecer: datos de aula de primera
  mano, siempre agregados y anónimos, nunca calificaciones individuales.
- **La revista documenta el método, y el método es noticia.** Honduras aparece
  al fondo del Índice Latinoamericano de IA (CEPAL), sin estrategia nacional y
  sin doctorados en IA — la propia revista lo reportó en la página 3. En ese
  paisaje, un maestro de escuela pública que produce software educativo, edita
  una revista seriada y automatiza su producción con agentes de IA es una
  rareza triple: el caso se vuelve citable por prensa, academia y cooperación.
  Documentar el flujo (F.A.R.O → Claude Code → Canva) en la sección Tecnología,
  un artículo por trimestre, convierte a la revista en el caso hondureño de
  referencia de IA aplicada con criterio a la educación pública — exactamente la
  «evidencia de competencia digital docente» que la Estrategia de Educación
  Digital de SEDUC/UNICEF busca mostrar.
- **El mismo agente, tres caras.** M.E.T.A.S ya se describe en el Nº 02 como
  «un agente capaz de llevar una gestión oportuna del maestro». La revista
  añade la cara pública de ese agente: gestión para el maestro (Zona Docente),
  acompañamiento para la familia (asistente de padres), y ahora divulgación
  para la comunidad. Cada cara legitima a las otras.
- **Cuidado con la proporción.** Para que las alianzas institucionales sean
  posibles, la revista debe seguir leyéndose como divulgación que recomienda una
  herramienta, no como folleto de la herramienta. La proporción actual (una o
  dos páginas de M.E.T.A.S en veinte) es la correcta; conviene protegerla como
  norma editorial.

---

## 4. Ética de la divulgación: las reglas de la casa editorial

Lo que ya haces bien y hay que formalizar, y lo que falta. Fundamentos: la
Recomendación de la UNESCO sobre la ética de la IA (2021, firmada por Honduras),
su guía de IA generativa en educación (2023), los estándares de agencias (AP,
Reuters), el código de la red internacional de verificadores (IFCN), y las
guías de UNICEF y Save the Children sobre niñez en medios.

### Transparencia sobre la IA

1. **Política de uso de IA visible y fija** en la página de créditos, en dos o
   tres frases: qué hace la IA (asistir investigación, corrección y
   maquetación), qué es 100 % humano (criterio editorial, verificación, prosa y
   estilo), y quién responde (el editor). El PDF de Canva ya lleva la marca
   técnica `containsAiGeneratedContent` en sus metadatos; esa marca es
   invisible para quien lee — la nota legible no la sustituye ni es sustituida.
2. **Toda imagen generada con IA, etiquetada** («Ilustración generada con IA»,
   como ya se hizo con la caricatura del Nº 02). Nunca una imagen de IA que
   parezca fotografía real de personas o hechos: en una revista con fotos
   reales de aula, mezclar sin avisar destruye la confianza.
3. **La IA nunca decide qué se publica.** Ni sobre una foto de un menor, ni
   sobre una afirmación factual. Es el principio de supervisión humana de la
   UNESCO hecho proceso: tu visto bueno en D13 es innegociable e inescribible
   en un guion.

### Rigor de divulgación

4. **Las referencias numeradas se vuelven obligatorias por norma** (ya son
   práctica: las páginas 4 y 6 del Nº 02 son ejemplares). Mínimo una fuente
   verificable por afirmación factual; fuentes primarias antes que secundarias;
   regla de dos fuentes para todo dato sorprendente; fechar los datos («a
   agosto de 2026»).
5. **Verificación manual de toda cifra, cita, fecha y nombre que produzca la
   IA** antes de maquetar: los modelos inventan datos con apariencia creíble.
   El paso D11 marca explícitamente lo que no pudo verificar, para que sepas
   qué revisar.
6. **Separar opinión de hecho con rótulos.** La revista ya lo hace por
   secciones (la Carta al Leviatán es claramente editorial; Investigación es
   reportaje). Formalizarlo: las secciones de criterio llevan su rótulo, y el
   lector nunca confunde una postura con un dato.
7. **Fe de erratas fija** y un canal simple para reportar errores (el correo ya
   impreso en la página 2). Corregir en el número siguiente. Es el estándar
   internacional de correcciones abiertas, y en divulgación la credibilidad es
   el único capital.

### Niñez y comunidad escolar

8. **Consentimiento informado por escrito antes de publicar nombre o foto de
   cualquier menor**: firmado por madre/padre/tutor, específico para el uso
   real (revista pública en PDF, web y redes), renovado cada año escolar,
   revocable y archivado. No es cortesía: la Convención sobre los Derechos del
   Niño (Honduras, 1990), la Constitución (art. 76) y el Código de la Niñez
   (Decreto 73-96) protegen la imagen del menor, y Honduras **no tiene ley
   general de protección de datos** — el consentimiento escrito es la única
   cobertura real. Preparar dos plantillas de cesión de imagen (menores y
   adultos: los maestros también firman).
9. **Minimización en «Aulas en Acción»**: nunca combinar rostro + nombre
   completo + escuela + grado + localidad — ese cruce permite ubicar
   físicamente a un niño. Nombre de pila o iniciales; mejor fotos de la
   actividad (trabajos, manos, grupos) que del rostro; jamás datos de contacto
   ni calificaciones individuales; derecho de retiro inmediato si una familia
   lo pide. El interés superior del niño manda: si la foto no aporta y puede
   exponer, no se publica.
10. **Si alumnos participan en producir la revista con herramientas de IA**:
    edad mínima de 13 años y siempre bajo tu supervisión (guía UNESCO 2023).

### El checklist de cierre (D13)

Versionado en el repositorio, se ejecuta antes de cada visto bueno:
fuentes verificadas y registradas · consentimientos de imagen archivados ·
nota de IA presente y legible · opinión separada de hecho · imágenes de IA
etiquetadas · créditos y licencias de todas las imágenes · tratamiento correcto
(tú al maestro, usted a la familia) · número y fecha correctos en portada y
folios · PDF legible en un teléfono de gama baja y ≤5 MB · enlaces y QR
probados · tu firma de editor.

---

## 5. Distribución permanente: canales, archivo y ley

### Las tres capas de cada número

1. **HTML ligero por artículo** en el sitio (formato primario web): en Android
   de gama baja el navegador descarga el PDF en vez de mostrarlo, y una página
   de texto con imágenes comprimidas pesa veinte veces menos. Con el service
   worker, el número corriente se lee sin señal — el escenario real del aula.
2. **PDF comprimido ≤5 MB** para WhatsApp, que es la infraestructura educativa
   de facto del país (así se dieron las «clases» de la pandemia y así ya habla
   M.E.T.A.S con las familias). Canal de WhatsApp propio de la revista para
   difusión abierta + las comunidades escolares existentes. Ojo: los canales
   conservan el historial ~30 días — difunden, no archivan; el enlace
   permanente apunta siempre al sitio.
3. **PDF de alta calidad solo para archivo** (ver abajo) y la variante en
   escala de grises para fotocopiar en folleto: cinco hojas carta a doble cara
   por ejemplar, un «ejemplar de aula» plastificado y un cartel con QR llegan
   donde no hay datos.

Complementos de bajo costo: resumen de audio del número con NotebookLM (ya es
herramienta de la casa: página 19 del Nº 02), etiquetado como generado con IA,
en MP3 ligero por WhatsApp; y una cápsula quincenal de 5 minutos ofrecida a una
radio local — la radio llega a hogares sin datos y sin luz.

### Permanencia (lo que convierte un PDF en una publicación)

- **e-ISSN**: la revista califica (título estable, periodicidad declarada,
  editor identificado, números publicados). Honduras no consta con centro
  nacional ISSN; la solicitud va directa al Centro Internacional
  (portal.issn.org) — confirmar antes con la Biblioteca Nacional Juan Ramón
  Molina por si existe ventanilla local. Es el paso de mayor retorno simbólico
  por menor costo: la revista pasa de «PDF de un maestro» a publicación seriada
  citable ante SEDUC, universidades y cooperantes.
- **Zenodo**: DOI gratuito por número y un DOI de la serie completa;
  preservación de largo plazo respaldada por CERN. Da citabilidad académica.
- **Internet Archive**: depósito gratuito con visor de revista y texto
  buscable — exactamente el modelo de la Hemeroteca Erandique que la revista
  admira. Proponerle a Erandique una colaboración formal (la sección «De la
  hemeroteca» con crédito) beneficia a ambos.
- **Memoria local**: entregar ejemplar de cada número a la Biblioteca Nacional
  y a la biblioteca municipal de Villanueva. Que la revista exista en el
  registro cultural del país, no solo en servidores extranjeros.
- **Latindex** (directorio, vía el centro de acopio en la UNAH) cuando haya 4–6
  números regulares: visibilidad iberoamericana sin exigir arbitraje.

### Lo legal, en corto

- **Derechos de autor (Honduras)**: protección automática desde la creación
  (Decreto 4-99-E; vida + 75 años; Convenio de Berna). El registro voluntario
  ante el Instituto de la Propiedad sirve de prueba.
- **La obra asistida por IA con redacción y criterio humanos es protegible; la
  100 % generada, no** (criterio de la Oficina de Copyright de EE. UU.,
  2023–2025; la ley hondureña define autor como persona natural). Tu línea
  editorial te deja del lado protegible — y los borradores guardados en
  Redacción son la evidencia del proceso humano: otra razón para que el texto
  canónico nazca ahí.
- **Licencia recomendada: CC BY-NC-SA 4.0** sobre texto, fotos propias y
  composición — permite a maestros y familias copiar, imprimir y adaptar con
  crédito, sin reventa. **Salvedad obligatoria**: los elementos de stock de
  Canva no pueden sublicenciarse; la mancheta debe decir «…salvo elementos de
  stock de Canva y materiales de terceros, que conservan sus licencias».
- **Prensa histórica**: la de hace más de ~75 años es dominio público y el
  escaneo fiel no crea derechos nuevos; citar cabecera, fecha y hemeroteca
  digitalizadora, como ya se hace.
- **Imágenes de terceros**: solo con licencia explícita (Wikimedia Commons,
  Openverse, dominio público) y crédito por pieza. En una revista con ISSN y
  DOI, una infracción es visible y permanente.

### Sostenibilidad sin hipotecar la independencia

El patrocinio local que ya existe (el agradecimiento a Supermercado El Éxito en
el Nº 02) se blinda con una **muralla editorial escrita y publicada**: el
patrocinador aparece en una página fija de agradecimientos, separado del
contenido, y nunca ve ni sugiere ni veta un tema. Tres o cuatro patrocinios
pequeños protegen más que uno grande. Para crecer: UNESCO-IPDC financia medios
educativos comunitarios (con una entidad con personería como receptora — la
sociedad de padres del CEB, por ejemplo), y las subvenciones culturales de
embajadas son alcanzables. **Canva para Educación es gratuito para docentes**
verificados e incluye las funciones de pago: solicitarlo es lo primero.
«Cuentas claras» en cada número: cuánto entró, en qué se gastó.

---

## 6. La influencia posible en el pensamiento educativo hondureño

- **El nicho está vacío.** El ecosistema hondureño de publicaciones educativas
  es universitario (Paradigma de la UPNFM, las revistas de la UNAH) o gremial
  (los boletines de los colegios magisteriales, centrados en lo laboral). Entre
  la revista académica —lenta, arbitrada, para académicos— y el boletín
  reivindicativo no hay nada: **no consta ninguna revista de divulgación
  producida por un maestro de primaria pública en servicio**. PolicastSapiens
  ocuparía ese espacio sola.
- **La tradición la respalda.** La prensa pedagógica hecha por maestros formó
  el pensamiento educativo de América Latina: *La Obra* en Argentina (1921),
  *Educación y Cultura* del Movimiento Pedagógico colombiano (1984), el
  periódico escolar de Freinet en las aulas rurales. Y el Nº 02 ya se inscribe
  solo en esa genealogía al invocar *La Edad de Oro* de Martí. Contar esa
  historia en «En Hombros de Gigantes» legitima el proyecto con su propio
  linaje.
- **La constancia pesa más que el grosor.** La historia de estas revistas
  enseña que mueren por irregularidad, no por calidad. Aparecer cada quince
  días sin falta —aunque un número flaco tenga 12 páginas con todas las
  secciones— construye más autoridad que cualquier número brillante aislado.
  De ahí que la automatización no sea un lujo técnico: **es la condición de
  supervivencia de la quincenalidad**, como la página 13 del Nº 02 ya
  intuía. Definir desde ya el «número mínimo viable» y mantener un número de
  colchón en el banco de ideas.
- **El efecto de fondo**: una publicación docente constante que enseña a dudar
  (Popper), a dosificar la pantalla (el phármakon), a domar el algoritmo y a
  verificar antes de creer, es alfabetización mediática e informacional en el
  sentido exacto que UNESCO promueve — dirigida al magisterio y a las familias,
  que es donde el pensamiento educativo de un país realmente cambia. Las
  escuelas normales que ya la reciben (la Normal Bilingüe de Tela, página 9)
  son el multiplicador: cada normalista lector es un futuro maestro que llega
  al aula con esa vara.

---

## 7. Advertencias honestas de esta investigación

- **Se verificó en vivo**: el contenido íntegro de la Revista Nº 02, el código
  de Redacción y su esquema de datos, la separación de los dos proyectos de
  Supabase, el estado de privacidad de F.A.R.O, y el conector de Canva (leer el
  diseño de 20 páginas, formatos de exportación con PDF incluido, kit de marca
  presente, ausencia de plantillas con autollenado).
- **No se pudo verificar en línea** (fallo técnico del entorno de los agentes de
  investigación): las cifras y URLs de los estudios de contexto (educación
  hondureña, marcos éticos, requisitos del ISSN, condiciones de los paquetes de
  datos, requisito de plan del autollenado de Canva). Provienen de marcos
  publicados y estables, pero **toda cifra debe contrastarse con su fuente
  primaria antes de imprimirse en la revista** — que es, además, la regla que
  esta misma investigación recomienda adoptar.
- Pendientes de comprobar antes de construir: si Canva para Educación aplica a
  docentes hondureños y si desbloquea el autollenado por API; el trámite ISSN
  vigente para Honduras; y la prueba de `edit-design` sobre una copia del
  diseño real (no se tocó el original en esta sesión).

## 8. Por dónde empezar

1. Solicitar **Canva para Educación** (gratis, con credencial docente).
2. Crear la **plantilla maestra** duplicando el Nº 02 y fijando las cajas de
   texto por sección, con sus límites de palabras cargados en Redacción.
3. Escribir el Nº 03 en Redacción con el ciclo D1–D14 y producirlo con el flujo
   asistido (clonar plantilla → volcar textos → retoque humano → PDF ≤5 MB).
4. Publicar la **sección Revista** en el sitio (HTML ligero + PDF), con sellado
   de versión.
5. Imprimir en la mancheta: editor responsable, política de IA, licencia CC con
   salvedad de stock, correo de erratas. Preparar las dos hojas de
   consentimiento de imagen.
6. Con el Nº 03 publicado: tramitar el **e-ISSN**, crear la comunidad en
   Zenodo y la colección en Internet Archive, abrir el canal de WhatsApp.
7. Con 4–6 números regulares: Latindex, puente con la UPNFM, presentación del
   caso a SEDUC/UNICEF.
