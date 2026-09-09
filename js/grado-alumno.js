/* ══════════════════════════════════════════════════════════════
   EL GRADO DE LA ALUMNA — para que encuentre lo suyo entre 67 tarjetas
   ─────────────────────────────────────────────────────────────
   Medido el 9 de septiembre de 2026, antes de tocar nada: una alumna de
   4º y un alumno de 9º abrían Misiones y veían **exactamente las mismas
   67 tarjetas, en el mismo orden**, sin una sola pista de cuál les toca.
   Las cinco primeras eran Los Adjetivos, Los Verbos, Los Sustantivos,
   Los Pronombres y El Adjetivo Avanzado — que es de Bachillerato— para
   los dos. Y buscar «cuarto» daba **cero resultados**; «4to», cero.

   Cuatro de los cinco recorridos de la auditoría se atascaron ahí, en la
   primera pantalla.

   El dato existía y no se usaba: `js/data/dcnb-map.js` dice en qué grados
   del DCNB entra cada misión, y su cabecera pedía **no usarlo en ninguna
   vista del estudiante** para que ningún niño se sintiera señalado por
   trabajar contenido de un grado inferior. El miedo es legítimo; lo que
   estaba mal era el remedio, porque el precio lo pagaba ella entera:
   esconderle el dato no la protege de nada, la deja perdida.

   **Tres reglas, y son las que quitan el estigma sin quitar la ayuda:**

   1. **Se ORDENA, nunca se filtra.** Lo suyo va primero; lo demás sigue
      ahí, entero y a un dedo de distancia.
   2. **Solo se rotula lo que SÍ es suyo.** Hay un «Para 4º grado» encima
      de sus misiones y **nada** encima de las otras que diga de qué grado
      son. Un «esto es de 2º» es exactamente lo que había que evitar.
   3. **Nunca se adivina.** 47 de las 67 misiones dicen «II y III Ciclo»,
      que vale igual para 4º y para 9º: repartirlas a los seis grados
      pondría 47 tarjetas en todos y el orden no diría nada. Donde no hay
      dato, no hay rótulo.

   Y **no se le pregunta el grado otra vez**: ya lo escribió al entrar en
   su primera misión (`METAS_ALUMNO_V1`). Lo que se guarda aquí es solo
   el chip de la pantalla, en su propia llave, porque `METAS_ALUMNO_V1`
   viaja pegado a cada resultado que llega al maestro y una preferencia
   de vista no tiene por qué entrar ahí.

   Se prueba sin navegador:  node _dev/prueba-grado-alumno.js
══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GRADOS = ['4', '5', '6', '7', '8', '9'];

  /* Como los escribe un niño de nueve años. Se aceptan todas porque el
     buscador también las usa: escriba «cuarto», «4to» o «4º», tiene que
     encontrar lo suyo. */
  var PALABRA = {
    primero: '1', segundo: '2', tercero: '3', cuarto: '4', quinto: '5',
    sexto: '6', septimo: '7', octavo: '8', noveno: '9'
  };

  function sinTildes(s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/[áàäâ]/g, 'a').replace(/[éèëê]/g, 'e').replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o').replace(/[úùüû]/g, 'u').replace(/ñ/g, 'n');
  }

  /* De lo que la alumna escribió a mano —«4», «4º», «4to», «6º-1»,
     «6to A», «cuarto grado», «61»— sale su grado y nada más. Es la misma
     lectura que hace `estParteGrupo` en la pantalla del maestro, y el
     «61» de corrido tampoco es un capricho aquí: así queda «6º-1» cuando
     solo se miran los dígitos, y es lo que llega de verdad. */
  function delTexto(txt) {
    var s = sinTildes(txt).trim();
    if (!s) return '';
    var p = s.match(/\b(primero|segundo|tercero|cuarto|quinto|sexto|septimo|octavo|noveno)\b/);
    if (p) return PALABRA[p[1]];
    var m = s.match(/(\d{1,2})/);
    if (!m) return '';
    var n = m[1];
    if (n.length === 2 && Number(n) > 12) return n.charAt(0);   // «61» = 6º-1
    var v = String(Number(n));
    return (Number(v) >= 1 && Number(v) <= 12) ? v : '';
  }

  /* En qué grados entra una misión. Dos fuentes y ninguna se inventa:
     el mapa del DCNB, que es el que acredita, y el propio campo `grade`
     cuando nombra UN grado —«6º grado»—. Ese segundo caso no es de
     adorno: las Pruebas de Fin de Grado no están en el mapa y son
     justamente las que más le importan a la alumna de ese grado. */
  function gradosDe(m, mapa) {
    var out = {};
    var ent = mapa && m && mapa[m.id];
    if (ent && ent.g) Object.keys(ent.g).forEach(function (g) { out[String(g)] = 1; });
    var d = String((m && m.grade) || '').replace(/\D/g, '');
    if (d.length === 1) out[d] = 1;
    return Object.keys(out).sort();
  }

  function esDe(m, grado, mapa) {
    return !!grado && gradosDe(m, mapa).indexOf(String(grado)) > -1;
  }

  /* Ordenar, NUNCA filtrar: se devuelven los dos montones, y el segundo
     entero y en el orden que traía el catálogo.

     ⚠️ Dentro del suyo NO vale el orden del catálogo, y esto se vio
     midiendo: doce misiones son ESPIRALES —el DCNB retoma la gramática y
     la ortografía los seis años—, están al principio del catálogo, y con
     el orden de siempre lo primero que veían la de 4º y el de 9º volvía a
     ser lo mismo: Los Adjetivos, Los Verbos, Los Sustantivos. La mitad
     del arreglo se perdía justo en la primera pantalla, que es donde se
     atascaron los recorridos.

     Así que primero va **lo más suyo**: cuantos menos grados comparte una
     misión, más arriba. La de 4º empieza por Números Grandes y Valor
     Posicional; el de 9º, por lo suyo. Las espirales siguen dentro de su
     montón —también son suyas—, pero debajo. Y a igualdad de grados manda
     el orden del catálogo, que es el que el autor eligió. */
  function repartir(lista, grado, mapa) {
    var mias = [], demas = [];
    if (!grado) return { mias: [], demas: (lista || []).slice() };
    (lista || []).forEach(function (m, i) {
      if (esDe(m, grado, mapa)) mias.push({ m: m, i: i, n: gradosDe(m, mapa).length });
      else demas.push(m);
    });
    mias.sort(function (a, b) { return (a.n - b.n) || (a.i - b.i); });
    return { mias: mias.map(function (x) { return x.m; }), demas: demas };
  }

  /* Lo que el buscador tiene que encontrar de una misión, además de su
     título: «4», «4º», «4to» y «cuarto». Buscar «cuarto» daba cero. */
  var ORDINAL = { 1: 'primero', 2: 'segundo', 3: 'tercero', 4: 'cuarto', 5: 'quinto',
                  6: 'sexto', 7: 'septimo', 8: 'octavo', 9: 'noveno' };
  var SUFIJO = { 1: '1ro', 2: '2do', 3: '3ro', 4: '4to', 5: '5to',
                 6: '6to', 7: '7mo', 8: '8vo', 9: '9no' };
  function textoBusqueda(m, mapa) {
    var gs = gradosDe(m, mapa);
    if (!gs.length) return '';
    return gs.map(function (g) {
      return g + ' ' + g + 'o ' + (SUFIJO[g] || '') + ' ' + (ORDINAL[g] || '') + ' grado';
    }).join(' ');
  }

  var api = {
    GRADOS: GRADOS, delTexto: delTexto, gradosDe: gradosDe, esDe: esDe,
    repartir: repartir, textoBusqueda: textoBusqueda, sinTildes: sinTildes
  };
  if (typeof window !== 'undefined') window.GradoAlumno = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  return api;
})();
