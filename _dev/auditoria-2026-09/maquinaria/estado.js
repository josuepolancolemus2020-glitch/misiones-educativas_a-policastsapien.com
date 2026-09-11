/* Escribe _dev/auditoria-2026-09/ESTADO.md contando lo que hay en crudo/.
   Los números no se escriben: se cuentan. */
const fs = require('fs');
const DIR = '/home/user/misiones-educativas_a-policastsapien.com/_dev/auditoria-2026-09';
const LENTES = {
  'tecnica-codigo': ['T1 Arquitectura completa', 'T2 Calidad del código HTML/CSS/JS y redundancia', 'T5 Rendimiento', 'T8 Dependencias y vulnerabilidades', 'T10 Pruebas, CI y proceso de entrega'],
  'tecnica-datos': ['T3 Base de datos y autenticación', 'T4 Seguridad', 'T9 Escalabilidad a miles de estudiantes'],
  'tecnica-acceso': ['T6 Accesibilidad', 'T11 Integridad de datos y sincronización sin conexión', 'T7 Compatibilidad móvil, PWA y Android'],
  'pedagogica-curriculo': ['P1 Correspondencia con el DCNB', 'P2 Coherencia competencia → contenido → misión → actividad → evaluación', 'P3 Nivel cognitivo y pensamiento crítico', 'P10 Calidad y corrección del contenido'],
  'pedagogica-aprendizaje': ['P4 Retroalimentación al estudiante', 'P5 Progresión de dificultad', 'P6 Gamificación', 'P7 Evidencias de aprendizaje'],
  'pedagogica-docente': ['P8 Adaptación a distintos ritmos', 'P9 Utilidad real para el docente'],
  'ux': ['U4 Alumna de 4º grado', 'U5 Alumno de 5º grado', 'U6 Alumna de 6º grado', 'U7 Alumno de 7º grado', 'U8 Alumna de 8º grado'],
  'ux-b': ['U9 Alumno de 9º grado', 'U10 Docente', 'U11 Madre o padre de familia', 'U12 Administrador y dirección', 'U13 Arquitectura de la información y consistencia visual'],
  'producto': ['B1 Propuesta de valor y diferenciación', 'B2 Modelo de negocio, precios y costos', 'B3 Mercado: Honduras y Centroamérica', 'B4 Qué sobra y qué falta'],
};
const SECCION = {
  'tecnica-codigo': '1a-tecnica-codigo.md', 'tecnica-datos': '1b-tecnica-datos.md',
  'tecnica-acceso': '1c-tecnica-acceso.md · 1d-tecnica-integridad-movil.md',
  'pedagogica-curriculo': '2a-pedagogica-curriculo.md', 'pedagogica-aprendizaje': '2b-pedagogica-aprendizaje.md', 'pedagogica-docente': '2c-pedagogica-docente.md',
  'ux': '3-ux.md · 3c-ux-octavo-grado.md', 'ux-b': '3-ux.md (9º) · 3b-ux-docente-familia-direccion.md', 'producto': '4-producto.md',
};
const leer = f => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : [];
const f = []; const w = s => f.push(s);
w('# Auditoría integral de M.E.T.A.S. — estado del trabajo');
w('');
w('**Cerrada el 9 de septiembre de 2026.** La primera corrida (5-6 de septiembre) dejó 28 de las 35 lentes hechas y 108 hallazgos sin revisor; la segunda corrió las siete que faltaban y la revisión adversarial de esos 108, todo contra el código de ese día (`d940fe0`, con las 20 modificaciones de la primera lista ya aplicadas). Los hallazgos de todos los auditores están en `crudo/`, un archivo por área, con su severidad, tipo, evidencia, recomendación y el veredicto del revisor.');
w('');
w('## Las 35 lentes');
w('');
w('| área | lentes | hallazgos | revisados | de ellos, ya corregidos | descartados | sección |');
w('|---|---|---:|---:|---:|---:|---|');
let tot = 0, rev = 0, res = 0, tumb = 0, desc = 0, nl = 0;
for (const [a, lentes] of Object.entries(LENTES)) {
  const h = leer(DIR + '/crudo/' + a + '-hallazgos.json');
  const d = leer(DIR + '/crudo/' + a + '-descartados.json');
  const vivos = h.filter(x => !x.refutado);
  const r = vivos.filter(x => x.verificado).length;
  const rs = vivos.filter(x => x.resuelto).length;
  const t = h.filter(x => x.refutado).length + d.length;
  tot += vivos.length; rev += r; res += rs; tumb += h.filter(x => x.refutado).length; desc += d.length; nl += lentes.length;
  w('| `' + a + '` | ' + lentes.join('<br>') + ' | ' + vivos.length + ' | ' + r + ' | ' + rs + ' | ' + t + ' | ' + SECCION[a] + ' |');
}
w('| **total** | **' + nl + ' lentes** | **' + tot + '** | **' + rev + '** | **' + res + '** | **' + (tumb + desc) + '** | |');
w('');
w('«Hallazgos» son los que siguen en pie: los que un revisor tumbó no se cuentan aquí, pero no se borran —quedan en `crudo/<área>-hallazgos.json` con `refutado: true` y su motivo, o en `crudo/<área>-descartados.json` los de la segunda corrida— para que el creador vea qué se consideró y por qué se cayó. «Revisados» son los que pasaron por un revisor adversarial que intentó tumbarlos con el código delante. «Ya corregidos» son hallazgos ciertos que el código de hoy corrige (`resuelto: true`, con `motivo_resolucion` que dice qué lo corrige): los que el revisor del 9 de septiembre encontró corregidos al releerlos, y los que sostenían la primera lista de 20 —ya revisados el 6— y que su fila cerró del todo (`resuelto_por` apunta a la fila). Los que una fila cerró solo en parte siguen en pie.');
w('');
w('## Lo que queda');
w('');
w('1. **Del encargo, nada.** Las 35 lentes corrieron y los ' + tot + ' hallazgos en pie tienen veredicto de revisor' + (tot - rev ? ' salvo ' + (tot - rev) : '') + '. Lo que sí queda, y lo señaló el crítico de completitud: **306 conservan el veredicto de la primera tanda, sobre `9ce2ac1`**, y en una muestra de 15 cinco estaban desfasados. Releerlos contra el código de hoy —los que toquen un archivo cambiado desde `9ce2ac1`, con `git diff --stat`— es lo primero de la siguiente tanda; hasta entonces, la columna «ya corregidos» es un piso, no una cuenta cerrada.');
w('2. La lista de las 20 modificaciones siguientes está en `5-top-20.md`; la anterior, ya ejecutada, en `5-top-20-septiembre-6.md`.');
w('3. Lo que los revisores echaron en falta —problemas que vieron mientras revisaban y que ningún auditor había escrito— está en `crudo/<área>-echados-en-falta.json`; no son hallazgos con evidencia completa y no entran en los conteos.');
w('');
w('## Archivos');
w('');
w('| archivo | qué es |');
w('|---|---|');
w('| `../../AUDITORIA-INTEGRAL-2026-09.md` | el informe integral, en la raíz del repositorio: resumen y índice |');
w('| `00-metodo.md` | cómo se hizo la auditoría, qué se corrió de verdad y qué no se pudo comprobar |');
w('| `1a-tecnica-codigo.md` | arquitectura, calidad, rendimiento, dependencias y proceso |');
w('| `1b-tecnica-datos.md` | base de datos, autenticación, seguridad y escalabilidad |');
w('| `1c-tecnica-acceso.md` | accesibilidad |');
w('| `1d-tecnica-integridad-movil.md` | integridad de datos y sincronización sin conexión; móvil, PWA y Android |');
w('| `2a-pedagogica-curriculo.md` | DCNB, coherencia curricular, nivel cognitivo y contenido |');
w('| `2b-pedagogica-aprendizaje.md` | retroalimentación, progresión, gamificación y evidencias |');
w('| `2c-pedagogica-docente.md` | ritmos de aprendizaje y utilidad real para el docente |');
w('| `3-ux.md` | la aplicación probada como alumno de 4º, 5º, 6º, 7º y 9º |');
w('| `3b-ux-docente-familia-direccion.md` | la aplicación probada como docente, familia y dirección; arquitectura de la información |');
w('| `3c-ux-octavo-grado.md` | la aplicación probada como alumna de 8º |');
w('| `4-producto.md` | valor, negocio, mercado, qué sobra y qué falta |');
w('| `5-top-20.md` | las 20 modificaciones siguientes, con evidencia y cómo comprobar cada una |');
w('| `5-top-20-septiembre-6.md` | la primera lista de 20, ya ejecutada, con el bloque «✅ Corregido» de cada una |');
w('| `crudo/<área>-hallazgos.json` | los hallazgos de esa área, con evidencia y veredicto |');
w('| `crudo/<área>-resumenes.json` | el resumen ejecutivo de cada auditor y lo que encontró bien |');
w('| `crudo/<área>-descartados.json` | lo que el revisor tumbó en la segunda corrida, con su motivo |');
w('| `crudo/<área>-echados-en-falta.json` | lo que los revisores vieron y ningún auditor había escrito |');
w('| `maquinaria/` | los flujos, el contexto que leyó cada agente y cómo se retomó |');
fs.writeFileSync(DIR + '/ESTADO.md', f.join('\n') + '\n');
console.log('ESTADO.md escrito ·', nl, 'lentes ·', tot, 'en pie ·', rev, 'revisados ·', res, 'resueltos ·', tumb + desc, 'descartados');
