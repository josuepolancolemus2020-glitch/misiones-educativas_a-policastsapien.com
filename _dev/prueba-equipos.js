#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   🤝 LOS EQUIPOS DE TRABAJO, SIN NAVEGADOR

   El reparto de js/tools/equipos.js es una BÚSQUEDA: prueba repartos al
   azar y va cambiando alumnos de a dos mientras mejore. Una búsqueda así
   puede parecer que funciona y dejar, sin un solo error, a las niñas
   juntas en un equipo o a los que van mejor en otro. Aquí se comprueba
   lo que la pantalla le PROMETE al maestro, con aulas de mentira:

   · QUE NO SE PIERDA NI SE REPITA NADIE. Un niño en dos equipos, o en
     ninguno, se descubre con el grupo ya repartido por el aula.
   · QUE LOS TAMAÑOS SEAN PAREJOS y nunca más grandes de lo pedido.
   · QUE NIÑAS Y VARONES QUEDEN MEZCLADOS: a ningún equipo le toca más de
     lo que le corresponde (redondeando para arriba) ni menos (para abajo).
   · QUE «PAREJOS» SEA PAREJO: en cada equipo hay de los tres tercios de
     notas, y el promedio de los equipos queda mucho más junto que al azar.
   · QUE «POR NIVEL» JUNTE A LOS PARECIDOS, mucho más que al azar.
   · QUE LAS PAREJAS QUE SE SEPARAN QUEDEN SEPARADAS, en todas las
     semillas: eso lo pidió el maestro por algo.
   · QUE «ARMAR OTROS» DÉ OTROS, igual de parejos.
   · QUE AL INSERTAR UN ALUMNO LOS EQUIPOS GUARDADOS SE RECORRAN con él.

   Cuesta un par de segundos, a propósito: es la que hay que poder correr
   cada vez que se toca el reparto.

   Uso:  node _dev/prueba-equipos.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const path = require('path');
const E = require(path.join(__dirname, '..', 'js', 'tools', 'equipos.js'));

const EQ_MIN = 2;
let fallos = 0, pasan = 0;
const comprueba = (m, c, extra) => {
  if (c) { pasan++; console.log('  ✅ ' + m); }
  else { fallos++; console.log('  ❌ ' + m + (extra !== undefined ? '  ' + JSON.stringify(extra) : '')); }
};

/* Un aula de 43 como las de verdad: niñas y varones casi mitad y mitad,
   notas de 52 a 98 que NO siguen al número de lista, y dos sin anotar
   el sexo. El azar del aula es fijo para que la sonda diga siempre lo
   mismo. */
function aula(n, semilla) {
  const r = E.eqRng(semilla || 99);
  const out = [];
  for (let i = 1; i <= n; i++) {
    out.push({ num: i, sexo: i === 6 || i === 21 ? '' : (r() < 0.52 ? 'F' : 'M'),
               nivel: Math.round(52 + r() * 46) });
  }
  return out;
}
const todos = gs => gs.flat();
const suma = xs => xs.reduce((s, x) => s + x, 0);

/* Lo que daría repartir al azar, para medir contra algo que no sea una
   cifra escrita a mano: «parejo» es parejo COMPARADO con no hacer nada. */
function alAzar(al, tams, semilla) {
  const r = E.eqRng(semilla);
  const o = al.map(a => a.num);
  for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
  let p = 0;
  return tams.map(s => { const g = o.slice(p, p + s); p += s; return g; });
}
const mediana = xs => { const s = xs.slice().sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

console.log('\n── los tamaños ──');
{
  let mal = [];
  for (let n = 1; n <= 60; n++) {
    for (let v = 2; v <= 15; v++) {
      const t = E.eqTamanos(n, 'tam', v);
      if (suma(t) !== n) mal.push(['suma', n, v]);
      if (t.length && Math.max(...t) - Math.min(...t) > 1) mal.push(['parejo', n, v]);
      /* solo se pasa para que nadie quede solo, y entonces por uno */
      if (n >= 4 && Math.max(...t) > v && !(Math.min(...t) === EQ_MIN && Math.max(...t) === v + 1 && t.length === Math.floor(n / EQ_MIN)))
        mal.push(['pasa de lo pedido', n, v, t]);
      if (n >= 4 && Math.min(...t) < 2) mal.push(['equipo de uno', n, v, t]);
      const k = E.eqTamanos(n, 'num', v);
      if (suma(k) !== n) mal.push(['suma num', n, v]);
      if (k.length && Math.max(...k) - Math.min(...k) > 1) mal.push(['parejo num', n, v]);
      if (n >= 4 && Math.min(...k) < 2) mal.push(['equipo de uno (num)', n, v, k]);
      if (n >= 4 && k.length !== Math.min(v, Math.floor(n / 2))) mal.push(['cuántos', n, v, k.length]);
    }
  }
  comprueba('de 1 a 60 alumnos y de 2 a 15: suman todos, entre el más grande y el más chico hay a lo más uno, nadie queda solo y solo se pasa de lo pedido para eso', !mal.length, mal.slice(0, 4));
  comprueba('«en parejas» con 43 no deja a nadie solo: 20 parejas y un trío',
    E.eqTamanosTxt(E.eqTamanos(43, 'tam', 2)) === '21 equipos: 1 de 3 y 20 de 2', E.eqTamanosTxt(E.eqTamanos(43, 'tam', 2)));
  comprueba('«equipos de 4» con 42 alumnos dice «11 equipos: 9 de 4 y 2 de 3»',
    E.eqTamanosTxt(E.eqTamanos(42, 'tam', 4)) === '11 equipos: 9 de 4 y 2 de 3', E.eqTamanosTxt(E.eqTamanos(42, 'tam', 4)));
  comprueba('«8 equipos» con 40 dice «8 equipos de 5»', E.eqTamanosTxt(E.eqTamanos(40, 'num', 8)) === '8 equipos de 5');
  comprueba('con 3 alumnos sale un solo equipo, no uno de dos y otro de uno', JSON.stringify(E.eqTamanos(3, 'tam', 2)) === '[3]');
}

const AL = aula(43);
const T4 = E.eqTamanos(43, 'tam', 4);
const SEMILLAS = [1, 2, 3, 4, 5, 6, 7, 8];

console.log('\n── nadie se pierde ni se repite ──');
{
  let mal = [];
  for (const nivel of ['azar', 'parejos', 'nivel']) {
    for (const s of SEMILLAS) {
      const r = E.eqArmar(AL, { tamanos: T4, sexo: true, nivel, semilla: s });
      const xs = todos(r.grupos).sort((a, b) => a - b);
      if (JSON.stringify(xs) !== JSON.stringify(AL.map(a => a.num))) mal.push([nivel, s]);
      const tt = r.grupos.map(g => g.length).sort((a, b) => b - a);
      if (JSON.stringify(tt) !== JSON.stringify(T4.slice().sort((a, b) => b - a))) mal.push([nivel, s, 'tamaños', tt]);
    }
  }
  comprueba('en los tres modos y ocho semillas, cada alumno está en UN equipo y los tamaños son los pedidos', !mal.length, mal.slice(0, 3));
}

console.log('\n── niñas y varones mezclados ──');
{
  const F = AL.filter(a => a.sexo === 'F').length, M = AL.filter(a => a.sexo === 'M').length;
  let mal = [];
  for (const s of SEMILLAS) {
    const r = E.eqArmar(AL, { tamanos: T4, sexo: true, nivel: 'parejos', semilla: s });
    r.grupos.forEach(g => {
      const f = g.filter(n => AL[n - 1].sexo === 'F').length, m = g.filter(n => AL[n - 1].sexo === 'M').length;
      const eF = F * g.length / 43, eM = M * g.length / 43;
      if (f > Math.ceil(eF) || f < Math.floor(eF) || m > Math.ceil(eM) || m < Math.floor(eM)) mal.push([s, g.length, f, m]);
    });
  }
  comprueba(`con ${F} niñas y ${M} varones, a ningún equipo le tocan más ni menos de lo que le corresponde (con sus notas mezcladas también)`, !mal.length, mal.slice(0, 4));
}

console.log('\n── «parejos»: en cada equipo hay de todo ──');
{
  const tercio = E.eqTercios(AL);
  const T = [0, 1, 2].map(k => AL.filter(a => tercio[a.num] === k).length);
  let mal = [], rangos = [], rangosAzar = [];
  for (const s of SEMILLAS) {
    const r = E.eqArmar(AL, { tamanos: T4, sexo: true, nivel: 'parejos', semilla: s });
    r.grupos.forEach(g => [0, 1, 2].forEach(k => {
      const c = g.filter(n => tercio[n] === k).length, e = T[k] * g.length / 43;
      if (c > Math.ceil(e) || c < Math.floor(e)) mal.push([s, k, c, e.toFixed(2)]);
    }));
    const m = E.eqMedir(r.grupos, AL);
    rangos.push(m.nivel.promMax - m.nivel.promMin);
    if (m.nivel.conAlto !== m.equipos) mal.push([s, 'sin alguien de los que van mejor', m.nivel.conAlto]);
    rangosAzar.push((() => { const mm = E.eqMedir(alAzar(AL, T4, s * 7), AL); return mm.nivel.promMax - mm.nivel.promMin; })());
  }
  comprueba('cada equipo tiene de los tres tercios lo que le toca, y todos tienen a alguien de los que van mejor', !mal.length, mal.slice(0, 4));
  const puntos = n => n + (n === 1 ? ' punto' : ' puntos');
  comprueba(`el promedio de los equipos queda junto: ${puntos(mediana(rangos))} de diferencia, contra ${puntos(mediana(rangosAzar))} al azar`,
    mediana(rangos) <= 3 && mediana(rangos) * 4 <= mediana(rangosAzar), { rangos, rangosAzar });
}

console.log('\n── «por nivel»: juntos los que van parecido ──');
{
  let dentro = [], dentroAzar = [];
  for (const s of SEMILLAS) {
    const r = E.eqArmar(AL, { tamanos: T4, sexo: false, nivel: 'nivel', semilla: s });
    dentro.push(E.eqMedir(r.grupos, AL).nivel.rangoMax);
    dentroAzar.push(E.eqMedir(alAzar(AL, T4, s * 7), AL).nivel.rangoMax);
  }
  /* la cuenta de a mano: ordenarlos por nota y cortar de a cuatro */
  const orden = AL.slice().sort((a, b) => b.nivel - a.nivel);
  let p = 0;
  const optimo = E.eqMedir(T4.map(s => { const g = orden.slice(p, p + s).map(a => a.num); p += s; return g; }), AL).nivel.rangoMax;
  comprueba(`sin mirar el sexo, dentro de cada equipo las notas se separan ${mediana(dentro)} puntos (ordenándolos y cortando de a cuatro: ${optimo}; al azar: ${mediana(dentroAzar)})`,
    mediana(dentro) <= optimo + 2 && mediana(dentro) * 3 <= mediana(dentroAzar), { dentro, optimo });
  const conSexo = SEMILLAS.map(s => E.eqMedir(E.eqArmar(AL, { tamanos: T4, sexo: true, nivel: 'nivel', semilla: s }).grupos, AL));
  comprueba(`con niñas y varones también, siguen juntos los parecidos (${mediana(conSexo.map(m => m.nivel.rangoMax))} puntos)`,
    mediana(conSexo.map(m => m.nivel.rangoMax)) * 2 <= mediana(dentroAzar));
  /* el equipo 1 no es el de los que van mejor */
  const primeros = SEMILLAS.map(s => {
    const r = E.eqArmar(AL, { tamanos: T4, sexo: false, nivel: 'nivel', semilla: s });
    const proms = r.grupos.map(g => suma(g.map(n => AL[n - 1].nivel)) / g.length);
    return proms.indexOf(Math.max(...proms));
  });
  comprueba('«por nivel» no numera por nivel: el de promedio más alto no sale siempre de Equipo 1',
    new Set(primeros).size > 3, primeros);
}

console.log('\n── las parejas que se separan quedan separadas ──');
{
  const SEP = [[1, 2], [3, 4], [5, 9], [10, 20], [11, 12], [30, 31]];
  let juntas = 0;
  for (const nivel of ['azar', 'parejos', 'nivel']) {
    for (const s of SEMILLAS) {
      const r = E.eqArmar(AL, { tamanos: T4, sexo: true, nivel, separar: SEP, semilla: s });
      juntas += E.eqMedir(r.grupos, AL, { separar: SEP }).separar.juntas;
    }
  }
  comprueba('seis parejas, tres modos y ocho semillas: ninguna quedó junta', juntas === 0, juntas);
  const r = E.eqArmar(AL, { tamanos: T4, sexo: true, nivel: 'parejos', separar: SEP, semilla: 3 });
  const m = E.eqMedir(r.grupos, AL, { separar: SEP });
  comprueba('y separarlas no desarma lo parejo', m.nivel.promMax - m.nivel.promMin <= 4 && m.sexo.fMax - m.sexo.fMin <= 1, m);
  const uno = E.eqArmar(aula(5), { tamanos: [5], separar: [[1, 2]], semilla: 1 });
  comprueba('con un solo equipo no se puede separar, y se cuenta como junta en vez de callarlo',
    E.eqMedir(uno.grupos, aula(5), { separar: [[1, 2]] }).separar.juntas === 1);
}

console.log('\n── «Armar otros» da otros, y el azar es de verdad azar ──');
{
  const a = E.eqArmar(AL, { tamanos: T4, sexo: true, nivel: 'parejos', semilla: 5 });
  const b = E.eqArmar(AL, { tamanos: T4, sexo: true, nivel: 'parejos', semilla: 5 });
  comprueba('la misma semilla da el mismo reparto (la sonda puede comprobar)', E.eqEscribirReparto(a.grupos) === E.eqEscribirReparto(b.grupos));
  const pares = gs => { const p = new Set(); gs.forEach(g => g.forEach(x => g.forEach(y => { if (x < y) p.add(x + '-' + y); }))); return p; };
  const pa = pares(a.grupos);
  const otros = E.eqArmar(AL, { tamanos: T4, sexo: true, nivel: 'parejos', semilla: 6, antes: a.grupos });
  const repetidos = [...pares(otros.grupos)].filter(x => pa.has(x)).length;
  const sinAntes = mediana(SEMILLAS.map(s => [...pares(E.eqArmar(AL, { tamanos: T4, sexo: true, nivel: 'parejos', semilla: s + 50 }).grupos)].filter(x => pa.has(x)).length));
  comprueba(`«Armar otros» repite ${repetidos} parejas de compañeros de la vez pasada (sin recordarla repetiría ${sinAntes})`,
    repetidos < sinAntes && repetidos <= 3, { repetidos, sinAntes });
  const mo = E.eqMedir(otros.grupos, AL);
  comprueba('y los otros siguen igual de parejos', mo.nivel.promMax - mo.nivel.promMin <= 4 && mo.sexo.fMax - mo.sexo.fMin <= 1, mo);
  const distintos = new Set(SEMILLAS.map(s => E.eqEscribirReparto(E.eqArmar(AL, { tamanos: T4, sexo: true, nivel: 'parejos', semilla: s }).grupos)));
  comprueba('ocho semillas dan ocho repartos distintos', distintos.size === SEMILLAS.length, distintos.size);
}

console.log('\n── lo raro no revienta ──');
{
  const sinDatos = aula(20).map(a => ({ num: a.num, sexo: '', nivel: null }));
  const r = E.eqArmar(sinDatos, { tamanos: E.eqTamanos(20, 'tam', 4), sexo: true, nivel: 'parejos', semilla: 1 });
  comprueba('sin sexo ni notas se reparte igual, al azar', todos(r.grupos).length === 20 && r.grupos.length === 5);
  const m = E.eqMedir(r.grupos, sinDatos);
  comprueba('y la medida no inventa lo que no hay (ni niñas ni promedios)', !m.sexo && !m.nivel, m);
  comprueba('sin alumnos no hay equipos', E.eqArmar([], {}).grupos.length === 0);
  comprueba('un alumno solo queda en un equipo de uno', JSON.stringify(E.eqArmar(aula(1), { semilla: 1 }).grupos) === '[[1]]');
  const t0 = Date.now();
  E.eqArmar(aula(60), { tamanos: E.eqTamanos(60, 'tam', 3), sexo: true, nivel: 'parejos', separar: [[1, 2], [3, 4]], semilla: 2 });
  const ms = Date.now() - t0;
  comprueba(`60 alumnos en equipos de 3 se arman en ${ms} ms (en un teléfono barato, unas cinco veces más)`, ms < 600, ms);
}

console.log('\n── lo guardado ──');
{
  comprueba('el reparto se guarda como UNA cadena y se lee igual',
    JSON.stringify(E.eqLeerReparto(E.eqEscribirReparto([[1, 5, 9], [2, 6]]))) === '[[1,5,9],[2,6]]');
  comprueba('una cadena vacía o rota no revienta', E.eqLeerReparto('').length === 0 && E.eqLeerReparto('|,|x').length === 0);
  const d = { equipos: { reparto: '1,5,9|2,6,10', antes: '1,2|5,6', separar: [[5, 9], [2, 3]], fuera: { f: 'x', nums: [4, 7] } } };
  E.eqRecorrer(d, 5);
  comprueba('al insertar un alumno como #5, los de detrás se recorren en los equipos, las parejas y los que se dejaron fuera',
    d.equipos.reparto === '1,6,10|2,7,11' && d.equipos.antes === '1,2|6,7' &&
    JSON.stringify(d.equipos.separar) === '[[6,10],[2,3]]' && JSON.stringify(d.equipos.fuera.nums) === '[4,8]', d.equipos);
  const vacio = {};
  E.eqRecorrer(vacio, 3);
  comprueba('un grupo sin equipos no se toca', JSON.stringify(vacio) === '{}');
}

console.log('\n── la sugerencia de «alumno de prueba» ──');
{
  const si = ['Alumno de Prueba', 'Josué Test', 'PRUEBA', 'Ejemplo Uno', 'xxx', 'Niño inventado'];
  const no = ['Ada Sarai Sevilla', 'Probanza Reyes', 'Testa Martínez', 'Demóstenes Paz', ''];
  comprueba('sugiere los que dicen que son de prueba', si.every(E.eqPareceDePrueba), si.filter(x => !E.eqPareceDePrueba(x)));
  comprueba('y no acusa a un nombre de verdad que se le parece', !no.some(E.eqPareceDePrueba), no.filter(E.eqPareceDePrueba));
}

console.log(`\n${fallos ? '❌' : '✅'} ${pasan} bien · ${fallos} mal\n`);
process.exit(fallos ? 1 : 0);
