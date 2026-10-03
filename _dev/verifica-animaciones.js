#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · La animación que explica el tema, leída del archivo
   ------------------------------------------------------------
   La animación va misión por misión por la ruta de Matemáticas, y
   lo que se multiplica al copiar el bloque de una misión a otra no
   son solo los aciertos. Esta sonda lee del ARCHIVO todas las que
   la montan —abrirlas con Playwright lo hace la otra,
   verifica-animacion-mision— y mira lo que se rompe al copiar:

   1. ⚠️ **Va justo después de la historia**, en la sección por la
      que el alumno entra. Así lo pidió el autor, y no es capricho:
      la historia termina diciendo qué va a ver el alumno, y lo
      tiene que ver ahí, no dos tarjetas más abajo.
   2. **La hoja va DESPUÉS del CSS de la misión**, que es de donde
      saca sus colores. Al revés no da error: da botones sin color.
   3. **El aparato antes que la escena**, y la escena monta el
      bloque que de verdad está en la tarjeta. Copiar el bloque y
      olvidar cambiar el id deja la tarjeta con su frase de reserva
      para siempre, sin un solo error en la consola.
   4. **La tarjeta trae su frase de reserva.** Si el aparato no
      llega, el alumno lee eso y no un hueco.
   5. **La escena no gasta de más ni sale del sitio**: ni un
      setInterval, ni un requestAnimationFrame (entre toque y toque
      el teléfono no tiene que hacer nada), ni una dirección de
      fuera.
   6. **Mirarla no da XP ni marca la sección**: es la regla de los
      videos. La escena no llama a fin(), ni a pts(), ni a ningún
      logro.
   7. **El aparato está en el armazón del service worker**, o sin
      señal la tarjeta se queda con su frase de reserva.

   Como las demás sondas que buscan algo prohibido, quita los
   COMENTARIOS antes de buscar: el sitio donde se explica por qué no
   hay un requestAnimationFrame es justo donde está escrita la
   palabra.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0;
const ok = (bien, txt, extra) => {
  if (!bien) fallos++;
  console.log((bien ? '  ✓ ' : '  ✘ ') + txt + (extra !== undefined ? '  → ' + JSON.stringify(extra) : ''));
};

function sinComentariosJs(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"])\/\/[^\n]*/g, '$1');
}
function sinComentariosHtml(s) { return s.replace(/<!--[\s\S]*?-->/g, ''); }

/* Busca el cierre del <div> que abre en `desde`, contando los <div> de
   dentro. No hace falta un analizador de HTML para esto: las misiones
   no traen <div> dentro de atributos ni de comentarios (se quitan antes). */
function finDelDiv(html, desde) {
  const re = /<\/?div\b[^>]*>/g;
  re.lastIndex = desde;
  let hondo = 0, m;
  while ((m = re.exec(html))) {
    if (m[0][1] === '/') { hondo--; if (hondo === 0) return re.lastIndex; }
    else hondo++;
  }
  return -1;
}

/* ── las misiones que la montan ────────────────────────────── */
const misiones = [];
for (const dir of fs.readdirSync(path.join(RAIZ, 'misiones'))) {
  const carpeta = path.join(RAIZ, 'misiones', dir);
  if (!fs.statSync(carpeta).isDirectory()) continue;
  for (const f of fs.readdirSync(carpeta)) {
    if (!f.endsWith('.html')) continue;
    const html = fs.readFileSync(path.join(carpeta, f), 'utf8');
    if (/data-animacion\b/.test(html)) misiones.push({ dir, archivo: f, carpeta, html });
  }
}

console.log(`\nLa animación que explica el tema: ${misiones.length} misión(es) la montan`);
ok(misiones.length > 0, 'hay por lo menos una (si no, esta sonda no está mirando nada)');

/* ── 7 · el aparato, en el armazón ────────────────────────── */
const sw = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
const lista = (sw.match(/const STATIC_ASSETS = \[([\s\S]*?)\n\];/) || [])[1] || '';
const listaSinComent = sinComentariosJs(lista);
ok(listaSinComent.includes("'./js/animacion-mision.js'") && listaSinComent.includes("'./css/animacion-mision.css'"),
  'el aparato y su hoja están en STATIC_ASSETS de sw.js (sin señal también se ven)');

/* ── el aparato mismo ─────────────────────────────────────── */
const aparato = sinComentariosJs(fs.readFileSync(path.join(RAIZ, 'js/animacion-mision.js'), 'utf8'));
ok(!/\bsetInterval\s*\(|\brequestAnimationFrame\s*\(/.test(aparato),
  'el aparato no deja un bucle de dibujo corriendo (todo el movimiento es de CSS)');
ok(/prefers-reduced-motion/.test(aparato), 'el aparato pregunta por «reducir movimiento»');
ok(/aria-live/.test(aparato), 'la frase de cada paso se anuncia (aria-live)');
const hoja = fs.readFileSync(path.join(RAIZ, 'css/animacion-mision.css'), 'utf8');
ok(/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(hoja), 'la hoja apaga el movimiento con «reducir movimiento»');
ok(/min-height:\s*44px/.test(hoja), 'los botones tienen 44 px de blanco de toque');

const idsVistos = {};
for (const m of misiones) {
  console.log(`\n${m.dir}/${m.archivo}`);
  const html = sinComentariosHtml(m.html);

  /* 1 · justo después de la historia, en la sección por la que se entra.
     ⚠️ Una misión puede tener MÁS de una animación (la del Himno lleva cuatro:
     la de la entrada y tres en la sección de las estrofas). La regla de la
     historia es de la PRIMERA, la que abre la misión; las demás van donde
     enseñan, y de cada una se pide lo mismo que de la primera: su bloque, un
     id que no se repite, su frase de reserva y una escena que la monte. */
  const iSit = html.search(/<div\b[^>]*\bdata-situacion\b[^>]*>/);
  const inicios = [...html.matchAll(/<div\b[^>]*\bdata-animacion\b[^>]*>/g)].map(x => x.index);
  const iAni = inicios.length ? inicios[0] : -1;
  /* ⚠️ Las misiones del maestro no traen la historia en una tarjeta: su
     encabezado ES la situación (`<header class="hero">` con su
     `<p data-situacion>`), con su precio dentro, y es lo primero que el
     maestro lee. Una tarjeta puesta detrás de ese encabezado cayó a 764 px,
     debajo del pliegue, repitiendo lo que ya decía (está en la normativa del
     relato). Ahí TODAS las animaciones son de contenido: van dentro de la
     sección cuyo tema explican, como las tres del Himno, y la regla de «justo
     después de la historia» no se les pide a ninguna. */
  const enCabecera = iSit < 0 && /<header\b[^>]*>(?:(?!<\/header>)[\s\S])*<p\b[^>]*\bdata-situacion\b/.test(html);
  ok(iSit >= 0 || enCabecera, enCabecera
    ? 'la historia es el encabezado (data-situacion), y las animaciones van dentro de las secciones que explican'
    : 'la misión tiene su historia de arranque (data-situacion)');
  if (iSit >= 0 && iAni >= 0) {
    const finSit = finDelDiv(html, iSit);
    const entre = html.slice(finSit, iAni).trim();
    ok(finSit > 0 && entre === '', 'la animación va JUSTO después de la historia, sin nada en medio', entre.slice(0, 60));
    const antes = html.slice(0, iSit);
    const sec = antes.lastIndexOf('<div class="sec');
    const cab = sec >= 0 ? html.slice(sec, html.indexOf('>', sec) + 1) : '';
    ok(/\bactive\b/.test(cab), 'y las dos están en la sección por la que el alumno entra (la marcada active)', cab);
  }
  if (inicios.length > 1) ok(true, `y lleva ${inicios.length - 1} ${inicios.length > 2 ? 'animaciones' : 'animación'} más, dentro de sus secciones`);

  /* 4 · la frase de reserva, y 3 · el id que monta la escena, en cada tarjeta */
  const tarjetas = inicios.map(i0 => {
    const fin = finDelDiv(html, i0);
    const tarjeta = fin > 0 ? html.slice(i0, fin) : '';
    const idCont = ((tarjeta.match(/<div\b[^>]*\bid="([^"]+)"/) || [])[1]) || '';
    return { i0, tarjeta, idCont };
  });
  /* La sección que la contiene: un <div class="sec…"> en las del alumno, un
     <section class="sec…"> en las del maestro. De la segunda se sabe dónde
     cierra, así que se pide que la tarjeta quede ANTES de ese cierre: una
     tarjeta pegada después de la última sección no se ve nunca. */
  const sec0 = i => {
    const antes = html.slice(0, i);
    const k = antes.lastIndexOf('<div class="sec');
    const ks = antes.lastIndexOf('<section class="sec');
    if (ks > k) { const cierra = html.indexOf('</section>', ks); return cierra > i ? ks : -1; }
    return k;
  };
  for (const t of tarjetas) {
    ok(!!t.idCont, 'la tarjeta tiene el bloque que el aparato llena (un <div id=…>)', t.idCont);
    if (t !== tarjetas[0] || enCabecera) ok(sec0(t.i0) >= 0, `la tarjeta de #${t.idCont} va dentro de una sección de la misión`);
    /* ⚠️ Y ese id es de ESTA tarjeta y de ninguna otra. La sonda del
       navegador guarda lo que mide cada escena por su id: dos con el mismo
       id se pisan, y la segunda revisa la primera con el lector que no es.
       Pasó con #amRecado, que ya era de Los Adverbios cuando lo tomó la del
       Robot Mensajero. */
    if (t.idCont) {
      const otra = idsVistos[t.idCont];
      ok(!otra, `el id #${t.idCont} no lo usa ninguna otra animación`, otra);
      if (!otra) idsVistos[t.idCont] = m.dir;
    }
    const reserva = t.tarjeta.replace(/<h2[\s\S]*?<\/h2>/, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    ok(reserva.length >= 40, `#${t.idCont} trae su frase de reserva por si el aparato no llega`, reserva.slice(0, 50));
  }
  const idCont = tarjetas.length ? tarjetas[0].idCont : '';
  const tarjeta = tarjetas.length ? tarjetas[0].tarjeta : '';

  /* 2 · la hoja, después del CSS de la misión */
  const iCssMision = m.html.search(/<link[^>]*href="css\/[^"]+\.css(?:\?[^"]*)?"/);
  const iCssAnim = m.html.indexOf('href="../../css/animacion-mision.css"');
  ok(iCssAnim > 0, 'enlaza la hoja de la animación');
  ok(iCssMision < 0 || iCssAnim > iCssMision, 'la hoja de la animación va DESPUÉS del CSS de la misión (de ahí saca sus colores)');

  /* 3 · el aparato antes que la escena, y la escena monta ESE bloque */
  const iAparato = m.html.indexOf('src="../../js/animacion-mision.js"');
  const escenas = [...m.html.matchAll(/src="(js\/animacion-[^"?]+\.js)(?:\?[^"]*)?"/g)].map(x => ({ src: x[1], i: x.index }));
  /* ⚠️ Una escena que comparten varias misiones (la del año de Kenia, en las
     cuatro Pruebas de Fin de Grado) vive en ../../js/escena-*.js, para no
     copiarla cuatro veces. Se le pide lo mismo que a cualquier escena: que
     cargue después del aparato y antes de la de la misión, y que no gaste,
     no salga del sitio ni dé XP. */
  const comunes = [...m.html.matchAll(/src="\.\.\/\.\.\/(js\/escena-[^"?]+\.js)(?:\?[^"]*)?"/g)].map(x => ({ src: x[1], i: x.index }));
  for (const c of comunes) {
    ok(c.i > m.html.indexOf('src="../../js/animacion-mision.js"') && escenas.every(e => e.i > c.i), `la escena común ${c.src} se carga después del aparato y antes de la de la misión`);
    const ruta = path.join(RAIZ, c.src);
    if (!fs.existsSync(ruta)) { ok(false, `existe ${c.src}`); continue; }
    const js = sinComentariosJs(fs.readFileSync(ruta, 'utf8'));
    ok(!/\bsetInterval\s*\(|\brequestAnimationFrame\s*\(/.test(js), `${c.src}: sin bucle de dibujo (ni setInterval ni requestAnimationFrame)`);
    ok(!/https?:\/\//.test(js), `${c.src}: no pide nada fuera del sitio`);
    const premios = js.match(/\b(fin|pts|unlockAchievement|saveProgress|launchConfetti)\s*\(/g);
    ok(!premios, `${c.src}: mirarla no da XP, ni estrella, ni logro`, premios || undefined);
  }
  ok(iAparato > 0, 'carga el aparato (js/animacion-mision.js)');
  ok(escenas.length > 0, 'carga su escena (js/animacion-<tema>.js)');
  const montadas = {};
  const fuentes = [];
  for (const e of escenas) {
    ok(e.i > iAparato, `la escena ${e.src} se carga DESPUÉS del aparato`);
    const ruta = path.join(m.carpeta, e.src);
    if (!fs.existsSync(ruta)) { ok(false, `existe ${e.src}`); continue; }
    const fuente = fs.readFileSync(ruta, 'utf8');
    const js = sinComentariosJs(fuente);
    fuentes.push(js);
    for (const t of tarjetas) {
      if (js.includes(`AnimacionMision.montar('#${t.idCont}'`) || js.includes(`AnimacionMision.montar("#${t.idCont}"`)) montadas[t.idCont] = (montadas[t.idCont] || 0) + 1;
    }

    /* 5 · no gasta de más ni sale del sitio */
    ok(!/\bsetInterval\s*\(|\brequestAnimationFrame\s*\(/.test(js), `${e.src}: sin bucle de dibujo (ni setInterval ni requestAnimationFrame)`);
    ok(!/https?:\/\//.test(js), `${e.src}: no pide nada fuera del sitio`);
    /* 6 · mirarla no da XP */
    const premios = js.match(/\b(fin|pts|unlockAchievement|saveProgress|launchConfetti)\s*\(/g);
    ok(!premios, `${e.src}: mirarla no da XP, ni estrella, ni logro`, premios || undefined);
  }
  for (const t of tarjetas) ok(montadas[t.idCont] === 1, `una escena, y solo una, monta el bloque que está en la tarjeta (#${t.idCont})`, montadas[t.idCont] || 0);
  /* y cada escena monta una tarjeta que existe: una escena huérfana es un
     archivo que se baja y no se ve */
  ok(escenas.length <= tarjetas.length + comunes.length, 'no se carga ninguna escena de más (una por tarjeta)', { escenas: escenas.length, tarjetas: tarjetas.length });

  /* 8 · ⚠️ En una misión BILINGÜE (trae su -en.js y el botón 🌐), la
     animación habla los dos idiomas. El motor de idioma traduce buscando
     frases exactas de un diccionario, y las de una animación no están en
     ninguno: el alumno que estudia en inglés se quedaba con la animación en
     español, sin un solo error. La escena trae su inglés escrito; la
     tarjeta entera NO lleva data-i18n, porque el motor le cambiaría el HTML
     de dentro y se llevaría la animación montada; el título sí, con su
     clave en el -en.js. */
  const enSrc = (m.html.match(/src="(js\/[^"?]+-en\.js)/) || [])[1];
  if (enSrc) {
    ok(fuentes.some(js => /\bbilingue\s*:\s*true\b/.test(js)), 'la misión es bilingüe y su escena también (bilingue: true, con su inglés escrito)');
    const en = fs.readFileSync(path.join(m.carpeta, enSrc), 'utf8');
    for (const t of tarjetas) {
      const abre = (html.slice(t.i0).match(/<div\b[^>]*>/) || [''])[0];
      ok(!/\bdata-i18n=/.test(abre), `la tarjeta de #${t.idCont} NO lleva data-i18n (el motor se llevaría la animación montada)`, abre);
      const h2 = (t.tarjeta.match(/<h2\b[^>]*>/) || [''])[0];
      const clave = (h2.match(/data-i18n="([^"]+)"/) || [])[1];
      ok(!!clave, 'su título lleva data-i18n, para que también se lea en inglés', h2);
      ok(!!clave && new RegExp('(^|[\\s,{])' + clave + '\\s*:').test(en), `y la clave «${clave}» tiene su inglés en ${enSrc}`);
    }
  }
}

console.log('\n' + (fallos ? `✘ ${fallos} comprobaciones fallaron` : '✓ la animación está donde va, se ve sin señal y no regala nada'));
process.exit(fallos ? 1 : 0);
