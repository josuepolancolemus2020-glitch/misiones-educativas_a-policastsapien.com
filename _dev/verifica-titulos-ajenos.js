#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · Una misión nueva no lleva el nombre de otra
   ------------------------------------------------------------
   La página de una misión de la plantilla (js/motor-mision.js) no la
   arma el motor: se calca de la de otra misión y se le cambia a mano lo
   que lleva el nombre escrito. Son ocho sitios, y tres de ellos no se
   ven al abrir la misión: el encabezado del examen, el de la prueba de
   pensamiento crítico y la constancia. Una misión de Español que en su
   hoja de examen dice «La Célula» se descubre el día que el maestro la
   reparte.

   Por cada misión de la plantilla se mira:

   1. SU NOMBRE ESTÁ DONDE TIENE QUE ESTAR. El título de la pestaña, el
      de compartir (og:title), el <h1>, los dos encabezados de examen, los
      dos títulos de examen en pantalla y la constancia llevan el título
      que la misión declara (`TEXTOS.titulo`). El encabezado de la
      evaluación lleva además su materia. La dirección de compartir (og:url) es la
      de su carpeta y su archivo.
   2. NO QUEDA EL NOMBRE DE OTRA. En todo lo que se lee de la página no
      aparece el título de ninguna otra misión: ni los del catálogo
      (js/data/misiones.js) ni los de las demás misiones de la plantilla,
      que pueden no estar todavía en el catálogo. Un título ajeno solo se
      admite dentro de un enlace a ESA misión («repasa en Marcadores
      Textuales»): eso es nombrarla, no un resto.
      El título se busca con la mayúscula de su nombre («La Célula», «de
      la Célula») y no en minúscula: «la célula» en una oración es la
      palabra, no la misión.
   3. NO COMPARTE LLAVE NI TÍTULO. Dos misiones de la plantilla con la
      misma `SAVE_KEY` se pisan el progreso del alumno; con el mismo
      título, se confunden en la hoja impresa.
   4. ENSAYO: la sonda tiene que poder ponerse roja. Se toma la página de
      una misión, se le dice que se llama de otra manera (en la memoria,
      sin tocar el archivo) y se exige que la sonda encuentre el nombre
      viejo en sus encabezados de examen y en la constancia.

     node _dev/verifica-titulos-ajenos.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const DIR = path.join(RAIZ, 'misiones');
const SITIO = 'https://metas.policastsapien.com/';

let fallos = 0;
const ok = (nombre, cond, detalle) => { console.log((cond ? '  ✔ ' : '  ✘ ') + nombre); if (!cond) { fallos++; if (detalle) console.log(detalle); } };
const lista = xs => xs.slice(0, 12).map(x => '      ' + x).join('\n') + (xs.length > 12 ? '\n      … y ' + (xs.length - 12) + ' más' : '');
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ── los títulos que existen ─────────────────────────────────── */
function catalogo() {
  const caja = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js', 'data', 'misiones.js'), 'utf8') + '\n;this.__m = MISSIONS;', caja);
  return caja.__m.map(m => ({ titulo: m.title, carpeta: (/misiones\/([^/]+)\//.exec(m.url || '') || [])[1] || '' })).filter(m => m.titulo && m.carpeta);
}

/* Las misiones de la plantilla, con lo que declaran de sí mismas. */
function dePlantilla() {
  const salida = [];
  fs.readdirSync(DIR).sort().forEach(carpeta => {
    const dir = path.join(DIR, carpeta);
    if (!fs.statSync(dir).isDirectory()) return;
    fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
      const html = fs.readFileSync(path.join(dir, f), 'utf8');
      if (!/<script[^>]*\ssrc="[^"]*js\/motor-mision\.js/.test(html)) return;
      const rutaCont = path.join(dir, 'js', 'contenido.js');
      const caja = vm.createContext({});
      let titulo = '', materia = '', llave = '';
      try {
        vm.runInContext(fs.readFileSync(rutaCont, 'utf8') + "\n;this.__t = typeof TEXTOS !== 'undefined' ? TEXTOS : {}; this.__k = typeof SAVE_KEY !== 'undefined' ? SAVE_KEY : '';", caja);
        titulo = caja.__t.titulo || ''; materia = caja.__t.materia || ''; llave = caja.__k || '';
      } catch (e) { /* un contenido que no carga lo dice verifica-misiones-motor */ }
      salida.push({ carpeta, archivo: f, html, titulo, materia, llave });
    });
  });
  return salida;
}

/* ── leer la página ──────────────────────────────────────────── */
const sinEtiquetas = t => t.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/* Los ocho sitios donde va escrito el nombre de la misión. */
function sitiosDelNombre(html) {
  const uno = (re, nombre) => { const m = re.exec(html); return { nombre, texto: m ? sinEtiquetas(m[1]) : null }; };
  const encabezados = [...html.matchAll(/<div class="eval-print-header">\s*<h2>([\s\S]*?)<\/h2>/g)].map((m, i) => ({ nombre: 'el encabezado de ' + (i === 0 ? 'la evaluación' : 'la prueba crítica'), texto: sinEtiquetas(m[1]), examen: true, conMateria: i === 0 }));
  return [
    uno(/<title>([\s\S]*?)<\/title>/, 'el título de la pestaña (<title>)'),
    uno(/<meta property="og:title" content="([^"]*)"/, 'el título al compartir (og:title)'),
    uno(/<h1[^>]*>([\s\S]*?)<\/h1>/, 'el título grande (<h1>)'),
    uno(/id="eval-screen-title"[^>]*>([\s\S]*?)<\/h2>/, 'el título de la evaluación en pantalla'),
    uno(/id="evalcrit-screen-title"[^>]*>([\s\S]*?)<\/h2>/, 'el título de la prueba crítica en pantalla'),
    uno(/class="diploma-sub"[^>]*>([\s\S]*?)<\/div>/, 'la constancia')
  ].concat(encabezados);
}

/* Lo que se lee de la página: su texto y lo que va escrito en atributos
   que alguien lee (la descripción, los rótulos). Fuera los comentarios,
   los guiones y los estilos; y fuera cada enlace a otra misión, con su
   texto: nombrar a la misión a la que se enlaza no es un resto. */
function loQueSeLee(html, carpeta) {
  let t = html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ');
  t = t.replace(/<a\b[^>]*\shref="([^"]*)"[^>]*>[\s\S]*?<\/a>/gi, (todo, href) => {
    const m = /misiones\/([^/]+)\//.exec(href) || /^\.\.\/([^/.][^/]*)\//.exec(href);
    return m && m[1] !== carpeta ? ' ' : todo;
  });
  const atributos = [...t.matchAll(/\s(?:content|aria-label|title|alt|placeholder)="([^"]*)"/g)].map(m => m[1]);
  return sinEtiquetas(t) + ' · ' + atributos.join(' · ');
}

/* El título, con la mayúscula de su nombre. La primera palabra (casi
   siempre el artículo) puede ir en minúscula: «de la Célula». Lo demás va
   como en el título, y entre palabras completas. */
function reTitulo(titulo) {
  const [primera, ...resto] = titulo.split(/\s+/);
  /* «Escribir por etapas» no lleva más mayúscula que la primera: en
     minúscula es una frase cualquiera, y solo se busca tal como se titula. */
  const hayNombre = resto.some(p => /^\p{Lu}/u.test(p));
  const cabeza = hayNombre ? '[' + esc(primera[0].toUpperCase()) + esc(primera[0].toLowerCase()) + ']' + esc(primera.slice(1)) : esc(primera);
  return new RegExp('(?<![\\p{L}\\p{N}])' + [cabeza].concat(resto.map(esc)).join('\\s+') + '(?![\\p{L}\\p{N}])', 'u');
}

/* Lo que está mal en una página, sabiendo cómo se llama su misión y cómo
   se llaman las demás. Devuelve renglones; ninguno, si está limpia. */
function revisa(m, ajenos) {
  const mal = [];
  sitiosDelNombre(m.html).forEach(s => {
    if (s.texto === null) { mal.push('no se encuentra ' + s.nombre); return; }
    if (!s.texto.includes(m.titulo)) mal.push(s.nombre + ' no lleva su título («' + m.titulo + '»): «' + s.texto.slice(0, 90) + '»');
    if (s.conMateria && m.materia && !s.texto.includes(m.materia)) mal.push(s.nombre + ' no lleva su materia («' + m.materia + '»): «' + s.texto.slice(0, 90) + '»');
  });
  if (sitiosDelNombre(m.html).filter(s => s.examen).length < 1) mal.push('no se encuentra el encabezado de la evaluación (.eval-print-header)');
  const og = (/<meta property="og:url" content="([^"]*)"/.exec(m.html) || [])[1];
  const suya = SITIO + 'misiones/' + m.carpeta + '/' + m.archivo;
  if (og !== suya) mal.push('la dirección al compartir (og:url) es «' + og + '» y la suya es «' + suya + '»');
  const texto = loQueSeLee(m.html, m.carpeta);
  ajenos.forEach(a => {
    /* Un título que cabe dentro del propio, o al revés, no se puede
       distinguir del propio: se deja pasar y se dice. */
    if (a.titulo === m.titulo || m.titulo.includes(a.titulo) || a.titulo.includes(m.titulo)) return;
    const hallado = reTitulo(a.titulo).exec(texto);
    if (hallado) mal.push('dice «' + a.titulo + '», que es otra misión (' + a.carpeta + '): «…' + texto.slice(Math.max(0, hallado.index - 40), hallado.index + a.titulo.length + 30) + '…»');
  });
  return mal;
}

/* ── recorrer ────────────────────────────────────────────────── */
const misiones = dePlantilla();
const titulos = catalogo();
misiones.forEach(m => { if (m.titulo && !titulos.some(t => t.carpeta === m.carpeta)) titulos.push({ titulo: m.titulo, carpeta: m.carpeta }); });

console.log('— Las misiones de la plantilla (' + misiones.length + ') contra los ' + titulos.length + ' títulos que existen —');
ok('hay al menos una misión de la plantilla y el catálogo trae títulos', misiones.length >= 1 && titulos.length >= 80, '      misiones: ' + misiones.length + ' · títulos: ' + titulos.length);
misiones.forEach(m => {
  if (!m.titulo) { ok(m.carpeta + ': declara su título (TEXTOS.titulo)', false, '      sin título no se puede saber qué nombre es el suyo'); return; }
  const mal = revisa(m, titulos.filter(t => t.carpeta !== m.carpeta));
  ok(m.carpeta + ' («' + m.titulo + '»): lleva su nombre en sus sitios y no el de otra misión', mal.length === 0, lista(mal));
});

console.log('— Ninguna comparte llave ni título —');
const repetido = campo => { const visto = {}, rep = []; misiones.forEach(m => { if (!m[campo]) return; if (visto[m[campo]]) rep.push(m[campo] + ': ' + visto[m[campo]] + ' y ' + m.carpeta); else visto[m[campo]] = m.carpeta; }); return rep; };
ok('cada una guarda el progreso en su propia llave (SAVE_KEY)', repetido('llave').length === 0, lista(repetido('llave')));
ok('cada una tiene su propio título', repetido('titulo').length === 0, lista(repetido('titulo')));
/* Y contra las misiones de antes, que declaran su llave en su archivo. */
const llavesDeAntes = {};
fs.readdirSync(DIR).forEach(carpeta => {
  const dirJs = path.join(DIR, carpeta, 'js');
  if (!fs.existsSync(dirJs) || misiones.some(m => m.carpeta === carpeta)) return;
  fs.readdirSync(dirJs).filter(f => f.endsWith('.js')).forEach(f => {
    const m = /(?:const|let|var)\s+SAVE_KEY\s*=\s*['"]([^'"]+)['"]/.exec(fs.readFileSync(path.join(dirJs, f), 'utf8'));
    if (m) llavesDeAntes[m[1]] = carpeta;
  });
});
const pisadas = misiones.filter(m => m.llave && llavesDeAntes[m.llave]).map(m => m.carpeta + ' usa «' + m.llave + '», que es la de ' + llavesDeAntes[m.llave]);
ok('y ninguna usa la llave de una misión de antes (' + Object.keys(llavesDeAntes).length + ' llaves miradas)', pisadas.length === 0, lista(pisadas));

/* ── ensayo ──────────────────────────────────────────────────── */
console.log('— Ensayo: una página calcada a la que no se le cambió el nombre —');
(function ensayo() {
  const base = misiones.find(m => m.titulo);
  if (!base) { ok('hay una misión con la que ensayar', false); return; }
  /* La misma página, pero la misión «se llama» de otra manera y vive en
     otra carpeta: es lo que queda al calcarla sin cambiar nada. */
  const calcada = Object.assign({}, base, { carpeta: '3ciclo-mision-de-ensayo', archivo: 'mision-de-ensayo.html', titulo: 'Misión de Ensayo', materia: 'Materia de Ensayo' });
  const mal = revisa(calcada, titulos.concat([{ titulo: base.titulo, carpeta: base.carpeta }]));
  const ve = t => mal.some(x => x.includes(t));
  ok('ve que el encabezado de la evaluación y el de la prueba crítica llevan otro nombre', ve('el encabezado de la evaluación no lleva su título') && ve('el encabezado de la prueba crítica no lleva su título'), lista(mal));
  ok('ve la materia ajena en el encabezado, la constancia y la dirección al compartir', ve('no lleva su materia') && ve('la constancia no lleva su título') && ve('og:url'), lista(mal));
  ok('y encuentra el título de la misión de origen («' + base.titulo + '») en lo que se lee', ve('dice «' + base.titulo + '», que es otra misión'), lista(mal));
  /* Lo que NO es un resto: la palabra en minúscula y el enlace a la otra. */
  const limpia = Object.assign({}, calcada, {
    html: '<title>Misión de Ensayo</title><meta property="og:title" content="Misión de Ensayo"><meta property="og:url" content="' + SITIO + 'misiones/3ciclo-mision-de-ensayo/mision-de-ensayo.html">'
      + '<h1>Misión de Ensayo</h1><p>' + base.titulo.toLowerCase() + ' es una palabra de la oración.</p>'
      + '<p>Repásalo en <a href="../' + base.carpeta + '/' + base.archivo + '">' + base.titulo + '</a>.</p>'
      + '<div class="eval-print-header">\n<h2>Evaluación · Misión de Ensayo · Materia de Ensayo</h2></div><h2 id="eval-screen-title">Misión de Ensayo</h2>'
      + '<div class="eval-print-header">\n<h2>Crítica · Misión de Ensayo · Materia de Ensayo</h2></div><h2 id="evalcrit-screen-title">Misión de Ensayo</h2><div class="diploma-sub">Misión de Ensayo</div>'
  });
  const falsas = revisa(limpia, titulos.concat([{ titulo: base.titulo, carpeta: base.carpeta }]));
  ok('no acusa a la palabra en minúscula ni al enlace que nombra a la otra misión', falsas.length === 0, lista(falsas));
})();

console.log(fallos === 0 ? '\n✅ Las ' + misiones.length + ' misiones de la plantilla llevan su nombre y ninguna el de otra.' : '\n❌ ' + fallos + ' fallo(s).');
process.exit(fallos === 0 ? 0 : 1);
