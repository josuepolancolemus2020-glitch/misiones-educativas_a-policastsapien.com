/* ════════════════════════════════════════════════════════════════════
   EL GENERADOR DE TAREAS TIENE QUE PODER PINTAR SUS BANCOS
   ────────────────────────────────────────────────────────────────────
   Descubierto el 18 de septiembre de 2026 escribiendo la unidad 5 de
   Filosofía: `genCompleteTask` pinta

       📝 Opciones: ${item.opts.join(' | ')}

   y en TRECE misiones publicadas ninguna fila de `completeTaskDB` traía el
   campo `opts`. Eso no imprime «undefined»: **revienta**. El maestro toca
   «Completa la oración» en el 📋 Generador de Tareas y no sale nada, sin un
   solo aviso en la pantalla. Comprobado abriendo la misión en el navegador:
   `TypeError: Cannot read properties of undefined (reading 'join')`.

   Es la familia del `target:` de la misión 69 —que imprimía «✅ undefined» en
   la clave del maestro— y del `\U0001F1ED` de Python: el archivo compila, la
   misión se pinta, la consola callada. Lo que se multiplica al copiar una
   misión no son solo los aciertos.

   Así que esto no se arregla solo a mano: se comprueba. La sonda **lee lo que
   la función PINTA** —qué campos de `item` usa cada `gen*Task`— y le pide al
   banco que los traiga en todas sus filas. Así vale para el campo que se
   invente mañana y no hay una lista escrita que se quede vieja.

       node _dev/verifica-bancos-tareas.js
   ════════════════════════════════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0, avisos = 0;
const mal = m => { console.log('  ❌ ' + m); fallos++; };
const ok = m => console.log('  ✅ ' + m);

/* Las cuatro funciones del generador. ⚠️ El NOMBRE de su banco NO se escribe
   aquí: se lee del cuerpo de la función. Escribirlo dejaba fuera a dos
   misiones que lo llaman de otra manera —`completeTasks` en vez de
   `completeTaskDB`— y las acusaba de no tener banco teniéndolo. Es la misma
   lección que `reparte-respuestas`, que busca el JS de la misión por lo que
   lleva dentro y no por su nombre. */
const FUNCIONES = ['genIdentifyTask', 'genClassifyTask', 'genCompleteTask', 'genExplainTask'];

/* De dónde saca la función sus filas: `_shuffle([...banco])`, `_pick(banco,`
   o un `banco.length` suelto. */
function bancoQueUsa(cuerpo) {
  let m = cuerpo.match(/(?:_shuffle|_pick)F?\s*\(\s*\[?\s*\.{0,3}\s*([A-Za-z_$][\w$]*)/);
  if (m) return m[1];
  m = cuerpo.match(/([A-Za-z_$][\w$]*(?:TaskDB|Tasks|Questions|Bank))\b/);
  return m ? m[1] : null;
}

const sinComentarios = t => t
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/^[ \t]*\/\/.*$/gm, ' ');

/* El cuerpo de una función `function nombre(...){ … }`, contando llaves. */
function cuerpoDe(src, nombre) {
  const i = src.indexOf('function ' + nombre + '(');
  if (i < 0) return null;
  const abre = src.indexOf('{', i);
  if (abre < 0) return null;
  let n = 0;
  for (let k = abre; k < src.length; k++) {
    if (src[k] === '{') n++;
    else if (src[k] === '}') { n--; if (!n) return src.slice(abre, k + 1); }
  }
  return null;
}

/* El literal de un banco `const|let|var nombre = [ … ]`, contando corchetes.
   ⚠️ Se aceptan `const`, `let` y `var`: siete misiones lo declaran con `let`
   —las que cambian de idioma en caliente reasignan el banco—, y pedir `const`
   las dejaba fuera EN SILENCIO, que es lo que ya le pasó a `reparte-respuestas`
   con `ingles-saludos`. */
function bancoDe(src, nombre) {
  const re = new RegExp('(?:const|let|var)\\s+' + nombre + '\\s*=\\s*\\[');
  const m = re.exec(src);
  if (!m) return null;
  const abre = src.indexOf('[', m.index);
  let n = 0;
  for (let k = abre; k < src.length; k++) {
    if (src[k] === '[') n++;
    else if (src[k] === ']') { n--; if (!n) return src.slice(abre, k + 1); }
  }
  return null;
}

/* Las filas del banco, al primer nivel de llaves. */
function filasDe(literal) {
  const out = [];
  let n = 0, ini = -1;
  for (let k = 0; k < literal.length; k++) {
    if (literal[k] === '{') { if (!n) ini = k; n++; }
    else if (literal[k] === '}') { n--; if (!n && ini >= 0) { out.push(literal.slice(ini, k + 1)); ini = -1; } }
  }
  return out;
}

/* Los campos de `item` que la función LEE. Es lo que la hace servir para el
   campo que se invente mañana: no hay lista escrita. */
function camposQuePinta(cuerpo) {
  const c = new Set();
  /* ⚠️ El nombre de un campo puede llevar acento —`posición` en la misión de
     los pronombres—, y JavaScript lo acepta. Con `\w` se cortaba en «posici» y
     la sonda pedía un campo que no existe: ocho fallos con el banco perfecto. */
  const ID = '([A-Za-zÁÉÍÓÚÜÑáéíóúüñ_$][A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ_$]*)';
  [...cuerpo.matchAll(new RegExp('\\bitem\\.' + ID, 'g'))].forEach(m => c.add(m[1]));
  /* `it` es el nombre que usa genClassifyTask dentro de su `forEach`. */
  [...cuerpo.matchAll(new RegExp('\\bit\\.' + ID, 'g'))].forEach(m => c.add(m[1]));
  c.delete('length');
  return [...c];
}

function misiones() {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.js') && !e.name.endsWith('-en.js')) out.push(p);
    }
  })(path.join(RAIZ, 'misiones'));
  return out;
}

console.log('\n📋 El Generador de Tareas: que cada banco traiga lo que su función pinta\n');

let conGenerador = 0, revisados = 0;
misiones().forEach(abs => {
  const rel = path.relative(RAIZ, abs);
  const src = sinComentarios(fs.readFileSync(abs, 'utf8'));
  let tocada = false;
  FUNCIONES.forEach(fn => {
    const cuerpo = cuerpoDe(src, fn);
    if (!cuerpo) return;
    tocada = true;
    const banco = bancoQueUsa(cuerpo);
    if (!banco) { mal(`${rel}: no se pudo leer de qué banco saca las filas ${fn}()`); return; }
    const literal = bancoDe(src, banco);
    if (!literal) {
      mal(`${rel}: pinta ${fn}() y no se encontró su banco ${banco}`);
      return;
    }
    const filas = filasDe(literal);
    if (!filas.length) {
      /* ⚠️ Un banco de CADENAS donde la función espera objetos: pasa en
         `albores-singularidad`, cuyo `explainQuestions` son nueve frases
         sueltas y el pintado lee `item.q`. El alumno lee «undefined» donde iba
         la pregunta. */
      mal(`${rel}: ${fn}() lee ${camposQuePinta(cuerpo).map(c => 'item.' + c).join(', ')} y ${banco} no trae objetos: son valores sueltos`);
      return;
    }
    revisados++;
    camposQuePinta(cuerpo).forEach(campo => {
      const sin = filas.filter(f => !new RegExp('[{,]\\s*(?:' + campo + '|[\'"]' + campo + '[\'"])\\s*:').test(f));
      if (sin.length) {
        mal(`${rel}: ${fn}() pinta «item.${campo}» y ${sin.length} de ${filas.length} fila(s) de ${banco} no lo traen`);
      }
    });
  });
  if (tocada) conGenerador++;
});

console.log('');
console.log(`  misiones con Generador de Tareas: ${conGenerador} · bancos revisados: ${revisados}`);
if (!fallos) ok('cada banco trae todos los campos que su función pinta');

console.log('');
console.log(fallos ? `❌ ${fallos} fallo(s), ${avisos} aviso(s)` : `✅ 0 fallo(s), ${avisos} aviso(s)`);
process.exit(fallos ? 1 : 0);
