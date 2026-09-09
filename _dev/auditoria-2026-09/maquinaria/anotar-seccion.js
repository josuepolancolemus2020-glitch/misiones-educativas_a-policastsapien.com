/* Anota en una sección ya escrita lo que dijo la revisión del 9 de septiembre:
     node anotar-seccion.js <sección.md> <área>[,<área>]
   · debajo de cada línea de identificador («`T2-06` · alta · …») añade la nota
     de «corregido», «tumbado» o «severidad ajustada» que corresponda;
   · en las citas en línea («(`T8-02`)») marca lo corregido;
   · y al final pega la tabla de la revisión (la escribe contrastar.js).
   Idempotente: si la sección ya lleva la tabla, no toca nada. */
const fs = require('fs');
const DIR = '/home/user/misiones-educativas_a-policastsapien.com/_dev/auditoria-2026-09';
const [seccion, areas] = process.argv.slice(2);
const p = DIR + '/' + seccion;
let s = fs.readFileSync(p, 'utf8');
if (s.includes('## Revisión adversarial del 9 de septiembre')) { console.log(seccion + ': ya anotada'); process.exit(0); }

const todos = {};
for (const a of areas.split(',')) for (const h of JSON.parse(fs.readFileSync(`${DIR}/crudo/${a}-hallazgos.json`, 'utf8'))) todos[h.id] = h;
const rev = id => { const h = todos[id]; return h && h.revisado_el === '2026-09-09' ? h : null; };
const corto = (t, n = 330) => String(t || '').replace(/^\[[A-ZÓ]+\]\s*/, '').replace(/\s+/g, ' ').slice(0, n).replace(/\s\S*$/, '') + (String(t || '').length > n ? '…' : '');

let notas = 0, inline = 0;
const lineas = s.split('\n');
const out = [];
for (let i = 0; i < lineas.length; i++) {
  let l = lineas[i];
  const esLineaId = /^`[TUPB]\d+-\d+`(?: \+ `[TUPB]\d+-\d+`)* ·/.test(l) || /^`[TUPB]\d+-\d+ \+ [TUPB]\d+-\d+(?: \+ [TUPB]\d+-\d+)*` ·/.test(l) || /^`[TUPB]\d+-\d+` y `[TUPB]\d+-\d+` ·/.test(l);
  if (esLineaId) {
    const ids = [...new Set(l.match(/[TUPB]\d+-\d+/g))];
    const hs = ids.map(rev).filter(Boolean);
    /* La severidad de la línea: si es un solo id y el revisor la cambió, se corrige en la línea. */
    if (ids.length === 1 && hs[0] && hs[0].severidad_original && hs[0].severidad_original !== hs[0].severidad && !hs[0].refutado) {
      l = l.replace('· ' + hs[0].severidad_original + ' ·', '· ' + hs[0].severidad + ' ·');
    }
    out.push(l);
    for (const h of hs) {
      if (h.refutado) { out.push('', `> ✗ **Descartado en la revisión del 9 de septiembre** (\`${h.id}\`): ${corto(h.motivo_refutacion)}`); notas++; }
      else if (h.resuelto) { out.push('', `> ✅ **Corregido antes de esta revisión** (\`${h.id}\`, comprobado el 9 de septiembre contra \`d940fe0\`): ${corto(h.motivo_resolucion)}`); notas++; }
      else if (h.severidad_original && h.severidad_original !== h.severidad) { out.push('', `> ↕ **Severidad ajustada por el revisor del 9 de septiembre** (\`${h.id}\`: ${h.severidad_original} → ${h.severidad}): ${corto(h.correccion || h.revision, 260)}`); notas++; }
      else if (h.correccion) { out.push('', `> ✓ **Confirmado el 9 de septiembre** (\`${h.id}\`). Matiz del revisor: ${corto(h.correccion, 260)}`); notas++; }
    }
    continue;
  }
  /* Citas en línea: (`T8-02`) o (`T8-09`, `T5-08`) */
  l = l.replace(/\(`([TUPB]\d+-\d+)`((?:, `[TUPB]\d+-\d+`)*)\)/g, (m, id1, resto) => {
    const ids = [id1, ...(resto.match(/[TUPB]\d+-\d+/g) || [])];
    const marcas = ids.map(id => { const h = rev(id); if (!h) return '`' + id + '`'; if (h.refutado) return '`' + id + '` ✗ descartado el 9-sep'; if (h.resuelto) return '`' + id + '` ✅ corregido'; return '`' + id + '`'; });
    if (marcas.join() !== ids.map(id => '`' + id + '`').join()) inline++;
    return '(' + marcas.join(', ') + ')';
  });
  out.push(l);
}
s = out.join('\n');
/* La tabla de la revisión, al final. */
for (const a of areas.split(',')) {
  const t = `${process.env.SP}/tabla-revision-${a}.md`;
  if (fs.existsSync(t)) s = s.replace(/\s*$/, '\n') + fs.readFileSync(t, 'utf8');
}
fs.writeFileSync(p, s);
console.log(`${seccion}: ${notas} notas bajo identificadores, ${inline} citas en línea marcadas, tabla pegada`);
