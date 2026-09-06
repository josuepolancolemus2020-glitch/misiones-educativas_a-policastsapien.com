# El prompt para retomar la auditoría

Se pega **entero** en una sesión nueva de Claude Code sobre este repositorio.
Está escrito para que la sesión nueva no tenga que averiguar nada: lo que falta,
dónde está lo hecho, qué NO volver a pagar y qué salió caro la primera vez.

---

Vas a terminar una auditoría integral de M.E.T.A.S. que quedó a siete lentes de
estar completa. **Todo lo ya hecho está en el repositorio, en
`_dev/auditoria-2026-09/`. No repitas nada de eso: ya se pagó.**

Lee primero, en este orden y enteros:

1. `_dev/auditoria-2026-09/maquinaria/RETOMAR.md` — cómo se retoma, y las dos
   cosas que costaron caro la primera vez.
2. `_dev/auditoria-2026-09/ESTADO.md` — el inventario exacto de lo hecho y lo
   que falta.
3. `_dev/auditoria-2026-09/00-metodo.md` — el método y sus límites declarados.
4. `CLAUDE.md` — las normas del proyecto. Rigen también aquí.

## El encargo original, que no cambia

Cuatro auditorías —técnica, pedagógica, de experiencia de uso probando la
aplicación como cada tipo de usuario, y de producto— con esta consigna, que es
literal del autor:

> «No protejas las decisiones existentes del creador. Busca deliberadamente qué
> está mal, qué está incompleto, qué está sobrediseñado y qué debería
> eliminarse.»

## Lo que falta, y en qué orden

### 1 · Las siete lentes pendientes

Se corren con la herramienta `Workflow` sobre `maquinaria/wf-auditoria.js`, un
área por invocación:

| área | lentes que faltan | lentes que YA están (quitar del guion) |
|---|---|---|
| `tecnica-acceso` | **T11** integridad de datos y sincronización sin conexión · **T7** compatibilidad móvil, PWA y Android | T6 |
| `ux-b` | **U10** docente · **U11** familia · **U12** administración · **U13** arquitectura de la información | U9 |
| `ux` | **U8** alumna de 8º grado | U4, U5, U6, U7 |

⚠️ **Antes de correr cada área, borra del guion las lentes que ya tienen
hallazgos.** El caché de `resumeFromRunId` murió con el contenedor viejo, así
que si no las quitas se vuelven a pagar enteras. Las cuatro de `ux` son las más
caras de todas: son recorridos con navegador.

Cuatro de las siete las pidió el encargo por su nombre: **docente, familia,
administración y 8º grado**. Si hay que recortar por presupuesto, esas cuatro se
corren y las otras tres esperan.

### 2 · La revisión adversarial de 108 hallazgos

La fase «Verificar» del guion la hace sola detrás de cada auditor, pero eso solo
cubre lo nuevo. Lo viejo sin revisar es:

| área | sin revisar |
|---|---|
| `tecnica-codigo` | 48 |
| `ux` | 36 (lentes U5, U6, U7) |
| `tecnica-acceso` | 12 |
| `ux-b` | 12 (lente U9) |

Si el presupuesto no da para las 108, revisa **solo las de severidad crítica y
alta**: son las que sostienen la lista de 20 y las que un director cuestionaría.

### 3 · Contrastar lo ya escrito

Las ocho secciones del informe marcan qué hallazgos no estaban verificados. Si un
revisor tumba alguno, **hay que quitarlo de su sección y de la lista de 20**, y
decirlo en la tabla de descartados.

### 4 · La lista de 20, rehecha con todo dentro

Con `maquinaria/wf-priorizar.js`: tres priorizadores independientes (educativo,
comercial, esfuerzo), un juez que los funde con puntaje explícito y un crítico de
completitud contra el encargo.

La lista de hoy (`5-top-20.md`) la derivó un editor a mano, con la fórmula
declarada, porque ese flujo nunca llegó a correr. **Está escrito así en el
método; si ahora corre de verdad, corrige esa frase en `00-metodo.md`.**

### 5 · Actualizar los tres documentos de arriba

`AUDITORIA-INTEGRAL-2026-09.md` (en la raíz), `ESTADO.md` y `00-metodo.md`
llevan las cifras de cobertura escritas. Si suben las lentes o los revisados,
suben ahí.

## Antes de nada: el entorno

El contenedor nuevo no trae ni servidor ni Playwright.

```
# 1. El servidor estático, en otra terminal, desde la raíz del repositorio
node _dev/servidor-estatico.js          # sirve en http://localhost:8123

# 2. Playwright FUERA del repositorio, en el scratchpad de la sesión
#    (node_modules va versionado aquí y no puede ensuciarse)
cd <TU-SCRATCHPAD> && mkdir -p pw && cd pw && npm init -y && npm install playwright
cp <REPO>/_dev/auditoria-2026-09/maquinaria/playwright-abrir.js ./abrir.js
```

`playwright-abrir.js` lanza el Chromium del entorno por `executablePath`. Sin
eso, `chromium.launch()` falla pidiendo `npx playwright install`.

⚠️ **Los tres archivos de `maquinaria/` llevan dentro la ruta del scratchpad
viejo, que ya no existe.** Cópialos a tu scratchpad y sustituye la constante
`SCRATCH` en `wf-auditoria.js` y en `wf-priorizar.js`, y las rutas dentro de
`CONTEXTO-AGENTES.md`, por la tuya. Los agentes leen ese contexto entero.

Y `wf-priorizar.js` lee de `<scratchpad>/hallazgos/` e `<scratchpad>/informe/`:
apúntalo a `_dev/auditoria-2026-09/crudo/`, que es donde vive todo ahora, o copia
los archivos al scratchpad antes de correrlo.

## Las tres cosas que NO hay que repetir

1. **Los resultados de los agentes viven en el contenedor, y el contenedor se
   recicla.** La primera vez se perdieron dos veces por quedarse solo en `/tmp`.
   **Después de CADA área, vuelca sus hallazgos a `_dev/auditoria-2026-09/crudo/`
   y haz commit.** No esperes a tener todo.
   Si aun así se pierden, están en
   `<transcripts>/subagents/workflows/wf_*/journal.jsonl`: una línea
   `{"type":"result", ...}` por agente terminado, con su valor de retorno entero.
   `maquinaria/estado.js` es la utilidad que los extrajo y los volcó por área.

2. **Un flujo con muchos agentes de esfuerzo alto agota el límite rápido.** La
   primera corrida gastó 16,5 millones de tokens en 28 lentes con revisor. Para
   economizar: baja `effort` de `xhigh` a `high` en los priorizadores, y deja los
   revisores adversariales solo para severidad alta y crítica.

3. **La nube de verdad no se toca.** Supabase se simula siempre con
   `page.route('**/rest/v1/rpc/**', ...)`. Los agentes tienen permiso de **solo
   lectura** sobre el repositorio: no cambian el estado de git, no instalan nada
   dentro de él y escriben sus temporales en el scratchpad.

## Cómo escribir lo que salga

En español, con el tono de las secciones que ya están: cada afirmación con su
evidencia (archivo y línea, salida de comando, número medido o captura), sin
elogios de relleno, y diciendo con precisión qué no se pudo comprobar. Los
hallazgos sin revisión adversarial van **marcados como tales**.

Los mensajes de commit, en español y contando qué le cambia al maestro. Mira
`git log` para tomar el tono. Al terminar, se fusiona a `main` y se publica: es
la norma del proyecto.
