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
     lo ve al abrir sus Ajustes SIN tocar nada, lo concede o lo niega,
     y lo revoca después. Y un pedido a OTRA cuenta de Dirección (que
     también tiene aula) también llega a su dueño: antes se quedaba
     esperando para siempre.

   · QUE EL PIN NO VIAJE NUNCA. El manejo delegado de una convocatoria
     funciona porque el servidor comprueba el permiso y responde él
     mismo; si el cliente mandara un PIN, revocar sería mentira.

   · QUE LA DIRECCIÓN NO REESCRIBA SU ESCUELA. Su alcance cuelga de
     ese campo, así que el formulario se lo muestra fijo: lo ajusta el
     administrador, no ella.

   · QUE LA NUBE VIEJA NO MATE LA TARJETA. Si el SQL de roles v2 aún
     no se corrió en Supabase (404), el director sigue viendo la lista
     de siempre, no una pantalla muerta.

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
  'dir@ensayo.hn':  { codigo: 'PROF-DIR0000001', nombre: 'Marta Ondina Reyes',  rol: 'director',   escuela: ESCUELA, municipio: 'El Progreso' },
  'asis@ensayo.hn': { codigo: 'PROF-ASI0000001', nombre: 'Julia Rodas Nunez',   rol: 'asistencia', escuela: ESCUELA, municipio: 'El Progreso' },
  'rec@ensayo.hn':  { codigo: 'PROF-REC0000001', nombre: 'Pedro Molina Casco',  rol: 'rector',     escuela: 'Distrital', municipio: 'Tegucigalpa' },
  'doc@ensayo.hn':  { codigo: 'PROF-DOC0000001', nombre: 'Carlos Zelaya Puerto', rol: 'docente',   escuela: ESCUELA, municipio: 'El Progreso' },
};
const porCodigo = cod => Object.values(CUENTAS).find(c => c.codigo === cod);
const porNombre = nom => Object.values(CUENTAS).find(c => c.nombre === nom);
const correoDe  = cod => Object.keys(CUENTAS).find(k => CUENTAS[k].codigo === cod) || '';

/* Lo que el servidor de verdad ya armó desde el espejo (grupos filtrados
   por escuela: el de otro colegio no llega al cliente) */
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
/* Dos familias que avisaron que NO van: para probar que se pluraliza */
const RESPUESTAS = [
  { va: true,  alumno: 'Ana Diaz Fuentes', grado: '6', seccion: '1', personas: 3, tel: '99998888', nota: '', actualizado: '2026-08-13T10:00:00Z' },
  { va: true,  alumno: 'Rosa Lopez Andino', grado: '5', seccion: '2', personas: 2, tel: '88887777', nota: 'llegamos tarde', actualizado: '2026-08-13T09:00:00Z' },
  { va: false, alumno: 'Ivan Castro Ruiz', grado: '6', seccion: '1', personas: 0, tel: '', nota: '', actualizado: '2026-08-12T08:00:00Z' },
  { va: false, alumno: 'Sara Nolasco Paz', grado: '6', seccion: '1', personas: 0, tel: '', nota: '', actualizado: '2026-08-12T07:00:00Z' },
];

/* ── El Supabase de mentira ──
   `estado.permisos` es la tabla docente_permisos del ensayo: una fila por
   (dueño, dirección, permiso). Se comporta como el servidor de verdad
   para poder probar el flujo entero desde las dos pantallas. */
function nube(estado) {
  const fila = (owner, dir, permiso) => estado.permisos.find(p =>
    p.owner === owner && p.dir === dir && p.permiso === permiso);
  const estadoDe = (owner, dir) => { const f = fila(owner, dir, 'convocatorias'); return f ? f.estado : ''; };
  const mismaEsc = (a, b) => a && b && a.escuela === b.escuela;

  return async route => {
    const url = route.request().url();
    const responde = cuerpo => route.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(cuerpo) });
    if (!url.includes('/rest/v1/rpc/')) return responde({});
    const fn = url.split('/rpc/')[1].split('?')[0];
    let b = {};
    try { b = JSON.parse(route.request().postData() || '{}'); } catch (_) {}
    estado.llamadas.push({ fn, b });
    const yo = porCodigo(b.p_codigo);
    const esDir = yo && (yo.rol === 'director' || yo.rol === 'asistencia');

    if (fn === 'metas_entrar_docente_v2') {
      const c = CUENTAS[String(b.p_correo || '').toLowerCase()];
      return responde(c ? { ok: true, codigo: c.codigo, nombre: c.nombre, correo: b.p_correo, rol: c.rol }
                        : { ok: false, motivo: 'datos' });
    }
    if (fn === 'metas_perfil_leer') {
      return responde(yo ? { ok: true, nombre: yo.nombre, correo: correoDe(yo.codigo), escuela: yo.escuela,
        tipo: '', telefono: '', departamento: '', municipio: yo.municipio || '', lugar: '', rol: yo.rol, creado_en: '2026-01-01' } : { ok: false });
    }
    if (fn === 'metas_perfil_editar') {
      // como el servidor: a una cuenta de Dirección no le cambia la escuela
      return responde({ ok: true, escuela_fija: !!esDir });
    }
    if (fn === 'metas_rol_grupos') {
      if (estado.sinV2) return route.fulfill({ status: 404, contentType: 'application/json', body: '{}' });
      if (!yo) return responde({ ok: false, motivo: 'clave' });
      if (!esDir && yo.rol !== 'rector') return responde({ ok: false, motivo: 'rol' });
      const doc = CUENTAS['doc@ensayo.hn'];
      const filaDoc = {
        nombre: doc.nombre, escuela: doc.escuela, municipio: doc.municipio, rol: 'docente',
        creado: '2026-02-01', movido: '2026-08-13T12:00:00Z', grupos: GRUPOS_DOC,
        permisos: esDir ? (estadoDe(doc.codigo, yo.codigo) ? { convocatorias: estadoDe(doc.codigo, yo.codigo) } : {}) : {},
      };
      const filas = [filaDoc];
      // a un director le sale también la asistencia (otra cuenta con aula
      // de su escuela), para poder pedirle un permiso
      if (esDir) {
        const otra = Object.values(CUENTAS).find(c => (c.rol === 'director' || c.rol === 'asistencia')
          && c.codigo !== yo.codigo && c.escuela === yo.escuela);
        if (otra) filas.push({ nombre: otra.nombre, escuela: otra.escuela, municipio: otra.municipio, rol: otra.rol,
          creado: '2026-01-15', movido: null, grupos: [{ id: 'GOTRA', grado: '4', seccion: '1', escuela: otra.escuela, matricula: 1, ninas: 1, varones: 0 }],
          permisos: estadoDe(otra.codigo, yo.codigo) ? { convocatorias: estadoDe(otra.codigo, yo.codigo) } : {} });
      }
      if (yo.rol === 'rector') filas.push({
        nombre: 'Nina Suyapa Ortez', escuela: 'Escuela Lempira', municipio: 'Tela', rol: 'docente',
        creado: '2026-03-01', movido: null, grupos: [{ id: 'GBBBBB', grado: '3', seccion: '2', escuela: 'Escuela Lempira', matricula: 40, ninas: 21, varones: 19 }], permisos: {} });
      return responde({ ok: true, rol: yo.rol, docentes: filas });
    }
    if (fn === 'metas_rol_listar') {
      return responde({ ok: true, rol: yo ? yo.rol : 'docente', docentes: [
        { nombre: CUENTAS['doc@ensayo.hn'].nombre, escuela: ESCUELA, municipio: 'El Progreso', rol: 'docente', creado: '2026-02-01' }] });
    }
    if (fn === 'metas_rol_alumnos') {
      if (!esDir) return responde({ ok: false, motivo: 'rol' });
      return responde({ ok: true, grado: '6', seccion: '1', escuela: ESCUELA, alumnos: ALUMNOS_G });
    }
    if (fn === 'metas_permiso_pedir') {
      const owner = porNombre(b.p_nombre_docente);
      if (!owner || !mismaEsc(owner, yo)) return responde({ ok: false, motivo: 'no_existe' });
      let f = fila(owner.codigo, yo.codigo, b.p_permiso);
      if (!f) { f = { id: estado.seq++, owner: owner.codigo, dir: yo.codigo, permiso: b.p_permiso, estado: 'pedido' }; estado.permisos.push(f); }
      else if (f.estado !== 'concedido') f.estado = 'pedido';
      return responde({ ok: true, estado: f.estado });
    }
    if (fn === 'metas_permiso_dar') {
      const dir = porNombre(b.p_nombre_direccion);
      if (!dir) return responde({ ok: false, motivo: 'no_existe' });
      let f = fila(yo.codigo, dir.codigo, b.p_permiso);
      if (!f) { f = { id: estado.seq++, owner: yo.codigo, dir: dir.codigo, permiso: b.p_permiso, estado: 'concedido' }; estado.permisos.push(f); }
      else f.estado = 'concedido';
      return responde({ ok: true, estado: 'concedido' });
    }
    if (fn === 'metas_permiso_responder') {
      const f = estado.permisos.find(p => p.id === Number(b.p_id) && p.owner === yo.codigo);
      if (!f) return responde({ ok: false, motivo: 'no_existe' });
      f.estado = b.p_estado;
      return responde({ ok: true, estado: b.p_estado });
    }
    if (fn === 'metas_permisos_listar') {
      const mios = estado.permisos.filter(p => p.owner === yo.codigo).map(p => ({
        id: p.id, permiso: p.permiso, estado: p.estado, pedido_por: 'direccion',
        nombre: porCodigo(p.dir).nombre, rol: porCodigo(p.dir).rol, actualizado: '2026-08-13' }));
      const pedidos = esDir ? estado.permisos.filter(p => p.dir === yo.codigo).map(p => ({
        id: p.id, permiso: p.permiso, estado: p.estado, nombre: porCodigo(p.owner).nombre })) : [];
      const direccion = Object.values(CUENTAS).filter(c => (c.rol === 'director' || c.rol === 'asistencia')
        && c.codigo !== yo.codigo && c.escuela === yo.escuela).map(c => ({ nombre: c.nombre, rol: c.rol }));
      return responde({ ok: true, rol: yo.rol, mios, pedidos, direccion });
    }
    if (fn === 'metas_rol_conv_listar') {
      const owner = porNombre(b.p_nombre_docente);
      if (estadoDe(owner.codigo, yo.codigo) !== 'concedido') return responde({ ok: false, motivo: 'permiso' });
      return responde({ ok: true, convocatorias: CONVS });
    }
    if (fn === 'metas_rol_conv_respuestas') {
      const owner = porNombre(b.p_nombre_docente);
      if (estadoDe(owner.codigo, yo.codigo) !== 'concedido') return responde({ ok: false, motivo: 'permiso' });
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
      correo: mail, rol: cta.rol, escuela: cta.escuela, municipio: cta.municipio, t: '2026-08-14' }));
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
  const estado = { llamadas: [], permisos: [], seq: 70, sinV2: false };

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
  // el primer registro es el docente Carlos
  await page.locator('.aj-reg-sum').first().click();
  const cuerpo = await page.locator('.aj-reg-body').first().textContent();
  comprueba(cuerpo.includes('6º-1'), 'el grupo se lee «6º-1», como manda adGradoSeccion');
  comprueba(cuerpo.includes('2 alumnos'), 'la matrícula del grupo está a la vista');
  comprueba(cuerpo.includes('Último movimiento'), 'se ve cuándo se movió su aula por última vez');

  await page.locator('.aj-reg').first().locator('text=👀 Ver la lista').click();
  await page.waitForSelector('.aj-alumnos');
  const lista = await page.locator('.aj-alumnos').textContent();
  comprueba(lista.includes('Ana Diaz Fuentes') && lista.includes('Luis Perez Mejia'),
    'la lista del grupo trae a los alumnos con su nombre');

  comprueba(cuerpo.includes('Pedir permiso'), 'sin permiso, la fila de convocatorias ofrece pedirlo');
  await page.locator('.aj-reg').first().locator('text=🙏 Pedir permiso').click();
  await dialogoOk(page);
  await page.waitForFunction(() => document.body.textContent.includes('permiso pedido'));
  const pedir = estado.llamadas.find(l => l.fn === 'metas_permiso_pedir');
  comprueba(!!pedir && pedir.b.p_permiso === 'convocatorias' && pedir.b.p_nombre_docente === CUENTAS['doc@ensayo.hn'].nombre,
    'el pedido viaja con el permiso y el nombre del maestro correctos');
  // #5: tras pedir, el registro de Carlos SIGUE abierto (no se colapsó)
  comprueba(await page.locator('.aj-reg').first().evaluate(e => e.open),
    'el registro del maestro sigue abierto tras pedir (no se recargó toda la lista)');
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
  comprueba(!!resp && resp.b.p_estado === 'concedido', 'conceder manda al servidor el estado correcto');
  comprueba(tarjeta.includes(CUENTAS['asis@ensayo.hn'].nombre),
    'también puede DAR el permiso a la asistencia sin que se lo pidan');
  await page.close();

  /* ── 3) El DIRECTOR maneja el caso delegado (sin PIN) ── */
  console.log('\n📣 Las convocatorias delegadas');
  page = await abrirAjustes(ctx, 'dir@ensayo.hn');
  await page.click('text=🔄 Cargar la lista');
  await page.waitForSelector('.aj-reg');
  await page.locator('.aj-reg-sum').first().click();
  await page.locator('.aj-reg').first().locator('text=📣 Abrir sus convocatorias').click();
  await page.waitForSelector('.aj-conv-fila');
  const convTxt = await page.locator('.aj-reg').first().locator('.aj-detalle').textContent();
  comprueba(convTxt.includes('Excursión al río') && convTxt.includes('2 familias') && convTxt.includes('5 personas'),
    'la convocatoria sale con sus conteos de familias y personas');
  comprueba(convTxt.includes('apuntado a mano') && convTxt.includes('pagos'),
    'la pantalla avisa que lo apuntado a mano y los pagos no salen por aquí');
  await page.locator('.aj-reg').first().locator('text=👀 Ver quiénes van').click();
  await page.waitForSelector('.aj-alumnos-ol');
  const quienes = await page.locator('.aj-reg').first().locator('.aj-detalle').textContent();
  comprueba(quienes.includes('Ana Diaz Fuentes') && quienes.includes('3 personas'),
    'las respuestas traen a cada familia con cuántos van');
  comprueba(quienes.includes('5º-2'), 'el grupo de la respuesta también se lee con su ordinal (5º-2)');
  comprueba(quienes.includes('2 avisaron que no van'), 'los que avisaron que NO van se cuentan y se pluralizan');
  await page.close();

  /* ── 4) La ASISTENCIA tiene los mismos permisos que el director ── */
  console.log('\n🧑‍💼 Asistencia = Dirección');
  page = await abrirAjustes(ctx, 'asis@ensayo.hn');
  const ajustesAsis = await page.locator('#ajustes-cont').textContent();
  comprueba(ajustesAsis.includes('Docentes de mi escuela'), 've la misma tarjeta de su escuela');
  comprueba(ajustesAsis.includes('Asistencia'), 'su distintivo dice Asistencia');
  await page.click('text=🔄 Cargar la lista');
  await page.waitForSelector('.aj-reg');
  await page.locator('.aj-reg-sum').first().click();
  const cuerpoAsis = await page.locator('.aj-reg-body').first().textContent();
  comprueba(cuerpoAsis.includes('6º-1') && cuerpoAsis.includes('Ver la lista'),
    've los grupos y puede abrir la lista, igual que el director');
  await page.close();

  /* ── 5) #8: un pedido a otra cuenta de Dirección SÍ llega a su dueño ── */
  console.log('\n🔁 Un pedido a la asistencia también se contesta');
  // el director le pide el permiso a la asistencia (que también tiene aula)
  page = await abrirAjustes(ctx, 'dir@ensayo.hn');
  await page.click('text=🔄 Cargar la lista');
  await page.waitForSelector('.aj-reg');
  // la segunda fila es la asistencia (Julia)
  await page.locator('.aj-reg-sum').nth(1).click();
  const filaAsis = page.locator('.aj-reg').nth(1);
  comprueba(await filaAsis.locator('text=🙏 Pedir permiso').count() > 0,
    'el director ve a la asistencia con su botón de pedir permiso');
  await filaAsis.locator('text=🙏 Pedir permiso').click();
  await dialogoOk(page);
  await page.waitForFunction(() => document.body.textContent.includes('permiso pedido'));
  await page.close();
  // la asistencia abre SUS Ajustes: ve la tarjeta de permisos-dueño con el pedido
  page = await abrirAjustes(ctx, 'asis@ensayo.hn');
  await page.waitForSelector('#aj-permisos');
  const permisosAsis = await page.locator('#aj-permisos').textContent();
  const tituloAsis = await page.locator('#ajustes-cont').textContent();
  comprueba(tituloAsis.includes('Permisos sobre mi aula'),
    'la asistencia ve la tarjeta «Permisos sobre mi aula» (antes no la veía)');
  comprueba(permisosAsis.includes('te pide') && permisosAsis.includes(CUENTAS['dir@ensayo.hn'].nombre),
    'y ahí está el pedido de la directora, esperando su respuesta');
  await page.close();

  /* ── 6) El RECTOR verifica: conteos de todas, nombres de nadie ── */
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
  comprueba(!(await page.locator('#ajustes-cont').textContent()).includes('Permisos sobre mi aula'),
    'el rector no tiene aula que delegar: no ve la tarjeta de permisos-dueño');
  await page.close();

  /* ── 7) La escuela de la Dirección es de solo lectura ── */
  console.log('\n🔒 La Dirección no reescribe su escuela');
  page = await abrirAjustes(ctx, 'dir@ensayo.hn');
  await page.click('text=Editar mi perfil');
  await page.waitForSelector('#aj-edit-form', { state: 'visible' });
  comprueba(await page.locator('#aj-edit-form').textContent().then(t => t.includes('ajusta tu administrador')),
    'el formulario dice que su escuela la ajusta el administrador');
  comprueba(await page.locator('#aj-ed-escuela').count() === 0,
    'el campo de escuela editable NO existe para el director');
  await page.close();

  /* ── 8) El maestro REVOCA y la puerta se cierra ── */
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
  await page.locator('.aj-reg-sum').first().click();
  const trasRevocar = await page.locator('.aj-reg-body').first().textContent();
  comprueba(trasRevocar.includes('permiso retirado') && !trasRevocar.includes('Abrir sus convocatorias'),
    'al director se le cierra la puerta y se le dice por qué');
  await page.close();

  /* ── 9) El PIN no viaja NUNCA, ni el candado ni las claves ── */
  console.log('\n🔒 Lo que no debe viajar');
  const cuerpos = estado.llamadas.map(l => JSON.stringify(l.b)).join(' ');
  comprueba(!/p_pin|"pin"/.test(cuerpos), 'ninguna llamada de la Dirección lleva un PIN');
  comprueba(!/METAS_CODIGOS|METAS_PIN_MAESTRO/.test(cuerpos),
    'ni las claves de familia ni el candado del maestro salen del equipo');

  /* ── 10) La nube sin el SQL v2 no mata la tarjeta (404 → lista de siempre) ── */
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
