-- ============================================================
-- M.E.T.A.S · ¿Qué notas inventó el autocompletado de v479?
-- SOLO LECTURA: ninguna consulta de este archivo cambia ni borra nada.
-- ------------------------------------------------------------
-- Qué pasó: v479 se publicó el 10 de noviembre de 2026 a la 1:39 de
-- Honduras (07:39 UTC). Desde ahí, cada vez que un maestro abría Mi aula,
-- la aplicación llenaba sola las celdas vacías de los Parciales I–III
-- (84 de base, nunca menos de 72, S/MB/B en Personalidad), subía las
-- notas del III Parcial menores de 70 y lo mandaba a la nube.
--
-- Cómo se reconoce:
--   1. MARCA: el grupo quedó con "autoRecI_III_v479":1 dentro de su
--      boleta. Viaja en docente_estado (k = 'METAS_ADMIN_V1').
--   2. FECHA: las filas nota_final que cambiaron en registro_admin desde
--      el 2026-11-10 07:39 UTC. Ojo: ahí también están las notas que el
--      maestro escribió de verdad después; la fecha sola no las separa.
--   3. LO PISADO: cuando una nota que ya existía cambió, la anterior se
--      guardó en registro_admin_historial (archivado_en desde esa hora).
--
-- La comparación celda por celda la hace mejor el botón «🔎 Revisar
-- notas que la aplicación puso sola» de Mi aula, que mira la copia de
-- antes del autocompletado. Estas consultas dicen A QUIÉN le pasó y
-- CUÁNTO, para avisarle.
--
-- Orden: se pueden correr en cualquier orden, una por una, en el
-- SQL Editor. Se pueden repetir cuantas veces se quiera.
-- ============================================================


-- 1) Maestros cuya copia en la nube trae la marca del autocompletado
select
  e.codigo,
  d.nombre,
  e.actualizado_en,
  e.dispositivo,
  (length(e.valor->>'raw') - length(replace(e.valor->>'raw', '"autoRecI_III_v479":1', '')))
    / length('"autoRecI_III_v479":1') as grupos_marcados
from public.docente_estado e
left join public.docentes d on d.codigo = e.codigo
where e.k = 'METAS_ADMIN_V1'
  and e.valor->>'raw' like '%"autoRecI_III_v479":1%'
order by e.actualizado_en desc;


-- 2) ¿Hay copia de ANTES en el historial de la nube? (la última anterior
--    a v479, por maestro). Si sale, el botón de revisar la puede usar.
select distinct on (h.codigo)
  h.codigo,
  h.creado_en as copia_de_antes,
  h.origen,
  (h.valor->>'raw' like '%"autoRecI_III_v479":1%') as ya_traia_marca
from public.docente_estado_historial h
where h.k = 'METAS_ADMIN_V1'
  and h.creado_en < timestamptz '2026-11-10 07:39:00+00'
  and h.codigo in (
    select codigo from public.docente_estado
    where k = 'METAS_ADMIN_V1' and valor->>'raw' like '%"autoRecI_III_v479":1%'
  )
order by h.codigo, h.creado_en desc;


-- 3) Cuántas notas cambiaron en la nube de las familias desde v479, por
--    grupo. Las de Personalidad viajan como letra en «estado».
select
  r.docente, r.grado, r.seccion, r.parcial,
  count(*) filter (where r.nota is not null)                    as notas,
  count(*) filter (where r.nota is null and coalesce(r.estado,'') <> '') as personalidad,
  count(*) filter (where r.nota between 72 and 100)             as notas_72_a_100,
  min(r.actualizado_en) as primera,
  max(r.actualizado_en) as ultima
from public.registro_admin r
where r.tipo = 'nota_final'
  and r.parcial in ('I', 'II', 'III')
  and r.actualizado_en >= timestamptz '2026-11-10 07:39:00+00'
group by r.docente, r.grado, r.seccion, r.parcial
order by r.docente, r.grado, r.seccion, r.parcial;


-- 4) Notas que YA EXISTÍAN y se cambiaron desde v479: la de antes y la de hoy.
--    Aquí sale, por ejemplo, el 58 del III Parcial que pasó a 84.
select
  h.docente, h.grado, h.seccion, h.codigo, h.parcial, h.materia,
  coalesce(h.nota::text, h.estado) as antes,
  coalesce(r.nota::text, r.estado) as hoy,
  h.archivado_en
from public.registro_admin_historial h
join public.registro_admin r on r.evento_id = h.evento_id
where h.tipo = 'nota_final'
  and h.parcial in ('I', 'II', 'III')
  and h.archivado_en >= timestamptz '2026-11-10 07:39:00+00'
order by h.docente, h.grado, h.seccion, h.parcial, h.materia, h.codigo;


-- 5) Detalle de un maestro: todas sus notas de I–III tocadas desde v479.
--    Cambia 'PROF-XXXX' por su código.
select
  r.evento_id, r.codigo, r.grado, r.seccion, r.parcial, r.materia,
  r.nota, r.estado, r.actualizado_en,
  exists (select 1 from public.registro_admin_historial h
          where h.evento_id = r.evento_id
            and h.archivado_en >= timestamptz '2026-11-10 07:39:00+00') as piso_una_anterior
from public.registro_admin r
where r.tipo = 'nota_final'
  and r.parcial in ('I', 'II', 'III')
  and r.actualizado_en >= timestamptz '2026-11-10 07:39:00+00'
  and r.docente ilike '%' || 'PROF-XXXX' || '%'
order by r.grado, r.seccion, r.parcial, r.materia, r.codigo;
