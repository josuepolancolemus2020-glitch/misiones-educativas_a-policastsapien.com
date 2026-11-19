/* ============================================================
   M.E.T.A.S · Papelera del chip del centro
   ------------------------------------------------------------
   Comprueba, sin tocar la base real:

     · archivar pone la misma hora al centro, a sus grupos y a
       sus alumnos, y no toca lo de otro docente;
     · recuperar devuelve solo lo que se fue junto;
     · borrar de verdad quita solo filas de ese docente;
     · el último centro no se archiva;
     · lo archivado o borrado no sale en la lista;
     · la pantalla no ofrece «Copiar a Drive» y la papelera no
       va en el último centro.

   Uso:  node _dev/verifica-papelera-chip.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const sql = fs.readFileSync(path.join(RAIZ, 'docs/rediseno-datos/SUPABASE-V2-CENTRO-PAPELERA.sql'), 'utf8');
const aula = fs.readFileSync(path.join(RAIZ, 'js/tools/mi-aula.js'), 'utf8');
const datos = fs.readFileSync(path.join(RAIZ, 'js/datos/datos.js'), 'utf8');
const cola = fs.readFileSync(path.join(RAIZ, 'js/datos/cola.js'), 'utf8');

let fallos = 0;
function ok(nombre, cond, extra) {
  if (!cond) fallos++;
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra == null ? '' : ' → ' + extra));
}
function palabras(s) {
  return String(s).replace(/[¿?¡!.,:]/g, ' ').trim().split(/\s+/).filter(Boolean);
}

/* ── El mismo trato que el SQL, en memoria ──────────────────── */
function modelo() {
  return {
    centros: [
      { id: 'cook', owner: 'A', nombre: 'María Consuel', deleted_at: null },
      { id: 'liceo', owner: 'A', nombre: 'Liceo', deleted_at: null },
      { id: 'ovidio', owner: 'B', nombre: 'Ovidio', deleted_at: null },
    ],
    aulas: [
      { id: 'g1', owner: 'A', centro_id: 'cook', deleted_at: null },
      { id: 'gViejo', owner: 'A', centro_id: 'cook', deleted_at: 'antes' },
      { id: 'gB', owner: 'B', centro_id: 'ovidio', deleted_at: null },
    ],
    alumnos: [
      { id: 's1', owner: 'A', aula_id: 'g1', deleted_at: null },
      { id: 'sB', owner: 'B', aula_id: 'gB', deleted_at: null },
    ],
    notas: [
      { id: 'n1', owner: 'A', aula_id: 'g1' },
      { id: 'nB', owner: 'B', aula_id: 'gB' },
    ],
  };
}
function vivos(filas, owner) {
  return filas.filter(function (f) { return f.owner === owner && !f.deleted_at; });
}
function archivar(db, uid, id) {
  const mios = vivos(db.centros, uid);
  const centro = mios.filter(function (c) { return c.id === id; })[0];
  if (!centro) return { ok: false, motivo: 'ajeno' };
  if (mios.length < 2) return { ok: false, motivo: 'ultimo' };
  const hora = 'junto';
  const aulasVivas = db.aulas.filter(function (a) {
    return a.owner === uid && a.centro_id === id && !a.deleted_at;
  }).map(function (a) { return a.id; });
  db.alumnos.forEach(function (al) {
    if (al.owner === uid && !al.deleted_at && aulasVivas.indexOf(al.aula_id) >= 0) al.deleted_at = hora;
  });
  db.aulas.forEach(function (a) {
    if (a.owner === uid && a.centro_id === id && !a.deleted_at) a.deleted_at = hora;
  });
  centro.deleted_at = hora;
  return { ok: true, hora: hora };
}
function recuperar(db, uid, id) {
  const centro = db.centros.filter(function (c) { return c.id === id && c.owner === uid && c.deleted_at; })[0];
  if (!centro) return { ok: false, motivo: 'ajeno' };
  const hora = centro.deleted_at;
  centro.deleted_at = null;
  db.aulas.forEach(function (a) {
    if (a.owner === uid && a.centro_id === id && a.deleted_at === hora) a.deleted_at = null;
  });
  const aulas = db.aulas.filter(function (a) { return a.owner === uid && a.centro_id === id; }).map(function (a) { return a.id; });
  db.alumnos.forEach(function (al) {
    if (al.owner === uid && al.deleted_at === hora && aulas.indexOf(al.aula_id) >= 0) al.deleted_at = null;
  });
  return { ok: true };
}
function borrar(db, uid, id) {
  const centro = db.centros.filter(function (c) { return c.id === id && c.owner === uid; })[0];
  if (!centro) return { ok: false, motivo: 'ajeno' };
  const aulas = db.aulas.filter(function (a) { return a.owner === uid && a.centro_id === id; }).map(function (a) { return a.id; });
  function fuera(f) {
    return f.owner === uid && (f.id === id || aulas.indexOf(f.aula_id) >= 0 || aulas.indexOf(f.id) >= 0);
  }
  ['notas', 'alumnos', 'aulas', 'centros'].forEach(function (tabla) {
    db[tabla] = db[tabla].filter(function (f) { return !fuera(f); });
  });
  return { ok: true };
}
function lista(filas, owner) {
  return filas.filter(function (f) { return f.owner === owner && !f.deleted_at; }).map(function (f) { return f.id; });
}

const db = modelo();
ok('archivar el de otro docente no cambia nada', archivar(db, 'A', 'ovidio').ok === false && db.centros.some(function (c) { return c.id === 'ovidio' && !c.deleted_at; }));
const uno = archivar(db, 'A', 'cook');
ok('archivar en cascada marca centro, grupo y alumno con la misma hora', uno.ok
  && db.centros.filter(function (c) { return c.id === 'cook'; })[0].deleted_at === 'junto'
  && db.aulas.filter(function (a) { return a.id === 'g1'; })[0].deleted_at === 'junto'
  && db.alumnos.filter(function (a) { return a.id === 's1'; })[0].deleted_at === 'junto');
ok('un grupo archivado de antes no cambia de hora', db.aulas.filter(function (a) { return a.id === 'gViejo'; })[0].deleted_at === 'antes');
ok('el otro centro del docente sigue vivo', lista(db.centros, 'A').indexOf('liceo') >= 0);
ok('lo del otro docente sigue en su lista', lista(db.centros, 'B').indexOf('ovidio') >= 0 && lista(db.aulas, 'B').indexOf('gB') >= 0);
ok('lo archivado no sale en la lista', lista(db.centros, 'A').indexOf('cook') < 0
  && lista(db.aulas, 'A').indexOf('g1') < 0 && lista(db.alumnos, 'A').indexOf('s1') < 0);

ok('recuperar devuelve el centro, su grupo y su alumno', recuperar(db, 'A', 'cook').ok
  && !db.centros.filter(function (c) { return c.id === 'cook'; })[0].deleted_at
  && !db.aulas.filter(function (a) { return a.id === 'g1'; })[0].deleted_at
  && !db.alumnos.filter(function (a) { return a.id === 's1'; })[0].deleted_at);
ok('recuperar no revive lo que ya estaba archivado', db.aulas.filter(function (a) { return a.id === 'gViejo'; })[0].deleted_at === 'antes');
ok('recuperar el centro de otro no toca nada', recuperar(db, 'A', 'ovidio').ok === false);

archivar(db, 'A', 'cook');
ok('el último centro no se archiva', archivar(db, 'A', 'liceo').motivo === 'ultimo' && !db.centros.filter(function (c) { return c.id === 'liceo'; })[0].deleted_at);

ok('borrar quita el centro y lo que cuelga, y deja lo demás', borrar(db, 'A', 'cook').ok
  && !db.centros.some(function (c) { return c.id === 'cook'; })
  && !db.aulas.some(function (a) { return a.id === 'g1' || a.id === 'gViejo'; })
  && !db.alumnos.some(function (a) { return a.id === 's1'; })
  && !db.notas.some(function (n) { return n.id === 'n1'; })
  && db.centros.some(function (c) { return c.id === 'liceo'; })
  && db.centros.some(function (c) { return c.id === 'ovidio'; })
  && db.notas.some(function (n) { return n.id === 'nB'; }));
ok('borrar el centro de otro no quita nada', borrar(db, 'A', 'ovidio').ok === false && db.aulas.some(function (a) { return a.id === 'gB'; }));
ok('lo borrado no sale en la lista', lista(db.centros, 'A').indexOf('cook') < 0);

/* ── El SQL dice lo mismo ────────────────────────────────────── */
ok('hay tres funciones del centro', /function metas\.centro_archivar\(/.test(sql)
  && /function metas\.centro_volver\(/.test(sql) && /function metas\.centro_borrar\(/.test(sql));
ok('corren como dueño y exigen docente', /security definer/.test(sql) && /metas\.es_docente\(\)/.test(sql) && /auth\.uid\(\)/.test(sql));
ok('el último centro se niega en la base', /v_n < 2/.test(sql) && /MT040/.test(sql));
ok('archivar toca alumnos, grupos y centro del mismo dueño',
  /update metas\.alumnos[\s\S]*owner = v_uid/.test(sql)
  && /update metas\.aulas[\s\S]*owner = v_uid and centro_id = p_centro/.test(sql)
  && /update metas\.centros[\s\S]*owner = v_uid/.test(sql));
ok('recuperar solo la misma hora', /deleted_at = v_hora/.test(sql));
ok('se cierra el execute público', /revoke execute on all functions in schema metas from public/.test(sql));

sql.split(/delete from metas\./i).slice(1).forEach(function (trozo) {
  const tabla = trozo.split(/[\s(]/)[0];
  const cuerpo = trozo.split(';')[0];
  ok('delete de ' + tabla + ' se queda en el docente', /owner = v_uid/.test(cuerpo));
});

/* ── La pantalla ─────────────────────────────────────────────── */
ok('la papelera no sale en el último centro', /centros\.length > 1/.test(aula) && /ma-basura/.test(aula));
ok('el lector dice archivar o borrar', /Archivar o borrar /.test(aula));
ok('no está el botón de Drive', !/Copiar a Drive/.test(aula));
ok('el segundo aviso pide BORRAR', /Escribe BORRAR para confirmar/.test(aula));
ok('hay Archivar y Borrar para siempre', /papelera-archivar/.test(aula) && /Borrar para siempre/.test(aula));
ok('Archivados ofrece Recuperar y borrar', /recuperar-centro/.test(aula) && /borrar-archivado/.test(aula));
ok('la barra del centro no lleva texto', /data-metas="centro-listo"[\s\S]*aria-label="Listo"/.test(aula)
  && /centro-listo"[\s\S]{0,180}ma-barra-ok-linea/.test(aula));

['Puedes recuperarlo luego.', 'Aviso 1 de 2', 'Aviso 2 de 2', 'No se puede deshacer. Escribe BORRAR para confirmar.',
  'Sin señal. No se cambió nada.', 'Borrar para siempre', 'Archivar', 'Seguir', 'Cancelar'].forEach(function (frase) {
  ok('«' + frase + '» cabe en 12 palabras', palabras(frase).length <= 12 && aula.indexOf(frase) >= 0, palabras(frase).length);
});
ok('la frase con un grupo cabe', palabras('¿Archivar María Consuel y su grupo 7º-1?').length <= 12);
ok('la frase de borrar cabe', palabras('Se borrarán María Consuel, 1 grupo y 0 alumnos.').length <= 12);
ok('la pantalla arma la frase del grupo y la del borrado', /y su grupo /.test(aula) && /Se borrarán /.test(aula) && /'1 grupo'/.test(aula));

ok('archivar el chip no esconde nada hasta que la base contesta',
  /function mandarCentro\(/.test(datos) && !/case 'centro_archivar'/.test(datos.slice(datos.indexOf('function aplicar'), datos.indexOf('function tabla'))));
ok('si la función no está, el aviso dice que la base no puede', /PGRST202': return 'la base todavía no puede'/.test(cola));
ok('borrar de verdad quita la copia local solo después del ok', /op\.tipo === 'centro_borrar'\) olvidarArbol/.test(cola));
ok('la lista no muestra filas con deleted_at', /if \(!f\.deleted_at\) mapa\.set/.test(datos));

console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ La papelera del chip queda cubierta');
process.exit(fallos ? 1 : 0);
