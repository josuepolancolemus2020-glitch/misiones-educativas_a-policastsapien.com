-- ============================================================================
-- M.E.T.A.S · Perfil del centro educativo
-- ----------------------------------------------------------------------------
-- Se pega en el SQL Editor DESPUÉS de SUPABASE-V2-ESQUEMA.sql.
-- Se puede pegar dos veces: la segunda no cambia nada y no falla.
-- Va en una transacción: o queda la tabla y el vínculo, o no se toca nada.
--
-- Por qué una tabla y no más columnas en el aula: un docente puede tener
-- aulas en dos centros. El grado y la sección siguen en metas.aulas. Cada
-- aula apunta a su centro (centro_id). El perfil (nombre, logos a color,
-- dirección, aldea, municipio, departamento, código SACE, director o
-- directora, año, modalidad y jornada) vive UNA vez en metas.centros.
--
-- Quién entra: solo el docente dueño, con la misma RLS de _preparar
-- (dueño + política restrictiva de cuenta de docente). anon no tiene
-- acceso. No hay GRANT a nivel de todo el esquema.
--
-- Los logos son el JPEG a color que arma el aparato (unos 260 px), el
-- mismo data URL de hoy. No se acepta otro tipo: así no entra un archivo
-- que no sea ese JPEG.
--
-- Qué NO hace: no borra aulas, no toca alumnos, no toca dinero, no copia
-- filas solas. Lo que el docente ya tenía en el aparato se ofrece en la
-- pantalla, no aquí.
--
-- Orden, el día de pegarlo:
--   1) Respaldo (el bloque de abajo, solo, ANTES de este archivo).
--   2) Pegar este archivo entero.
--   3) Leer las comprobaciones del final. Cada fila debe decir sí.
--   Si algo no cuadra: SUPABASE-V2-PERFIL-CENTRO-DESHACER.sql
-- ============================================================================

-- ── 1. RESPALDO (no se ejecuta: está comentado a propósito) ────────────────
-- Descomente SOLO este bloque y córralo ANTES de pegar el resto del archivo.
-- Es una foto de las columnas del perfil que hoy están en cada aula, por si
-- hay que mirarlas después. Este archivo no las borra ni las reescribe.
-- La tabla queda en public con RLS y sin permiso para la llave pública.
--
--   create table public._respaldo_20261118_perfil_aula as
--   select id, owner, escuela, codigo_centro, jornada, modalidad, director,
--          lugar, aldea, municipio, departamento, anio_lectivo,
--          logo_path, logo_sec_path, updated_at
--     from metas.aulas;
--   alter table public._respaldo_20261118_perfil_aula enable row level security;
--   revoke all on public._respaldo_20261118_perfil_aula from public, anon, authenticated;
--
-- Comprobar el respaldo: select count(*) from public._respaldo_20261118_perfil_aula;
-- Tiene que ser el mismo número de filas que select count(*) from metas.aulas;

begin;

do $perfil$
begin
  if to_regclass('metas.centros') is not null then
    raise notice 'metas.centros ya existe; no se cambió nada';
    return;
  end if;

  execute $sql$
    create table metas.centros (
      like metas._fila including all,
      nombre        text not null check (length(nombre) between 1 and 160),
      direccion     text check (direccion is null or length(direccion) between 1 and 160),
      aldea         text check (aldea is null or length(aldea) between 1 and 120),
      municipio     text check (municipio is null or length(municipio) between 1 and 80),
      departamento  text check (departamento is null or length(departamento) between 1 and 80),
      codigo_sace   text check (codigo_sace is null or length(codigo_sace) between 1 and 30),
      director      text check (director is null or length(director) between 1 and 120),
      anio_lectivo  smallint not null check (anio_lectivo between 2020 and 2100),
      modalidad     text check (modalidad is null or length(modalidad) between 1 and 80),
      jornada       text check (jornada is null or length(jornada) between 1 and 80),
      -- JPEG a color, el data URL que produce el aparato. Null si no hay logo.
      logo          text check (logo is null or (logo like 'data:image/jpeg;base64,%' and length(logo) between 32 and 180000)),
      logo_sec      text check (logo_sec is null or (logo_sec like 'data:image/jpeg;base64,%' and length(logo_sec) between 32 and 180000)),
      unique (id, owner)
    )
  $sql$;

  execute $sql$
    create unique index centros_unico on metas.centros (owner, metas.norm_nombre(nombre), anio_lectivo)
      where deleted_at is null
  $sql$;

  -- El aula apunta a su centro. Null mientras el docente no lo haya anotado:
  -- las aulas que ya existen siguen igual y las pruebas viejas no se rompen.
  execute 'alter table metas.aulas add column centro_id uuid';
  execute 'alter table metas.aulas add constraint aulas_centro_fk foreign key (centro_id, owner) references metas.centros (id, owner)';
  execute 'create index aulas_centro_idx on metas.aulas (centro_id) where centro_id is not null and deleted_at is null';

  -- Misma preparación que el resto: RLS del dueño, restrictiva de docente,
  -- sello, sin DELETE, auditoría y Realtime. Escritura directa (no es dinero).
  perform metas._preparar('centros', '{}');

  -- Un centro borrado no se puede volver a elegir. El disparador de aulas
  -- no se rehace entero (eso duplicaría las políticas): solo se agrega este.
  execute $sql$
    create trigger aulas_30_centro before insert or update on metas.aulas
      for each row execute function metas.t_padres_activos('centro_id', 'centros')
  $sql$;
end
$perfil$;

-- Si algo quedó a medias, no se confirma.
do $revisa$
begin
  if to_regclass('metas.centros') is null then
    raise exception 'M.E.T.A.S: no quedó metas.centros; no se cambió nada.';
  end if;
  if not exists (
    select 1 from information_schema.columns
     where table_schema = 'metas' and table_name = 'aulas' and column_name = 'centro_id'
  ) then
    raise exception 'M.E.T.A.S: el aula no apunta al centro; no se cambió nada.';
  end if;
  if not exists (
    select 1 from pg_constraint
     where conname = 'aulas_centro_fk' and conrelid = 'metas.aulas'::regclass
  ) then
    raise exception 'M.E.T.A.S: falta el vínculo aula → centro; no se cambió nada.';
  end if;
  if has_table_privilege('anon', 'metas.centros', 'select')
     or has_table_privilege('anon', 'metas.centros', 'insert')
     or has_table_privilege('anon', 'metas.centros', 'update')
     or has_table_privilege('anon', 'metas.centros', 'delete') then
    raise exception 'M.E.T.A.S: anon puede ver metas.centros; no se cambió nada.';
  end if;
  -- PUBLIC no es un rol: el grantee 0 en la ACL es «cualquiera».
  if exists (
    select 1
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      cross join lateral aclexplode(c.relacl) acl
     where n.nspname = 'metas' and c.relname = 'centros' and acl.grantee = 0
  ) then
    raise exception 'M.E.T.A.S: public puede ver metas.centros; no se cambió nada.';
  end if;
  if has_schema_privilege('anon', 'metas', 'usage')
     or has_schema_privilege('anon', 'metas', 'create') then
    raise exception 'M.E.T.A.S: anon tiene permiso sobre el esquema metas; no se cambió nada.';
  end if;
  if not has_table_privilege('authenticated', 'metas.centros', 'select')
     or not has_table_privilege('authenticated', 'metas.centros', 'insert')
     or not has_table_privilege('authenticated', 'metas.centros', 'update')
     or has_table_privilege('authenticated', 'metas.centros', 'delete') then
    raise exception 'M.E.T.A.S: el permiso del docente sobre centros no quedó como el resto; no se cambió nada.';
  end if;
end
$revisa$;

commit;

-- ── Comprobaciones de solo lectura (cada fila debe decir sí) ───────────────
select 'tabla centros' as que,
       (to_regclass('metas.centros') is not null) as si
union all
select 'aula apunta al centro',
       exists (select 1 from information_schema.columns
                where table_schema = 'metas' and table_name = 'aulas' and column_name = 'centro_id')
union all
select 'vínculo aulas_centro_fk',
       exists (select 1 from pg_constraint where conname = 'aulas_centro_fk')
union all
select 'anon no lee',
       not has_table_privilege('anon', 'metas.centros', 'select')
union all
select 'anon no escribe',
       not has_table_privilege('anon', 'metas.centros', 'insert')
       and not has_table_privilege('anon', 'metas.centros', 'update')
       and not has_table_privilege('anon', 'metas.centros', 'delete')
union all
select 'anon sin permiso de esquema',
       not has_schema_privilege('anon', 'metas', 'usage')
union all
select 'docente lee y escribe, no borra',
       has_table_privilege('authenticated', 'metas.centros', 'select')
       and has_table_privilege('authenticated', 'metas.centros', 'insert')
       and has_table_privilege('authenticated', 'metas.centros', 'update')
       and not has_table_privilege('authenticated', 'metas.centros', 'delete')
union all
select 'políticas del dueño',
       exists (select 1 from pg_policies where schemaname = 'metas' and tablename = 'centros' and policyname = 'centros_leer')
       and exists (select 1 from pg_policies where schemaname = 'metas' and tablename = 'centros' and policyname = 'centros_solo_docentes');
