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
  afirma, aparato, contadores, dineroComoTexto, escenario, faltantes, horaServidor, resultado, sql, sqlJson,
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

await escenario('B4 la respuesta se pierde después de guardar: reintenta y NO duplica', async () => {
  const tel = await entrar('telefono');
  const { colecta, alumnos } = await aulaNueva(tel);
  tel.perderRespuestas(2);
  tel.d.pagar({ colecta_id: colecta, alumno_id: alumnos[0], monto: '50', fecha: hoy });
  await tel.d.esperarCola();
  const base = pagosVivos(colecta);
  afirma(base.length === 1, `${base.length} pagos (la cola repitió)`);
  afirma(tel.d.preguntas().length === 0, 'reintentar lo propio no es una pregunta');
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

process.exit(resultado());
