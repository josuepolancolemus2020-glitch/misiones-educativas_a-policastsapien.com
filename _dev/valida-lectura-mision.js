/* ══════════════════════════════════════════════════════════════
   Validador de las LECTURAS DE MISIÓN

   Las misiones con sección 📖 Lectura traen su propio corpus (cinco
   textos por grado, del tema de la misión). Este comprueba lo que a
   ojo se escapa y en el aula cuesta caro:

   · cinco textos por grado, con el largo dentro de la banda de
     palabras del grado — las mismas bandas del corpus de Mi aula,
     porque la banda de palabras por minuto es la misma;
   · cinco preguntas exactas por texto, con la mezcla de tipos del
     grado (literal / inferencial / crítica);
   · ids únicos y estables, títulos únicos;
   · críticas que empiezan con «Respuesta abierta»;
   · preguntas con sus signos ¿?;
   · sin dobles espacios ni espacios colgantes;
   · 3 opciones por pregunta, sin repetirse, cortas, con la correcta
     bien repartida entre a, b y c: aquí la contesta el ALUMNO en la
     pantalla, y un patrón se aprende más rápido que el texto;
   · y lo propio de estas lecturas: que cada palabra de adjs y dets
     APAREZCA TAL CUAL en el texto. El motor las resalta encima de lo
     que el alumno acaba de leer; una palabra que no está deja el
     resaltado incompleto y desmiente a la misión.

   Uso:
       node _dev/valida-lectura-mision.js
       node _dev/valida-lectura-mision.js <archivo.js> <NOMBRE_CONST>
══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');

/* Corpus registrados. Al pilotar la sección en otra misión, se añade
   aquí su archivo y el validador la cubre sin tocar nada más. */
const CORPUS = [
  /* `listas` son los inventarios que la misión escribe a mano, y se
     comprueban palabra contra palabra: un fallo aquí no es un fallo de
     datos, es la pantalla diciéndole al alumno que se equivocó cuando
     acertó. `cerrada` es la clase de la que SÍ se puede afirmar que
     falta algo (los determinativos son lista cerrada; los sustantivos,
     no); `segunda` es la lista que alimenta la actividad de clasificar
     en dos grupos, y necesita un mínimo para no repetir ítems. */
  { archivo: 'misiones/2y3ciclo-adjetivos/js/lectura-adjetivos.js', constante: 'LECTURA_ADJETIVOS',
    mision: 'Los Adjetivos', prefijo: 'LA', inventario: 'adjetivos',
    listas: [['adjs', 'adjetivo calificativo', true], ['dets', 'adjetivo determinativo', true],
             ['neutros', 'palabra que no cuenta', false]],
    cerrada: 'determinativos', segunda: 'dets', minSegunda: 3 },
  { archivo: 'misiones/2y3ciclo-sustantivos/js/lectura-sustantivos.js', constante: 'LECTURA_SUSTANTIVOS',
    mision: 'Los Sustantivos', prefijo: 'LS', inventario: 'sustantivos',
    listas: [['susts', 'sustantivo común', true], ['propios', 'sustantivo propio', true],
             ['neutros', 'palabra que no cuenta', false]],
    cerrada: null, segunda: 'propios', minSegunda: 3 },
  { archivo: 'misiones/1ciclo-segundo-grado/js/lectura-numeros.js', constante: 'LECTURA_NUMEROS',
    mision: 'Números grandes', prefijo: 'LN', inventario: 'numeros' },
];

/* El lector de numerales: la misión de los números no lleva inventario a
   mano porque este lo saca del texto. Aquí se comprueba que lo que saca
   alcance para las actividades. */
const NUM = require(path.join(RAIZ, 'js', 'data', 'lectura-numerales.js'));
const GRANDE = 1000;        /* lo que la cacería considera «número grande» */
const MIN_GRANDES = 6;      /* seis para cazar y para las dos rondas de ordenar */

/* Mismas bandas de palabras que el corpus de Mi aula (_dev/valida-lectura.js):
   el texto tiene que poder leerse en cerca de un minuto al ritmo del grado. */
const BANDAS = { 2: [55, 75], 3: [75, 95], 4: [95, 115], 5: [110, 135], 6: [125, 150], 7: [140, 170], 8: [155, 185], 9: [170, 200] };
const MEZCLA = g => (g <= 4 ? { literal: 3, inferencial: 1, critica: 1 }
  : g <= 8 ? { literal: 2, inferencial: 2, critica: 1 }
    : { literal: 1, inferencial: 2, critica: 2 });
const POR_GRADO = 5;   /* cinco lecturas por grado: es lo que pidió el maestro */

let errores = 0;
const err = m => { errores++; console.log('  ❌ ' + m); };

/* Palabras del texto, sin puntuación y en minúscula: así se comprueba
   que un adjetivo de la lista esté DE VERDAD en el texto. No sirve
   indexOf: «alto» aparecería dentro de «altos» y el resaltado del
   motor, que va palabra por palabra, no lo encontraría. */
/* Tiene que ser IDÉNTICA a la de js/tools/lectura-mision.js: si el validador
   limpia un signo que el motor no limpia, aprueba una palabra que después no
   se resalta, y el fallo aparece en la pantalla del alumno, no aquí. El guion
   NO se quita: en «teórico-práctico» la palabra es la de en medio también. */
const LIMPIA = /[.,;:()¿?¡!«»"“”'’…—–]/g;

/* Clases cerradas compartidas con la misión y con el auditor: una sola
   lista en js/data/lectura-clases.js, no tres copias que se separan. */
const CLASES = require(path.join(RAIZ, 'js', 'data', 'lectura-clases.js'));
const DETERMINATIVOS = new Set(CLASES.determinativos);
const NEUTROS_GLOBAL = new Set(CLASES.neutros);

function palabrasDe(texto) {
  return String(texto || '').trim().split(/\s+/).map(p => p.replace(LIMPIA, '').toLowerCase()).filter(Boolean);
}

function valida(entrada) {
  const ruta = path.join(RAIZ, entrada.archivo);
  if (!fs.existsSync(ruta)) { err(`no existe ${entrada.archivo}`); return; }
  const src = fs.readFileSync(ruta, 'utf8');
  const corpus = new Function(src + '; return ' + entrada.constante + ';')();
  console.log(`\n████ ${entrada.mision} — ${entrada.archivo}`);

  const ids = new Set(), titulos = new Set();
  const grados = Object.keys(corpus).map(Number).sort((a, b) => a - b);
  if (!grados.length) { err('corpus vacío'); return; }

  for (const g of grados) {
    const lote = corpus[g] || [];
    const banda = BANDAS[g];
    if (!banda) { err(`grado ${g}: no hay banda de palabras definida`); continue; }
    const [min, max] = banda;
    const mezcla = MEZCLA(g);
    console.log(`\n═══ ${g}º grado — ${lote.length} lecturas (banda ${min}–${max} palabras) ═══`);
    if (lote.length !== POR_GRADO) err(`${lote.length} lecturas: deben ser ${POR_GRADO}`);
    const distC = [0, 0, 0];

    lote.forEach((t, i) => {
      const quien = `${t.id || '#' + i} «${t.titulo || 'sin título'}»`;
      if (!new RegExp('^' + entrada.prefijo + g + '-\\d\\d$').test(t.id || '')) err(`${quien}: id inválido (formato ${entrada.prefijo}${g}-NN)`);
      if (ids.has(t.id)) err(`${quien}: id repetido`); ids.add(t.id);
      const titN = String(t.titulo || '').toLowerCase();
      if (titulos.has(titN)) err(`${quien}: título repetido`); titulos.add(titN);
      if (!String(t.genero || '').trim()) err(`${quien}: sin género`);

      const ps = palabrasDe(t.texto);
      const n = ps.length;
      if (n < min || n > max) err(`${quien}: ${n} palabras, fuera de la banda ${min}–${max}`);
      if (/\s\s/.test(t.texto)) err(`${quien}: dobles espacios en el texto`);
      if (t.texto !== String(t.texto).trim()) err(`${quien}: espacios colgantes en el texto`);

      if (entrada.listas) {
      /* adjs, dets y neutros: con esto el alumno CAZA los adjetivos
         tocándolos sobre el texto, así que un fallo aquí no es un fallo
         de datos: es la pantalla diciéndole que se equivocó cuando
         acertó. Por eso se comprueba tan de cerca. */
      const enTexto = new Set(ps);
      const clasificadas = new Map();
      entrada.listas
        .forEach(([campo, etq, obligatorio]) => {
          const lista = t[campo];
          if (!Array.isArray(lista) || !lista.length) {
            if (obligatorio) err(`${quien}: falta la lista ${campo} (${etq}s a resaltar)`);
            return;
          }
          const vistos = new Set();
          lista.forEach(p => {
            const clave = String(p).replace(LIMPIA, '').toLowerCase();
            if (!clave) { err(`${quien}: ${campo} tiene una entrada vacía`); return; }
            if (vistos.has(clave)) err(`${quien}: ${campo} repite «${p}»`);
            vistos.add(clave);
            if (!enTexto.has(clave)) err(`${quien}: ${campo} incluye «${p}», que no aparece tal cual en el texto`);
            if (clasificadas.has(clave)) err(`${quien}: «${p}» está en ${clasificadas.get(clave)} y en ${campo} a la vez`);
            else clasificadas.set(clave, campo);
            if (NEUTROS_GLOBAL.has(clave) && campo !== 'neutros') {
              err(`${quien}: «${p}» ya no cuenta nunca (js/data/lectura-clases.js): sacarla de ${campo}`);
            }
          });
        });

      /* Los determinativos son CLASE CERRADA, así que esto sí se puede
         afirmar: uno que esté en el texto y no esté clasificado se le
         va a marcar mal al alumno cuando lo toque. Los calificativos no
         se pueden comprobar así —son clase abierta— y para eso está
         _dev/audita-adjetivos-lectura.js, que propone candidatos. */
      if (entrada.cerrada === 'determinativos') {
        const sueltos = [...new Set(ps)].filter(p =>
          DETERMINATIVOS.has(p) && !clasificadas.has(p) && !NEUTROS_GLOBAL.has(p));
        if (sueltos.length) {
          err(`${quien}: determinativo(s) del texto sin clasificar en dets ni en neutros: «${sueltos.join('», «')}»`);
        }
      }

      /* Tres de la segunda clase por lectura es el mínimo para que la
         actividad de clasificar tenga con qué jugar sin repetir. */
      const seg = entrada.segunda, minSeg = entrada.minSegunda || 3;
      if (seg && (t[seg] || []).length < minSeg) {
        err(`${quien}: solo ${(t[seg] || []).length} en ${seg}; hacen falta ${minSeg} para la actividad de clasificar`);
      }
      }

      /* En la misión de los números el inventario NO se escribe: lo saca
         js/data/lectura-numerales.js del propio texto. Lo que hay que
         comprobar es que el texto dé para las actividades — si una lectura
         trae tres números, la cacería es un chiste y las dos rondas de
         ordenar no se pueden armar. */
      if (entrada.inventario === 'numeros') {
        const nums = NUM.detectar(String(t.texto).trim().split(/\s+/));
        const grandes = nums.filter(n => n.v >= GRANDE);
        const valores = [...new Set(grandes.map(n => n.v))];
        const enPalabras = grandes.filter(n => n.forma === 'palabras');
        const enCifras = grandes.filter(n => n.forma === 'cifras');
        const chicos = nums.filter(n => n.v < GRANDE);
        if (grandes.length < MIN_GRANDES) err(`${quien}: solo ${grandes.length} número(s) mayor(es) que mil; hacen falta ${MIN_GRANDES}`);
        if (valores.length < 6) err(`${quien}: solo ${valores.length} valor(es) grande(s) distinto(s); hacen falta 6 para las dos rondas de ordenar`);
        if (!enPalabras.length) err(`${quien}: ningún número grande escrito en palabras; sin eso la actividad de leerlos no tiene de dónde salir`);
        if (enCifras.length < 3) err(`${quien}: solo ${enCifras.length} número(s) grande(s) en cifras; hacen falta 3`);
        /* Los pequeños son los que obligan a mirar de verdad: sin ellos,
           cazar «números grandes» es tocar todo lo que tenga cifras. */
        if (!chicos.length) err(`${quien}: ningún número menor que mil; la cacería se vuelve trivial`);
        const fuera = grandes.filter(n => n.v > 20000000);
        if (fuera.length) err(`${quien}: ${fuera.map(n => n.v).join(', ')} se sale del horizonte de la misión`);
      }

      const pg = t.preguntas || [];
      if (pg.length !== 5) err(`${quien}: ${pg.length} preguntas (deben ser 5)`);
      const cuenta = { literal: 0, inferencial: 0, critica: 0 };
      pg.forEach((p, j) => {
        if (!cuenta.hasOwnProperty(p.tipo)) { err(`${quien} p${j + 1}: tipo desconocido «${p.tipo}»`); return; }
        cuenta[p.tipo]++;
        if (!/¿/.test(p.q) || !/\?/.test(p.q)) err(`${quien} p${j + 1}: faltan signos ¿? en la pregunta`);
        if (p.tipo === 'critica' && !/^Respuesta abierta/i.test(p.r || '')) err(`${quien} p${j + 1}: la guía crítica debe empezar con «Respuesta abierta»`);
        if (!String(p.r || '').trim()) err(`${quien} p${j + 1}: sin respuesta guía`);
        if (!Array.isArray(p.o) || p.o.length !== 3) { err(`${quien} p${j + 1}: deben ser 3 opciones`); return; }
        if (p.o.some(x => !String(x || '').trim())) err(`${quien} p${j + 1}: opción vacía`);
        if (new Set(p.o.map(x => String(x).toLowerCase().trim())).size !== 3) err(`${quien} p${j + 1}: opciones repetidas`);
        p.o.forEach(x => { if (String(x).length > 90) err(`${quien} p${j + 1}: opción de más de 90 caracteres`); });
        if (!(p.c >= 0 && p.c <= 2)) err(`${quien} p${j + 1}: c debe ser 0, 1 o 2`);
        else distC[p.c]++;
      });
      Object.keys(mezcla).forEach(k => {
        if (cuenta[k] !== mezcla[k]) err(`${quien}: ${cuenta[k]} pregunta(s) ${k}, la mezcla de ${g}º pide ${mezcla[k]}`);
      });
    });

    if (lote.length) {
      const ns = lote.map(t => palabrasDe(t.texto).length);
      console.log(`  📏 palabras: mín ${Math.min(...ns)} · máx ${Math.max(...ns)} · promedio ${Math.round(ns.reduce((a, b) => a + b, 0) / ns.length)}`);
      if (entrada.inventario === 'adjetivos') {
        const adj = lote.reduce((s, t) => s + (t.adjs || []).length + (t.dets || []).length, 0);
        console.log(`  🎨 palabras resaltadas: ${adj} en total · ${Math.round(adj / lote.length)} por lectura`);
      } else {
        const gr = lote.map(t => NUM.detectar(String(t.texto).trim().split(/\s+/)).filter(n => n.v >= GRANDE).length);
        console.log(`  🔢 números mayores que mil: mín ${Math.min(...gr)} · máx ${Math.max(...gr)} por lectura`);
      }
      const totC = distC[0] + distC[1] + distC[2];
      if (totC) {
        const pct = distC.map(x => Math.round(x * 100 / totC));
        console.log(`  🔤 correcta en: a ${pct[0]}% · b ${pct[1]}% · c ${pct[2]}%`);
        if (Math.max(...pct) > 45) err(`la correcta cae demasiado en una misma letra (a ${pct[0]}% · b ${pct[1]}% · c ${pct[2]}%)`);
      }
    }
  }
}

const args = process.argv.slice(2);
const lista = args.length >= 2 ? [{ archivo: args[0], constante: args[1], mision: args[0] }] : CORPUS;
lista.forEach(valida);
console.log(`\n${errores ? '❌ ' + errores + ' error(es)' : '✅ corpus de misión válido'}`);
process.exit(errores ? 1 : 0);
