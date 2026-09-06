/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Reparte el contenido de una ficha entre sus hojas
   ──────────────────────────────────────────────────────────────
   Las fichas se armaron A MANO: alguien decidió a ojo dónde cortaba
   cada hoja. A ojo se acierta hasta que se corrige una errata y el
   párrafo crece dos renglones; entonces la hoja se pasa del papel,
   se parte en dos, el pie que dice «Página 3» sale en la cuarta y el
   maestro lo descubre con 43 fotocopias hechas. Así estaban 18 fichas.

   Esta herramienta NO recorta contenido ni toca el tamaño de letra:
   solo mueve DÓNDE cae el corte. Mide cada bloque en el navegador
   —con media print y el ANCHO DEL PAPEL, que es la única medición
   que no miente— y vuelve a repartir los mismos bloques, en el mismo
   orden, entre las mismas hojas.

   Tres reglas que salen del papel y no de la pantalla:

   1. **El tope es 248 mm por hoja**, no los 257,4 que deja el papel.
      El colchón no es de adorno: si el navegador ignora el `@page` y
      pone sus propios márgenes (Firefox usa 12,7 mm y deja 254 mm), la
      hoja SIGUE cabiendo. Es la misma cifra y la misma razón que en el
      informe del alumno.
   2. **Primero el mínimo de hojas, después el reparto.** Con las hojas
      ya fijas se busca el corte que deja la hoja más cargada lo más
      liviana posible, para que el aire sobrante se reparta en vez de
      amontonarse en la última.
   3. **Un título nunca cierra una hoja**: baja con lo que encabeza.

   La hoja del docente (la última, con la pauta) está BLOQUEADA: se
   imprime suelta y no se fotocopia, así que no recibe ni cede nada.

   Solo toca las fichas que HOY se parten: la que cabe con su corte a
   mano se deja en paz, porque rehacerlo mueve texto sin ganar nada.

   Uso:  node _dev/reparte-hojas-ficha.js                  (las que se parten)
         node _dev/reparte-hojas-ficha.js ficha-la-celula  (una)
         node _dev/reparte-hojas-ficha.js --revisa         (sin escribir)
         node _dev/reparte-hojas-ficha.js --todas          (rehacer también las sanas)

   Después SIEMPRE:  node _dev/verifica-ficha-paginas.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const DIR = path.join(RAIZ, 'fichas');

const MM = 96 / 25.4;                  // píxeles CSS por milímetro
const ANCHO_UTIL = 215.9 - 11 - 11;    // carta menos los márgenes del @page
// Lo que puede medir una hoja impresa, de verdad: el papel carta con los
// márgenes de 11 mm del @page deja 257,4 mm. El tope se queda en 248 y el
// colchón NO es de adorno: si el navegador ignora el @page y pone los suyos
// (Firefox usa 12,7 mm y deja 254 mm), la hoja SIGUE cabiendo. Es la misma
// cifra y la misma razón que en el informe del alumno.
const TOPE = 248;
// Lo que de verdad deja el papel. Sirve para decidir a QUIÉN hay que tocarle
// el reparto: una ficha cuyo corte a mano cabe se deja como está, aunque no
// llegue al tope holgado de arriba. Aquí no se rehace lo que ya funciona.
const LIMITE = 257.4;

// Etiquetas que no llevan cierre: si no se saltan, el contador de
// profundidad se desequilibra y todo el archivo sale como un solo bloque.
const VACIOS = new Set(['br', 'img', 'input', 'hr', 'meta', 'link', 'source',
  'col', 'area', 'base', 'embed', 'param', 'track', 'wbr']);


/* El navegador lo abre `lib-navegador.js`: primero el que trae Playwright y
   solo si ese no arranca, uno puesto a mano. Esta función estaba COPIADA en
   seis sondas, y las copias ya se habían separado —tres nombres distintos de
   variable de entorno para lo mismo—. */
const lanzar = opciones => abrir(opciones);

/* ─── Partir el archivo en secciones ───────────────────────────── */

function seccionar(html) {
  const partes = [];
  const re = /<section class="pagina"[^>]*>([\s\S]*?)<\/section>/g;
  let m, fin = 0, cabeza = null;
  const rotulos = [];
  while ((m = re.exec(html)) !== null) {
    if (cabeza === null) cabeza = html.slice(0, m.index);
    // Entre hoja y hoja solo puede haber aire: si alguien dejó ahí un
    // comentario o cualquier otra cosa, al rehacer las secciones se
    // perdería. Antes que perderlo, la ficha no se toca.
    else {
      // Entre hoja y hoja va el rótulo «PÁGINA N», y hay que renumerarlo con
      // todo lo demás. Si apareciera cualquier otra cosa, al rehacer las
      // secciones se perdería: antes que perderla, la ficha no se toca.
      const hueco = html.slice(fin, m.index);
      if (!/^\s*<!--[^>]*PÁGINA[^>]*-->\s*$/.test(hueco)) return null;
      rotulos.push(hueco.trim());
    }
    const dentro = m[1];
    const abre = /<div class="(contenido[^"]*)"([^>]*)>/.exec(dentro);
    const pie = /<div class="pag-pie">[\s\S]*?<\/div>/.exec(dentro);
    if (!abre || !pie) return null;                 // ficha con otra forma: no se toca
    partes.push({
      clases: abre[1],
      atributos: abre[2],
      cuerpo: dentro.slice(abre.index + abre[0].length, dentro.lastIndexOf('</div>', pie.index)),
      pie: pie[0],
      etiqueta: m[0].slice(0, m[0].indexOf('>') + 1)
    });
    fin = m.index + m[0].length;
  }
  if (!partes.length) return null;
  // El rótulo de la primera hoja se quedó pegado al final de la cabecera.
  const uno = /[ \t]*<!--[^>]*PÁGINA[^>]*-->[ \t]*\n?$/.exec(cabeza);
  if (uno) { rotulos.unshift(uno[0].trim()); cabeza = cabeza.slice(0, uno.index); }
  else rotulos.unshift(null);
  return { cabeza, paginas: partes, rotulos, cola: html.slice(fin) };
}

/* ─── Partir el cuerpo de una hoja en bloques de primer nivel ──── */

function partirBloques(src) {
  const out = [];
  let i = 0, prof = 0, inicio = -1, pendiente = '';
  const n = src.length;

  const soltar = (hasta) => {
    const txt = src.slice(inicio, hasta).trim();
    out.push(pendiente ? pendiente + '\n' + txt : txt);
    pendiente = ''; inicio = -1;
  };

  while (i < n) {
    if (src.startsWith('<!--', i)) {
      const f = src.indexOf('-->', i);
      const j = f < 0 ? n : f + 3;
      // El comentario explica el bloque que viene: viaja pegado a él.
      if (prof === 0) pendiente += (pendiente ? '\n' : '') + src.slice(i, j).trim();
      i = j; continue;
    }
    if (src[i] === '<') {
      const m = /^<(\/?)([a-zA-Z][\w-]*)/.exec(src.slice(i, i + 48));
      if (m) {
        const cierre = m[1] === '/';
        const nombre = m[2].toLowerCase();
        let j = i + 1, comilla = null;
        while (j < n) {
          const c = src[j];
          if (comilla) { if (c === comilla) comilla = null; }
          else if (c === '"' || c === "'") comilla = c;
          else if (c === '>') break;
          j++;
        }
        const suelta = src[j - 1] === '/' || VACIOS.has(nombre);
        const tras = j + 1;
        if (cierre) {
          prof--;
          if (prof === 0 && inicio >= 0) soltar(tras);
        } else {
          if (prof === 0 && inicio < 0) inicio = i;
          if (suelta) { if (prof === 0) soltar(tras); }
          else prof++;
        }
        i = tras; continue;
      }
    }
    if (prof === 0 && inicio < 0 && !/\s/.test(src[i])) {
      // Texto suelto en el primer nivel: se pega a lo que venga detrás.
      let j = i; while (j < n && src[j] !== '<') j++;
      pendiente += (pendiente ? '\n' : '') + src.slice(i, j).trim();
      i = j; continue;
    }
    i++;
  }
  if (inicio >= 0) soltar(n);
  else if (pendiente) out.push(pendiente);
  return out.filter(b => b.length);
}

/* ─── La edición en inglés ─────────────────────────────────────

   Cinco fichas de Robótica traen traducción de autor. El motor de
   idioma cambia el HTML de cada hoja entera (data-i18n="p1".."p7"),
   así que si el reparto de la versión en español cambia y el del
   inglés no, la hoja en inglés se parte igual que antes — y en una
   bilingüe esa es la que se imprime.

   Los dos idiomas NO tienen que cortar por el mismo sitio: cada
   contenedor recibe el HTML que le dé el diccionario. Lo único que
   tiene que coincidir es CUÁNTAS hojas hay. Por eso cada idioma se
   reparte por su cuenta, con el mismo tope y las mismas reglas.
   ─────────────────────────────────────────────────────────────── */

// Cuánto sube o baja la profundidad de etiquetas una línea del archivo .js
function deltaHtml(linea) {
  let html = '', m;
  const re = /'((?:[^'\\]|\\.)*)'/g;
  while ((m = re.exec(linea)) !== null) html += m[1].replace(/\\'/g, "'");
  let d = 0;
  const t = /<(\/?)([a-zA-Z][\w-]*)([^>]*)>/g;
  while ((m = t.exec(html)) !== null) {
    const nombre = m[2].toLowerCase();
    if (VACIOS.has(nombre) || /\/$/.test(m[3])) continue;
    d += m[1] ? -1 : 1;
  }
  return d;
}

// Parte el valor de un pN: en bloques de primer nivel, línea a línea, para
// que el texto fuente salga intacto (comentarios y sangrías incluidos).
function bloquesFuente(lineas) {
  const out = [];
  let acum = [], prof = 0;
  for (const ln of lineas) {
    if (!acum.length && !ln.trim()) continue;          // el aire entre bloques se rehace al escribir
    acum.push(ln);
    prof += deltaHtml(ln);
    // El bloque se cierra en la línea que acaba en comilla, la una a lo que
    // sigue con « +» o la otra cierra la hoja con «,». Sin la coma, el último
    // bloque de cada hoja no se cerraba nunca y se llevaba por delante la
    // línea en blanco de después: al unir salía un « +» suelto y el archivo
    // dejaba de compilar.
    if (prof <= 0 && /'\s*[+,]?\s*$/.test(ln)) { out.push(acum); acum = []; prof = 0; }
  }
  if (acum.some(l => l.trim())) out.push(acum);
  // Sin líneas en blanco al final: el « +» o la coma van pegados al texto.
  return out.map(b => { const c = b.slice(); while (c.length && !c[c.length - 1].trim()) c.pop(); return c; });
}

function reescribeEn(rutaEn, grupos, blancos) {
  const src = fs.readFileSync(rutaEn, 'utf8');
  const lineas = src.split('\n');
  const marca = i => /^ {6}p\d+:\s*$/.test(lineas[i]);

  // El rótulo de una hoja puede ocupar VARIAS líneas: alguno lleva dentro una
  // nota que hace falta («la Columna B conserva el orden del español: la pauta
  // vale igual»). Se busca hacia arriba desde el pN: hasta la apertura del
  // comentario, y se guarda entero. Perder esa nota sería perder la razón por
  // la que la pauta sirve en los dos idiomas.
  function rotuloDe(iP) {
    let fin = iP - 1;
    while (fin >= 0 && !lineas[fin].trim()) fin--;
    if (fin < 0 || !/\*\/\s*$/.test(lineas[fin])) return null;
    let ini = fin;
    while (ini >= 0 && !/^\s*\/\*/.test(lineas[ini])) ini--;
    if (ini < 0 || !/PÁGINA/.test(lineas.slice(ini, fin + 1).join(' '))) return null;
    return { ini, fin, texto: lineas.slice(ini, fin + 1) };
  }

  const inicios = [];
  lineas.forEach((l, i) => { if (marca(i)) inicios.push(i); });
  if (inicios.length !== blancos.length) return null;

  const fin = lineas.findIndex((l, i) => i > inicios[inicios.length - 1] && /^ {4}\},\s*$/.test(l));
  if (fin < 0) return null;

  // El texto fuente de cada hoja, en bloques
  const bloques = [];
  const banners = inicios.map(rotuloDe);
  const primeroDe = [];               // con qué bloque empezaba cada hoja
  inicios.forEach((ini, k) => {
    const hasta = k + 1 < inicios.length
      ? (banners[k + 1] ? banners[k + 1].ini : inicios[k + 1])
      : fin;
    primeroDe.push(bloques.length);
    bloquesFuente(lineas.slice(ini + 1, hasta)).forEach(b => bloques.push(b));
  });
  const cuantos = grupos.reduce((a, g) => a + g.length, 0) + blancos[blancos.length - 1];
  if (bloques.length !== cuantos) return null;

  // Cada bloque se guarda sin lo que lo une a lo siguiente —el « +» dentro de
  // una hoja, la coma al acabarla—: se vuelve a poner al unir, y tiene que ser
  // el que toque. Poner un « +» donde iba una coma deja el archivo sin
  // compilar, y entonces la ficha en inglés no aparece: sale la española.
  const limpio = bloques.map(b => {
    const c = b.slice();
    c[c.length - 1] = c[c.length - 1].replace(/\s*[+,]\s*$/, '');
    return c;
  });

  const dePauta = blancos[blancos.length - 1];
  const reparto = grupos.concat([Array.from({ length: dePauta }, (_, i) => cuantos - dePauta + i)]);

  // Los rótulos se reaprovechan con su texto y solo se les cambia el número:
  // el de la hoja del docente tiene que seguir siendo el último, y si la ficha
  // gana una hoja, la nueva estrena rótulo sin nota.
  const conNumero = (r, n) => r.texto.map(l => l.replace(/PÁGINA \d+/, 'PÁGINA ' + n));
  const plano = n => ['      /* ═══════════ PÁGINA ' + n + ' ═══════════ */'];
  // El rótulo VIAJA CON SU CONTENIDO: si el bloque con el que empezaba la
  // hoja 6 acaba en la 7, su nota se va con él. Si no, la nota de los
  // pareados acabaría rotulando una hoja que ya no los tiene.
  const rotulo = (i, total) => {
    if (i === total - 1) {
      const ult = banners[banners.length - 1];
      return ult ? conNumero(ult, total) : plano(total);
    }
    const k = primeroDe.findIndex((b, j) => j < banners.length - 1 && banners[j] && reparto[i].indexOf(b) >= 0);
    return k >= 0 ? conNumero(banners[k], i + 1) : plano(i + 1);
  };

  const salida = [];
  reparto.forEach((g, i) => {
    if (i) salida.push('');
    salida.push(...rotulo(i, reparto.length));
    salida.push('      p' + (i + 1) + ':');
    g.forEach((idx, j) => {
      if (j) salida.push('');
      const b = limpio[idx].slice();
      if (j < g.length - 1) b[b.length - 1] += ' +';              // sigue la misma hoja
      else if (i < reparto.length - 1) b[b.length - 1] += ',';    // se acabó la hoja
      salida.push(...b);
    });
  });
  return lineas.slice(0, banners[0] ? banners[0].ini : inicios[0])
    .concat(salida, lineas.slice(fin)).join('\n');
}

/* ─── El enlace desde la misión ────────────────────────────────

   Cada misión anuncia su ficha con «Guía de estudio de N páginas». Si la
   ficha gana o pierde una hoja y ese número se queda como estaba, el
   maestro manda a fotocopiar la cuenta vieja. Se corrige aquí mismo, que
   es donde se sabe el número nuevo.
   ─────────────────────────────────────────────────────────────── */

// El índice de fichas también anuncia el largo de algunas: mismo problema.
function sincronizaIndice(archivo, total, escribe) {
  const ruta = path.join(DIR, 'index.html');
  if (!fs.existsSync(ruta)) return false;
  const html = fs.readFileSync(ruta, 'utf8');
  const re = new RegExp('(href="' + archivo + '"[\\s\\S]{0,400}?· )\\d+( páginas)');
  const nuevo = html.replace(re, (m, a, b) => a + total + b);
  if (nuevo === html) return false;
  if (escribe) fs.writeFileSync(ruta, nuevo);
  return true;
}

function sincronizaMision(archivo, total, escribe) {
  const slug = archivo.replace(/^ficha-|\.html$/g, '');
  const dirMis = path.join(RAIZ, 'misiones');
  if (!fs.existsSync(dirMis)) return null;
  for (const carpeta of fs.readdirSync(dirMis)) {
    const sub = path.join(dirMis, carpeta);
    if (!fs.statSync(sub).isDirectory()) continue;
    for (const f of fs.readdirSync(sub)) {
      if (!f.endsWith('.html')) continue;
      const ruta = path.join(sub, f);
      const html = fs.readFileSync(ruta, 'utf8');
      if (html.indexOf('fichas/ficha-' + slug + '.html') < 0) continue;
      const nuevo = html.replace(/Guía de estudio de \d+ páginas/g, 'Guía de estudio de ' + total + ' páginas');
      if (nuevo === html) return null;
      if (escribe) fs.writeFileSync(ruta, nuevo);
      return carpeta + '/' + f;
    }
  }
  return null;
}

/* ─── Programa ─────────────────────────────────────────────────── */

function fichasPedidas() {
  const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
  if (!args.length) {
    return fs.readdirSync(DIR).filter(f => f.startsWith('ficha-') && f.endsWith('.html')).sort();
  }
  return args.map(a => path.basename(a).replace(/\.html$/, '') + '.html');
}

// El reparto de verdad, dentro del navegador: se mide el TRAMO PINTADO en un
// .contenido colgado del mismo .doc, para que le apliquen las mismas reglas.
// Sumar los bloques por separado no vale: entre dos seguidos los márgenes se
// colapsan, y sumar cierra la hoja antes de tiempo.
const REPARTIR = ({ trozos, K, TOPE, mm, clasesFijas }) => {
  // La hoja de prueba va colgada del .doc EN FLUJO NORMAL, nunca posicionada:
  // una sección absoluta se encoge al contenido y mide con un ancho que no es
  // el del papel, así que las dos versiones de la ficha salían midiendo lo
  // mismo. El único retoque es quitarle el alto mínimo, que si no toda hoja
  // mediría 253 mm y no habría nada que comparar.
  const sec = document.createElement('section');
  sec.className = 'pagina';
  sec.style.cssText = 'min-height:0;margin:0';   // sin el alto mínimo de 253 mm no habría nada que comparar
  const cont = document.createElement('div');
  sec.appendChild(cont);
  document.querySelector('.doc').appendChild(sec);

  const esTitulo = trozos.map(t => /^<h[1-6][\s>]/i.test(t.html.replace(/^<!--[\s\S]*?-->\s*/, '').trim()));

  // Una hoja que reciba bloques de las páginas de actividades lleva su clase:
  // es la que subraya los rótulos y numera en negrita.
  const clasesDe = (indices, hoja) => clasesFijas
    ? clasesFijas[Math.min(hoja, clasesFijas.length - 1)]
    : (indices.some(i => trozos[i].clases.indexOf('acts') >= 0) ? 'contenido acts' : 'contenido');

  // Se mide la HOJA entera, no el hueco del contenido: el pie va dentro del
  // relleno de abajo y el margen del último bloque también cuenta. Medir solo
  // el contenido dejaba diez milímetros fuera de la cuenta, que es justo lo
  // que hace que una hoja se parta.
  function altoDe(indices, hoja) {
    cont.className = clasesDe(indices, hoja);
    cont.innerHTML = indices.map(i => trozos[i].html).join('\n');
    return sec.getBoundingClientRect().height / mm;
  }

  function empaquetar(tope) {
    const hojas = [];
    let actual = [], i = 0;
    while (i < trozos.length) {
      const prueba = actual.concat(i);
      if (!actual.length || altoDe(prueba, hojas.length) <= tope) { actual = prueba; i++; continue; }
      // No cabe: se cierra la hoja. Y un título nunca la cierra: si quedó el
      // último, baja a la hoja siguiente con lo que encabeza.
      while (actual.length > 1 && esTitulo[actual[actual.length - 1]]) actual.pop();
      hojas.push(actual);
      i = actual[actual.length - 1] + 1;
      actual = [];
    }
    if (actual.length) hojas.push(actual);
    return hojas;
  }

  // 1. Primero el MÍNIMO de hojas, sin pasar del tope.
  const minimo = empaquetar(TOPE).length;
  // 2. Después el reparto: con las hojas ya fijas, el corte que deja la hoja
  //    más cargada lo más liviana posible, para que el aire sobrante se
  //    reparta en vez de amontonarse en la última.
  //    Manda el MÍNIMO, no las hojas que la ficha traía: si ahora caben en
  //    menos, se imprimen en menos. Cada hoja de más son 43 hojas de más en
  //    el fotocopiado del grado. K solo sube el número cuando el otro idioma
  //    necesita más, porque los dos comparten los contenedores.
  const meta = Math.max(minimo, K || 0);
  let lo = 60, hi = TOPE, mejor = empaquetar(TOPE);
  while (lo <= hi) {
    const med = Math.floor((lo + hi) / 2);
    const h = empaquetar(med);
    if (h.length <= meta) { mejor = h; hi = med - 1; } else lo = med + 1;
  }
  const altos = mejor.map((g, i) => +altoDe(g, i).toFixed(1));
  const clases = mejor.map((g, i) => clasesDe(g, i));
  sec.remove();
  return { grupos: mejor, altos, clases, minimo };
};

(async () => {
  const soloRevisa = process.argv.includes('--revisa');
  const forzar = process.argv.includes('--todas');
  const lista = fichasPedidas();
  const browser = await lanzar();
  const page = await browser.newPage({ viewport: { width: Math.round(ANCHO_UTIL * MM), height: 1000 } });
  await page.emulateMedia({ media: 'print' });

  let tocadas = 0, avisos = 0;

  for (const archivo of lista) {
    const abs = path.join(DIR, archivo);
    const html = fs.readFileSync(abs, 'utf8');
    const doc = seccionar(html);
    if (!doc) { console.log(`  · ${archivo}: no tiene la forma de siempre, se omite`); continue; }

    await page.goto('file://' + abs, { waitUntil: 'load' });

    // El diccionario de la edición en inglés, si esta ficha la tiene.
    const rutaEn = path.join(DIR, 'js', archivo.replace('.html', '-en.js'));
    const dic = fs.existsSync(rutaEn) ? await page.evaluate(() => {
      const h = ((window.MISION_EN || {}).html) || {};
      const caja = document.createElement('div');
      const out = {};
      Object.keys(h).forEach(k => { caja.innerHTML = h[k]; out[k] = [...caja.children].map(c => c.outerHTML); });
      return out;
    }) : null;

    // ¿Se parte hoy alguna hoja? Primero eso, antes de tocar nada: la ficha
    // cuyo corte a mano cabe se deja en paz, porque rehacerlo mueve texto sin
    // ganar nada. Y se miran las DOS ediciones: en una bilingüe la que se
    // imprime puede ser la inglesa.
    const hoy = await page.evaluate(({ mm, dic }) => {
      const ps = [...document.querySelectorAll('.pagina')];
      // Sin el alto mínimo de 253 mm todas medirían lo mismo y no habría nada
      // que comparar.
      const previo = ps.map(p => p.style.minHeight);
      ps.forEach(p => { p.style.minHeight = '0'; });
      const medir = () => ps.map(p => +(p.getBoundingClientRect().height / mm).toFixed(1));
      const es = medir();
      let en = [];
      if (dic) {
        const guardado = ps.map(p => {
          const c = p.querySelector('.contenido');
          const k = c && c.getAttribute('data-i18n');
          const antes = c ? c.innerHTML : null;
          if (k && dic[k] != null) c.innerHTML = dic[k].join('\n');
          return [c, antes];
        });
        en = medir();
        guardado.forEach(([c, antes]) => { if (c) c.innerHTML = antes; });
      }
      ps.forEach((p, i) => { p.style.minHeight = previo[i]; });
      return { es, en };
    }, { mm: MM, dic });

    const pico = Math.max(...hoy.es, ...hoy.en);
    if (pico <= LIMITE && !forzar) {
      console.log(`  · ${archivo}: cabe tal como está (la hoja más llena mide ${pico} mm de ${LIMITE})`
        + (pico > TOPE ? '  ⟵ al filo' : ''));
      continue;
    }

    // La última hoja es la del docente: se imprime suelta y no se fotocopia,
    // así que ni recibe ni cede.
    const libres = doc.paginas.slice(0, -1);
    const porPagina = libres.map(p => partirBloques(p.cuerpo));
    const bloques = [];
    porPagina.forEach((bs, iP) => bs.forEach(b => bloques.push({ html: b, clases: libres[iP].clases })));

    // Red de seguridad: lo que partió el texto tiene que coincidir con lo que
    // ve el navegador. Si no, el archivo trae algo que este partidor no
    // entiende y es mejor no tocarlo que dejarlo a medias.
    const enDom = await page.evaluate(n => [...document.querySelectorAll('.pagina .contenido')]
      .slice(0, n).reduce((a, c) => a + c.children.length, 0), libres.length);
    if (enDom !== bloques.length) {
      console.log(`  ⚠️  ${archivo}: el navegador ve ${enDom} bloques y el texto ${bloques.length}. No se toca.`);
      avisos++; continue;
    }

    const K = libres.length;
    let es = await page.evaluate(REPARTIR, { trozos: bloques, K: 0, TOPE, mm: MM, clasesFijas: null });

    /* ── La edición en inglés, si la hay ── */
    let nuevoEn = null, en = null, blancos = null;
    if (dic) {
      const claves = Object.keys(dic).filter(k => /^p\d+$/.test(k)).sort((a, b) => +a.slice(1) - +b.slice(1));
      blancos = claves.map(k => dic[k].length);
      if (claves.length !== doc.paginas.length) {
        console.log(`  ⚠️  ${archivo}: el inglés trae ${claves.length} hojas y el español ${doc.paginas.length}. No se toca el inglés.`);
        avisos++;
      } else {
        const trozosEn = [];
        claves.slice(0, -1).forEach((k, iP) => dic[k].forEach(h => trozosEn.push({ html: h, clases: libres[iP].clases })));
        en = await page.evaluate(REPARTIR, { trozos: trozosEn, K: es.grupos.length, TOPE, mm: MM, clasesFijas: es.clases });
        // Los dos idiomas comparten los contenedores, así que tienen que dar
        // el MISMO número de hojas: el que pida más manda, y el otro se
        // vuelve a repartir con ese número para que le sobre aire, no le falte.
        if (en.grupos.length > es.grupos.length) {
          es = await page.evaluate(REPARTIR, { trozos: bloques, K: en.grupos.length, TOPE, mm: MM, clasesFijas: null });
          en = await page.evaluate(REPARTIR, { trozos: trozosEn, K: es.grupos.length, TOPE, mm: MM, clasesFijas: es.clases });
        }
        nuevoEn = reescribeEn(rutaEn, en.grupos, blancos);
        // Y tiene que compilar. Un archivo de traducción con un error de
        // sintaxis no da la cara: el botón 🌐 se queda mudo y la bilingüe
        // imprime en español sin que nadie sepa por qué.
        if (nuevoEn !== null) {
          try { new vm.Script(nuevoEn, { filename: rutaEn }); }
          catch (err) {
            console.log(`  ⚠️  ${archivo}: el inglés rehecho no compila (${err.message}). No se toca el inglés.`);
            avisos++; nuevoEn = null;
          }
        }
        if (nuevoEn === null) {
          console.log(`  ⚠️  ${archivo}: no se pudo releer ${path.basename(rutaEn)} bloque a bloque. No se toca el inglés.`);
          avisos++;
        }
      }
    }

    if (es.grupos.length > K) {
      console.log(`  ⚠️  ${archivo}: no cabe en ${K} hojas de alumno; se reparte en ${es.grupos.length}`
        + ` (hoy ya se imprime en más de ${K + 1}).`);
      avisos++;
    }

    const cambiaEs = es.grupos.length !== K
      || es.grupos.some((g, i) => g.length !== porPagina[i].length);
    const cambiaEn = en && nuevoEn !== null
      && (en.grupos.length !== blancos.length - 1 || en.grupos.some((g, i) => g.length !== blancos[i]));

    if (!cambiaEs && !cambiaEn) {
      console.log(`  · ${archivo}: el reparto ya estaba bien (${es.altos.join(' · ')} mm)`);
      continue;
    }

    /* ── Escribir ── */
    const total = es.grupos.length + 1;
    // Los rótulos se rehacen, no se reciclan: si la ficha gana una hoja, el
    // que dice «HOJA SUELTA DEL DOCENTE» tiene que seguir siendo el último.
    const ultimoRot = doc.rotulos[doc.rotulos.length - 1] || '';
    const extraRot = (/PÁGINA \d+(.*?)═/.exec(ultimoRot) || [, ' '])[1];
    const rotulo = (n, esUltima) => doc.rotulos[0] === null && n === 1 ? null
      : '<!-- ═══════════ PÁGINA ' + n + (esUltima ? extraRot : ' ') + '═══════════ -->';
    const secciones = es.grupos.map((g, i) => {
      const modelo = libres[Math.min(i, libres.length - 1)];
      const attrs = modelo.atributos.replace(/data-i18n="p\d+"/, `data-i18n="p${i + 1}"`);
      const rot = rotulo(i + 1, false);
      return `${rot ? rot + '\n' : ''}${modelo.etiqueta}\n  <div class="${es.clases[i]}"${attrs}>\n\n`
        + g.map(b => '    ' + bloques[b].html).join('\n\n')
        + `\n\n  </div>\n  ${modelo.pie.replace(/Página \d+/, `Página ${i + 1}`)}\n</section>`;
    });
    const doce = doc.paginas[doc.paginas.length - 1];
    secciones.push(`${rotulo(total, true)}\n${doce.etiqueta}\n  <div class="${doce.clases}"${doce.atributos.replace(/data-i18n="p\d+"/, `data-i18n="p${total}"`)}>\n\n`
      + partirBloques(doce.cuerpo).map(b => '    ' + b).join('\n\n')
      + `\n\n  </div>\n  ${doce.pie.replace(/Página \d+/, `Página ${total}`)}\n</section>`);

    if (!soloRevisa) {
      fs.writeFileSync(abs, doc.cabeza + secciones.join('\n\n') + doc.cola);
      if (cambiaEn) fs.writeFileSync(rutaEn, nuevoEn);
    }
    const mision = sincronizaMision(archivo, total, !soloRevisa);
    const indice = sincronizaIndice(archivo, total, !soloRevisa);
    tocadas++;
    console.log(`  ${soloRevisa ? '·' : '✎'} ${archivo}: ${total} hojas · ${es.altos.join(' · ')} mm`
      + (cambiaEn ? `\n      · y su inglés: ${en.altos.join(' · ')} mm` : '')
      + (mision ? `\n      · y su misión ya anuncia ${total} páginas (${mision})` : '')
      + (indice ? `\n      · y el índice de fichas también` : ''));
  }

  await browser.close();
  console.log(`\n${avisos ? '⚠️ ' : '✅'} ${tocadas} ficha(s) repartida(s)${avisos ? `, ${avisos} con aviso` : ''}.`
    + `\n   Ahora: node _dev/verifica-ficha-paginas.js\n`);
  process.exit(avisos ? 1 : 0);
})().catch(e => { console.error('✘ La herramienta tropezó:', e.stack); process.exit(1); });
