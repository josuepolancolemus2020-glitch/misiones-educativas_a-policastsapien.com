/* Aplica los veredictos de wf-revisar.js a los archivos crudos:
     node aplicar-veredictos.js <resultado.json>
   Misma regla que consolidar() en wf-auditoria: cae si refutado y
   confianza ≥ 60; el escéptico tumba lo crítico con confianza ≥ 70 o le
   baja la severidad. Los caídos NO se borran: quedan con refutado:true y
   su motivo, para la tabla de descartados de cada sección. */
const fs = require('fs');
const D = '/home/user/misiones-educativas_a-policastsapien.com/_dev/auditoria-2026-09/crudo/';
const r = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const porArea = {};
for (const g of r.resultados || []) (porArea[g.area] = porArea[g.area] || []).push(g);
const cuenta = {};
for (const [area, grupos] of Object.entries(porArea)) {
  const f = D + area + '-hallazgos.json';
  const hs = JSON.parse(fs.readFileSync(f, 'utf8'));
  const porId = Object.fromEntries(hs.map(h => [h.id, h]));
  const faltaron = [];
  for (const g of grupos) {
    const esc = Object.fromEntries((g.escepticos || []).map(e => [e.id, e]));
    for (const v of g.veredictos || []) {
      const h = porId[v.id];
      if (!h) { console.log('⚠️ veredicto para un id que no existe:', v.id); continue; }
      const c = cuenta[g.lente] = cuenta[g.lente] || { n: 0, caidos: 0, resueltos: 0, bajadas: 0 };
      c.n++;
      h.verificado = true;
      h.revision = v.motivo || '';
      h.correccion = v.correccion || '';
      h.revisado_el = '2026-09-09';
      h.commit_revision = 'd940fe0';
      if (!h.severidad_original) h.severidad_original = h.severidad;
      /* [RESUELTO] no es «falso»: el hallazgo era cierto y el código de hoy ya
         lo corrige. Para el creador son dos cosas distintas, así que se guarda
         como confirmado-y-resuelto, no como tumbado. */
      if (v.refutado && v.confianza >= 60 && /^\[RESUELTO\]/.test(v.motivo || '')) {
        h.refutado = false; h.resuelto = true; h.motivo_resolucion = v.motivo; c.resueltos++;
        continue;
      }
      if (v.refutado && v.confianza >= 60) {
        h.refutado = true; h.motivo_refutacion = v.motivo; h.confianza_refutacion = v.confianza;
        c.caidos++;
        continue;
      }
      h.refutado = false;
      if (v.severidad_ajustada && v.severidad_ajustada !== h.severidad) { h.severidad = v.severidad_ajustada; c.bajadas++; }
      const e = esc[v.id];
      if (e) {
        h.doble_verificacion = e.motivo || '';
        if (e.refutado && e.confianza >= 70) { h.refutado = true; h.motivo_refutacion = '[escéptico] ' + e.motivo; h.confianza_refutacion = e.confianza; c.caidos++; }
        else if (e.severidad_ajustada && e.severidad_ajustada !== 'critica') h.severidad = e.severidad_ajustada;
      }
    }
    for (const t of g.faltaron || []) faltaron.push({ lente: g.lente, texto: t, origen: 'revision-2026-09-09' });
  }
  fs.writeFileSync(f, JSON.stringify(hs, null, 1) + '\n');
  if (faltaron.length) {
    const fF = D + area + '-echados-en-falta.json';
    const antes = fs.existsSync(fF) ? JSON.parse(fs.readFileSync(fF, 'utf8')) : [];
    fs.writeFileSync(fF, JSON.stringify(antes.concat(faltaron), null, 1) + '\n');
  }
}
console.log(JSON.stringify(cuenta, null, 1));
