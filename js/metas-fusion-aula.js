/* ══════════════════════════════════════════════════════════════
   FUSIÓN DE LOS DATOS DEL AULA — dos equipos, ningún trabajo perdido
   ─────────────────────────────────────────────────────────────
   El problema, medido el 9 de septiembre de 2026 con dos equipos de
   verdad: el maestro pasa lista en el teléfono a las 9:00 **sin señal**;
   a las 20:00 pone una nota en la PC; al volver la señal, la
   sincronización comparaba las dos copias ENTERAS y se quedaba con la
   más nueva. Resultado: **la asistencia del día desaparecía**, el
   teléfono ni siquiera llegaba a subirla, y el botón «Recuperar» no
   aparecía porque el aula no estaba vacía. Al revés pasaba lo mismo:
   con el reloj del teléfono adelantado, la que se perdía era la nota.

   Un día de asistencia son 43 nombres que el maestro ya no puede
   reconstruir: no estaba mirando, estaba dando clase.

   Aquí no se elige una copia: se **fusionan las dos**, dato por dato.

   Cómo, y por qué así:

   • **Tres versiones, no dos.** Se guarda también la BASE —lo último
     que las dos copias tuvieron igual—, y con ella se distingue lo que
     alguien AÑADIÓ de lo que el otro todavía no tiene. Sin base solo se
     puede unir, que es lo que hace este archivo cuando no la hay: se
     conserva todo de los dos lados y no se borra nada. Perder un dato
     cuesta mucho más que revivir uno borrado.

   • **Las listas se emparejan por su identidad**, no por su posición.
     Se busca un campo que sea único en la lista —`id`, `f` (la fecha de
     una asistencia), `num` (el número de lista)— y si no hay ninguno se
     usa el CONTENIDO del elemento. Las tomas de lectura no llevan `id`
     y varias caen el mismo día: ahí el contenido es la identidad buena,
     porque nadie edita una toma, se añaden.

   • **Editar gana a borrar.** Si un equipo borró algo y el otro lo
     cambió, se queda lo cambiado. Devolverle al maestro un alumno que
     borró se arregla en dos toques; quitarle una nota que acaba de
     escribir, no.

   • **Y solo cuando los dos cambiaron LO MISMO de forma distinta** manda
     el más reciente. Ahí sí hay que elegir, y es el único sitio donde
     se elige.

   No sabe de aulas ni de notas a propósito: no hay ni un nombre de campo
   del proyecto escrito aquí. Este repositorio crece cada semana y una
   fusión con la lista de campos dentro se queda vieja en la primera
   herramienta nueva —y no daría ningún error: pasaría a perder ese dato
   en silencio, que es justo lo que vino a arreglar.

   Se prueba sin navegador:  node _dev/prueba-fusion-aula.js
══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Campos que pueden servir de identidad en una lista, en orden de
     preferencia. `id` lo ponen las colectas, los controles, la bitácora,
     las convocatorias y los análisis del Plan de Acción; `f` es la fecha
     de un día de asistencia; `num` el número de lista de un alumno. */
  var LLAVES = ['id', 'f', 'num', 'codigo', 'fecha'];

  function esObjeto(x) { return x !== null && typeof x === 'object' && !Array.isArray(x); }
  function igual(a, b) {
    if (a === b) return true;
    try { return JSON.stringify(a) === JSON.stringify(b); } catch (_) { return false; }
  }

  /* ¿Con qué se emparejan los elementos de estas listas? Tiene que valer
     para las TRES versiones a la vez: si una usa `id` y otra no, no se
     pueden emparejar y hay que caer al contenido. */
  function llaveDe(listas) {
    var conDatos = listas.filter(function (l) { return Array.isArray(l) && l.length; });
    if (!conDatos.length) return null;
    var todoObjetos = conDatos.every(function (l) { return l.every(esObjeto); });
    if (!todoObjetos) return null;
    for (var i = 0; i < LLAVES.length; i++) {
      var campo = LLAVES[i];
      var sirve = conDatos.every(function (l) {
        var vistos = {};
        return l.every(function (it) {
          var v = it[campo];
          if (v === undefined || v === null || v === '') return false;
          var s = String(v);
          if (vistos[s]) return false;          // repetido: no identifica
          vistos[s] = 1;
          return true;
        });
      });
      if (sirve) return campo;
    }
    return null;
  }

  /* Una lista se vuelve mapa {identidad: elemento} conservando el orden. */
  function aMapa(lista, campo) {
    var m = { orden: [], por: {} };
    (Array.isArray(lista) ? lista : []).forEach(function (it, i) {
      var k;
      if (campo) k = String(it[campo]);
      else { try { k = JSON.stringify(it); } catch (_) { k = 'i' + i; } }
      if (!(k in m.por)) m.orden.push(k);
      m.por[k] = it;
    });
    return m;
  }

  /* ── el corazón: fusionar un valor cualquiera ──
     base   = lo último que las dos copias tuvieron igual (o undefined)
     local  = lo de este equipo
     remoto = lo que trae la nube
     ganaLocal = a quién se le hace caso cuando los dos cambiaron lo mismo */
  function fusionarValor(base, local, remoto, ganaLocal) {
    /* Nadie tocó nada, o los dos hicieron el mismo cambio */
    if (igual(local, remoto)) return local;
    /* Uno de los dos no se movió de la base: manda el que sí */
    var hayBase = base !== undefined;
    if (hayBase && igual(local, base)) return remoto;
    if (hayBase && igual(remoto, base)) return local;

    /* Los dos cambiaron. Si son listas o mapas, se baja un nivel: casi
       siempre cambiaron COSAS DISTINTAS de dentro, y ahí no hay conflicto
       ninguno —es el caso del hallazgo: una asistencia y una nota—. */
    if (Array.isArray(local) && Array.isArray(remoto)) {
      var campo = llaveDe([base, local, remoto]);
      var mb = aMapa(hayBase && Array.isArray(base) ? base : [], campo);
      var ml = aMapa(local, campo), mr = aMapa(remoto, campo);
      var out = [], puestas = {};
      /* El orden lo pone el más reciente: la lista de clase y las materias
         de la boleta están ordenadas a mano y ese orden es del maestro. */
      var primero = ganaLocal ? ml : mr, segundo = ganaLocal ? mr : ml;
      [primero, segundo].forEach(function (m) {
        m.orden.forEach(function (k) {
          if (puestas[k]) return;
          var v = fusionarEntrada(mb, ml, mr, k, ganaLocal, hayBase);
          puestas[k] = 1;
          if (v !== undefined) out.push(v);
        });
      });
      return out;
    }
    if (esObjeto(local) && esObjeto(remoto)) {
      var ob = esObjeto(base) ? base : {};
      var res = {}, claves = [];
      Object.keys(ganaLocal ? local : remoto).forEach(function (k) { claves.push(k); });
      Object.keys(ganaLocal ? remoto : local).forEach(function (k) { if (claves.indexOf(k) === -1) claves.push(k); });
      Object.keys(ob).forEach(function (k) { if (claves.indexOf(k) === -1) claves.push(k); });
      claves.forEach(function (k) {
        var v = fusionarCampo(
          hayBase && (k in ob) ? ob[k] : undefined, (k in ob) && hayBase,
          local[k], (k in local),
          remoto[k], (k in remoto),
          ganaLocal);
        if (v !== undefined) res[k] = v;
      });
      return res;
    }
    /* Dos valores sueltos distintos: aquí sí hay que elegir, y elige el reloj. */
    return ganaLocal ? local : remoto;
  }

  /* Un campo/elemento que puede FALTAR en alguna de las tres versiones.
     Aquí viven las reglas de borrado, que son las que se pagan caro. */
  function fusionarCampo(vb, enBase, vl, enLocal, vr, enRemoto, ganaLocal) {
    if (enLocal && enRemoto) {
      return fusionarValor(enBase ? vb : undefined, vl, vr, ganaLocal);
    }
    if (enLocal && !enRemoto) {
      if (!enBase) return vl;                   // lo añadió este equipo
      if (igual(vl, vb)) return undefined;      // el otro lo BORRÓ y aquí no cambió
      return vl;                                // el otro lo borró pero aquí se editó: gana editar
    }
    if (!enLocal && enRemoto) {
      if (!enBase) return vr;                   // lo añadió el otro equipo
      if (igual(vr, vb)) return undefined;      // este equipo lo borró
      return vr;
    }
    return undefined;                            // no está en ninguno
  }

  function fusionarEntrada(mb, ml, mr, k, ganaLocal, hayBase) {
    return fusionarCampo(
      mb.por[k], hayBase && (k in mb.por),
      ml.por[k], (k in ml.por),
      mr.por[k], (k in mr.por),
      ganaLocal);
  }

  /* ── la puerta: recibe y devuelve TEXTO, que es como se guarda ──
     Devuelve null si no puede fusionar con garantías (algo no es JSON, o
     los dos lados no son de la misma forma). Quien llama entonces hace lo
     de siempre: nunca se inventa nada. */
  function fusionar(baseRaw, localRaw, remotoRaw, ganaLocal) {
    var b, l, r;
    try {
      l = JSON.parse(localRaw);
      r = JSON.parse(remotoRaw);
      b = (baseRaw == null || baseRaw === '') ? undefined : JSON.parse(baseRaw);
    } catch (_) { return null; }
    if (l === null || r === null) return null;
    if (typeof l !== 'object' || typeof r !== 'object') return null;
    if (Array.isArray(l) !== Array.isArray(r)) return null;
    var out;
    try { out = fusionarValor(b, l, r, !!ganaLocal); } catch (_) { return null; }
    try { return JSON.stringify(out); } catch (_) { return null; }
  }

  var api = { fusionar: fusionar, _fusionarValor: fusionarValor, _llaveDe: llaveDe };
  if (typeof window !== 'undefined') window.MetasFusion = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  return api;
})();
