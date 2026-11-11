/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Importar el SACE y recargar: la importación se queda
   ──────────────────────────────────────────────────────────────
   Lo que pasó en producción (noviembre de 2026, 6º-1): el maestro
   importó la lista del SACE, tocó «Guardar lo marcado» y al recargar no
   había nada: ni «En lista oficial», ni fecha de nacimiento, ni edad.

   La causa: la nube solo acepta una versión >= la que tiene, y la
   versión de un cambio era la HORA del equipo. Con un teléfono de reloj
   adelantado, la nube quedó con una versión «del futuro»; la subida de
   la PC se descartaba EN SILENCIO (el SQL cuenta la fila igual), la PC
   la daba por subida y la siguiente sincronización le ponía encima la
   copia vieja de la nube.

   Esta sonda reproduce eso con la nube de mentira de
   _dev/sace-prueba/simulador.js, que hace lo mismo que el SQL, y pide:
   · con el reloj de otro equipo adelantado, importar + recargar conserva
     la lista oficial, la fecha de nacimiento y la edad, y la nube los tiene;
   · recargar ANTES de que se suba también los conserva;
   · con el almacén del navegador casi lleno de fotos de «Deshacer», la
     importación se guarda igual (se sueltan fotos viejas) y no falla callada;
   · ninguna nota cambia en ningún caso.

   Uso:  node _dev/verifica-sace-recarga.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const S = require('./sace-prueba/simulador');

let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };
const enNube = (cloud, f) => f(JSON.parse(cloud.datos.METAS_ADMIN_V1.raw).grupos[0]);
const oficiales = g => g.lista.filter(a => a.sace === true);

(async () => {
  const { fix, raw } = S.aulaDePrueba();
  const notasAntes = JSON.stringify(fix.grupo.notas);

  console.log('1 · Otro equipo dejó la nube con el reloj adelantado 3 horas');
  {
    const ADELANTE = Date.now() + 3 * 3600e3;
    const cloud = S.nube({ METAS_ADMIN_V1: { raw, version: ADELANTE } });
    const ls = S.almacen();
    S.sembrar(ls, raw, ADELANTE);
    const pc = S.equipo(ls, cloud);
    pc.__arrancar(); await pc.__esperar();          // la página ya estaba abierta
    ok(pc.__importarSace(S.CSV()) === true, 'el guardado dice que guardó');
    await pc.__esperar();                            // el vigía la sube sola
    ok(cloud.rechazadas === 0, 'la nube no descarta la subida (' + cloud.rechazadas + ' descartadas)');
    ok(enNube(cloud, g => oficiales(g).length) === 40, 'la nube tiene las 40 fichas en lista oficial');

    const recarga = S.equipo(ls, cloud);              // F5
    recarga.__arrancar(); await recarga.dsSync(); await recarga.__esperar();
    const g = S.grupo(ls);
    ok(oficiales(g).length === 40, 'al recargar siguen 40 «En lista oficial SACE» (' + oficiales(g).length + ')');
    const conFecha = g.lista.filter(a => /^\d{4}-\d{2}-\d{2}$/.test(a.fnac || ''));
    ok(conFecha.length >= 40, 'la fecha de nacimiento se queda (' + conFecha.length + ' con fecha)');
    const edad = recarga.SaceLista.edadTxt(g.lista.find(a => a.num === 1).fnac, '2026-11-11');
    ok(/años/.test(edad), 'y la edad se calcula sola: «' + edad + '»');
    ok(g.lista.filter(a => a.sace === false).length === 4, 'las 4 fichas de más siguen marcadas «Fuera de la lista oficial»');
    ok(JSON.stringify(g.notas) === notasAntes, 'ninguna nota cambió');
  }

  console.log('\n2 · Recargar enseguida, antes de que se suba');
  {
    const ADELANTE = Date.now() + 3 * 3600e3;
    const cloud = S.nube({ METAS_ADMIN_V1: { raw, version: ADELANTE } });
    const ls = S.almacen();
    S.sembrar(ls, raw, ADELANTE);
    const pc = S.equipo(ls, cloud);
    pc.__arrancar(); await pc.__esperar();
    pc.__importarSace(S.CSV());
    const recarga = S.equipo(ls, cloud);               // F5 antes del vigía
    recarga.__arrancar(); await recarga.dsSync(); await recarga.__esperar();
    ok(oficiales(S.grupo(ls)).length === 40, 'la importación se queda en este equipo');
    ok(enNube(cloud, g => oficiales(g).length) === 40, 'y llega a la nube');
    ok(JSON.stringify(S.grupo(ls).notas) === notasAntes, 'ninguna nota cambió');
  }

  console.log('\n3 · El almacén del navegador está casi lleno');
  {
    const cloud = S.nube({ METAS_ADMIN_V1: { raw, version: Date.now() - 1000 } });
    const ls = S.almacen(raw.length * 9);             // tope ajustado
    S.sembrar(ls, raw, Date.now() - 1000);
    const pc = S.equipo(ls, cloud);
    pc.__arrancar(); await pc.__esperar();
    /* fotos de «Deshacer» de acciones anteriores hasta llenar */
    for (let i = 0; i < 14; i++) pc.adUndoGuardar('Ordenar ' + i);
    const guardo = pc.__importarSace(S.CSV());
    ok(guardo === true && oficiales(S.grupo(ls)).length === 40, 'la importación se guarda aunque el almacén estuviera lleno');
    ok(pc.adUndoLista().length >= 1, 'y queda al menos la foto de «Deshacer» de la importación');
    /* sin sitio de verdad, avisa en vez de callar */
    const lleno = S.almacen(raw.length * 2.05);
    S.sembrar(lleno, raw, Date.now() - 1000, false);
    const pc2 = S.equipo(lleno, cloud);
    const g2 = pc2.adLoad(); g2.lista.forEach(a => { a.nota = 'x'.repeat(2000); });
    ok(pc2.adSave(g2) === false && pc2.__avisos.some(t => /No se pudo guardar/.test(t)), 'si de verdad no cabe, lo dice: no falla callado');
  }

  console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ Importar el SACE y recargar conserva todo');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ La sonda tropezó:', e.stack || e.message); process.exit(1); });
