-- ============================================================
-- M.E.T.A.S — Supabase: HISTORIAL DE VERSIONES Y RECUPERACIÓN INTEGRAL (I–III PARCIAL)
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run.
-- Es IDEMPOTENTE: se puede correr varias veces sin dañar nada.
--
-- Qué resuelve y agrega:
--   1) Tabla public.docente_estado_historial + Trigger automático:
--      Cada vez que cambia METAS_ADMIN_V1, METAS_PLANACCION_V1,
--      METAS_CODIGOS_V1 o METAS_AVISOS_V1 en public.docente_estado,
--      se guarda automáticamente una copia histórica (hasta 40 versiones
--      por docente y clave) antes de sobrescribir.
--   2) Tabla public.registro_admin_historial + Trigger automático:
--      Antes de modificar o anular cualquier nota, personalidad o
--      inasistencia en public.registro_admin, conserva la versión previa.
--   3) Auto-reparación de filas ADN- anuladas en public.registro_admin:
--      Restaura año lectivo, parcial (I–IV) y materia a partir del
--      evento_id ('ADN-2026-III-espanol-...') en filas que quedaron
--      con parcial/materia en NULL por sincronizaciones previas.
--   4) Blindaje de public.metas_guardar_admin:
--      Impide que una sincronización con celdas vacías borre notas,
--      personalidad o inasistencias ya subidas a la nube, salvo que
--      el docente envíe explícitamente la marca de borrado ('borrar': true).
--   5) RPC public.metas_docente_historial_listar(p_codigo, p_clave, p_k):
--      Permite a la app consultar todas las versiones disponibles
--      (estado actual, papelera sin consumirla e historial de versiones).
--   6) RPC public.metas_recuperar_admin_docente(p_prof, p_clave):
--      Devuelve todas las filas de registro_admin y registro_admin_historial
--      del docente (incluyendo evento_id) para recuperar notas,
--      personalidad y días perdidos de todos los parciales.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1) HISTORIAL DE VERSIONES DEL ESTADO DOCENTE (docente_estado_historial)
-- ────────────────────────────────────────────────────────────
create table if not exists public.docente_estado_historial (
  id bigint generated always as identity primary key,
  codigo text not null,
  k text not null,
  valor jsonb,
  version bigint not null default 0,
  dispositivo text,
  origen text not null default 'auto',
  creado_en timestamptz not null default now()
);
alter table public.docente_estado_historial enable row level security;

create index if not exists idx_docente_estado_hist_cod_k
  on public.docente_estado_historial (codigo, k, creado_en desc);

create or replace function public._metas_archivar_docente_estado()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_raw_old text := coalesce(old.valor->>'raw', '');
  v_raw_new text := case when tg_op = 'UPDATE' then coalesce(new.valor->>'raw', '') else '' end;
begin
  -- Solo archivar claves críticas del aula cuando tenían contenido real y cambiaron
  if v_raw_old <> '' and v_raw_old <> v_raw_new
     and old.k in ('METAS_ADMIN_V1', 'METAS_PLANACCION_V1', 'METAS_CODIGOS_V1', 'METAS_AVISOS_V1') then
    insert into public.docente_estado_historial (codigo, k, valor, version, dispositivo, origen, creado_en)
    values (
      old.codigo,
      old.k,
      old.valor,
      coalesce(old.version, 0),
      coalesce(old.dispositivo, ''),
      case when tg_op = 'DELETE' then 'delete' else 'update' end,
      coalesce(old.actualizado_en, now())
    );
    -- Conservar las últimas 40 versiones por (codigo, k)
    delete from public.docente_estado_historial h
    where h.codigo = old.codigo
      and h.k = old.k
      and h.id not in (
        select h2.id
        from public.docente_estado_historial h2
        where h2.codigo = old.codigo and h2.k = old.k
        order by h2.creado_en desc, h2.id desc
        limit 40
      );
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end
$$;

drop trigger if exists trg_docente_estado_historial on public.docente_estado;
create trigger trg_docente_estado_historial
  before update or delete on public.docente_estado
  for each row execute function public._metas_archivar_docente_estado();

-- Semilla inicial: copiar a docente_estado_historial lo que hoy esté en
-- docente_estado_papelera (si existe) para que nunca se pierda al restaurar
do $$
begin
  if to_regclass('public.docente_estado_papelera') is not null then
    insert into public.docente_estado_historial (codigo, k, valor, version, dispositivo, origen, creado_en)
    select p.codigo, p.k, p.valor, coalesce(p.version, 0), 'papelera', 'papelera_inicial', coalesce(p.archivado_en, now())
    from public.docente_estado_papelera p
    where coalesce(p.valor->>'raw', '') <> ''
      and not exists (
        select 1 from public.docente_estado_historial h
        where h.codigo = p.codigo and h.k = p.k and h.version = p.version
      );
  end if;
end $$;


-- ────────────────────────────────────────────────────────────
-- 2) HISTORIAL DE FILAS DE REGISTRO_ADMIN (registro_admin_historial)
-- ────────────────────────────────────────────────────────────
create table if not exists public.registro_admin_historial (
  id bigint generated always as identity primary key,
  evento_id text not null,
  codigo text not null,
  tipo text not null,
  fecha date,
  estado text,
  parcial text,
  materia text,
  nota numeric,
  concepto text,
  monto numeric,
  grado text,
  seccion text,
  docente text,
  anio_lectivo text,
  actualizado_en timestamptz,
  archivado_en timestamptz not null default now()
);
alter table public.registro_admin_historial enable row level security;

create index if not exists idx_registro_admin_hist_codigo
  on public.registro_admin_historial (codigo, archivado_en desc);
create index if not exists idx_registro_admin_hist_evento
  on public.registro_admin_historial (evento_id, archivado_en desc);

create or replace function public._metas_archivar_registro_admin()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  -- Si la fila anterior tenía nota o estado (ej. personalidad o asistencia) y va a cambiar o borrarse, archivarla
  if (old.nota is not null or coalesce(old.estado, '') <> '')
     and (tg_op = 'DELETE'
          or old.nota is distinct from new.nota
          or old.estado is distinct from new.estado
          or old.parcial is distinct from new.parcial
          or old.materia is distinct from new.materia) then
    insert into public.registro_admin_historial
      (evento_id, codigo, tipo, fecha, estado, parcial, materia, nota,
       concepto, monto, grado, seccion, docente, anio_lectivo, actualizado_en, archivado_en)
    values
      (old.evento_id, old.codigo, old.tipo, old.fecha, old.estado, old.parcial, old.materia, old.nota,
       old.concepto, old.monto, old.grado, old.seccion, old.docente, old.anio_lectivo, old.actualizado_en, now());
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end
$$;

drop trigger if exists trg_registro_admin_historial on public.registro_admin;
create trigger trg_registro_admin_historial
  before update or delete on public.registro_admin
  for each row execute function public._metas_archivar_registro_admin();


-- ────────────────────────────────────────────────────────────
-- 3) AUTO-REPARACIÓN DE FILAS ADN- ANULADAS EN REGISTRO_ADMIN
--    Recupera parcial, año lectivo y nombre de materia/rasgo desde
--    el evento_id ('ADN-2026-III-espanol-269GW3') cuando fueron
--    puestos en NULL por una anulación automática previa.
-- ────────────────────────────────────────────────────────────
update public.registro_admin r
set
  anio_lectivo = coalesce(nullif(r.anio_lectivo, ''), substring(r.evento_id from '^ADN-(\d{4})-')),
  parcial = coalesce(
    nullif(r.parcial, ''),
    substring(r.evento_id from '^ADN-\d{4}-(I|II|III|IV)-'),
    substring(r.evento_id from '^ADN-(I|II|III|IV)-')
  ),
  materia = coalesce(
    nullif(r.materia, ''),
    case coalesce(
      substring(r.evento_id from '^ADN-\d{4}-(?:I|II|III|IV)-(.+)-[A-Z0-9]+$'),
      substring(r.evento_id from '^ADN-(?:I|II|III|IV)-(.+)-[A-Z0-9]+$')
    )
      when 'espanol' then 'Español'
      when 'matematicas' then 'Matemáticas'
      when 'ciencias-naturales' then 'Ciencias Naturales'
      when 'ciencias-sociales' then 'Ciencias Sociales'
      when 'ingles' then 'Inglés'
      when 'educacion-artistica' then 'Educación Artística'
      when 'educacion-fisica' then 'Educación Física'
      when 'educacion-civica' then 'Educación Cívica'
      when 'puntualidad' then 'Puntualidad'
      when 'espiritu-de-trabajo' then 'Espíritu de trabajo'
      when 'orden-y-presentacion' then 'Orden y presentación'
      when 'sociabilidad' then 'Sociabilidad'
      when 'moralidad' then 'Moralidad'
      when 'inasistencias' then 'Inasistencias'
      else coalesce(
        substring(r.evento_id from '^ADN-\d{4}-(?:I|II|III|IV)-(.+)-[A-Z0-9]+$'),
        substring(r.evento_id from '^ADN-(?:I|II|III|IV)-(.+)-[A-Z0-9]+$')
      )
    end
  )
where r.tipo = 'nota_final'
  and (r.parcial is null or r.materia is null)
  and r.evento_id like 'ADN-%';


-- ────────────────────────────────────────────────────────────
-- 4) BLINDAJE DE metas_guardar_admin
--    Nunca vuelve a pisar parcial/materia con NULL y protege las
--    notas/personalidad/inasistencias existentes frente a envíos vacíos
--    accidentales (salvo borrado explícito con "borrar": true).
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_guardar_admin(p_prof text, p_clave text, filas jsonb)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  n integer := 0;
  f jsonb;
  v_borrar boolean;
begin
  if not public._metas_docente_ok(p_prof, p_clave) then return -1; end if;
  if jsonb_typeof(filas) <> 'array' or jsonb_array_length(filas) > 300 then
    return 0;
  end if;
  for f in select * from jsonb_array_elements(filas) loop
    begin
      if coalesce(f->>'evento_id','') = '' or coalesce(f->>'codigo','') = ''
         or coalesce(f->>'tipo','') = '' then
        continue;
      end if;
      v_borrar := coalesce((f->>'borrar')::boolean, false);
      insert into public.registro_admin
        (evento_id, codigo, tipo, fecha, estado, parcial, materia, nota,
         concepto, monto, grado, seccion, docente, anio_lectivo)
      values (
        f->>'evento_id',
        upper(regexp_replace(coalesce(f->>'codigo',''), '\s', '', 'g')),
        f->>'tipo',
        nullif(f->>'fecha','')::date,
        f->>'estado',
        nullif(f->>'parcial',''),
        nullif(f->>'materia',''),
        nullif(f->>'nota','')::numeric,
        f->>'concepto',
        nullif(f->>'monto','')::numeric,
        f->>'grado', f->>'seccion', f->>'docente', f->>'anio_lectivo'
      )
      on conflict (evento_id) do update set
        codigo = excluded.codigo,
        fecha = coalesce(excluded.fecha, public.registro_admin.fecha),
        parcial = coalesce(nullif(excluded.parcial, ''), public.registro_admin.parcial),
        materia = coalesce(nullif(excluded.materia, ''), public.registro_admin.materia),
        nota = case
          when public.registro_admin.tipo = 'nota_final' and not v_borrar and excluded.nota is null
            then public.registro_admin.nota
          else excluded.nota
        end,
        estado = case
          when public.registro_admin.tipo = 'nota_final' and not v_borrar
               and coalesce(excluded.estado, '') = '' and excluded.nota is null
            then public.registro_admin.estado
          else excluded.estado
        end,
        concepto = coalesce(excluded.concepto, public.registro_admin.concepto),
        monto = coalesce(excluded.monto, public.registro_admin.monto),
        grado = coalesce(nullif(excluded.grado, ''), public.registro_admin.grado),
        seccion = coalesce(nullif(excluded.seccion, ''), public.registro_admin.seccion),
        docente = coalesce(nullif(excluded.docente, ''), public.registro_admin.docente),
        anio_lectivo = coalesce(nullif(excluded.anio_lectivo, ''), public.registro_admin.anio_lectivo),
        actualizado_en = now();
      n := n + 1;
    exception when others then
      null;
    end;
  end loop;
  return n;
end
$$;
revoke all on function public.metas_guardar_admin(text,text,jsonb) from public;
grant execute on function public.metas_guardar_admin(text,text,jsonb) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 5) RPC: LISTAR HISTORIAL DE VERSIONES DEL DOCENTE (sin destruir papelera)
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_docente_historial_listar(
  p_codigo text, p_clave text, p_k text default 'METAS_ADMIN_V1'
) returns table (
  id bigint,
  origen text,
  k text,
  valor jsonb,
  version bigint,
  dispositivo text,
  creado_en timestamptz
)
language plpgsql security definer stable set search_path = public
as $$
declare
  cod text := upper(trim(coalesce(p_codigo,'')));
  clave_k text := coalesce(nullif(trim(p_k), ''), 'METAS_ADMIN_V1');
begin
  if not public._metas_docente_ok(cod, p_clave) then
    return;
  end if;

  -- 1. Estado vivo actual en la nube
  return query
    select
      0::bigint as id,
      'nube_actual'::text as origen,
      d.k,
      d.valor,
      d.version,
      coalesce(d.dispositivo, 'nube') as dispositivo,
      d.actualizado_en as creado_en
    from public.docente_estado d
    where d.codigo = cod
      and (clave_k = '*' or d.k = clave_k or d.k = 'METAS_CODIGOS_V1')
      and coalesce(d.valor->>'raw', '') <> '';

  -- 2. Papelera en la nube (sin consumirla ni borrarla)
  if to_regclass('public.docente_estado_papelera') is not null then
    return query
      select
        (-1)::bigint as id,
        'papelera_nube'::text as origen,
        p.k,
        p.valor,
        p.version,
        'papelera'::text as dispositivo,
        p.archivado_en as creado_en
      from public.docente_estado_papelera p
      where p.codigo = cod
        and (clave_k = '*' or p.k = clave_k or p.k = 'METAS_CODIGOS_V1')
        and coalesce(p.valor->>'raw', '') <> '';
  end if;

  -- 3. Historial automático de versiones en la nube
  if to_regclass('public.docente_estado_historial') is not null then
    return query
      select
        h.id,
        ('historial_' || coalesce(h.origen, 'auto'))::text as origen,
        h.k,
        h.valor,
        h.version,
        coalesce(h.dispositivo, '') as dispositivo,
        h.creado_en
      from public.docente_estado_historial h
      where h.codigo = cod
        and (clave_k = '*' or h.k = clave_k or h.k = 'METAS_CODIGOS_V1')
        and coalesce(h.valor->>'raw', '') <> ''
      order by h.creado_en desc, h.id desc
      limit 40;
  end if;
end
$$;
revoke all on function public.metas_docente_historial_listar(text,text,text) from public;
grant execute on function public.metas_docente_historial_listar(text,text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 6) RPC: RECUPERAR TODAS LAS FILAS DE REGISTRO_ADMIN DEL DOCENTE
--    Devuelve tanto las filas activas como las archivadas en
--    registro_admin_historial (con su evento_id completo).
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_recuperar_admin_docente(
  p_prof text, p_clave text
) returns table (
  evento_id text,
  codigo text,
  tipo text,
  fecha date,
  estado text,
  parcial text,
  materia text,
  nota numeric,
  concepto text,
  monto numeric,
  grado text,
  seccion text,
  docente text,
  anio_lectivo text,
  actualizado_en timestamptz,
  es_historial boolean
)
language plpgsql security definer stable set search_path = public
as $$
declare
  v_cod text := upper(trim(coalesce(p_prof,'')));
  v_nombre text;
  v_norm text;
begin
  if not public._metas_docente_ok(v_cod, p_clave) then
    return;
  end if;
  select d.nombre into v_nombre from public.docentes d where d.codigo = v_cod;
  v_norm := public.metas_norm(v_nombre);

  return query
    select
      r.evento_id, r.codigo, r.tipo, r.fecha, r.estado,
      r.parcial, r.materia, r.nota, r.concepto, r.monto,
      r.grado, r.seccion, r.docente, r.anio_lectivo,
      r.actualizado_en,
      false as es_historial
    from public.registro_admin r
    where r.docente ilike '%' || v_cod || '%'
       or (length(v_norm) >= 6 and public.metas_norm(r.docente) like '%' || v_norm || '%')
    union all
    select
      h.evento_id, h.codigo, h.tipo, h.fecha, h.estado,
      h.parcial, h.materia, h.nota, h.concepto, h.monto,
      h.grado, h.seccion, h.docente, h.anio_lectivo,
      coalesce(h.actualizado_en, h.archivado_en) as actualizado_en,
      true as es_historial
    from public.registro_admin_historial h
    where h.docente ilike '%' || v_cod || '%'
       or (length(v_norm) >= 6 and public.metas_norm(h.docente) like '%' || v_norm || '%')
    order by es_historial asc, actualizado_en desc
    limit 6000;
end
$$;
revoke all on function public.metas_recuperar_admin_docente(text,text) from public;
grant execute on function public.metas_recuperar_admin_docente(text,text) to anon, authenticated;
