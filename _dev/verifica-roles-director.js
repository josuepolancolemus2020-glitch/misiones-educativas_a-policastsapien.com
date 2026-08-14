/* ═══════════════════════════════════════════════════════════════
   🏫 LA DIRECCIÓN VE LA GESTIÓN DEL MAESTRO, ¿Y SOLO LO QUE DEBE?

   Roles v2: el director y la asistencia ven los grupos y las listas
   de los docentes de su escuela; el rector verifica los conteos de
   todas; y los casos delegables (las convocatorias) se abren SOLO
   con el permiso que el maestro concede — y cierra — cuando quiere.

   Lo que esta sonda vigila es exactamente lo que costaría caro:

   · QUE EL GRUPO SE LEA «6º-1». La regla vive en adGradoSeccion y
     toda pantalla nueva pasa por ahí; un «6 1» en el panel del
     director es la normativa rota el primer día.

   · QUE ASISTENCIA = DIRECTOR. El rol nuevo existe para apoyar a la
     Dirección con sus mismos permisos; si ve menos, no sirve, y si
     viera más, sería un agujero.

   · QUE EL RECTOR VERIFIQUE SIN NOMBRES DE NIÑOS. Su tarjeta trae
     grupos y matrícula de todas las escuelas, pero NO el botón de
     ver la lista ni el de pedir permisos: verifica, no administra.

   · QUE EL PERMISO SEA DEL MAESTRO. La Dirección lo pide; el maestro
     lo ve al abrir sus Ajustes SIN tocar nada (un pedido que no se ve
     es un pedido que espera para siempre), lo concede o lo niega, y
     lo revoca después. Cada paso manda al servidor lo que es.

   · QUE EL PIN NO VIAJE NUNCA. El manejo delegado de una convocatoria
     funciona porque el servidor comprueba el permiso y responde él
     mismo; si el cliente mandara un PIN, revocar sería mentira.

   · QUE LA NUBE VIEJA NO MATE LA TARJETA. Si el SQL de roles v2 aún
     no se corrió en Supabase (404), el director tiene que seguir
     viendo la lista de siempre, no una pantalla muerta.

   La nube NO se toca: se pone un Supabase de mentira con page.route,
   así corre sin internet y sin ensuciar datos reales.

   Uso:
     node _dev/servidor-estatico.js            (en otra terminal)
     node _dev/verifica-roles-director.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const { chromium } = require('playwright');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';

let fallos = 0;
const ok = m => console.log('  ✅ ' + m);
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const comprueba = (cond, m) => (cond ? ok(m) : mal(m));

/* ── Las cuentas del ensayo (una escuela de verdad como escenario) ── */
const ESCUELA = 'Escuela John Arnold Cook';
const CUENTAS = {
  'dir@ensayo.hn':  { codigo: 'PROF-DIR0000001', nombre: 'Marta Ondina Reyes', rol: 'director',   escuela: ESCUELA },
  'asis@ensayo.hn': { codigo: 'PROF-ASI0000001', nombre: 'Julia Rodas Nunez',  rol: 'asistencia', escuela: ESCUELA },
  'rec@ensayo.hn':  { codigo: 'PROF-REC0000001', nombre: 'Pedro Molina Casco', rol: 'rector',     escuela: 'Distrital' },
  'doc@ensayo.hn':  { codigo: 'PROF-DOC0000001', nombre: 'Carlos Zelaya Puerto', rol: 'docente',  escuela: ESCUELA },
};

/* Lo que el servidor de verdad armaría desde el espejo del aula */
const GRUPOS_DOC = [
  { id: 'GAAAAA', grado: '6', seccion: '1', escuela: ESCUELA, matricula: 2, ninas: 1, varones: 1 },
];
const ALUMNOS_G = [
  { num: '1', nombre: 'Ana Diaz Fuentes', sexo: 'F' },
  { num: '2', nombre: 'Luis Perez Mejia', sexo: 'M' },
];
const CONVS = [{
  codigo: 'R4TP', titulo: 'Excursión al río', fecha: '2026-08-22', lugar: 'El Cajón',
  aporte: 'L 250', cerrada: false, familias: 2, personas: 5, actualizada: '2026-08-13T10:00:00Z',
}];
const RESPUESTAS = [
  { va: true,  alumno: 'Ana Diaz Fuentes', grado: '6', seccion: '1', personas: 3, tel: '99998888', nota: '', actualizado: '2026-08-13T10:00:00Z' },
  { va: true,  alumno: 'Rosa Lopez Andino', grado: '5', seccion: '2', personas: 2, tel: '88887777', nota: 'llegamos tarde', actualizado: '2026-08-13T09:00:00Z' },
  { va: false, alumno: 'Ivan Castro Ruiz', grado: '6', seccion: '1', personas: 0, tel: '', nota: '', actualizado: '2026-08-12T08:00:00Z' },
];

/* ── El Supabase de mentira ──
   `estado.permisos` es la tabla docente_permisos del ensayo; las
   llamadas quedan guardadas para poder revisarlas después. */
function nube(estado) {
  return async route => {
    const url = route.request().url();
    const responde = cuerpo => route.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(cuerpo) });
    if (!url.includes('/rest/v1/rpc/')) return responde({});
    const fn = url.split('/rpc/')[1].split('?')[0];
    let b = {};
    try { b = JSON.parse(route.request().postData() || '{}'); } catch (_) {}
    estado.llamadas.push({ fn, b });

    const porCodigo = cod => Object.values(CUENTAS).find(c => c.codigo === cod);

    if (fn === 'metas_entrar_docente_v2') {
      const c = CUENTAS[String(b.p_correo || '').toLowerCase()];
      return responde(c ? { ok: true, codigo: c.codigo, nombre: c.nombre, correo: b.p_correo, rol: c.rol }
                        : { ok: false, motivo: 'datos' });
    }
    if (fn === 'metas_perfil_leer') {
      const c = porCodigo(b.p_codigo);
      const mail = Object.keys(CUENTAS).find(k => CUENTAS[k].codigo === b.p_codigo) || '';
      return responde(c ? { ok: true, nombre: c.nombre, correo: mail, escuela: c.escuela, tipo: '',
        telefono: '', departamento: '', municipio: '', lugar: '', rol: c.rol, creado_en: '2026-01-01' } : { ok: false });
    }
    if (fn === 'metas_rol_grupos') {
      if (estado.sinV2) return route.fulfill({ status: 404, contentType: 'application/json', body: '{}' });
      const c = porCodigo(b.p_codigo);
      if (!c) return responde({ ok: false, motivo: 'clave' });
      const esDir = c.rol === 'director' || c.rol === 'asistencia';
      if (!esDir && c.rol !== 'rector') return responde({ ok: false, motivo: 'rol' });
      const doc = CUENTAS['doc@ensayo.hn'];
      const filaDoc = {
        nombre: doc.nombre, escuela: doc.escuela, municipio: 'El Progreso', rol: 'docente',
        creado: '2026-02-01', movido: '2026-08-13T12:00:00Z', grupos: GRUPOS_DOC,
        permisos: esDir ? (estado.permisos[c.codigo] || {}) : {},
      };
      const filas = [filaDoc];
      if (c.rol === 'rector') filas.push({
        nombre: 'Nina Suyapa Ortez', escuela: 'Escuela Lempira', municipio: 'Tela', rol: 'docente',
        creado: '2026-03-01', movido: null, grupos: [{ id: 'GBBBBB', grado: '3', seccion: '2', escuela: 'Escuela Lempira', matricula: 40, ninas: 21, varones: 19 }], permisos: {},
      });
      return responde({ ok: true, rol: c.rol, docentes: filas });
    }
    if (fn === 'metas_rol_listar') {
      const c = porCodigo(b.p_codigo);
      return responde({ ok: true, rol: c ? c.rol : 'docente', docentes: [
        { nombre: CUENTAS['doc@ensayo.hn'].nombre, escuela: ESCUELA, municipio: 'El Progreso', rol: 'docente', creado: '2026-02-01' }] });
    }
    if (fn === 'metas_rol_alumnos') {
      const c = porCodigo(b.p_codigo);
      if (!c || (c.rol !== 'director' && c.rol !== 'asistencia')) return responde({ ok: false, motivo: 'rol' });
      return responde({ ok: true, grado: '6', seccion: '1', escuela: ESCUELA, alumnos: ALUMNOS_G });
    }
    if (fn === 'metas_permiso_pedir') {
      const c = porCodigo(b.p_codigo);
      (estado.permisos[c.codigo] = estado.permisos[c.codigo] || {})[b.p_permiso] = 'pedido';
      estado.filaPermiso = { id: 71, direccion: c.codigo, permiso: b.p_permiso, estado: 'pedido', nombre: c.nombre, rol: c.rol };
      return responde({ ok: true, estado: 'pedido' });
    }
    if (fn === 'metas_permiso_dar') {
      const dir = Object.values(CUENTAS).find(c => c.nombre === b.p_nombre_direccion);
      if (dir) (estado.permisos[dir.codigo] = estado.permisos[dir.codigo] || {})[b.p_permiso] = 'concedido';
      return responde({ ok: true, estado: 'concedido' });
    }
    if (fn === 'metas_permiso_responder') {
      if (estado.filaPermiso && Number(b.p_id) === estado.filaPermiso.id) {
        estado.filaPermiso.estado = b.p_estado;
        estado.permisos[estado.filaPermiso.direccion][estado.filaPermiso.permiso] = b.p_estado;
        return responde({ ok: true, estado: b.p_estado });
      }
      return responde({ ok: false, motivo: 'no_existe' });
    }
    if (fn === 'metas_permisos_listar') {
      const f = estado.filaPermiso;
      return responde({ ok: true, rol: 'docente',
        mios: f ? [{ id: f.id, permiso: f.permiso, estado: f.estado, pedido_por: 'direccion',
                     nombre: f.nombre, rol: f.rol, actualizado: '2026-08-13' }] : [],
        pedidos: [],
        direccion: [
          { nombre: CUENTAS['dir@ensayo.hn'].nombre, rol: 'director' },
          { nombre: CUENTAS['asis@ensayo.hn'].nombre, rol: 'asistencia' },
        ] });
    }
    if (fn === 'metas_rol_conv_listar') {
      const c = porCodigo(b.p_codigo);
      const est = (estado.permisos[c.codigo] || {}).convocatorias;
      if (est !== 'concedido') return responde({ ok: false, motivo: 'permiso' });
      return responde({ ok: true, convocatorias: CONVS });
    }
    if (fn === 'metas_rol_conv_respuestas') {
      const c = porCodigo(b.p_codigo);
      const est = (estado.permisos[c.codigo] || {}).convocatorias;
      if (est !== 'concedido') return responde({ ok: false, motivo: 'permiso' });
      return responde({ ok: true, codigo: b.p_conv, respuestas: RESPUESTAS });
    }
    if (fn === 'metas_docente_estado_leer') return responde([]);
    if (fn === 'metas_docente_estado_guardar') return responde(0);
    if (fn === 'metas_aula_mi_codigo') return responde({ ok: true, codigo_aula: 'ENSAYO' });
    return responde({});
  };
}

/* Abre la app con la sesión del correo dado ya puesta y entra a Ajustes */
async function abrirAjustes(ctx, correo) {
  const c = CUENTAS[correo];
  const page = await ctx.newPage();
  await page.addInitScript(([cta, mail]) => {
    localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify({
      codigo: cta.codigo, clave: 'clave-de-ensayo', nombre: cta.nombre,
      correo: mail, rol: cta.rol, escuela: cta.escuela, t: '2026-08-14' }));
    localStorage.setItem('METAS_DS_OWNER', cta.codigo);
  }, [c, correo]);
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof switchView === 'function');
  await page.evaluate(() => switchView('view-ajustes'));
  await page.waitForSelector('#ajustes-cont .aj-rol-badge');
  return page;
}

const dialogoOk = async page => {
  await page.waitForSelector('#mdlg-ok');
  await page.click('#mdlg-ok');
};

(async () => {
  const nav = await chromium.launch();
  const estado = { llamadas: [], permisos: {}, filaPermiso: null, sinV2: false };

  const ctx = await nav.newContext({ viewport: { width: 412, height: 915 } });
  await ctx.route('**/rest/v1/**', nube(estado));
  await ctx.route('**/functions/v1/**', r => r.fulfill({ status: 200, body: '{}' }));

  /* ── 1) El DIRECTOR: grupos, lista y pedir el permiso ── */
  console.log('\n🏫 El director ve la gestión de su escuela');
  let page = await abrirAjustes(ctx, 'dir@ensayo.hn');
  comprueba(await page.locator('#ajustes-cont').textContent().then(t => t.includes('Docentes de mi escuela')),
    'la tarjeta «Docentes de mi escuela» está en sus Ajustes');
  await page.click('text=🔄 Cargar la lista');
  await page.waitForSelector('.aj-reg');
  await page.click('.aj-reg-sum');
  const cuerpo = await page.locator('.aj-reg-body').textContent();
  comprueba(cuerpo.includes('6º-1'), 'el grupo se lee «6º-1», como manda adGradoSeccion');
  comprueba(cuerpo.includes('2 alumnos'), 'la matrícula del grupo está a la vista');
  comprueba(cuerpo.includes('Último movimiento'), 'se ve cuándo se movió su aula por última vez');

  await page.click('text=👀 Ver la lista');
  await page.waitForSelector('.aj-alumnos');
  const lista = await page.locator('.aj-alumnos').textContent();
  comprueba(lista.includes('Ana Diaz Fuentes') && lista.includes('Luis Perez Mejia'),
    'la lista del grupo trae a los alumnos con su nombre');

  comprueba(cuerpo.includes('Pedir permiso'), 'sin permiso, la fila de convocatorias ofrece pedirlo');
  await page.click('text=🙏 Pedir permiso');
  await dialogoOk(page);
  await page.waitForFunction(() => document.body.textContent.includes('permiso pedido'));
  const pedir = estado.llamadas.find(l => l.fn === 'metas_permiso_pedir');
  comprueba(!!pedir && pedir.b.p_permiso === 'convocatorias' && pedir.b.p_nombre_docente === CUENTAS['doc@ensayo.hn'].nombre,
    'el pedido viaja con el permiso y el nombre del maestro correctos');
  await page.close();

  /* ── 2) El MAESTRO: el pedido se ve solo, y él decide ── */
  console.log('\n🧑‍🏫 El maestro es el dueño de su registro');
  page = await abrirAjustes(ctx, 'doc@ensayo.hn');
  await page.waitForSelector('.aj-permiso-fila');
  const tarjeta = await page.locator('#aj-permisos').textContent();
  comprueba(tarjeta.includes('te pide'), 'el pedido de la Dirección aparece SOLO, sin tocar nada');
  comprueba(tarjeta.includes(CUENTAS['dir@ensayo.hn'].nombre), 'con el nombre de quién lo pide');
  await page.click('text=✅ Conceder');
  await page.waitForFunction(() => document.body.textContent.includes('concedido'));
  const resp = estado.llamadas.find(l => l.fn === 'metas_permiso_responder');
  comprueba(!!resp && resp.b.p_estado === 'concedido' && Number(resp.b.p_id) === 71,
    'conceder manda al servidor la fila y el estado correctos');
  comprueba(tarjeta.includes(CUENTAS['asis@ensayo.hn'].nombre),
    'también puede DAR el permiso a la asistencia sin que se lo pidan');
  await page.close();

  /* ── 3) El DIRECTOR maneja el caso delegado (sin PIN) ── */
  console.log('\n📣 Las convocatorias delegadas');
  page = await abrirAjustes(ctx, 'dir@ensayo.hn');
  await page.click('text=🔄 Cargar la lista');
  await page.waitForSelector('.aj-reg');
  await page.click('.aj-reg-sum');
  await page.waitForSelector('text=📣 Abrir sus convocatorias');
  await page.click('text=📣 Abrir sus convocatorias');
  await page.waitForSelector('.aj-conv-fila');
  const convTxt = await page.locator('.aj-detalle').textContent();
  comprueba(convTxt.includes('Excursión al río') && convTxt.includes('2 familias') && convTxt.includes('5 personas'),
    'la convocatoria sale con sus conteos de familias y personas');
  comprueba(convTxt.includes('apuntado a mano') && convTxt.includes('pagos'),
    'la pantalla avisa que lo apuntado a mano y los pagos no salen por aquí');
  await page.click('text=👀 Ver quiénes van');
  await page.waitForSelector('.aj-alumnos-ol');
  const quienes = await page.locator('.aj-detalle').textContent();
  comprueba(quienes.includes('Ana Diaz Fuentes') && quienes.includes('3 personas'),
    'las respuestas traen a cada familia con cuántos van');
  comprueba(quienes.includes('5º-2'), 'el grupo de la respuesta también se lee con su ordinal (5º-2)');
  comprueba(quienes.includes('1 avisó que no va'), 'los que avisaron que NO van se cuentan aparte');
  await page.close();

  /* ── 4) La ASISTENCIA tiene los mismos permisos que el director ── */
  console.log('\n🧑‍💼 Asistencia = Dirección');
  page = await abrirAjustes(ctx, 'asis@ensayo.hn');
  const ajustesAsis = await page.locator('#ajustes-cont').textContent();
  comprueba(ajustesAsis.includes('Docentes de mi escuela'), 've la misma tarjeta de su escuela');
  comprueba(ajustesAsis.includes('Asistencia'), 'su distintivo dice Asistencia');
  await page.click('text=🔄 Cargar la lista');
  await page.waitForSelector('.aj-reg');
  await page.click('.aj-reg-sum');
  const cuerpoAsis = await page.locator('.aj-reg-body').textContent();
  comprueba(cuerpoAsis.includes('6º-1') && cuerpoAsis.includes('Ver la lista'),
    've los grupos y puede abrir la lista, igual que el director');
  comprueba(cuerpoAsis.includes('Pedir permiso') || cuerpoAsis.includes('Abrir sus convocatorias'),
    'y también trabaja los permisos delegables');
  await page.close();

  /* ── 5) El RECTOR verifica: conteos de todas, nombres de nadie ── */
  console.log('\n🎓 El rector verifica sin nombres de niños');
  page = await abrirAjustes(ctx, 'rec@ensayo.hn');
  await page.click('text=🔄 Cargar la lista');
  await page.waitForSelector('.aj-reg');
  const nRegs = await page.locator('.aj-reg').count();
  comprueba(nRegs === 2, 've docentes de más de una escuela (' + nRegs + ')');
  await page.locator('.aj-reg-sum').first().click();
  await page.locator('.aj-reg-sum').nth(1).click();
  const rectorTxt = await page.locator('#aj-lista').textContent();
  comprueba(rectorTxt.includes('6º-1') && rectorTxt.includes('40 alumnos'),
    'con los grupos y su matrícula a la vista');
  comprueba(!rectorTxt.includes('Ver la lista'), 'SIN el botón de ver la lista de alumnos');
  comprueba(!rectorTxt.includes('Pedir permiso'), 'y SIN el botón de pedir permisos: verifica, no administra');
  await page.close();

  /* ── 6) El maestro REVOCA y la puerta se cierra ── */
  console.log('\n↩️ Revocar revoca de verdad');
  page = await abrirAjustes(ctx, 'doc@ensayo.hn');
  await page.waitForSelector('.aj-permiso-fila');
  await page.click('text=↩️ Quitarlo');
  await dialogoOk(page);
  await page.waitForFunction(() => document.body.textContent.includes('retirado'));
  const revocado = estado.llamadas.filter(l => l.fn === 'metas_permiso_responder').pop();
  comprueba(!!revocado && revocado.b.p_estado === 'revocado', 'revocar manda «revocado» al servidor');
  await page.close();

  page = await abrirAjustes(ctx, 'dir@ensayo.hn');
  await page.click('text=🔄 Cargar la lista');
  await page.waitForSelector('.aj-reg');
  await page.click('.aj-reg-sum');
  const trasRevocar = await page.locator('.aj-reg-body').textContent();
  comprueba(trasRevocar.includes('permiso retirado') && !trasRevocar.includes('Abrir sus convocatorias'),
    'al director se le cierra la puerta y se le dice por qué');
  await page.close();

  /* ── 7) El PIN no viaja NUNCA, ni el candado ni las claves ── */
  console.log('\n🔒 Lo que no debe viajar');
  const cuerpos = estado.llamadas.map(l => JSON.stringify(l.b)).join(' ');
  comprueba(!/p_pin|"pin"/.test(cuerpos), 'ninguna llamada de la Dirección lleva un PIN');
  comprueba(!/METAS_CODIGOS|METAS_PIN_MAESTRO/.test(cuerpos),
    'ni las claves de familia ni el candado del maestro salen del equipo');

  /* ── 8) La nube sin el SQL v2 no mata la tarjeta (404 → lista de siempre) ── */
  console.log('\n🕰️ La nube vieja');
  estado.sinV2 = true;
  page = await abrirAjustes(ctx, 'dir@ensayo.hn');
  await page.click('text=🔄 Cargar la lista');
  await page.waitForSelector('.aj-reg');
  comprueba(await page.locator('.aj-reg').count() >= 1,
    'con metas_rol_grupos sin instalar (404), la lista de siempre sigue saliendo');
  await page.close();

  await nav.close();
  console.log('\n' + (fallos ? '❌ ' + fallos + ' comprobación(es) fallaron' : '✅ Todo en orden'));
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('💥 La sonda tropezó: ' + e.message); process.exit(1); });
