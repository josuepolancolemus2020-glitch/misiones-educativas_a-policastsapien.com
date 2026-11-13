-- ============================================================
-- M.E.T.A.S — CONSULTA: pagos y gastos de colecta que se PERDIERON
-- en el último mes. SOLO LEE: no cambia, no borra, no devuelve nada.
-- Pegar COMPLETO en el SQL Editor de Supabase → Run.
--
-- Compara cada copia del aula guardada en la nube en los últimos 31
-- días (public.docente_estado_hist) con el aula de HOY
-- (public.docente_estado) y lista lo que estaba en alguna copia y hoy
-- falta, con el nombre del alumno y la última vez que se vio.
--
-- Para encontrar al maestro sin saber su código, se busca una PALABRA
-- de alguna de sus colectas. Cámbiala en la línea marcada con ◀◀◀.
--
-- La devolución se hace en la app (🔎 Buscar pagos o gastos perdidos →
-- ☁️ Buscar también en el historial de la nube → marcar → ↩️ Devolver),
-- que solo AÑADE lo que falta y no pisa nada de lo que hay.
-- ============================================================

with yo as (
  select d.codigo
  from public.docente_estado d
  where d.k = 'METAS_ADMIN_V1'
    and d.valor->>'raw' ilike '%' || 'pupitre' || '%'          -- ◀◀◀ palabra de una colecta
),
hoy as (
  select d.codigo, (d.valor->>'raw')::jsonb as j
  from public.docente_estado d join yo using (codigo)
  where d.k = 'METAS_ADMIN_V1' and left(coalesce(d.valor->>'raw', ''), 1) = '{'
),
copias as (
  select h.codigo, h.guardado_en as cuando, (h.valor->>'raw')::jsonb as j
  from public.docente_estado_hist h join yo using (codigo)
  where h.k = 'METAS_ADMIN_V1'
    and h.guardado_en > now() - interval '31 days'
    and left(coalesce(h.valor->>'raw', ''), 1) = '{'
),
-- pagos: uno por alumno y colecta
pagos_copia as (
  select c.codigo, c.cuando, g->>'id' as gid,
         concat_ws('-', nullif(g->>'grado', ''), nullif(g->>'seccion', '')) as grupo,
         col->>'id' as cid, col->>'concepto' as colecta,
         p.key as num, p.value #>> '{}' as monto, col->'pagosF'->>p.key as fecha_pago,
         (select a->>'nombre' from jsonb_array_elements(coalesce(g->'lista', '[]')) a
           where a->>'num' = p.key limit 1) as alumno
  from copias c
  cross join lateral jsonb_array_elements(coalesce(c.j->'grupos', '[]')) g
  cross join lateral jsonb_array_elements(coalesce(g->'colectas', '[]')) col
  cross join lateral jsonb_each(case when jsonb_typeof(col->'pagos') = 'object' then col->'pagos' else '{}' end) p
  where jsonb_typeof(p.value) in ('number', 'string') and p.value #>> '{}' <> ''
),
pagos_hoy as (
  select h.codigo, g->>'id' as gid, col->>'id' as cid, p.key as num
  from hoy h
  cross join lateral jsonb_array_elements(coalesce(h.j->'grupos', '[]')) g
  cross join lateral jsonb_array_elements(coalesce(g->'colectas', '[]')) col
  cross join lateral jsonb_each(case when jsonb_typeof(col->'pagos') = 'object' then col->'pagos' else '{}' end) p
  where jsonb_typeof(p.value) in ('number', 'string') and p.value #>> '{}' <> ''
),
colectas_hoy as (
  select h.codigo, g->>'id' as gid, col->>'id' as cid
  from hoy h
  cross join lateral jsonb_array_elements(coalesce(h.j->'grupos', '[]')) g
  cross join lateral jsonb_array_elements(coalesce(g->'colectas', '[]')) col
),
-- gastos: por su id, o por descripción + monto + fecha si no tiene
gastos_copia as (
  select c.codigo, c.cuando, g->>'id' as gid,
         concat_ws('-', nullif(g->>'grado', ''), nullif(g->>'seccion', '')) as grupo,
         col->>'id' as cid, col->>'concepto' as colecta,
         coalesce(gs->>'id', lower(trim(gs->>'d')) || '|' || (gs->>'m') || '|' || coalesce(gs->>'f', '')) as llave,
         gs->>'d' as descripcion, gs->>'m' as monto, gs->>'f' as fecha
  from copias c
  cross join lateral jsonb_array_elements(coalesce(c.j->'grupos', '[]')) g
  cross join lateral jsonb_array_elements(coalesce(g->'colectas', '[]')) col
  cross join lateral jsonb_array_elements(case when jsonb_typeof(col->'gastos') = 'array' then col->'gastos' else '[]' end) gs
),
gastos_hoy as (
  select h.codigo, g->>'id' as gid, col->>'id' as cid,
         coalesce(gs->>'id', lower(trim(gs->>'d')) || '|' || (gs->>'m') || '|' || coalesce(gs->>'f', '')) as llave
  from hoy h
  cross join lateral jsonb_array_elements(coalesce(h.j->'grupos', '[]')) g
  cross join lateral jsonb_array_elements(coalesce(g->'colectas', '[]')) col
  cross join lateral jsonb_array_elements(case when jsonb_typeof(col->'gastos') = 'array' then col->'gastos' else '[]' end) gs
),
perdidos as (
  select distinct on (pc.codigo, pc.gid, pc.cid, pc.num)
    'PAGO' as que, pc.codigo, pc.grupo, pc.colecta,
    '#' || pc.num || ' ' || coalesce(pc.alumno, '') as detalle,
    pc.monto, pc.fecha_pago as fecha, pc.cuando as visto_por_ultima_vez,
    exists (select 1 from colectas_hoy ch where ch.codigo = pc.codigo and ch.gid = pc.gid and ch.cid = pc.cid) as colecta_sigue
  from pagos_copia pc
  where not exists (select 1 from pagos_hoy ph
                    where ph.codigo = pc.codigo and ph.gid = pc.gid and ph.cid = pc.cid and ph.num = pc.num)
  order by pc.codigo, pc.gid, pc.cid, pc.num, pc.cuando desc
),
gastos_perdidos as (
  select distinct on (gc.codigo, gc.gid, gc.cid, gc.llave)
    'GASTO' as que, gc.codigo, gc.grupo, gc.colecta, gc.descripcion as detalle,
    gc.monto, gc.fecha, gc.cuando as visto_por_ultima_vez,
    exists (select 1 from colectas_hoy ch where ch.codigo = gc.codigo and ch.gid = gc.gid and ch.cid = gc.cid) as colecta_sigue
  from gastos_copia gc
  where not exists (select 1 from gastos_hoy gh
                    where gh.codigo = gc.codigo and gh.gid = gc.gid and gh.cid = gc.cid and gh.llave = gc.llave)
  order by gc.codigo, gc.gid, gc.cid, gc.llave, gc.cuando desc
)
select x.que, x.codigo as maestro, dc.nombre as nombre_maestro, x.grupo, x.colecta,
       x.detalle, x.monto, x.fecha, x.visto_por_ultima_vez, x.colecta_sigue
from (select * from perdidos union all select * from gastos_perdidos) x
left join public.docentes dc on dc.codigo = x.codigo
order by x.grupo, x.colecta, x.que, x.detalle;

-- Cómo leerlo:
--   · Sin filas y sin error: en el último mes no se perdió ningún pago ni
--     gasto en la nube. Si un pago se anotó en un teléfono que no llegó a
--     subirlo, búscalo con 🔎 en ESE teléfono (revisa sus copias locales).
--   · colecta_sigue = false: la colecta entera ya no existe (se eliminó).
--     La app no revive colectas borradas; avísame si te sale así.
--   · Error «relation docente_estado_hist does not exist»: el historial de
--     la nube no estaba instalado y no hay copias que revisar.
