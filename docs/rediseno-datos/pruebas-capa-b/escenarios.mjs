// ============================================================================
// Capa B · escenarios del corte 1 (escritos ANTES del código)
// ----------------------------------------------------------------------------
// Corre con:  bash _dev/supabase-local/corre-supabase.sh --capa-b
// Necesita la capa A ya cargada (docente FICTICIA A, contraseña «clave-a»).
// Mientras js/datos/ no exista, sale con código 2 y dice qué falta: así se
// distingue «todavía no está escrito» de «está escrito y falla».
// Contrato que prueban: CONTRATO.md. Escenarios: 06-PRUEBAS.md, 6.3.
// ============================================================================
import {
  afirma, aparato, contadores, dineroComoTexto, dispositivo, escenario, faltantes, horaServidor, resultado, sql, sqlJson,
} from './arnes.mjs';

const falta = faltantes();
if (falta.length) {
  console.log('… capa B escrita antes del código: todavía no existen\n   ' + falta.join('\n   '));
  console.log('  (se implementan en el corte 1; hasta entonces esta capa no puede correr)');
  process.exit(2);
}

const A = { correo: 'a@ejemplo.invalid', clave: 'clave-a' };
const hoy = '2027-03-10';

// Cada escenario arma su propia aula, para no depender de los demás.
async function aulaNueva(ap, n = 3) {
  const aula = ap.d.crear('aulas', {
    // sección distinta en cada aula (la llave natural es escuela + grado + sección + año)
    escuela: 'Escuela Ficticia Capa B', grado: 5, seccion: (Number(process.hrtime.bigint() % 46656n)).toString(36),
    anio_lectivo: 2027, docente_nombre: 'Docente Ficticia A',
  }).id;
  const alumnos = [];
  for (let i = 1; i <= n; i++) {
    alumnos.push(ap.d.crear('alumnos', { aula_id: aula, nombre_completo: `Alumna Ficticia B${i}`, num_lista: i }).id);
  }
  const colecta = (await ap.d.colecta.crear({ aula_id: aula, concepto: 'Excursión (ficticia)', monto_sugerido: '50', fecha: hoy })).id;
  await ap.d.esperarCola();
  return { aula, alumnos, colecta };
}
async function entrar(nombre) {
  const ap = await aparato(nombre);
  const r = await ap.d.entrar(A.correo, A.clave);
  afirma(r.ok, `${nombre} no entró: ${JSON.stringify(r)}`);
  return ap;
}
const pagosVivos = (colecta, alumno) =>
  sqlJson(`select id, monto::text, recibo, alumno_id from metas.pagos where colecta_id = '${colecta}'
           ${alumno ? `and alumno_id = '${alumno}'` : ''} and deleted_at is null`);
function sinContadores(desde, ops) {
  const c = contadores(desde, ops);
  afirma(c.inventados == 0 && c.revividos == 0 && c.duplicados == 0, 'contadores: ' + JSON.stringify(c));
}

console.log('▶ Capa B · cola, conflictos y dinero');

await escenario('B1 ids: uuid v4 sin Math.random, mil sin repetir', async () => {
  const ap = await aparato('ids');
  const vistos = new Set();
  for (let i = 0; i < 1000; i++) {
    const x = ap.MetasDatos.ids.nuevo();
    afirma(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(x), x);
    vistos.add(x);
  }
  afirma(vistos.size === 1000, 'se repitió un id');
});

await escenario('B2 montos: lo que escribe el docente, en centavos y como texto', async () => {
  const m = (await aparato('montos')).MetasDatos.montos;
  afirma(m.leer('150').valor === '150.00' && m.leer('L 150.5').valor === '150.50' && m.leer('0.1').valor === '0.10');
  afirma(m.leer('1,500').pregunta && m.leer('1.500').pregunta, '«1,500» y «1.500» se preguntan, no se adivinan');
  afirma(m.sumar(['0.10', '0.20']) === '0.30', 'flotante: ' + m.sumar(['0.10', '0.20']));
  afirma(m.sumar(Array(1000).fill('0.10')) === '100.00');
  afirma(!m.leer('-5').ok && !m.leer('abc').ok);
});

await escenario('B3 sin señal: el pago queda en la cola y al volver hay exactamente uno', async () => {
  const desde = horaServidor();
  const tel = await entrar('telefono');
  const { colecta, alumnos } = await aulaNueva(tel);
  tel.sinSenal();
  const { id } = tel.d.pagar({ colecta_id: colecta, alumno_id: alumnos[0], monto: '50', fecha: hoy });
  afirma(tel.d.pendientes() === 1, 'pendientes: ' + tel.d.pendientes());
  const local = tel.d.lista('pagos', { colecta_id: colecta });
  afirma(local.length === 1 && local[0].id === id && local[0].monto === '50.00' && !local[0].recibo,
    'sin señal se ve el pago, sin número de recibo: ' + JSON.stringify(local));
  tel.conSenal();
  await tel.d.esperarCola();
  const base = pagosVivos(colecta);
  afirma(base.length === 1 && base[0].id === id && base[0].monto === '50.00', JSON.stringify(base));
  afirma(tel.d.lista('pagos', { colecta_id: colecta })[0].recibo === base[0].recibo, 'el recibo llegó al aparato');
  sinContadores(desde, sql(`select string_agg(op_creacion::text, ',') from metas.pagos where id = '${id}'`).split(','));
});

// Rev. 9: se pierde SOLO la respuesta de pago_crear (antes, cualquier
// petición: las dos pérdidas se las podía llevar una lectura de fondo y el
// pago no se reenviaba nunca). Si cada reenvío usara una operación nueva, la
// base diría «id ocupado» y saldría «no quedó anotado»: esta prueba lo ve.
await escenario('B4 la respuesta se pierde después de guardar: reintenta y NO duplica', async () => {
  const tel = await entrar('telefono');
  const { colecta, alumnos } = await aulaNueva(tel);
  tel.perderRespuestas(2, '/rest/v1/rpc/pago_crear');
  const { id } = tel.d.pagar({ colecta_id: colecta, alumno_id: alumnos[0], monto: '50', fecha: hoy });
  await tel.d.esperarCola();
  const base = pagosVivos(colecta);
  afirma(base.length === 1, `${base.length} pagos (la cola repitió)`);
  afirma(tel.d.preguntas().length === 0, 'reintentar lo propio no es una pregunta');
  afirma(tel.d.noAnotado().length === 0, 'salió «no quedó anotado»: ' + JSON.stringify(tel.d.noAnotado()));
  const local = tel.d.lista('pagos', { colecta_id: colecta });
  afirma(local.length === 1 && local[0].id === id && base[0].id === id, 'no es el mismo pago: ' + JSON.stringify({ local, base }));
  afirma(base[0].recibo && local[0].recibo === base[0].recibo, 'el aparato no tiene el recibo de la base: ' + JSON.stringify({ local, base }));
});

await escenario('B5 dos aparatos sin señal le anotan a la misma alumna: se pregunta, nunca se decide solo', async () => {
  for (const respuesta of ['son_dos', 'es_el_mismo']) {
    const tel = await entrar('telefono');
    const pc = await entrar('pc');
    const { colecta, alumnos } = await aulaNueva(tel);
    await pc.d.esperarCola();
    tel.sinSenal(); pc.sinSenal();
    tel.d.pagar({ colecta_id: colecta, alumno_id: alumnos[0], monto: '50', fecha: hoy });
    pc.d.pagar({ colecta_id: colecta, alumno_id: alumnos[0], monto: '60', fecha: hoy });
    tel.conSenal(); await tel.d.esperarCola();
    pc.conSenal(); await pc.d.esperarCola();
    const p = pc.d.preguntas();
    afirma(p.length === 1 && p[0].tipo === 'otro_pago_sin_ver' && p[0].botones.length === 2, JSON.stringify(p));
    afirma(/50\.00/.test(p[0].texto) && /60\.00/.test(p[0].texto), 'la pregunta muestra los dos montos: ' + p[0].texto);
    afirma(pagosVivos(colecta).length === 1, 'antes de responder, la base solo tiene el primero');
    await pc.d.responder(p[0].id, respuesta);
    if (respuesta === 'es_el_mismo') {
      const p2 = pc.d.preguntas();           // segunda tarjeta: ¿cuál monto?
      afirma(p2.length === 1 && p2[0].tipo === 'pago_cambiado_en_otro_aparato', JSON.stringify(p2));
      await pc.d.responder(p2[0].id, 'dejar_este');
    }
    await pc.d.esperarCola();
    const vivos = pagosVivos(colecta);
    afirma(respuesta === 'son_dos' ? vivos.length === 2 : (vivos.length === 1 && vivos[0].monto === '60.00'),
      respuesta + ': ' + JSON.stringify(vivos));
    afirma(vivos.every((v) => v.alumno_id === alumnos[0]), 'mal asignado');
  }
});

await escenario('B6 colecta cerrada en otro aparato: «¿Reabrirla?» con dos botones', async () => {
  for (const respuesta of ['reabrir', 'dejarla_cerrada']) {
    const tablet = await entrar('tablet');
    const tel = await entrar('telefono');
    const { colecta, alumnos } = await aulaNueva(tablet);
    await tel.d.esperarCola();
    tel.sinSenal();
    tel.d.pagar({ colecta_id: colecta, alumno_id: alumnos[1], monto: '50', fecha: hoy });
    await tablet.d.colecta.cerrar(colecta);
    await tablet.d.esperarCola();
    tel.conSenal(); await tel.d.esperarCola();
    const p = tel.d.preguntas();
    afirma(p.length === 1 && p[0].tipo === 'colecta_cerrada' && p[0].texto === 'Esta colecta está cerrada. ¿Reabrirla?'
      && p[0].botones.map((b) => b.valor).join() === 'reabrir,dejarla_cerrada', JSON.stringify(p));
    await tel.d.responder(p[0].id, respuesta);
    await tel.d.esperarCola();
    const estado = sql(`select estado from metas.colectas where id = '${colecta}'`);
    const vivos = pagosVivos(colecta);
    if (respuesta === 'reabrir') afirma(estado === 'abierta' && vivos.length === 1, estado + ' ' + vivos.length);
    else afirma(estado === 'cerrada' && vivos.length === 0 && tel.d.pendientes() === 0, estado + ' ' + vivos.length);
  }
});

await escenario('B7 identidad: la misma niña anotada en dos aparatos sin señal queda UNA', async () => {
  const tel = await entrar('telefono');
  const pc = await entrar('pc');
  const { aula } = await aulaNueva(tel, 0);
  await pc.d.esperarCola();
  tel.sinSenal(); pc.sinSenal();
  tel.d.crear('alumnos', { aula_id: aula, nombre_completo: 'Alumna Ficticia Repetida', identidad: '0000-2016-00077' });
  pc.d.crear('alumnos', { aula_id: aula, nombre_completo: 'Alumna F. Repetida', identidad: '0000201600077' });
  tel.conSenal(); pc.conSenal();
  await tel.d.esperarCola(); await pc.d.esperarCola();
  afirma(sql(`select count(*) from metas.alumnos where aula_id = '${aula}' and deleted_at is null`) === '1');
  // Mismo nombre SIN identidad: no se une solo, se pregunta.
  tel.sinSenal(); pc.sinSenal();
  tel.d.crear('alumnos', { aula_id: aula, nombre_completo: 'Alumno Ficticio Sin Papeles' });
  pc.d.crear('alumnos', { aula_id: aula, nombre_completo: 'Alumno Ficticio Sin Papeles' });
  tel.conSenal(); await tel.d.esperarCola();
  pc.conSenal(); await pc.d.esperarCola();
  const p = pc.d.preguntas();
  afirma(p.length === 1 && p[0].tipo === 'misma_persona' && p[0].botones.length === 2, JSON.stringify(p));
});

await escenario('B8 Realtime: la tablet ve el pago del teléfono, con el monto como texto', async () => {
  const tel = await entrar('telefono');
  const tablet = await entrar('tablet');
  const { colecta, alumnos } = await aulaNueva(tel);
  let avisos = 0;
  tablet.d.escuchar(({ tabla }) => { if (tabla === 'pagos') avisos++; });
  tel.d.pagar({ colecta_id: colecta, alumno_id: alumnos[2], monto: '150.5', fecha: hoy });
  await tel.d.esperarCola();
  const fin = Date.now() + 8000;
  let vista = [];
  while (Date.now() < fin) {
    vista = tablet.d.lista('pagos', { colecta_id: colecta });
    if (vista.length) break;
    await new Promise((r) => setTimeout(r, 200));
  }
  afirma(avisos > 0 && vista.length === 1 && vista[0].monto === '150.50', JSON.stringify({ avisos, vista }));
  const mal = dineroComoTexto(tablet.d.lista('pagos')) || dineroComoTexto(tablet.d.lista('v_colectas_resumen'));
  afirma(!mal, 'dinero que no es texto: ' + mal);
});

await escenario('B9 una cola por cuenta: lo de A no se manda con la sesión de otra cuenta', async () => {
  const ap = await entrar('compartido');
  const { colecta, alumnos } = await aulaNueva(ap);
  ap.sinSenal();
  ap.d.pagar({ colecta_id: colecta, alumno_id: alumnos[0], monto: '20', fecha: hoy });
  await ap.d.salir();                                       // sin señal: se conserva para A
  ap.conSenal();
  const r = await ap.d.entrar('b@ejemplo.invalid', 'clave-b');
  afirma(r.ok, JSON.stringify(r));
  await ap.d.esperarCola();
  afirma(pagosVivos(colecta).length === 0, 'se mandó lo de A con la sesión de B');
  await ap.d.salir();
  await ap.d.entrar(A.correo, A.clave);
  await ap.d.esperarCola();
  afirma(pagosVivos(colecta).length === 1, 'al volver A, su pago se envió');
});

await escenario('B10 al reconectar trae también lo borrado en otro aparato', async () => {
  const tel = await entrar('telefono');
  const tablet = await entrar('tablet');
  const { aula } = await aulaNueva(tel, 0);
  const control = tel.d.crear('controles', { aula_id: aula, nombre: 'Tarea ficticia', tipo: 'marca', fecha: hoy }).id;
  await tel.d.esperarCola();
  await new Promise((r) => setTimeout(r, 1500));
  afirma(tablet.d.lista('controles', { aula_id: aula }).length === 1, 'la tablet no lo vio');
  tablet.sinSenal();
  tel.d.borrar('controles', control);
  await tel.d.esperarCola();
  tablet.conSenal();
  await tablet.d.esperarCola();
  await new Promise((r) => setTimeout(r, 1500));
  afirma(tablet.d.lista('controles', { aula_id: aula }).length === 0, 'la tablet sigue mostrando lo borrado');
});

// Rev. 9 (H1): una sola cola por aparato aunque haya varias pestañas.
// Antes, cada pestaña numeraba su cola desde su propio contador y las dos
// escribían «la operación 1» en el mismo IndexedDB: una pisaba a la otra.
// El aula la arma OTRO aparato, para que las dos pestañas empiecen su cola
// desde cero, como un docente que abre Mi aula dos veces sin señal.
await escenario('B11 dos pestañas sin señal anotan a la vez y se cierran: ningún pago perdido ni pisado', async () => {
  const pc = await entrar('pc');
  const { colecta, alumnos } = await aulaNueva(pc);
  const compu = dispositivo('compu');
  const p1 = await compu.abrir();
  const r = await p1.d.entrar(A.correo, A.clave);
  afirma(r.ok, JSON.stringify(r));
  const p2 = await compu.abrir();
  await p1.d.esperarCola();
  p1.sinSenal();
  const anotados = [];
  for (let i = 0; i < 3; i++) {
    anotados.push(['10.00', p1.d.pagar({ colecta_id: colecta, alumno_id: alumnos[0], monto: '10', fecha: hoy }).id]);
    anotados.push(['20.00', p2.d.pagar({ colecta_id: colecta, alumno_id: alumnos[1], monto: '20', fecha: hoy }).id]);
  }
  afirma(p2.d.lista('pagos', { colecta_id: colecta, alumno_id: alumnos[1] }).length === 3, 'la pestaña no ve lo que anotó');
  await new Promise((ok) => setTimeout(ok, 300));
  p1.cerrar();
  p2.cerrar();
  const p3 = await compu.abrir();
  p3.conSenal();
  await p3.d.esperarCola();
  const vivos = pagosVivos(colecta);
  afirma(vivos.length === 6, `${vivos.length} pagos en la base, no 6: ${JSON.stringify(vivos.map((v) => v.monto))}`);
  for (const [monto, id] of anotados) {
    afirma(vivos.some((v) => v.id === id && v.monto === monto), `el pago ${id} de L ${monto} se perdió o cambió`);
  }
  afirma(p3.d.preguntas().length === 0 && p3.d.noAnotado().length === 0,
    JSON.stringify({ preguntas: p3.d.preguntas(), noAnotado: p3.d.noAnotado() }));
});

// Rev. 9: calculos.js da lo mismo que las vistas de la base, alumno por
// alumno y colecta por colecta. Y mientras el docente aclara un monto
// sugerido ambiguo («1,500»), el aparato NO inventa: lo que depende de ese
// monto queda sin dato (no «0.00» ni «no le corresponde»).
await escenario('B12 los totales del aparato son los de la base (calculos.js = vistas), también con un monto por aclarar', async () => {
  const tel = await entrar('telefono');
  const { aula, alumnos, colecta } = await aulaNueva(tel, 5);
  const [a1, a2, a3, a4, a5] = alumnos;
  tel.d.exencion.poner({ colecta_id: colecta, alumno_id: a2, monto_aplicable: '25', motivo: 'beca' });
  tel.d.exencion.poner({ colecta_id: colecta, alumno_id: a3 });
  tel.d.editar('alumnos', a4, { estado: 'retirado' });
  tel.d.pagar({ colecta_id: colecta, alumno_id: a1, monto: '20', fecha: hoy });
  tel.d.pagar({ colecta_id: colecta, alumno_id: a1, monto: '30.5', fecha: hoy });
  tel.d.pagar({ colecta_id: colecta, alumno_id: a2, monto: '10', fecha: hoy });
  tel.d.pagar({ colecta_id: colecta, alumno_id: a4, monto: '15', fecha: hoy });
  tel.d.pagar({ colecta_id: colecta, alumno_id: a5, monto: '75', fecha: hoy });
  const dudosa = tel.d.colecta.crear({ aula_id: aula, concepto: 'Uniformes (ficticio)', monto_sugerido: '1,500', fecha: hoy }).id;
  await tel.d.esperarCola();

  const pendiente = tel.d.lista('v_colectas_resumen', { colecta_id: dudosa })[0];
  afirma(pendiente && pendiente.monto_sugerido === null && pendiente.meta === null && pendiente.falta_total === null,
    'con el monto por aclarar se inventó un total: ' + JSON.stringify(pendiente));
  const filasDudosa = tel.d.lista('v_colecta_alumnos', { colecta_id: dudosa });
  afirma(filasDudosa.length === 5 && filasDudosa.every((x) => (x.alumno_id === a4
    ? x.situacion === 'ya_no_esta' && x.aplicable === '0.00'        // retirada: eso sí se sabe
    : x.aplicable === null && x.falta === null && x.situacion === 'por_aclarar')),
    'con el monto por aclarar dice «no le corresponde» o «0.00»: ' + JSON.stringify(filasDudosa.slice(0, 2)));
  const p = tel.d.preguntas();
  afirma(p.length === 1 && p[0].tipo === 'monto_ambiguo', JSON.stringify(p));
  await tel.d.responder(p[0].id, '1500.00');
  await tel.d.esperarCola();

  const DINERO_A = ['monto_aplicable', 'aplicable', 'pagado', 'falta', 'pago_de_mas'];
  const DINERO_R = ['monto_sugerido', 'meta', 'recaudado', 'falta_total', 'pago_de_mas_total', 'gastado', 'saldo'];
  const texto = (lista) => lista.map((k) => `metas.monto_texto(${k}) as ${k}`).join(', ');
  for (const c of [colecta, dudosa]) {
    const base = sqlJson(`select alumno_id, exento, pagos, situacion, ${texto(DINERO_A)}
                            from metas._calc_colecta_alumnos where colecta_id = '${c}'`);
    const local = tel.d.lista('v_colecta_alumnos', { colecta_id: c });
    afirma(base.length === local.length && base.length === 5, `${base.length} en la base, ${local.length} aquí`);
    for (const b of base) {
      const l = local.find((x) => x.alumno_id === b.alumno_id);
      const k = ['exento', 'pagos', 'situacion', ...DINERO_A].find((x) => String(l && l[x]) !== String(b[x]));
      afirma(!k, `alumno ${b.alumno_id}, ${k}: base ${b[k]}, aparato ${l && l[k]}`);
    }
    const rb = sqlJson(`select esperados, pagaron, ${texto(DINERO_R)} from metas._calc_colectas_resumen where colecta_id = '${c}'`)[0];
    const rl = tel.d.lista('v_colectas_resumen', { colecta_id: c })[0];
    const k = ['esperados', 'pagaron', ...DINERO_R].find((x) => String(rl[x]) !== String(rb[x]));
    afirma(!k, `resumen ${k}: base ${rb[k]}, aparato ${rl[k]}`);
    afirma(!dineroComoTexto(local) && !dineroComoTexto([rl]), 'dinero que no es texto');
  }
});

// ── Rev. 11: importar desde un archivo (04-FORMATO-IMPORTACION.md) ────────
// El ejemplo publicado, con una sección distinta en cada corrida. Se importa,
// se vuelve a importar en el mismo aparato y otra vez en un aparato SIN
// SEÑAL que todavía no sabe nada: nada se duplica, y el total de la colecta
// es la suma de sus pagos.
await escenario('B13 importar: vista previa, guardar, reimportar sin duplicar (aquí y en otro aparato sin señal) y totales = suma de los pagos', async () => {
  const fs = await import('node:fs');
  const ejemplo = JSON.parse(fs.readFileSync(new URL('../ejemplo-importacion.json', import.meta.url), 'utf8'));
  const corrida = (Number(process.hrtime.bigint() % 1679616n)).toString(36).toUpperCase();
  ejemplo.aula.escuela = 'Escuela Ficticia Importación ' + corrida;
  // El recibo anterior no se repite entre los pagos de la docente.
  const recibo = 'RC-' + corrida.padStart(4, '0') + '-01';
  ejemplo.pagos[0].recibo_anterior = recibo;
  // Una clave vieja de la docente que ninguna familia usa todavía: como si
  // estuviera en su copia del paso 1 (metas.claves_archivo).
  const claveVieja = '7' + corrida.padStart(4, '0');
  sql(`insert into metas.claves_archivo (docente_codigo, clave, nombre_alumno, origen)
       values ('PROF-AAAA000001', '${claveVieja}', null, 'METAS_CODIGOS_V1') on conflict do nothing`);
  ejemplo.alumnos[0].clave_familia = '7-' + corrida.padStart(4, '0');
  const texto = JSON.stringify(ejemplo);
  // Las claves viejas todavía no vencen (antes del paso 4): solo así se conservan.
  const hitoAntes = sql(`select at from metas.hitos where nombre = 'claves_viejas_vencen'`);
  sql(`delete from metas.hitos where nombre = 'claves_viejas_vencen'`);
  try {
    const tel = await entrar('importa-telefono');
    const I = tel.MetasDatos.importar;
    afirma(!I.leer('{"formato":"metas-importacion/2"}').ok, 'aceptó otra versión');
    afirma(!I.leer('no es json').ok, 'aceptó algo que no es JSON');
    const leido = I.leer(texto);
    afirma(leido.ok, leido.frase);
    const filasClaves = await tel.MetasDatos._nube.leer('claves_archivo?select=clave,nombre_alumno');
    const claves = new Map(filasClaves.map((x) => [x.clave, x.nombre_alumno]));
    const bienes = [];
    const inventario = { leer: () => bienes.slice(), guardar: (arr) => { bienes.length = 0; bienes.push(...arr); } };

    // Vista previa sin decisiones: lo que el docente ve antes de guardar.
    let plan = await I.preparar(tel.d, leido.archivo, { claves, inventario });
    const al = Object.fromEntries(plan.alumnos.map((x) => [x.ref, x]));
    afirma(plan.aula.estado === 'nuevo', 'aula: ' + plan.aula.estado);
    afirma(al.a1.estado === 'nuevo' && al.a3.estado === 'nuevo' && al.a4.estado === 'nuevo', 'alumnos: ' + plan.alumnos.map((x) => x.estado));
    afirma(al.a2.estado === 'error' && al.a2.revisar && /letra/.test(al.a2.errores[0]), 'la identidad con una O: ' + JSON.stringify(al.a2));
    afirma(al.a3.avisos.includes('Falta identidad'), 'a3 sin «falta identidad»');
    const fam = Object.fromEntries(plan.familias.map((x) => [x.ref, x]));
    afirma(fam.a1.campos.clave === claveVieja, 'a1 no conserva su clave vieja: ' + JSON.stringify(fam.a1));
    afirma(fam.a3.tiraNueva && !fam.a3.campos.clave, 'a3 (clave que no estaba) no recibe una nueva');
    const n7O = plan.notas.find((x) => x.ref === 'a2');
    afirma(n7O.estado === 'error' && n7O.revisar, 'la nota 7O: ' + JSON.stringify(n7O));
    afirma(plan.notas.find((x) => x.ref === 'a4').avisos.includes('El SACE usa números enteros'), 'la nota 85,5 sin aviso');
    const col = plan.colectas[0];
    afirma(col.retenida && col.diferencia === '50.00' && col.suma === '100.00', 'el control contra el papel: ' + JSON.stringify(col));
    afirma(plan.pagos.every((x) => x.estado !== 'nuevo'), 'los pagos de una colecta con diferencia no esperan');
    afirma(plan.gastosDocente[1].pregunta && /1,500.00/.test(plan.gastosDocente[1].pregunta.texto), 'el «1,500» no se pregunta');

    // El docente responde: guarda con la diferencia y el monto es L 1,500.00.
    const decisiones = { 'diferencia:c1': 'con_diferencia', 'gastodoc:1': '1500.00' };
    plan = await I.preparar(tel.d, leido.archivo, { claves, inventario, decisiones });
    afirma(plan.resumen.preguntas === 0 && plan.pagos.filter((x) => x.estado === 'nuevo').length === 3,
      'después de responder: ' + JSON.stringify(plan.resumen));
    const r = await I.guardar(tel.d, plan, { inventario });
    await tel.d.esperarCola();
    afirma(!tel.d.noAnotado().length, 'quedó algo sin anotar: ' + JSON.stringify(tel.d.noAnotado()));
    const aula = r.aula;
    const MIOS = `owner = '00000000-0000-0000-0000-00000000000a' and deleted_at is null
                  and concepto in ('Copias de la guía de lectura', 'Pintura para el aula')`;
    const contar = () => sqlJson(`select
        (select count(*) from metas.aulas where id = '${aula}' and deleted_at is null) as aulas,
        (select count(*) from metas.alumnos where aula_id = '${aula}' and deleted_at is null) as alumnos,
        (select count(*) from metas.familias where aula_id = '${aula}' and deleted_at is null) as familias,
        (select count(*) from metas.asignaturas where aula_id = '${aula}' and deleted_at is null) as asignaturas,
        (select count(*) from metas.notas where aula_id = '${aula}' and deleted_at is null) as notas,
        (select count(*) from metas.colectas where aula_id = '${aula}' and deleted_at is null) as colectas,
        (select count(*) from metas.colecta_exenciones e join metas.colectas c on c.id = e.colecta_id
          where c.aula_id = '${aula}' and e.deleted_at is null) as exenciones,
        (select count(*) from metas.pagos where aula_id = '${aula}' and deleted_at is null) as pagos,
        (select count(*) from metas.gastos g join metas.colectas c on c.id = g.colecta_id
          where c.aula_id = '${aula}' and g.deleted_at is null) as gastos,
        -- Los gastos de su bolsillo son del docente, no del aula: el mismo
        -- gasto en otro archivo es el mismo gasto.
        (select count(*) from metas.gastos_docente where ${MIOS}) as gastos_docente,
        (select count(*) from metas.reembolsos r join metas.gastos_docente g on g.id = r.gasto_id
          where ${MIOS.replace(/concepto|owner|deleted_at/g, 'g.$&')} and r.deleted_at is null) as reembolsos`)[0];
    const esperado = { aulas: 1, alumnos: 3, familias: 2, asignaturas: 4, notas: 4, colectas: 1, exenciones: 1, pagos: 3, gastos: 1,
      gastos_docente: 2, reembolsos: 1 };
    let antes = contar();
    afirma(JSON.stringify(antes) === JSON.stringify(esperado), 'en la base: ' + JSON.stringify(antes));
    const f1 = sqlJson(`select clave, clave_origen, telefono from metas.familias f join metas.alumnos a on a.id = f.alumno_id
                         where a.aula_id = '${aula}' and a.nombre_completo = 'Alumna Ficticia Uno Prueba'`)[0];
    afirma(f1 && f1.clave === claveVieja && f1.clave_origen === 'conservada', 'la clave vieja no se conservó: ' + JSON.stringify(f1));
    afirma(sql(`select recibo_anterior from metas.pagos where aula_id = '${aula}' and recibo_anterior is not null`) === recibo,
      'el recibo anterior no quedó al lado');
    afirma(sql(`select string_agg(distinct monto::text, ',') from metas.gastos_docente where ${MIOS} and concepto = 'Pintura para el aula'`) === '1500.00',
      'el monto aclarado no es L 1,500.00');
    afirma(bienes.length === 2, 'inventario: ' + bienes.length);
    // Totales: lo recaudado (base y aparato) es la suma de los pagos.
    const totalBase = sql(`select metas.monto_texto(recaudado) from metas._calc_colectas_resumen c
                            join metas.colectas k on k.id = c.colecta_id where k.aula_id = '${aula}'`);
    const sumaPagos = sql(`select sum(monto)::text from metas.pagos where aula_id = '${aula}' and deleted_at is null`);
    const totalAqui = tel.d.lista('v_colectas_resumen', { colecta_id: col.id })[0].recaudado;
    afirma(totalBase === '100.00' && sumaPagos === '100.00' && totalAqui === '100.00',
      `recaudado en la base ${totalBase}, suma de pagos ${sumaPagos}, en el aparato ${totalAqui}`);

    // Reimportar el mismo archivo en el mismo aparato: todo «ya estaba».
    const otra = await I.preparar(tel.d, I.leer(texto).archivo, { claves, inventario, decisiones });
    afirma(otra.resumen.nuevos === 0, 'al reimportar hay «nuevos»: ' + JSON.stringify(otra.resumen));
    afirma((await I.guardar(tel.d, otra, { inventario })).guardados === 0, 'reimportar guardó algo');
    await tel.d.esperarCola();
    afirma(JSON.stringify(contar()) === JSON.stringify(esperado) && bienes.length === 2, 'reimportar duplicó: ' + JSON.stringify(contar()));

    // Otro aparato SIN SEÑAL importa el mismo archivo antes de saber nada:
    // manda las mismas operaciones, y la base las reconoce como hechas.
    const pc = await entrar('importa-pc');
    pc.sinSenal();
    const bienesPc = [];
    const invPc = { leer: () => bienesPc.slice(), guardar: (arr) => { bienesPc.length = 0; bienesPc.push(...arr); } };
    const planPc = await pc.MetasDatos.importar.preparar(pc.d, pc.MetasDatos.importar.leer(texto).archivo,
      { claves, inventario: invPc, decisiones });
    await pc.MetasDatos.importar.guardar(pc.d, planPc, { inventario: invPc });
    pc.conSenal();
    await pc.d.esperarCola();
    afirma(!pc.d.noAnotado().length && !pc.d.preguntas().length,
      'el otro aparato quedó con algo: ' + JSON.stringify([pc.d.noAnotado(), pc.d.preguntas()]));
    afirma(JSON.stringify(contar()) === JSON.stringify(esperado), 'el otro aparato duplicó: ' + JSON.stringify(contar()));
    afirma(sql(`select metas.monto_texto(recaudado) from metas._calc_colectas_resumen c join metas.colectas k on k.id = c.colecta_id
                where k.aula_id = '${aula}'`) === '100.00', 'el total cambió');
  } finally {
    if (hitoAntes) sql(`insert into metas.hitos (nombre, at) values ('claves_viejas_vencen', '${hitoAntes}')
                        on conflict (nombre) do update set at = excluded.at`);
  }
});

// ── Preparar las claves de familia (js/datos/claves-familia.js) ───────────
// Un aula traída sin familias: el botón le crea la ficha a cada alumno activo
// que no la tiene, siempre con una clave NUEVA que pone la base (no se
// conservan claves viejas, aunque estén en metas.claves_archivo con su
// nombre). Quien ya tiene ficha no se toca; tocar dos veces, o desde otro
// aparato sin señal, no duplica; la otra aula no se toca. Datos ficticios.
await escenario('B14 claves de familia: todas nuevas, sin preguntas, la segunda vez no duplica y la otra aula no se toca', async () => {
  const corrida = (Number(process.hrtime.bigint() % 1679616n)).toString(36).toUpperCase().padStart(4, '0');
  const nombre = (n) => `${n} Ficticia ${corrida}`;
  // Una clave vieja con el nombre y el número de Ana: aun así recibe una nueva.
  const vieja = '71' + corrida;
  sql(`insert into metas.claves_archivo (docente_codigo, clave, nombre_alumno, origen)
       values ('PROF-AAAA000001', '${vieja}', '${nombre('Ana')}', 'METAS_ADMIN_V1') on conflict do nothing`);
  // Antes del paso 4 la base SÍ conservaría una clave pedida: así se ve que
  // el botón no la pide.
  const hitoAntes = sql(`select at from metas.hitos where nombre = 'claves_viejas_vencen'`);
  sql(`delete from metas.hitos where nombre = 'claves_viejas_vencen'`);
  try {
    const tel = await entrar('claves-telefono');
    const C = tel.MetasDatos.clavesFamilia;
    afirma(C.bonita('15k7qm') === '15-K7QM' && C.bonita('K7QMX4PA2B') === 'K7QMX-4PA2B',
      'bonita: ' + [C.bonita('15k7qm'), C.bonita('K7QMX4PA2B')]);
    // Sin las fichas de la base (sin señal) no se arma nada.
    let sinSenal = null;
    try { await C.preparar(tel.d, 'x', {}); } catch (e) { sinSenal = e; }
    afirma(sinSenal && sinSenal.paraElDocente, 'sin señal se armó una vista previa');

    const seccion = (Number(process.hrtime.bigint() % 46656n)).toString(36);
    const aula = tel.d.crear('aulas', { escuela: 'Escuela Ficticia Claves ' + corrida, grado: 4, seccion,
      anio_lectivo: 2027, docente_nombre: 'Docente Ficticia A' }).id;
    const otra = tel.d.crear('aulas', { escuela: 'Escuela Ficticia Claves Otra ' + corrida, grado: 4, seccion,
      anio_lectivo: 2027, docente_nombre: 'Docente Ficticia A' }).id;
    const al = {};
    [[71, 'Ana'], [72, 'Bruno'], [73, 'Carla'], [74, 'Dina'], [75, 'Eva'], [76, 'Hugo']]
      .forEach(([n, x]) => { al[x] = tel.d.crear('alumnos', { aula_id: aula, nombre_completo: nombre(x), num_lista: n }).id; });
    // En la otra aula, Otto sin ficha (no se toca); Hugo ya tiene ficha; Eva se retiró.
    tel.d.crear('alumnos', { aula_id: otra, nombre_completo: nombre('Otto'), num_lista: 1 });
    tel.d.crear('familias', { aula_id: aula, alumno_id: al.Hugo });
    await tel.d.esperarCola();
    tel.d.editar('alumnos', al.Eva, { estado: 'retirado', estado_fecha: hoy });
    await tel.d.esperarCola();
    afirma(!tel.d.noAnotado().length, 'quedó algo sin anotar al armar: ' + JSON.stringify(tel.d.noAnotado()));

    const familias = async (ap) => ap.MetasDatos._nube.leer('familias?select=id,alumno_id&deleted_at=is.null');
    const plan = await C.preparar(tel.d, aula, { familias: await familias(tel) });
    const f = Object.fromEntries(plan.filas.map((x) => [x.alumno_id, x]));
    afirma(['Ana', 'Bruno', 'Carla', 'Dina'].every((x) => f[al[x]].estado === 'nuevo') && f[al.Hugo].estado === 'ya_estaba'
      && f[al.Eva].estado === 'fuera', 'estados: ' + JSON.stringify(plan.filas));
    afirma(plan.resumen.nuevos === 4 && plan.resumen.ya === 1, 'resumen: ' + JSON.stringify(plan.resumen));
    afirma(!plan.preguntas && plan.filas.every((x) => !x.clave && !x.pregunta), 'el plan trae claves viejas o preguntas');

    afirma((await C.guardar(tel.d, plan)).guardados === 4, 'no guardó 4');
    afirma((await C.guardar(tel.d, plan)).guardados === 0, 'el segundo toque anotó otra vez');
    await tel.d.esperarCola();
    afirma(!tel.d.noAnotado().length, 'quedó algo sin anotar: ' + JSON.stringify(tel.d.noAnotado()));
    const enBase = () => Object.fromEntries(sqlJson(`select a.nombre_completo as n, f.clave, f.clave_origen, f.clave_siguiente
        from metas.familias f join metas.alumnos a on a.id = f.alumno_id where f.aula_id = '${aula}' and f.deleted_at is null`)
      .map((x) => [x.n.split(' ')[0], x]));
    const fb = enBase();
    afirma(Object.keys(fb).sort().join() === 'Ana,Bruno,Carla,Dina,Hugo', 'fichas en la base: ' + Object.keys(fb));
    afirma(Object.values(fb).every((x) => x.clave_origen === 'nueva' && /^[A-HJ-NP-Z2-9]{10}$/.test(x.clave)),
      'no todas son nuevas de la base: ' + JSON.stringify(fb));
    afirma(fb.Ana.clave !== vieja, 'Ana conservó su clave vieja');
    // No es familias_preparar_claves_nuevas: ninguna tira siguiente.
    afirma(Object.values(fb).every((x) => x.clave_siguiente === null), 'se preparó una clave siguiente');
    // El talonario lee la clave de la fila del aparato (mi-aula-papel.js).
    afirma(tel.d.lista('familias', { aula_id: aula }).filter((x) => x.clave).length === 5, 'el aparato no ve las 5 claves');

    // Tocar el botón otra vez: nada nuevo.
    const otraVez = await C.preparar(tel.d, aula, { familias: await familias(tel) });
    afirma(otraVez.resumen.nuevos === 0 && otraVez.resumen.ya === 5, 'otra vez: ' + JSON.stringify(otraVez.resumen));

    // Otro aparato sin señal anota el mismo plan: al volver, la base lo
    // reconoce (mismos ids y operaciones) y no hay una ficha de más.
    const pc = await entrar('claves-pc');
    pc.sinSenal();
    await pc.MetasDatos.clavesFamilia.guardar(pc.d, JSON.parse(JSON.stringify(plan)));
    pc.conSenal();
    await pc.d.esperarCola();
    afirma(!pc.d.noAnotado().length && !pc.d.preguntas().length,
      'el otro aparato quedó con algo: ' + JSON.stringify([pc.d.noAnotado(), pc.d.preguntas()]));
    afirma(sql(`select count(*) from metas.familias where aula_id = '${aula}' and deleted_at is null`) === '5', 'el otro aparato duplicó');
    afirma(sql(`select count(*) from metas.familias where aula_id = '${otra}' and deleted_at is null`) === '0', 'se tocó la otra aula');
    afirma(sql(`select count(*) from metas.familias where clave = '${vieja}' and deleted_at is null`) === '0', 'la clave vieja se usó');
  } finally {
    if (hitoAntes) sql(`insert into metas.hitos (nombre, at) values ('claves_viejas_vencen', '${hitoAntes}')
                        on conflict (nombre) do update set at = excluded.at`);
  }
});

process.exit(resultado());
