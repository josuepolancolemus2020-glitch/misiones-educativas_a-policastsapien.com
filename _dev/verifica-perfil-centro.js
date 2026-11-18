/* =====================================================================
   M.E.T.A.S · Perfil del centro en los impresos
   ---------------------------------------------------------------------
   Con datos ficticios:
   · el encabezado de una boleta sale igual, byte por byte, cuando los
     datos son los mismos (salgan del grupo a mano o del perfil);
   · un examen lleva el centro y el grado, y el logo arriba a la izquierda;
   · sin perfil, las rayas del examen quedan como están.

   Uso: node _dev/verifica-perfil-centro.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };

const mem = {};
const localStorage = {
  getItem(k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
  setItem(k, v) { mem[k] = String(v); },
  removeItem(k) { delete mem[k]; },
};
const chunks = [];
function ventanaVacia() {
  const doc = {
    write(t) { chunks.push(String(t)); },
    close() {},
  };
  return { document: doc, close() {}, focus() {}, print() {} };
}
const sandbox = {
  console,
  localStorage,
  location: { href: 'http://127.0.0.1:8080/index.html' },
  URL,
  setTimeout,
  clearTimeout,
  document: {
    addEventListener() {},
    removeEventListener() {},
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    createElement() { return { style: {}, getContext() { return { drawImage() {} }; } }; },
    readyState: 'complete',
  },
  navigator: {},
  open: ventanaVacia,
  addEventListener() {},
  removeEventListener() {},
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

function cargar(rel) {
  vm.runInContext(fs.readFileSync(path.join(RAIZ, rel), 'utf8'), sandbox, { filename: rel });
}

cargar('js/metas-centro.js');
cargar('js/tools/registros-admin.js');

const MC = sandbox.MetasCentro;
const LOGO = 'data:image/jpeg;base64,QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo=';
const perfil = {
  nombre: 'Centro Ficticio Las Flores',
  direccion: 'Colonia Ficticia',
  aldea: 'Aldea Ficticia',
  municipio: 'Villanueva',
  departamento: 'Cortés',
  codigoSace: '000000000000',
  director: 'Directora Ficticia',
  anio: '2027',
  modalidad: 'No aplica',
  jornada: 'Matutina',
  logo: LOGO,
  logoSec: '',
  grado: '6',
  seccion: '1',
  gradoSeccion: '6º-1',
};
const alumno = { num: 1, nombre: 'Alumna Ficticia Uno' };

function grupoCon(datos) {
  return {
    id: '00000000-0000-0000-0000-0000000a0001',
    escuela: datos.escuela,
    grado: '6',
    seccion: '1',
    logo: datos.logo,
    logoSec: datos.logoSec || '',
    boleta: {
      director: datos.director,
      docente: 'Docente Ficticia',
      lugar: datos.lugar,
      municipio: datos.municipio,
      departamento: datos.departamento,
      anio: '2027',
      codigoCentro: datos.codigoCentro || '',
      modalidad: datos.modalidad || '',
      jornada: datos.jornada || '',
      aldea: datos.aldea || '',
      escalaPers: ['S', 'MB', 'B'],
    },
    lista: [alumno],
    materias: ['Matemáticas'],
    notas: {},
  };
}

function boleta(g) {
  chunks.length = 0;
  sandbox.adPrintBoletas(g, null);
  return chunks.join('');
}
function encabezado(html) {
  const a = html.indexOf('<header class="bl-head">');
  const b = html.indexOf('</header>', a);
  return a >= 0 && b > a ? html.slice(a, b + '</header>'.length) : '';
}

const aMano = grupoCon({
  escuela: perfil.nombre, logo: perfil.logo, director: perfil.director, lugar: perfil.direccion,
  municipio: perfil.municipio, departamento: perfil.departamento, codigoCentro: perfil.codigoSace,
  modalidad: perfil.modalidad, jornada: perfil.jornada, aldea: perfil.aldea,
});
const desdePerfil = MC.aplicar(grupoCon({
  escuela: '', logo: '', director: '', lugar: '', municipio: '', departamento: '',
}), perfil);
const cabA = encabezado(boleta(aMano));
const cabB = encabezado(boleta(desdePerfil));
ok(cabA.length > 80 && cabA === cabB, 'el encabezado de la boleta es idéntico cuando los datos son los mismos');
ok(cabA.includes('CENTRO FICTICIO LAS FLORES') && cabA.includes(LOGO) && cabA.includes('Villanueva'),
  'ese encabezado trae el nombre, el logo y el municipio');

const jpeg = MC.jpeg.toString();
ok(jpeg.includes("toDataURL('image/jpeg', 0.72)") && jpeg.includes('drawImage') && !/grayscale|saturate\(0\)|blanco y negro/i.test(jpeg),
  'el logo se guarda como el JPEG a color de hoy, sin pasarlo a blanco y negro');

const centena = fs.readFileSync(path.join(RAIZ, 'misiones/1ciclo-segundo-grado/js/centena.js'), 'utf8');
const trozo = (centena.match(/<div class="ph"><h2>[\s\S]*?<\/p><\/div>/) || [''])[0];
ok(trozo.includes('<strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span>')
  && trozo.includes('<strong>Grado:</strong><span class="ph-s">&nbsp;</span>')
  && trozo.includes('<strong>Nombre:</strong><span class="ph-fill">&nbsp;</span>')
  && trozo.includes('<strong>N.º:</strong>'),
  'el examen de referencia sigue con las rayas en el código');

const igual = MC.examen(trozo);
ok(igual === trozo, 'sin perfil, el examen queda con las mismas rayas');

localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-ficticia', porAula: { 'aula-ficticia': perfil } }));
const lleno = MC.examen(trozo);
ok(lleno.includes('Centro Ficticio Las Flores') && lleno.includes('6º-1') && lleno.includes('data-metas-logo') && lleno.includes(LOGO),
  'con perfil, el examen lleva el centro, el grado y el logo');
ok(lleno.includes('<strong>Nombre:</strong><span class="ph-fill">&nbsp;</span>')
  && lleno.includes('<strong>Parcial:</strong><span class="ph-s">&nbsp;</span>')
  && lleno.includes('<strong>Fecha:</strong><span class="ph-m">&nbsp;</span>')
  && /<strong>N\.º:<\/strong><span class="ph-xs">&nbsp;<\/span>/.test(lleno),
  'nombre, parcial, fecha y N.º siguen en blanco');
ok(lleno.indexOf('data-metas-logo') < lleno.indexOf('<h2>'), 'el logo queda arriba a la izquierda del bloque');
ok(MC.examen(lleno) === lleno, 'llenarlo otra vez no lo duplica');

chunks.length = 0;
const win = sandbox.open();
win.document.write(trozo);
const escrito = chunks.join('');
ok(escrito.includes('Centro Ficticio Las Flores') && escrito.includes('6º-1'),
  'la ventana de impresión del examen también lo llena');

localStorage.removeItem('METAS_CENTRO_LECTURA');
ok(MC.examen(trozo) === trozo, 'al quitar el perfil vuelven las rayas');

const viejo = {
  v: 2,
  grupos: [{
    id: 'GFICT1', escuela: 'Centro Ficticio Las Flores', grado: '6', seccion: '1',
    logo: LOGO, logoSec: '',
    boleta: { director: 'Directora Del Aparato', lugar: 'Calle Vieja', municipio: 'Villanueva', departamento: 'Cortés', anio: '2026' },
  }],
};
localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(viejo));
const aula = { id: 'a1', escuela: 'Centro Ficticio Las Flores', grado: 6, seccion: '1', anio_lectivo: 2027, lugar: 'Calle De La Base' };
const soloAula = MC.valoresIniciales(aula, null);
ok(soloAula.campos.direccion.valor === 'Calle De La Base' && soloAula.campos.direccion.origen === 'aula',
  'lo que ya está en el aula no lo pisa el aparato');
ok(soloAula.campos.logo.valor === LOGO && soloAula.campos.logo.origen === 'aparato' && soloAula.ofrecido,
  'el logo viejo del aparato se ofrece, y todavía no es la base');
const conBase = MC.valoresIniciales(aula, { nombre: 'Centro Ficticio Las Flores', direccion: 'Dirección Guardada', logo: '' });
ok(conBase.campos.direccion.valor === 'Dirección Guardada' && conBase.campos.direccion.origen === 'base',
  'lo que ya está en la base se queda');

const motor = fs.readFileSync(path.join(RAIZ, 'js/motor-mision.js'), 'utf8');
ok(motor.includes('<strong>Instituto:</strong><span class="ph-fill">&nbsp;</span>')
  && motor.includes('<strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span>'),
  'el motor compartido tampoco trae el centro escrito en el diseño');
const instituto = '<div class="ph"><h2>Título</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>N.º Lista:</strong><span class="ph-xs">&nbsp;</span></div></div>';
localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-ficticia', porAula: { 'aula-ficticia': perfil } }));
const inst = MC.examen(instituto);
ok(inst.includes('>Centro Ficticio Las Flores</span>') && inst.includes('>6º-1</span>') && inst.includes('<strong>N.º Lista:</strong><span class="ph-xs">&nbsp;</span>'),
  'Instituto y Grado y Sección también se llenan, y el número sigue en blanco');

console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ El perfil del centro llega a la boleta y al examen sin cambiar el diseño');
process.exit(fallos ? 1 : 0);
