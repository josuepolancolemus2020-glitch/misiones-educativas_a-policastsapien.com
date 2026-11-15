#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · Las formas de examen siguen siendo las de siempre
   ------------------------------------------------------------
   Hay claves impresas: un maestro que fotocopió la Forma 7 con su
   clave tiene que poder seguir calificando con ella. Hasta hoy ninguna
   sonda comparaba una forma con su versión anterior, y un cambio que
   alterara la Forma 7 pasaba en verde.

   Por cada misión del alcance genera sus formas con el código vigente
   y comprueba tres cosas:

   1. CONGELADAS. Las formas 1 a 30 del examen conceptual y de la prueba
      operativa (1 a 20 en Fin de grado) son idénticas a la referencia de
      `_dev/formas-oro/`: el dato entero, el texto de la hoja y la hoja.
   2. SIN REPETIR. Ninguna forma es igual a otra, ni trae las mismas
      preguntas en otro orden. Vale para las tres pruebas.
   3. DEL BANCO. Toda pregunta de una forma está en el banco de su misión.

   La prueba de pensamiento crítico se rehízo entera (plan del motor,
   decisión 1) y va por tandas. La misión que ya reparte sus formas sin
   repetir (declara `critApartados`) llega hasta la Forma 50 y no puede
   repetir ninguna; cuando Josué aprueba su banco se congela también
   (`genera-formas-oro.js --critica`) y desde entonces se compara como
   las otras. Las que todavía sacan los casos al azar y repiten formas
   están contadas en `_critica-pendiente.json`: esa deuda se nombra y no
   pone la sonda en rojo; una repetición nueva, sí.

   Las once de estructura propia son otro caso: sus formas 1 a 30 no se
   repartieron de nuevo. Se congelaron tal como salían con su sorteo
   (`--critica-de-antes`; la referencia lleva `criticaDeAntes`) y tienen
   que seguir idénticas. Las formas nuevas, de la 31 a la 50, no pueden
   repetir a ninguna, y se congelan aparte cuando Josué las aprueba
   (`--critica-ampliar`); hasta entonces se nombran sin poner la sonda
   en rojo.

   El examen conceptual con BANCO GRANDE (la misión trae un banco nuevo
   al lado del de siempre) ofrece formas después de la última congelada.
   Las congeladas tienen que seguir idénticas; las nuevas no pueden
   repetir a ninguna y sus preguntas tienen que ser de uno de los dos
   bancos. Mientras Josué no las apruebe no tienen referencia: se nombran
   sin poner la sonda en rojo. Aprobadas, se congelan aparte
   (`--conceptual-ampliar`; la referencia lleva `conceptualAmpliada`) y
   desde entonces se comparan como las de antes.

   Si una forma congelada cambió, NO se arregla volviendo a congelar: se
   deshace el cambio. Volver a congelar es invalidar la clave impresa, y
   esa decisión es de Josué (`genera-formas-oro.js --sobrescribir`).

     node _dev/verifica-formas-oro.js              → todas
     node _dev/verifica-formas-oro.js <carpeta>    → una
   ============================================================ */
'use strict';

const fs = require('fs');
const L = require('./lib-formas.js');

const pedidas = process.argv.slice(2);
const { dentro, fuera } = L.listarMisiones();
const lista = pedidas.length ? pedidas : dentro;
const fallos = [];
const falla = (slug, prueba, forma, que) => fallos.push(slug + ' · ' + prueba + (forma ? ' · Forma ' + forma : '') + ': ' + que);

/* Dónde difieren dos datos: el primer camino que no coincide, para que
   el fallo diga qué pregunta cambió y no solo que algo cambió. */
function primeraDiferencia(a, b, camino) {
  camino = camino || '';
  if (JSON.stringify(a) === JSON.stringify(b)) return '';
  if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
    const llaves = Array.from(new Set(Object.keys(a).concat(Object.keys(b))));
    for (const k of llaves) {
      const d = primeraDiferencia(a[k], b[k], camino + (Array.isArray(a) ? '[' + k + ']' : (camino ? '.' : '') + k));
      if (d) return d;
    }
  }
  const corta = v => { const s = JSON.stringify(v); return s === undefined ? 'nada' : s.length > 90 ? s.slice(0, 90) + '…' : s; };
  return camino + ' era ' + corta(a) + ' y ahora es ' + corta(b);
}

const listaPendiente = fs.existsSync(L.RUTA_PENDIENTE) ? JSON.parse(fs.readFileSync(L.RUTA_PENDIENTE, 'utf8')) : null;
const pendiente = listaPendiente && listaPendiente.repiten;
const sueltosSabidos = (listaPendiente && listaPendiente.fueraDeBanco) || {};
if (!pendiente) falla('_critica-pendiente.json', 'crítica', 0, 'falta la lista de lo pendiente; se escribe con genera-formas-oro.js --pendiente-critica');

let nFormas = 0, nCongeladas = 0, nPreguntas = 0;
const deuda = [], deudaBanco = [], criticaSinCongelar = [], deAntesSinNuevas = [], nuevasSinCongelar = [], conceptualSinCongelar = [];

lista.forEach(slug => {
  let m;
  try { m = L.cargarMision(slug, 7); }
  catch (e) { falla(slug, 'carga', 0, String(e.message).split('\n')[0]); return; }
  const oro = L.leerOro(slug);
  if (!oro) { falla(slug, 'referencia', 0, 'no tiene formas congeladas. Si es una misión nueva: node _dev/genera-formas-oro.js ' + slug); return; }
  if (oro.tope !== m.tope) falla(slug, 'tope', 0, 'la referencia tiene ' + oro.tope + ' formas y la misión ahora ' + m.tope);

  const bancos = L.bancosDe(m);
  /* Solo para explicar: si un banco cambió, casi seguro por eso cambian
     las formas. No falla por sí solo. */
  const bancosCambiados = Object.keys(oro.bancos).filter(n => !bancos[n] || JSON.stringify(L.huellaBanco(bancos[n])) !== JSON.stringify(oro.bancos[n]));
  const pista = bancosCambiados.length ? ' (cambió el banco ' + bancosCambiados.join(', ') + ')' : '';

  const hechas = [];
  L.pruebasDe(m).forEach(p => {
    const P = L.PRUEBAS[p.prueba];
    const datos = {};
    hechas.push(p.llave);
    if (P.oro && !oro.pruebas[p.llave]) { falla(slug, p.llave, 0, 'la misión tiene esta prueba y la referencia no'); }
    /* La crítica que ya se reparte pero todavía no se congeló: se dice. */
    if (p.prueba === 'critica' && m.reparteCritica && !oro.pruebas[p.llave]) criticaSinCongelar.push(slug);
    /* Una crítica congelada que vuelve a sacar sus casos al azar perdió el
       reparto: sus formas ya no son las de la pauta impresa. */
    /* Salvo la que se congeló con su sorteo de antes y todavía no ofrece
       formas nuevas: esa sigue sacando como siempre, y es lo congelado. */
    if (p.prueba === 'critica' && oro.pruebas[p.llave] && !m.reparteCritica) {
      if (oro.criticaDeAntes) deAntesSinNuevas.push(slug);
      else falla(slug, p.llave, 0, 'tiene la crítica congelada y ya no la reparte con el motor (falta critApartados)');
    }
    /* La que reparte con formas de antes tiene que declarar las mismas que
       dice su referencia: si no, el motor repartiría de nuevo las impresas. */
    if (p.prueba === 'critica' && oro.criticaDeAntes && m.reparteCritica) {
      const declara = m.correr('critApartados().formasDeAntes || 0', 'formas de antes');
      if (declara !== oro.criticaDeAntes) falla(slug, p.llave, 0, 'la referencia tiene congeladas sus formas 1 a ' + oro.criticaDeAntes + ' como salían antes y la misión declara ' + declara + ' formas de antes (_conFormasDeAntes)');
    }
    const topePrueba = m.topeDe(p.prueba);
    let sinCongelar = 0;

    for (let n = 1; n <= topePrueba; n++) {
      let f;
      try { f = m.forma(p.prueba, n, p.materia); }
      catch (e) { falla(slug, p.llave, n, 'no se pudo generar: ' + String(e.message).split('\n')[0]); continue; }
      datos[n] = f.dato; nFormas++;

      /* 1 · congeladas */
      const ref = oro.pruebas[p.llave] && oro.pruebas[p.llave][n];
      if (ref) {
        const hoy = L.sellarForma(f);
        const dif = primeraDiferencia(ref.dato, hoy.dato);
        if (dif) falla(slug, p.llave, n, 'cambió' + pista + ': ' + dif);
        else if (ref.texto !== hoy.texto) falla(slug, p.llave, n, 'las preguntas son las mismas pero cambió lo que se lee en la hoja impresa');
        else if (ref.hoja !== hoy.hoja) falla(slug, p.llave, n, 'dice lo mismo pero cambió cómo se ve la hoja impresa (si fue a propósito: genera-formas-oro.js --resellar-hoja ' + slug + ')');
        else nCongeladas++;
      } else if (p.prueba === 'critica' && oro.criticaDeAntes && !oro.criticaAmpliada && n > oro.criticaDeAntes) sinCongelar++;
      /* Con las nuevas del banco grande congeladas, el examen conceptual
         tiene referencia hasta su última forma. */
      else if (oro.pruebas[p.llave] && n <= (p.prueba === 'critica' || (p.prueba === 'conceptual' && oro.conceptualAmpliada) ? topePrueba : oro.tope)) falla(slug, p.llave, n, 'falta en la referencia');

      /* 3 · del banco */
      if (p.prueba === 'conceptual') {
        const B = L.bancosConceptual(m, bancos, p.materia);
        const partes = { cp: f.dato.cp, tf: f.dato.tf, mc: f.dato.mc, pr: f.dato.pr && f.dato.pr.terms, 'pr (definiciones)': f.dato.pr && f.dato.pr.shuffledDefs };
        Object.keys(partes).forEach(parte => {
          const banco = B[parte.slice(0, 2)];
          if (!Array.isArray(partes[parte]) || !partes[parte].length) { falla(slug, p.llave, n, 'no trae la parte ' + parte); return; }
          if (!Array.isArray(banco)) { falla(slug, p.llave, n, 'no encuentro el banco de ' + parte); return; }
          /* En una forma nueva del banco grande las opciones de la
             selección van barajadas: se compara sin su orden. En las de
             antes, letra por letra, como siempre. */
          const igual = n > m.tope && parte === 'mc' ? x => JSON.stringify(L.sinOrdenDeOpciones(x)) : x => JSON.stringify(x);
          const enBanco = new Set(banco.map(igual));
          partes[parte].forEach(it => {
            nPreguntas++;
            if (!enBanco.has(igual(it))) falla(slug, p.llave, n, 'una pregunta de ' + parte + ' no está en el banco de la misión: ' + JSON.stringify(it).slice(0, 110));
          });
        });
      }
      /* La operativa no tiene banco: sus números salen de la semilla de la
         forma. Lo que la protege es la comparación con la referencia. */
    }

    if (sinCongelar) nuevasSinCongelar.push(slug + ' (' + (oro.criticaDeAntes + 1) + ' a ' + topePrueba + ')');
    /* Las formas nuevas del examen conceptual (banco grande) que todavía
       no tienen referencia: se nombran, como las de la crítica. */
    if (p.prueba === 'conceptual' && topePrueba > oro.tope && oro.pruebas[p.llave] && !oro.pruebas[p.llave][topePrueba])
      conceptualSinCongelar.push(slug + ' (' + (oro.tope + 1) + ' a ' + topePrueba + ')');

    /* 3 · del banco, en la crítica. Se mira por texto. En unas pocas
       misiones parte de la prueba la escribe el generador (una rúbrica
       fija, una respuesta calculada) y no está en ningún banco: eso está
       contado en la lista de pendientes; lo que pase de ahí es nuevo. */
    if (p.prueba === 'critica') {
      nPreguntas += Object.keys(datos).reduce((s, n) => s + L.cadenasDe(datos[n]).length, 0);
      const sueltos = L.textosFueraDeBanco(bancos, datos);
      const sabidos = sueltosSabidos[slug] || 0;
      if (sueltos.length > sabidos) {
        falla(slug, p.llave, 0, 'tiene ' + sueltos.length + ' textos que no están en ningún banco de la misión' + (sabidos ? ' (eran ' + sabidos + ')' : '') + ', por ejemplo: ' + sueltos.slice(0, 3).map(t => JSON.stringify(t.slice(0, 80))).join(', '));
      } else if (sueltos.length) deudaBanco.push(slug + ' (' + sueltos.length + ')');
    }

    /* 2 · sin repetir */
    const r = L.repetidas(datos);
    const total = r.iguales.length + r.mismoConjunto.length;
    /* Una forma congelada de más: el banco se achicó y la prueba ya no
       llega hasta donde llegaba la pauta impresa. */
    if (oro.pruebas[p.llave]) Object.keys(oro.pruebas[p.llave]).map(Number).filter(n => n > topePrueba)
      .forEach(n => falla(slug, p.llave, n, 'está congelada y la misión ya no la ofrece (ahora llega a la Forma ' + topePrueba + ')'));
    if (p.prueba === 'critica' && m.reparteCritica) {
      /* La que ya se reparte no tiene deuda que perdonar. */
      r.iguales.forEach(([a, b]) => falla(slug, p.llave, a, 'es idéntica a la Forma ' + b));
      r.mismoConjunto.forEach(([a, b]) => falla(slug, p.llave, a, 'trae los mismos casos que la Forma ' + b + ', en otro orden'));
      if (pendiente && pendiente[slug]) falla(slug, p.llave, 0, 'ya reparte sin repetir y sigue en la lista de pendientes: actualízala con genera-formas-oro.js --pendiente-critica');
    } else if (p.prueba === 'critica') {
      const sabido = pendiente && pendiente[slug];
      if (total && !sabido) {
        r.iguales.forEach(([a, b]) => falla(slug, p.llave, a, 'es idéntica a la Forma ' + b));
        r.mismoConjunto.forEach(([a, b]) => falla(slug, p.llave, a, 'trae las mismas preguntas que la Forma ' + b + ', en otro orden'));
      } else if (sabido && r.distintas < sabido.distintas) {
        falla(slug, p.llave, 0, 'repite más que antes: daba ' + sabido.distintas + ' formas distintas y ahora ' + r.distintas);
      } else if (sabido && r.distintas > sabido.distintas) {
        falla(slug, p.llave, 0, 'ya repite menos (' + r.distintas + ' distintas, eran ' + sabido.distintas + '): actualiza la lista con genera-formas-oro.js --pendiente-critica');
      } else if (sabido) deuda.push(slug + ' (' + r.distintas + ' de ' + topePrueba + ')');
    } else {
      r.iguales.forEach(([a, b]) => falla(slug, p.llave, a, 'es idéntica a la Forma ' + b));
      r.mismoConjunto.forEach(([a, b]) => falla(slug, p.llave, a, 'trae las mismas preguntas que la Forma ' + b + ', en otro orden'));
    }
  });

  /* Una prueba que estaba congelada y ya no existe también es un cambio. */
  Object.keys(oro.pruebas).forEach(llave => { if (!hechas.includes(llave)) falla(slug, llave, 0, 'estaba congelada y la misión ya no la tiene'); });
  if (pendiente && pendiente[slug] && !hechas.includes('critica')) falla(slug, 'crítica', 0, 'está en la lista de pendientes y ya no tiene prueba crítica');
});

/* Una referencia sin misión: se borró o se renombró la carpeta, y con
   ella se fue la URL del QR impreso. */
if (!pedidas.length && fs.existsSync(L.DIR_ORO)) {
  fs.readdirSync(L.DIR_ORO).filter(f => f.endsWith('.json') && !f.startsWith('_')).forEach(f => {
    const slug = f.slice(0, -5);
    if (!dentro.includes(slug)) falla(slug, 'referencia', 0, 'hay formas congeladas de una misión que ya no está en el alcance');
  });
  if (pendiente) Object.keys(pendiente).forEach(slug => { if (!dentro.includes(slug)) falla(slug, 'crítica', 0, 'está en la lista de pendientes y no es una misión del alcance'); });
}

console.log('Formas de examen · ' + lista.length + ' misiones' + (pedidas.length ? '' : ' (fuera del alcance: ' + fuera.length + ')'));
console.log('  ' + nFormas + ' formas generadas, ' + nCongeladas + ' comparadas con su referencia, ' + nPreguntas + ' preguntas buscadas en su banco');
if (deuda.length) {
  console.log('\n  Pendiente conocido · la prueba de pensamiento crítico repite formas en ' + deuda.length + ' misiones.');
  console.log('  Todavía sacan los casos al azar; pasan al reparto por tandas. No pone la sonda en rojo. Formas distintas hoy:');
  deuda.forEach(d => console.log('    · ' + d));
}
if (criticaSinCongelar.length) {
  console.log('\n  Por congelar · ' + criticaSinCongelar.length + ' misiones ya reparten la prueba de pensamiento crítico sin repetir y esperan el visto bueno de Josué');
  console.log('  para tener referencia (genera-formas-oro.js --critica <carpeta>):');
  criticaSinCongelar.forEach(d => console.log('    · ' + d));
}
if (deAntesSinNuevas.length) {
  console.log('\n  Con su sorteo de antes · ' + deAntesSinNuevas.length + ' misiones de estructura propia tienen congelada su prueba de pensamiento crítico');
  console.log('  tal como salía (formas 1 a 30) y todavía no ofrecen formas nuevas:');
  deAntesSinNuevas.forEach(d => console.log('    · ' + d));
}
if (nuevasSinCongelar.length) {
  console.log('\n  Por congelar · ' + nuevasSinCongelar.length + ' misiones de estructura propia ya ofrecen formas nuevas de la prueba de pensamiento crítico.');
  console.log('  Sus formas de antes siguen idénticas; las nuevas esperan el visto bueno de Josué (genera-formas-oro.js --critica-ampliar <carpeta>):');
  nuevasSinCongelar.forEach(d => console.log('    · ' + d));
}
if (conceptualSinCongelar.length) {
  console.log('\n  Por congelar · ' + conceptualSinCongelar.length + ' misiones ofrecen formas nuevas del examen conceptual con su banco grande.');
  console.log('  Sus formas de antes siguen idénticas; las nuevas esperan el visto bueno de Josué y no tienen referencia todavía:');
  conceptualSinCongelar.forEach(d => console.log('    · ' + d));
}
if (deudaBanco.length) {
  console.log('\n  Pendiente conocido · en ' + deudaBanco.length + ' misiones parte de la prueba crítica la escribe el generador y no un banco');
  console.log('  (rúbrica fija o respuesta calculada). Textos distintos fuera de banco:');
  deudaBanco.forEach(d => console.log('    · ' + d));
}
if (fallos.length) {
  console.log('\n──────── LO QUE FALLÓ (' + fallos.length + ') ────────');
  fallos.slice(0, 60).forEach(f => console.log('  ✘ ' + f));
  if (fallos.length > 60) console.log('  … y ' + (fallos.length - 60) + ' más');
  console.log('\n❌ Una forma congelada no se arregla volviendo a congelar: se deshace el cambio.');
  process.exit(1);
}
console.log('\n✅ Las formas congeladas son idénticas, ninguna repite a otra y toda pregunta es del banco de su misión.');
