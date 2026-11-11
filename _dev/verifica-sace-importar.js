/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Importar la lista del SACE empareja bien y cuenta 41
   ──────────────────────────────────────────────────────────────
   El caso real que pidió esto: 44 fichas en Mi aula y 41 alumnos en el
   SACE. La estadística tiene que salir con 41 y las fichas que sobran
   tienen que quedarse, marcadas «Fuera de la lista oficial».

   El CSV de prueba (_dev/sace-prueba/) trae a propósito:
   · una identidad MAL ESCRITA en el SACE (12 dígitos): se marca y no
     pisa la de la ficha; el alumno se empareja por nombre;
   · fichas sin alumno en el SACE (#7, #19, #33, #44);
   · un alumno del SACE sin ficha;
   · una ficha sin identidad, otra con la identidad mal tecleada, otra
     con el sexo cambiado, otra con otra fecha de nacimiento (gana el
     SACE) y otra con el nombre recortado a dos palabras;
   · los nombres al estilo SACE: APELLIDOS NOMBRES, sin tildes.

   Uso:  node _dev/verifica-sace-importar.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const SL = require(path.join(RAIZ, 'js', 'tools', 'sace-lista.js'));
const CSV = fs.readFileSync(path.join(__dirname, 'sace-prueba', 'lista-sace-prueba.csv'), 'utf8');
const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'sace-prueba', 'aula-prueba.json'), 'utf8'));

let fallos = 0;
const ok = (cond, txt) => { console.log((cond ? '✓ ' : '✘ ') + txt); if (!cond) fallos++; };

/* ── leer ── */
const leido = SL.parseCsv(CSV);
ok(leido.filas.length === 41, 'el CSV trae 41 alumnos (' + leido.filas.length + ')');
ok(!leido.errores.length, 'sin renglones descartados');
const malas = leido.filas.filter(f => !f.idnOk);
ok(malas.length === 1 && malas[0].num === 3, 'una sola identidad sin 13 dígitos, la del Nº 3 del SACE');
ok(leido.filas.every(f => f.fnacOk && (f.sexo === 'F' || f.sexo === 'M')), 'todas las fechas y sexos se entienden');

/* también con punto y coma, comillas y fecha a la manera de Excel */
const excel = SL.parseCsv('﻿num;identidad;nombre;sexo;fecha_nacimiento;edad_sace\n1;"0801-2015-01234";"PAZ CRUZ, ANA";Femenino;27/01/2015;11\n');
ok(excel.filas.length === 1 && excel.filas[0].fnac === '2015-01-27' && excel.filas[0].sexo === 'F' && excel.filas[0].idnOk,
  'lee el CSV de Excel en español (punto y coma, comillas, DD/MM/AAAA)');

/* ── edad ── */
ok(SL.edadTxt('2015-03-20', '2026-11-11') === '11 años 7 meses', 'edad en años y meses (11 años 7 meses)');
ok(SL.edad('2015-11-12', '2026-11-11').anios === 10, 'un día antes del cumpleaños todavía no cumple');
ok(SL.edad('2015-11-11', '2026-11-11').anios === 11, 'el día del cumpleaños ya cumple');

/* ── emparejar ── */
const d = JSON.parse(JSON.stringify(FIX.grupo));
const plan = SL.emparejar(d.lista, leido.filas);
ok(plan.pares.length === 40, '40 fichas se emparejan (' + plan.pares.length + ')');
ok(plan.sinFicha.length === 1 && plan.sinFicha[0].num === 41, 'el Nº 41 del SACE queda sin ficha');
ok(JSON.stringify(plan.sinSace) === JSON.stringify(FIX.casos.fueraSace),
  'fichas sin alumno en el SACE: ' + plan.sinSace.map(n => '#' + n).join(', '));
const mal = plan.pares.filter(p => FIX.saceNumAFicha[p.f.num] !== p.num);
ok(!mal.length, 'cada fila del SACE cae en su ficha' + (mal.length ? ': ' + mal.map(p => 'SACE ' + p.f.num + '→#' + p.num).join(', ') : ''));

const parDe = num => plan.pares.find(p => p.num === num);
const c = FIX.casos;
ok(parDe(c.idnMalEnSace).por === 'nombre' && !parDe(c.idnMalEnSace).cambios.some(x => x.campo === 'idn'),
  '#' + c.idnMalEnSace + ': identidad mal escrita en el SACE → por nombre y sin tocar la de la ficha');
ok(parDe(c.sinIdnEnFicha).cambios.some(x => x.campo === 'idn'), '#' + c.sinIdnEnFicha + ': la ficha sin identidad recibe la del SACE');
ok(parDe(c.idnMalEnFicha).por === 'nombre' && parDe(c.idnMalEnFicha).cambios.some(x => x.campo === 'idn'),
  '#' + c.idnMalEnFicha + ': identidad mal tecleada en la ficha → se propone la del SACE');
ok(parDe(c.sexoDistinto).cambios.some(x => x.campo === 'sexo'), '#' + c.sexoDistinto + ': sexo distinto, se propone el del SACE');
ok(parDe(c.fechaDistinta).cambios.some(x => x.campo === 'fnac'), '#' + c.fechaDistinta + ': fecha distinta, se propone la del SACE');
ok(parDe(c.nombreCorto).por === 'identidad', '#' + c.nombreCorto + ': nombre recortado, se empareja por identidad');
ok(SL.similitud('MARIA LOPEZ', 'MARIA REYES') === 0, 'una sola palabra en común no empareja a nadie');

/* ── aplicar todo lo propuesto ── */
const conf = {
  pares: plan.pares.map((_, i) => i),
  campos: { idn: true, sexo: true, fnac: true, nombre: false },
  nuevos: [0],
  fuera: plan.sinSace.slice(),
  estados: { 19: 'trasladado', 33: 'desertor' },
  fecha: '2026-11-11'
};
const numsAntes = d.lista.map(a => a.num);
const res = SL.aplicar(d, plan, conf);
ok(res.marcadas === 40 && res.nuevas.length === 1 && res.fuera === 4, 'se marcan 40, se agrega 1, quedan 4 fuera');
ok(d.lista.length === 45, 'ninguna ficha se borra: 44 + 1 nueva = 45');
ok(numsAntes.every((n, i) => d.lista[i].num === n), 'ningún número de lista cambia');
const al = num => d.lista.find(a => a.num === num);
const filaDe = num => leido.filas.find(f => FIX.saceNumAFicha[f.num] === num);
ok(al(c.fechaDistinta).fnac === filaDe(c.fechaDistinta).fnac, 'la fecha del SACE gana');
ok(al(c.sexoDistinto).sexo === filaDe(c.sexoDistinto).sexo, 'el sexo del SACE gana');
ok(al(c.idnMalEnSace).idn === FIX.grupo.lista.find(a => a.num === c.idnMalEnSace).idn, 'la identidad mal escrita del SACE no pisa la ficha');
ok(al(c.nombreCorto).nombre === FIX.grupo.lista.find(a => a.num === c.nombreCorto).nombre, 'sin marcar «Nombre», el nombre de la ficha no cambia');
ok(FIX.casos.fueraSace.every(n => al(n).sace === false), 'las 4 fichas de más quedan «Fuera de la lista oficial»');
ok(al(19).estado === 'trasladado' && al(33).estado === 'desertor' && al(33).estadoF === '2026-11-11', 'trasladado y desertor con su fecha');

/* ── la estadística sale con 41 ── */
ok(SL.matriculaFinal(d).length === 41, 'matrícula final: 41 (' + SL.matriculaFinal(d).length + ')');
const cu = SL.cuadroEdades(d, '2026-11-11');
ok(cu.total.total === 41 && cu.total.F + cu.total.M === 41, 'el cuadro por edades y género suma 41 (' + cu.total.F + ' ♀ + ' + cu.total.M + ' ♂)');
ok(cu.fueraOficial === 4, 'el cuadro dice que hay 4 fichas fuera de la lista oficial');
/* la edad del cuadro es la de la fecha de corte, no la de hoy */
const corteViejo = SL.cuadroEdades(d, '2020-01-01');
ok(corteViejo.filas.every(r => r.edad <= 5), 'con otra fecha de corte, la edad se calcula a esa fecha');
const edadesSace = {};
leido.filas.forEach(f => { edadesSace[f.edadSace] = (edadesSace[f.edadSace] || 0) + 1; });
ok(cu.filas.every(r => edadesSace[r.edad] === r.total), 'al corte del 11/11/2026 coincide con la edad que trae el SACE');

/* un alumno de la lista oficial que se traslada después sale de la matrícula */
al(1).estado = 'trasladado';
ok(SL.matriculaFinal(d).length === 40, 'trasladar a uno de la lista oficial lo saca de la matrícula final (40)');
/* sin importar nunca, la estadística no inventa matrícula oficial */
ok(SL.matriculaFinal(FIX.grupo).length === 0 && SL.alumnosQueCuentan(FIX.grupo).length === 44,
  'sin lista del SACE no hay matrícula oficial; los informes de siempre siguen contando 44');

console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ Importar la lista del SACE: todo en orden');
process.exit(fallos ? 1 : 0);
