/* Vuelca el resultado de una corrida de wf-auditoria-2.js al repositorio:
     node volcar-area.js <resultado.json>
   El resultado es el objeto que devuelve el flujo ({area, lentes, salvo,
   caidos, resumenes, faltaron, sintesis}). Se AÑADE a lo que ya hay en
   crudo/ —nunca se pisa— y se deja constancia de lo descartado. */
const fs = require('fs');
const D = '/home/user/misiones-educativas_a-policastsapien.com/_dev/auditoria-2026-09/crudo/';
const r = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const area = r.area;
const lentes = new Set(r.lentes || []);

const leer = f => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : [];
const CAMPOS = ['id', 'titulo', 'descripcion', 'evidencia', 'severidad', 'tipo', 'impacto_educativo', 'impacto_comercial', 'esfuerzo', 'recomendacion', 'archivos', 'area', 'lente', 'verificado', 'revision', 'refutado', 'correccion'];
const forma = (h, extra) => {
  const o = {};
  for (const k of CAMPOS) o[k] = h[k] !== undefined ? h[k] : (k === 'archivos' ? [] : k === 'verificado' || k === 'refutado' ? false : '');
  o.area = area; o.verificado = !!h.verificado; o.refutado = !!extra.refutado;
  if (h.severidad_original && h.severidad_original !== h.severidad) o.severidad_original = h.severidad_original;
  if (h.doble_verificacion) o.doble_verificacion = h.doble_verificacion;
  if (extra.motivo_refutacion) o.motivo_refutacion = extra.motivo_refutacion;
  if (extra.confianza !== undefined) o.confianza_refutacion = extra.confianza;
  o.commit_auditado = 'd940fe0';   // el código que se auditó en esta corrida (9-sep-2026)
  return o;
};

/* 1) Hallazgos confirmados → <area>-hallazgos.json (añadiendo) */
const fH = D + area + '-hallazgos.json';
const antes = leer(fH);
const yaIds = new Set(antes.map(h => h.id));
const nuevos = (r.salvo || []).filter(h => lentes.has(h.lente) && !yaIds.has(h.id)).map(h => forma(h, {}));
const dup = (r.salvo || []).filter(h => yaIds.has(h.id)).map(h => h.id);
if (dup.length) console.log('⚠️ ids que ya existían y NO se volcaron:', dup.join(', '));
fs.writeFileSync(fH, JSON.stringify(antes.concat(nuevos), null, 1) + '\n');

/* 2) Descartados → <area>-descartados.json (la primera corrida no los guardó) */
const fC = D + area + '-descartados.json';
const cAntes = leer(fC);
const cNuevos = (r.caidos || []).map(h => forma(h, { refutado: true, motivo_refutacion: h.motivo_refutacion, confianza: h.confianza }));
fs.writeFileSync(fC, JSON.stringify(cAntes.concat(cNuevos), null, 1) + '\n');

/* 3) Resúmenes → <area>-resumenes.json (añadiendo) */
const fR = D + area + '-resumenes.json';
const rAntes = leer(fR);
const rNuevos = (r.resumenes || []).filter(x => !rAntes.some(y => y.lente === x.lente));
fs.writeFileSync(fR, JSON.stringify(rAntes.concat(rNuevos), null, 1) + '\n');

/* 4) Lo que los revisores echaron en falta → <area>-echados-en-falta.json */
const fF = D + area + '-echados-en-falta.json';
const fAntes = leer(fF);
fs.writeFileSync(fF, JSON.stringify(fAntes.concat(r.faltaron || []), null, 1) + '\n');

console.log(`${area}: +${nuevos.length} confirmados (total ${antes.length + nuevos.length}), +${cNuevos.length} descartados, +${rNuevos.length} resúmenes, +${(r.faltaron || []).length} echados en falta`);
console.log('por lente:', JSON.stringify(Object.fromEntries([...lentes].map(l => [l, { confirmados: nuevos.filter(h => h.lente === l).length, descartados: cNuevos.filter(h => h.lente === l).length }]))));
