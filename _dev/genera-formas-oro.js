#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · Congela las formas de examen de hoy
   ------------------------------------------------------------
   Hay claves impresas en las escuelas: la Forma 7 de La Célula tiene
   que seguir siendo la misma Forma 7 después de construir el motor
   compartido. Esta herramienta guarda en `_dev/formas-oro/` cómo sale
   hoy cada forma del examen conceptual y de la prueba operativa (1 a
   30, y 1 a 20 en Fin de grado). La sonda `verifica-formas-oro.js` la
   compara en cada `npm test`.

   La prueba de pensamiento crítico se rehízo entera (plan del motor,
   decisión 1) y no se congela como salía antes. Se congela misión por
   misión, cuando ya reparte sus formas sin repetir y Josué aprobó su
   banco: `--critica <carpeta>`. De las que todavía sacan los casos al
   azar solo se anota cuáles repiten formas, para que la sonda distinga
   lo ya sabido de lo nuevo.

   Se corre a mano y casi nunca:

     node _dev/genera-formas-oro.js                 → congela las que faltan
     node _dev/genera-formas-oro.js <carpeta> …     → solo esas
     … --sobrescribir <carpeta> …                   → vuelve a congelar esas
     … --resellar-hoja [<carpeta> …]                → ver abajo
     … --critica <carpeta> …                        → añade la crítica a esas referencias
     … --critica-de-antes <carpeta> …               → congela la crítica 1–30 tal como sale hoy
     … --critica-ampliar <carpeta> …                → añade las formas nuevas (31–50) a esas
     … --conceptual-ampliar <carpeta> …             → añade las formas nuevas del examen conceptual
     … --pendiente-critica                          → reescribe la lista de la crítica

   Sin `--sobrescribir` se niega a tocar una referencia que ya existe, y
   `--sobrescribir` pide las carpetas por su nombre: volver a congelar es
   decirle al maestro que su clave impresa ya no vale, y eso no se hace
   por descuido ni para las 84 de una vez.

   `--critica` añade a una referencia que ya existe las formas de la
   prueba de pensamiento crítico (1 a 50, o hasta donde dé el banco) y no
   toca nada más de ella. Pide las carpetas por su nombre, exige que la
   misión ya reparta sin repetir y se niega si la crítica ya estaba
   congelada: desde ese momento la pauta impresa de esa misión queda fija.

   `--critica-de-antes` es para las misiones de estructura propia, que
   todavía sacan sus casos con la semilla y cuyas formas 1 a 30 no se
   van a repartir de nuevo: las congela TAL COMO SALEN HOY, antes de
   tocar la misión, y anota en la referencia cuántas son
   (`criticaDeAntes`). Se niega si la misión ya reparte, si repite alguna
   forma o si su crítica ya estaba congelada.

   `--critica-ampliar` viene después, cuando esa misión ya ofrece las
   formas nuevas (31 a 50) y Josué las aprobó: las añade a la referencia
   sin tocar las de antes. Se niega si alguna de las de antes ya no sale
   idéntica a la referencia o si una forma nueva repite a otra.

   `--conceptual-ampliar` es lo mismo para el EXAMEN CONCEPTUAL de una
   misión con banco grande (evalCPBankNuevo…): cuando ya ofrece formas
   después de las de antes y Josué aprobó sus preguntas, las añade a la
   referencia sin tocar las de antes. Se niega si alguna de las de antes
   ya no sale idéntica, si una forma repite el conjunto de otra o si ya
   estaban congeladas.

   Una misión NUEVA nace con sus 50 formas y espera en `_nacidas.json`
   (ver verifica-mision-nacida.js). Cuando Josué aprueba sus preguntas,
   `node _dev/genera-formas-oro.js <carpeta>` congela de una vez el examen
   conceptual (1 a 50) y la prueba crítica, y la saca de esa lista.

   `--resellar-hoja` es para cuando se cambia a propósito CÓMO se ve la
   hoja (un margen, un color) sin cambiar lo que dice. Solo actualiza la
   huella de la hoja, y solo si el dato y el texto que se lee siguen
   idénticos a la referencia; si no, se niega.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const L = require('./lib-formas.js');

const args = process.argv.slice(2);
const banderas = new Set(args.filter(a => a.startsWith('--')));
const pedidas = args.filter(a => !a.startsWith('--'));
const conocidas = ['--sobrescribir', '--resellar-hoja', '--pendiente-critica', '--critica', '--critica-de-antes', '--critica-ampliar', '--conceptual-ampliar'];
banderas.forEach(b => { if (!conocidas.includes(b)) { console.error('✘ No conozco ' + b); process.exit(2); } });

const { dentro } = L.listarMisiones();
pedidas.forEach(s => { if (!dentro.includes(s)) { console.error('✘ ' + s + ' no es una misión del alcance'); process.exit(2); } });
if (banderas.has('--sobrescribir') && !pedidas.length) {
  console.error('✘ --sobrescribir pide las carpetas por su nombre. Volver a congelar una forma invalida la clave que el maestro ya imprimió.');
  process.exit(2);
}

if (banderas.has('--critica') && !pedidas.length) {
  console.error('✘ --critica pide las carpetas por su nombre. Congelar la crítica de una misión deja fija su pauta impresa, y eso lo aprueba Josué misión por misión.');
  process.exit(2);
}
if (banderas.has('--critica') && banderas.size > 1) { console.error('✘ --critica va sola'); process.exit(2); }
['--critica-de-antes', '--critica-ampliar', '--conceptual-ampliar'].forEach(b => {
  if (!banderas.has(b)) return;
  if (!pedidas.length) { console.error('✘ ' + b + ' pide las carpetas por su nombre: deja fija la pauta impresa de esas misiones.'); process.exit(2); }
  if (banderas.size > 1) { console.error('✘ ' + b + ' va sola'); process.exit(2); }
});

const hoy = (() => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })();
let commit = '';
try { commit = execSync('git rev-parse --short HEAD', { cwd: L.RAIZ, encoding: 'utf8' }).trim(); } catch (e) { /* sin git se congela igual */ }

/* Genera todas las formas de una misión, dos veces y con el azar del
   navegador distinto cada vez. Si no salen iguales, la forma depende de
   algo que no es su número y congelarla sería guardar una casualidad. */
function generar(slug) {
  const a = L.cargarMision(slug, 1), b = L.cargarMision(slug, 2654435761);
  const salida = { mision: a, pruebas: {} };
  L.pruebasDe(a).forEach(p => {
    const formas = {};
    for (let n = 1; n <= a.topeDe(p.prueba); n++) {
      const x = a.forma(p.prueba, n, p.materia), y = b.forma(p.prueba, n, p.materia);
      if (JSON.stringify(x.dato) !== JSON.stringify(y.dato) || x.impreso !== y.impreso)
        throw new Error(slug + ' · ' + p.llave + ' · forma ' + n + ': no sale igual dos veces; depende del azar o de la fecha');
      formas[n] = x;
    }
    salida.pruebas[p.llave] = { prueba: p.prueba, formas };
  });
  return salida;
}

const kb = n => (n / 1024).toFixed(0) + ' KB';
const lista = pedidas.length ? pedidas : dentro;
const pendiente = {}, fueraDeBanco = {};
let escritas = 0, saltadas = 0, reselladas = 0, bytes = 0, formasOro = 0, criticas = 0;

lista.forEach(slug => {
  const g = generar(slug);
  const m = g.mision;

  /* La crítica: solo se cuenta cuántas formas distintas da hoy, y cuántos
     de sus textos no salen de un banco sino del propio generador (una
     rúbrica fija, una respuesta calculada). */
  if (g.pruebas.critica) {
    const datos = {}; Object.keys(g.pruebas.critica.formas).forEach(n => { datos[n] = g.pruebas.critica.formas[n].dato; });
    const r = L.repetidas(datos);
    if (r.iguales.length || r.mismoConjunto.length)
      pendiente[slug] = { formas: m.topeDe('critica'), distintas: r.distintas, iguales: r.iguales.length, mismoConjunto: r.mismoConjunto.length };
    const sueltos = L.textosFueraDeBanco(L.bancosDe(m), datos);
    if (sueltos.length) fueraDeBanco[slug] = sueltos.length;
  }

  const existe = L.leerOro(slug);
  if (banderas.has('--pendiente-critica')) return;

  if (banderas.has('--critica')) {
    if (!existe) { console.error('✘ ' + slug + ': no tiene referencia a la que añadirle la crítica'); process.exit(1); }
    if (!g.pruebas.critica) { console.error('✘ ' + slug + ': no tiene prueba de pensamiento crítico'); process.exit(1); }
    if (!m.reparteCritica) { console.error('✘ ' + slug + ': todavía saca los casos al azar. Primero tiene que repartirlos con el motor (critApartados).'); process.exit(1); }
    if (existe.pruebas.critica) { console.error('✘ ' + slug + ': su crítica ya está congelada. Volver a congelarla invalida la pauta impresa (--sobrescribir, y lo decide Josué).'); process.exit(1); }
    const datos = {}; Object.keys(g.pruebas.critica.formas).forEach(n => { datos[n] = g.pruebas.critica.formas[n].dato; });
    const r = L.repetidas(datos);
    if (r.iguales.length || r.mismoConjunto.length) { console.error('✘ ' + slug + ': repite formas en la crítica. No se congela una prueba que repite.'); process.exit(1); }
    existe.pruebas.critica = {};
    Object.keys(g.pruebas.critica.formas).forEach(n => { existe.pruebas.critica[n] = L.sellarForma(g.pruebas.critica.formas[n]); });
    /* Los bancos de la crítica pueden haber cambiado desde que se congeló
       el examen conceptual (se les añadieron casos): se anota su huella de
       hoy, que es con la que salen estas formas. Las de los demás bancos
       no se tocan. */
    const todos = L.bancosDe(m);
    Object.keys(todos).filter(n => /^crit/.test(n)).forEach(n => { existe.bancos[n] = L.huellaBanco(todos[n]); });
    existe.criticaCongelada = hoy; existe.criticaDesde = commit;
    L.escribirOro(existe); criticas++;
    console.log('  ✔ ' + slug.padEnd(52) + 'crítica 1–' + m.topeCritica + ' (' + m.conjuntosCritica + ' conjuntos posibles)');
    return;
  }

  if (banderas.has('--critica-de-antes')) {
    if (!existe) { console.error('✘ ' + slug + ': no tiene referencia a la que añadirle la crítica'); process.exit(1); }
    if (!g.pruebas.critica) { console.error('✘ ' + slug + ': no tiene prueba de pensamiento crítico'); process.exit(1); }
    if (m.reparteCritica) { console.error('✘ ' + slug + ': ya reparte con el motor. Sus formas de antes se congelan ANTES de tocarla; ahora ya no se pueden leer de su código.'); process.exit(1); }
    if (existe.pruebas.critica) { console.error('✘ ' + slug + ': su crítica ya está congelada. Volver a congelarla invalida la pauta impresa (--sobrescribir, y lo decide Josué).'); process.exit(1); }
    const datos = {}; Object.keys(g.pruebas.critica.formas).forEach(n => { datos[n] = g.pruebas.critica.formas[n].dato; });
    const r = L.repetidas(datos);
    if (r.iguales.length || r.mismoConjunto.length) { console.error('✘ ' + slug + ': repite formas en la crítica. No se congela una prueba que repite.'); process.exit(1); }
    existe.pruebas.critica = {};
    Object.keys(g.pruebas.critica.formas).forEach(n => { existe.pruebas.critica[n] = L.sellarForma(g.pruebas.critica.formas[n]); });
    const todos = L.bancosDe(m);
    Object.keys(todos).filter(n => /^crit/.test(n)).forEach(n => { existe.bancos[n] = L.huellaBanco(todos[n]); });
    existe.criticaCongelada = hoy; existe.criticaDesde = commit; existe.criticaDeAntes = m.tope;
    L.escribirOro(existe); criticas++;
    console.log('  ✔ ' + slug.padEnd(52) + 'crítica 1–' + m.tope + ', tal como sale hoy con su sorteo');
    return;
  }

  if (banderas.has('--critica-ampliar')) {
    if (!existe || !existe.pruebas.critica || !existe.criticaDeAntes) { console.error('✘ ' + slug + ': no tiene congeladas sus formas de antes (--critica-de-antes)'); process.exit(1); }
    if (existe.criticaAmpliada) { console.error('✘ ' + slug + ': sus formas nuevas ya están congeladas. Volver a congelarlas invalida la pauta impresa (--sobrescribir, y lo decide Josué).'); process.exit(1); }
    if (!m.reparteCritica || m.topeCritica <= existe.criticaDeAntes) { console.error('✘ ' + slug + ': todavía no ofrece formas nuevas después de la ' + existe.criticaDeAntes); process.exit(1); }
    const datos = {}; Object.keys(g.pruebas.critica.formas).forEach(n => { datos[n] = g.pruebas.critica.formas[n].dato; });
    const r = L.repetidas(datos);
    if (r.iguales.length || r.mismoConjunto.length) { console.error('✘ ' + slug + ': repite formas en la crítica. No se congela una prueba que repite.'); process.exit(1); }
    /* Las de antes tienen que seguir idénticas: si no, ampliar taparía
       que se movió una forma impresa. */
    for (let n = 1; n <= existe.criticaDeAntes; n++) {
      const viejo = existe.pruebas.critica[n], nuevo = L.sellarForma(g.pruebas.critica.formas[n]);
      if (!viejo || JSON.stringify(viejo) !== JSON.stringify(nuevo)) { console.error('✘ ' + slug + ' · crítica · forma ' + n + ': ya no sale idéntica a la referencia. No se amplía; se deshace el cambio.'); process.exit(1); }
    }
    for (let n = existe.criticaDeAntes + 1; n <= m.topeCritica; n++) existe.pruebas.critica[n] = L.sellarForma(g.pruebas.critica.formas[n]);
    /* Los bancos de la crítica: con casos nuevos habrá bancos nuevos. */
    const todos = L.bancosDe(m);
    Object.keys(todos).filter(n => /^crit/.test(n)).forEach(n => { existe.bancos[n] = L.huellaBanco(todos[n]); });
    existe.criticaAmpliada = hoy; existe.criticaAmpliadaDesde = commit;
    L.escribirOro(existe); criticas++;
    console.log('  ✔ ' + slug.padEnd(52) + 'crítica ' + (existe.criticaDeAntes + 1) + '–' + m.topeCritica + ' añadidas; las 1–' + existe.criticaDeAntes + ' no se tocaron');
    return;
  }

  if (banderas.has('--conceptual-ampliar')) {
    const ref = existe && existe.pruebas.conceptual;
    if (!ref) { console.error('✘ ' + slug + ': no tiene congelado su examen conceptual'); process.exit(1); }
    if (existe.conceptualAmpliada) { console.error('✘ ' + slug + ': sus formas conceptuales nuevas ya están congeladas. Volver a congelarlas invalida la clave impresa (--sobrescribir, y lo decide Josué).'); process.exit(1); }
    const hasta = m.topeDe('conceptual');
    if (hasta <= existe.tope) { console.error('✘ ' + slug + ': su examen conceptual no ofrece formas nuevas después de la ' + existe.tope + ' (no trae banco grande)'); process.exit(1); }
    const formas = g.pruebas.conceptual.formas;
    const datos = {}; Object.keys(formas).forEach(n => { datos[n] = formas[n].dato; });
    const r = L.repetidas(datos);
    if (r.iguales.length || r.mismoConjunto.length) { console.error('✘ ' + slug + ': su examen conceptual repite formas. No se congela un examen que repite.'); process.exit(1); }
    /* Las de antes tienen clave impresa: si una ya no sale idéntica,
       ampliar taparía que se movió. */
    for (let n = 1; n <= existe.tope; n++) {
      const viejo = ref[n], nuevo = L.sellarForma(formas[n]);
      if (!viejo || JSON.stringify(viejo) !== JSON.stringify(nuevo)) { console.error('✘ ' + slug + ' · conceptual · forma ' + n + ': ya no sale idéntica a la referencia. No se amplía; se deshace el cambio.'); process.exit(1); }
    }
    let nuevas = 0;
    for (let n = existe.tope + 1; n <= hasta; n++) { ref[n] = L.sellarForma(formas[n]); nuevas++; }
    /* Los cuatro bancos nuevos entran a la referencia con su huella: si
       mañana se toca uno, la sonda dirá por qué cambiaron las formas. */
    const todos = L.bancosDe(m);
    Object.keys(todos).filter(n => /^eval\w+BankNuevo$/.test(n)).forEach(n => { existe.bancos[n] = L.huellaBanco(todos[n]); });
    existe.conceptualAmpliada = hoy; existe.conceptualAmpliadaDesde = commit;
    L.escribirOro(existe); criticas++;
    console.log('  ✔ ' + slug.padEnd(52) + 'conceptual ' + (existe.tope + 1) + '–' + hasta + ' añadidas (' + nuevas + '); las 1–' + existe.tope + ' no se tocaron');
    return;
  }

  if (banderas.has('--resellar-hoja')) {
    if (!existe) { console.error('✘ ' + slug + ': no tiene referencia que resellar'); process.exit(1); }
    let cambios = 0;
    Object.keys(existe.pruebas).forEach(p => Object.keys(existe.pruebas[p]).forEach(n => {
      const viejo = existe.pruebas[p][n], nuevo = L.sellarForma(g.pruebas[p].formas[n]);
      if (JSON.stringify(viejo.dato) !== JSON.stringify(nuevo.dato) || viejo.texto !== nuevo.texto) {
        console.error('✘ ' + slug + ' · ' + p + ' · forma ' + n + ': cambió lo que la hoja dice, no solo cómo se ve. No se resella.');
        process.exit(1);
      }
      if (viejo.hoja !== nuevo.hoja) { viejo.hoja = nuevo.hoja; cambios++; }
    }));
    if (cambios) { L.escribirOro(existe); reselladas++; console.log('  ↻ ' + slug + ': ' + cambios + ' hojas reselladas'); }
    return;
  }

  if (existe && !banderas.has('--sobrescribir')) { saltadas++; return; }

  const bancos = {};
  const todos = L.bancosDe(m);
  Object.keys(todos).forEach(n => { bancos[n] = L.huellaBanco(todos[n]); });
  const oro = { slug, archivo: path.relative(L.RAIZ, m.js).split(path.sep).join('/'), tope: m.tope, congelado: hoy, desde: commit, bancos, pruebas: {} };
  if (g.pruebas.critica && m.reparteCritica) { oro.criticaCongelada = hoy; oro.criticaDesde = commit; }
  Object.keys(g.pruebas).forEach(llave => {
    /* La crítica solo entra si la misión ya la reparte sin repetir. */
    if (!L.PRUEBAS[g.pruebas[llave].prueba].oro && !(llave === 'critica' && m.reparteCritica)) return;
    oro.pruebas[llave] = {};
    Object.keys(g.pruebas[llave].formas).forEach(n => { oro.pruebas[llave][n] = L.sellarForma(g.pruebas[llave].formas[n]); formasOro++; });
  });
  L.escribirOro(oro);
  const peso = fs.statSync(L.rutaOro(slug)).size; bytes += peso; escritas++;
  console.log('  ✔ ' + slug.padEnd(52) + Object.keys(oro.pruebas).map(p => p + ' 1–' + m.topeDe(p)).join(' · ').padEnd(58) + kb(peso));
  /* Una misión nueva que se congela deja de estar «por congelar». */
  const nacidas = L.leerNacidas();
  if (nacidas[slug]) { delete nacidas[slug]; L.escribirNacidas(nacidas); console.log('    ' + slug + ' sale de _nacidas.json: sus 50 formas ya tienen referencia'); }
});

/* La lista de la crítica solo se escribe la primera vez o si se pide: es
   la cuenta de la deuda de HOY, y reescribirla sola taparía una misión
   que empezó a repetir después. */
const escribirPendiente = banderas.has('--pendiente-critica') || (!fs.existsSync(L.RUTA_PENDIENTE) && !pedidas.length && !banderas.has('--resellar-hoja') && !banderas.has('--critica') && !banderas.has('--critica-de-antes') && !banderas.has('--critica-ampliar') && !banderas.has('--conceptual-ampliar'));
if (escribirPendiente) {
  if (pedidas.length) { console.error('✘ --pendiente-critica cuenta todas las misiones; no lleva carpetas'); process.exit(2); }
  const orden = {}; Object.keys(pendiente).sort().forEach(k => { orden[k] = pendiente[k]; });
  fs.mkdirSync(L.DIR_ORO, { recursive: true });
  fs.writeFileSync(L.RUTA_PENDIENTE, JSON.stringify({
    nota: 'Lo que la prueba de pensamiento crítico tiene pendiente HOY. No es una referencia. Las misiones salen de «repiten» a medida que pasan al reparto sin repetir del motor (critApartados). Sirve para que la sonda distinga esta deuda conocida de una nueva. «repiten»: misiones con formas iguales o con las mismas preguntas en otro orden. «fueraDeBanco»: misiones donde parte de la prueba no sale de un banco sino del generador (rúbrica fija o respuesta calculada), con cuántos textos distintos.',
    contado: hoy, desde: commit, repiten: orden, fueraDeBanco
  }, null, 2) + '\n', 'utf8');
  console.log('  ✔ _critica-pendiente.json: ' + Object.keys(orden).length + ' misiones repiten formas en la crítica y ' + Object.keys(fueraDeBanco).length + ' tienen textos que no salen de un banco');
}

console.log('\n' + (escritas ? '✅ ' + escritas + ' referencias escritas, ' + formasOro + ' formas, ' + (bytes / 1048576).toFixed(2) + ' MB.' : criticas ? '✅' : '· No se escribió ninguna referencia.') +
  (saltadas ? ' ' + saltadas + ' ya existían y no se tocaron.' : '') + (reselladas ? ' ' + reselladas + ' reselladas.' : '') +
  (criticas ? ' ' + criticas + ' referencias ampliadas; lo demás de ellas no se tocó.' : ''));
