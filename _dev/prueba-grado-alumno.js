/* ============================================================
   M.E.T.A.S · Que la alumna encuentre lo de SU grado
   ------------------------------------------------------------
   Medido antes de tocar nada, el 9 de septiembre de 2026: una alumna de
   4º y un alumno de 9º veían las MISMAS 67 tarjetas en el MISMO orden, y
   buscar «cuarto» daba cero resultados.

   Sin navegador y en un segundo, que es lo que hace que se corra.

   Uso:  node _dev/prueba-grado-alumno.js
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const G = require('../js/grado-alumno.js');

const RAIZ = path.resolve(__dirname, '..');
const ctx = { window: {}, document: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/data/misiones.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/data/dcnb-map.js'), 'utf8'), ctx);
vm.runInContext('window.M = MISSIONS; window.D = DCNB_MAP;', ctx);
const MISSIONS = ctx.window.M, DCNB_MAP = ctx.window.D;

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

console.log('\n▶ 1 · Lo que la alumna escribió a mano');
{
  const casos = [['4', '4'], ['4º', '4'], ['4to', '4'], ['4to A', '4'], ['cuarto', '4'],
                 ['Cuarto grado', '4'], ['6º-1', '6'], ['6 2', '6'], ['61', '6'],
                 ['9no B', '9'], ['', ''], ['   ', ''], ['bachillerato', ''], [null, '']];
  casos.forEach(([txt, esp]) => ok(`«${txt}» → ${esp || '(nada)'}`, G.delTexto(txt) === esp, G.delTexto(txt)));
}

console.log('\n▶ 2 · En qué grados entra una misión: el DCNB, y nada inventado');
{
  const porId = id => MISSIONS.find(m => m.id === id);
  ok('Números Grandes (6) es de 4º según el DCNB', G.gradosDe(porId(6), DCNB_MAP).join() === '4', G.gradosDe(porId(6), DCNB_MAP));
  ok('Las Fracciones (23) entra en cuatro grados', G.gradosDe(porId(23), DCNB_MAP).join() === '4,5,6,7', G.gradosDe(porId(23), DCNB_MAP));
  const fdg4 = MISSIONS.find(m => /Fin de Grado: 4/.test(m.title));
  ok('la Prueba de Fin de Grado de 4º sale como de 4º (y NO está en el mapa)',
     !DCNB_MAP[fdg4.id] && G.gradosDe(fdg4, DCNB_MAP).join() === '4', G.gradosDe(fdg4, DCNB_MAP));
  const adj = porId(1);   // «II y III Ciclo»
  ok('una de «II y III Ciclo» NO se reparte a los seis grados', G.gradosDe(adj, DCNB_MAP).length === 0 || !!DCNB_MAP[1],
     { grade: adj.grade, grados: G.gradosDe(adj, DCNB_MAP) });
  const sinNada = MISSIONS.find(m => !DCNB_MAP[m.id] && !/^\d/.test(String(m.grade)));
  ok('y una sin mapa y sin grado propio se queda sin grado', G.gradosDe(sinNada, DCNB_MAP).length === 0,
     { t: sinNada.title, grade: sinNada.grade });
}

console.log('\n▶ 3 · Se ORDENA, nunca se filtra: no desaparece ni una tarjeta');
{
  G.GRADOS.forEach(g => {
    const r = G.repartir(MISSIONS, g, DCNB_MAP);
    ok(`${g}º: ${String(r.mias.length).padStart(2)} suyas + ${r.demas.length} después = las ${MISSIONS.length}`,
       r.mias.length + r.demas.length === MISSIONS.length && r.mias.length > 0);
  });
  const sin = G.repartir(MISSIONS, '', DCNB_MAP);
  ok('sin grado elegido no se rotula nada y salen todas',
     sin.mias.length === 0 && sin.demas.length === MISSIONS.length);
}

console.log('\n▶ 4 · Lo MÁS suyo va primero (doce misiones son espirales y tapaban el resto)');
{
  const idx = m => MISSIONS.indexOf(m);
  const creciente = a => a.every((m, i) => i === 0 || idx(a[i - 1]) < idx(m));
  ok('las demás van en el orden del catálogo', creciente(G.repartir(MISSIONS, '4', DCNB_MAP).demas));
  G.GRADOS.forEach(g => {
    const mias = G.repartir(MISSIONS, g, DCNB_MAP).mias;
    const ns = mias.map(m => G.gradosDe(m, DCNB_MAP).length);
    ok(`${g}º: de lo más suyo a lo más compartido`, ns.every((n, i) => i === 0 || ns[i - 1] <= n), ns.join(','));
  });
  /* La prueba que de verdad importa: la primera pantalla de una de 4º y la
     de uno de 9º no pueden ser la misma, que es donde se atascaban. */
  const p = g => G.repartir(MISSIONS, g, DCNB_MAP).mias.slice(0, 3).map(m => m.title).join(' · ');
  ok('lo primero que ve la de 4º NO es lo que ve el de 9º', p('4') !== p('9'), { de4: p('4'), de9: p('9') });
  console.log('    4º empieza por: ' + p('4'));
  console.log('    9º empieza por: ' + p('9'));
}

console.log('\n▶ 5 · El buscador: «cuarto» daba CERO');
{
  const heno = m => G.sinTildes(m.title + ' ' + G.textoBusqueda(m, DCNB_MAP));
  const busca = q => MISSIONS.filter(m => G.sinTildes(q).split(/\s+/).filter(Boolean)
    .every(p => heno(m).includes(p))).length;
  ['cuarto', '4to', '4o', 'noveno', 'sexto grado'].forEach(q =>
    ok(`buscar «${q}» ya encuentra misiones`, busca(q) > 0, busca(q)));
  ok('y «cuarto» encuentra las mismas que son de 4º',
     busca('cuarto') === G.repartir(MISSIONS, '4', DCNB_MAP).mias.length,
     { busca: busca('cuarto'), de4: G.repartir(MISSIONS, '4', DCNB_MAP).mias.length });
}

console.log('\n▶ 6 · Cada grado de 4º a 9º tiene algo que ofrecer');
{
  const cuenta = {};
  G.GRADOS.forEach(g => cuenta[g] = G.repartir(MISSIONS, g, DCNB_MAP).mias.length);
  console.log('  (misiones por grado: ' + G.GRADOS.map(g => g + 'º=' + cuenta[g]).join('  ') + ')');
  ok('ninguno se queda con menos de cinco', G.GRADOS.every(g => cuenta[g] >= 5), cuenta);
}

console.log('\n' + '─'.repeat(52));
if (fallos) { console.log(`✖ ${fallos} fallo(s).`); process.exit(1); }
console.log('✅ La alumna encuentra lo suyo, y no se le esconde nada.');
