/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Una copia vieja nunca borra las notas que llegaron
   ──────────────────────────────────────────────────────────────
   Lo que pasó (noviembre de 2026): el maestro llenó el IV parcial en la
   tablet; al rato no estaba ni en la tablet, ni en la nube, ni en el
   teléfono. En el teléfono una pantalla había leído el aula y esperaba
   un diálogo (un pago de colecta, un alumno nuevo); la sincronización
   trajo las notas en medio y el «Guardar» escribió la copia de antes.
   Para la sincronización eso era un borrado hecho a propósito y lo
   repartió a todos los equipos.

   Esta sonda lo reproduce con dos equipos y la nube de mentira de
   _dev/sace-prueba/simulador.js (hace lo mismo que el SQL), y pide:
   · la copia vieja se guarda SIN borrar lo que llegó, en los tres lados,
     y lo que la pantalla cambió también queda;
   · si la pantalla borró una nota a propósito, ese borrado sí se respeta;
   · guardar el mismo objeto dos veces no borra en la segunda vuelta;
   · «Deshacer» cuenta las notas que se perderían y lo dice antes;
   · el respaldo de la sincronización guarda las copias anteriores, y
     «Recuperar» devuelve el IV parcial sin tocar la papelera de la nube.

   Uso:  node _dev/verifica-copia-vieja.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const S = require('./sace-prueba/simulador');

let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };

const ponerIV = eq => {
  const d = eq.adLoad(); d.notas.IV = d.notas.IV || {};
  d.materias.forEach(m => { d.notas.IV[m] = d.notas.IV[m] || {}; d.lista.forEach(a => { d.notas.IV[m][a.num] = 88; }); });
  return eq.adSave(d);
};
const celdasIV = g => Object.values((g.notas || {}).IV || {}).reduce((t, o) => t + Object.keys(o).length, 0);
const deNube = cloud => JSON.parse(cloud.datos.METAS_ADMIN_V1.raw).grupos[0];

function montar() {
  const { raw } = S.aulaDePrueba();
  const v0 = Date.now() - 86400e3;
  const cloud = S.nube({ METAS_ADMIN_V1: { raw, version: v0 } });
  const lsT = S.almacen(), lsP = S.almacen();
  S.sembrar(lsT, raw, v0); S.sembrar(lsP, raw, v0);
  return { cloud, lsT, lsP, total: () => S.grupo(lsT).lista.length * S.grupo(lsT).materias.length };
}

(async () => {
  console.log('1 · El teléfono guarda una copia leída ANTES de que llegara el IV parcial');
  {
    const { cloud, lsT, lsP, total } = montar();
    const P = S.equipo(lsP, cloud); P.__arrancar(); await P.__esperar();
    const vieja = P.adLoad();                         // la pantalla lee el aula y abre un diálogo
    const T = S.equipo(lsT, cloud); T.__arrancar(); await T.__esperar();
    ponerIV(T); await T.__esperar();                   // la tablet llena el IV y lo sube
    await P.dsSync(); await P.__esperar();             // al teléfono le llega en segundo plano
    vieja.boleta.docente = 'Docente nuevo';            // «Guardar» del diálogo
    P.adSave(vieja); await P.__esperar();
    const T2 = S.equipo(lsT, cloud); T2.__arrancar(); await T2.dsSync(); await T2.__esperar();
    const N = total();
    ok(celdasIV(S.grupo(lsP)) === N, 'el teléfono conserva las ' + N + ' notas del IV (' + celdasIV(S.grupo(lsP)) + ')');
    ok(celdasIV(deNube(cloud)) === N, 'la nube también (' + celdasIV(deNube(cloud)) + ')');
    ok(celdasIV(S.grupo(lsT)) === N, 'y la tablet también (' + celdasIV(S.grupo(lsT)) + ')');
    ok(S.grupo(lsT).boleta.docente === 'Docente nuevo' && deNube(cloud).boleta.docente === 'Docente nuevo',
      'y lo que guardó el diálogo del teléfono llega a todos');
  }

  console.log('\n2 · La pantalla vieja borra UNA nota a propósito');
  {
    const { cloud, lsT, lsP, total } = montar();
    const P = S.equipo(lsP, cloud); P.__arrancar(); await P.__esperar();
    const vieja = P.adLoad();
    const mat = vieja.materias[0];
    const num = Object.keys(vieja.notas.I[mat])[0];
    const T = S.equipo(lsT, cloud); T.__arrancar(); await T.__esperar();
    ponerIV(T); await T.__esperar();
    await P.dsSync(); await P.__esperar();
    delete vieja.notas.I[mat][num];
    P.adSave(vieja); await P.__esperar();
    const g = S.grupo(lsP);
    ok(!(num in g.notas.I[mat]), 'la nota que el maestro borró queda borrada');
    ok(celdasIV(g) === total(), 'y las del IV que llegaron siguen ahí');
  }

  console.log('\n3 · El mismo objeto se guarda dos veces');
  {
    const { cloud, lsT, lsP, total } = montar();
    const P = S.equipo(lsP, cloud); P.__arrancar(); await P.__esperar();
    const vieja = P.adLoad();
    const T = S.equipo(lsT, cloud); T.__arrancar(); await T.__esperar();
    ponerIV(T); await T.__esperar();
    await P.dsSync(); await P.__esperar();
    vieja.boleta.director = 'A'; P.adSave(vieja);
    vieja.boleta.director = 'B'; P.adSave(vieja);
    ok(celdasIV(S.grupo(lsP)) === total() && S.grupo(lsP).boleta.director === 'B', 'la segunda vuelta tampoco borra nada');
  }

  console.log('\n4 · Sin nada en medio, guardar es lo de siempre');
  {
    const { cloud, lsP } = montar();
    const P = S.equipo(lsP, cloud); P.__arrancar(); await P.__esperar();
    const d = P.adLoad();
    const mat = d.materias[0], num = Object.keys(d.notas.I[mat])[0];
    d.notas.I[mat][num] = 55; delete d.notas.II[mat][num];
    P.adSave(d);
    const g = S.grupo(lsP);
    ok(g.notas.I[mat][num] === 55 && !(num in g.notas.II[mat]), 'cambia y borra exactamente lo que se pidió');
  }

  console.log('\n5 · «Deshacer» avisa cuántas notas borraría');
  {
    const { cloud, lsT, lsP, total } = montar();
    const P = S.equipo(lsP, cloud); P.__arrancar(); await P.__esperar();
    const foto = lsP.getItem('METAS_ADMIN_V1');
    const T = S.equipo(lsT, cloud); T.__arrancar(); await T.__esperar();
    ponerIV(T); await T.__esperar();
    await P.dsSync(); await P.__esperar();
    const r = P.adUndoNotasPerdidas(foto, lsP.getItem('METAS_ADMIN_V1'));
    ok(r.total === total(), 'cuenta las ' + total() + ' notas del IV que llegaron después (' + r.total + ')');
    ok(/del IV parcial/.test(r.detalle), 'y dice de qué parcial son: «' + r.detalle.slice(0, 60) + '…»');
    ok(P.adUndoNotasPerdidas(foto, foto).total === 0, 'sin nada nuevo no avisa');
  }

  console.log('\n6 · El respaldo guarda las copias anteriores y «Recuperar» devuelve el IV');
  {
    const { cloud, lsT } = montar();
    const llamadas = [];
    const f0 = cloud.fetch;
    cloud.fetch = (url, op) => { llamadas.push(String(url).split('/rpc/')[1]); return f0(url, op); };
    const T = S.equipo(lsT, cloud); T.__arrancar(); await T.__esperar();
    ponerIV(T); await T.__esperar();
    const conIV = lsT.getItem('METAS_ADMIN_V1');
    /* otro equipo (sin el arreglo) sube dos veces copias sin el IV */
    const sinIV = g => { const o = JSON.parse(conIV); delete o.grupos[0].notas.IV; o.grupos[0].boleta.docente = g; return JSON.stringify(o); };
    cloud.datos.METAS_ADMIN_V1 = { raw: sinIV('uno'), version: Date.now() + 10 };
    await T.dsSync(); await T.__esperar();
    cloud.datos.METAS_ADMIN_V1 = { raw: sinIV('dos'), version: Date.now() + 20 };
    T.__lastAuto = 0; await new Promise(r => setTimeout(r, 5));
    const T2 = S.equipo(lsT, cloud); T2.__arrancar(); await T2.dsSync(); await T2.__esperar();
    ok(celdasIV(S.grupo(lsT)) === 0, 'la tablet quedó sin el IV (lo que se vio en clase)');
    const resp = JSON.parse(lsT.getItem('METAS_AULA_RESPALDO_V1'));
    const copias = [resp.datos.METAS_ADMIN_V1].concat((resp.prev || {}).METAS_ADMIN_V1 || []);
    ok(copias.some(r => celdasIV(JSON.parse(r).grupos[0]) > 0), 'el respaldo aún tiene una copia con el IV (' + copias.length + ' copias)');
    ok(T2.dsTieneRespaldo() !== false, 'y aparece «↩️ Recuperar lo que borré»');
    llamadas.length = 0;
    T2.dsRecuperar(); for (let i = 0; i < 6; i++) await new Promise(r => setTimeout(r, 5));
    ok(celdasIV(S.grupo(lsT)) === S.grupo(lsT).lista.length * S.grupo(lsT).materias.length, 'Recuperar devuelve las notas del IV');
    ok(S.grupo(lsT).boleta.docente === 'dos', 'sin deshacer lo que llegó después (el docente sigue «dos»)');
    ok(!llamadas.includes('metas_docente_reset_deshacer'), 'y no usa la papelera de la nube, que es de otro día');
  }

  console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ Una copia vieja ya no borra las notas que llegaron de otro equipo');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ La sonda tropezó:', e.stack || e.message); process.exit(1); });
