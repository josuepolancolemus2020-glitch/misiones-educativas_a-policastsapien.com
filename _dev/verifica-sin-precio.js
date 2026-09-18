#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────────────────
   M.E.T.A.S · Una actividad no anuncia su precio

   Pedido por el autor el 18 de septiembre de 2026, mirando el Quiz de la
   primera misión de Inteligencia Artificial: debajo del título había un
   renglón gris que decía «⭐ +5 XP por respuesta · solo la primera vez».
   Eso no es contenido: es un cartel que el alumno tiene que leer y
   descartar ANTES de empezar, en cada una de las diecinueve pestañas de la
   misión. Había 921 renglones así en 78 misiones.

   Y la normativa del asombro ya lo tenía escrito: lo que se persigue es
   que el alumno vuelva porque quiere ver qué pasa, no porque le prometen
   cinco puntos. Un precio en la puerta convierte la actividad en un
   trámite; la prueba de esta plataforma es «si le quitara el puntaje, ¿lo
   seguiría abriendo?», y un cartel con el puntaje la contesta al revés.

   ⚠️ Lo que SÍ se queda, y por eso esta sonda distingue:
     · la barra de XP, «🔄 Reiniciar XP» y el resumen del diploma —son el
       registro de lo que YA pasó, no una promesa—;
     · el COSTO de un comodín («🔦 Linterna (-2 XP)»), que es un dato que
       el alumno necesita para decidir si lo gasta;
     · el aviso de después de acertar («¡Correcto! +5 XP»), que informa de
       lo que acaba de ganar en vez de ofrecerlo por adelantado.

   Lo que se caza es el ANUNCIO: «+N XP por …», «+N XP al …». En el HTML no
   hace falta más, porque ahí el alumno solo lee; en el JS se pide además la
   estrella o la preposición, para no acusar a un mensaje de felicitación.

   ⚠️ Y se quitan los comentarios antes de buscar. Es la lección de siempre
   en este repositorio —ya mordió cinco veces—: el sitio donde se explica
   por qué algo no puede estar es justo donde ese algo sigue escrito.
   ───────────────────────────────────────────────────────────────────── */
'use strict';
const fs = require('fs'), path = require('path');
const RAIZ = path.join(__dirname, '..');

const ANUNCIO_HTML = /\+\s*\d+\s*XP/;
const ANUNCIO_JS   = /(⭐[^\n]{0,4}\+\s*\d+\s*XP)|(\+\s*\d+\s*XP\s+(?:por|al|si|para|cada)\b)/;

const sinComentariosHtml = s => s.replace(/<!--[\s\S]*?-->/g, '');
const sinComentariosJs   = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

function archivos(dir, filtro, fuera) {
  const out = [];
  (function anda(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) anda(p);
      else if (filtro.test(e.name) && !(fuera && fuera.test(p))) out.push(p);
    }
  })(dir);
  return out.sort();
}

const fallos = [];
function mira(f, texto, re) {
  texto.split('\n').forEach((l, i) => {
    const m = l.match(re);
    if (m) fallos.push({ f: path.relative(RAIZ, f), n: i + 1, t: l.trim().slice(0, 120) });
  });
}

const mis = archivos(path.join(RAIZ, 'misiones'), /\.html$/, /juego-[^/]*\.html$/);
mis.forEach(f => mira(f, sinComentariosHtml(fs.readFileSync(f, 'utf8')), ANUNCIO_HTML));

const jss = archivos(path.join(RAIZ, 'misiones'), /\.js$/, /html2canvas/)
  .concat([path.join(RAIZ, 'js', 'metas-i18n.js')]);
jss.forEach(f => mira(f, sinComentariosJs(fs.readFileSync(f, 'utf8')), ANUNCIO_JS));

console.log(`\n════ EL PRECIO NO SE ANUNCIA · ${mis.length} misiones y ${jss.length} archivos de JS ════\n`);
if (!fallos.length) {
  console.log('✅ Ninguna actividad le pone precio al alumno antes de empezar.\n');
  process.exit(0);
}
fallos.forEach(x => console.log(`  ❌ ${x.f}:${x.n}\n     ${x.t}`));
console.log(`\n❌ ${fallos.length} anuncio(s) de XP. Se quita la promesa y se deja lo demás del renglón.\n`);
process.exit(1);
