-- ============================================================================
-- M.E.T.A.S · Esquema de datos v2 · PROPUESTA (FASE 1: SOLO DISEÑO)
-- ----------------------------------------------------------------------------
-- ⚠️ NO EJECUTAR. Este archivo es un documento de diseño. Se pega en el SQL
--    Editor solo cuando se apruebe la fase de implementación, y DESPUÉS de la
--    fase de vinculación de cuentas (SUPABASE-V2-VINCULACION.sql), porque toda
--    escritura exige una sesión de Supabase Auth (auth.uid()).
--
-- Qué cambia respecto de hoy:
--   · Supabase es la ÚNICA fuente de verdad. Cada dato que el docente escribe
--     es UNA fila con id propio, no un pedazo de un blob.
--   · Nada se fusiona: los conflictos se resuelven por `version`, fila por
--     fila y campo por campo (ver 03-GUARDADO-CONFLICTOS-Y-SIN-CONEXION.md).
--   · Nunca DELETE físico: borrar es poner deleted_at con la hora del servidor,
--     y una fila borrada no se puede editar ni revivir.
--   · Todo cambio queda en metas.auditoria, que es de solo inserción.
--   · Los totales (colectas, promedios, inasistencias, boletas, cuadros) se
--     CALCULAN en vistas; no hay columnas de totales.
--
-- La base nueva empieza VACÍA. No hay migración automática desde
-- docente_estado ni desde registro_admin: esas tablas se congelan aparte
-- (SUPABASE-V2-CONGELAR.sql) y esta base no las lee nunca.
--
-- Todo vive en el esquema `metas`, separado del `public` viejo. Hay que
-- añadirlo en Settings → API → Exposed schemas.
-- ============================================================================

create schema if not exists metas;
revoke all on schema metas from public, anon;
grant usage on schema metas to authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 0. Utilidades
-- ════════════════════════════════════════════════════════════════════════════

-- Nombre normalizado para comparar «Ana  María López» con «ana maria lopez».
-- Es IMMUTABLE (translate, no unaccent) para poder usarla en un índice único.
create or replace function metas.norm_nombre(t text)
returns text language sql immutable parallel safe as $$
  select nullif(
    regexp_replace(
      translate(lower(trim(coalesce(t, ''))),
                'áéíóúüñàèìòùâêîôûäëïö',
                'aeiouunaeiouaeiouaeio'),
      '\s+', ' ', 'g'),
    '')
$$;

-- Aparato que hizo la petición. Lo manda supabase-js en la cabecera
-- x-metas-aparato (un uuid por instalación). Fuera de una petición HTTP
-- (SQL Editor, pruebas) devuelve null.
create or replace function metas.aparato()
returns text language sql stable as $$
  select nullif(left(coalesce(
    current_setting('request.headers', true)::json ->> 'x-metas-aparato', ''), 64), '')
$$;

-- Operación de la cola que originó el cambio (cabecera x-metas-op). Solo
-- sirve para el rastro de auditoría; la idempotencia no depende de ella.
create or replace function metas.op_actual()
returns uuid language plpgsql stable as $$
declare v text := current_setting('request.headers', true)::json ->> 'x-metas-op';
begin
  return v::uuid;
exception when others then
  return null;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- 1. Columnas comunes a TODA fila del docente
-- ════════════════════════════════════════════════════════════════════════════
-- Plantilla que copian todas las tablas con `like metas._fila including all`.
-- No guarda datos y nadie tiene permiso sobre ella.
create table if not exists metas._fila (
  id          uuid        primary key default gen_random_uuid(),  -- lo genera el aparato UNA vez
  owner       uuid        not null default auth.uid(),            -- dueño de la cuenta (auth.users.id)
  created_at  timestamptz not null default now(),                 -- hora del SERVIDOR
  updated_at  timestamptz not null default now(),                 -- hora del SERVIDOR
  updated_by  uuid        not null default auth.uid(),
  device_id   text        not null default 'desconocido' check (length(device_id) between 1 and 64),
  deleted_at  timestamptz,                                         -- borrado lógico
  version     integer     not null default 1 check (version >= 1)  -- control de concurrencia
);
revoke all on metas._fila from public, anon, authenticated;

-- ── Sello: lo que el aparato NO puede decidir ──────────────────────────────
-- Corre ANTES de insertar o actualizar. Pisa owner, horas, autor, aparato y
-- versión con lo que dice el servidor, aunque el aparato mande otra cosa.
-- TG_ARGV = columnas que no se pueden cambiar después de crear la fila
-- (por ejemplo alumno_id de un pago: un pago no se "mueve" de alumno).
create or replace function metas.t_sellar()
returns trigger language plpgsql set search_path = metas, pg_temp as $$
declare
  v_uid uuid := auth.uid();
  v_ap  text := metas.aparato();
  c     text;
begin
  if v_uid is null then
    raise exception 'metas: se necesita una sesión' using errcode = '42501';
  end if;

  if tg_op = 'INSERT' then
    new.id         := coalesce(new.id, gen_random_uuid());
    new.owner      := v_uid;
    new.created_at := now();
    new.updated_at := now();
    new.updated_by := v_uid;
    new.device_id  := coalesce(v_ap, nullif(new.device_id, ''), 'desconocido');
    new.version    := 1;
    new.deleted_at := null;          -- nada nace borrado
    return new;
  end if;

  -- UPDATE ------------------------------------------------------------------
  if old.deleted_at is not null then
    -- Regla dura: lo borrado no se edita ni se revive. El aparato que llega
    -- tarde con una edición recibe este error y la descarta.
    raise exception 'metas: la fila % está borrada', old.id using errcode = 'MT001';
  end if;
  if new.id is distinct from old.id
     or new.owner is distinct from old.owner
     or new.created_at is distinct from old.created_at then
    raise exception 'metas: id, dueño y fecha de creación no se cambian' using errcode = 'MT002';
  end if;
  if tg_nargs > 0 then               -- sin argumentos, TG_ARGV puede venir nulo
    foreach c in array tg_argv loop
      if (to_jsonb(new) -> c) is distinct from (to_jsonb(old) -> c) then
        raise exception 'metas: % no se cambia después de crear la fila', c using errcode = 'MT002';
      end if;
    end loop;
  end if;

  new.updated_at := now();
  new.updated_by := v_uid;
  new.device_id  := coalesce(v_ap, nullif(new.device_id, ''), old.device_id);
  new.version    := old.version + 1;
  if new.deleted_at is not null then
    new.deleted_at := now();         -- la hora del borrado es la del servidor
  end if;
  return new;
end $$;

-- ── Nunca DELETE físico ────────────────────────────────────────────────────
create or replace function metas.t_sin_delete()
returns trigger language plpgsql as $$
begin
  raise exception 'metas: no se borran filas; se marca deleted_at' using errcode = 'MT005';
end $$;

-- ── Padres activos ─────────────────────────────────────────────────────────
-- Al crear una fila hija (o cambiarle el padre), el padre tiene que existir,
-- ser del mismo dueño (eso ya lo asegura la llave foránea compuesta) y NO
-- estar borrado. Así un pago anotado sin señal sobre un alumno que otro
-- aparato quitó se rechaza en vez de quedar huérfano.
-- TG_ARGV en pares: columna, tabla.   ej: 'alumno_id','alumnos','colecta_id','colectas'
create or replace function metas.t_padres_activos()
returns trigger language plpgsql set search_path = metas, pg_temp as $$
declare
  i int := 0;
  v_col text; v_tab text; v_id uuid; v_borrada boolean;
begin
  if tg_op = 'UPDATE' and new.deleted_at is not null then
    return new;                       -- borrar un hijo siempre se puede
  end if;
  while i < tg_nargs loop
    v_col := tg_argv[i]; v_tab := tg_argv[i + 1]; i := i + 2;
    v_id := (to_jsonb(new) ->> v_col)::uuid;
    continue when v_id is null;
    if tg_op = 'UPDATE' and v_id is not distinct from (to_jsonb(old) ->> v_col)::uuid then
      continue;
    end if;
    execute format('select deleted_at is not null from metas.%I where id = $1', v_tab)
      into v_borrada using v_id;
    if v_borrada is null or v_borrada then
      raise exception 'metas: % % no existe o está borrado', v_tab, v_id using errcode = 'MT003';
    end if;
  end loop;
  return new;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- 2. Auditoría (solo inserción; nadie la edita ni la borra)
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists metas.auditoria (
  id          bigint      generated always as identity primary key,
  ocurrido_at timestamptz not null default clock_timestamp(),  -- hora del servidor
  tabla       text        not null,
  fila_id     uuid        not null,
  owner       uuid        not null,
  accion      text        not null check (accion in ('crear', 'editar', 'borrar')),
  antes       jsonb,                 -- fila completa antes (null al crear)
  despues     jsonb       not null,  -- fila completa después
  campos      text[],                -- qué campos cambiaron (editar)
  actor       uuid,                  -- auth.uid() de quien hizo el cambio
  device_id   text,
  op_id       uuid,                  -- operación de la cola (cabecera x-metas-op)
  txid        bigint      not null default txid_current()
);
create index if not exists auditoria_fila_idx  on metas.auditoria (fila_id, id);
create index if not exists auditoria_owner_idx on metas.auditoria (owner, ocurrido_at desc);

alter table metas.auditoria enable row level security;
-- El docente puede LEER su propio rastro (para soporte). Nadie más.
create policy auditoria_leer on metas.auditoria
  for select to authenticated using (owner = auth.uid());
revoke all on metas.auditoria from public, anon, authenticated, service_role;
grant select on metas.auditoria to authenticated;

-- Candado: ni el dueño de la tabla puede editar o borrar por SQL normal.
create or replace function metas.t_auditoria_inmutable()
returns trigger language plpgsql as $$
begin
  raise exception 'metas: la auditoría es de solo inserción' using errcode = 'MT006';
end $$;
create trigger auditoria_sin_update before update or delete on metas.auditoria
  for each row execute function metas.t_auditoria_inmutable();
create trigger auditoria_sin_truncate before truncate on metas.auditoria
  for each statement execute function metas.t_auditoria_inmutable();

-- La función que escribe en la auditoría es SECURITY DEFINER (la crea el dueño
-- del esquema), porque authenticated no tiene INSERT sobre la tabla.
create or replace function metas.t_auditar()
returns trigger language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_antes   jsonb;
  v_despues jsonb := to_jsonb(new);
  v_campos  text[];
  v_accion  text := 'crear';
begin
  if tg_op = 'UPDATE' then
    v_antes  := to_jsonb(old);
    v_accion := case when old.deleted_at is null and new.deleted_at is not null
                     then 'borrar' else 'editar' end;
    select array_agg(k order by k) into v_campos
      from jsonb_object_keys(v_despues) k
     where k not in ('updated_at', 'updated_by', 'version', 'device_id')
       and (v_despues -> k) is distinct from (v_antes -> k);
  end if;
  insert into metas.auditoria (tabla, fila_id, owner, accion, antes, despues, campos,
                               actor, device_id, op_id)
  values (tg_table_name, new.id, new.owner, v_accion, v_antes, v_despues, v_campos,
          auth.uid(), new.device_id, metas.op_actual());
  return null;
end $$;
revoke all on function metas.t_auditar() from public, anon, authenticated;

-- ── Rechazos de la cola (soporte) ──────────────────────────────────────────
-- Cuando una operación de la cola no se puede aplicar (ver 03, sección 3.6),
-- el aparato deja aquí la operación y el motivo. Solo inserción.
create table if not exists metas.rechazos (
  id          bigint      generated always as identity primary key,
  ocurrido_at timestamptz not null default now(),
  owner       uuid        not null default auth.uid(),
  device_id   text        default metas.aparato(),
  operacion   jsonb       not null,
  codigo      text,                  -- SQLSTATE o motivo corto
  motivo      text
);
alter table metas.rechazos enable row level security;
create policy rechazos_crear on metas.rechazos for insert to authenticated
  with check (owner = auth.uid());
create policy rechazos_leer on metas.rechazos for select to authenticated
  using (owner = auth.uid());
revoke all on metas.rechazos from public, anon, authenticated;
grant insert, select on metas.rechazos to authenticated;
create trigger rechazos_sin_update before update or delete on metas.rechazos
  for each row execute function metas.t_auditoria_inmutable();

-- ════════════════════════════════════════════════════════════════════════════
-- 3. Preparar una tabla: RLS, permisos, disparadores y Realtime
-- ════════════════════════════════════════════════════════════════════════════
-- Se llama una vez por tabla al final del archivo. Centralizarlo evita que
-- una tabla nueva salga sin RLS o sin auditoría por olvido.
create or replace function metas._preparar(
  p_tabla text, p_inmutables text[] default '{}', p_padres text[] default '{}'
) returns void language plpgsql as $$
declare
  t text := format('metas.%I', p_tabla);
begin
  execute format('alter table %s enable row level security', t);
  execute format('create policy %I on %s for select to authenticated using (owner = auth.uid())',
                 p_tabla || '_leer', t);
  execute format('create policy %I on %s for insert to authenticated with check (owner = auth.uid())',
                 p_tabla || '_crear', t);
  execute format('create policy %I on %s for update to authenticated using (owner = auth.uid()) with check (owner = auth.uid())',
                 p_tabla || '_editar', t);
  -- sin política de DELETE, y además sin el permiso:
  execute format('revoke all on %s from public, anon, authenticated', t);
  execute format('grant select, insert, update on %s to authenticated', t);

  execute format('create trigger %I before insert or update on %s for each row execute function metas.t_sellar(%s)',
                 p_tabla || '_sellar', t,
                 coalesce((select string_agg(quote_literal(x), ',') from unnest(p_inmutables) x), ''));
  if array_length(p_padres, 1) > 0 then
    execute format('create trigger %I before insert or update on %s for each row execute function metas.t_padres_activos(%s)',
                   p_tabla || '_padres', t,
                   (select string_agg(quote_literal(x), ',') from unnest(p_padres) x));
  end if;
  execute format('create trigger %I before delete on %s for each row execute function metas.t_sin_delete()',
                 p_tabla || '_sin_delete', t);
  execute format('create trigger %I after insert or update on %s for each row execute function metas.t_auditar()',
                 p_tabla || '_auditar', t);
  execute format('create index if not exists %I on %s (owner, updated_at)', p_tabla || '_cambios_idx', t);
  execute format('alter publication supabase_realtime add table %s', t);
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- 4. Tablas del aula (las ocho pedidas, más las que exige el inventario)
-- ════════════════════════════════════════════════════════════════════════════
-- Llaves foráneas COMPUESTAS (hijo.padre_id, hijo.owner) → padre(id, owner):
-- la base misma impide colgar una fila propia de una fila de otra cuenta, aunque
-- alguien adivine el uuid. Donde además importa el aula, la llave incluye aula_id
-- y asegura que el pago, el alumno y la colecta son de la MISMA aula.

-- ── 4.1 aulas (antes: un «grupo» dentro de METAS_ADMIN_V1) ─────────────────
create table if not exists metas.aulas (
  like metas._fila including all,
  escuela          text    not null check (length(escuela) between 1 and 160),
  codigo_centro    text             check (length(codigo_centro) <= 30),
  grado            smallint not null check (grado between 0 and 12),   -- 0 = Prebásica
  seccion          text    not null check (seccion ~ '^[0-9A-Za-z]{1,3}$'),
  anio_lectivo     smallint not null check (anio_lectivo between 2020 and 2100),
  jornada          text,
  modalidad        text,
  -- Datos de la boleta que el docente escribe (antes boleta:{…}):
  director         text,
  docente_nombre   text,
  lugar            text,
  aldea            text,
  municipio        text,
  departamento     text,
  escala_personalidad text[] not null default '{S,MB,B}',
  edad_corte       date,
  observacion_grado text check (length(observacion_grado) <= 500),
  logo_path        text,             -- Supabase Storage (bucket metas-imagenes), no base64
  logo_sec_path    text,
  ajustes          jsonb   not null default '{}'::jsonb,  -- preferencias del aula (no datos de alumnos)
  unique (id, owner)
);
-- Un aula por escuela, grado, sección y año en cada cuenta: crear dos veces la
-- misma aula sin señal choca aquí y se resuelve como en 03, sección 3.5.
create unique index if not exists aulas_unica on metas.aulas
  (owner, metas.norm_nombre(escuela), grado, upper(seccion), anio_lectivo)
  where deleted_at is null;

-- ── 4.2 periodos (fechas de cada parcial; antes boleta.parcialFechas) ──────
create table if not exists metas.periodos (
  like metas._fila including all,
  aula_id  uuid not null,
  periodo  text not null check (periodo in ('I', 'II', 'III', 'IV')),
  desde    date not null,
  hasta    date not null check (hasta >= desde),
  foreign key (aula_id, owner) references metas.aulas (id, owner)
);
create unique index if not exists periodos_unico on metas.periodos (aula_id, periodo)
  where deleted_at is null;

-- ── 4.3 asignaturas (antes materias:['Español',…], texto suelto) ───────────
-- Con id propio: renombrar «Ciencias» a «Ciencias Naturales» NO mueve ni
-- pierde notas, porque las notas apuntan al id.
create table if not exists metas.asignaturas (
  like metas._fila including all,
  aula_id  uuid not null,
  nombre   text not null check (length(nombre) between 1 and 80),
  orden    smallint not null default 0,
  unique (id, owner, aula_id),
  foreign key (aula_id, owner) references metas.aulas (id, owner)
);
create unique index if not exists asignaturas_unica on metas.asignaturas
  (aula_id, metas.norm_nombre(nombre)) where deleted_at is null;

-- ── 4.4 alumnos ────────────────────────────────────────────────────────────
-- Identidad real = número de identidad + nombre completo. El id uuid no
-- cambia nunca. El número de lista es SOLO visual: no es único, no es llave
-- de nada, se edita y se reordena sin tocar ninguna otra tabla.
create table if not exists metas.alumnos (
  like metas._fila including all,
  aula_id          uuid not null,
  nombre_completo  text not null check (length(trim(nombre_completo)) between 3 and 120),
  nombre_norm      text generated always as (metas.norm_nombre(nombre_completo)) stored,
  -- Documento de identidad. Se guarda NORMALIZADO (mayúsculas, sin guiones ni
  -- espacios). Acepta documentos extranjeros: el formato hondureño de 13
  -- dígitos solo se exige cuando el país es HN. null = falta (aviso discreto).
  identidad        text check (identidad ~ '^[0-9A-Z]{4,25}$'),
  documento_pais   text not null default 'HN' check (documento_pais ~ '^[A-Z]{2}$'),  -- ISO 3166-1 (HN, GT, SV, NI…)
  documento_tipo   text not null default 'identidad'
                   check (documento_tipo in ('identidad', 'cui', 'partida', 'pasaporte', 'otro')),
  num_lista        smallint check (num_lista between 1 and 99),  -- visual, editable, sin unique
  sexo             text check (sexo in ('F', 'M')),
  fecha_nacimiento date,
  estado           text not null default 'activo'
                   check (estado in ('activo', 'ingreso', 'trasladado', 'desertor')),
  estado_fecha     date,
  en_sace          boolean not null default false,
  sace_num         smallint,
  edad_sace        smallint,
  no_copiar_sace   boolean not null default false,
  unique (id, owner),
  unique (id, owner, aula_id),
  foreign key (aula_id, owner) references metas.aulas (id, owner),
  check (identidad is null or documento_pais <> 'HN' or documento_tipo <> 'identidad'
         or identidad ~ '^[0-9]{13}$')
);
-- Las dos restricciones de identidad, dentro del aula y solo entre activos:
create unique index if not exists alumnos_identidad_unica on metas.alumnos (aula_id, documento_pais, identidad)
  where deleted_at is null and identidad is not null;
create unique index if not exists alumnos_nombre_unico on metas.alumnos (aula_id, nombre_norm)
  where deleted_at is null;
create index if not exists alumnos_aula_idx on metas.alumnos (aula_id) where deleted_at is null;

-- ── 4.5 familias (encargado y clave de familia de cada alumno) ─────────────
create table if not exists metas.familias (
  like metas._fila including all,
  aula_id              uuid not null,
  alumno_id            uuid not null,
  encargado_nombre     text check (length(encargado_nombre) <= 120),
  encargado_identidad  text check (encargado_identidad ~ '^[0-9A-Z]{4,25}$'),   -- normalizada; acepta extranjeras
  parentesco           text check (length(parentesco) <= 40),
  telefono             text check (telefono ~ '^[0-9 +()-]{8,20}$'),
  telefono_alumno      text check (telefono_alumno ~ '^[0-9 +()-]{8,20}$'),
  -- Clave de lectura de la familia (chatbot, padres.html). Se conserva la que
  -- ya tiene la familia en papel; protegida por RLS (solo el docente la ve)
  -- porque el docente la tiene que poder reimprimir.
  clave                text not null check (clave ~ '^[0-9]{1,2}-?[A-Z0-9]{4,8}$'),
  foreign key (alumno_id, owner, aula_id) references metas.alumnos (id, owner, aula_id)
);
create unique index if not exists familias_alumno_unica on metas.familias (alumno_id)
  where deleted_at is null;
-- Única en TODO el sistema: la familia solo escribe la clave.
create unique index if not exists familias_clave_unica on metas.familias (upper(replace(clave, '-', '')))
  where deleted_at is null;

-- ── 4.6 colectas ───────────────────────────────────────────────────────────
create table if not exists metas.colectas (
  like metas._fila including all,
  aula_id         uuid not null,
  concepto        text not null check (length(concepto) between 1 and 120),
  monto_sugerido  numeric(12,2) not null check (monto_sugerido >= 0),
  fecha           date not null,
  unique (id, owner, aula_id),
  foreign key (aula_id, owner) references metas.aulas (id, owner)
);

-- Alumnos a quienes NO les corresponde una colecta (antes noCuentan:[nums]).
create table if not exists metas.colecta_exenciones (
  like metas._fila including all,
  aula_id     uuid not null,
  colecta_id  uuid not null,
  alumno_id   uuid not null,
  motivo      text check (length(motivo) <= 120),
  foreign key (colecta_id, owner, aula_id) references metas.colectas (id, owner, aula_id),
  foreign key (alumno_id, owner, aula_id)  references metas.alumnos  (id, owner, aula_id)
);
create unique index if not exists colecta_exenciones_unica on metas.colecta_exenciones
  (colecta_id, alumno_id) where deleted_at is null;

-- ── 4.7 pagos ──────────────────────────────────────────────────────────────
-- Un alumno tiene COMO MÁXIMO UN pago activo por colecta. El monto es lo que
-- realmente dio (sugerido, más, o un abono); corregirlo EDITA esta fila.
-- alumno_id y colecta_id no se pueden cambiar: un pago no se mueve.
create table if not exists metas.pagos (
  like metas._fila including all,
  aula_id     uuid not null,
  colecta_id  uuid not null,
  alumno_id   uuid not null,
  monto       numeric(12,2) not null check (monto > 0),   -- 0 no es un pago: se borra la fila
  fecha       date not null,                              -- día en que entró el dinero
  nota        text check (length(nota) <= 200),
  -- Número de recibo: lo pone la BASE al crear la fila (el aparato no puede
  -- elegirlo), es único en todo el sistema y no cambia nunca, ni al corregir
  -- el monto. No sale del número de lista (el viejo sí: 'RC-' + colecta + num).
  recibo           text not null default '' ,
  -- Número del recibo que la familia ya tiene del sistema viejo (RC-03EX-##),
  -- solo para poder encontrarlo. Opcional y editable.
  recibo_anterior  text check (recibo_anterior ~ '^RC-[0-9A-Z]{2,8}-[0-9]{1,4}$'),
  foreign key (colecta_id, owner, aula_id) references metas.colectas (id, owner, aula_id),
  foreign key (alumno_id, owner, aula_id)  references metas.alumnos  (id, owner, aula_id)
);
create unique index if not exists pagos_recibo_unico on metas.pagos (recibo);
create unique index if not exists pagos_recibo_anterior_unico on metas.pagos (owner, recibo_anterior)
  where deleted_at is null and recibo_anterior is not null;
create unique index if not exists pagos_un_activo_por_colecta on metas.pagos
  (colecta_id, alumno_id) where deleted_at is null;
create index if not exists pagos_aula_idx on metas.pagos (aula_id) where deleted_at is null;

-- ── 4.8 gastos ─────────────────────────────────────────────────────────────
-- Dos tipos que hoy viven en sitios distintos:
--   'colecta' → lo gastado del dinero de una colecta (antes colectas[].gastos)
--   'bolsillo'→ lo que el docente pagó de su bolsillo (antes st.gastos)
create table if not exists metas.gastos (
  like metas._fila including all,
  tipo         text not null check (tipo in ('colecta', 'bolsillo')),
  aula_id      uuid,
  colecta_id   uuid,
  fecha        date not null,
  concepto     text not null check (length(concepto) between 1 and 160),
  categoria    text check (length(categoria) <= 60),
  monto        numeric(12,2) not null check (monto > 0),
  -- solo para 'bolsillo':
  cobrar_a     text check (length(cobrar_a) <= 120),
  tiene_factura boolean not null default false,
  escuela      text,
  estado_cobro text check (estado_cobro in ('pendiente', 'cobrado')),
  fecha_cobro  date,
  check ((tipo = 'colecta' and colecta_id is not null and aula_id is not null)
      or (tipo = 'bolsillo' and colecta_id is null)),
  foreign key (colecta_id, owner, aula_id) references metas.colectas (id, owner, aula_id)
);
create index if not exists gastos_colecta_idx on metas.gastos (colecta_id) where deleted_at is null;

-- ── 4.9 asistencia ─────────────────────────────────────────────────────────
-- Un día de clase en que se pasó lista (antes asistencia[].f). Sin esta fila
-- no se sabe si «nadie faltó» o «no se pasó lista».
create table if not exists metas.asistencia_dias (
  like metas._fila including all,
  aula_id  uuid not null,
  fecha    date not null,
  origen   text check (length(origen) <= 40),
  foreign key (aula_id, owner) references metas.aulas (id, owner)
);
create unique index if not exists asistencia_dias_unico on metas.asistencia_dias (aula_id, fecha)
  where deleted_at is null;

-- La excepción de un alumno ese día (como hoy: solo se guarda quien NO vino).
-- Presente = no hay fila activa. Justificar una ausencia EDITA la fila
-- (estado 'excusa' + motivo), no crea otra.
create table if not exists metas.asistencia (
  like metas._fila including all,
  aula_id        uuid not null,
  alumno_id      uuid not null,
  fecha          date not null,
  estado         text not null check (estado in ('ausente', 'excusa', 'tarde')),
  justificacion  text check (length(justificacion) <= 300),   -- hoy se pierde; ahora se guarda
  foreign key (alumno_id, owner, aula_id) references metas.alumnos (id, owner, aula_id)
);
create unique index if not exists asistencia_un_dia on metas.asistencia (alumno_id, fecha)
  where deleted_at is null;
create index if not exists asistencia_aula_fecha on metas.asistencia (aula_id, fecha) where deleted_at is null;

-- Inasistencias OFICIALES que el docente copia al SACE cuando difieren de lo
-- contado (antes notas[p]['Inasistencias'][num] e inasisOficial[num]). Si no
-- hay fila, la pantalla muestra lo calculado desde metas.asistencia.
create table if not exists metas.inasistencias_oficiales (
  like metas._fila including all,
  aula_id    uuid not null,
  alumno_id  uuid not null,
  periodo    text not null check (periodo in ('I', 'II', 'III', 'IV', 'ANUAL')),
  dias       smallint not null check (dias between 0 and 999),
  foreign key (alumno_id, owner, aula_id) references metas.alumnos (id, owner, aula_id)
);
create unique index if not exists inasistencias_oficiales_unica on metas.inasistencias_oficiales
  (alumno_id, periodo) where deleted_at is null;

-- ── 4.10 notas (SACE) ──────────────────────────────────────────────────────
-- UNA fila activa por alumno + asignatura + periodo + componente. Corregir
-- una nota EDITA esa fila; la nota anterior queda en la auditoría.
--   periodo:    I, II, III, IV, o REC (recuperación, antes recuperacion[materia][num])
--   componente: 'final' = la nota que va al SACE (lo único que hoy se guarda).
--               'acumulativo' y 'examen' quedan previstos para cuando el
--               docente quiera DIGITAR esas partes; si se calculan desde
--               metas.evaluaciones, NO se guardan aquí.
create table if not exists metas.notas (
  like metas._fila including all,
  aula_id        uuid not null,
  alumno_id      uuid not null,
  asignatura_id  uuid not null,
  periodo        text not null check (periodo in ('I', 'II', 'III', 'IV', 'REC')),
  componente     text not null default 'final' check (componente in ('final', 'acumulativo', 'examen')),
  valor          numeric(5,2) not null check (valor between 0 and 100),
  foreign key (alumno_id, owner, aula_id)     references metas.alumnos     (id, owner, aula_id),
  foreign key (asignatura_id, owner, aula_id) references metas.asignaturas (id, owner, aula_id)
);
create unique index if not exists notas_una_activa on metas.notas
  (alumno_id, asignatura_id, periodo, componente) where deleted_at is null;
create index if not exists notas_aula_idx on metas.notas (aula_id, periodo) where deleted_at is null;

-- Rasgos de personalidad (Puntualidad, Espíritu de trabajo, …) con letra.
create table if not exists metas.notas_personalidad (
  like metas._fila including all,
  aula_id    uuid not null,
  alumno_id  uuid not null,
  periodo    text not null check (periodo in ('I', 'II', 'III', 'IV')),
  rasgo      text not null check (rasgo in ('Puntualidad', 'Espíritu de trabajo',
                                            'Orden y presentación', 'Sociabilidad', 'Moralidad')),
  letra      text not null check (letra ~ '^[A-Z]{1,3}$'),
  foreign key (alumno_id, owner, aula_id) references metas.alumnos (id, owner, aula_id)
);
create unique index if not exists notas_personalidad_unica on metas.notas_personalidad
  (alumno_id, periodo, rasgo) where deleted_at is null;

-- ── 4.11 evaluaciones (acumulativos) y sus puntos por alumno ───────────────
-- La definición (título, criterios con su puntaje) es UNA fila; cada punto
-- que el docente anota por alumno y criterio es OTRA fila.
create table if not exists metas.evaluaciones (
  like metas._fila including all,
  aula_id        uuid not null,
  asignatura_id  uuid,
  periodo        text check (periodo in ('I', 'II', 'III', 'IV')),
  titulo         text not null check (length(titulo) between 1 and 160),
  icono          text,
  tipo           text,
  calculo        text not null default 'suma' check (calculo in ('suma', 'promedio')),
  fecha          date,
  -- [{ "id": "c1", "t": "Ortografía", "pts": 5 }, …]: definición, no notas
  criterios      jsonb not null default '[]'::jsonb check (jsonb_typeof(criterios) = 'array'),
  instrumento_id uuid,
  unique (id, owner, aula_id),
  foreign key (aula_id, owner) references metas.aulas (id, owner),
  foreign key (asignatura_id, owner, aula_id) references metas.asignaturas (id, owner, aula_id)
);

create table if not exists metas.evaluacion_puntos (
  like metas._fila including all,
  aula_id        uuid not null,
  evaluacion_id  uuid not null,
  alumno_id      uuid not null,
  criterio       text not null check (length(criterio) between 1 and 20),  -- id del criterio en evaluaciones.criterios
  puntos         numeric(6,2) not null check (puntos >= 0),
  foreign key (evaluacion_id, owner, aula_id) references metas.evaluaciones (id, owner, aula_id),
  foreign key (alumno_id, owner, aula_id)     references metas.alumnos      (id, owner, aula_id)
);
create unique index if not exists evaluacion_puntos_unico on metas.evaluacion_puntos
  (evaluacion_id, alumno_id, criterio) where deleted_at is null;

-- Instrumentos de evaluación reutilizables (rúbricas, listas de cotejo;
-- antes METAS_INSTRUMENTOS_V1, que hoy NI SIQUIERA se sincroniza).
create table if not exists metas.instrumentos (
  like metas._fila including all,
  tipo      text not null check (tipo in ('actividades', 'rubrica', 'cotejo')),
  titulo    text not null check (length(titulo) between 1 and 160),
  materia   text,
  icono     text,
  calculo   text check (calculo in ('suma', 'promedio')),
  criterios jsonb not null default '[]'::jsonb check (jsonb_typeof(criterios) = 'array')
);

-- ── 4.12 controles y registros (antes controles[] con datos[num]) ──────────
create table if not exists metas.controles (
  like metas._fila including all,
  aula_id       uuid not null,
  nombre        text not null check (length(nombre) between 1 and 120),
  icono         text,
  tipo          text not null check (tipo in ('marca', 'texto', 'numero')),
  fecha         date,
  para_familia  boolean not null default false,
  acumulativo   boolean not null default false,
  mision_id     text,
  verbo         text,
  unique (id, owner, aula_id),
  foreign key (aula_id, owner) references metas.aulas (id, owner)
);
create table if not exists metas.control_valores (
  like metas._fila including all,
  aula_id      uuid not null,
  control_id   uuid not null,
  alumno_id    uuid not null,
  marcado      boolean,
  numero       numeric(8,2),
  texto        text check (length(texto) <= 300),
  check (num_nonnulls(marcado, numero, texto) = 1),
  foreign key (control_id, owner, aula_id) references metas.controles (id, owner, aula_id),
  foreign key (alumno_id, owner, aula_id)  references metas.alumnos   (id, owner, aula_id)
);
create unique index if not exists control_valores_unico on metas.control_valores
  (control_id, alumno_id) where deleted_at is null;

-- ── 4.13 observaciones y expediente (antes conducta en METAS_AVISOS_V1) ────
create table if not exists metas.observaciones (
  like metas._fila including all,
  aula_id         uuid not null,
  alumno_id       uuid not null,
  tipo            text not null check (tipo in ('llamado', 'leve', 'felicitacion', 'expediente')),
  texto           text not null check (length(texto) between 1 and 500),
  fecha           date not null,
  visible_hasta   date,               -- hasta cuándo la ve la familia (hoy +45 días)
  para_familia    boolean not null default true,
  foreign key (alumno_id, owner, aula_id) references metas.alumnos (id, owner, aula_id)
);

-- ── 4.14 avisos, destinatarios y preguntas frecuentes ──────────────────────
create table if not exists metas.avisos (
  like metas._fila including all,
  aula_id        uuid not null,
  tipo           text not null check (tipo in ('aviso', 'evento', 'material', 'individual')),
  prioridad      text,
  titulo         text not null check (length(titulo) between 1 and 160),
  texto          text check (length(texto) <= 2000),
  fecha_evento   date,
  hasta          date,
  unique (id, owner, aula_id),
  foreign key (aula_id, owner) references metas.aulas (id, owner)
);
-- Si un aviso no tiene destinatarios, es para toda el aula. Antes era
-- alumnos:[nums], que se corría de alumno al reordenar la lista.
create table if not exists metas.aviso_destinatarios (
  like metas._fila including all,
  aula_id    uuid not null,
  aviso_id   uuid not null,
  alumno_id  uuid not null,
  foreign key (aviso_id, owner, aula_id)  references metas.avisos  (id, owner, aula_id),
  foreign key (alumno_id, owner, aula_id) references metas.alumnos (id, owner, aula_id)
);
create unique index if not exists aviso_destinatarios_unico on metas.aviso_destinatarios
  (aviso_id, alumno_id) where deleted_at is null;

create table if not exists metas.preguntas_frecuentes (
  like metas._fila including all,
  aula_id    uuid not null,
  pregunta   text not null check (length(pregunta) between 1 and 300),
  claves     text,
  respuesta  text not null check (length(respuesta) between 1 and 2000),
  activa     boolean not null default true,
  foreign key (aula_id, owner) references metas.aulas (id, owner)
);

-- ── 4.15 bitácora de clase ─────────────────────────────────────────────────
create table if not exists metas.bitacora (
  like metas._fila including all,
  aula_id  uuid not null,
  fecha    date not null,
  texto    text not null check (length(texto) between 1 and 500),
  foreign key (aula_id, owner) references metas.aulas (id, owner)
);

-- ── 4.16 tomas de lectura (fluidez) ────────────────────────────────────────
-- Una toma no se edita: se añade. Cada una con su id (hoy no lo tienen).
create table if not exists metas.lecturas (
  like metas._fila including all,
  aula_id       uuid not null,
  alumno_id     uuid not null,
  fecha         date not null,
  texto_id      text,
  grado_texto   smallint,
  titulo        text,
  segundos      numeric(6,1) check (segundos > 0),
  palabras      integer check (palabras >= 0),
  total         integer check (total >= 0),
  errores       integer check (errores >= 0),
  comprension   smallint check (comprension >= 0),
  comprension_de smallint check (comprension_de >= 0),
  -- palabras por minuto NO se guarda: se calcula (palabras − errores) / segundos × 60
  foreign key (alumno_id, owner, aula_id) references metas.alumnos (id, owner, aula_id)
);

-- ── 4.17 equipos ───────────────────────────────────────────────────────────
-- Un reparto = una fila; cada alumno en su equipo = otra fila. Antes era
-- la cadena "1,5,9|2,6,10" con números de lista.
create table if not exists metas.repartos (
  like metas._fila including all,
  aula_id     uuid not null,
  vigente     boolean not null default true,
  conf        jsonb not null default '{}'::jsonb,   -- modo, tamaño, mezclar por sexo… (sin números de lista)
  unique (id, owner, aula_id),
  foreign key (aula_id, owner) references metas.aulas (id, owner)
);
create unique index if not exists repartos_un_vigente on metas.repartos (aula_id)
  where deleted_at is null and vigente;
create table if not exists metas.reparto_miembros (
  like metas._fila including all,
  aula_id      uuid not null,
  reparto_id   uuid not null,
  alumno_id    uuid not null,
  equipo       smallint not null check (equipo between 1 and 50),
  coordina     boolean not null default false,
  foreign key (reparto_id, owner, aula_id) references metas.repartos (id, owner, aula_id),
  foreign key (alumno_id, owner, aula_id)  references metas.alumnos  (id, owner, aula_id)
);
create unique index if not exists reparto_miembros_unico on metas.reparto_miembros
  (reparto_id, alumno_id) where deleted_at is null;

-- ── 4.18 plan de acción (análisis de una prueba) ───────────────────────────
create table if not exists metas.analisis (
  like metas._fila including all,
  aula_id        uuid not null,
  evaluacion     text not null,
  mision_id      text,
  asignatura_id  uuid,
  forma          text,
  tipo_eval      text,
  periodo        text check (periodo in ('I', 'II', 'III', 'IV')),
  fecha_prueba   date,
  unique (id, owner, aula_id),
  foreign key (aula_id, owner) references metas.aulas (id, owner)
);
create table if not exists metas.analisis_alumnos (
  like metas._fila including all,
  aula_id        uuid not null,
  analisis_id    uuid not null,
  alumno_id      uuid not null,
  nota           numeric(5,2) check (nota between 0 and 100),
  no_se_presento boolean not null default false,
  categoria      text,
  sugerencia     text,
  mensaje        text check (length(mensaje) <= 1000),
  mensaje_editado boolean not null default false,
  enviado        boolean not null default false,
  foreign key (analisis_id, owner, aula_id) references metas.analisis (id, owner, aula_id),
  foreign key (alumno_id, owner, aula_id)   references metas.alumnos  (id, owner, aula_id)
);
create unique index if not exists analisis_alumnos_unico on metas.analisis_alumnos
  (analisis_id, alumno_id) where deleted_at is null;

-- ── 4.19 inventario y actas (de la cuenta, no de un aula) ──────────────────
create table if not exists metas.inventario (
  like metas._fila including all,
  fecha        date not null,
  nombre       text not null check (length(nombre) between 1 and 160),
  dueno        text not null check (dueno in ('mio', 'escuela', 'donado')),
  categoria    text,
  cantidad     numeric(10,2) not null default 1 check (cantidad > 0),
  valor        numeric(12,2) check (valor >= 0),
  nota         text,
  donante      text,
  tiene_factura boolean not null default false,
  escuela      text,
  pagado_por   text,
  fecha_pago   date
);
create table if not exists metas.inventario_actas (
  like metas._fila including all,
  fecha      date not null,
  firma      text not null,           -- quién recibe
  -- el acta FIJA lo que se entregó ese día: es un documento, no un total vivo
  resumen    jsonb not null check (jsonb_typeof(resumen) = 'object')
);

-- ── 4.20 convocatorias (lo del docente; las respuestas públicas siguen en
--         public.convocatoria_respuestas) ───────────────────────────────────
create table if not exists metas.convocatorias (
  like metas._fila including all,
  aula_id        uuid,
  codigo_publico text unique,          -- el de salida.html
  datos          jsonb not null check (jsonb_typeof(datos) = 'object'),  -- título, lugar, hora, cupos, costo… (sin pagos)
  cerrada        boolean not null default false,
  unique (id, owner)
);
-- Familias anotadas a mano por el docente (antes manual[]). Pueden ser de
-- otros grados, por eso no apuntan a metas.alumnos: se identifican por
-- nombre + grado + sección, como hoy.
create table if not exists metas.convocatoria_inscritos (
  like metas._fila including all,
  convocatoria_id uuid not null,
  alumno_nombre   text not null,
  grado           text,
  seccion         text,
  personas        smallint not null default 1 check (personas between 1 and 50),
  telefono        text,
  nota            text,
  huella          text generated always as (metas.norm_nombre(alumno_nombre) || '|' || coalesce(grado,'') || '|' || coalesce(seccion,'')) stored,
  foreign key (convocatoria_id, owner) references metas.convocatorias (id, owner)
);
create unique index if not exists convocatoria_inscritos_unico on metas.convocatoria_inscritos
  (convocatoria_id, huella) where deleted_at is null;
-- Dinero cobrado en una convocatoria: mismo trato que pagos.
create table if not exists metas.convocatoria_pagos (
  like metas._fila including all,
  convocatoria_id uuid not null,
  huella          text not null,       -- nombre|grado|sección normalizados
  monto           numeric(12,2) not null check (monto > 0),
  fecha           date not null,
  abordo          smallint check (abordo >= 0),
  recibo          text not null default '',      -- mismo trato que pagos.recibo
  recibo_anterior text check (recibo_anterior ~ '^RC-[0-9A-Z]{2,8}-[0-9]{1,4}$'),
  foreign key (convocatoria_id, owner) references metas.convocatorias (id, owner)
);
create unique index if not exists convocatoria_pagos_unico on metas.convocatoria_pagos
  (convocatoria_id, huella) where deleted_at is null;
create unique index if not exists convocatoria_pagos_recibo_unico on metas.convocatoria_pagos (recibo);

-- ── 4.21 Campeonísimo (resultados) y Gobierno Escolar (votación) ───────────
create table if not exists metas.campeonatos (
  like metas._fila including all,
  aula_id     uuid,
  jugado_at   timestamptz not null,
  lugar       text,
  resultado   jsonb not null check (jsonb_typeof(resultado) = 'object')  -- grupos, puntajes, insignias de ESA partida
);
create table if not exists metas.elecciones (
  like metas._fila including all,
  aula_id     uuid,
  modo        text,
  planillas   jsonb not null default '[]'::jsonb,  -- [{id, nombre, imagen_path}] (imágenes en Storage)
  unique (id, owner)
);
-- Cada voto es una fila; el conteo se CALCULA. El código de votación usado
-- no se puede repetir en la misma elección.
create table if not exists metas.eleccion_votos (
  like metas._fila including all,
  eleccion_id  uuid not null,
  planilla     text not null,
  codigo_usado text not null,
  foreign key (eleccion_id, owner) references metas.elecciones (id, owner)
);
create unique index if not exists eleccion_votos_codigo on metas.eleccion_votos
  (eleccion_id, codigo_usado) where deleted_at is null;

-- ── 4.22 Ajustes del docente que no son de un aula (antes METAS_TESIS_CFG_V1
--         y otros). Una fila por clave, nunca un blob de todo.
create table if not exists metas.ajustes_docente (
  like metas._fila including all,
  clave  text not null check (clave ~ '^[a-z0-9_.-]{1,60}$'),
  valor  jsonb not null
);
create unique index if not exists ajustes_docente_unico on metas.ajustes_docente (owner, clave)
  where deleted_at is null;

-- ════════════════════════════════════════════════════════════════════════════
-- 5. Aplicar RLS, sello, padres activos, sin-DELETE, auditoría y Realtime
-- ════════════════════════════════════════════════════════════════════════════
-- Segundo argumento: columnas que no se cambian tras crear la fila.
-- Tercer argumento: pares (columna, tabla padre) que deben estar activos.
select metas._preparar('aulas',            '{}');
select metas._preparar('periodos',         '{aula_id}',                 '{aula_id,aulas}');
select metas._preparar('asignaturas',      '{aula_id}',                 '{aula_id,aulas}');
select metas._preparar('alumnos',          '{aula_id}',                 '{aula_id,aulas}');
select metas._preparar('familias',         '{aula_id,alumno_id}',       '{alumno_id,alumnos}');
select metas._preparar('colectas',         '{aula_id}',                 '{aula_id,aulas}');
select metas._preparar('colecta_exenciones','{aula_id,colecta_id,alumno_id}', '{colecta_id,colectas,alumno_id,alumnos}');
select metas._preparar('pagos',            '{aula_id,colecta_id,alumno_id,recibo}', '{colecta_id,colectas,alumno_id,alumnos}');
select metas._preparar('gastos',           '{tipo,aula_id,colecta_id}', '{colecta_id,colectas}');
select metas._preparar('asistencia_dias',  '{aula_id,fecha}',           '{aula_id,aulas}');
select metas._preparar('asistencia',       '{aula_id,alumno_id,fecha}', '{alumno_id,alumnos}');
select metas._preparar('inasistencias_oficiales', '{aula_id,alumno_id,periodo}', '{alumno_id,alumnos}');
select metas._preparar('notas',            '{aula_id,alumno_id,asignatura_id,periodo,componente}', '{alumno_id,alumnos,asignatura_id,asignaturas}');
select metas._preparar('notas_personalidad','{aula_id,alumno_id,periodo,rasgo}', '{alumno_id,alumnos}');
select metas._preparar('evaluaciones',     '{aula_id}',                 '{aula_id,aulas,asignatura_id,asignaturas}');
select metas._preparar('evaluacion_puntos','{aula_id,evaluacion_id,alumno_id,criterio}', '{evaluacion_id,evaluaciones,alumno_id,alumnos}');
select metas._preparar('instrumentos',     '{}');
select metas._preparar('controles',        '{aula_id}',                 '{aula_id,aulas}');
select metas._preparar('control_valores',  '{aula_id,control_id,alumno_id}', '{control_id,controles,alumno_id,alumnos}');
select metas._preparar('observaciones',    '{aula_id,alumno_id}',       '{alumno_id,alumnos}');
select metas._preparar('avisos',           '{aula_id}',                 '{aula_id,aulas}');
select metas._preparar('aviso_destinatarios','{aula_id,aviso_id,alumno_id}', '{aviso_id,avisos,alumno_id,alumnos}');
select metas._preparar('preguntas_frecuentes','{aula_id}',              '{aula_id,aulas}');
select metas._preparar('bitacora',         '{aula_id}',                 '{aula_id,aulas}');
select metas._preparar('lecturas',         '{aula_id,alumno_id}',       '{alumno_id,alumnos}');
select metas._preparar('repartos',         '{aula_id}',                 '{aula_id,aulas}');
select metas._preparar('reparto_miembros', '{aula_id,reparto_id,alumno_id}', '{reparto_id,repartos,alumno_id,alumnos}');
select metas._preparar('analisis',         '{aula_id}',                 '{aula_id,aulas}');
select metas._preparar('analisis_alumnos', '{aula_id,analisis_id,alumno_id}', '{analisis_id,analisis,alumno_id,alumnos}');
select metas._preparar('inventario',       '{}');
select metas._preparar('inventario_actas', '{}');
select metas._preparar('convocatorias',    '{}');
select metas._preparar('convocatoria_inscritos','{convocatoria_id}',    '{convocatoria_id,convocatorias}');
select metas._preparar('convocatoria_pagos','{convocatoria_id,huella,recibo}', '{convocatoria_id,convocatorias}');
select metas._preparar('campeonatos',      '{}');
select metas._preparar('elecciones',       '{}');
select metas._preparar('eleccion_votos',   '{eleccion_id,codigo_usado}', '{eleccion_id,elecciones}');
select metas._preparar('ajustes_docente',  '{clave}');

-- ════════════════════════════════════════════════════════════════════════════
-- 5b. Números de recibo: únicos, inmutables, puestos por el servidor
-- ════════════════════════════════════════════════════════════════════════════
-- Formato: RC-<año 2 cifras>-<serie del docente 3 letras>-<correlativo 4 cifras>
--   ej. RC-27-K7Q-0001
-- · La serie es única por cuenta (se crea sola con el primer pago), así el
--   número es único en TODO el sistema y nunca choca con el de otro docente.
-- · El correlativo es por docente y año, y no deja huecos: el contador se
--   sube en la misma transacción que crea el pago; si el pago se rechaza
--   (por ejemplo, ya había uno activo), el contador vuelve atrás con él.
-- · Tiene cuatro partes; el viejo (RC-03EX-12) tiene tres. No se confunden.
-- · Sin señal, el pago se ve en pantalla con «recibo pendiente»: el número
--   llega cuando la fila llega a Supabase. Es el precio de que sea único.
create table if not exists metas.recibo_series (
  owner      uuid primary key,
  prefijo    text not null unique check (prefijo ~ '^[A-HJ-NP-Z2-9]{3}$'),
  created_at timestamptz not null default now()
);
create table if not exists metas.recibo_contadores (
  owner   uuid     not null,
  anio    smallint not null,
  ultimo  integer  not null default 0,
  primary key (owner, anio)
);
alter table metas.recibo_series     enable row level security;
alter table metas.recibo_contadores enable row level security;
create policy recibo_series_mia on metas.recibo_series for select to authenticated using (owner = auth.uid());
revoke all on metas.recibo_series, metas.recibo_contadores from public, anon, authenticated;
grant select on metas.recibo_series to authenticated;

create or replace function metas.t_numerar_recibo()
returns trigger language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_letras text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_pre    text;
  v_anio   smallint := (extract(year from now() at time zone 'America/Tegucigalpa')::int % 100);
  v_n      integer;
  i        int;
begin
  -- Solo al crear. Al editar, t_sellar ya impide cambiar `recibo`.
  select prefijo into v_pre from metas.recibo_series where owner = new.owner;
  while v_pre is null loop
    v_pre := '';
    for i in 1..3 loop
      v_pre := v_pre || substr(v_letras, 1 + floor(random() * length(v_letras))::int, 1);
    end loop;
    insert into metas.recibo_series (owner, prefijo) values (new.owner, v_pre)
    on conflict do nothing;
    select prefijo into v_pre from metas.recibo_series where owner = new.owner;
  end loop;
  insert into metas.recibo_contadores as c (owner, anio, ultimo) values (new.owner, v_anio, 1)
  on conflict (owner, anio) do update set ultimo = c.ultimo + 1
  returning ultimo into v_n;
  new.recibo := format('RC-%s-%s-%s', lpad(v_anio::text, 2, '0'), v_pre, lpad(v_n::text, 4, '0'));
  return new;
end $$;
revoke all on function metas.t_numerar_recibo() from public, anon, authenticated;
-- El nombre empieza con «u» para correr DESPUÉS de «…_sellar» (los
-- disparadores BEFORE corren en orden alfabético): necesita el owner ya puesto.
create trigger pagos_u_recibo before insert on metas.pagos
  for each row execute function metas.t_numerar_recibo();
create trigger convocatoria_pagos_u_recibo before insert on metas.convocatoria_pagos
  for each row execute function metas.t_numerar_recibo();

-- La plantilla y el preparador no se usan después de crear el esquema.
revoke all on function metas._preparar(text, text[], text[]) from public, anon, authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 6. Vistas: TODO total se calcula aquí, nunca se guarda
-- ════════════════════════════════════════════════════════════════════════════
-- security_invoker = true → la vista respeta la RLS de quien consulta.
-- Solo cuentan filas activas, y un pago de un alumno o una colecta borrados
-- no cuenta (no hay forma de que un total "reviva" dinero).

-- Alumnos que cuentan para una colecta: activos o de ingreso, no exentos.
create or replace view metas.v_colecta_alumnos with (security_invoker = true) as
select c.id            as colecta_id,
       c.aula_id,
       a.id            as alumno_id,
       a.num_lista,
       a.nombre_completo,
       (e.id is not null)          as exento,
       coalesce(p.monto, 0)        as pagado,
       p.fecha                     as fecha_pago,
       case
         when e.id is not null                 then 'no_corresponde'
         when p.id is null                     then 'debe'
         when p.monto < c.monto_sugerido       then 'abono'
         else 'pagado'
       end                         as situacion,
       greatest(c.monto_sugerido - coalesce(p.monto, 0), 0) as falta
  from metas.colectas c
  join metas.alumnos  a on a.aula_id = c.aula_id and a.deleted_at is null
                       and a.estado in ('activo', 'ingreso')
  left join metas.colecta_exenciones e on e.colecta_id = c.id and e.alumno_id = a.id and e.deleted_at is null
  left join metas.pagos p on p.colecta_id = c.id and p.alumno_id = a.id and p.deleted_at is null
 where c.deleted_at is null;

create or replace view metas.v_colectas_resumen with (security_invoker = true) as
select c.id as colecta_id, c.aula_id, c.concepto, c.fecha, c.monto_sugerido,
       x.esperados,
       x.esperados * c.monto_sugerido                          as meta,
       coalesce(r.recaudado, 0)                                as recaudado,
       coalesce(g.gastado, 0)                                  as gastado,
       coalesce(r.recaudado, 0) - coalesce(g.gastado, 0)       as saldo,
       coalesce(r.pagaron, 0)                                  as pagaron
  from metas.colectas c
  cross join lateral (
    select count(*) filter (where not v.exento) as esperados
      from metas.v_colecta_alumnos v where v.colecta_id = c.id) x
  left join lateral (
    -- dinero en mano: incluye pagos de alumnos trasladados después de pagar,
    -- pero nunca de alumnos BORRADOS (borrar = fue un error de digitación)
    select sum(p.monto) as recaudado, count(*) as pagaron
      from metas.pagos p
      join metas.alumnos a on a.id = p.alumno_id and a.deleted_at is null
     where p.colecta_id = c.id and p.deleted_at is null) r on true
  left join lateral (
    select sum(gs.monto) as gastado
      from metas.gastos gs
     where gs.colecta_id = c.id and gs.deleted_at is null) g on true
 where c.deleted_at is null;

create or replace view metas.v_gastos_bolsillo with (security_invoker = true) as
select owner,
       sum(monto) filter (where estado_cobro is distinct from 'cobrado') as por_cobrar,
       sum(monto) filter (where estado_cobro = 'cobrado')               as cobrado,
       count(*)                                                          as gastos
  from metas.gastos
 where tipo = 'bolsillo' and deleted_at is null
 group by owner;

-- Inasistencias por alumno y parcial, contadas desde la asistencia diaria.
create or replace view metas.v_inasistencias_periodo with (security_invoker = true) as
select a.id as alumno_id, a.aula_id, pe.periodo,
       count(s.id) filter (where s.estado = 'ausente') as ausencias,
       count(s.id) filter (where s.estado = 'excusa')  as excusas,
       count(s.id) filter (where s.estado = 'tarde')   as tardanzas,
       o.dias                                          as oficial,      -- lo que el docente copió al SACE, si lo escribió
       coalesce(o.dias, count(s.id) filter (where s.estado in ('ausente', 'excusa'))) as para_sace
  from metas.alumnos a
  join metas.periodos pe on pe.aula_id = a.aula_id and pe.deleted_at is null
  left join metas.asistencia s on s.alumno_id = a.id and s.deleted_at is null
                              and s.fecha between pe.desde and pe.hasta
  left join metas.inasistencias_oficiales o on o.alumno_id = a.id and o.periodo = pe.periodo
                                           and o.deleted_at is null
 where a.deleted_at is null
 group by a.id, a.aula_id, pe.periodo, o.dias;

-- Notas finales por alumno y asignatura, con su promedio CALCULADO.
create or replace view metas.v_notas_alumno with (security_invoker = true) as
select a.id as alumno_id, a.aula_id, s.id as asignatura_id, s.nombre as asignatura,
       max(n.valor) filter (where n.periodo = 'I')   as p1,
       max(n.valor) filter (where n.periodo = 'II')  as p2,
       max(n.valor) filter (where n.periodo = 'III') as p3,
       max(n.valor) filter (where n.periodo = 'IV')  as p4,
       round(avg(n.valor) filter (where n.periodo in ('I', 'II', 'III', 'IV')), 0) as promedio,
       count(n.id) filter (where n.periodo in ('I', 'II', 'III', 'IV'))           as parciales_con_nota,
       max(n.valor) filter (where n.periodo = 'REC') as recuperacion
  from metas.alumnos a
  join metas.asignaturas s on s.aula_id = a.aula_id and s.deleted_at is null
  left join metas.notas n on n.alumno_id = a.id and n.asignatura_id = s.id
                         and n.componente = 'final' and n.deleted_at is null
 where a.deleted_at is null
 group by a.id, a.aula_id, s.id, s.nombre;

-- Resultado de cada evaluación (acumulativo) por alumno, desde sus puntos.
create or replace view metas.v_evaluacion_resultado with (security_invoker = true) as
select e.id as evaluacion_id, e.aula_id, a.id as alumno_id,
       coalesce(sum(p.puntos), 0) as obtenidos,
       (select coalesce(sum((c ->> 'pts')::numeric), 0)
          from jsonb_array_elements(e.criterios) c)                  as posibles,
       count(p.id)                                                   as criterios_anotados
  from metas.evaluaciones e
  join metas.alumnos a on a.aula_id = e.aula_id and a.deleted_at is null
  left join metas.evaluacion_puntos p on p.evaluacion_id = e.id and p.alumno_id = a.id
                                     and p.deleted_at is null
 where e.deleted_at is null
 group by e.id, e.aula_id, a.id;

-- Votos contados.
create or replace view metas.v_eleccion_conteo with (security_invoker = true) as
select eleccion_id, planilla, count(*) as votos
  from metas.eleccion_votos where deleted_at is null
 group by eleccion_id, planilla;

-- Alumnos a los que les falta el número de identidad (aviso discreto).
create or replace view metas.v_alumnos_sin_identidad with (security_invoker = true) as
select id as alumno_id, aula_id, num_lista, nombre_completo
  from metas.alumnos where deleted_at is null and identidad is null;

grant select on metas.v_colecta_alumnos, metas.v_colectas_resumen, metas.v_gastos_bolsillo,
                metas.v_inasistencias_periodo, metas.v_notas_alumno, metas.v_evaluacion_resultado,
                metas.v_eleccion_conteo, metas.v_alumnos_sin_identidad
  to authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 7. Validación antes de crear un alumno (la usa la pantalla; la base igual
--    lo impide con los índices únicos de 4.4)
-- ════════════════════════════════════════════════════════════════════════════
-- Devuelve los alumnos ACTIVOS del aula que chocan por identidad o por nombre
-- completo. La pantalla la llama antes de guardar para avisar en lenguaje
-- normal («Ya tienes a Ana María López Cruz en la lista, número 12»).
create or replace function metas.norm_documento(t text)
returns text language sql immutable parallel safe as $$
  select nullif(regexp_replace(upper(coalesce(t, '')), '[^0-9A-Z]', '', 'g'), '')
$$;

create or replace function metas.alumno_choques(p_aula uuid, p_nombre text, p_identidad text,
                                                p_pais text default 'HN')
returns table (alumno_id uuid, num_lista smallint, nombre_completo text, por text)
language sql stable security invoker set search_path = metas, pg_temp as $$
  select a.id, a.num_lista, a.nombre_completo,
         case when a.identidad = metas.norm_documento(p_identidad)
                   and a.documento_pais = upper(coalesce(p_pais, 'HN'))
              then 'identidad' else 'nombre' end
    from metas.alumnos a
   where a.aula_id = p_aula and a.deleted_at is null
     and (a.nombre_norm = metas.norm_nombre(p_nombre)
          or (a.identidad = metas.norm_documento(p_identidad)
              and a.documento_pais = upper(coalesce(p_pais, 'HN'))))
$$;
grant execute on function metas.alumno_choques(uuid, text, text, text) to authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 8. Freno de intentos (lo usan la vinculación de familias y metas-entrar)
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists metas.frenos (
  llave    text        not null,
  ventana  timestamptz not null,
  n        integer     not null default 0,
  primary key (llave, ventana)
);
alter table metas.frenos enable row level security;   -- sin políticas: solo las funciones
revoke all on metas.frenos from public, anon, authenticated;

create or replace function metas.freno_ok(p_llave text, p_max int, p_ventana interval)
returns boolean language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_ini timestamptz := date_bin(p_ventana, now(), timestamptz '2000-01-01');
  v_n   int;
begin
  delete from metas.frenos where ventana < now() - interval '1 day';
  insert into metas.frenos as f (llave, ventana, n) values (p_llave, v_ini, 1)
  on conflict (llave, ventana) do update set n = f.n + 1
  returning n into v_n;
  return v_n <= p_max;
end $$;
revoke all on function metas.freno_ok(text, int, interval) from public, anon, authenticated;

create or replace function metas.ip_cliente()
returns text language sql stable as $$
  select coalesce(
    current_setting('request.headers', true)::json ->> 'cf-connecting-ip',
    split_part(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ',', 1),
    'sin-ip')
$$;

-- La lectura de las familias (padres.html, asistente) NO está aquí: va en
-- SUPABASE-V2-FAMILIAS.sql, con sesión anónima, vínculo por clave, vistas de
-- solo lectura con RLS por familia y aviso inmediato por Realtime.

-- ════════════════════════════════════════════════════════════════════════════
-- 9. Storage (logos e imágenes de planillas): bucket privado por dueño
-- ════════════════════════════════════════════════════════════════════════════
-- insert into storage.buckets (id, name, public) values ('metas-imagenes', 'metas-imagenes', false);
-- create policy "imagenes propias" on storage.objects for all to authenticated
--   using  (bucket_id = 'metas-imagenes' and (storage.foldername(name))[1] = auth.uid()::text)
--   with check (bucket_id = 'metas-imagenes' and (storage.foldername(name))[1] = auth.uid()::text);
-- Ruta: <auth.uid()>/<aula_id>/logo.png. Borrar una imagen = quitar la ruta de
-- la fila (queda en auditoría); el archivo se conserva.

-- ════════════════════════════════════════════════════════════════════════════
-- 10. Comprobaciones después de correrlo (en la fase de implementación)
-- ════════════════════════════════════════════════════════════════════════════
-- a) Ninguna tabla de metas sin RLS:
--    select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
--     where n.nspname = 'metas' and c.relkind = 'r' and not c.relrowsecurity;
--    → solo debe salir _fila (plantilla sin permisos).
-- b) Ningún permiso de DELETE/TRUNCATE para anon o authenticated:
--    select table_name, grantee, privilege_type from information_schema.role_table_grants
--     where table_schema = 'metas' and grantee in ('anon','authenticated')
--       and privilege_type in ('DELETE','TRUNCATE');          → 0 filas
-- c) anon no ve nada:
--    select table_name from information_schema.role_table_grants
--     where table_schema = 'metas' and grantee = 'anon';       → 0 filas
-- d) Todas las tablas en Realtime:
--    select tablename from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'metas';
-- ============================================================================
