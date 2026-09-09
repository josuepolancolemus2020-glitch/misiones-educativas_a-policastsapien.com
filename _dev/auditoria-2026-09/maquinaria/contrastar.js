/* Contrasta los veredictos nuevos con lo ya escrito:
     node contrastar.js
   Lista, por sección del informe, los hallazgos citados que la revisión
   del 9 de septiembre tumbó (refutado) o dio por resueltos, con archivo y
   línea donde aparecen, y arma las tablas para pegar en cada sección. */
const fs = require('fs');
const path = require('path');
const DIR = '/home/user/misiones-educativas_a-policastsapien.com/_dev/auditoria-2026-09';
const CRUDO = DIR + '/crudo/';
const SECCIONES = ['1a-tecnica-codigo.md', '1b-tecnica-datos.md', '1c-tecnica-acceso.md', '1d-tecnica-integridad-movil.md',
  '2a-pedagogica-curriculo.md', '2b-pedagogica-aprendizaje.md', '2c-pedagogica-docente.md',
  '3-ux.md', '3b-ux-docente-familia-direccion.md', '4-producto.md', '5-top-20.md'];

const todos = {};
for (const f of fs.readdirSync(CRUDO).filter(x => x.endsWith('-hallazgos.json'))) {
  for (const h of JSON.parse(fs.readFileSync(CRUDO + f, 'utf8'))) todos[h.id] = { ...h, _archivo: f };
}
const revisados = Object.values(todos).filter(h => h.revisado_el === '2026-09-09');
const tumbados = revisados.filter(h => h.refutado);
const resueltos = revisados.filter(h => h.resuelto);
const bajados = revisados.filter(h => !h.refutado && !h.resuelto && h.severidad_original && h.severidad_original !== h.severidad);
console.log(`revisados el 9-sep: ${revisados.length} · tumbados: ${tumbados.length} · resueltos: ${resueltos.length} · con severidad cambiada: ${bajados.length}`);

const ocurrencias = id => {
  const out = [];
  for (const s of SECCIONES) {
    const p = path.join(DIR, s); if (!fs.existsSync(p)) continue;
    fs.readFileSync(p, 'utf8').split('\n').forEach((l, i) => { if (l.includes(id)) out.push(s + ':' + (i + 1)); });
  }
  return out;
};

console.log('\n══ TUMBADOS (hay que quitarlos de su sección y del top 20) ══');
for (const h of tumbados) console.log(`${h.id} [${h.severidad_original || h.severidad}] ${h.titulo.slice(0, 80)}\n    motivo: ${(h.motivo_refutacion || '').slice(0, 200)}\n    aparece en: ${ocurrencias(h.id).join(', ') || '— (solo en crudo)'}`);
console.log('\n══ RESUELTOS (eran ciertos; el código de hoy los corrige) ══');
for (const h of resueltos) console.log(`${h.id} [${h.severidad_original || h.severidad}] ${h.titulo.slice(0, 80)}\n    ${(h.motivo_resolucion || '').slice(0, 160)}\n    aparece en: ${ocurrencias(h.id).join(', ') || '—'}`);
console.log('\n══ SEVERIDAD CAMBIADA ══');
for (const h of bajados) console.log(`${h.id} ${h.severidad_original}→${h.severidad}  ${h.titulo.slice(0, 70)}  · en: ${ocurrencias(h.id).join(', ') || '—'}`);

/* Tablas para pegar, por área */
const porArea = {};
for (const h of revisados) (porArea[h.area] = porArea[h.area] || []).push(h);
for (const [area, hs] of Object.entries(porArea)) {
  const t = hs.filter(h => h.refutado), r = hs.filter(h => h.resuelto);
  let md = `\n## Revisión adversarial del 9 de septiembre de 2026 (${area})\n\n` +
    `Los ${hs.length} hallazgos de esta área que se quedaron sin revisor en la primera corrida pasaron el 9 de septiembre por un revisor adversarial, contra el código de ese día (\`d940fe0\`, con las 20 modificaciones ya aplicadas). ` +
    `Resultado: **${hs.length - t.length - r.length} siguen en pie**${bajadosDe(hs)}, **${r.length} eran ciertos y ya están corregidos**, y **${t.length} se cayeron**.\n`;
  if (r.length) md += `\n### Confirmados y ya corregidos\n\n| ID | título | qué lo corrige |\n|---|---|---|\n` + r.map(h => `| ${h.id} | ${h.titulo} | ${limpia(h.motivo_resolucion)} |`).join('\n') + '\n';
  if (t.length) md += `\n### Descartados en la revisión adversarial\n\n| ID | título | motivo |\n|---|---|---|\n` + t.map(h => `| ${h.id} | ${h.titulo} | ${limpia(h.motivo_refutacion)} |`).join('\n') + '\n';
  fs.writeFileSync(`${process.env.SP || '/tmp'}/tabla-revision-${area}.md`, md);
  console.log(`\n→ tabla escrita: tabla-revision-${area}.md (${r.length} resueltos, ${t.length} tumbados)`);
}
function bajadosDe(hs) { const b = hs.filter(h => !h.refutado && !h.resuelto && h.severidad_original && h.severidad_original !== h.severidad); return b.length ? ` (${b.length} con la severidad ajustada)` : ''; }
function limpia(s) { return String(s || '').replace(/^\[[A-ZÓ]+\]\s*/, '').replace(/\|/g, '\\|').replace(/\n+/g, ' '); }

/* El top 20: qué pasa con los IDs de su tabla */
console.log('\n══ TOP 20: estado de los hallazgos citados en la tabla ══');
const top = fs.readFileSync(path.join(DIR, '5-top-20.md'), 'utf8').split('\n').filter(l => /^\| *\d+ *\|/.test(l));
for (const l of top) {
  const n = l.split('|')[1].trim();
  const ids = [...new Set((l.match(/[TUPB]\d+-\d+/g) || []))];
  const est = ids.map(id => { const h = todos[id]; if (!h) return id + '?'; return id + (h.refutado ? '✗TUMBADO' : h.resuelto ? '✓resuelto' : h.verificado ? '✓' : '·sin revisar'); });
  console.log(`#${n}: ${est.join(' ')}`);
}
