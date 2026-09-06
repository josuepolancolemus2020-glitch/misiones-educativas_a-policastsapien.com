export const meta = {
  name: 'priorizar-metas',
  description: 'Prioriza las 20 modificaciones de mayor impacto educativo y comercial con menor esfuerzo, a partir de los hallazgos confirmados',
  phases: [
    { title: 'Priorizar', detail: 'tres priorizadores independientes con lentes distintas' },
    { title: 'Juzgar', detail: 'un juez funde las tres listas en la definitiva' },
    { title: 'Criticar', detail: 'crítico de completitud contra el encargo original' },
  ],
}

const SCRATCH = '/tmp/claude-0/-home-user-misiones-educativas-a-policastsapien-com/02a7cafe-4837-5e15-b34e-a616fb5254ca/scratchpad'
const REPO = '/home/user/misiones-educativas_a-policastsapien.com'
const CONTEXTO = `${SCRATCH}/CONTEXTO-AGENTES.md`
const AREAS = args.areas // p. ej. las nueve áreas: tecnica-codigo, tecnica-datos, tecnica-acceso, pedagogica-curriculo, pedagogica-aprendizaje, pedagogica-docente, ux, ux-b, producto

const FUENTES = `Fuentes (léelas TODAS, enteras): los hallazgos confirmados en ${AREAS.map(a => `${SCRATCH}/hallazgos/${a}.json`).join(', ')} y las secciones del informe en ${AREAS.map(a => `${SCRATCH}/informe/${a}.md`).join(', ')}. Contexto del proyecto en ${CONTEXTO}; normas del creador en ${REPO}/CLAUDE.md (consúltalo cuando una modificación choque con una decisión documentada: el usuario pidió no proteger esas decisiones, pero sí explicar el choque). Puedes abrir el repositorio (solo lectura) para afinar estimaciones de esfuerzo.`

const ESQUEMA_LISTA = {
  type: 'object',
  properties: {
    lente: { type: 'string' },
    modificaciones: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          rango: { type: 'integer' },
          titulo: { type: 'string' },
          que_cambiar: { type: 'string' },
          hallazgos: { type: 'array', items: { type: 'string' } },
          impacto_educativo: { type: 'integer' },
          impacto_comercial: { type: 'integer' },
          esfuerzo: { type: 'string', enum: ['horas', 'dias', 'semanas', 'meses'] },
          esfuerzo_dias: { type: 'integer' },
          justificacion: { type: 'string' },
          riesgos: { type: 'string' },
        },
        required: ['rango', 'titulo', 'que_cambiar', 'hallazgos', 'impacto_educativo', 'impacto_comercial', 'esfuerzo', 'esfuerzo_dias', 'justificacion'],
      },
    },
  },
  required: ['lente', 'modificaciones'],
}

const LENTES = [
  { key: 'educativo', prompt: 'Tu lente es el IMPACTO EDUCATIVO: lo que más mejora el aprendizaje real de un alumno hondureño de 4º-9º y el trabajo pedagógico del maestro. Pondera impacto educativo ×2, comercial ×1, y penaliza el esfuerzo.' },
  { key: 'comercial', prompt: 'Tu lente es la VIABILIDAD COMERCIAL: lo que más acerca a M.E.T.A.S. a ser un producto que un colegio privado, una institución pública u ONG adopte y pague o financie. Pondera impacto comercial ×2, educativo ×1, y penaliza el esfuerzo.' },
  { key: 'esfuerzo', prompt: 'Tu lente es el MENOR ESFUERZO DE DESARROLLO: eres el ingeniero que va a ejecutar. Busca las modificaciones que caben en horas o pocos días con el repo tal como está (una persona, sin framework), con máximo retorno por hora. Abre el código para estimar de verdad (archivos y líneas afectadas). Penaliza fuerte lo que requiera cuentas de usuario nuevas, migraciones de esquema o reescrituras, salvo que el retorno sea enorme. También incluye lo que hay que ELIMINAR (eliminar es barato y reduce mantenimiento).' },
]

phase('Priorizar')
const listas = (await parallel(LENTES.map(l => () => agent(
  `Eres un priorizador independiente de la auditoría integral de M.E.T.A.S. ${FUENTES}\n\n${l.prompt}\n\nTAREA: propone las 20 MODIFICACIONES concretas de mayor retorno según tu lente, ordenadas de 1 a 20. Una modificación es un cambio accionable (no un hallazgo): puede fundir varios hallazgos (cita sus IDs). Para cada una: qué cambiar exactamente (archivos/pantallas), impacto educativo 0-5, impacto comercial 0-5, esfuerzo (categoría y días-persona estimados), justificación (2-4 frases con la evidencia clave) y riesgos. Incluye también, si aplica según los hallazgos, modificaciones de ELIMINAR o SIMPLIFICAR. No inventes hallazgos: todo debe venir de las fuentes. Sé concreto: «añadir campo explicación a los bancos de quiz y mostrarlo al fallar (motor en js/…)» y no «mejorar la retroalimentación».`,
  { label: `priorizar:${l.key}`, phase: 'Priorizar', schema: ESQUEMA_LISTA, effort: 'xhigh' })))).filter(Boolean)

log(`listas recibidas: ${listas.map(l => l.lente + '=' + l.modificaciones.length).join(', ')}`)

phase('Juzgar')
const ESQUEMA_FINAL = {
  type: 'object',
  properties: {
    archivo_md: { type: 'string' },
    archivo_json: { type: 'string' },
    top20: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          rango: { type: 'integer' },
          titulo: { type: 'string' },
          que_cambiar: { type: 'string' },
          hallazgos: { type: 'array', items: { type: 'string' } },
          impacto_educativo: { type: 'integer' },
          impacto_comercial: { type: 'integer' },
          esfuerzo: { type: 'string' },
          esfuerzo_dias: { type: 'integer' },
          puntaje: { type: 'number' },
          justificacion: { type: 'string' },
          choca_con_claude_md: { type: 'string' },
        },
        required: ['rango', 'titulo', 'que_cambiar', 'hallazgos', 'impacto_educativo', 'impacto_comercial', 'esfuerzo', 'esfuerzo_dias', 'puntaje', 'justificacion'],
      },
    },
    descartes_notables: { type: 'array', items: { type: 'string' } },
  },
  required: ['archivo_md', 'archivo_json', 'top20'],
}

const juez = await agent(
  `Eres el JUEZ que decide la lista definitiva de «las 20 modificaciones que producirían el mayor impacto educativo y comercial con el menor esfuerzo de desarrollo» para M.E.T.A.S. ${FUENTES}\n\nRecibes tres listas de 20 hechas con lentes distintas (educativa, comercial, esfuerzo). Fúndelas en UNA lista de exactamente 20, con un puntaje explícito y reproducible: puntaje = (impacto_educativo + impacto_comercial) / esfuerzo_ponderado, donde esfuerzo_ponderado = horas:1, dias:2, semanas:4, meses:8; desempata por severidad de los hallazgos que resuelve. Recalcula tú los impactos y esfuerzos cuando las listas discrepen (abre el código si hace falta) y deja constancia. Deduplica modificaciones equivalentes (conserva todos los IDs de hallazgos). Asegura equilibrio: la lista tiene que servir a la vez a un alumno, a un maestro y a un comprador; si las 20 salen todas técnicas o todas pedagógicas, algo está mal ponderado. Marca en choca_con_claude_md cuando la modificación contradiga una norma documentada del creador y di por qué aun así se recomienda (o cómo respetar el fondo de la norma).\n\nEscribe ${SCRATCH}/informe/top20.md en español con: introducción de 5 líneas (criterio de puntaje), tabla resumen (#, modificación, impacto edu, impacto com, esfuerzo, puntaje, hallazgos), y luego una ficha por modificación (## N. Título · qué cambiar · por qué (evidencia) · esfuerzo estimado y archivos · riesgos · choque con normas si lo hay). Escribe también ${SCRATCH}/hallazgos/top20.json (array JSON validado con node -e). Devuelve las rutas y la lista.\n\nLISTAS:\n${JSON.stringify(listas, null, 1)}`,
  { label: 'juez-top20', phase: 'Juzgar', schema: ESQUEMA_FINAL, effort: 'xhigh' })

phase('Criticar')
const ESQUEMA_CRITICA = {
  type: 'object',
  properties: {
    vacios: { type: 'array', items: { type: 'object', properties: { punto_del_encargo: { type: 'string' }, que_falta: { type: 'string' }, gravedad: { type: 'string', enum: ['alta', 'media', 'baja'] }, como_cubrirlo: { type: 'string' } }, required: ['punto_del_encargo', 'que_falta', 'gravedad'] } },
    contradicciones: { type: 'array', items: { type: 'string' } },
    afirmaciones_sin_evidencia: { type: 'array', items: { type: 'string' } },
    veredicto: { type: 'string' },
  },
  required: ['vacios', 'veredicto'],
}
const critica = await agent(
  `Eres el CRÍTICO DE COMPLETITUD de la auditoría integral de M.E.T.A.S. ${FUENTES} Lee además ${SCRATCH}/informe/top20.md.\n\nEl encargo original del usuario, punto por punto, fue:\n1. Auditoría técnica: arquitectura completa; código HTML/CSS/JS; base de datos y autenticación; rendimiento y escalabilidad; seguridad; accesibilidad; compatibilidad móvil; errores y código redundante; calidad del código; dependencias y vulnerabilidades; capacidad para soportar cientos o miles de estudiantes simultáneamente.\n2. Auditoría pedagógica: correspondencia con el CNB/DCNB hondureño; coherencia competencia → contenido → misión → actividad → evaluación; nivel cognitivo; pensamiento crítico; retroalimentación al estudiante; progresión de dificultad; gamificación; evidencias de aprendizaje; adaptación a ritmos; utilidad real para el docente.\n3. Auditoría UX/UI probando literalmente como estudiante de 4º, 5º, 6º, 7º, 8º y 9º, docente, padre de familia y administrador; identificar dónde se pierde, aburre, abandona o no comprende.\n4. Auditoría como producto: propuesta de valor; diferenciación; modelo de suscripción; gratuita vs premium; instituciones privadas; escuelas públicas; potencial Honduras y Centroamérica; costos de infraestructura; escalabilidad; funcionalidades que sobran; que faltan.\nY: «No protejas las decisiones del creador. Busca qué está mal, incompleto, sobrediseñado y qué debería eliminarse». Después: «Prioriza las 20 modificaciones de mayor impacto educativo y comercial con menor esfuerzo».\n\nTAREA: recorre cada punto del encargo y comprueba si el informe lo cubre con evidencia y profundidad suficientes. Señala vacíos (con cómo cubrirlos rápido), contradicciones entre secciones (p. ej. una sección dice que algo está bien y otra que hay que eliminarlo), afirmaciones sin evidencia o con cifras inventadas, y si la lista de 20 de verdad se sostiene en los hallazgos. Comprueba al azar 6 evidencias citadas (archivo:línea) abriendo el repo. Sé exigente.`,
  { label: 'critico-completitud', phase: 'Criticar', schema: ESQUEMA_CRITICA, effort: 'xhigh' })

return { listas: listas.map(l => ({ lente: l.lente, n: l.modificaciones.length })), juez, critica }
