/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Importar la lista del SACE no cambia ninguna nota
   ──────────────────────────────────────────────────────────────
   Las notas, la asistencia y las claves de familia cuelgan del `num` de
   cada ficha. Importar el SACE solo puede AÑADIR o CAMBIAR datos de
   identidad dentro de la ficha (identidad, nombre, sexo, fecha de
   nacimiento, marcas del SACE y estado). Esta sonda importa con TODO
   marcado, lo peor que puede pasar, y compara antes y después:
   · d.notas y todo lo que no es la lista queda idéntico, byte a byte;
   · ninguna ficha se va y ningún `num` cambia;
   · en cada ficha, cualquier campo fuera de los permitidos queda igual.

   Y mira el código: la lógica no nombra `notas`, no guarda nada por su
   cuenta ni manda nada fuera del dispositivo (ni fetch, ni Supabase).

   Uso:  node _dev/verifica-sace-notas.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const ARCH = path.join(RAIZ, 'js', 'tools', 'sace-lista.js');
const SL = require(ARCH);
const CSV = fs.readFileSync(path.join(__dirname, 'sace-prueba', 'lista-sace-prueba.csv'), 'utf8');
const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'sace-prueba', 'aula-prueba.json'), 'utf8'));

let fallos = 0;
const ok = (cond, txt) => { console.log((cond ? '✓ ' : '✘ ') + txt); if (!cond) fallos++; };

const PERMITIDOS = new Set(['idn', 'nombre', 'sexo', 'fnac', 'sace', 'saceNum', 'edadSace', 'estado', 'estadoF']);

const antes = JSON.parse(JSON.stringify(FIX.grupo));
const d = JSON.parse(JSON.stringify(FIX.grupo));
const leido = SL.parseCsv(CSV);
const plan = SL.emparejar(d.lista, leido.filas);
const estados = {};
plan.sinSace.forEach((n, i) => { estados[n] = i % 2 ? 'desertor' : 'trasladado'; });
SL.aplicar(d, plan, {
  pares: plan.pares.map((_, i) => i),
  campos: { idn: true, nombre: true, sexo: true, fnac: true },
  nuevos: plan.sinFicha.map((_, i) => i),
  fuera: plan.sinSace.slice(),
  estados,
  fecha: '2026-11-11'
});

ok(JSON.stringify(d.notas) === JSON.stringify(antes.notas), 'd.notas idéntico después de importar con todo marcado');
const fuera = k => k !== 'lista' && k !== 'saceImport';
const llaves = new Set([...Object.keys(antes), ...Object.keys(d)].filter(fuera));
const distintas = [...llaves].filter(k => JSON.stringify(antes[k]) !== JSON.stringify(d[k]));
ok(!distintas.length, 'nada fuera de la lista cambia' + (distintas.length ? ': ' + distintas.join(', ') : ''));

ok(antes.lista.every((a, i) => d.lista[i] && d.lista[i].num === a.num), 'las 44 fichas siguen, con su mismo número y en su lugar');
const tocadas = [];
antes.lista.forEach((a, i) => {
  const b = d.lista[i];
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach(k => {
    if (!PERMITIDOS.has(k) && JSON.stringify(a[k]) !== JSON.stringify(b[k])) tocadas.push('#' + a.num + '.' + k);
  });
});
ok(!tocadas.length, 'en ninguna ficha cambia un campo que no sea de identidad' + (tocadas.length ? ': ' + tocadas.join(', ') : ''));
const nuevas = d.lista.slice(antes.lista.length);
ok(nuevas.every(a => !Object.keys(d.notas).some(p => Object.keys(d.notas[p]).some(m => String(a.num) in d.notas[p][m]))),
  'la ficha nueva no hereda notas de nadie');

/* importar dos veces no cambia nada más: el maestro puede volver a subir el CSV */
const segunda = JSON.parse(JSON.stringify(d));
const plan2 = SL.emparejar(segunda.lista, leido.filas);
ok(plan2.sinFicha.length === 0 && plan2.pares.every(p => !p.cambios.length),
  'al importar otra vez el mismo CSV ya no hay nada que cambiar');

/* el código: sin notas, sin red, sin guardar por su cuenta */
const src = fs.readFileSync(ARCH, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
ok(!/\bnotas\b/.test(src), 'sace-lista.js no nombra las notas');
ok(!/fetch\s*\(|XMLHttpRequest|supabase|sendBeacon|WebSocket/i.test(src), 'sace-lista.js no manda nada fuera del dispositivo');
ok(!/localStorage|sessionStorage|indexedDB/.test(src), 'sace-lista.js no guarda por su cuenta: guarda la pantalla, con adSave');

const adm = fs.readFileSync(path.join(RAIZ, 'js', 'tools', 'registros-admin.js'), 'utf8');
const ini = adm.indexOf('function adSaceImportarTexto(');
const fin = adm.indexOf('/* ══════════════ 📊 MATRÍCULA FINAL POR EDADES');
const bloque = ini > 0 && fin > ini ? adm.slice(ini, fin).replace(/\/\*[\s\S]*?\*\//g, '') : '';
ok(bloque.length > 0, 'la pantalla de importar está en registros-admin.js');
/* «notas» puede salir en el texto que lee el maestro; lo que no puede es el dato */
ok(!/fetch\s*\(|supabase|XMLHttpRequest|\.notas\b|\bnotas\s*\[/i.test(bloque), 'la pantalla de importar no toca la red ni las notas');
ok(/adUndoGuardar\(/.test(bloque), 'antes de guardar deja un punto para deshacer');

console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ Importar el SACE no cambia ninguna nota');
process.exit(fallos ? 1 : 0);
