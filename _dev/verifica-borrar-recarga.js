/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Una ficha borrada no vuelve al recargar
   ──────────────────────────────────────────────────────────────
   En producción (noviembre de 2026, 6º-1) el maestro borraba la #43
   «Alumno» vacía y al recargar volvía. Dos caminos la devolvían:
   · la nube descartaba la subida del borrado por versión (reloj de otro
     equipo adelantado) y la siguiente sincronización traía la copia vieja;
   · un equipo SIN base fusionaba uniendo las dos copias, y unir revive.

   La nube de mentira (_dev/sace-prueba/simulador.js) hace lo que el SQL.
   Se pide:
   · borrar (con su confirmación) + recargar no revive, con reloj adelantado;
   · un teléfono con la copia vieja, sin base y con un cambio suyo, no la
     revive en la nube ni en la PC, y su cambio sí llega;
   · borrar una fila de en medio no deja una fila de más al final;
   · «Deshacer» sí la devuelve, porque eso es restaurarla a propósito;
   · borrar no cambia ninguna nota de los que quedan.

   Uso:  node _dev/verifica-borrar-recarga.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const S = require('./sace-prueba/simulador');

let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };
const hay = (g, f) => g.lista.some(f);
const vacia = a => !String(a.nombre || '').trim();

(async () => {
  /* el aula de la sonda del SACE + la #45 vacía que el maestro quiere borrar */
  const { raw } = S.aulaDePrueba([{ num: 45, nombre: '' }]);
  const notasDe = (g, num) => Object.keys(g.notas).map(p => Object.keys(g.notas[p]).map(m => g.notas[p][m][num]).join(',')).join(';');

  console.log('1 · Borrar la fila vacía con el reloj de otro equipo adelantado');
  {
    const ADELANTE = Date.now() + 3 * 3600e3;
    const cloud = S.nube({ METAS_ADMIN_V1: { raw, version: ADELANTE } });
    const ls = S.almacen();
    S.sembrar(ls, raw, ADELANTE);
    const pc = S.equipo(ls, cloud);
    pc.__arrancar(); await pc.__esperar();
    const notas3 = notasDe(S.grupo(ls), 3);
    await pc.adEliminarAlumnoFila(45);
    ok(S.grupo(ls).lista.length === 44, 'se borra (pide confirmación: metasConfirm)');
    await pc.__esperar();
    ok(cloud.rechazadas === 0, 'la nube acepta el borrado');
    const recarga = S.equipo(ls, cloud);
    recarga.__arrancar(); await recarga.dsSync(); await recarga.__esperar();
    const g = recarga.adLoad();
    ok(g.lista.length === 44 && !hay(g, vacia), 'al recargar NO vuelve (' + g.lista.length + ' fichas)');
    ok(notasDe(g, 3) === notas3, 'las notas de los demás no cambian');
  }

  console.log('\n2 · Un teléfono con la copia vieja, sin base y con un cambio suyo');
  {
    const AYER = Date.now() - 86400e3;
    const cloud = S.nube({ METAS_ADMIN_V1: { raw, version: AYER } });
    const lsPc = S.almacen(), lsTel = S.almacen();
    S.sembrar(lsPc, raw, AYER);
    const pc = S.equipo(lsPc, cloud);
    pc.__arrancar(); await pc.__esperar();
    await pc.adEliminarAlumnoFila(45);
    await pc.__esperar();
    /* el teléfono: copia de ayer, sin base, y una nota de conducta nueva suya */
    S.sembrar(lsTel, raw, AYER, false);
    const tel = S.equipo(lsTel, cloud, 2 * 3600e3);   // y con el reloj adelantado 2 h
    const gt = tel.adLoad(); gt.bitacora = [{ id: 'b1', f: '2026-11-11', txt: 'Salida al patio' }]; tel.adSave(gt);
    tel.__arrancar(); await tel.dsSync(); await tel.__esperar();
    ok(!hay(tel.adLoad(), vacia), 'en el teléfono la fila borrada no aparece');
    const recarga = S.equipo(lsPc, cloud);
    recarga.__arrancar(); await recarga.dsSync(); await recarga.__esperar();
    const g = recarga.adLoad();
    ok(!hay(g, vacia) && g.lista.length === 44, 'en la PC tampoco vuelve (' + g.lista.length + ' fichas)');
    ok((g.bitacora || []).some(b => b.id === 'b1'), 'y el cambio del teléfono sí llega');
  }

  console.log('\n3 · Borrar una fila de en medio no deja una de más al final');
  {
    const AYER = Date.now() - 86400e3;
    const cloud = S.nube({ METAS_ADMIN_V1: { raw, version: AYER } });
    const lsPc = S.almacen(), lsTel = S.almacen();
    S.sembrar(lsPc, raw, AYER);
    const pc = S.equipo(lsPc, cloud);
    pc.__arrancar(); await pc.__esperar();
    const borrada = pc.adLoad().lista.find(a => a.num === 10);
    await pc.adEliminarAlumnoFila(10);
    await pc.__esperar();
    S.sembrar(lsTel, raw, AYER, false);
    const tel = S.equipo(lsTel, cloud, 2 * 3600e3);
    const gt = tel.adLoad(); gt.bitacora = [{ id: 'b2', f: '2026-11-11', txt: 'Simulacro' }]; tel.adSave(gt);
    tel.__arrancar(); await tel.dsSync(); await tel.__esperar();
    const recarga = S.equipo(lsPc, cloud);
    recarga.__arrancar(); await recarga.dsSync(); await recarga.__esperar();
    const g = recarga.adLoad();
    ok(g.lista.length === 44, 'quedan 44 fichas, no 45 (' + g.lista.length + ')');
    ok(!g.lista.some(a => a.nombre === borrada.nombre), 'y la borrada no está en ningún número');
    ok(new Set(g.lista.map(a => a.nombre + '|' + a.idn)).size === g.lista.length, 'ninguna ficha repetida');
  }

  console.log('\n4 · «Deshacer» sí la devuelve, a propósito');
  {
    const cloud = S.nube({ METAS_ADMIN_V1: { raw, version: Date.now() - 1000 } });
    const ls = S.almacen();
    S.sembrar(ls, raw, Date.now() - 1000);
    const pc = S.equipo(ls, cloud);
    pc.__arrancar(); await pc.__esperar();
    await pc.adEliminarAlumnoFila(45);
    await pc.__esperar();
    const i = pc.adUndoLista().length - 1;
    await pc.adUndoRestaurar(i);
    await pc.__esperar();
    const recarga = S.equipo(ls, cloud);
    recarga.__arrancar(); await recarga.dsSync(); await recarga.__esperar();
    const g = recarga.adLoad();
    ok(g.lista.length === 45 && hay(g, vacia), 'restaurada, sigue ahí después de recargar (' + g.lista.length + ')');
  }

  console.log('\n5 · Lo que se agrega a propósito después de borrar no se toca');
  {
    const cloud = S.nube({ METAS_ADMIN_V1: { raw, version: Date.now() - 1000 } });
    const ls = S.almacen();
    S.sembrar(ls, raw, Date.now() - 1000);
    const pc = S.equipo(ls, cloud);
    pc.__arrancar(); await pc.__esperar();
    await pc.adEliminarAlumnoFila(45);
    const g = pc.adLoad(); g.lista.push({ num: 45, nombre: '', alta: Date.now() + 5 }); pc.adSave(g);
    await pc.__esperar();
    const recarga = S.equipo(ls, cloud);
    recarga.__arrancar(); await recarga.dsSync();
    ok(recarga.adLoad().lista.length === 45, 'una fila nueva vacía, agregada después, se queda');
  }

  console.log('\n6 · Borrar una ficha repetida no se lleva la otra copia');
  {
    const { raw: rawDup } = S.aulaDePrueba([{ num: 45, nombre: 'Juan Pérez' }, { num: 46, nombre: 'Juan Pérez' }]);
    const cloud = S.nube({ METAS_ADMIN_V1: { raw: rawDup, version: Date.now() - 1000 } });
    const ls = S.almacen();
    S.sembrar(ls, rawDup, Date.now() - 1000);
    const pc = S.equipo(ls, cloud);
    pc.__arrancar(); await pc.__esperar();
    await pc.adEliminarAlumnoFila(46);
    await pc.__esperar();
    const recarga = S.equipo(ls, cloud);
    recarga.__arrancar(); await recarga.dsSync();
    const juanes = recarga.adLoad().lista.filter(a => a.nombre === 'Juan Pérez').length;
    ok(juanes === 1, 'queda un «Juan Pérez» (' + juanes + ')');
  }

  console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ Lo borrado no vuelve; lo restaurado sí');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ La sonda tropezó:', e.stack || e.message); process.exit(1); });
