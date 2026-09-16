#!/usr/bin/env node
/* Repara las sopas de letras: que la palabra ESTÉ en la rejilla y que las
   celdas que se pintan al encontrarla sean las suyas.

   De dónde sale. `verifica-mision-nueva.js` comprueba las sopas, pero pide
   la carpeta de una misión, así que está fuera de `npm test` y nadie la
   corría por las 83. Al pasarla entera salieron **12 palabras en 5
   misiones** que no cuadraban, y no todas cuestan lo mismo:

   · Si la palabra SÍ está en la rejilla, el alumno la encuentra —el juego
     lee las letras de la rejilla y acepta los dos sentidos—; lo que está
     mal es qué celdas se pintan de verde al acertar. Feo, no bloqueante.
   · ⚠️ Si la palabra NO está, el alumno la busca hasta cansarse y no
     aparece nunca — y como la sección solo se da por hecha cuando están
     TODAS, esa estrella queda **imposible de ganar para siempre**. Es la
     misma avería que el Clasifica que marcaba en rojo al que acertó: la
     pantalla pidiendo algo que ella misma no permite hacer.

   Cómo repara, y por qué así:

   1. Primero BUSCA la palabra en la rejilla, en las ocho direcciones. Si
      está, no toca ni una letra: solo corrige las celdas. Una rejilla que
      funciona no se rehace, que mover letras mueve las demás palabras.
   2. Solo si no está, la COLOCA — y la coloca donde menos daño hace:
      se prefiere el sitio que aprovecha letras que ya estaban (cruces de
      palabras, que es lo que hace bonita una sopa) y nunca se pisa una
      letra que ya pertenece a otra palabra colocada.
   3. ⚠️ Si la palabra NO CABE —«DEMOSTRATIVO» son 12 letras y la rejilla
      10×10; por la diagonal más larga caben 10—, lo que crece es la
      REJILLA, no se recorta la palabra. Alguien ya recortó una para que
      cupiera y dejó «EXPLICATIV» delante del alumno, que no es una palabra
      de nada: eso es cambiar el producto para aprobar el examen. El
      renderizado saca las filas y el tamaño de celda de `set.size`, así que
      crecer no toca ni una línea de la misión, y a 12 columnas la celda
      mínima de 20 px sigue cabiendo de sobra en un teléfono de 360.
   4. Lo que YA está bien no se toca. La primera versión reescribía las
      celdas de toda palabra que encontrara en otro sitio, y en Potencias y
      Raíces «RAIZ» sale dos veces: la señalaba «mal pintada» estando
      perfecta. Una herramienta que acusa a un archivo sano enseña a no
      mirarla — es la misma lección que la auditoría con «Cuadrado
      Perfecto». Solo se corrige la palabra cuyas celdas declaradas NO
      deletrean la palabra sobre la rejilla.
   5. ⚠️ Y se lee lo que CORRE, no el primer literal que aparezca. En El
      Adjetivo Avanzado había tres sopas en el mismo archivo: la escrita, una
      muerta que no usaba nadie, y un `sopaSets[0] = {…}` más abajo que
      PISABA la buena. Esta herramienta reparó la primera —y la pantalla
      siguió enseñando la otra, con «PREDICAT» en la lista de palabras—. Un
      archivo con dos fuentes de verdad no se «repara»: se deja en una, y la
      sonda lo dice por su nombre en vez de arreglar lo que no se ve.
   6. Y antes de escribir, el archivo tiene que COMPILAR. Es la lección de
      siempre: un error de sintaxis no da la cara —el navegador se calla y
      la página se pinta igual—, y aquí dejaría la misión sin su JS entero.

   ⚠️ Y por defecto COMPRUEBA, no escribe. Es al revés que las otras
   herramientas que reescriben archivos, y a propósito: así puede entrar en
   `npm test` —`corre-sondas.js` las llama sin argumentos— y así ninguna
   equivocación reescribe 68 misiones de un tecleo. Reparar es la excepción
   y se pide con todas las letras.

      node _dev/verifica-sopas.js            → comprueba las 83; roja si algo no cuadra
      node _dev/verifica-sopas.js --repara   → repara lo que haga falta
      node _dev/verifica-sopas.js --repara <carpeta>   → una misión
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const RAIZ = path.join(__dirname, '..');
const args = process.argv.slice(2);
const REPARA = args.includes('--repara');
const FILTRO = args.filter(a => !a.startsWith('--'))[0] || '';   // solo al reparar

const DIRS = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/* Relleno con SEMILLA: el mismo archivo da siempre las mismas letras, así
   volver a correr la herramienta no ensucia el diff. Es la misma decisión
   que en `reparte-respuestas.js`. */
function rng(semilla) {
  return function () {
    semilla = (semilla + 0x6D2B79F5) >>> 0;
    let t = semilla;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ¿Las celdas que trae declaradas deletrean la palabra sobre la rejilla? */
function celdasValen(grid, w, cells) {
  if (!Array.isArray(cells) || cells.length !== w.length) return false;
  for (let k = 0; k < w.length; k++) {
    const c = cells[k];
    if (!Array.isArray(c)) return false;
    const [r, cc] = c;
    if (!grid[r] || grid[r][cc] !== w[k]) return false;
  }
  return true;
}

/* Crecer la rejilla hasta que quepa la palabra más larga. Lo que ya estaba
   se queda donde estaba —arriba y a la izquierda—, para no mover las
   palabras que ya funcionan; lo nuevo se rellena con letras sembradas. */
function crecer(set, hasta, dado) {
  const antes = set.size;
  for (let r = 0; r < hasta; r++) {
    if (!set.grid[r]) set.grid[r] = [];
    for (let c = 0; c < hasta; c++) {
      if (set.grid[r][c] === undefined) set.grid[r][c] = ABC[Math.floor(dado() * 26)];
    }
  }
  set.size = hasta;
  return antes;
}



/* ── ¿hay una SEGUNDA tabla escrita a mano? ───────────────────────────
   Lo que se busca no es «una asignación más»: es una segunda FUENTE DE
   VERDAD. Distinguirla pedía dos cosas, y las dos costaron un falso
   positivo:

   ⚠️ Se quitan los COMENTARIOS antes de buscar. El bloque de arriba explica
   la avería escribiendo `sopaSets[0] = {…}`, así que sin esto la
   herramienta se acusaba a sí misma — y en El Adjetivo Avanzado señalaba
   una pisada que ella misma acababa de quitar. Es la quinta vez que este
   repositorio muerde esta trampa: el sitio donde se explica por qué algo ya
   no está es justo donde ese algo sigue escrito.

   ⚠️ Y se mira QUÉ se le asigna. Las nueve misiones bilingües hacen
   `sopaSets = usa('sopaSets')` al cambiar de idioma: eso no es una segunda
   tabla, es la traducción —una sopa en inglés no puede reusar la cuadrícula
   española—. Lo que sí es avería es que le metan otro `[…]` o `{…}`
   escrito a mano, o una copia de sí misma (`sopaSets[1] = sopaSets[0]`,
   que es lo que hacía que «🔄 Nueva sopa» devolviera siempre la misma).

   Se miró primero contando llaves para saber qué corría al cargar, y se
   descartó: un contador a mano se despista con las expresiones regulares
   del propio archivo, y señaló como pisadas dos cambios de idioma. Mirar
   el valor no se despista. */
function segundasTablas(src, desde) {
  let cad = null, fuera = '', i = 0;
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (cad) {
      if (c === '\\') { fuera += '  '; i += 2; continue; }
      if (c === cad) cad = null;
      fuera += ' '; i++; continue;
    }
    if (c === '/' && d === '/') { while (i < src.length && src[i] !== '\n') { fuera += ' '; i++; } continue; }
    if (c === '/' && d === '*') { const f = src.indexOf('*/', i + 2); const n = (f < 0 ? src.length : f + 2) - i; fuera += ' '.repeat(n); i += n; continue; }
    if (c === '\'' || c === '"' || c === '`') { cad = c; fuera += ' '; i++; continue; }
    fuera += c; i++;
  }
  const re = /sopaSets\s*(?:\[[^\]]*\])?\s*=(?!=)\s*([\[{]|sopaSets)/g;
  const hallazgos = [];
  let m;
  while ((m = re.exec(fuera))) if (m.index >= desde) hallazgos.push(m[0].replace(/\s+/g, ' ').trim());
  return hallazgos;
}

/* ── hay sopas que se GENERAN, no se escriben ──────────────────────────
   La misión de saludos en inglés arma las suyas con `_sopaBuild(...)`, y
   así por construcción no pueden descuadrar: las celdas salen de donde se
   puso la palabra. Es la mejor forma de tenerla, y por eso aquí no se
   «arregla» nada suyo.

   Pero tiene un descuido propio que tampoco da la cara: si tras 800
   intentos no logra colocar una palabra, la DEJA FUERA en silencio. Al
   alumno no se le rompe nada —esa palabra no se le pide ni se le enseña—,
   pero la misión enseña menos vocabulario del que su autor escribió, y
   nadie se entera. Así que se evalúa el generador y se compara lo que
   entró con lo que salió.

   Para poder evaluarlo se traen al sandbox, y solo ellas, las funciones
   que la propia expresión nombra (y las que ellas nombren). Nada del DOM
   entra por aquí. */
function funcionDe(src, nombre) {
  const re = new RegExp('function\\s+' + nombre.replace(/[$]/g, '\\$') + '\\s*\\(');
  const m = re.exec(src);
  if (!m) return null;
  let i = src.indexOf('{', m.index), prof = 0, cad = null;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (cad) { if (c === '\\') j++; else if (c === cad) cad = null; continue; }
    if (c === '\'' || c === '"' || c === '`') { cad = c; continue; }
    if (c === '{') prof++;
    else if (c === '}') { prof--; if (!prof) return src.slice(m.index, j + 1); }
  }
  return null;
}
function conAyudantes(src, expr) {
  const puestas = new Set();
  let codigo = '', pendientes = [expr];
  while (pendientes.length) {
    const txt = pendientes.pop();
    for (const id of new Set(txt.match(/[A-Za-z_$][\w$]*/g) || [])) {
      if (puestas.has(id)) continue;
      const f = funcionDe(src, id);
      if (!f) continue;
      puestas.add(id); codigo += f + '\n'; pendientes.push(f);
    }
  }
  return codigo;
}

/* ── saca el literal `sopaSets = [ … ]` contando corchetes ────────────── */
function sacarLiteral(src) {
  const m = /(?:const|let|var)\s+sopaSets\s*=\s*\[/.exec(src);
  if (!m) return null;
  const ini = m.index + m[0].length - 1;
  let prof = 0, i = ini, enCadena = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (enCadena) { if (c === '\\') i++; else if (c === enCadena) enCadena = null; continue; }
    if (c === '\'' || c === '"' || c === '`') { enCadena = c; continue; }
    if (c === '[') prof++;
    else if (c === ']') { prof--; if (!prof) { i++; break; } }
  }
  return { ini, fin: i, texto: src.slice(ini, i) };
}

/* ── ¿está la palabra en la rejilla? Devuelve su camino ───────────────── */
function buscar(grid, w) {
  const n = grid.length;
  for (let r = 0; r < n; r++) for (let c = 0; c < grid[r].length; c++) {
    if (grid[r][c] !== w[0]) continue;
    for (const [dr, dc] of DIRS) {
      const camino = [];
      let ok = true;
      for (let k = 0; k < w.length; k++) {
        const rr = r + dr * k, cc = c + dc * k;
        if (rr < 0 || cc < 0 || rr >= n || cc >= grid[rr].length || grid[rr][cc] !== w[k]) { ok = false; break; }
        camino.push([rr, cc]);
      }
      if (ok) return camino;
    }
  }
  return null;
}

/* ── colocarla sin pisar lo de nadie, prefiriendo los cruces ──────────── */
function colocar(grid, w, tomadas) {
  const n = grid.length;
  let mejor = null;
  for (let r = 0; r < n; r++) for (let c = 0; c < grid[r].length; c++) {
    for (const [dr, dc] of DIRS) {
      const camino = []; let cruces = 0, ok = true;
      for (let k = 0; k < w.length; k++) {
        const rr = r + dr * k, cc = c + dc * k;
        if (rr < 0 || cc < 0 || rr >= n || cc >= grid[rr].length) { ok = false; break; }
        const yaEs = grid[rr][cc];
        const clave = rr + ',' + cc;
        if (tomadas.has(clave)) {            // letra de otra palabra: solo si coincide
          if (yaEs !== w[k]) { ok = false; break; }
          cruces++;
        } else if (yaEs === w[k]) cruces++;  // coincide de casualidad: también es cruce
        camino.push([rr, cc]);
      }
      if (!ok) continue;
      /* A igualdad de cruces manda el orden de barrido, para que la
         herramienta dé siempre el mismo resultado y el diff no se ensucie
         al volver a correrla. */
      if (!mejor || cruces > mejor.cruces) mejor = { camino, cruces };
    }
  }
  if (!mejor) return null;
  mejor.camino.forEach(([rr, cc], k) => { grid[rr][cc] = w[k]; });
  return mejor.camino;
}

/* ── vuelve a escribir el literal, con el formato de siempre ──────────── */
function emitir(sets, sangria) {
  const s = sangria, s2 = s + '    ', s3 = s + '        ', s4 = s + '            ';
  const trozos = sets.map(set => {
    const filas = set.grid.map(f => s4 + '[' + f.map(x => `'${x}'`).join(', ') + '],').join('\n');
    const pal = set.words.map(w =>
      s4 + `{ w: '${w.w}', cells: [` + w.cells.map(([r, c]) => `[${r}, ${c}]`).join(', ') + '] },').join('\n');
    return s2 + '{\n' + s3 + `size: ${set.size},\n` + s3 + 'grid: [\n' + filas + '\n' + s3 + '],\n'
         + s3 + 'words: [\n' + pal + '\n' + s3 + ']\n' + s2 + '}';
  });
  return '[\n' + trozos.join(',\n') + '\n' + s + ']';
}

/* ── recorremos las misiones ──────────────────────────────────────────── */
const jsMisiones = [];
(function barrer(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) barrer(p);
    else if (e.name.endsWith('.js') && !e.name.endsWith('-en.js')) {
      const t = fs.readFileSync(p, 'utf8');
      if (/(?:const|let|var)\s+sopaSets\s*=\s*\[/.test(t)) jsMisiones.push(p);
    }
  }
})(path.join(RAIZ, 'misiones'));

let tocadas = 0, imposibles = 0, pintadas = 0, generadas = 0;
for (const archivo of jsMisiones.sort()) {
  const rel = path.relative(RAIZ, archivo);
  if (FILTRO && !rel.includes(FILTRO)) continue;
  const src = fs.readFileSync(archivo, 'utf8');
  const lit = sacarLiteral(src);
  if (!lit) continue;

  /* ⚠️ ¿alguien la PISA más abajo? Entonces lo que se lee aquí no es lo que
     ve el alumno, y arreglarlo sería arreglar lo que no se ve. */
  const pisa = segundasTablas(src, lit.fin);
  if (pisa.length) {
    console.log(`\n${rel}`);
    console.log(`   · ⚠ hay OTRA tabla de sopa más abajo, ${pisa.length} vez/veces (${pisa[0]}…):`);
    console.log('     la de arriba no llega a la pantalla. Déjese UNA sola.');
    tocadas++;
    continue;
  }
  let sets, generada = false;
  try { sets = vm.runInNewContext('(' + lit.texto + ')'); }
  catch (e) {
    try {
      sets = vm.runInNewContext(conAyudantes(src, lit.texto) + ';(' + lit.texto + ')');
      generada = true;
    } catch (e2) { console.log(`  ⚠ no se pudo leer la sopa de ${rel}: ${e2.message}`); continue; }
  }

  /* Una sopa generada no se toca: solo se comprueba que no haya perdido
     palabras por el camino. */
  if (generada) {
    generadas++;
    const pedidas = (lit.texto.match(/'[A-ZÁÉÍÓÚÑ]{2,}'/g) || []).map(s => s.slice(1, -1));
    const salieron = new Set([].concat(...sets.map(s => s.words.map(w => w.w))));
    const perdidas = pedidas.filter(w => !salieron.has(w));
    if (perdidas.length) {
      console.log(`\n${rel}`);
      console.log(`   · ⚠ se genera sola y DEJÓ FUERA, en silencio: ${perdidas.join(', ')}`);
      tocadas++;
    }
    continue;
  }

  const notas = [];
  for (let i = 0; i < sets.length; i++) {
    const set = sets[i];
    const tomadas = new Set();
    /* 1ª vuelta: las que YA están se quedan donde están y se bloquean */
    const pendientes = [];
    for (const w of set.words) {
      if (celdasValen(set.grid, w.w, w.cells)) {          // ya está bien: no se toca
        w.cells.forEach(([r, c]) => tomadas.add(r + ',' + c));
        continue;
      }
      const camino = buscar(set.grid, w.w);
      if (camino) {
        notas.push(`sopa ${i + 1}: ${w.w} está en la rejilla, pero se pinta en otras celdas`);
        pintadas++;
        w.cells = camino;
        camino.forEach(([r, c]) => tomadas.add(r + ',' + c));
      } else pendientes.push(w);
    }
    /* 2ª vuelta: las que NO están se colocan — y si alguna no cabe, primero
       crece la rejilla. Nunca al revés: recortar la palabra es lo que dejó
       «EXPLICATIV» en pantalla. */
    const masLarga = pendientes.reduce((mx, w) => Math.max(mx, w.w.length), 0);
    if (masLarga > set.size) {
      const antes = crecer(set, masLarga, rng(masLarga * 7919 + i));
      notas.push(`sopa ${i + 1}: ⚠ la rejilla era de ${antes}×${antes} y la palabra más larga tiene ${masLarga} letras — crece a ${masLarga}×${masLarga}`);
    }
    for (const w of pendientes) {
      const camino = colocar(set.grid, w.w, tomadas);
      if (!camino) { notas.push(`sopa ${i + 1}: ⚠ ${w.w} NO CABE en la rejilla`); continue; }
      notas.push(`sopa ${i + 1}: ${w.w} NO ESTÁ en la rejilla — imposible de encontrar` + (REPARA ? '; colocada' : ''));
      imposibles++;
      w.cells = camino;
      camino.forEach(([r, c]) => tomadas.add(r + ',' + c));
    }
  }

  if (!notas.length) continue;
  tocadas++;
  console.log(`\n${rel}`);
  notas.forEach(n => console.log('   · ' + n));
  if (!REPARA) continue;

  const sangria = ' '.repeat((src.slice(0, lit.ini).split('\n').pop() || '').search(/\S|$/) === -1 ? 0 :
                             (src.slice(0, lit.ini).split('\n').pop().match(/^\s*/) || [''])[0].length);
  const nuevo = src.slice(0, lit.ini) + emitir(sets, sangria) + src.slice(lit.fin);
  const tmp = archivo + '.probando.js';
  fs.writeFileSync(tmp, nuevo);
  try { execFileSync(process.execPath, ['--check', tmp]); }
  catch (e) { fs.unlinkSync(tmp); console.log('   ✘ no compila; no se escribe nada'); continue; }
  fs.unlinkSync(tmp);
  fs.writeFileSync(archivo, nuevo);
  console.log('   ✔ escrita');
}

console.log(`\n  misiones con sopa: ${jsMisiones.length}   (${generadas} la generan sola: no pueden descuadrar)`);
console.log(`  con algo que corregir: ${tocadas}`);
console.log(`  palabras que NO se podían encontrar: ${imposibles}   (esas dejaban la estrella imposible)`);
console.log(`  palabras que se pintaban mal: ${pintadas}`);
if (!REPARA) {
  if (tocadas) {
    console.log('\n  Se arregla con:  node _dev/verifica-sopas.js --repara\n');
    process.exit(1);
  }
  console.log('\n  ✅ Todas las palabras están en su rejilla y se pintan donde están.\n');
}
