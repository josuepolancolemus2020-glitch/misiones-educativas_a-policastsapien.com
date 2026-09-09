export const meta = {
  name: 'revisar-metas',
  description: 'Revisión adversarial de los hallazgos de la auditoría de M.E.T.A.S. que se quedaron sin revisor en la primera corrida',
  phases: [
    { title: 'Verificar', detail: 'un revisor adversarial por lente; segundos escépticos para lo crítico' },
  ],
}

const SCRATCH = '/tmp/claude-0/-home-user-misiones-educativas-a-policastsapien-com/02a7cafe-4837-5e15-b34e-a616fb5254ca/scratchpad'
const REPO = '/home/user/misiones-educativas_a-policastsapien.com'
const CONTEXTO = `${SCRATCH}/CONTEXTO-AGENTES.md`

/* args.grupos: [{ area, lente, titulo, archivo, ids: [...] }] — cada grupo son los
   hallazgos de UNA lente que nunca pasaron por un revisor. No viajan en args:
   el revisor los lee del archivo crudo del repositorio por sus ids (así el
   flujo pesa poco y lo que se revisa es exactamente lo que está versionado). */
const GRUPOS = args.grupos
if (!Array.isArray(GRUPOS) || !GRUPOS.length) throw new Error('faltan los grupos')

const ESQUEMA_VEREDICTOS = {
  type: 'object',
  properties: {
    veredictos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          refutado: { type: 'boolean' },
          confianza: { type: 'integer' },
          motivo: { type: 'string' },
          severidad_ajustada: { type: 'string', enum: ['critica', 'alta', 'media', 'baja'] },
          correccion: { type: 'string' },
        },
        required: ['id', 'refutado', 'confianza', 'motivo'],
      },
    },
    hallazgos_que_faltaron: { type: 'array', items: { type: 'string' } },
  },
  required: ['veredictos'],
}
const ESQUEMA_VEREDICTO_UNO = {
  type: 'object',
  properties: {
    refutado: { type: 'boolean' },
    confianza: { type: 'integer' },
    motivo: { type: 'string' },
    severidad_ajustada: { type: 'string', enum: ['critica', 'alta', 'media', 'baja'] },
  },
  required: ['refutado', 'confianza', 'motivo'],
}

/* ⚠️ Los hallazgos se escribieron sobre el commit 9ce2ac1 (28-ago) y el código
   de hoy es otro: desde entonces se corrigieron las 20 modificaciones de la
   lista. «Ya está resuelto» es un motivo válido de refutación, pero hay que
   distinguirlo de «era falso»: para el creador no es lo mismo. Por eso el
   motivo lleva prefijo. */
const CONVENCION = `IMPORTANTE — el código ha cambiado desde que se escribió el hallazgo: se auditó el commit 9ce2ac1 (28 de agosto de 2026) y hoy main va por d940fe0 (9 de septiembre), con las 20 modificaciones de ${REPO}/_dev/auditoria-2026-09/5-top-20.md ya aplicadas (cada una lleva un bloque «✅ Corregido» que dice qué cambió). Tienes que juzgar el hallazgo CONTRA EL CÓDIGO DE HOY. Empieza el campo motivo con uno de estos prefijos, siempre: [RESUELTO] si era cierto pero el código actual ya lo corrige (refutado=true; di con archivo:línea qué lo corrige); [FALSO] si la evidencia no lo sostenía ni entonces ni ahora; [DUPLICADO] si repite otro de la lista (di cuál); [OPINIÓN] si no tiene consecuencia real; [CONFIRMADO] si sigue en pie (refutado=false; ajusta severidad si hace falta y explica en correccion). Si sigue en pie pero cambió en parte, [CONFIRMADO] con la corrección.`

const revisar = (g) => agent(
  `Eres un REVISOR ADVERSARIAL independiente. Lee ${CONTEXTO} y la normativa pertinente de ${REPO}/CLAUDE.md. Recibes ${g.ids.length} hallazgos del auditor «${g.titulo}» (lente ${g.lente}, área ${g.area}) sobre M.E.T.A.S. que en la primera corrida se quedaron SIN revisor. LÉELOS del archivo ${g.archivo}: son los objetos cuyo campo id está en esta lista: ${g.ids.join(', ')}. Devuelve un veredicto por CADA uno de esos ids, sin saltarte ninguno. Tu trabajo es intentar REFUTAR cada uno con evidencia propia: abre los archivos y líneas citadas, corre los comandos, reproduce con Playwright si hace falta (ayudante en ${SCRATCH}/pw/abrir.js; servidor en http://localhost:8123; carpeta de trabajo ${SCRATCH}/revision/${g.lente}/). Solo lectura sobre el repo.\n\n${CONVENCION}\n\nRefuta (refutado=true) si: el hecho es falso o la evidencia no lo sostiene; ya está resuelto en el código actual; es una duplicación de otro hallazgo de la lista (refuta el menos preciso y dilo); o es una opinión sin consecuencia real para un alumno, maestro o familia hondureños. NO refutes solo porque CLAUDE.md justifique la decisión: el usuario pidió no proteger las decisiones del creador; una justificación se acepta únicamente si la razón es correcta para el aula real y el hallazgo la ignora. Si el hallazgo es cierto pero la severidad o el esfuerzo están mal, NO lo refutes: ajusta severidad_ajustada y explica en correccion (también corrige evidencia imprecisa ahí). Sé escéptico por defecto: ante la duda, confianza baja.\n\nAl final, en hallazgos_que_faltaron, anota (máximo 5, una línea cada uno, con evidencia) problemas importantes de esta lente que el auditor NO vio y tú sí, mientras revisabas.\n\nIDS A REVISAR: ${g.ids.join(', ')}`,
  { label: `revisar:${g.lente}`, phase: 'Verificar', schema: ESQUEMA_VEREDICTOS, effort: 'high' })

const esceptico = (g, h) => agent(
  `Eres un escéptico de CONTEXTO DE AULA Y PRODUCTO (maestro hondureño veterano + gerente de producto) con capacidad técnica. Lee ${CONTEXTO} y la sección pertinente de ${REPO}/CLAUDE.md. Este hallazgo sobre M.E.T.A.S. acaba de pasar una revisión adversarial y sigue marcado como CRÍTICO. ${CONVENCION}\n\nComprueba dos cosas: (1) que sea cierto tal y como está escrito CONTRA EL CÓDIGO DE HOY (abre los archivos citados; reproduce con Playwright en ${SCRATCH}/pw/abrir.js contra http://localhost:8123 si hace falta; carpeta ${SCRATCH}/revision/criticos/; solo lectura sobre el repo); (2) que sea de verdad crítico: ¿le pasa a un maestro con 43 alumnos y tres teléfonos, a una familia o a un comprador institucional, con qué frecuencia y con qué daño (pérdida de datos, seguridad, nota equivocada en un expediente, función inutilizable)? ¿Hay una razón de aula que lo justifique y que el auditor ignoró (sin proteger por defecto al creador)? Si es cierto pero no crítico, refutado=false y severidad_ajustada. Si es falso o ya resuelto, refutado=true con la evidencia.\n\nEL HALLAZGO: es el objeto con id «${h.id}» dentro de ${g.archivo}. Léelo entero de ahí. El revisor adversarial dijo de él: ${h.veredicto_previo}`,
  { label: `escéptico:${h.id}`, phase: 'Verificar', schema: ESQUEMA_VEREDICTO_UNO, effort: 'high' })

const resultados = await pipeline(GRUPOS,
  g => revisar(g).then(v => ({ g, v })),
  async ({ g, v }) => {
    if (!v) { log(`⚠️ ${g.lente}: el revisor no devolvió nada`); return { lente: g.lente, area: g.area, veredictos: [], escepticos: [], faltaron: [] } }
    const porId = Object.fromEntries((v.veredictos || []).map(x => [x.id, x]))
    /* Segunda vuelta SOLO para lo que sigue crítico después del revisor. */
    /* g.severidades: { id: severidad original } viene en args para saber cuáles
       siguen críticos sin tener el hallazgo entero en el flujo. */
    const criticos = g.ids.filter(id => {
      const x = porId[id]
      if (!x) return false
      if (x.refutado && x.confianza >= 60) return false
      return (x.severidad_ajustada || (g.severidades || {})[id]) === 'critica'
    }).map(id => ({ id, veredicto_previo: porId[id].motivo }))
    const votos = criticos.length ? await parallel(criticos.map(h => () => esceptico(g, h).then(a => ({ id: h.id, ...(a || {}) })))) : []
    const conf = (v.veredictos || []).filter(x => !(x.refutado && x.confianza >= 60)).length
    const sinVeredicto = g.ids.filter(id => !porId[id])
    if (sinVeredicto.length) log(`⚠️ ${g.lente}: sin veredicto para ${sinVeredicto.join(', ')}`)
    log(`${g.lente}: ${g.ids.length} hallazgos → ${conf} en pie, ${g.ids.length - conf} caídos · críticos al escéptico: ${criticos.length}`)
    return { lente: g.lente, area: g.area, veredictos: v.veredictos || [], escepticos: votos.filter(Boolean), faltaron: v.hallazgos_que_faltaron || [] }
  })

return { resultados: resultados.filter(Boolean) }
