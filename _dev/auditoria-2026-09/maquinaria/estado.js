const fs = require('fs');
const DIR = '/home/user/misiones-educativas_a-policastsapien.com/_dev/auditoria-2026-09';

const HECHAS = {
  'tecnica-codigo': ['T1 Arquitectura completa', 'T2 Calidad del código HTML/CSS/JS y redundancia', 'T5 Rendimiento', 'T8 Dependencias y vulnerabilidades', 'T10 Pruebas, CI y proceso de entrega'],
  'tecnica-datos': ['T3 Base de datos y autenticación', 'T4 Seguridad', 'T9 Escalabilidad a miles de estudiantes'],
  'tecnica-acceso': ['T6 Accesibilidad'],
  'pedagogica-curriculo': ['P1 Correspondencia con el DCNB', 'P2 Coherencia competencia → contenido → misión → actividad → evaluación', 'P3 Nivel cognitivo y pensamiento crítico', 'P10 Calidad y corrección del contenido'],
  'pedagogica-aprendizaje': ['P4 Retroalimentación al estudiante', 'P5 Progresión de dificultad', 'P6 Gamificación', 'P7 Evidencias de aprendizaje'],
  'pedagogica-docente': ['P8 Adaptación a distintos ritmos', 'P9 Utilidad real para el docente'],
  'ux': ['U4 Alumna de 4º grado', 'U5 Alumno de 5º grado', 'U6 Alumna de 6º grado', 'U7 Alumno de 7º grado'],
  'ux-b': ['U9 Alumno de 9º grado'],
  'producto': ['B1 Propuesta de valor y diferenciación', 'B2 Modelo de negocio, precios y costos', 'B3 Mercado: Honduras y Centroamérica', 'B4 Qué sobra y qué falta'],
};
const FALTAN = {
  'tecnica-acceso': ['T11 Integridad de datos y sincronización sin conexión', 'T7 Compatibilidad móvil, PWA y Android'],
  'ux': ['U8 Alumna de 8º grado'],
  'ux-b': ['U10 Docente', 'U11 Madre o padre de familia', 'U12 Administrador y dirección', 'U13 Arquitectura de la información y consistencia visual'],
};

const f = [];
const w = s => f.push(s);
w('# Auditoría integral de M.E.T.A.S. — estado del trabajo');
w('');
w('**Rescatado el 6 de septiembre de 2026.** Los hallazgos de todos los auditores que llegaron a');
w('terminar están en `crudo/`, un archivo por área. Cada hallazgo lleva su severidad, su tipo, su');
w('evidencia (archivo y línea, medición o captura), su recomendación y, cuando pasó revisión');
w('adversarial, el veredicto del revisor en el campo `verificado`.');
w('');
w('Lo que sigue es el inventario exacto de lo hecho y de lo que falta, para poder retomarlo sin');
w('repetir nada de lo que ya se pagó.');
w('');
w('## Lentes completadas');
w('');
w('| área | lentes | hallazgos | revisados |');
w('|---|---|---:|---:|');
let tot = 0, rev = 0, nl = 0;
for (const [a, lentes] of Object.entries(HECHAS)) {
  const h = JSON.parse(fs.readFileSync(DIR + '/crudo/' + a + '-hallazgos.json', 'utf8'));
  const r = h.filter(x => x.verificado).length;
  tot += h.length; rev += r; nl += lentes.length;
  w('| `' + a + '` | ' + lentes.join('<br>') + ' | ' + h.length + ' | ' + r + ' |');
}
w('| **total** | **' + nl + ' lentes** | **' + tot + '** | **' + rev + '** |');
w('');
w('Los hallazgos con `verificado: true` sobrevivieron a un revisor adversarial independiente que');
w('intentó tumbarlos con el código delante. Los demás son la lectura de un solo auditor y hay que');
w('tratarlos como tales hasta que se revisen.');
w('');
w('## Lentes que faltan');
w('');
w('Son siete, y cuatro las pidió el encargo por su nombre: probar la aplicación como docente, como');
w('madre o padre de familia, como administración y como alumna de 8º grado.');
w('');
w('| área | lente pendiente |');
w('|---|---|');
for (const [a, lentes] of Object.entries(FALTAN)) for (const l of lentes) w('| `' + a + '` | ' + l + ' |');
w('');
w('## Lo que falta después de eso');
w('');
w('1. Revisión adversarial de las lentes que no la tienen: ' + (tot - rev) + ' hallazgos sin verificar.');
w('2. La síntesis por área. Hoy solo está escrita la de producto, en `4-producto.md`.');
w('3. La lista priorizada de las 20 modificaciones de mayor impacto y menor esfuerzo.');
w('4. El informe integral y su publicación.');
w('');
w('## Archivos');
w('');
w('| archivo | qué es |');
w('|---|---|');
w('| `00-metodo.md` | cómo se hizo la auditoría y qué no se pudo comprobar |');
w('| `4-producto.md` | la sección de producto, ya redactada y deduplicada |');
w('| `crudo/<área>-hallazgos.json` | los hallazgos de esa área, con evidencia y veredicto |');
w('| `crudo/<área>-resumenes.json` | el resumen ejecutivo de cada auditor y lo que encontró bien |');
w('| `crudo/producto-sintetizado.json` | los 33 hallazgos de producto tras fundir duplicados |');
fs.writeFileSync(DIR + '/ESTADO.md', f.join('\n') + '\n');
console.log('ESTADO.md escrito ·', nl, 'lentes ·', tot, 'hallazgos ·', rev, 'revisados ·', tot - rev, 'sin revisar');
