# Cómo retomar la auditoría con agentes

La auditoría corrió el 5 y 6 de septiembre de 2026 y se quedó a siete lentes de
estar completa, porque se agotó el límite de uso. Todo lo que ya se pagó está
guardado en `../crudo/` y redactado en las secciones del informe. **Nada de lo
que sigue vuelve a hacer trabajo ya hecho.**

Esto es lo que hay que correr para cerrarla, en orden.

## Antes de nada

El entorno de una sesión nueva no trae ni el servidor ni Playwright. Los dos se
levantan fuera del repositorio, porque `node_modules` va versionado aquí y no
puede ensuciarse:

```
# 1. El servidor estático, en una terminal aparte y desde la raíz del repositorio
node _dev/servidor-estatico.js          # sirve en http://localhost:8123

# 2. Playwright, FUERA del repositorio (en el scratchpad de la sesión)
cd <scratchpad> && npm init -y && npm install playwright
cp <repo>/_dev/auditoria-2026-09/maquinaria/playwright-abrir.js <scratchpad>/pw/abrir.js
```

`playwright-abrir.js` ya lanza el Chromium del entorno por `executablePath`, que
es lo que hace falta cuando la versión de Playwright no coincide con la del
navegador instalado. Sin eso, `chromium.launch()` falla pidiendo
`npx playwright install`.

Después hay que copiar `CONTEXTO-AGENTES.md` al scratchpad y **corregir en él las
rutas del scratchpad de la sesión nueva**: los agentes lo leen entero y las rutas
viejas apuntan a un contenedor que ya no existe.

## Las siete lentes que faltan

Se corren con `wf-auditoria.js` (herramienta Workflow), un área por invocación:

```
Workflow({ scriptPath: '<scratchpad>/wf-auditoria.js', args: { area: 'tecnica-acceso' } })
Workflow({ scriptPath: '<scratchpad>/wf-auditoria.js', args: { area: 'ux-b' } })
Workflow({ scriptPath: '<scratchpad>/wf-auditoria.js', args: { area: 'ux' } })
```

| área | lentes pendientes | por qué importa |
|---|---|---|
| `tecnica-acceso` | T11 integridad de datos, T7 compatibilidad móvil | las dos las pidió el encargo por su nombre |
| `ux-b` | U10 docente, U11 familia, U12 administración, U13 arquitectura de la información | probar la aplicación como cada usuario era el punto 3 del encargo |
| `ux` | U8 alumna de 8º | completa la serie de 4º a 9º |

`tecnica-acceso` reejecutará también T6 y `ux` las cuatro lentes de alumno que ya
están, porque el caché de `resumeFromRunId` se perdió con el contenedor. Para no
pagarlas dos veces, **quita del guion las lentes que ya tienen hallazgos** antes
de correrlo: están listadas en `../ESTADO.md`.

## Lo que falta después

1. **Revisión adversarial de 108 hallazgos.** Son los de `tecnica-codigo` (48
   sin revisar), `tecnica-acceso` (12) y `ux` (36 de las lentes U5, U6 y U7).
   El guion ya lo hace solo: la fase «Verificar» de `wf-auditoria.js` corre
   detrás de cada auditor.
2. **Contrastar las secciones ya escritas** con lo que salga de esas revisiones.
   Las secciones marcan qué hallazgos no estaban verificados; si el revisor
   tumba alguno, hay que quitarlo de su sección y de la lista de 20.
3. **La lista de 20, revisada con las lentes nuevas dentro.** Se corre con
   `wf-priorizar.js`, pasándole las áreas: tres priorizadores independientes
   (educativo, comercial, esfuerzo), un juez que los funde con un puntaje
   explícito, y un crítico de completitud contra el encargo original.

```
Workflow({ scriptPath: '<scratchpad>/wf-priorizar.js',
           args: { areas: ['tecnica-codigo','tecnica-datos','tecnica-acceso',
                           'pedagogica-curriculo','pedagogica-aprendizaje','pedagogica-docente',
                           'ux','ux-b','producto'] } })
```

Ese guion lee de `<scratchpad>/hallazgos/<área>.json` y
`<scratchpad>/informe/<área>.md`. Hay que **apuntarlo a `_dev/auditoria-2026-09/`**,
que es donde vive ahora todo, o copiar los archivos al scratchpad antes.

## Dos cosas que costaron caro y no hay que repetir

**Los resultados de los agentes viven en el contenedor de la sesión.** Se
recicla, y con él se van. En la primera corrida se perdieron dos veces por
quedarse solo en `/tmp`. Los hallazgos se rescataron leyendo
`journal.jsonl` de cada flujo, que guarda una línea por agente terminado con su
valor de retorno entero. Si vuelve a pasar:

```
<transcripts>/subagents/workflows/wf_*/journal.jsonl
```

Cada línea `{"type":"result", ...}` trae el resultado completo del agente. La
utilidad que los extrajo y los volcó por área está en `estado.js`.

**Un flujo con muchos agentes de esfuerzo alto agota el límite de uso rápido.**
La primera corrida gastó 16,5 millones de tokens en 28 lentes con revisor. Si
hay que economizar: baja `effort` de `xhigh` a `high` en los priorizadores, y
deja los revisores adversariales solo para los hallazgos de severidad alta o
crítica. La calidad que aportan los revisores es real (tumbaron hallazgos falsos
y corrigieron severidades), pero cuestan tanto como los auditores.
