#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────────────────
   M.E.T.A.S · Lo que se lee, bien escrito

   Pedido por el autor el 27 de septiembre de 2026: «haz una revisión misión
   por misión buscando errores de ortografía en el texto, en las tarjetas
   flashcard y lo demás. También quitar los guiones largos». Se hizo leyendo
   las 83 misiones, sus fichas y los archivos de datos que pintan, y de esa
   revisión salen las cuatro cosas que esta sonda vigila. Las cuatro tienen
   algo en común: se pintan perfectamente, no dan un solo error en la consola
   y ninguna otra sonda las veía.

   1. ⚠️ EL REVERSO DE LAS FLASHCARDS NO SE ESCRIBE CON CSS. Las 83 hojas de
      estilo traían `text-transform: lowercase` en `#fcA` (más un
      `::first-letter` que subía la primera letra), y eso escribía mal lo que
      el archivo tenía bien: «honduras», «lempira», «sace», y cada oración en
      minúscula después del punto. El alumno estudiaba de ahí. La mayúscula la
      pone el texto; la hoja de estilo solo pone la letra.

   2. ⚠️ SIN GUIONES LARGOS (—) EN LO QUE LEE UNA PERSONA. En pantalla y en el
      papel se cambiaron por lo que cada uno quería decir: dos puntos cuando
      anuncia, coma o paréntesis cuando es un inciso, punto cuando empieza otra
      idea, y «·» entre las partes de un título. La raya se queda solo donde es
      CONTENIDO: la misión de los tipos de textos enseña la raya de diálogo
      («—¿Vienes? —Sí, ya voy.») y la pide en el examen, y sin ella esa
      pregunta no tiene respuesta.

   3. ⚠️ LA LETRA DE LA OPCIÓN LA PONE EL MOTOR, NO EL BANCO. Se encontraron
      bancos escritos «a) Un cable enrollado» que el motor volvía a numerar:
      el alumno leía «a) a) Un cable enrollado» en la pantalla y en la prueba
      impresa. Ya había pasado en La Célula; esta vez eran cuatro misiones de
      robótica y sus ediciones en inglés.

   4. ⚠️ LAS ERRATAS QUE YA SE CORRIGIERON NO VUELVEN. Lo que más se
      multiplica en este repositorio es copiar una misión vieja: la errata
      viaja con la plantilla. La lista va con su motivo, y solo lleva formas
      que no pueden ser correctas en ningún contexto de texto.

   5. ⚠️ LAS FORMAS QUE SE UNIFICARON EN TODO EL CATÁLOGO NO SE DESHACEN. La
      misma revisión encontró cosas que no eran una errata suelta sino una
      costumbre repetida decenas de veces: «vs» sin su punto (612), «Ej:» sin
      el suyo (206), «EE.UU.» sin el espacio, «Mini-demostración» con guion
      (el prefijo va pegado), «Total, obtenido» con una coma que partía el
      rótulo en dos (103, en la hoja impresa de cada prueba), «SI…ENTONCES»
      sin el espacio que va después de los puntos suspensivos, «9.2 millones
      km²» sin su «de», y el mar, el golfo, el océano, el hemisferio o el
      trópico con mayúscula a media oración (el genérico va en minúscula:
      «el golfo de Fonseca», «el hemisferio norte»). Esta regla NO mira los
      `-en.js`: su texto es inglés, donde «vs» es correcto, y sus claves
      españolas no pueden separarse del original sin que la sonda de bancos
      bilingües se entere.

   ⚠️ SOLO SE MIRA TEXTO. Los comentarios de este proyecto van llenos de rayas
   a propósito —explican por qué el código es así— y el sitio donde se cuenta
   que algo se quitó es justo donde ese algo sigue escrito (ya mordió seis
   veces). Por eso esta sonda no busca en el archivo con una expresión
   regular: lee el JavaScript con un analizador propio y se queda con las
   cadenas, las plantillas y las expresiones regulares (que en los `-en.js`
   son copias del texto español); del HTML, con el texto y los atributos que
   se leen (title, aria-label, alt, placeholder); y del CSS, con los
   `content:` que se pintan. Sin dependencias: `node_modules` va versionado
   en este repositorio y no se le añade nada.

   Uso:  node _dev/verifica-ortografia.js            (está en `npm test`)
         node _dev/verifica-ortografia.js --detalle  (enseña cada caso entero)
   ───────────────────────────────────────────────────────────────────── */
'use strict';
const fs = require('fs'), path = require('path');
const RAIZ = path.join(__dirname, '..');
const DETALLE = process.argv.includes('--detalle');

/* ── qué se lee ─────────────────────────────────────────────────────── */
function archivos(dir, filtro, fuera) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  (function anda(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) anda(p);
      else if (filtro.test(e.name) && !(fuera && fuera.test(p))) out.push(p);
    }
  })(dir);
  return out.sort();
}
const VENDOR = /html2canvas|\.min\.js$|[\\/]vendor[\\/]/;
const misionesHtml = archivos(path.join(RAIZ, 'misiones'), /\.html$/, VENDOR);

/* Los archivos compartidos que las misiones cargan se sacan de sus propios
   <script>, no de una lista escrita: así un archivo de datos nuevo entra solo
   el día que una misión lo pinta. */
const compartidos = new Set();
for (const f of misionesHtml) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/src="\.\.\/\.\.\/(js\/[^"?]+)/g)) compartidos.add(m[1]);
}
const JS = archivos(path.join(RAIZ, 'misiones'), /\.js$/, VENDOR)
  .concat(archivos(path.join(RAIZ, 'fichas'), /\.js$/, VENDOR))
  .concat([...compartidos].map(r => path.join(RAIZ, r)).filter(f => fs.existsSync(f)).sort());
const HTML = misionesHtml.concat(archivos(path.join(RAIZ, 'fichas'), /\.html$/, VENDOR));
const CSS = archivos(path.join(RAIZ, 'misiones'), /\.css$/, VENDOR)
  .concat(archivos(path.join(RAIZ, 'fichas'), /\.css$/, VENDOR));

/* ── un lector de JavaScript que solo devuelve el texto ─────────────────
   Recorre el archivo carácter a carácter y separa comentarios, cadenas,
   plantillas (con sus `${…}` anidados, que son código y se vuelven a leer)
   y expresiones regulares. La barra `/` es regla o división según lo que
   venía antes, que es como lo decide el propio lenguaje. */
const PALABRAS_ANTES_DE_REGEX = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await']);
function textosJs(src, lineaBase) {
  const out = [];
  let i = 0, linea = lineaBase || 1, previo = '';   // último token significativo
  const pila = [];                                   // llaves abiertas dentro de ${ }
  const n = src.length;
  const avanza = c => { if (c === '\n') linea++; };
  function leeCadena(q) {
    const l0 = linea; let s = ''; i++;
    while (i < n && src[i] !== q) {
      if (src[i] === '\\') { s += src[i] + (src[i + 1] || ''); avanza(src[i + 1]); i += 2; continue; }
      if (src[i] === '\n') break;                    // cadena rota: que la vea node --check
      s += src[i]; i++;
    }
    i++; out.push({ tipo: 'cadena', texto: s, linea: l0 }); previo = 'x';
  }
  function leePlantilla() {
    let l0 = linea, s = ''; i++;
    while (i < n) {
      const c = src[i];
      if (c === '\\') { s += c + (src[i + 1] || ''); avanza(src[i + 1]); i += 2; continue; }
      if (c === '`') { i++; out.push({ tipo: 'plantilla', texto: s, linea: l0 }); previo = 'x'; return; }
      if (c === '$' && src[i + 1] === '{') {
        out.push({ tipo: 'plantilla', texto: s, linea: l0 }); s = '';
        i += 2; pila.push(1); previo = '(';
        return;                                       // el resto de la plantilla sigue al cerrar la llave
      }
      avanza(c); s += c; i++;
    }
  }
  function leeRegex() {
    const l0 = linea; let s = '', clase = false; i++;
    while (i < n) {
      const c = src[i];
      if (c === '\\') { s += c + (src[i + 1] || ''); i += 2; continue; }
      if (c === '\n') break;
      if (c === '[') clase = true; else if (c === ']') clase = false;
      else if (c === '/' && !clase) break;
      s += c; i++;
    }
    i++; while (i < n && /[a-z]/i.test(src[i])) i++;
    out.push({ tipo: 'regex', texto: s, linea: l0 }); previo = 'x';
  }
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === '\n') { linea++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && d === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') {
      i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { avanza(src[i]); i++; }
      i += 2; continue;
    }
    if (c === '"' || c === "'") { leeCadena(c); continue; }
    if (c === '`') { leePlantilla(); continue; }
    if (c === '{') { if (pila.length) pila[pila.length - 1]++; previo = '{'; i++; continue; }
    if (c === '}') {
      if (pila.length) {
        pila[pila.length - 1]--;
        if (pila[pila.length - 1] === 0) {            // cierra un ${ }: sigue la plantilla
          pila.pop(); i++;
          let l0 = linea, s = '';
          while (i < n) {
            const e = src[i];
            if (e === '\\') { s += e + (src[i + 1] || ''); avanza(src[i + 1]); i += 2; continue; }
            if (e === '`') { i++; break; }
            if (e === '$' && src[i + 1] === '{') { i += 2; pila.push(1); break; }
            avanza(e); s += e; i++;
          }
          out.push({ tipo: 'plantilla', texto: s, linea: l0 });
          previo = pila.length && src[i - 1] === '{' ? '(' : 'x';
          continue;
        }
      }
      previo = '}'; i++; continue;
    }
    if (c === '/') {
      const esDivision = previo === 'x' || previo === ')' || previo === ']';
      if (!esDivision) { leeRegex(); continue; }
      previo = '/'; i++; continue;
    }
    if (/[A-Za-z_$À-￿]/.test(c)) {
      let p = ''; while (i < n && /[\w$À-￿]/.test(src[i])) p += src[i++];
      previo = PALABRAS_ANTES_DE_REGEX.has(p) ? '(' : 'x'; continue;
    }
    if (/[0-9]/.test(c)) { while (i < n && /[\w.]/.test(src[i])) i++; previo = 'x'; continue; }
    previo = c; i++;
  }
  return out;
}

/* ── del HTML: el texto, los atributos que se leen y sus scripts ─────── */
const lineaDe = (s, idx) => s.slice(0, idx).split('\n').length;
function textosHtml(src) {
  const out = [];
  const sinCom = src.replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' '));
  for (const m of sinCom.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc=/.test(m[1])) continue;
    textosJs(m[2], lineaDe(sinCom, m.index + m[0].indexOf('>') + 1)).forEach(t => out.push(t));
  }
  for (const m of sinCom.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi))
    textosCss(m[1], lineaDe(sinCom, m.index)).forEach(t => out.push(t));
  const cuerpo = sinCom
    .replace(/<script\b[\s\S]*?<\/script>/gi, m => m.replace(/[^\n]/g, ' '))
    .replace(/<style\b[\s\S]*?<\/style>/gi, m => m.replace(/[^\n]/g, ' '));
  for (const m of cuerpo.matchAll(/\b(title|aria-label|alt|placeholder)="([^"]*)"/g))
    out.push({ tipo: 'atributo', texto: m[2], linea: lineaDe(cuerpo, m.index) });
  const soloTexto = cuerpo.replace(/<[^>]*>/g, m => m.replace(/[^\n]/g, ' '));
  soloTexto.split('\n').forEach((l, k) => { if (l.trim()) out.push({ tipo: 'texto', texto: l.trim(), linea: k + 1 }); });
  return out;
}
function textosCss(src, lineaBase) {
  const out = [];
  const sinCom = src.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  for (const m of sinCom.matchAll(/content\s*:\s*(['"])((?:\\.|(?!\1).)*)\1/g))
    out.push({ tipo: 'css', texto: m[2], linea: (lineaBase || 1) + lineaDe(sinCom, m.index) - 1 });
  return out;
}

/* ── las reglas ─────────────────────────────────────────────────────── */
const fallos = [];
const rel = f => path.relative(RAIZ, f);
const falla = (regla, f, t, extra) => fallos.push({ regla, f: rel(f), linea: t.linea, texto: t.texto, extra });

/* 2 · La raya de diálogo es contenido en la lección que la enseña. Se deja
   pasar SOLO ahí y SOLO con forma de diálogo o nombrando el signo; una raya
   de inciso en esa misma misión sigue siendo un fallo. */
const LECCION_RAYA = /tipos-de-textos/;
const ES_DIALOGO = /(^|[\s«"“'(])—[¿¡A-ZÁÉÍÓÚÑ]|—(preguntó|respondió|contesté|dijo|contestó)\b|\(—\)/;

/* 3 · La letra repetida al principio de una opción: «a) a) …». */
const LETRA_DOBLE = /(^|[\s'"`>])([a-dA-D])\)\s*\2\)/;

/* 4 · Erratas corregidas el 27 de septiembre de 2026, con su motivo. Solo
   entran formas que no son correctas en ningún contexto de texto; las que
   pueden ser un identificador del código («presentacion», «cortesia») no, que
   acusarían a una clave sana. */
const ERRATAS = [
  [/(?<!\p{L})guión(?!\p{L})/u, '«guion» es monosílabo y va sin tilde (Ortografía 2010)'],
  [/(?<!\p{L})(rió|crió|guió|fió|lió)(?!\p{L})/u, 'monosílabo: «rio», «crio», «guio», «fio», «lio» van sin tilde (Ortografía 2010)'],
  [/(?<!\p{L})(imagináte|devolvéla|autóasignate)(?!\p{L})/iu, 'imperativo con enclítico: «imaginate», «devolvela», «asígnate»'],
  [/(?<!\p{L})dormió(?!\p{L})/u, 'el pretérito de dormir es «durmió»'],
  [/(?<!\p{L})parecencia(?!\p{L})/u, '«parecencia» no está en el diccionario: «parecido»'],
  [/(?<!\p{L})en base a(?!\p{L})/u, '«en base a»: se dice «con base en» o «basándose en» (DPD)'],
  [/(?<!\p{L})Alta endemismo(?!\p{L})/u, 'concordancia: «alto endemismo»'],
  [/(?<!\p{L})(Pterodactyl|Timbuktu|Zimbabwe|Papua|Idiaquez)(?!\p{L})/u, 'forma española: pterodáctilo, Tombuctú, Zimbabue, Papúa, Idiáquez'],
  [/(?<!\p{L})currículas(?!\p{L})/u, '«currícula» no es plural de nada en español: «los currículos» (DPD)'],
  [/\s[<>=]\s*,?\s*ó\s+[<>=]/u, 'la «o» entre signos o cifras ya no lleva tilde (Ortografía 2010)'],
];

/* 5 · Formas unificadas el 27 de septiembre de 2026. Van aparte de las
   erratas porque dependen del contexto: por eso se miran solo en texto
   español (no en los `-en.js`) y con la puntuación que las rodea. */
const FORMAS = [
  [/(?<=\s)vs(?=\s)/u, '«vs.» lleva punto: es la abreviatura de «versus» (DPD)'],
  [/(?<!\p{L})[Ee]j ?:/u, '«Ej.:» lleva el punto de la abreviatura antes de los dos puntos'],
  [/EE\.UU\./u, '«EE. UU.» lleva espacio entre sus dos partes (Ortografía 2010)'],
  [/(?<!\p{L})Mini-(quiz|demostración|Crucigrama)|(?<!\p{L})mini-(demostración|cuadrícula|párrafos?|textos?|casos?|programa|algoritmo)(?!\p{L})/u, 'el prefijo «mini-» va pegado: «minidemostración», «miniquiz»'],
  [/Total, obtenido/u, '«Total obtenido» es un solo rótulo: la coma lo partía en dos'],
  [/…(ENTONCES|SINO|THEN|ELSE)(?!\p{L})/u, 'después de los puntos suspensivos va un espacio: «SI… ENTONCES… SINO»'],
  [/\d\s?(millones|millón) km/u, '«millón» es sustantivo: «9.2 millones de km²»'],
  [/Se te hará prueba escrita/u, '«se te hará una prueba escrita»: el sustantivo contable pide su artículo'],
  [/(?<!\p{L})(sigue-líneas|persona-robot)(?!\p{L})/u, 'se escriben sin guion: «siguelíneas», «persona robot»'],
  [/(?<=\p{Ll}\s)Jefe de Estado/u, 'el cargo va en minúscula: «jefe de Estado» (Ortografía 2010)'],
  [/(?<=\b(?:el|al|del|en el|con el|y el|por el) )(Mar Caribe|Golfo de Fonseca|Océano (?:Pacífico|Atlántico)|Lago de Yojoa|Meridiano de Greenwich|Trópico de (?:Cáncer|Capricornio)|Hemisferio (?:Norte|Sur|Oriental|Occidental)|Monte Everest)/u, 'el genérico geográfico va en minúscula a media oración: «el golfo de Fonseca», «el hemisferio norte»'],
];

const ES_INGLES = /-en\.js$/;
const vistos = { js: 0, html: 0, css: 0 };
function revisa(f, textos) {
  const leccion = LECCION_RAYA.test(f);
  for (const t of textos) {
    /* En una expresión regular, la raya dentro de una clase de caracteres
       («[.,;:—–]») es la que se QUITA del texto antes de comparar palabras:
       eso es código, no una raya que alguien lea. */
    const s = t.tipo === 'regex' ? t.texto.replace(/\[(?:\\.|[^\]\\])*\]/g, '') : t.texto;
    if (s.includes('—')) {
      if (!(leccion && ES_DIALOGO.test(s))) falla('raya', f, t);
    }
    if (t.tipo !== 'regex' && LETRA_DOBLE.test(s)) falla('letra', f, t);
    if (t.tipo !== 'regex') for (const [re, motivo] of ERRATAS) if (re.test(s)) falla('errata', f, t, motivo);
    if (t.tipo !== 'regex' && !ES_INGLES.test(f)) for (const [re, motivo] of FORMAS) if (re.test(s)) falla('forma', f, t, motivo);
  }
}
for (const f of JS) { vistos.js++; revisa(f, textosJs(fs.readFileSync(f, 'utf8'))); }
for (const f of HTML) { vistos.html++; revisa(f, textosHtml(fs.readFileSync(f, 'utf8'))); }
for (const f of CSS) {
  vistos.css++;
  const src = fs.readFileSync(f, 'utf8');
  revisa(f, textosCss(src));
  /* 1 · el reverso de las flashcards */
  const sinCom = src.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  for (const m of sinCom.matchAll(/([^{}]*)\{([^}]*)\}/g)) {
    const sel = m[1], cuerpo = m[2];
    const linea = lineaDe(sinCom, m.index + m[1].length);
    if (/text-transform\s*:\s*lowercase/i.test(cuerpo))
      falla('flashcard', f, { linea, texto: sel.trim() + ' { text-transform: lowercase }' }, 'la minúscula la escribe el texto, no la hoja de estilo');
    if (/#fcA\b[^,{]*::?first-letter/.test(sel))
      falla('flashcard', f, { linea, texto: sel.trim() }, 'la mayúscula inicial la trae el texto');
  }
}

/* ── el resultado ───────────────────────────────────────────────────── */
const NOMBRES = {
  flashcard: 'El reverso de las flashcards se escribe con CSS',
  raya:      'Guion largo (—) en texto que se lee',
  letra:     'La letra de la opción repetida («a) a)»)',
  errata:    'Errata que ya se había corregido',
  forma:     'Forma que se unificó en todo el catálogo',
};
console.log(`\n════ LO QUE SE LEE, BIEN ESCRITO · ${vistos.js} JS · ${vistos.html} HTML · ${vistos.css} CSS ════\n`);
if (!fallos.length) {
  console.log('✅ Sin guiones largos en lo que se lee (la raya de diálogo, solo en la lección que la enseña).');
  console.log('✅ El reverso de las flashcards no pasa por text-transform ni por ::first-letter.');
  console.log('✅ Ninguna opción repite su letra, y ninguna errata corregida volvió.');
  console.log('✅ Las formas unificadas (vs., Ej.:, EE. UU., mini-, «Total obtenido», los genéricos geográficos…) siguen así.\n');
  process.exit(0);
}
for (const regla of Object.keys(NOMBRES)) {
  const suyos = fallos.filter(x => x.regla === regla);
  if (!suyos.length) continue;
  console.log(`❌ ${NOMBRES[regla]}: ${suyos.length}`);
  for (const x of suyos.slice(0, DETALLE ? Infinity : 25)) {
    let t = x.texto.replace(/\s+/g, ' ');
    const k = t.indexOf('—');
    if (!DETALLE && t.length > 110) t = (k > 50 ? '…' + t.slice(k - 50, k + 55) : t.slice(0, 105)) + '…';
    console.log(`   ${x.f}:${x.linea}  ${t}${x.extra ? '\n      ↳ ' + x.extra : ''}`);
  }
  if (!DETALLE && suyos.length > 25) console.log(`   … y ${suyos.length - 25} más (--detalle para verlos todos)`);
  console.log('');
}
console.log('Cómo se arregla: la raya de inciso pasa a coma o paréntesis; la que anuncia, a dos puntos;');
console.log('la que empieza otra idea, a punto; y entre las partes de un título va «·».');
console.log('En las misiones bilingües se cambian a la vez el español, su clave en el -en.js y la traducción.\n');
process.exit(1);
