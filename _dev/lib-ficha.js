/* ============================================================
   M.E.T.A.S · Leer una ficha imprimible: sus preguntas y su pauta
   ------------------------------------------------------------
   El lector de fichas estaba dentro de `verifica-examen-sin-pistas.js`
   y solo lo usaba ella. Ahora lo usan tres:

     · verifica-examen-sin-pistas.js   ninguna pregunta de la ficha deja
                                       escrita la respuesta de otra;
     · verifica-ficha-no-copia-examen.js  la práctica de la ficha no es
                                       el examen, palabra por palabra;
     · arma-ficha.js                   relee la ficha que acaba de
                                       escribir, para comprobar que el
                                       lector ve lo mismo que el bloque.

   Si cada una leyera la ficha a su manera, una diría «40 preguntas»
   donde otra ve 30, y la que ve menos daría por limpio lo que no miró.
   Por eso el lector vive aquí, una sola vez, y se movió TAL CUAL: ni
   una expresión cambiada (la salida de la sonda de pistas es idéntica
   antes y después del traslado).

   También vive aquí LA REGLA de la copia (`mismaPregunta`): qué quiere
   decir que una pregunta de la práctica «es» una del examen. Va junto
   al lector porque la aplica la sonda y la consulta el armador.

   No es una sonda: no comprueba nada.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');

/* ── La ficha imprimible ─────────────────────────────────────────
   Se lee la plantilla de siempre: completar, verdadero o falso,
   selección múltiple, pareados —se llamen «IV. Términos pareados» o
   «IV. Relaciona (Pareados)»— y la pauta con sus claves. Lo que no
   tenga esa forma se deja para leer a mano, y se dice. */
const limpiaHtml = html => String(html).replace(/<span class="linea-resp"[^>]*><\/span>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/_{2,}/g, ' ').replace(/\s+/g, ' ').trim();
const sinLetra = t => t.replace(/^[a-e](?:\)|\s)\s*/i, '');

/* El bloque que abre en `desde`, con sus <div> anidados. */
function divEntero(html, desde) {
  const re = /<div\b|<\/div>/g;
  re.lastIndex = desde;
  let prof = 0, m;
  while ((m = re.exec(html))) {
    prof += m[0] === '</div>' ? -1 : 1;
    if (prof === 0) return html.slice(desde, m.index + 6);
  }
  return html.slice(desde);
}

/* Las fichas no numeran igual sus secciones —«I. Completa los espacios»,
   «8. Completa»—, así que se buscan por lo que son y no por su número.
   ⚠️ Y no todas usan el mismo encabezado: las de los tres poderes y la
   Constitución numeran la ficha entera en `<h2>` con su emoji delante
   («✏️ 8. Completa», «🔗 11. Pareados») y escriben cada pregunta en un
   bloque `.preg`, no en un `<li>`. Sin leer esa forma, la sonda se rendía
   con un «se revisa leyéndola» y dos fichas enteras quedaban sin vigilar. */
const TITULO = {
  completa: /<h[23][^>]*>\s*(?:[^\s<\w]+\s*)?(?:[IVX]+|\d+)\.\s*Complet/,
  vf: /<h[23][^>]*>\s*(?:[^\s<\w]+\s*)?(?:[IVX]+|\d+)\.\s*Verdadero/,
  seleccion: /<h[23][^>]*>\s*(?:[^\s<\w]+\s*)?(?:[IVX]+|\d+)\.\s*Selecci/,
  pareados: /<h[23][^>]*>\s*(?:[^\s<\w]+\s*)?(?:[IVX]+|\d+)\.\s*(?:T[ée]rminos|Relaciona|Pareados|Une)/
};

function itemsFicha(html) {
  const donde = k => { const m = TITULO[k].exec(html); return m ? m.index : -1; };
  const sec = k => {
    const i = donde(k);
    if (i < 0) return null;
    const resto = html.slice(i + 1);
    const fin = resto.search(/<h3[\s>]|<h2[\s>]|<div class="pauta"|class="felic"/);
    return fin < 0 ? resto : resto.slice(0, fin);
  };
  /* Una pregunta es un <li> o, en la otra forma, un `.preg-q` con su número. */
  const lis = t => {
    if (!t) return [];
    const L = [...t.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1]);
    return L.length ? L : [...t.matchAll(/<div class="preg-q"><span class="preg-n">\d+<\/span>([\s\S]*?)<\/div>/g)].map(m => m[1]);
  };
  const iPauta = html.search(/<div class="pauta"/);
  const bloquePauta = iPauta < 0 ? '' : divEntero(html, iPauta);
  const lineaPauta = re => { const m = bloquePauta.match(re); return m ? limpiaHtml(m[1]) : ''; };

  const I = lis(sec('completa'));
  const II = lis(sec('vf'));
  const iIII = donde('seleccion'), iIV = donde('pareados');
  if (!I.length || !II.length || iIII < 0 || iIV < 0 || iIV < iIII || !bloquePauta) return null;

  /* La selección múltiple sigue a veces en la hoja siguiente: se toman los
     bloques .preg que hay entre el título de la selección y el de los pareados.
     ⚠️ Las opciones pueden ir en `preg-ops fila` —las fracciones sueltas van en
     un renglón—: pedir la clase exacta dejaba fuera nueve de las diez
     preguntas de la ficha de Fracciones y la daba por limpia sin mirarlas. */
  const pregs = [...html.slice(iIII, iIV).matchAll(/<div class="preg-q">([\s\S]*?)<\/div>\s*<div class="preg-ops[^"]*">([\s\S]*?)<\/div>/g)]
    .map(m => ({ q: limpiaHtml(m[1].replace(/<span class="preg-n">\d+<\/span>/, '')),
      ops: [...m[2].matchAll(/<span class="op[^"]*">([\s\S]*?)<\/span>/g)].map(o => sinLetra(limpiaHtml(o[1]))) }));

  const filas = [...(sec('pareados') || '').matchAll(/<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/g)]
    .map(m => ({ a: limpiaHtml(m[1]).replace(/^\d+\.\s*/, ''), b: limpiaHtml(m[2]) }));

  const pI = lineaPauta(/Complet[^:<]*:\s*<\/span>([\s\S]*?)<\/div>/);
  const pIII = lineaPauta(/Selecci[^:<]*:\s*<\/span>([\s\S]*?)<\/div>/);
  const pIV = lineaPauta(/(?:Pareados|Relaciona)[^:<]*:\s*<\/span>([\s\S]*?)<\/div>/);
  const respI = {};
  [...pI.matchAll(/(\d+)\.\s*(.+?)(?=\s+\d+\.\s|$)/g)].forEach(m => { respI[+m[1]] = m[2].trim(); });
  const respIII = {};
  [...pIII.matchAll(/(\d+)\s*([a-e])\b/g)].forEach(m => { respIII[+m[1]] = 'abcde'.indexOf(m[2]); });
  const respIV = {};
  [...pIV.matchAll(/(\d+)\.?\s*([A-J])\b/g)].forEach(m => { respIV[+m[1]] = m[2]; });

  const L = [];
  I.forEach((li, i) => L.push({ banco: 'ficha I', i: i + 1, tipo: 'completar', visible: limpiaHtml(li), resp: respI[i + 1] || '', ctx: limpiaHtml(li) }));
  II.forEach((li, i) => L.push({ banco: 'ficha II', i: i + 1, tipo: 'vf', visible: limpiaHtml(li), resp: '', ctx: '' }));
  pregs.forEach((p, i) => L.push({ banco: 'ficha III', i: i + 1, tipo: 'seleccion', visible: p.q + ' ' + p.ops.join(' · '),
    resp: respIII[i + 1] >= 0 ? p.ops[respIII[i + 1]] || '' : '', ctx: p.q }));
  const defPorLetra = {};
  filas.forEach(f => { const m = f.b.match(/^([A-J])\.\s*(.*)$/); if (m) defPorLetra[m[1]] = m[2]; });
  let terminos = filas.filter(f => !/^Columna/i.test(f.a)).map(f => f.a);
  /* Hay fichas que ponen los pareados en DOS listas en vez de una tabla —la
     del Himno: «Columna A — Palabra del Himno» y «Columna B — Qué significa»—.
     Sin leerlas, la sonda contaba 30 preguntas donde hay 40 y daba por limpia
     una sección que no había mirado. */
  if (!terminos.length) {
    const listas = [...(sec('pareados') || '').matchAll(/<ol\b([^>]*)>([\s\S]*?)<\/ol>/g)];
    const colA = listas.find(l => !/type="A"/.test(l[1])), colB = listas.find(l => /type="A"/.test(l[1]));
    if (colA && colB) {
      terminos = [...colA[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => limpiaHtml(m[1]));
      [...colB[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].forEach((m, i) => { defPorLetra['ABCDEFGHIJ'[i]] = limpiaHtml(m[1]); });
    }
  }
  terminos.forEach((t, i) => {
    const def = defPorLetra[respIV[i + 1]] || '';
    L.push({ banco: 'ficha IV', i: i + 1, tipo: 'pareado', visible: t + ' · ' + def, term: t, def, resp: '', ctx: '' });
  });
  const faltan = !Object.keys(respI).length || !Object.keys(respIII).length || !Object.keys(respIV).length;

  /* ⚠️ La teoría que comparte HOJA con las actividades. Se encontró
     mirando la ficha de Aspectos Cívicos impresa: la hoja 4 lleva arriba la
     tabla de las fechas y el «Así sí / Así no», y debajo el completar. Una
     pregunta por el 15 de septiembre se contestaba leyendo la misma hoja, y
     el maestro que fotocopia las hojas de la prueba no puede separarlas. */
  /* Las fichas de programación y robótica traen además «🎲 Actividades
     desconectadas (sin computadora)», que es teoría para hacer en el aula y
     no el examen: tomarla por el principio de la prueba daba por «misma hoja»
     la página ANTERIOR, y acusaba a un pareado sano de estar contestado. */
  const iAct = Math.min(...[html.search(/<h2[^>]*>(?![^<]*desconectadas)[^<]*Actividades/), donde('completa')].filter(i => i >= 0));
  const iHoja = html.lastIndexOf('<section class="pagina"', iAct);
  const teoria = iHoja >= 0 && isFinite(iAct) ? limpiaHtml(html.slice(iHoja, iAct)) : '';
  return { items: L, faltan, teoria };
}

function fichaDe(dir, html) {
  const m = html.match(/fichas\/(ficha-[A-Za-z0-9._-]+\.html)/);
  if (!m) return null;
  const p = path.join(RAIZ, 'fichas', m[1]);
  return fs.existsSync(p) ? p : null;
}

/* ── La regla: ¿esta pregunta de la práctica es una del examen? ───
   Lo que se quiere impedir es que el alumno resuelva en la ficha, la
   víspera, LA MISMA HOJA que le van a poner: así el examen mide si se
   acuerda de la frase, no si aprendió el dato. Lo que NO se quiere
   impedir es que la ficha ensaye los mismos datos: para eso es. Por eso
   la regla mira las palabras, no el tema.

   Una pregunta de la práctica copia a una del examen si:

   · completar o verdadero y falso: dicen lo mismo (iguales después de
     quitar tildes, mayúsculas y signos) o comparten casi todas sus
     palabras de contenido (UMBRAL) Y tienen la misma respuesta. Un
     verdadero o falso con la respuesta al revés («…no importa» contra
     «…importa») no es copia: es la misma idea vuelta del revés, que es
     justo lo que obliga a pensar;
   · selección: la misma pregunta (igual o casi) con la misma opción
     correcta. La misma pregunta de aplicar («Es un texto…») con OTRO
     fragmento no choca, porque el fragmento es parte del enunciado;
   · pareados: el mismo término con la misma definición (igual o casi).
     El mismo término con un ejemplo en vez de su definición no es copia.

   UMBRAL = 0,8 sobre las palabras de contenido de la más corta de las
   dos. Se midió el 26 de noviembre de 2026 con la ficha de Los Tipos de
   Textos de antes (40 de 40 copiadas con cualquier umbral) y con la
   reescrita (0 de 40 de 0,6 para arriba; con 0,5 acusa a dos que no lo
   son). En todas las fichas juntas, pedir igualdad exacta ve 2,458
   copias y 0,8 ve 2,478: las veinte de diferencia son la misma
   pregunta con una coma, un «el» o un ejemplo de más. Así que 0,8 no
   está al filo de nada: atrapa el retoque y no acusa a la reescrita. */
const UMBRAL = 0.8;
const VACIAS = new Set(('a al ante con como cual cuales cuando de del desde donde e el ella ellos en entre es esa ese eso esta este esto '
  + 'la las le les lo los mas me mi muy ni no o para pero por que quien se si sin so sobre su sus te tu un una uno unas unos y ya').split(' '));
const llano = s => String(s == null ? '' : s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/&nbsp;/g, ' ').replace(/_{2,}/g, ' ').replace(/[^a-z0-9ñ]+/g, ' ').trim();
const contenido = s => llano(s).split(' ').filter(p => p && !VACIAS.has(p));

/* Cuánto de la más corta está en la otra, de 0 a 1. Sobre la más corta a
   propósito: una pregunta del examen metida entera dentro de una más
   larga sigue siendo la del examen. */
function parecido(a, b) {
  const A = new Set(contenido(a)), B = new Set(contenido(b));
  if (!A.size || !B.size) return 0;
  const [chica, grande] = A.size <= B.size ? [A, B] : [B, A];
  let n = 0; chica.forEach(p => { if (grande.has(p)) n++; });
  return n / chica.size;
}
const casi = (a, b) => llano(a) === llano(b) || parecido(a, b) >= UMBRAL;

/* Una pregunta, venga de donde venga, puesta en la misma forma:
   { tipo, texto, resp }  ·  tipo: completar | vf | seleccion | pareado
   De un banco del examen: */
function deBanco(nombre, it) {
  if (!it || typeof it !== 'object') return null;
  if (it.term !== undefined && it.def !== undefined) return { tipo: 'pareado', texto: String(it.term), resp: String(it.def) };
  if (typeof it.q !== 'string') return null;
  if (Array.isArray(it.o)) return { tipo: 'seleccion', texto: it.q, resp: typeof it.a === 'number' ? String(it.o[it.a] || '').replace(/^[a-e]\)\s*/i, '') : '' };
  if (typeof it.a === 'boolean') return { tipo: 'vf', texto: it.q, resp: it.a ? 'V' : 'F' };
  if (typeof it.a === 'string') return { tipo: 'completar', texto: it.q, resp: it.a };
  return null;
}
/* De la ficha, tal como la devuelve `itemsFicha` (el verdadero o falso
   llega sin respuesta: se la pone quien llama, leyendo la pauta). */
function deFicha(it, vf) {
  if (it.tipo === 'pareado') return { tipo: 'pareado', texto: it.term, resp: it.def };
  if (it.tipo === 'seleccion') return { tipo: 'seleccion', texto: it.ctx, resp: it.resp };
  if (it.tipo === 'vf') return { tipo: 'vf', texto: it.visible, resp: vf || '' };
  return { tipo: 'completar', texto: it.visible, resp: it.resp };
}

/* Devuelve '' si no es copia, o por qué lo es. */
function mismaPregunta(f, e) {
  if (!f || !e || f.tipo !== e.tipo) return '';
  const igual = llano(f.texto) === llano(e.texto);
  if (!igual && parecido(f.texto, e.texto) < UMBRAL) return '';
  const como = igual ? 'palabra por palabra' : 'casi con las mismas palabras';
  if (f.tipo === 'pareado') return casi(f.resp, e.resp) ? 'el mismo pareado, ' + como : '';
  if (f.tipo === 'vf') return !f.resp || !e.resp || f.resp === e.resp ? 'el mismo verdadero o falso, ' + como : '';
  if (f.tipo === 'seleccion') return !f.resp || !e.resp || casi(f.resp, e.resp) ? 'la misma selección, ' + como : '';
  return !f.resp || !e.resp || casi(f.resp, e.resp) ? 'el mismo completar, ' + como : '';
}

/* La pauta del verdadero o falso de una ficha: { 1: 'V', 2: 'F', … }.
   `itemsFicha` no la lee (a la sonda de pistas no le hace falta) y la
   regla de arriba sí: sin ella no se distingue la frase copiada de la
   frase vuelta del revés. */
function pautaVF(html) {
  const i = html.search(/<div class="pauta"/);
  if (i < 0) return {};
  const m = divEntero(html, i).match(/Verdadero[^:<]*:\s*<\/span>([\s\S]*?)<\/div>/);
  const r = {};
  if (m) [...limpiaHtml(m[1]).matchAll(/(\d+)\.?\s*([VF])\b/g)].forEach(x => { r[+x[1]] = x[2]; });
  return r;
}

module.exports = { limpiaHtml, sinLetra, divEntero, TITULO, itemsFicha, fichaDe, pautaVF,
  UMBRAL, llano, parecido, deBanco, deFicha, mismaPregunta };
