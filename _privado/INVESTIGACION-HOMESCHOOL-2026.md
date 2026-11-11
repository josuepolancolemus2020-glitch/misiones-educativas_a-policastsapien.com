# M.E.T.A.S como servicio de pago: homeschool y tutorías a colegios privados

**Investigación legal, comercial y técnica — Honduras y expansión hispanoamericana**

*Preparado para la Familia Polanco-Castellanos · Proyecto Educativo M.E.T.A.S · 29 de julio de 2026*

---

## Cómo leer este documento

Esta investigación se realizó con 16 agentes de investigación independientes que ejecutaron cerca de 490 búsquedas y consultas web, priorizando fuentes primarias (leyes, reglamentos, sitios oficiales `.gob.hn`, organismos como HSLDA y OMPI). Las afirmaciones más importantes pasaron después por **verificación adversarial**: un segundo agente, independiente del primero, intentó *refutar* cada afirmación con búsquedas propias. Cada afirmación clave lleva su veredicto:

- **✔ CONFIRMADO** — fuentes independientes la respaldan; se puede actuar sobre ella (aun así, las decisiones legales finales requieren abogado).
- **◐ PLAUSIBLE** — nada la contradice, pero no se pudo confirmar con fuente primaria; tratar como hipótesis de trabajo a validar.
- **⚠ MATIZADO** — es parcialmente cierta; se indica la corrección exacta.

**Este documento no sustituye asesoría legal.** Varias normas hondureñas clave (los PDF oficiales de los acuerdos de la SEDUC) no pudieron leerse artículo por artículo desde este entorno; al final del documento hay una lista consolidada de lo que debe confirmar un abogado o gestor local, pensada para entregársela tal cual.

---

## 1. Resumen ejecutivo

1. **El homeschool es legal en Honduras y es modalidad oficial del sistema educativo** (✔ CONFIRMADO). Se apoya en el artículo 152 de la Constitución («Los padres tendrán derecho preferente a escoger el tipo de educación que habrán de darles a sus hijos»), en el artículo 27 de la Ley Fundamental de Educación (Decreto 262-2011), que lista «Educación en casa» entre las siete modalidades del Sistema Nacional de Educación, y en dos normas específicas: el Reglamento de Educación en Casa (Acuerdo 1367-SE-2014) y los Lineamientos para la Funcionalidad de la Modalidad (Acuerdo 0368-SE-2020). La SEDUC tiene incluso una Subdirección General de Educación en Casa. Honduras es uno de los pocos países latinoamericanos con homeschool expresamente reglamentado: **el país base de M.E.T.A.S es, legalmente, uno de los mejores de la región para este negocio.**

2. **Pero la modalidad oficial es administrada, no libre** (✔ CONFIRMADO). Exige registro del alumno en el sistema SACE *a través de un centro educativo autorizado*, evaluaciones en ese centro, visita del director al hogar y sujeción al currículo nacional. Además, la SEDUC la gestiona hoy como programa focalizado en estudiantes vulnerables (discapacidad, enfermedad, riesgo social, falta de transporte), con una meta de apenas ~800 estudiantes en 2025. Las familias que educan en casa *por convicción* operan en la práctica a través de **«escuelas sombrilla»** (colegios autorizados que las matriculan bajo la modalidad y certifican, como EuropaSchule en San Pedro Sula) o mediante escuelas acreditadas de EE. UU. **Hay muy pocas escuelas sombrilla en el país: ese es exactamente el hueco de mercado.**

3. **M.E.T.A.S no debe constituirse como escuela, y esa es su mayor ventaja legal** (◐ PLAUSIBLE — validar con abogado). Certificar grados exige ser centro educativo autorizado por la SEDUC (trámite de 6+ meses, local, docentes de planta, inspecciones). En cambio, vender **plataforma de contenido + tutorías + refuerzo sin emitir certificados oficiales** es un servicio mercantil ordinario: no se encontró ninguna norma hondureña que exija permiso de la SEDUC para academias de tutorías o plataformas educativas, y así operan en la práctica Academia Europea, EduBox y los tutores del país. La regla de oro comercial: **nunca presentarse como «escuela», «colegio» o «centro educativo», y aclarar siempre que los diplomas de la plataforma son motivacionales, no certificación oficial.**

4. **La certificación oficial se resuelve por alianza, no en solitario** (✔/◐). El camino de mayor valor: convenio con un centro educativo ya autorizado que actúe como escuela sombrilla —matricula en SACE, evalúa y certifica— mientras M.E.T.A.S pone plataforma, contenido y seguimiento, con reparto de ingresos. El precedente exacto ya existe en Honduras: la plataforma Dawere entrega el título de bachiller hondureño mediante un centro registrado ante la SEDUC, y la propia SEDUC adoptó esa plataforma para su Bachillerato Virtual gratuito (◐ — el eslabón Dawere↔centro↔SEDUC quedó pendiente de confirmación con fuente primaria).

5. **La formalización mercantil es barata y rápida** (◐ — cifras a confirmar). Fase 1: comerciante individual (Registro Mercantil en la Cámara de Comercio, RTN gratuito ante el SAR, facturación con CAI, permiso de operación municipal), con el Régimen Simplificado del ISV si se vende menos de L 250,000/año. Fase 2 (al firmar con colegios): S. de R.L. (capital mínimo L 5,000, admite un solo socio). Los «servicios de enseñanza» están **exentos del ISV del 15%** (art. 15 de la Ley del ISV); queda la duda interpretativa de si el «acceso a plataforma digital» se clasifica como enseñanza — pedir confirmación por escrito al SAR y facturar el servicio como «servicio de enseñanza/tutoría en línea con plataforma incluida». La figura de ONGD **no** sirve para este negocio (no permite distribuir utilidades a la familia).

6. **Cobros**: en Honduras no existe Stripe. Para lempiras: **Tilopay** (afiliación digital, pagos recurrentes, depósito en banco local), **PixelPay** (hondureña, tokenización para suscripciones) y **BAC CompraClick** (links de pago por WhatsApp); PayPal solo como canal complementario en dólares. Fase 1 realista: transferencia bancaria + activación manual del código de licencia (así cobran hoy los colegios privados hondureños). Para clientes de **otros países**: LLC en EE. UU. (Stripe Atlas ~US$500, o Wyoming/Nuevo México) con Stripe/PayPal/Wise — usarla **exclusivamente** para clientes fuera de Honduras y presentar sin falta el Formulario 5472 (multa de US$25,000 por omisión). A clientes hondureños siempre se factura con la entidad local.

7. **Hallazgo crítico de infraestructura** (✔ CONFIRMADO con texto literal): **los términos de GitHub prohíben usar GitHub Pages para software comercial por suscripción** («not intended or allowed... to run your online business... or providing commercial software as a service»). Además, con el plan gratuito el repositorio es público: todo el contenido «de pago» sería clonable. **Antes de cobrar un solo lempira hay que migrar el sitio a Cloudflare Pages** (gratis, permite uso comercial, ancho de banda ilimitado para estáticos, mismo dominio, mismo flujo de despliegue desde GitHub). El uso actual gratuito de M.E.T.A.S no viola nada.

8. **Registrar la marca M.E.T.A.S ya** (✔ en el principio; cifras ◐). Honduras es sistema *first-to-file*: el derecho nace con el registro, no con el uso; un tercero podría registrar «METAS» y bloquear el nombre justo al empezar a cobrar. Presentar ante la DIGEPIH la marca **mixta** (logo + «M.E.T.A.S» con puntos, para sortear la objeción de descriptividad de la palabra común «metas»), mínimo en clase 41 (educación). Honduras no es parte del Protocolo de Madrid: la expansión se registra país por país, con la prioridad de 6 meses del Convenio de París desde la solicitud hondureña. En paralelo: cesión escrita de derechos de autor de los miembros de la familia hacia un titular único (y luego a la sociedad).

9. **Expansión internacional**: vender plataforma + tutorías (sin títulos) es legal en prácticamente todos los países hispanohablantes, incluso donde el homeschool sustitutivo está prohibido (España) o no reconocido (El Salvador, Nicaragua, R. Dominicana). Orden de entrada sugerido: **Honduras → Guatemala → México y Colombia → Chile y Ecuador → hispanos de EE. UU.** En España, El Salvador y Nicaragua, comercializar solo como refuerzo/extraescolar.

10. **Precios realistas para Honduras** (síntesis propia sobre datos de mercado, certeza media-baja): plan **familiar homeschool L 250–400/mes** (o ~L 3,000/año); refuerzo solo-plataforma L 150–250/mes por alumno; paquete plataforma + tutorías en vivo L 1,200–2,000/mes; **B2B colegios L 250–500 por alumno/año** con el modelo regional «el colegio adopta, el padre paga» (así venden Progrentis, AMCO y Santillana Compartir), y tarifario premium en dólares (US$25–40/alumno/año) para los ~37 colegios bilingües de élite de la ABSH. Mantener un núcleo gratuito: el entusiasmo de los maestros es el canal de venta.

11. **Ruta técnica en 3 fases**, sin romper el offline-first innegociable: **Fase 1 (2–4 semanas)** — migrar hosting, esquema de licencias en Supabase con activación por código y gracia offline de 15–30 días, freemium (6–8 misiones gratis de vitrina), panel de licencias para activación manual tras transferencia; **Fase 2 (2–4 meses)** — Cloudflare Worker que gatea la *descarga* del contenido premium (el uso sigue siendo offline), pasarela automática, app Android activada por código; **Fase 3** — multi-tenant de colegios con asientos, panel de dirección, marca del colegio. El principio honesto: el objetivo alcanzable es «solo quien paga entra», no DRM; el valor imposible de copiar está en la nube (panel docente, resultados, avisos, soporte).

---

## 2. Marco legal del homeschool en Honduras

### 2.1 La base legal: Constitución, Ley Fundamental y dos acuerdos de la SEDUC

**✔ CONFIRMADO (verificación adversarial superada punto por punto).**

| Norma | Qué establece |
|---|---|
| **Constitución de 1982, art. 152** | «Los padres tendrán derecho preferente a escoger el tipo de educación que habrán de darles a sus hijos.» Es el anclaje del homeschool que citan HSLDA y la propia SEDUC. |
| **Constitución, arts. 153, 157, 166, 171** | La educación básica es obligatoria y el Estado debe costearla (171, con «mecanismos de compulsión»); la educación formal —excepto la superior— es «autorizada, organizada, dirigida y supervisada exclusivamente por el Poder Ejecutivo» (157); toda persona puede fundar centros educativos dentro de la ley (166). |
| **Ley Fundamental de Educación (Decreto 262-2011, La Gaceta 22-feb-2012), art. 27** | Lista SIETE modalidades del Sistema Nacional de Educación; la número 6 es **«Educación en casa»**. La lista no es taxativa («son, entre otras»). El art. 8 obliga a los padres a procurar que sus hijos cursen desde un año de prebásica hasta la media (~escolaridad obligatoria de 11–12 años). |
| **Reglamento de Educación en Casa (Acuerdo 1367-SE-2014, La Gaceta 17-sep-2014)** | Normas y procedimientos para que los padres eduquen en el hogar; regula operación y evaluación. |
| **Lineamientos para la Funcionalidad de la Modalidad de Educación en Casa (Acuerdo 0368-SE-2020; La Gaceta N.º 35,617 del 3-jun-2021)** | Registro obligatorio del estudiante, asignaturas exigidas, edad escolar obligatoria, calificaciones requeridas de quien enseña, y requisitos de evaluación. |
| **Estructura SEDUC** | Existe una **Subdirección General de Educación en Casa** (SDGEC) bajo la Dirección General de Modalidades Educativas. |

HSLDA (Home School Legal Defense Association, la organización de referencia mundial) confirma la legalidad y clasifica a Honduras como uno de los países centroamericanos con regulación más formal del homeschool. Contacto para casos internacionales: `international@hslda.org`.

### 2.2 La tensión clave: la modalidad es administrada, no libre

**✔ CONFIRMADO** (corroborado por el medio estatal TNH y los propios Lineamientos):

- El proceso oficial incluye: **matrícula a través de un centro educativo autorizado y registro en SACE**, visita del director del centro al hogar, sujeción estricta al currículo y calendario oficiales, y **evaluaciones rendidas preferentemente en el centro** (pruebas mensuales y de fin de grado; ponderación reportada 70/30 en básica y 60/40 en media). Al aprobar, el alumno recibe certificados oficiales registrados en SACE.
- La verificación adversarial añadió dos datos importantes de los Lineamientos 2020 (vía análisis de terceros con cita de articulado, pendiente de lectura directa): el **art. 51 exige que todo currículo extranjero usado en educación en casa sea «avalado» por la SEDUC**, y el art. 10 reinterpretó la «educación libre» como formación no formal de adultos, cerrando la vía no curricular para menores en edad escolar.
- **En la práctica 2024–2025 la SEDUC focaliza la modalidad en población vulnerable** (riesgo social, discapacidad, enfermedad, falta de transporte), disponible en 17 de 18 departamentos, con meta de ~800 estudiantes atendidos en 2025. No se encontró criterio oficial que diga si una familia «sana y con escuela cercana» puede exigir la modalidad por simple convicción — esta ambigüedad es el principal riesgo regulatorio de un homeschool masivo y debe consultarse directamente con la SDGEC o una Dirección Departamental.

**Conclusión estratégica:** el marco existe y es de los más favorables de la región, pero es de los regímenes de homeschool más *intervenidos*: no es un mercado «sin fricción». La puerta real para familias por convicción es la **escuela sombrilla**, y M.E.T.A.S gana más siendo la herramienta que hace *cumplible* el reglamento (portafolio de evidencias, notas por parcial, reportes por asignatura) que intentando sustituirlo.

### 2.3 Cómo operan hoy las familias homeschoolers hondureñas

Dos vías documentadas (La Prensa, blogs de familias, EuropaSchule):

1. **Currículo propio + escuela sombrilla hondureña**: entrevista de los padres con el director de un centro autorizado; el centro presenta la documentación a la Dirección Municipal/Distrital de Educación; los padres entregan notas por parcial y llevan portafolio de evidencias; la escuela matricula en SACE, supervisa y certifica. **Hay muy pocas escuelas sombrilla** (los colegios no quieren perder alumnos presenciales) — hueco de mercado documentado, aunque sin cifra oficial.
2. **Escuela acreditada de EE. UU. (umbrella school en línea)**: la más común; el niño queda fuera del sistema hondureño y la validación local requeriría después equivalencias o exámenes de ubicación. Costos reportados: US$0 (currículos gratuitos) hasta **US$1,000–3,000 por alumno/año** en opciones acreditadas.

Comunidad: grupos de Facebook («Homeschool in Honduras»), WhatsApp y co-ops familiares. EuropaSchule (San Pedro Sula) es el ejemplo institucional del modelo sombrilla, con acompañamiento, formación a padres y certificación oficial.

### 2.4 Riesgos legales para las familias (y por qué importan al negocio)

- La LFE (art. 8) y la Constitución (art. 171) imponen el deber de escolarizar; el Código de la Niñez y la Adolescencia (Decreto 73-96) obliga a matricular y vigilar la asistencia. **No se encontró ninguna multa específica vigente por no matricular ni ningún caso de familia sancionada por hacer homeschool.** El riesgo práctico documentado es administrativo: un niño sin registro en SACE «no existe» para el sistema y necesitaría procesos de ubicación para reinsertarse.
- Contexto de presión creciente: ante la caída de matrícula (~1.2 millones de niños fuera del sistema según prensa), la SEDUC anunció en 2026 búsquedas «casa a casa» de niños que no asisten a clases. Un homeschooler no registrado podría ser contado como «fuera del sistema».
- **Implicación comercial:** M.E.T.A.S debe *empujar* a sus familias clientes hacia el registro (modalidad oficial o sombrilla), nunca facilitar la desescolarización informal. Es a la vez la postura legalmente segura, la éticamente correcta y la comercialmente más inteligente (el expediente imprimible de M.E.T.A.S se convierte en el instrumento de cumplimiento).

### 2.5 La frontera legal decisiva para M.E.T.A.S

**◐ PLAUSIBLE (bien fundado, pendiente de dictamen legal).** El veredicto adversarial: los anclajes normativos se verifican, pero la conclusión es un argumento por silencio normativo — nada la contradice, y la prudencia de validarla con abogado es correcta.

| | Ser «centro educativo» | Vender plataforma + tutorías |
|---|---|---|
| **Qué implica** | Matricular alumnos, impartir niveles del sistema formal, certificar grados y títulos | Contenido, práctica, refuerzo, tutorías; sin matrícula oficial ni certificados |
| **Requisito** | Autorización estatal (Const. arts. 157 y 166; LFE Título III; Reglamento de Centros Educativos, Acuerdo 1361-SE-2014; Reglamento de Instituciones de Educación No Gubernamentales, Acuerdo 1363-SE-2014) | Registro mercantil ordinario + RTN + facturación SAR + permiso municipal. No se encontró norma que exija permiso de SEDUC |
| **Precedentes** | Colegios privados, EuropaSchule, centro certificador de Dawere | Academia Europea (academia comercial grande, certificados propios no oficiales), EduBox (SaaS escolar para ~35 colegios), tutores locales |

Matices que la verificación obligó a incorporar:

- La definición de «institución educativa no gubernamental» del Acuerdo 1363-SE-2014 es amplia («ofrecer uno o más servicios educativos»); el argumento fuerte para quedar fuera es el **ámbito** del reglamento (educación formal por niveles conducente a grados y títulos, LFE art. 16), no la definición literal.
- Honduras sí tiene un marco de **educación no formal** (LFE art. 17, Reglamento de Educación No Formal, CONEANFO como ente rector — Decreto 313-98). Una plataforma de refuerzo encaja conceptualmente ahí, y nada indica que CONEANFO licencie plataformas privadas; pero el abogado debe evaluar también este ángulo. El registro ante CONEANFO/INFOP solo sería relevante si M.E.T.A.S quisiera certificar *competencias* con reconocimiento estatal.
- La LFE contiene una disposición sobre prohibición de cobros por «clases particulares» dirigida a docentes que cobran a sus propios alumnos; antes de vender tutorías dentro de colegios con los mismos docentes, verificar el artículo exacto y estructurar los contratos B2B con el colegio, no con el docente.

**Reglas de presentación comercial (mitigación de riesgo de forma):** no usar «escuela», «colegio», «centro educativo», «matrícula oficial», «grados» ni «diplomas oficiales»; rotular los diplomas de la plataforma como reconocimientos internos de logro; incluir en términos de servicio y marketing la aclaración «M.E.T.A.S es una plataforma de refuerzo y apoyo educativo; la certificación oficial de estudios la emite su centro educativo o la Secretaría de Educación».

### 2.6 La educación a distancia ya es normal en Honduras (legitimidad cultural)

**◐ PLAUSIBLE** (hechos centrales verosímiles; el verificador no pudo re-confirmar cifras y el número de acuerdo de SEMED por agotamiento de presupuesto de búsqueda — re-verificar antes de citar en material comercial):

- **IHER «El Maestro en Casa»** (Instituto Hondureño de Educación por Radio, desde 1989): certificación reconocida, decenas de miles de alumnos, presencia en la mayoría de municipios. El paralelo de naming con M.E.T.A.S es directo y culturalmente potente.
- **SEMED/ISEMED** (educación media a distancia, fines de semana) y **EDUCATODOS** (básica acelerada con certificación oficial).
- **Advertencia de diseño**: todas estas rutas están pensadas para sobreedad (15+, 17+, 18+). **No sirven para certificar año a año a un niño de primaria**; para ese segmento, el único canal ordinario es la escuela sombrilla autorizada (✔ confirmado vía los Lineamientos). Sí funcionan como «red de seguridad» en el discurso comercial: un homeschooler adolescente siempre puede titularse vía IHER (15+), la prueba RVA de 9.º grado (17+), ISEMED (15+) o el Bachillerato Virtual gratuito de la SEDUC (18+), y llegar a la UNAH rindiendo la PAA. El homeschool en Honduras no es un callejón sin salida académico.

---

## 3. Permisos y registros para operar

### 3.1 La vía mínima recomendada: empresa mercantil ordinaria

**✔/◐ (estructura confirmada; montos exactos a cotizar).** Pasos, en orden:

1. **Constitución**: comerciante individual (escritura ante notario, o el portal `miempresaenlinea.org`) o, más adelante, S. de R.L. El costo dominante son los honorarios del notario — cotizar con 2–3 abogados.
2. **Registro Mercantil** en la Cámara de Comercio (CCIT en Tegucigalpa u homóloga local): tasas del orden de cientos de lempiras (referencias: ~L 200 base + afiliación ~L 590; confirmar tarifario vigente).
3. **RTN** ante el SAR (formulario SAR-410) — gratuito.
4. **Inscripción al Régimen de Facturación** (Declaración SAR-926) y obtención del **CAI** para emitir facturas legales (obligatorio aunque el servicio esté exento de ISV; la factura se emite marcando el valor como exento). La facturación electrónica está en implementación gradual por fases.
5. **Permiso de operación municipal** (renovación anual; previa Declaración Jurada del Impuesto sobre Industria, Comercio y Servicios, que se paga mensualmente según volumen declarado). Un negocio 100% en línea lo tramita sobre su domicilio fiscal.
6. Si contratan personal: IHSS, RAP, INFOP (1% sobre planilla).

**La figura de ONGD/asociación civil NO es adecuada** para este negocio: no permite distribuir utilidades a la familia, el trámite ante SEGOB/URSAC es lento, y usarla para vender suscripciones expondría a perder personalidad y exenciones. Solo tendría sentido, más adelante, como brazo becario/filantrópico separado (por ejemplo, para donar el núcleo gratuito a escuelas públicas).

### 3.2 La vía «colegio formal»: conocerla para descartarla (por ahora)

**✔ CONFIRMADO.** Autorizar un centro educativo no gubernamental exige: solicitud escrita y digital **bajo juramento** ante la Dirección Departamental de Educación **al menos 6 meses antes** del período lectivo; estudio de factibilidad; niveles/modalidades a ofrecer; director académico; título de propiedad o arrendamiento del local; calendario que cumpla 200 días lectivos; permiso municipal previo (con constancia ambiental y de bomberos); docentes calificados; inspecciones cuyo costo fija la SEDUC; en la práctica, mínimo ~15 alumnos matriculados. Es una vía lenta y pesada, **inadecuada como primer paso** para una plataforma. Se retoma en la Fase 2–3 solo si la alianza sombrilla se queda corta y conviene un centro propio (el modelo Dawere).

### 3.3 Software educativo vendido a colegios: contrato privado, sin registro estatal

**✔ CONFIRMADO en la práctica.** No existe registro o licencia estatal específica para proveedores de plataformas educativas que venden a colegios privados: es un contrato mercantil entre empresa y colegio. Evidencia: EduBox (SaaS hondureño de gestión escolar) opera para ~35 colegios sin permiso de SEDUC; la propia SEDUC *contrata* edtech privada (ODILO/«Educatrachos») como proveedor. Matiz: el registro oficial de calificaciones sigue siendo SACE — M.E.T.A.S puede gestionar notas internas pero no sustituye el registro oficial, y así debe decirlo el contrato.

### 3.4 Protección de datos de menores

**✔ CONFIRMADO.** Honduras **no tiene ley general de protección de datos vigente** (el anteproyecto del IAIP sigue en comisión del Congreso; en 2025–2026 se presentaron nuevas iniciativas, ninguna aprobada a la fecha de esta investigación). Lo que existe: habeas data constitucional (art. 182, con acceso/rectificación/supresión sobre archivos públicos o privados), la Ley de Transparencia (Decreto 170-2006, sector público) y el Código de la Niñez (protección de intimidad e imagen de menores).

**Estándar operativo recomendado desde ya** (ventaja: la arquitectura offline-first con localStorage ya es «privacidad por diseño»):

- Consentimiento parental **expreso y verificable** antes de crear cuentas de menores o subir resultados a la nube (el consentimiento lo da el adulto, no el niño).
- Minimización de datos (nombre/alias, grado y resultados; nada más).
- Aviso de privacidad claro para padres y colegios; derechos de acceso, corrección y borrado a solicitud.
- En contratos B2B: el colegio declara contar con los consentimientos de los padres y autoriza el uso solo con fines educativos; M.E.T.A.S se obliga a confidencialidad, no comercialización de datos y borrado/retorno al terminar.
- Si se vende a EE. UU.: COPPA aplica a operadores extranjeros dirigidos a niños en EE. UU. (menores de 13; consentimiento parental verificable con métodos aprobados — un checkbox no basta). Si hubiera usuarios en España/UE: RGPD + LOPDGDD (consentimiento digital a los 14 años; hay proyecto para subirlo a 16 con verificación de edad). México, Colombia, Argentina, Costa Rica sí tienen leyes plenas — revisar país por país antes de vender allí.

### 3.5 Contratos: base legal sólida para vender en línea

**✔ CONFIRMADO.** La Ley sobre Comercio Electrónico (Decreto 149-2014, basada en la Ley Modelo UNCITRAL) y la Ley sobre Firmas Electrónicas (Decreto 149-2013, ref. Decreto 33-2020) dan validez a los contratos con aceptación clic (guardar registro de fecha, versión aceptada y usuario). Aplica además la Ley de Protección al Consumidor (Decreto 24-2008): precio total claro, condiciones de renovación (la renovación automática debe informarse expresamente), política de cancelación y reembolso.

**Paquete contractual mínimo (3 documentos + anexo):**

1. **Términos de Servicio + Política de Privacidad** para familias: identificación del prestador (razón social, RTN), descripción del servicio, precio y renovación, disponibilidad «tal cual» con esfuerzo razonable (importante siendo sitio estático + Supabase, sin SLA garantizable), propiedad intelectual (licencia de uso personal, prohibida la redistribución), tratamiento de datos, y la aclaración de que M.E.T.A.S no constituye escolaridad oficial.
2. **Consentimiento informado del padre/madre/tutor** (documento o checkbox separado con registro).
3. **Contrato de licencia B2B con colegios**: objeto (licencia anual por alumno o institucional + panel docente + capacitación), facturación local con CAI, número de usuarios, consentimientos a cargo del colegio, confidencialidad y datos de alumnos, PI reservada, límites de responsabilidad, soporte realista, terminación con devolución/borrado de datos.
4. **Anexo**: registro de marca y de derechos de autor (sección 6).

---

## 4. Certificación y validación de estudios

### 4.1 El mapa completo de rutas de certificación para un alumno M.E.T.A.S

| Ruta | Para quién | Estado |
|---|---|---|
| **Escuela sombrilla hondureña autorizada** (matrícula SACE bajo modalidad Educación en Casa) | Niños en edad escolar (primaria y básica) — **el único canal ordinario para ese segmento** | ✔ Confirmado; pocas sombrillas disponibles |
| **Alianza M.E.T.A.S + centro autorizado** (modelo Dawere) | Todos los alumnos de la plataforma | ◐ Jurídicamente plausible; probado en el país por Dawere |
| **Umbrella school de EE. UU. + apostilla + equivalencia SEDUC** | Familias que quieren diploma estadounidense | ⚠ Matizado: vía real, pero el art. 51 de los Lineamientos exige aval previo de la SEDUC al currículo extranjero, y los criterios materiales de equivalencia no están publicados — es el mayor riesgo de esa vía |
| **RVA (17+), IHER (15+), ISEMED (15+), Educatodos (10–35), Bachillerato Virtual SEDUC (18+)** | Adolescentes/sobreedad | ◐ Red de seguridad, no certificación anual de primaria |
| **Universidad** | Egresados | ✔ UNAH exige media culminada + PAA (abierta a títulos extranjeros apostillados); UNITEC pide título apostillado |

### 4.2 El precedente Dawere: el modelo exacto ya opera en Honduras

**◐ PLAUSIBLE** (el verificador confirmó que el centro certificador existe físicamente y que Dawere es real y opera este modelo en varios países; el eslabón específico Dawere↔centro↔SEDUC quedó sin fuente primaria — confirmarlo con el convenio o La Gaceta antes de citarlo en un pitch).

Dawere International High School entrega el título de bachiller hondureño mediante un centro de enseñanza registrado ante la SEDUC, y la SEDUC lanzó con esa plataforma su Bachillerato en Ciencias y Humanidades Virtual **gratuito** (18+, con 9.º grado). Lecturas para M.E.T.A.S:

- El modelo «plataforma privada + centro certificador aliado» no solo es tolerado: la SEDUC lo **adoptó**.
- Dawere es también **competidor** en bachillerato virtual (12+). El diferencial de M.E.T.A.S es primaria/básica gamificada offline-first y tutorías cercanas — segmentos que Dawere no cubre.
- Precedente adicional hondureño: el SAT de la Asociación Bayán (ONG cuyo programa logró reconocimiento pleno por acuerdos con la SEDUC y el Consejo de Educación Superior) demuestra que un actor no estatal puede escalar hasta el reconocimiento oficial.

### 4.3 Umbrella schools de EE. UU. (si se ofrece la vía internacional)

Ecosistema real que ya atiende a familias latinoamericanas: Bridgeway Academy (acreditada Cognia/WASC), Abeka Academy (MSA-CESS), Homelife Academy y AMA Homeschooling (servicio en español), West River Academy (muy popular en LATAM; **ojo**: su acreditación NALSAS es débil — riesgo de rechazo en trámites de equivalencia exigentes). Circuito completo: diploma → apostilla del Secretario de Estado (EE. UU. es parte de La Haya) → traducción → equivalencia ante la Secretaría General de la SEDUC → PAA/universidad. España no es alternativa: el homeschool carece de regulación allí y su vía a distancia (CIDEAD) está restringida a españoles en el exterior.

**Recomendación**: si M.E.T.A.S refiere familias a una umbrella school, elegir una con acreditación regional seria (Cognia/MSA/WASC) y con servicio en español, y explicar el circuito completo con honestidad, incluido el riesgo de la equivalencia.

### 4.4 Acreditación internacional de calidad (Cognia)

Costo directo alcanzable (~US$1,200/año de membresía + tasas de revisión; ciclo de 6 años; proceso inicial de 18–24 meses), **pero Cognia acredita instituciones educativas, no plataformas de software**: solo aplicaría si la familia constituye (o se alía con) una escuela formal. Alternativa de mediano plazo, no de arranque. Peldaños intermedios de marketing: certificaciones temáticas de Cognia o el «sello prestado» de aliarse con escuelas ya acreditadas (la Escuela Internacional Sampedrana está acreditada por Cognia — referencia local).

---

## 5. Estructura fiscal y cobros

### 5.1 Impuestos

**◐ PLAUSIBLE en su conjunto** (el verificador no halló nada en contra; los textos oficiales deben confirmarse con fiscalista):

- **ISV (15%)**: los «servicios de enseñanza» y los «honorarios profesionales» figuran entre los servicios **exentos** del art. 15 de la Ley del ISV (Decreto 24-1963 y reformas), confirmado por la FAQ del SAR. **Duda interpretativa clave**: el «acceso a una plataforma digital» no está literalmente en la lista; si el SAR lo clasificara como licencia de software, pagaría 15%. Mitigación: describir y facturar el servicio como «servicio de enseñanza/tutoría en línea con plataforma incluida» y **pedir confirmación por escrito al SAR** antes de fijar precios. Matiz del verificador: la exención de honorarios profesionales está formulada para personas naturales; si factura una S. de R.L., el amparo sería la exención de enseñanza, no la de honorarios.
- **Régimen Simplificado del ISV**: ventas anuales < L 250,000 → declaración anual en vez de mensual. Ideal para la fase inicial.
- **ISR persona natural**: tabla progresiva (2025: exento hasta ~L 21,457/mes; tramos de 15/20/25%). **ISR sociedades**: 25% + aportación solidaria del 5% sobre renta neta que exceda L 1 millón. Mientras las utilidades sean modestas, tributar como comerciante individual es más eficiente; la S. de R.L. se justifica por límite de responsabilidad y contratos con colegios, no por ahorro fiscal.
- El «monotributo» del Código Tributario (Decreto 170-2016) existe como figura legal pero no se encontró reglamentación operativa — no contar con él.

### 5.2 Cobros en lempiras (Honduras)

| Opción | Lo relevante |
|---|---|
| **Transferencia bancaria + activación manual** | La vía de la Fase 1: cero comisión, cero papeleo de pasarela; es como cobran los colegios. El cliente envía comprobante por WhatsApp y la familia activa el código de licencia. |
| **Tilopay** | Pasarela centroamericana que opera en Honduras; afiliación digital, sin mensualidad anunciada, links de pago, plugins, **pagos recurrentes**, depósito en banco local. Cotizar comisiones. |
| **PixelPay** | Pasarela hondureña para MIPYMES; checkout, QR, API y **tokenización para suscripciones**; opera sobre adquirencia de bancos locales. |
| **BAC Credomatic (e-commerce / CompraClick)** | Links de pago por WhatsApp/correo sin web propia; útil si el colegio o la familia ya es cliente BAC. |
| **PayPal Honduras** | Solo como canal adicional en dólares (no procesa lempiras; el retiro depende del banco local). |
| **Stripe / dLocal Go** | **No disponibles** para comercios hondureños. |

### 5.3 Cobros internacionales (expansión)

Ruta estándar: **LLC en EE. UU.** (Stripe Atlas ~US$500 en Delaware, o Wyoming/Nuevo México por cuenta propia) + EIN + cuenta bancaria US (Mercury/Relay) + Stripe/PayPal US + Wise como puente. Reglas duras:

1. La LLC se usa **exclusivamente** para clientes fuera de Honduras. A colegios y familias hondureñas se les factura siempre con la entidad local y CAI (un pagador hondureño que pague a una entidad extranjera tendría que retener ISR de no residentes — arts. 5, 25 y 50 de la Ley del ISR).
2. Una LLC unimiembro de dueño extranjero sin ingresos efectivamente conectados a EE. UU. no paga impuesto federal, **pero debe presentar cada año el Formulario 5472 + 1120 proforma (multa de US$25,000 por omisión)** y pagar sus cuotas estatales.
3. La tributación en Honduras de lo que la familia reciba de la LLC está en zona gris (debate «renta territorial vs. mundial» sobre el art. 1 de la Ley del ISR, con reforma en discusión): **validar con contador hondureño antes de mover dinero**, y monitorear la «Ley de Justicia Tributaria».

---

## 6. Propiedad intelectual e infraestructura comercial

### 6.1 GitHub Pages: hallazgo crítico verificado

**✔ CONFIRMADO con texto literal** (obtenido del repositorio oficial de políticas de GitHub):

> «GitHub Pages is not intended for or allowed to be used as a free web hosting service to run your online business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions or **providing commercial software as a service (SaaS)**.»

- El uso **actual** (gratuito, proyecto educativo familiar) es exactamente el uso previsto y no viola nada; los botones de donación están permitidos.
- Un M.E.T.A.S de suscripción («solo quien paga entra») encaja de lleno en lo prohibido. GitHub además se reserva recuperar subdominios «sin responsabilidad», los límites son blandos (100 GB/mes, sitio de 1 GB) y no hay SLA: el escenario catastrófico (baja del sitio con clientes pagando) es contractualmente posible y sin recurso.
- Con el plan gratuito **el repositorio debe ser público**: todo el contenido «premium» sería clonable con un comando. Incluso con repo privado (GitHub Pro, ~US$4/mes), el sitio publicado sigue siendo público para quien tenga la URL.
- **Solución verificada y gratuita**: **Cloudflare Pages** — su documentación oficial dice «Requests to static assets are free and unlimited»; permite uso comercial en el plan Free; se conecta al mismo repo de GitHub (deploy automático en cada push) y solo cambia el DNS de `metas.policastsapien.com`. La experiencia del usuario no cambia en nada. (Netlify Free también permite uso comercial con tope de 100 GB/mes; Vercel Hobby lo prohíbe.)
- **Orden correcto**: primero migrar hosting (y pasar el repo a privado), después activar el cobro. Nunca al revés.

### 6.2 Google Play (la app Android)

- **Modelo recomendado: «solo consumo» (tipo Netflix)** — la app se distribuye gratis y solo pide iniciar sesión; toda la venta ocurre en la web o por canales locales. En ese esquema no se paga comisión a Google ni se necesita perfil de comerciante de Play. **Regla de oro**: ningún botón, enlace o texto dentro de la app que dirija a comprar fuera (anti-steering).
- Si algún día se vende dentro de la app: Google Play Billing obligatorio (15% en suscripciones) y habría que verificar primero si un desarrollador domiciliado en Honduras puede crear el perfil de comerciante — posible bloqueante sin verificar.
- **Obligatorio ya, con o sin cobro** (app dirigida a niños): cumplir la Política de Familias (contenido apropiado, sin identificadores de publicidad de niños, SDKs aptos), publicar **política de privacidad** (en la ficha de Play y dentro de la app) y completar el formulario **Data Safety** declarando todo lo que sube a Supabase (correos de maestros, resultados y conducta de alumnos). Una actualización de la app sin esto no pasaría revisión.

### 6.3 Marca M.E.T.A.S y derechos de autor

**Principios ✔; cifras y detalles de trámite ◐ (esta sub-investigación no pudo verificar en línea y se basa en conocimiento consolidado — confirmar con abogado de PI).**

- Honduras es sistema **atributivo (first-to-file)**: el derecho sobre la marca nace con el registro, no con el uso. Un tercero que registre «METAS» en clase 41 podría bloquear el nombre. **La solicitud es la medida preventiva más barata y eficaz, y debe presentarse antes del lanzamiento comercial.**
- Autoridad: DIGEPIH (Instituto de la Propiedad). Marco: Ley de Propiedad Industrial (Decreto 12-99-E) y Ley del Derecho de Autor (Decreto 4-99-E).
- **Riesgo de descriptividad**: «metas» es palabra común y «Misiones Educativas» describe el servicio. Mitigación: solicitar la marca **mixta** (logo + «M.E.T.A.S» con puntos, defendible como acrónimo de fantasía), usar «Misiones Educativas» solo como descriptor, y considerar registrar también «PolicastSapien» como marca casa inherentemente distintiva.
- Clases de Niza: **41** (educación — esencial), **42** (SaaS), **9** (app descargable). Estrategia de ahorro: empezar solo con la 41 y ampliar con ingresos. Presupuesto orientativo Honduras (3 clases, tasas + honorarios): ~US$1,000–2,500; plazo sin oposiciones 6–14 meses; vigencia 10 años renovables.
- **Honduras NO es parte del Protocolo de Madrid**, y una titular puramente hondureña tampoco podría usarlo como origen: la expansión se registra **país por país** (Guatemala, México, Colombia, Chile, Ecuador), aprovechando la **prioridad de 6 meses del Convenio de París** desde la solicitud hondureña. Antes de invertir, autoconsultar gratis las bases de IMPI (México), SIC (Colombia), INAPI (Chile), RPI (Guatemala) y SENADI (Ecuador) buscando conflictos con «metas».
- **Derechos de autor**: nacen automáticamente (Berna), pero la titularidad está hoy dispersa entre los miembros de la familia. Hacer ya: inventario de obras (misiones, manuales, código, arte) con autor y fecha; **contrato escrito de cesión de derechos patrimoniales** (firmas autenticadas ante notario) hacia un titular único y luego hacia la sociedad; registro declarativo ante la DIGEPIH del contenido, los manuales y el software (depósito parcial de código con reserva de confidencialidad) como prueba de fecha y titularidad; avisos de © en sitio, app y manuales. Los derechos morales quedan siempre en los autores. El historial de Git es evidencia técnica complementaria valiosa.

---

## 7. Expansión a otros países hispanohablantes

**Principio rector (◐, defendible tal como está formulado):** vender plataforma + tutorías sin emitir títulos es legal en prácticamente todos los mercados analizados; el deber de escolarizar recae en la familia, no en el proveedor de contenidos. Dos cautelas del verificador: (a) el riesgo del proveedor no es cero — presentarse como «colegio» u operar de facto como centro docente sin autorización sí es sancionable en varias jurisdicciones, así que el marketing local nunca debe prometer validez académica; (b) el riesgo se traslada a la familia, no desaparece — la comunicación comercial no debe ocultarlo donde el homeschool sustitutivo es ilegal.

### 7.1 Panorama por país

| País | Estatus del homeschool | Vía de validación | Nota para M.E.T.A.S |
|---|---|---|---|
| **Honduras** | Legal, modalidad oficial reglamentada (⚠ administrada, no libre) | Escuela sombrilla + SACE | Mercado natal; ventaja única |
| **Guatemala** | Tolerado, sin reconocimiento de diplomas parentales | Umbrella schools | Máxima cercanía cultural; 1.ª expansión |
| **El Salvador** | No reconocido | Programas extranjeros | Solo refuerzo/tutorías |
| **Nicaragua** | No prohibido pero no reconocido | — | Solo refuerzo; entorno impredecible |
| **Costa Rica** | Zona gris; proyecto de ley (exp. 22.396) sin aprobar | Programas extranjeros | Monitorear el proyecto |
| **Panamá** | **Legal** (Ley 245-2021, regl. Decreto 45-2024) | Vía centros educativos designados | Pequeño, dolarizado; B2B con centros |
| **Belice** | Legal con requisitos exigentes | Exámenes nacionales | Anglófono; baja prioridad |
| **México** | Vacío legal favorable | ⚠ INEA solo 15+; CENEVAL bachillerato; menores de 15 vía umbrella | Mercado más grande; pagos digitales maduros |
| **Colombia** | Legal en la práctica | Validación anual (Decreto 2832-2005), pruebas SABER | Base normativa clara; comunidad organizada (~8,000 niños) |
| **Ecuador** | **Legal**, modalidad reconocida por el MinEduc | Adscripción a unidad educativa autorizada | Dolarizado; alianzas B2B |
| **Perú** | Tolerado, sin ley específica | Prueba de ubicación (aplicación errática) | Comunidad activa; validación difícil |
| **Chile** | Legal vía exámenes libres del Mineduc | Exámenes anuales de validación (~33,000 autorizaciones en 2023, cifra ◐) | Mercado homeschool más maduro; mayor ARPU |
| **Argentina** | Alegalidad tolerada | «Estudiante libre» (fragmentado por provincia) | Cobro internacional problemático |
| **R. Dominicana** | No reconocido; proyecto de ley en trámite | Umbrella schools EE. UU. | Emergente; entrar como complemento |
| **España** | **No reconocido** (STC 133/2010; escolarización obligatoria 6–16) | Solo pruebas libres 18+ | **Solo como refuerzo/extraescolar**, jamás como sustituto escolar |
| **EE. UU. (hispanos)** | Legal en los 50 estados | Según cada estado | ~26% de homeschoolers son hispanos; el subgrupo de mayor crecimiento; máxima capacidad de pago; requiere LLC/Stripe y presencia en conferencias (Educa por Diseño, Latinos Homeschooling, HSLDA en español) |

### 7.2 Secuencia recomendada

1. **Honduras** (consolidar; construir el caso de éxito y el modelo sombrilla).
2. **Guatemala** (misma cultura; los estudios sociales centroamericanos son ventaja directa; sector privado grande).
3. **México y Colombia** (mercados grandes; publicar guías de certificación INEA/Decreto 2832 como contenido de captación).
4. **Chile y Ecuador** (mecanismos formales de validación; mayor disposición de pago).
5. **EE. UU. hispano** (2–4× el precio por el mismo producto; exige entidad de cobro y marketing superior).

El contenido de estudios sociales es hoy centroamericano: planear módulos por país antes de entrar a cada mercado (la arquitectura multi-país ya está sembrada en `_dev/js-arch/data/`), o venderlo como «cultura hispanoamericana» al público *heritage* de EE. UU. Matemáticas, gramática, ciencias, programación y robótica viajan casi sin cambios (~46 de 57 misiones).

### 7.3 Referencias de precios internacionales

El segmento «colegio online en español» cobra **US$55–220/mes** (Brincus en Chile, Rhema E-School en Colombia ~US$170/mes, Edupasión en México ~US$120–130/mes — cifras ◐, reconfirmar en sus páginas). Casi nadie vende un producto de **práctica/refuerzo gamificado de bajo costo (US$5–25/mes)** en español con enfoque centroamericano: ese es el espacio de M.E.T.A.S. Regla: no prometer lo que esos colegios sí venden (matrícula, certificación).

---

## 8. Mercado hondureño y propuesta de precios

### 8.1 Tamaño y anclas (cifras de prensa seria citando SEDUC/SACE; portal oficial no accesible — verificar en `estadisticas.se.gob.hn`)

- Matrícula nacional: ~1.8–1.86 millones. **Sector privado: ~270,000–325,000 alumnos (~15–16%)** en un estimado de 1,200–1,700 centros; **700+ centros bilingües** (~50,000–67,000 alumnos); la ABSH agrupa 37 escuelas de élite. En 2024 la SEDUC emitió 109 acuerdos de funcionamiento y 308 licencias nuevas a centros no gubernamentales: el sector crece.
- Mensualidades: élite bilingüe US$600–740; bilingüe gama media US$260–360; colegios en español de bajo/mediano costo: **sin cifra pública** — estimación por triangulación L 800–3,500/mes (certeza baja; validar llamando a 10–15 colegios).
- Ancla de poder adquisitivo: salario mínimo promedio 2025 L 13,985/mes. Un servicio complementario difícilmente puede superar el 2–3% del ingreso familiar (L 300–500/mes en clase media).
- Tutorías locales: L 150–450 por sesión/hora (mercado informal, Superprof/Apprentus/clasificados).
- Familias homeschool con escuela acreditada de EE. UU.: pagan US$1,000–3,000 por alumno/año — ya pagan en dólares y necesitan exactamente el español/sociales que las plataformas gringas no traen.

### 8.2 El modelo de licenciamiento regional que funciona

**«El colegio adopta, el padre paga»**: Progrentis (referencia pública: US$95/año la licencia particular), AMCO y Santillana Compartir venden así — el colegio adopta la plataforma y la licencia anual por alumno se cobra a los padres en la lista de útiles o tienda escolar. Es el modelo de menor fricción para M.E.T.A.S: el colegio no gasta de su presupuesto y el cobro viaja por un canal que ya existe.

### 8.3 Tarifario propuesto (síntesis propia; certeza media-baja; validar con pilotos)

| Escalón | Precio propuesto | Justificación |
|---|---|---|
| **Familia homeschool (B2C)** | **L 300/mes o L 3,000/año por familia** (rango L 250–400/mes), hasta 3–4 hijos | Apenas sobre Progrentis particular (US$95/año) y La Vid (US$130/familia/año); 3–4× más barato que Smartick (US$40/mes por UN niño); el plan es por familia porque la arquitectura ya soporta varios alumnos por dispositivo |
| **Refuerzo individual solo-plataforma** | L 150–250/mes por alumno | «Práctica ilimitada por el precio de media tutoría» (una hora de tutor cuesta L 200–450) |
| **Híbrido plataforma + 4 tutorías/mes** | L 1,200–2,000/mes | El escalón de mayor margen; operable como servicio boutique por la propia familia |
| **Colegio privado (B2B)** | **L 250–500 por alumno/año** (~US$10–19), mínimo institucional L 15,000–25,000/año; alternativa L 6,000–10,000 por aula/año | <1.5% de una mensualidad de colegio económico; rango donde compiten las plataformas por volumen |
| **Colegios bilingües ABSH** | US$25–40 por alumno/año (en dólares) | «Refuerzo de español nativo y estudios sociales hondureños» — su punto débil curricular; su gasto por familia lo permite |

Matemática ilustrativa de viabilidad: 20 colegios × 150 alumnos × L 350 ≈ **L 1.05M/año** + 300 familias × L 300 × 12 ≈ **L 1.08M/año** — un negocio familiar viable con precios bajos si el canal es el colegio.

**Decisiones comerciales recomendadas**: mantener núcleo gratuito permanente (la tracción se construyó gratis; el muro cae sobre contenido nuevo, diplomas verificables y la nube, no sobre lo que la gente ya usa); pilotos B2B simbólicos (L 5,000/año) el primer año con los colegios ya entusiasmados, a cambio de cartas de referencia; el escalón homeschool se posiciona como **complemento** de las escuelas sombrilla, no como competidor del acreditador.

---

## 9. Propuestas técnicas (sin cambios de código todavía)

### 9.1 Lo que la auditoría del repositorio encontró

- **Contenido**: 57 misiones autocontenidas (~48 MB) — Matemáticas 15, C. Naturales 14, Español 9, Programación 7, Robótica 6, C. Sociales 5, Inglés 1; 46 de II–III Ciclo; 11 rutas con diagnósticos; 2 evaluaciones × 30 formas deterministas por misión; 57 fichas imprimibles; mapa curricular `js/data/dcnb-map.js` verificado contra programaciones SEDUC (activo clave para homeschool).
- **Identidad y nube**: dos sistemas de autenticación de maestros (custom `docentes` con RPCs security-definer + Supabase Auth en `panel-docente.html`), roles docente/director/rector/admin, código de aula, resultados/progreso con outbox offline, chatbot de padres con clave de familia, Campeonísimo (~290 preguntas), avisos, conducta. **Los alumnos no tienen cuentas** (identificación lite en localStorage) — correcto para privacidad y offline.
- **Lo que NO existe**: entidad «colegio» real (la escuela es texto libre; el rol director filtra por nombre normalizado — insuficiente como frontera B2B), sistema de licencias, y ningún gateo: sitio, misiones, fichas y hasta los SQL del backend son públicos en web y repo.
- **Deuda de calidad que frena el cobro**: 13 misiones sin segunda prueba y ~24 con normativa impresa incompleta (ya inventariado en `PROPUESTA-EVALUACIONES-2026.md`); el chatbot de padres tiene dos riesgos ya auditados (eventos sin año que mezclan ciclos escolares; claves de familia enumerables) que hay que cerrar **antes** de cobrar — un incidente de privacidad al lanzar el cobro destruiría la confianza.

### 9.2 Control de acceso «solo quien paga»: opciones comparadas

| Opción | Offline-first | Esfuerzo | Costo/mes | Qué tan burlable | Veredicto |
|---|---|---|---|---|---|
| (a) Gateo suave: login/activación + verificación de licencia en cliente, con caché local y gracia sin red de 15–30 días | Excelente (nunca bloquea sin internet) | Bajo-medio (2–3 sem.) | $0 | Fácil para alguien técnico | **Fase 1** — suficiente: el mercado paga por servicio y soporte, no por el «secreto» del HTML |
| (b) Contenido movido a Supabase Storage/DB tras licencia | Malo (primera carga exige internet; reescribir 57 misiones) | Alto (meses) | $25+ | Difícil | **Descartada** |
| (c) App Capacitor de pago / APK privado | Excelente | Medio | $0–25 único | El APK se comparte igual | Canal, no candado — con activación interna |
| (d) Cloudflare Pages + **Worker** que gatea la *descarga* del contenido premium; `sw.js` sirve offline lo ya descargado | Excelente (gatea la descarga, no el uso) | Medio-alto | $0 (free tier) | Moderada-difícil | **Fase 2** — el único gateo fuerte compatible con offline-first |
| (e) Freemium: núcleo gratis + premium gateado | — (ortogonal) | Bajo | $0 | — | **Sí, siempre** — el demo es la herramienta de venta |

*(Vercel se descartó: su plan gratuito prohíbe uso comercial.)*

### 9.3 Ruta recomendada en fases

**FASE 1 — «Ya se puede cobrar» (2–4 semanas, con herramientas ya dominadas):**

1. Repo a privado + hosting a Cloudflare Pages (mismo dominio; cero cambios de código; excluir del despliegue los `SUPABASE-*.sql` y `_dev/`, que hoy publican el mapa de seguridad del backend).
2. `SUPABASE-LICENCIAS.sql` idempotente al estilo de los SQL existentes: tablas `organizaciones` (familia/colegio), `licencias` (código LIC-XXXX-XXXX, plan, asientos, vence), `licencia_miembros`, `pagos`; RLS sin políticas directas y RPCs security-definer (`metas_licencia_activar`, `metas_licencia_verificar`, `metas_licencia_crear/renovar/suspender`) — exactamente el patrón ya probado con `docentes` y `sugerencias`, incluido el rate-limit.
3. `js/metas-licencia.js` (al estilo de `metas-registro.js`, incluido por las 57 misiones): activación por código, caché en localStorage con vencimiento, **reverificación en segundo plano solo con internet, y gracia offline de 15–30 días — un corte de luz jamás bloquea a quien pagó**.
4. Panel de licencias en el rol admin existente: crear/renovar/suspender licencias y anotar pagos manuales (transferencia/Tigo) — activación en 2 clics; aviso de «vence en 7 días» reutilizando el sistema de avisos.
5. Freemium: campo `premium` en `js/data/misiones.js`, 6–8 misiones gratis de vitrina (una por materia), candado 🔒 en las tarjetas; clasificar igual las fichas imprimibles para no regalar el material premium por la puerta de atrás.

**FASE 2 — Robustecer (2–4 meses, cuando ya facture):**

6. Cloudflare Worker (~100–150 líneas) que solo sirve las rutas premium con token de licencia firmado (HMAC, sin llamar a la base por request) + botón «Descargar mis misiones» que precachea vía `sw.js` — gateo fuerte de la *descarga* preservando el uso offline. Es la pieza más delicada (interacción Worker+SW+Capacitor); hacerla solo con facturación en marcha.
7. Pasarela automática (Tilopay/PixelPay/PayPal) con Edge Function de Supabase como webhook → activación sin intervención; mantener siempre la transferencia manual como respaldo.
8. App Android gratuita activada por el mismo código LIC (modelo «solo consumo» de Play; el contenido viaja dentro del APK — cobertura total del escenario rural sin internet).
9. Cuentas de familia (padre-tutor como su propio «docente») empaquetando en una `familia.html` las herramientas del maestro con lenguaje de padre, emparejadas por el código de aula existente; bifurcar `MANUAL-PADRE.md` en padre-consultor y padre-tutor.
10. Plan curricular homeschool por grado 4.º–9.º generado desde `dcnb-map.js` (qué misión por semana, cuándo evaluar, año escolar febrero–noviembre) + **Expediente anual imprimible** por alumno (notas por parcial, misiones con fechas, evaluaciones con su Forma auditable, firma del padre-tutor) — el argumento de venta central: la evidencia formal presentable a la escuela sombrilla o a la SEDUC. Mientras no haya convenio con centro certificador, rotularlo «registro de avance».
11. Cierre de la deuda de calidad: segunda prueba en las 13 misiones que faltan, normativa impresa completa en las ~24 pendientes, y el endurecimiento del chatbot de padres (año en los eventos, claves no enumerables).

**FASE 3 — B2B en serio y expansión:**

12. Multi-tenant real: tabla `colegios`, `docentes.colegio_id`, aulas con grado/sección; los roles existentes mapean bien (director→admin del colegio, rector→multi-sede). Un solo despliegue, personalización por datos (logo del colegio en constancias, exámenes y boletines desde Supabase, cacheada para offline) — **nunca forks por colegio**.
13. Panel de dirección: 5 números que la dirección entienda (promedios por aula, % misiones completadas, alumnos en riesgo, comparativo de secciones) + informe mensual imprimible con el molde de la Parte Mensual. Es el argumento B2B central: la dirección ve el retorno sin pedirle nada a los maestros.
14. Licencias por asientos con códigos de invitación del director; al vencer una licencia, los datos **nunca** se borran ni se toman de rehén — solo se cierra el premium (la lectura del histórico en solo-lectura es gesto de buena fe y argumento de renovación).
15. Endurecimiento anti-abuso: límite de dispositivos por licencia, revocación, y marca discreta de la licencia (nombre de la familia/colegio) en diplomas y fichas — disuasión social más efectiva que cualquier DRM aquí. Ante la duda y sin red, el sistema deja pasar y reporta, nunca bloquea.
16. Fábrica de contenido para los huecos que frenan la venta de «currículo completo»: Español-comunicación (lectura, redacción), estadística/proporcionalidad/álgebra inicial 7.º–9.º, Historia de Honduras y civismo, y después I Ciclo (variante de plantilla con audio y botones grandes) y Bachillerato. Ritmo sostenible: 2–3 misiones/mes con la cadena ya probada (`PLANTILLA-MISIONES.md`).
17. Certificados con QR verificable contra Supabase (el patrón QR ya existe en las fichas) — valor real cuando haya convenio con centro certificador.

**Qué se mantiene intacto**: las 57 misiones, la gamificación completa, el offline-first, las formas deterministas y las fichas. **Qué NO construir**: LMS genérico (foros, autoría de cursos), videoconferencia propia (Zoom/Meet publicados por el canal de avisos), pasarela propia al inicio, iOS, y forks del sitio por colegio.

---

## 10. Riesgos principales y mitigaciones

| # | Riesgo | Severidad | Mitigación |
|---|---|---|---|
| 1 | Cobrar sobre GitHub Pages (violación de términos verificada) y repo público clonable | **Alta** | Migrar a Cloudflare Pages + repo privado ANTES de cobrar |
| 2 | Presentarse como «escuela» o prometer validez oficial → atención regulatoria de SEDUC y reclamos de consumidor | **Alta** | Reglas de vocabulario (§2.5); descargos en ToS y marketing; diplomas rotulados como motivacionales |
| 3 | Tercero registra la marca «METAS» primero (first-to-file) | **Alta** | Solicitud de marca mixta en clase 41 ya; prioridad de París para la expansión |
| 4 | La SEDUC restrinja en la práctica la modalidad Educación en Casa a población vulnerable | Media | Modelo sombrilla (la matrícula es del centro autorizado); consulta directa a la SDGEC; M.E.T.A.S como herramienta de cumplimiento, no como vía paralela |
| 5 | El SAR clasifique la suscripción como licencia de software (ISV 15%) y no como enseñanza exenta | Media | Consulta por escrito al SAR; facturar como «servicio de enseñanza/tutoría con plataforma incluida»; precio con colchón |
| 6 | Incidente de privacidad con datos de menores al empezar a cobrar (claves enumerables, ciclo anual del chatbot) | Media-alta | Cerrar los dos hallazgos de la auditoría del chatbot antes del cobro; consentimiento parental verificable |
| 7 | Estructura con LLC mal declarada en Honduras (debate territorial/mundial) | Media | LLC solo para clientes del exterior; contador hondureño antes de mover dinero; Formulario 5472 sin falta |
| 8 | Fricción de cobro (baja penetración de tarjetas) | Media | Transferencia + activación manual como canal permanente; cobro vía colegio en B2B |
| 9 | Reacción de los maestros que hoy usan todo gratis | Media | Freemium generoso y comunicado con honestidad; el núcleo permanece gratis (misión social); los primeros colegios pagan precio simbólico |
| 10 | Dispersión: expandir a otros países antes de consolidar Honduras | Media | Secuencia disciplinada (§7.2); Guatemala solo tras el caso de éxito hondureño |
| 11 | Dependencia operativa de una sola familia (soporte, capacitación, contenido) | Media | Presupuestar el tiempo de soporte B2B en el precio; kits de capacitación ya existentes; ritmo de contenido sostenible |
| 12 | Vencimientos y renovaciones (marca a 10 años, permisos anuales, 5472 anual) | Baja | Calendario de obligaciones (¶ final del plan de acción) |

---

## 11. Plan de acción recomendado

**Legal y administrativo (semanas 1–8):**

1. Contratar abogado/gestor hondureño con el cuestionario de la sección 12.
2. Obtener y leer íntegros los Acuerdos 1367-SE-2014, 0368-SE-2020, 1361-SE-2014 y 1363-SE-2014 (PDF en `se.gob.hn/media/files/leyes/` y biblioteca del TSC; La Gaceta 17-sep-2014 y N.º 35,617).
3. Presentar la solicitud de marca mixta M.E.T.A.S (clase 41) ante DIGEPIH, previa búsqueda de anterioridades; firmar la cesión de derechos de autor dentro de la familia.
4. Registrarse como comerciante individual + RTN + SAR-926/CAI + permiso municipal; consulta escrita al SAR sobre la exención de ISV.
5. Redactar el paquete contractual (ToS + consentimiento parental + contrato B2B).

**Comercial (meses 1–4):**

6. Contactar 2–3 colegios privados ya entusiasmados: pilotos B2B a precio simbólico con carta de referencia.
7. Abrir conversación con 1–2 centros autorizados (p. ej. tipo EuropaSchule) para el convenio de escuela sombrilla con M.E.T.A.S como plataforma curricular y de evidencias.
8. Contactar HSLDA (`international@hslda.org`) y los grupos locales («Homeschool in Honduras», co-ops) para validar la práctica administrativa 2026 y como canal de distribución.
9. Cotizar Tilopay, PixelPay y BAC CompraClick en paralelo.

**Técnico (en paralelo, fases de la sección 9.3):**

10. Migración de hosting + repo privado → esquema de licencias → `metas-licencia.js` → panel admin de licencias → freemium. Con eso se puede cobrar.
11. Antes de actualizar la app en Play: política de privacidad publicada + formulario Data Safety + declaración de público objetivo.
12. Cerrar la deuda de calidad de evaluaciones y del chatbot de padres.

**Calendario de obligaciones permanentes:** renovación anual del permiso municipal y declaraciones SAR; vigilancia de La Gaceta para oposiciones de marca; renovación de marca a 10 años; si hay LLC: Formulario 5472 + cuota estatal cada año; monitorear la Ley de Justicia Tributaria, el anteproyecto de ley de datos y los proyectos homeschool de Costa Rica y R. Dominicana.

---

## 12. Lo que debe confirmar el abogado / gestor local (entregar tal cual)

1. Texto íntegro y vigencia de: Acuerdo 1367-SE-2014, Acuerdo 0368-SE-2020 (en particular: requisitos exigidos al padre/tutor, asignaturas, periodicidad de evaluaciones, art. 51 sobre aval de currículos extranjeros, y si la modalidad está abierta a familias «por convicción» o limitada a casos justificados), Acuerdo 1361-SE-2014 y Acuerdo 1363-SE-2014 (ámbito exacto: ¿alcanza a academias/plataformas sin certificación?).
2. Confirmación (idealmente por consulta u opinión ante SEDUC) de que una plataforma de tutorías/refuerzo sin matrícula ni certificados no requiere autorización educativa; y el artículo exacto de la LFE sobre cobros por «clases particulares».
3. Procedimiento real y actual para que un centro autorizado ofrezca la modalidad Educación en Casa y registre alumnos en SACE (formularios, plazos, oficinas); lista de centros que ya la ofrecen.
4. Consulta al SAR: clasificación de la suscripción a la plataforma (¿enseñanza exenta del ISV?); vigencia del umbral L 250,000 del Régimen Simplificado; tasas de retención a no residentes por concepto.
5. Tarifario vigente de DIGEPIH (marca y derecho de autor), monoclase vs. multiclase, publicaciones exigidas en La Gaceta y plazo de oposición.
6. Verificación del convenio Dawere↔centro certificador↔SEDUC como precedente citable.
7. Estado 2026 del anteproyecto de ley de protección de datos y de la «Ley de Justicia Tributaria» (territorial vs. mundial).
8. Costos notariales reales de constitución (comerciante individual y S. de R.L.) y pacto de socios familiar (participaciones, decisiones, retiro, herencia).
9. Derecho laboral si se contratan tutores no familiares: laboral vs. servicios profesionales, riesgo de recalificación, y si la tutoría privada exige colegiación magisterial.
10. Disponibilidad del perfil de comerciante de Google Play para entidades hondureñas (solo si algún día se vende dentro de la app).

**Pendientes no legales que conviene cerrar pronto:** verificar cifras oficiales de centros privados en `estadisticas.se.gob.hn`; sondear mensualidades reales de 10–15 colegios en español; reconfirmar precios de Brincus/Rhema/Edupasión/Progrentis; política de safeguarding para tutorías en vivo (antecedentes de tutores, sesiones con padre presente, canal de denuncia); póliza de responsabilidad civil; y el mapeo curricular CNB asignatura por asignatura como argumento de venta (base ya existente en `dcnb-map.js`).

---

## 13. Fuentes principales

**Marco legal hondureño:** Constitución de Honduras (arts. 151–171; tsc.gob.hn, pdba.georgetown.edu, oas.org) · Ley Fundamental de Educación, Decreto 262-2011 (refworld.org, redhonduras.hn, tsc.gob.hn) · Reglamento General LFE, Acuerdo 1358-SE-2014 (siteal.iiep.unesco.org) · Reglamento de Educación en Casa, Acuerdo 1367-SE-2014 y Lineamientos, Acuerdo 0368-SE-2020 (se.gob.hn, tsc.gob.hn, HSLDA) · Reglamento de Centros Educativos, Acuerdo 1361-SE-2014 y Reglamento de Instituciones de Educación No Gubernamentales, Acuerdo 1363-SE-2014 (se.gob.hn, melarayasociados.com) · Subdirección General de Educación en Casa (se.gob.hn/modalidades-perfil_sdgec) · TNH sobre la modalidad (tnh.gob.hn) · Código de la Niñez y la Adolescencia, Decreto 73-96 (poderjudicial.gob.hn, oas.org) · Manual de Procesos SACE (sace.se.gob.hn).

**Certificación y educación a distancia:** HSLDA Honduras (hslda.org/es/post/honduras) · EuropaSchule homeschool (europaschule.eu) · Prueba RVA (El Heraldo, La Prensa) · IHER (iher.hn, La Tribuna) · ISEMED/SEMED (tsc.gob.hn) · Educatodos (futurosbrillantes.hn) · SAT/Bayán (bayanhn.org) · Dawere (dawere.com, se.gob.hn, El País HN) · Umbrella schools (Bridgeway, Abeka, West River, Homelife, AMA) · Equivalencias/apostilla (mites.gob.es, des.unah.edu.hn, apostillahonduras.com) · Admisiones UNAH/UNITEC/UTH · Cognia (cognia.org y actas de distritos de EE. UU.).

**Mercantil y fiscal:** honduras.eregulations.org · CCIT (ccit.hn) · miempresaenlinea.org · SAR (sar.gob.hn: FAQ ISV, SAR-410, SAR-926, tablas ISR) · Ley del ISV (sefin.gob.hn, leyes.hn) · Deloitte/Auxadi (tablas ISR 2026) · Consortium Legal (impuestos municipales) · Ley de Comercio Electrónico, Decreto 149-2014 y Firmas Electrónicas, Decreto 149-2013 (tsc.gob.hn, central-law.com, ecija.com) · DLA Piper / DataGuidance (protección de datos HN) · FTC (COPPA) · Pasarelas: pixelpay.com, tilopay.com, baccredomatic.com, paypal.com/hn · Stripe Atlas (support.stripe.com) · dLocal Go (helpcenter.dlocalgo.com) · IRS Form 5472 · PwC (renta territorial vs. mundial).

**Infraestructura y PI:** GitHub Terms for Additional Products (texto literal vía github/site-policy) · GitHub Pages limits (docs.github.com) · Cloudflare Pages/Workers pricing (developers.cloudflare.com) · Google Play Billing y políticas (developer.android.com, support.google.com) · OMPI/WIPO Lex Honduras, Convenio de París, Protocolo de Madrid (wipo.int) · DIGEPIH/Instituto de la Propiedad (ip.gob.hn).

**Panorama regional:** Panamá Ley 245-2021 y Decreto 45-2024 (vlex.com.pa, La Estrella) · Colombia Decreto 2832-2005 (radionacional.co, redenfamilia.com.co) · Chile exámenes libres (Mineduc, kilometrocero.cl, UDD) · Ecuador (educarecuador.gob.ec, primicias.ec) · México (homeschool.com.mx, matihomeschool.com) · España STC 133/2010 (tribunalconstitucional.es, educacionlibre.org) · EE. UU. hispano (hslda.org, latinoshomeschooling.org, transitioneducation.net) · Costa Rica exp. 22.396 (nacion.com) · R. Dominicana (diariolibre.com) · Perú (mimejorclase.com) · Argentina (cecargentina.com, La Nación).

**Mercado hondureño:** El Heraldo y La Prensa (matrícula, centros bilingües, salarios, bono educativo) · ASJ Estado de País 2024 · ABSH (absh.edu.hn) · Superprof/Apprentus (tutorías) · Smartick, Progrentis (grupomentora.com, eimlearning.com), Kumon, Matific, Luca, Santillana Compartir, AMCO · La Vid, Multicursos, Home is Cool, Edupasión (homeschool en español).

---

*Investigación elaborada el 29 de julio de 2026 mediante flujo multi-agente con verificación adversarial. Los veredictos ✔/◐/⚠ reflejan el grado de confirmación alcanzado con las fuentes accesibles; las decisiones legales, fiscales y de marca deben validarse con profesionales hondureños colegiados antes de ejecutarse.*
