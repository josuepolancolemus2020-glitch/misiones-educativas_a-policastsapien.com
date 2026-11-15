/* ============================================================
   M.E.T.A.S · Ninguna página con las letras rotas
   ------------------------------------------------------------
   Medido el 15 de noviembre de 2026: cuatro páginas llevaban trece
   días publicadas con las tildes y los símbolos destruidos.

   | página              | «�» | lo que veía el maestro            |
   | consulta-nube.html  | 107 | «Contrase�a», «?? Exportar CSV»   |
   | registro.html       |  61 | «?? Evidencia de misiones �»      |
   | evaluaciones.html   |  48 | «Banco de Evaluaciones �»         |
   | mision.html         |  29 | «Misi�n � M.E.T.A.S.»             |

   Pasó en dos golpes y por eso no se arregla con un conversor:

     1. 2 nov (5dc321a9): una herramienta guardó los archivos en
        Windows-1252. Las tildes aguantaron; lo que esa tabla no
        tiene —✓ ✗ ⭐ ⏳ y todos los emojis— se volvió «?».
     2. 3 nov (c31510cf): otra leyó eso como si fuera UTF-8 y lo
        volvió a guardar. Cada tilde, cada ñ y cada raya quedó
        escrita para siempre como «�» (U+FFFD).

   El archivo resultante ES UTF-8 válido: por eso `file` decía que
   estaba bien y ninguna sonda se puso roja. El daño ya no es de
   codificación, es de contenido, y solo se ve leyendo.

   Y no era solo feo. En evaluaciones.html las llaves con las que
   se agrupan las misiones eran 'espa�ol', 'matem�ticas': ya no
   coincidían con el catálogo. Y en mision.html el acierto y el
   error se marcaban los dos con «?»: quedaban dichos solo con el
   color, que es justo lo que la normativa de accesibilidad prohíbe.

   Qué mira, en TODOS los .html del sitio:

     · que sea UTF-8 de verdad;
     · que no tenga ni un «�»;
     · que no tenga «?» donde iba un símbolo. Esto último no se
       puede saber con certeza —un «?» también es una pregunta—,
       así que se buscan las formas que deja el golpe 1 y que una
       persona no escribe: `content: '? '`, un texto que EMPIEZA
       por «??», una etiqueta que es solo «?» delante de un número.

   `www/` no se mira: es la copia para Android, no se edita a mano
   y se rehace entera con `npm run build:www`.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const FUERA = new Set(['node_modules', 'android', 'www', '.git']);

let fallos = 0;
const ok = (nombre, cond, detalle) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre);
  if (!cond) { fallos++; if (detalle) console.log(detalle); }
};

function htmls(dir, lista) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!FUERA.has(e.name)) htmls(path.join(dir, e.name), lista); }
    else if (e.name.endsWith('.html')) lista.push(path.join(dir, e.name));
  }
  return lista;
}

/* Las huellas del golpe 1. Cada una es una forma que NO sale de escribir a
   mano: se probaron contra los 249 .html del sitio y solo saltan en las
   cuatro páginas dañadas, tal como estaban publicadas.

   Lo que se dejó fuera a propósito, porque es castellano corriente:
   `</strong>? Toque una` (la pregunta termina después de una negrita) y
   `<span id="en-nom">?</span>` (el juego pone un «?» mientras no hay nombre). */
const HUELLAS = [
  { que: "content: '? ' en el CSS (iba ✓ o ✗)",
    re: /content:\s*(['"])\?+\s*\1/g },
  { que: 'texto que empieza por «??» (iba un emoji)',
    re: /(?<=[>'"`])\?{2,6}(?=[\s<&'"`.,])/g },
  { que: '«??» suelto al final de un texto (iba un emoji)',
    re: /(?<=[A-Za-záéíóúñ] )\?{2,6}(?=[<'"`.])/g },
  { que: '«?» entre espacios duros (iba una flecha)',
    re: /&nbsp;\?&nbsp;/g },
  { que: 'cadena que empieza por «? » y mayúscula (iba ✓, ✗ o ⭐)',
    re: /(?<=['"`])\? (?=[A-ZÁÉÍÓÚÑ])/g },
  { que: 'etiqueta que empieza por «? » y un número (iba ⭐)',
    re: /(?<=<[a-z][^<>]*>)\? (?=\d)/g },
  { que: 'párrafo que es solo «?» (iba ⏳ u otro símbolo)',
    re: /<p>\s*\?\s*<\/p>/g }
];

function donde(texto, indice) {
  const linea = texto.slice(0, indice).split('\n').length;
  const ini = texto.lastIndexOf('\n', indice) + 1;
  let fin = texto.indexOf('\n', indice); if (fin < 0) fin = texto.length;
  return { linea, trozo: texto.slice(ini, fin).trim().slice(0, 110) };
}

console.log('M.E.T.A.S · Ninguna página con las letras rotas');

const lista = htmls(RAIZ, []).sort();
const noUtf8 = [], conReemplazo = [], conHuella = [];

for (const ruta of lista) {
  const rel = path.relative(RAIZ, ruta).split(path.sep).join('/');
  const bytes = fs.readFileSync(ruta);
  let texto;
  try { texto = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
  catch (_) { noUtf8.push('      ' + rel); continue; }

  let i = texto.indexOf('�');
  if (i >= 0) {
    const n = texto.split('�').length - 1;
    const d = donde(texto, i);
    conReemplazo.push(`      ${rel}:${d.linea}  (${n} en total)  ${d.trozo}`);
  }
  for (const h of HUELLAS) {
    h.re.lastIndex = 0;
    const m = h.re.exec(texto);
    if (m) {
      const d = donde(texto, m.index);
      conHuella.push(`      ${rel}:${d.linea}  ${h.que}\n          ${d.trozo}`);
    }
  }
}

ok(`se encontraron las páginas (${lista.length} .html, sin contar www/)`, lista.length > 100);
ok('todas son UTF-8 de verdad', noUtf8.length === 0, noUtf8.join('\n'));
ok('ninguna tiene el carácter de reemplazo «�»', conReemplazo.length === 0, conReemplazo.join('\n'));
ok('ninguna tiene «?» donde iba un símbolo', conHuella.length === 0, conHuella.join('\n'));

/* Las cuatro que se rompieron, por su nombre: si alguien las vuelve a guardar
   con la herramienta equivocada, que el aviso diga cuál y qué se perdió. */
const TESTIGOS = {
  'mision.html':        ['Misión', "content: '✓ '", "content: '✗ '", '⭐ 0 XP', '⏳'],
  'consulta-nube.html': ['Contraseña', '☁️ Consulta en la Nube'],
  'registro.html':      ['📋 Evidencia de misiones', 'Sesión'],
  'evaluaciones.html':  ["key: 'español'", "key: 'matemáticas'", 'Banco de Evaluaciones']
};
for (const [archivo, textos] of Object.entries(TESTIGOS)) {
  const t = fs.readFileSync(path.join(RAIZ, archivo), 'utf8');
  const faltan = textos.filter(x => !t.includes(x));
  ok(`${archivo} conserva sus tildes y sus símbolos`, faltan.length === 0,
     '      falta: ' + faltan.join(' · '));
}

console.log(fallos === 0 ? '\n✅ Todo en orden.' : `\n❌ ${fallos} fallo(s).`);
process.exit(fallos === 0 ? 0 : 1);
