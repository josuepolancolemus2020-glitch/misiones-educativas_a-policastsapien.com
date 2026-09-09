# Cómo se corrió la auditoría con agentes, y cómo se volvería a correr

La auditoría corrió en dos tandas. La primera, el 5 y 6 de septiembre de 2026,
dejó 28 de las 35 lentes hechas y se quedó sin límite de uso. La segunda, el 9
de septiembre, corrió las siete lentes que faltaban, pasó por un revisor
adversarial los 108 hallazgos que se habían quedado sin él, contrastó las
secciones ya escritas con esos veredictos y rehízo la lista de 20 con tres
priorizadores, un juez y un crítico. **Está cerrada.** Lo que sigue es cómo se
hizo, para que la próxima —cuando el catálogo o el código hayan cambiado
bastante— no empiece de cero.

## Lo que hay aquí

| archivo | qué hace |
|---|---|
| `CONTEXTO-AGENTES.md` | lo que lee cada agente antes de empezar: qué es M.E.T.A.S, qué no se toca, cómo se prueba. **Lleva un bloque al principio con el estado del código el día de la corrida**: hay que reescribirlo en cada tanda nueva, porque el auditor juzga contra el código de hoy y no contra el de la vez anterior |
| `wf-auditoria.js` | un área por invocación: auditores (uno por lente) → revisor adversarial por lente → escéptico para los críticos → editor de la sección. `args.lentes` deja fuera las lentes que ya tienen hallazgos; `args.nota` y `args.titulo` le dicen al editor qué sección escribe. Devuelve lo crudo en el resultado, no solo en archivos |
| `wf-revisar.js` | la revisión adversarial suelta, para hallazgos que ya existen: un revisor por grupo lee los hallazgos **del archivo versionado** por su id, y un escéptico vuelve sobre los que sigan críticos |
| `wf-priorizar.js` | tres priorizadores independientes (educativo, comercial, esfuerzo) → juez con puntaje explícito → crítico de completitud contra el encargo. Lee de `../crudo/` y de las secciones del repositorio |
| `volcar-area.js` | vuelca el resultado de `wf-auditoria.js` a `../crudo/` sin pisar nada: añade hallazgos, descartados, resúmenes y echados en falta |
| `aplicar-veredictos.js` | aplica el resultado de `wf-revisar.js` a `../crudo/`: `verificado`, `revision`, severidad ajustada, `refutado` o `resuelto` |
| `contrastar.js` | dice qué hallazgos revisados cambiaron (tumbados, resueltos, severidad) y dónde se citan en las secciones y en la lista de 20; escribe la tabla de revisión de cada área |
| `anotar-seccion.js` | pone debajo de cada hallazgo de una sección su veredicto (✅ corregido · ✗ descartado · ↕ severidad · ✓ confirmado) y le pega la tabla de revisión |
| `estado.js` | escribe `../ESTADO.md` contando lo que hay en `../crudo/` (los números no se escriben, se cuentan) |
| `playwright-abrir.js` | abre el Chromium del entorno por `executablePath`, que es lo que hace falta cuando la versión de Playwright no coincide con la del navegador instalado |
| `PROMPT-MIERCOLES.md` | el encargo con el que se retomó la segunda tanda; sirve de plantilla para la próxima |

## Antes de correr nada

```
# 1. El servidor estático, en una terminal aparte y desde la raíz del repositorio
node _dev/servidor-estatico.js          # http://localhost:8123

# 2. Playwright, FUERA del repositorio (node_modules va versionado aquí y no puede ensuciarse)
cd <scratchpad> && mkdir pw && cd pw && npm init -y && npm install playwright axe-core
cp <repo>/_dev/auditoria-2026-09/maquinaria/playwright-abrir.js <scratchpad>/pw/abrir.js

# 3. La maquinaria al scratchpad, con las rutas de ESTA sesión
cp <repo>/_dev/auditoria-2026-09/maquinaria/*.js <repo>/_dev/auditoria-2026-09/maquinaria/CONTEXTO-AGENTES.md <scratchpad>/
sed -i 's#<scratchpad viejo>#<scratchpad nuevo>#g' <scratchpad>/*.js <scratchpad>/CONTEXTO-AGENTES.md
```

Los guiones llevan la ruta del scratchpad escrita (`SCRATCH`), porque el
Workflow no tiene acceso al sistema de archivos y no puede calcularla. Y hay que
reescribir el bloque del principio de `CONTEXTO-AGENTES.md` con el commit de
hoy, las cifras del catálogo y lo que cambió desde la corrida anterior.

Tres reglas que los agentes leen en ese contexto y que no se negocian: **la
nube de verdad no se toca** (Supabase se simula con `page.route`), **solo
lectura sobre el repositorio** (no cambian el estado de git, no instalan nada
dentro), y **los temporales van al scratchpad**. En la segunda tanda un bucle
aparte miró `git status` cada dos minutos mientras corrían: nunca saltó.

## Una tanda, paso a paso

```
# a) las lentes (una invocación por área; las ya pagadas se quitan con args.lentes)
Workflow({ scriptPath: '<scratchpad>/wf-auditoria.js',
           args: { area: 'ux-b', lentes: ['U10','U11','U12','U13'],
                   titulo: '…', nota: '…' } })
node volcar-area.js <resultado.json>          # → ../crudo/, y commit

# b) la revisión adversarial de lo que se quedó sin revisor
Workflow({ scriptPath: '<scratchpad>/wf-revisar.js', args: { grupos: [ { area, lente, titulo, archivo, ids, severidades } ] } })
node aplicar-veredictos.js <resultado.json>   # → ../crudo/
node contrastar.js                            # qué cambió y dónde se cita
SP=<scratchpad> node anotar-seccion.js <sección.md> <área,…>

# c) la lista de 20
Workflow({ scriptPath: '<scratchpad>/wf-priorizar.js',
           args: { areas: [las nueve], secciones: [rutas de las secciones en el repositorio] } })

# d) el estado
node estado.js
```

El resultado de un Workflow llega en un archivo `tasks/<id>.output` que
**envuelve** el valor devuelto: es `{summary, result, …}`, y `result` es una
cadena JSON. Los guiones de volcado la leen así.

## Lo que costó caro, y no hay que repetir

**Los resultados de los agentes viven en el contenedor de la sesión.** Se
recicla, y con él se van. En la primera tanda se perdieron dos veces por
quedarse en `/tmp`. Por eso `wf-auditoria.js` devuelve lo crudo en el
resultado y `volcar-area.js` lo lleva a `../crudo/` **después de cada área**,
con su commit. Si aun así se pierde algo, cada flujo deja un diario:

```
<transcripts>/subagents/workflows/wf_*/journal.jsonl
```

Cada línea `{"type":"result", …}` trae el valor de retorno entero del agente.

**El límite de uso se agota a media corrida**, y mató dos veces un flujo de la
segunda tanda. No se pierde nada si se relanza con `resumeFromRunId`: los
agentes que terminaron vuelven de la caché y solo corren los que faltaban. Lo
que sí conviene es economizar antes: `effort: 'high'` en los priorizadores (la
primera versión los tenía en `xhigh`), y el revisor por grupo de hallazgos en
vez de uno por hallazgo.

**Un hallazgo cierto que el código de hoy ya corrige NO es un hallazgo falso.**
La primera versión de `aplicar-veredictos.js` lo marcaba `refutado`, y eso
habría contado como error del auditor lo que era trabajo hecho. Los revisores
escriben el prefijo `[RESUELTO]` y el guion lo guarda como `resuelto: true`,
con el motivo; `[FALSO]`, `[DUPLICADO]` y `[OPINIÓN]` sí caen como refutados.

**Los revisores leen los hallazgos del archivo versionado, por id.** La primera
versión de `wf-revisar.js` se los pasaba dentro de los argumentos: era enorme y
revisaba una copia, no lo que está en el repositorio.

**El crítico de completitud no es un adorno: cambió la lista.** Corre después del juez
y encontró que la lista incumplía su propia regla (una crítica fuera de las 20 y de
los descartes), tres líneas mal citadas y cinco hallazgos con el estado desfasado.
Lo que dice se pega entero al final de `5-top-20.md`, se actúa sobre lo que se
puede el mismo día y lo demás se deja escrito como el primer paso de la tanda
siguiente. Y ese primer paso ya está decidido: **releer contra el código de hoy
los hallazgos que conservan el veredicto de la tanda anterior** —cruzar sus
`archivos` con `git diff --stat <commit viejo>..<commit nuevo>` y pasar los que
toquen un archivo cambiado por `wf-revisar.js`, un grupo por área—, antes de
pedir otra lista.

**El código que auditan tiene que estar quieto.** Durante la segunda tanda no
se tocó el producto: las 20 modificaciones se aplicaron antes, y lo que salió
de los auditores —tres críticos nuevos en la fusión de esta semana— se dejó
para después de cerrar, para que la revisión y la lista de 20 juzgaran un solo
commit (`d940fe0`).
