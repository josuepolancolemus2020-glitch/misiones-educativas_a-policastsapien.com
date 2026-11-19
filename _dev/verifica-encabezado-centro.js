/* =====================================================================
   M.E.T.A.S · El centro en el encabezado del examen impreso
   ---------------------------------------------------------------------
   El motor de las misiones (js/motor-misiones.js, pieza 4) pone el
   perfil del centro arriba de la hoja impresa del examen, y
   js/metas-centro.js le da la lista de centros. Con datos ficticios:

   · TODAS las hojas de las misiones (las 84, más la plantilla de
     js/motor-mision.js) tienen la forma que el motor sabe cambiar, y
     sus tres impresiones son printEval, printEvalOp o printEvalCrit;
   (a) sin sesión, la hoja sale igual, byte por byte, aunque el perfil
       esté guardado en el aparato;
   (b) docente con un centro: logo a color, cuadrado y grande (60 px o
       más) a la izquierda; a su derecha el nombre en mayúsculas, el lugar,
       «Docente: …» con Grado y Sección, Parcial y Fecha en el mismo
       renglón, el título, y un solo renglón del alumno: Nombre y N.º de
       lista;
   (c) el centro que sale, sin preguntar nunca:
       · con centro activo en Mi aula entre varios, el activo;
       · sin activo y con uno solo, ese;
       · sin activo y con varios, el último con que se imprimió, si
         todavía existe; si no, la hoja sin encabezado personalizado;
       · un centro activo archivado no sale;
   (d) «Sin encabezado»: la hoja de siempre, con la raya en blanco;
   (e) el docente cerró sesión: otra vez la hoja de siempre;
   · la lista de centros incluye los que no tienen grupos, sin repetir,
     y deja fuera los archivados; centroActual() da los mismos campos;
   · los impresos de Mi aula (boleta, marca, paraImpreso, textoCentro)
     salen iguales con la lista nueva en la copia y con o sin sesión.

   En el navegador, con una misión de verdad:
   _dev/verifica-encabezado-centro-navegador.js.

   Uso: node _dev/verifica-encabezado-centro.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0;
const ok = (c, t, extra) => { console.log((c ? '✓ ' : '✘ ') + t + (c || extra === undefined ? '' : '  → ' + extra)); if (!c) fallos++; };

/* ── un navegador de mentira, como en verifica-perfil-centro ── */
const mem = {};
const localStorage = {
  getItem(k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
  setItem(k, v) { mem[k] = String(v); },
  removeItem(k) { delete mem[k]; },
};
const chunks = [];
function ventanaVacia() {
  return { document: { write(t) { chunks.push(String(t)); }, close() {} }, close() {}, focus() {}, print() {} };
}
const sandbox = {
  console, localStorage, URL, setTimeout, clearTimeout,
  location: { href: 'http://127.0.0.1:8080/misiones/x/x.html', search: '' },
  document: {
    addEventListener() {}, removeEventListener() {},
    getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; },
    createElement() { return { style: {}, getContext() { return { drawImage() {} }; } }; },
    readyState: 'complete',
  },
  navigator: {},
  open: ventanaVacia,
  addEventListener() {}, removeEventListener() {},
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const cargar = rel => vm.runInContext(fs.readFileSync(path.join(RAIZ, rel), 'utf8'), sandbox, { filename: rel });

cargar('js/metas-centro.js');
cargar('js/motor-misiones.js');
cargar('js/tools/registros-admin.js');
const MC = sandbox.MetasCentro;
const hoja = sandbox.MotorMisiones.centro.hoja;
/* Junto al encabezado nuevo viaja, invisible, el de siempre: el ajuste
   lo mide en la hoja abierta y lo quita. Lo que se ve es lo de afuera. */
const COPIA_RE = /<div data-metas-antes[^>]*>([\s\S]*?<\/h2>[\s\S]*?<\/div>\s*<div class="ph-line">[\s\S]*?<\/div>)<\/div>/g;
const visible = h => h.replace(COPIA_RE, '');

const LOGO = 'data:image/jpeg;base64,QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo=';
const LOGO2 = 'data:image/jpeg;base64,WllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkE=';
const SESION = JSON.stringify({ codigo: 'DOC-FICTICIO', nombre: 'Docente De La Cuenta' });
const centroA = { id: 'c-a', nombre: 'Centro Ficticio Las Flores', logo: LOGO, direccion: 'Colonia Ficticia', municipio: 'Villanueva', departamento: 'Cortés', docente: 'Docente Ficticia' };

/* ══════════ 1 · Todas las hojas de las misiones ══════════ */
console.log('── las hojas de las misiones ──');
function archivosJs(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...archivosJs(p));
    else if (e.name.endsWith('.js')) out.push(p);
  }
  return out;
}
const fuentes = archivosJs(path.join(RAIZ, 'misiones')).concat([path.join(RAIZ, 'js/motor-mision.js')]);
const GUARDA = { printEval: '_evalPrintData', printEvalOp: '_evalOpData', printEvalCrit: '_evalCritData' };
let hojas = 0;
const malas = [];
const funcionesRaras = [];
const guardasRaras = [];
for (const f of fuentes) {
  const s = fs.readFileSync(f, 'utf8');
  let i = 0;
  while ((i = s.indexOf('<div class="ph"', i)) >= 0) {
    hojas++;
    /* El bloque va del <div class="ph"> hasta el cierre de la segunda raya. */
    const l1 = s.indexOf('<div class="ph-line">', i);
    const l2 = s.indexOf('<div class="ph-line">', l1 + 1);
    const fin = s.indexOf('</div>', l2) + 6;
    const bloque = s.slice(i, fin) + '</div>';
    const rel = path.relative(RAIZ, f);
    const r = hoja(bloque, centroA, 'Docente Ficticia');
    const copia = (r.match(COPIA_RE) || [''])[0];
    if (!r.includes('data-metas-encabezado="centro"') || /Centro Educativo:|>Instituto:|Universidad\/Instituto:/.test(visible(r))
      || !copia.includes(bloque.slice(bloque.indexOf('<h2>'), -6))) malas.push(rel);
    const antes = s.slice(0, i);
    const re = /function\s+([A-Za-z0-9_$]+)\s*\(/g;
    let m, ultima = null;
    while ((m = re.exec(antes))) ultima = m;
    const nombre = ultima ? ultima[1] : '?';
    if (!GUARDA[nombre]) funcionesRaras.push(rel + ' · ' + nombre);
    else if (!s.slice(ultima.index, ultima.index + 200).includes('window.' + GUARDA[nombre] + ')')) guardasRaras.push(rel + ' · ' + nombre);
    i++;
  }
}
ok(hojas >= 167, 'se encontraron las hojas de examen de las misiones', hojas);
ok(!malas.length, 'el motor sabe ponerle el centro a cada una de las ' + hojas + ' hojas (y lleva al lado, para medirlo, su encabezado de siempre)', malas.slice(0, 5).join(', '));
ok(!funcionesRaras.length, 'cada hoja se imprime desde printEval, printEvalOp o printEvalCrit', funcionesRaras.slice(0, 5).join(', '));
ok(!guardasRaras.length, 'y cada una revisa su dato antes de abrir la ventana (_evalPrintData, _evalOpData, _evalCritData)', guardasRaras.slice(0, 5).join(', '));

/* ══════════ 2 · El encabezado nuevo ══════════ */
console.log('\n── el encabezado ──');
const HOJA = fs.readFileSync(path.join(RAIZ, 'misiones/1ciclo-segundo-grado/js/centena.js'), 'utf8');
const trozo = (HOJA.match(/<div class="ph"><h2>[\s\S]*?<\/p><\/div>/) || [''])[0];
const DOC = '<!DOCTYPE html><html><head><style>.ph{}</style></head><body><div id="evalPage">' + trozo
  + '<div class="sec-title">I. Completar</div></div><script>(function(){function fit(id){}fit("evalPage",250,0.55,1.2);})()</script></body></html>';
ok(trozo.includes('<strong>Centro Educativo:</strong>') && trozo.includes('<strong>Grado:</strong>'), 'la hoja de referencia trae la raya del centro');

const conCentro = hoja(DOC, centroA, 'Docente Ficticia');
const ph = visible(conCentro.slice(conCentro.indexOf('<div class="ph"'), conCentro.indexOf('<div class="sec-title">')));
const estiloLogo = (ph.match(/<img data-metas-logo[^>]*style="([^"]*)"/) || [, ''])[1];
const ladoLogo = parseFloat((estiloLogo.match(/width:(\d+(?:\.\d+)?)px/) || [, '0'])[1]);
ok(ph.includes(LOGO) && !/grayscale/.test(estiloLogo), 'el logo sale a color, sin el filtro gris', estiloLogo);
ok(ladoLogo >= 60 && estiloLogo.includes('height:' + ladoLogo + 'px'), 'el logo es cuadrado y grande: 60 px o más', ladoLogo);
ok(!/grayscale/.test(fs.readFileSync(path.join(RAIZ, 'js/motor-misiones.js'), 'utf8')), 'en el motor ya no queda ningún filtro gris');
const iLogo = ph.indexOf('data-metas-logo'), iNom = ph.indexOf('CENTRO FICTICIO LAS FLORES'), iLugar = ph.indexOf('Colonia Ficticia, Villanueva'),
  iDoc = ph.indexOf('Docente: Docente Ficticia'), iH2 = ph.indexOf('<h2>'), iNombre = ph.indexOf('<strong>Nombre:</strong>');
ok(iLogo >= 0 && iLogo < iNom && iNom < iLugar && iLugar < iDoc && iDoc < iH2 && iH2 < iNombre,
  'el logo a la izquierda; a su derecha el nombre, el lugar, el docente, el título y el renglón del alumno, en ese orden');
const lineaDocente = (ph.match(/<div class="ph-line" data-metas-docente[^>]*>[\s\S]*?<\/span><\/span><\/div>/) || [''])[0];
ok(/Docente: Docente Ficticia<\/span>/.test(lineaDocente)
  && /<strong>Grado y Sección:<\/strong><span class="ph-s"[^>]*>&nbsp;<\/span><strong>Parcial:<\/strong><span class="ph-s"[^>]*>&nbsp;<\/span><strong>Fecha:<\/strong><span class="ph-m"[^>]*>&nbsp;<\/span>/.test(lineaDocente),
  'en el renglón del docente: Grado y Sección, Parcial y Fecha, en blanco para el alumno', lineaDocente);
ok(ph.includes('<div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>N.º de lista:</strong><span class="ph-xs">&nbsp;</span></div>'),
  'el alumno tiene un solo renglón: Nombre y N.º de lista');
ok(!/Centro Educativo:|Instituto:/.test(ph) && (ph.match(/<strong>Parcial:/g) || []).length === 1 && (ph.match(/<strong>Nombre:/g) || []).length === 1,
  'ya no está la raya «Centro Educativo», y nada sale dos veces');
ok(!ph.includes('aria-hidden'), 'no queda hueco a la derecha: ese espacio es para las rayas');
const encabezadoDeSiempre = (conCentro.match(new RegExp(COPIA_RE.source)) || [, ''])[1];
ok(encabezadoDeSiempre === trozo.slice('<div class="ph">'.length, trozo.indexOf('<p class="ph-crit">')),
  'el encabezado de siempre va al lado, igualito, para que el ajuste mida cuánto agregó el centro');
ok(conCentro.includes(trozo.match(/<h2>[\s\S]*?<\/h2>/)[0]) && conCentro.includes(trozo.match(/<p class="ph-crit">[\s\S]*?<\/p>/)[0]),
  'el título, la forma y el valor total no cambian');
const GUARDA_RE = /<script>\(function\(\)\{var T=(\{[^}]*\});[\s\S]*?<\/script><\/body>/;
ok(conCentro.slice(conCentro.indexOf('<div class="sec-title">')).replace(GUARDA_RE, '</body>') === DOC.slice(DOC.indexOf('<div class="sec-title">')),
  'las preguntas y el ajuste de la hoja no se tocan');
const guarda = conCentro.match(GUARDA_RE);
ok(guarda && guarda[1] === '{"evalPage":250}' && conCentro.indexOf(guarda[0]) > conCentro.lastIndexOf('fit("evalPage",250'),
  'a una hoja con ajuste propio solo se le agrega, después de su ajuste, el tope para cuando ya no cabe ni en su zoom mínimo', guarda && guarda[1]);
ok(conCentro.includes('data-metas-encabezado="centro"'), 'la hoja queda marcada para que nadie más la llene');
const sinAjuste = DOC.replace(/<script>[\s\S]*?<\/script>/, '');
const finDeGrado = hoja(sinAjuste, centroA, '');
ok(!/var T=/.test(finDeGrado) && /<script>[^<]*data-metas-antes[^<]*\(H-h\)\/H[^<]*<\/script><\/body>/.test(finDeGrado),
  'la hoja sin ajuste propio (Fin de grado) recibe el ajuste que le quita lo que el centro agrega (el alto nuevo menos el de siempre)');
ok(/data-metas-antes[\s\S]*removeChild/.test((conCentro.match(GUARDA_RE) || [''])[0]) && /removeChild/.test(finDeGrado.slice(finDeGrado.lastIndexOf('<script>'))),
  'y el encabezado de siempre se quita apenas se mide, en las dos');
ok(!hoja(sinAjuste, null, '').includes('<script>'), '«Sin encabezado» no recibe ningún ajuste');

const pelado = hoja(DOC, { id: 'c-z', nombre: 'Escuela Sin Datos' }, '');
ok(visible(pelado).includes('ESCUELA SIN DATOS') && !pelado.includes('<img') && !visible(pelado).includes('aria-hidden') && !pelado.includes('font-size:8.5pt')
  && !pelado.includes('Docente:') && pelado.includes('<strong>Grado y Sección:</strong>'),
  'sin logo, sin lugar y sin docente no quedan huecos ni líneas vacías, y las rayas del alumno siguen');
const soloDocente = hoja(DOC, { id: 'c-z', nombre: 'Escuela X', municipio: 'Danlí' }, '');
ok(soloDocente.includes('>Danlí</div>') && !soloDocente.includes('Docente:'), 'sin docente, solo el lugar');
const malo = hoja(DOC, { id: 'c-z', nombre: '<b>Escuela</b>', logo: 'javascript:alert(1)' }, '');
ok(!malo.includes('<b>') && !malo.includes('javascript:'), 'el nombre se escribe como texto y un logo que no es imagen no entra');

const uni = '<div class="ph"><h2>T</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Universidad/Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Carrera/Sección:</strong><span class="ph-s">&nbsp;</span><strong>N.º Cuenta:</strong><span class="ph-xs">&nbsp;</span></div></div>';
const uniCon = visible(hoja(uni, centroA, ''));
ok(/<strong>Carrera\/Sección:<\/strong><span class="ph-s"[^>]*>&nbsp;<\/span><strong>Parcial:<\/strong>/.test(uniCon)
  && uniCon.includes('<strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>N.º Cuenta:</strong>'),
  'la hoja universitaria conserva sus rótulos');

/* (d) «Sin encabezado» */
const sin = hoja(DOC, null, '');
ok(sin.replace(' data-metas-encabezado="sin"', '') === DOC, '(d) «Sin encabezado»: la hoja de siempre, con la raya en blanco');
ok(MC.examen(sin) === sin, '(d) y MetasCentro.examen no la llena aunque haya perfil y sesión');
const rara = DOC.replace('<strong>Grado:</strong>', '<strong>Curso:</strong>');
ok(hoja(rara, centroA, '').replace(' data-metas-encabezado="sin"', '') === rara, 'una hoja de forma desconocida sale como siempre, sin perder nada');

/* ══════════ 3 · La impresión envuelta ══════════ */
console.log('\n── la impresión de la misión ──');
let llamadas = 0;
sandbox.printEval = function () {
  llamadas++;
  if (!sandbox._evalPrintData) return 'aviso';
  const w = sandbox.open('', '_blank', '');
  w.document.write(DOC);
  w.document.close();
  return 'impreso';
};
sandbox.MotorMisiones.centro.envolver();
ok(sandbox.printEval.__metasCentro === true, 'printEval queda envuelta');
const imprimir = () => { chunks.length = 0; const r = sandbox.printEval(); return { r, html: chunks.join('') }; };

const perfilA = { id: 'c-a', nombre: centroA.nombre, direccion: centroA.direccion, municipio: centroA.municipio, departamento: centroA.departamento, docente: '', logo: LOGO, logoSec: '', grado: '6', seccion: '1', gradoSeccion: '6º-1', anio: '2027' };
localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': perfilA }, centros: [centroA] }));

let r = imprimir();
ok(r.r === 'aviso' && !r.html, 'sin examen generado, la misión avisa y no se pregunta nada');
sandbox._evalPrintData = { listo: true };

r = imprimir();
ok(r.html === DOC, '(a) sin sesión: la hoja sale byte por byte como hoy, aunque el perfil esté en el aparato');

localStorage.setItem('METAS_DOCENTE_V1', SESION);
const abrirAntes = sandbox.open;
r = imprimir();
ok(r.html.includes('data-metas-encabezado="centro"') && r.html.includes('CENTRO FICTICIO LAS FLORES') && r.html.includes(LOGO) && !visible(r.html).includes('Centro Educativo:'),
  '(b) docente con un centro: logo y nombre arriba, sin la raya en blanco');
ok(r.html.includes('Docente: Docente Ficticia'), '(b) con el docente que trae el centro');
ok(!r.html.includes('6º-1'), '(b) el grado no se llena: lo escribe el alumno');
ok(sandbox.open === abrirAntes, 'después de imprimir, window.open queda como estaba');

localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': perfilA }, centros: [Object.assign({}, centroA, { docente: '' })] }));
r = imprimir();
ok(r.html.includes('Docente: Docente De La Cuenta'), 'si el centro no trae docente, va el nombre de la cuenta');
localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify({ codigo: 'DOC-FICTICIO' }));
r = imprimir();
ok(!r.html.includes('Docente:') && r.html.includes('Colonia Ficticia, Villanueva</div>'), 'y si tampoco hay nombre en la cuenta, no dice «Docente:»');

localStorage.setItem('METAS_DOCENTE_V1', SESION);
localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': perfilA }, centros: [Object.assign({}, centroA, { nombre: '  ' })] }));
r = imprimir();
ok(r.html.replace(' data-metas-encabezado="sin"', '') === DOC, 'un centro sin nombre no cuenta: la hoja de siempre, sin logo ni nombre a medias');

localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': perfilA }, centros: [centroA] }));
localStorage.removeItem('METAS_DOCENTE_V1');
r = imprimir();
ok(r.html === DOC, '(e) el docente cerró sesión: la hoja vuelve a salir como hoy, con la raya en blanco');
ok(JSON.parse(localStorage.getItem('METAS_CENTRO_LECTURA')).centros.length === 1, '(e) y el perfil sigue guardado: no se borró nada');

/* (c) qué centro sale, sin preguntar */
console.log('\n── (c) el centro activo, sin selector ──');
const centroB = { id: 'c-b', nombre: 'Escuela Ficticia El Porvenir', logo: LOGO2, direccion: '', municipio: 'Danlí', departamento: 'El Paraíso', docente: 'Docente Del Porvenir' };
const perfilB = Object.assign({}, perfilA, { id: 'c-b', nombre: centroB.nombre, direccion: '', municipio: 'Danlí', departamento: 'El Paraíso', docente: 'Docente Del Porvenir', logo: LOGO2, seccion: '2', gradoSeccion: '6º-2' });
const copiaDos = extra => JSON.stringify(Object.assign({ actual: 'aula-2', porAula: { 'aula-1': perfilA, 'aula-2': perfilB }, centros: [centroA, centroB] }, extra || {}));
localStorage.setItem('METAS_DOCENTE_V1', SESION);
localStorage.removeItem('METAS_EXAMEN_CENTRO_V1');
let dibujos = 0;
const appendAntes = sandbox.document.body;
sandbox.document.body = { appendChild() { dibujos++; } };

localStorage.setItem('METAS_CENTRO_LECTURA', copiaDos());
r = imprimir();
ok(r.r === 'impreso' && r.html.includes('ESCUELA FICTICIA EL PORVENIR') && !r.html.includes('LAS FLORES'),
  '(c) con dos centros y el 6º-2 activo, sale el del grupo activo, en el mismo toque');
ok(dibujos === 0 && !sandbox.document.getElementById('metas-centro-velo'), '(c) y no se dibuja ningún selector');
ok(localStorage.getItem('METAS_EXAMEN_CENTRO_V1') === 'c-b', '(c) queda anotado como el último con que se imprimió');
localStorage.setItem('METAS_CENTRO_LECTURA', copiaDos({ actual: 'aula-1' }));
r = imprimir();
ok(r.html.includes('CENTRO FICTICIO LAS FLORES') && localStorage.getItem('METAS_EXAMEN_CENTRO_V1') === 'c-a', '(c) al cambiar de grupo en Mi aula, cambia el centro del examen');

const ca = (localStorage.setItem('METAS_CENTRO_LECTURA', copiaDos()), MC.centroActual());
ok(ca && JSON.stringify(Object.keys(ca).sort()) === JSON.stringify(Object.keys(MC.centros()[0]).sort()) && ca.id === 'c-b' && ca.docente === 'Docente Del Porvenir',
  'MetasCentro.centroActual() devuelve el centro activo con los mismos campos que centros()', JSON.stringify(ca));

localStorage.removeItem('METAS_EXAMEN_CENTRO_V1');
localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ porAula: {}, centros: [centroB] }));
ok(MC.centroActual() === null, 'sin grupo activo, centroActual() es null');
r = imprimir();
ok(r.html.includes('ESCUELA FICTICIA EL PORVENIR'), '(c) sin activo y con un solo centro, sale ese');

localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ porAula: {}, centros: [centroA, centroB] }));
localStorage.setItem('METAS_EXAMEN_CENTRO_V1', 'c-b');
r = imprimir();
ok(r.html.includes('ESCUELA FICTICIA EL PORVENIR') && dibujos === 0, '(c) sin activo y con varios, el último con que se imprimió, sin preguntar');
localStorage.setItem('METAS_EXAMEN_CENTRO_V1', 'c-que-ya-no-esta');
r = imprimir();
ok(r.html.replace(' data-metas-encabezado="sin"', '') === DOC, '(c) si el último ya no existe, la hoja sin encabezado personalizado');
localStorage.setItem('METAS_EXAMEN_CENTRO_V1', 'sin');
r = imprimir();
ok(r.html.replace(' data-metas-encabezado="sin"', '') === DOC, '(c) el «Sin encabezado» que guardaba el selector viejo tampoco inventa un centro');
localStorage.removeItem('METAS_EXAMEN_CENTRO_V1');
r = imprimir();
ok(r.html.includes('data-metas-encabezado="sin"') && dibujos === 0, '(c) varios y ningún último: la hoja sin encabezado, y sin preguntar');

console.log('\n── un centro activo archivado ──');
localStorage.setItem('METAS_EXAMEN_CENTRO_V1', 'c-b');
localStorage.setItem('METAS_CENTRO_LECTURA', copiaDos({ centros: [centroA], archivados: ['c-b'] }));
ok(MC.centroActual() === null && MC.centros().length === 1, 'el centro activo archivado no es el actual ni está en la lista');
r = imprimir();
ok(r.html.includes('CENTRO FICTICIO LAS FLORES') && !r.html.includes('EL PORVENIR'), 'el examen no lo usa: queda el único centro que hay');
localStorage.setItem('METAS_CENTRO_LECTURA', copiaDos({ centros: [centroA, centroB], archivados: ['c-b'] }));
ok(MC.centroActual() === null && MC.centros().map(c => c.id).join() === 'c-a', 'con la copia de la lista todavía vieja, los ids archivados también lo sacan');
localStorage.setItem('METAS_CENTRO_LECTURA', copiaDos({ centros: [centroA] }));
ok(MC.centroActual() === null, 'y si la lista de la base ya no lo trae, tampoco es el actual');
localStorage.setItem('METAS_CENTRO_LECTURA', copiaDos({ centros: [centroA, Object.assign({}, centroB, { deleted_at: '2027-03-01T00:00:00Z' })] }));
ok(MC.centroActual() === null && MC.centros().length === 1, 'un centro con deleted_at en la copia tampoco');
r = imprimir();
ok(r.html.includes('CENTRO FICTICIO LAS FLORES') && dibujos === 0, 'y el examen sale con el que queda');
sandbox.document.body = appendAntes;
localStorage.removeItem('METAS_EXAMEN_CENTRO_V1');

/* ══════════ 4 · La lista de centros ══════════ */
console.log('\n── la lista de centros ──');
function apiDe(tablas) {
  return { lista(t) { return (tablas[t] || []).map(x => Object.assign({}, x)); } };
}
const filasCentros = [
  { id: 'c-b', nombre: 'Centro Ficticio Nuevo', logo: LOGO2, direccion: '', municipio: 'Danlí', departamento: 'El Paraíso', anio_lectivo: 2027, created_at: '2027-02-01T00:00:00Z' },
  { id: 'c-a', nombre: centroA.nombre, logo: LOGO, direccion: centroA.direccion, municipio: centroA.municipio, departamento: centroA.departamento, anio_lectivo: 2027, created_at: '2027-01-01T00:00:00Z' },
  { id: 'c-a', nombre: centroA.nombre, logo: LOGO, anio_lectivo: 2027, created_at: '2027-01-01T00:00:00Z' },
];
const filasAulas = [{ id: 'aula-1', centro_id: 'c-a', grado: 6, seccion: '1', escuela: centroA.nombre, docente_nombre: 'Docente Del Grupo' }];
localStorage.removeItem('METAS_CENTRO_LECTURA');
MC.refrescar(apiDe({ centros: filasCentros, aulas: filasAulas }), 'aula-1');
const copia = JSON.parse(localStorage.getItem('METAS_CENTRO_LECTURA'));
ok(Array.isArray(copia.centros) && copia.centros.length === 2, 'refrescar guarda la lista de centros, sin repetidos', JSON.stringify(copia.centros && copia.centros.map(c => c.id)));
ok(copia.centros[0].id === 'c-a' && copia.centros[1].id === 'c-b', 'en el orden de Mi aula: el más antiguo primero');
ok(copia.centros[1].nombre === 'Centro Ficticio Nuevo' && copia.centros[1].municipio === 'Danlí',
  'incluye el centro que todavía no tiene grupos');
ok(JSON.stringify(Object.keys(copia.centros[0]).sort()) === JSON.stringify(['departamento', 'direccion', 'docente', 'id', 'logo', 'municipio', 'nombre']),
  'cada centro lleva id, nombre, logo, dirección, municipio, departamento y docente');
ok(copia.centros[0].docente === 'Docente Del Grupo', 'sin docente en el centro, se toma el del grupo, como en la pantalla del perfil');
ok(copia.actual === 'aula-1' && Object.keys(copia.porAula).join() === 'aula-1' && copia.porAula['aula-1'].nombre === centroA.nombre,
  'el perfil por grupo y el grupo abierto quedan como antes');

console.log('\n── archivados, con el motor de datos ──');
{
  const filasConArchivado = filasCentros.concat([{ id: 'c-x', nombre: 'Centro Archivado', anio_lectivo: 2027, created_at: '2026-12-01T00:00:00Z', deleted_at: '2027-03-01T00:00:00Z' }]);
  const api = Object.assign(apiDe({ centros: filasConArchivado, aulas: filasAulas }), { archivados: () => [{ id: 'c-x', deleted_at: '2027-03-01T00:00:00Z' }] });
  const guardada = localStorage.getItem('METAS_CENTRO_LECTURA');
  localStorage.removeItem('METAS_CENTRO_LECTURA');
  MC.refrescar(api, 'aula-1');
  const conArch = JSON.parse(localStorage.getItem('METAS_CENTRO_LECTURA'));
  ok(conArch.centros.map(c => c.id).join() === 'c-a,c-b' && JSON.stringify(conArch.archivados) === '["c-x"]',
    'refrescar deja fuera de la lista el centro archivado y guarda su id aparte', JSON.stringify(conArch.archivados));
  sandbox.MetasDatos = api;
  ok(MC.centros().map(c => c.id).join() === 'c-a,c-b', 'centros() con el motor de datos no trae el archivado');
  ok(MC.centroActual() && MC.centroActual().id === 'c-a', 'centroActual() con el motor de datos: el centro del aula activa');
  sandbox.MetasDatos = Object.assign(apiDe({ centros: filasCentros.map(c => c.id === 'c-a' ? Object.assign({}, c, { nombre: 'Nombre Más Reciente' }) : c), aulas: filasAulas }), { archivados: () => [] });
  ok(MC.centroActual().nombre === 'Nombre Más Reciente', 'y si la base tiene ese centro más reciente que la copia, gana la base');
  sandbox.MetasDatos = Object.assign(apiDe({ centros: filasCentros, aulas: filasAulas }), { archivados: () => [{ id: 'c-a' }] });
  ok(MC.centroActual() === null, 'el centro activo archivado en la base no es el actual');
  delete sandbox.MetasDatos;
  localStorage.setItem('METAS_CENTRO_LECTURA', guardada);
}

const sinApi = sandbox.MetasDatos;
ok(sinApi === undefined && MC.centros().length === 2 && MC.centros()[1].id === 'c-b', 'MetasCentro.centros() devuelve la lista desde la copia');
sandbox.MetasDatos = apiDe({ centros: filasCentros, aulas: filasAulas });
ok(MC.centros().length === 2, 'y con el motor de datos, desde la base');
delete sandbox.MetasDatos;

MC.refrescar(apiDe({ centros: [], aulas: filasAulas }), 'aula-1');
ok(JSON.parse(localStorage.getItem('METAS_CENTRO_LECTURA')).centros.length === 2, 'una lista vacía de la base no borra la que había');
localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': perfilA } }));
MC.refrescar(apiDe({ centros: filasCentros, aulas: [] }), null);
const sinGrupos = JSON.parse(localStorage.getItem('METAS_CENTRO_LECTURA'));
ok(sinGrupos.centros.length === 2 && sinGrupos.porAula['aula-1'] && sinGrupos.actual === 'aula-1',
  'un docente con centros y sin grupos también guarda la lista, sin tocar lo demás');
localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': perfilA, 'aula-2': perfilA } }));
ok(MC.centros().length === 1 && MC.centros()[0].nombre === centroA.nombre, 'una copia de antes (sin lista) se arma con los perfiles de sus grupos, sin repetir');

/* ══════════ 5 · Los impresos de Mi aula no cambian ══════════ */
console.log('\n── los impresos de Mi aula ──');
const grupo = {
  id: 'aula-1', escuela: '', grado: '6', seccion: '1', logo: '', logoSec: '',
  boleta: { director: '', docente: 'Docente Ficticia', lugar: '', municipio: '', departamento: '', anio: '2027', escalaPers: ['S', 'MB', 'B'] },
  lista: [{ num: 1, nombre: 'Alumna Ficticia Uno' }], materias: ['Matemáticas'], notas: {},
};
function boleta(g) {
  chunks.length = 0;
  sandbox.adPrintBoletas(g, null);
  return chunks.join('');
}
function impresos() {
  const pi = MC.paraImpreso(grupo);
  return JSON.stringify({
    boleta: boleta(pi),
    paraImpreso: pi,
    marca: MC.marca(),
    get: MC.get('aula-1'),
    textoCentro: MC.textoCentro(grupo, 'Escrito a mano'),
  });
}
/* La copia como la escribe main (sin la lista) y como la escribe ahora. */
const copiaDeAntes = JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': copia.porAula['aula-1'] } });
const copiaDeAhora = JSON.stringify(copia);
const salidas = [];
for (const [rotulo, guardada, sesion] of [
  ['copia de antes, sin sesión', copiaDeAntes, null],
  ['copia de antes, con sesión', copiaDeAntes, SESION],
  ['copia nueva, sin sesión', copiaDeAhora, null],
  ['copia nueva, con sesión', copiaDeAhora, SESION],
]) {
  localStorage.setItem('METAS_CENTRO_LECTURA', guardada);
  if (sesion) localStorage.setItem('METAS_DOCENTE_V1', sesion); else localStorage.removeItem('METAS_DOCENTE_V1');
  salidas.push([rotulo, impresos()]);
}
ok(salidas[0][1].includes('CENTRO FICTICIO LAS FLORES') && salidas[0][1].includes(LOGO), 'la boleta de referencia lleva el centro y el logo');
ok(salidas.every(s => s[1] === salidas[0][1]), 'boleta, paraImpreso, marca, get y textoCentro salen iguales en los cuatro casos',
  salidas.filter(s => s[1] !== salidas[0][1]).map(s => s[0]).join(', '));

const conPh = [];
for (const f of archivosJs(path.join(RAIZ, 'js/tools')).concat([path.join(RAIZ, 'js/app.js')])) {
  if (fs.readFileSync(f, 'utf8').includes('class="ph"')) conPh.push(path.relative(RAIZ, f));
}
ok(!conPh.length, 'ningún impreso de Mi aula usa la hoja de examen (class="ph"): examen() no los toca', conPh.join(', '));

console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ El examen impreso lleva el centro activo del docente con sesión, sin preguntar, y todo lo demás sale como hoy');
process.exit(fallos ? 1 : 0);
