-- ============================================================================
-- M.E.T.A.S · Esquema de datos v2 · PROPUESTA (FASE 1: SOLO DISEÑO, rev. 2)
-- ----------------------------------------------------------------------------
-- ⚠️ NO EJECUTAR. Este archivo es un documento de diseño. Se pega en el SQL
--    Editor solo cuando se apruebe la fase de implementación, y DESPUÉS de la
--    fase de vinculación de cuentas (SUPABASE-V2-VINCULACION.sql): usa
--    metas.cuentas para saber quién es un docente de verdad.
--
-- Qué cambia respecto de hoy:
--   · Supabase es la ÚNICA fuente de verdad. Cada dato que el docente escribe
--     es UNA fila con id propio, no un pedazo de un blob.
--   · Nada se fusiona. Los datos que no son dinero se resuelven por `version`,
--     campo por campo. El DINERO nunca se resuelve solo: si dos aparatos no
--     coinciden, se le pregunta al docente con los dos valores a la vista.
--   · Nunca DELETE físico. Borrar es poner deleted_at con la hora del servidor;
--     una fila borrada no se edita ni se revive. Un alumno o una colecta con
--     pagos o notas activos NO se pueden borrar (se usa su estado).
--   · El dinero (pagos, gastos de colecta, gastos del docente y sus reembolsos,
--     pagos de convocatoria) y las actas de inventario solo se escriben con
--     funciones del servidor: no hay INSERT ni UPDATE directos, así que no
--     puede haber «upsert» de pagos. El monto de un pago numerado no cambia:
--     corregir es anular y crear otro que lo reemplaza.
--   · Una sesión anónima (padres) no puede leer ni escribir NINGUNA tabla del
--     docente: además de la política por dueño, cada tabla exige con una
--     política RESTRICTIVA que la sesión sea de una cuenta vinculada.
--   · Todo cambio queda en metas.auditoria, que es de solo inserción.
--   · Los totales se CALCULAN en vistas; no hay columnas de totales.
--
-- La base nueva empieza VACÍA. No hay migración automática. Las tablas viejas
-- se congelan aparte (SUPABASE-V2-CONGELAR.sql). Lo único que esta base
-- consulta del pasado es metas.claves_archivo: una COPIA INMUTABLE de las
-- claves de familia de cada docente, tomada en el paso 1 del congelado (y al
-- vincularse quien llegue después), para aceptar una clave ya entregada solo
-- si era de ESE docente (metas._clave_era_mia). El blob vivo no se lee.
--
-- Orden: SUPABASE-V2-VINCULACION.sql (crea el esquema, metas.cuentas,
-- metas.claves_archivo y el freno) → este archivo → SUPABASE-V2-FAMILIAS.sql
-- → paso 1 de SUPABASE-V2-CONGELAR.sql.
--
-- Todo vive en el esquema `metas`. Hay que añadirlo en Settings → API →
-- Exposed schemas.
-- ============================================================================

create schema if not exists metas;
revoke all on schema metas from public, anon;
grant usage on schema metas to authenticated, service_role;   -- service_role: las funciones de borde
-- Ninguna función de este esquema se puede llamar por defecto: cada una
-- recibe su GRANT a mano. (PostgreSQL da EXECUTE a PUBLIC si no se dice nada.)
-- (Que ninguna función nueva quede abierta a PUBLIC se hace al FINAL del
--  archivo con «revoke execute on all functions in schema metas from public»:
--  «alter default privileges … in schema» no alcanza, ver el cierre.)

-- ════════════════════════════════════════════════════════════════════════════
-- 0. Utilidades
-- ════════════════════════════════════════════════════════════════════════════

-- Nombre normalizado para comparar «Ana  María López» con «ana maria lopez».
-- IMMUTABLE (translate, no unaccent) para poder usarla en un índice.
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

-- Documento de identidad normalizado: mayúsculas, sin guiones ni espacios.
create or replace function metas.norm_documento(t text)
returns text language sql immutable parallel safe as $$
  select nullif(regexp_replace(upper(coalesce(t, '')), '[^0-9A-Z]', '', 'g'), '')
$$;

-- Clave de familia normalizada (sin guiones, mayúsculas).
create or replace function metas.norm_clave(t text)
returns text language sql immutable parallel safe as $$
  select nullif(regexp_replace(upper(coalesce(t, '')), '[^0-9A-Z]', '', 'g'), '')
$$;

-- Aparato que hizo la petición (cabecera x-metas-aparato, un uuid por
-- instalación). Fuera de una petición HTTP devuelve null.
create or replace function metas.aparato()
returns text language sql stable as $$
  select nullif(left(coalesce(
    current_setting('request.headers', true)::json ->> 'x-metas-aparato', ''), 64), '')
$$;

-- Operación de la cola que originó el cambio (cabecera x-metas-op).
create or replace function metas.op_actual()
returns uuid language plpgsql stable as $$
declare v text := current_setting('request.headers', true)::json ->> 'x-metas-op';
begin
  return v::uuid;
exception when others then
  return null;
end $$;

-- ¿La sesión es de un DOCENTE vinculado? Falso para sesiones anónimas
-- (padres), para anon y para cualquier usuario de Auth sin fila en
-- metas.cuentas. Es la llave de todas las políticas restrictivas.
create or replace function metas.es_docente()
returns boolean language sql stable security definer set search_path = metas, pg_temp as $$
  select coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
     and exists (select 1 from metas.cuentas c where c.auth_uid = (select auth.uid()))
$$;
grant execute on function metas.es_docente() to authenticated;
-- Los disparadores corren con los permisos de quien escribe: necesitan poder
-- llamar a estas utilidades (no leen ni escriben nada por sí mismas).
grant execute on function metas.norm_nombre(text), metas.norm_documento(text), metas.norm_clave(text),
                          metas.aparato(), metas.op_actual() to authenticated;

-- Letras sin I, O, 0 ni 1 (no se confunden al dictar ni al copiar). 32
-- símbolos: un byte al azar módulo 32 sale parejo (256 = 8 × 32).
create or replace function metas.letras_azar(n int)
returns text language sql volatile as $$
  select string_agg(substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', (get_byte(b, i) % 32) + 1, 1), '' order by i)
    from (select extensions.gen_random_bytes(n) as b) x, generate_series(0, n - 1) i
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- 1. Columnas comunes a TODA fila del docente
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists metas._fila (
  id           uuid        primary key default gen_random_uuid(),  -- lo genera el aparato UNA vez (crypto.randomUUID)
  owner        uuid        not null default auth.uid(),            -- dueño de la cuenta (auth.users.id)
  created_at   timestamptz not null default now(),                 -- hora del SERVIDOR
  updated_at   timestamptz not null default now(),                 -- hora del SERVIDOR
  updated_by   uuid        not null default auth.uid(),
  device_id    text        not null default 'desconocido' check (length(device_id) between 1 and 64),
  deleted_at   timestamptz,                                         -- borrado lógico / anulación
  version      integer     not null default 1 check (version >= 1), -- control de concurrencia
  -- Operación de la cola que CREÓ la fila. Si al reenviar un `crear` choca la
  -- llave primaria, se compara: mismo op_creacion = ya estaba hecho; distinto
  -- = otro dato con ese id (no debería pasar nunca) y se rechaza sin pisar.
  op_creacion  uuid
);
revoke all on metas._fila from public, anon, authenticated;

-- ── Sello: lo que el aparato NO puede decidir ──────────────────────────────
-- Corre PRIMERO (su disparador se llama «<tabla>_10_sellar»; los BEFORE
-- corren en orden alfabético). Antes que nada exige una cuenta de docente,
-- así una sesión anónima no llega ni a tocar índices únicos (no puede
-- averiguar si una clave existe intentando insertarla).
-- TG_ARGV = columnas que no se pueden cambiar después de crear la fila.
create or replace function metas.t_sellar()
returns trigger language plpgsql set search_path = metas, pg_temp as $$
declare
  v_uid uuid := auth.uid();
  v_ap  text := metas.aparato();
  c     text;
begin
  if v_uid is null or not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;

  if tg_op = 'INSERT' then
    new.id           := coalesce(new.id, gen_random_uuid());
    new.owner        := v_uid;
    new.created_at   := now();
    new.updated_at   := now();
    new.updated_by   := v_uid;
    new.device_id    := coalesce(v_ap, nullif(new.device_id, ''), 'desconocido');
    new.version      := 1;
    new.deleted_at   := null;          -- nada nace borrado
    new.op_creacion  := coalesce(new.op_creacion, metas.op_actual());
    return new;
  end if;

  -- UPDATE ------------------------------------------------------------------
  if old.deleted_at is not null then
    raise exception 'metas: la fila % está borrada', old.id using errcode = 'MT001';
  end if;
  if new.id is distinct from old.id
     or new.owner is distinct from old.owner
     or new.created_at is distinct from old.created_at
     or new.op_creacion is distinct from old.op_creacion then
    raise exception 'metas: id, dueño, creación y operación de creación no se cambian' using errcode = 'MT002';
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
-- Al crear una fila hija (o cambiarle el padre), el padre tiene que existir y
-- NO estar borrado. FOR SHARE bloquea el borrado simultáneo del padre: un
-- alumno no se puede borrar en el mismo instante en que otro aparato le
-- anota una nota (ver t_borrado_protegido).
-- TG_ARGV en pares: columna, tabla.
-- SECURITY DEFINER porque FOR SHARE exige permiso de UPDATE sobre la tabla
-- padre, y las tablas de dinero (gastos_docente, por ejemplo) no lo dan a
-- nadie. Como corre sin RLS, comprueba ella misma que el padre sea del MISMO
-- dueño que la fila nueva (las llaves compuestas lo vuelven a exigir).
create or replace function metas.t_padres_activos()
returns trigger language plpgsql security definer set search_path = metas, pg_temp as $$
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
    execute format('select deleted_at is not null from metas.%I where id = $1 and owner = $2 for share', v_tab)
      into v_borrada using v_id, new.owner;
    if v_borrada is null or v_borrada then
      raise exception 'metas: % % no existe o está borrado', v_tab, v_id using errcode = 'MT003';
    end if;
  end loop;
  return new;
end $$;

-- ── Borrado protegido ──────────────────────────────────────────────────────
-- No se borra un alumno con pagos o notas activos, ni un aula con alumnos,
-- colectas o gastos activos, ni una colecta con pagos o gastos activos. Para el alumno que se va está su estado (retirado,
-- trasladado, desertor); para la colecta, cerrarla. Así nunca desaparece
-- dinero de los totales por borrar al dueño.
create or replace function metas.t_borrado_protegido()
returns trigger language plpgsql set search_path = metas, pg_temp as $$
begin
  if old.deleted_at is not null or new.deleted_at is null then
    return new;
  end if;
  -- PRIMERO se toma la fila con FOR UPDATE: espera a que terminen las
  -- transacciones que la tienen tomada FOR SHARE (un pago, una nota o una
  -- colecta que se están creando sobre ella) y, como en READ COMMITTED cada
  -- consulta de abajo ve lo ya confirmado, las comprobaciones ven ese pago o
  -- esa nota. Sin esto, borrar el aula y crear un pago a la vez pasaban los dos.
  execute format('select 1 from metas.%I where id = $1 for update', tg_table_name) using old.id;
  if tg_table_name = 'alumnos' then
    if exists (select 1 from metas.pagos where alumno_id = old.id and deleted_at is null)
       or exists (select 1 from metas.notas where alumno_id = old.id and deleted_at is null) then
      raise exception 'metas: el alumno tiene pagos o notas; usa su estado (retirado, trasladado)'
        using errcode = 'MT007';
    end if;
  elsif tg_table_name = 'aulas' then
    -- Un aula solo se borra VACÍA: sin alumnos, colectas ni gastos activos
    -- (y por tanto sin pagos ni notas, que cuelgan de ellos).
    if exists (select 1 from metas.alumnos  where aula_id = old.id and deleted_at is null)
       or exists (select 1 from metas.colectas where aula_id = old.id and deleted_at is null)
       or exists (select 1 from metas.gastos   where aula_id = old.id and deleted_at is null)
       or exists (select 1 from metas.gastos_docente where aula_id = old.id and deleted_at is null)
       or exists (select 1 from metas.pagos    where aula_id = old.id and deleted_at is null)
       or exists (select 1 from metas.notas    where aula_id = old.id and deleted_at is null) then
      raise exception 'metas: el aula tiene alumnos, colectas o gastos; no se borra'
        using errcode = 'MT007';
    end if;
  elsif tg_table_name = 'colectas' then
    if exists (select 1 from metas.pagos  where colecta_id = old.id and deleted_at is null)
       or exists (select 1 from metas.gastos where colecta_id = old.id and deleted_at is null) then
      raise exception 'metas: la colecta tiene pagos o gastos; ciérrala en vez de borrarla'
        using errcode = 'MT007';
    end if;
  end if;
  return new;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- 2. Auditoría (solo inserción; nadie la edita ni la borra)
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists metas.auditoria (
  id          bigint      generated always as identity primary key,
  ocurrido_at timestamptz not null default clock_timestamp(),
  tabla       text        not null,
  fila_id     uuid        not null,
  owner       uuid        not null,
  accion      text        not null check (accion in ('crear', 'editar', 'borrar')),
  antes       jsonb,
  despues     jsonb       not null,
  campos      text[],
  actor       uuid,
  device_id   text,
  op_id       uuid,
  txid        bigint      not null default txid_current()
);
create index if not exists auditoria_fila_idx  on metas.auditoria (fila_id, id);
create index if not exists auditoria_owner_idx on metas.auditoria (owner, ocurrido_at desc);

alter table metas.auditoria enable row level security;
create policy auditoria_leer on metas.auditoria
  for select to authenticated using (owner = (select auth.uid()));
create policy auditoria_solo_docentes on metas.auditoria as restrictive
  for all to authenticated using ((select metas.es_docente())) with check ((select metas.es_docente()));
revoke all on metas.auditoria from public, anon, authenticated, service_role;
grant select on metas.auditoria to authenticated;

create or replace function metas.t_auditoria_inmutable()
returns trigger language plpgsql as $$
begin
  raise exception 'metas: la auditoría es de solo inserción' using errcode = 'MT006';
end $$;
create trigger auditoria_sin_update before update or delete on metas.auditoria
  for each row execute function metas.t_auditoria_inmutable();
create trigger auditoria_sin_truncate before truncate on metas.auditoria
  for each statement execute function metas.t_auditoria_inmutable();

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
          auth.uid(), new.device_id, coalesce(metas.op_actual(), new.op_creacion));
  return null;
end $$;

-- ── Rechazos de la cola (soporte) ──────────────────────────────────────────
-- Solo inserción, con tope de tamaño (16 KB por operación, 500 caracteres de
-- motivo) y de frecuencia (200 por hora por cuenta; lo que pase de ahí se
-- descarta en silencio para que un aparato con un error no llene la base).
create table if not exists metas.rechazos (
  id          bigint      generated always as identity primary key,
  ocurrido_at timestamptz not null default now(),
  owner       uuid        not null default auth.uid(),
  device_id   text        default metas.aparato() check (length(device_id) <= 64),
  operacion   jsonb       not null check (pg_column_size(operacion) <= 16384),
  codigo      text        check (length(codigo) <= 20),
  motivo      text        check (length(motivo) <= 500)
);
create index if not exists rechazos_owner_idx on metas.rechazos (owner, ocurrido_at desc);
alter table metas.rechazos enable row level security;
create policy rechazos_crear on metas.rechazos for insert to authenticated
  with check (owner = (select auth.uid()));
create policy rechazos_leer on metas.rechazos for select to authenticated
  using (owner = (select auth.uid()));
create policy rechazos_solo_docentes on metas.rechazos as restrictive
  for all to authenticated using ((select metas.es_docente())) with check ((select metas.es_docente()));
revoke all on metas.rechazos from public, anon, authenticated;
grant insert, select on metas.rechazos to authenticated;
create trigger rechazos_sin_update before update or delete on metas.rechazos
  for each row execute function metas.t_auditoria_inmutable();

create or replace function metas.t_rechazos_tope()
returns trigger language plpgsql security definer set search_path = metas, pg_temp as $$
begin
  new.owner := auth.uid();
  new.ocurrido_at := now();
  if (select count(*) from metas.rechazos
       where owner = new.owner and ocurrido_at > now() - interval '1 hour') >= 200 then
    return null;                      -- tope por hora: se descarta
  end if;
  return new;
end $$;
create trigger rechazos_tope before insert on metas.rechazos
  for each row execute function metas.t_rechazos_tope();

-- ════════════════════════════════════════════════════════════════════════════
-- 3. Preparar una tabla: RLS, permisos, disparadores y Realtime
-- ════════════════════════════════════════════════════════════════════════════
-- p_escritura: 'directa' → INSERT y UPDATE por la API (con RLS);
--              'solo_editar' → solo UPDATE por la API; se crea con una función
--                              del servidor (alumnos);
--              'funciones' → ni INSERT ni UPDATE por la API (dinero).
create or replace function metas._preparar(
  p_tabla text, p_inmutables text[] default '{}', p_padres text[] default '{}',
  p_escritura text default 'directa'
) returns void language plpgsql as $$
declare
  t text := format('metas.%I', p_tabla);
begin
  execute format('alter table %s enable row level security', t);
  execute format('create policy %I on %s for select to authenticated using (owner = (select auth.uid()))',
                 p_tabla || '_leer', t);
  execute format('create policy %I on %s for insert to authenticated with check (owner = (select auth.uid()))',
                 p_tabla || '_crear', t);
  execute format('create policy %I on %s for update to authenticated using (owner = (select auth.uid())) with check (owner = (select auth.uid()))',
                 p_tabla || '_editar', t);
  -- RESTRICTIVA: además de ser el dueño, la sesión tiene que ser de un
  -- docente vinculado. Una sesión anónima de padre (rol authenticated) no
  -- lee, no crea y no edita nada aquí, ni siquiera "lo suyo".
  execute format('create policy %I on %s as restrictive for all to authenticated using ((select metas.es_docente())) with check ((select metas.es_docente()))',
                 p_tabla || '_solo_docentes', t);

  execute format('revoke all on %s from public, anon, authenticated', t);
  execute format('grant select on %s to authenticated', t);
  if p_escritura = 'directa' then
    execute format('grant insert, update on %s to authenticated', t);
  elsif p_escritura = 'solo_editar' then
    execute format('grant update on %s to authenticated', t);
  end if;

  execute format('create trigger %I before insert or update on %s for each row execute function metas.t_sellar(%s)',
                 p_tabla || '_10_sellar', t,
                 coalesce((select string_agg(quote_literal(x), ',') from unnest(p_inmutables) x), ''));
  if array_length(p_padres, 1) > 0 then
    execute format('create trigger %I before insert or update on %s for each row execute function metas.t_padres_activos(%s)',
                   p_tabla || '_20_padres', t,
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
-- 4. Tablas
-- ════════════════════════════════════════════════════════════════════════════
-- Llaves foráneas COMPUESTAS (hijo.padre_id, hijo.owner[, aula_id]) → padre:
-- la base impide colgar una fila propia de una fila de otra cuenta, y mezclar
-- aulas, aunque alguien adivine el uuid.

-- ── 4.1 aulas ──────────────────────────────────────────────────────────────
create table if not exists metas.aulas (
  like metas._fila including all,
  escuela          text    not null check (length(escuela) between 1 and 160),
  codigo_centro    text             check (length(codigo_centro) <= 30),
  grado            smallint not null check (grado between 0 and 12),   -- 0 = Prebásica
  seccion          text    not null check (seccion ~ '^[0-9A-Za-z]{1,3}$'),
  anio_lectivo     smallint not null check (anio_lectivo between 2020 and 2100),
  jornada          text,
  modalidad        text,
  director         text,
  docente_nombre   text,
  lugar            text,
  aldea            text,
  municipio        text,
  departamento     text,
  escala_personalidad text[] not null default '{S,MB,B}',
  edad_corte       date,
  observacion_grado text check (length(observacion_grado) <= 500),
  logo_path        text,
  logo_sec_path    text,
  ajustes          jsonb   not null default '{}'::jsonb,
  unique (id, owner)
);
create unique index if not exists aulas_unica on metas.aulas
  (owner, metas.norm_nombre(escuela), grado, upper(seccion), anio_lectivo)
  where deleted_at is null;

-- ── 4.2 periodos ───────────────────────────────────────────────────────────
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

-- ── 4.3 asignaturas (con id: renombrar no mueve notas) ─────────────────────
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
-- La identidad (país + documento) es la ÚNICA regla dura. El nombre repetido
-- es solo un aviso: dos alumnos pueden llamarse igual. El número de lista es
-- visual: no es único ni llave de nada. Se CREA solo con metas.alumno_crear
-- (para poder preguntar «¿es la misma persona?»); se EDITA por la API.
create table if not exists metas.alumnos (
  like metas._fila including all,
  aula_id          uuid not null,
  nombre_completo  text not null check (length(trim(nombre_completo)) between 3 and 120),
  nombre_norm      text generated always as (metas.norm_nombre(nombre_completo)) stored,
  identidad        text check (identidad ~ '^[0-9A-Z]{4,25}$'),        -- normalizada; null = falta (aviso discreto)
  documento_pais   text not null default 'HN' check (documento_pais ~ '^[A-Z]{2}$'),
  documento_tipo   text not null default 'identidad'
                   check (documento_tipo in ('identidad', 'cui', 'partida', 'pasaporte', 'otro')),
  num_lista        smallint check (num_lista between 1 and 99),
  sexo             text check (sexo in ('F', 'M')),
  fecha_nacimiento date,
  estado           text not null default 'activo'
                   check (estado in ('activo', 'ingreso', 'retirado', 'trasladado', 'desertor')),
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
create unique index if not exists alumnos_identidad_unica on metas.alumnos (aula_id, documento_pais, identidad)
  where deleted_at is null and identidad is not null;
create index if not exists alumnos_nombre_idx on metas.alumnos (aula_id, nombre_norm)   -- NO único
  where deleted_at is null;

-- ── 4.5 familias ───────────────────────────────────────────────────────────
-- La clave de familia la pone la BASE:
--   · nueva: 10 símbolos al azar de 32 (50 bits), por ejemplo K7QMX-4PA2B;
--   · conservada: la que la familia ya tiene en papel (15-K7QM), aceptada
--     SOLO si aparece en los datos congelados de ESTE MISMO docente.
-- No se cambia: si se pierde la tira, se borra esta fila y se crea otra (los
-- teléfonos vinculados con la clave vieja dejan de ver al instante).
create table if not exists metas.familias (
  like metas._fila including all,
  aula_id              uuid not null,
  alumno_id            uuid not null,
  encargado_nombre     text check (length(encargado_nombre) <= 120),
  encargado_identidad  text check (encargado_identidad ~ '^[0-9A-Z]{4,25}$'),
  parentesco           text check (length(parentesco) <= 40),
  telefono             text check (telefono ~ '^[0-9 +()-]{8,20}$'),
  telefono_alumno      text check (telefono_alumno ~ '^[0-9 +()-]{8,20}$'),
  clave                text not null default '',   -- normalizada, sin guiones; la pone t_clave_familia
  clave_origen         text not null default 'nueva' check (clave_origen in ('nueva', 'conservada')),
  check (clave ~ '^([A-HJ-NP-Z2-9]{10}|[0-9]{1,2}[A-Z0-9]{4})$'),
  foreign key (alumno_id, owner, aula_id) references metas.alumnos (id, owner, aula_id)
);
create unique index if not exists familias_alumno_unica on metas.familias (alumno_id)
  where deleted_at is null;
create unique index if not exists familias_clave_unica on metas.familias (clave)
  where deleted_at is null;

-- ¿Esta clave era de este docente? Se busca en metas.claves_archivo, la copia
-- INMUTABLE tomada en el paso 1 del congelado (o al vincularse, para quien se
-- vincule después). NO se lee el blob vivo: así una clave que alguien meta
-- hoy en su copia vieja no se puede «conservar».
create or replace function metas._clave_era_mia(p_owner uuid, p_clave text)
returns boolean language sql stable security definer set search_path = metas, pg_temp as $$
  select exists (
    select 1
      from metas.cuentas c
      join metas.claves_archivo a on a.docente_codigo = c.docente_codigo
     where c.auth_uid = p_owner
       and a.clave = p_clave
  )
$$;

create or replace function metas.t_clave_familia()
returns trigger language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_pedida text := metas.norm_clave(new.clave);
  v_intento int := 0;
begin
  if tg_op = 'UPDATE' then
    if new.clave is distinct from old.clave or new.clave_origen is distinct from old.clave_origen then
      raise exception 'metas: la clave de familia no se cambia; se crea otra familia' using errcode = 'MT002';
    end if;
    return new;
  end if;
  if v_pedida is not null then
    if not metas._clave_era_mia(new.owner, v_pedida) then
      raise exception 'metas: esa clave no está en tus datos anteriores' using errcode = 'MT020';
    end if;
    new.clave := v_pedida;
    new.clave_origen := 'conservada';
    return new;
  end if;
  loop
    v_intento := v_intento + 1;
    new.clave := metas.letras_azar(10);
    exit when not exists (select 1 from metas.familias where clave = new.clave and deleted_at is null);
    if v_intento >= 10 then
      raise exception 'metas: no se pudo generar una clave' using errcode = 'MT021';
    end if;
  end loop;
  new.clave_origen := 'nueva';
  return new;
end $$;

-- ── 4.6 colectas y exenciones ──────────────────────────────────────────────
create table if not exists metas.colectas (
  like metas._fila including all,
  aula_id         uuid not null,
  concepto        text not null check (length(concepto) between 1 and 120),
  monto_sugerido  numeric(12,2) not null check (monto_sugerido >= 0),
  fecha           date not null,
  estado          text not null default 'abierta' check (estado in ('abierta', 'cerrada')),
  unique (id, owner, aula_id),
  foreign key (aula_id, owner) references metas.aulas (id, owner)
);

-- A quién NO le corresponde una colecta, o le corresponde MENOS.
--   monto_aplicable null → exento del todo (le corresponde 0)
--   monto_aplicable 25   → exento parcial (le corresponde 25 en vez del sugerido)
create table if not exists metas.colecta_exenciones (
  like metas._fila including all,
  aula_id          uuid not null,
  colecta_id       uuid not null,
  alumno_id        uuid not null,
  monto_aplicable  numeric(12,2) check (monto_aplicable >= 0),
  motivo           text check (length(motivo) <= 120),
  foreign key (colecta_id, owner, aula_id) references metas.colectas (id, owner, aula_id),
  foreign key (alumno_id, owner, aula_id)  references metas.alumnos  (id, owner, aula_id)
);
create unique index if not exists colecta_exenciones_unica on metas.colecta_exenciones
  (colecta_id, alumno_id) where deleted_at is null;

-- ── 4.7 pagos ──────────────────────────────────────────────────────────────
-- · Un alumno puede tener VARIOS pagos en la misma colecta (abonos), cada uno
--   con su recibo.
-- · El recibo lo numera la base; es único en todo el sistema e inmutable.
-- · El MONTO y la FECHA no cambian una vez numerado. Corregir cualquiera de
--   los dos = anular este pago y crear otro con reemplaza_a = este id
--   (metas.pago_corregir, en una sola transacción). Anular = deleted_at + motivo; el recibo anulado queda en la
--   auditoría.
-- · Solo se escribe con las funciones metas.pago_*: no hay INSERT ni UPDATE
--   por la API, así que tampoco hay upsert posible.
create table if not exists metas.pagos (
  like metas._fila including all,
  aula_id            uuid not null,
  colecta_id         uuid not null,
  alumno_id          uuid not null,
  monto              numeric(12,2) not null check (monto > 0),
  fecha              date not null,                 -- día en que entró el dinero
  nota               text check (length(nota) <= 200),
  recibo             text not null default '',      -- lo pone t_numerar_recibo
  recibo_anterior    text check (recibo_anterior ~ '^RC-[0-9A-Z]{2,8}-[0-9]{1,4}$'),
  reemplaza_a        uuid unique references metas.pagos (id),   -- un pago se reemplaza UNA vez
  reemplaza_recibo   text,                          -- copia del recibo reemplazado (la familia lo ve)
  anulado_motivo     text check (length(anulado_motivo) <= 200),
  foreign key (colecta_id, owner, aula_id) references metas.colectas (id, owner, aula_id),
  foreign key (alumno_id, owner, aula_id)  references metas.alumnos  (id, owner, aula_id),
  check (deleted_at is null or anulado_motivo is not null)
);
create unique index if not exists pagos_recibo_unico on metas.pagos (recibo);
create unique index if not exists pagos_recibo_anterior_unico on metas.pagos (owner, recibo_anterior)
  where deleted_at is null and recibo_anterior is not null;
create index if not exists pagos_alumno_colecta on metas.pagos (colecta_id, alumno_id) where deleted_at is null;
create index if not exists pagos_aula_idx on metas.pagos (aula_id) where deleted_at is null;

-- ── 4.8 gastos de una colecta ──────────────────────────────────────────────
-- Lo gastado del dinero de una colecta («cuentas claras»). Los gastos que el
-- docente paga de su bolsillo van aparte (4.8b). Dinero: solo con las
-- funciones metas.gasto_*.
create table if not exists metas.gastos (
  like metas._fila including all,
  aula_id       uuid not null,
  colecta_id    uuid not null,
  fecha         date not null,
  concepto      text not null check (length(concepto) between 1 and 160),
  categoria     text check (length(categoria) <= 60),
  monto         numeric(12,2) not null check (monto > 0),
  tiene_factura boolean not null default false,
  anulado_motivo text check (length(anulado_motivo) <= 200),
  foreign key (aula_id, owner)             references metas.aulas    (id, owner),
  foreign key (colecta_id, owner, aula_id) references metas.colectas (id, owner, aula_id)
);
create index if not exists gastos_colecta_idx on metas.gastos (colecta_id) where deleted_at is null;

-- ── 4.8b gastos del docente y sus reembolsos ───────────────────────────────
-- Lo que el docente paga de su bolsillo y luego cobra (a la dirección, a la
-- sociedad de padres, a una familia…). Antes: st.gastos en METAS_ADMIN_V1,
-- con un estado escrito a mano y una sola fecha de cobro.
-- · El ESTADO (por cobrar, reembolsado parcial, reembolsado total), lo que
--   falta y los DÍAS DE ESPERA se CALCULAN de los reembolsos (v_gastos_docente);
--   no se guardan, así nunca contradicen al dinero que de verdad entró.
-- · Cada reembolso es una fila aparte, con monto inmutable (corregir = anular
--   + nuevo con reemplaza_a), igual que los pagos.
-- · Dinero: solo con las funciones metas.gasto_docente_* y metas.reembolso_*.
create table if not exists metas.gastos_docente (
  like metas._fila including all,
  aula_id       uuid,                                   -- opcional: si el gasto fue para un aula
  fecha         date not null,
  tipo          text not null check (length(tipo) between 1 and 60),   -- material, transporte, impresión…
  concepto      text not null check (length(concepto) between 1 and 160),
  cobrar_a      text not null check (length(cobrar_a) between 1 and 120),
  tiene_recibo  boolean not null default false,
  monto         numeric(12,2) not null check (monto > 0),
  escuela       text check (length(escuela) <= 160),
  -- El docente puede dar por perdido lo que falta («ya no lo voy a cobrar»):
  -- es una decisión que él escribe, no un cálculo.
  no_se_cobrara boolean not null default false,
  anulado_motivo text check (length(anulado_motivo) <= 200),
  unique (id, owner),
  foreign key (aula_id, owner) references metas.aulas (id, owner)
);
create index if not exists gastos_docente_fecha on metas.gastos_docente (owner, fecha) where deleted_at is null;

create table if not exists metas.reembolsos (
  like metas._fila including all,
  gasto_id        uuid not null,
  fecha           date not null,                         -- día en que le devolvieron el dinero
  monto           numeric(12,2) not null check (monto > 0),
  quien_pago      text check (length(quien_pago) <= 120),
  nota            text check (length(nota) <= 200),
  reemplaza_a     uuid unique references metas.reembolsos (id),
  anulado_motivo  text check (length(anulado_motivo) <= 200),
  check (deleted_at is null or anulado_motivo is not null),
  foreign key (gasto_id, owner) references metas.gastos_docente (id, owner)
);
create index if not exists reembolsos_gasto on metas.reembolsos (gasto_id) where deleted_at is null;

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
  -- Qué ve la familia: llamados, faltas leves y felicitaciones, solo si el
  -- docente lo deja marcado y mientras no venza visible_hasta. El expediente
  -- es interno: la base NO deja marcarlo para la familia.
  para_familia    boolean not null default true,
  check (tipo <> 'expediente' or para_familia = false),
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

-- ── 4.19 inventario del aula: bienes y actas ───────────────────────────────
-- Un bien = una fila. Propietario:
--   'docente' → es del docente (lo compró o lo trajo él);
--   'centro'  → es del centro educativo y el docente lo tiene BAJO CUSTODIA.
-- Si el centro le reembolsa al docente un bien suyo, se anotan la fecha (y,
-- si se quiere, el monto) del reembolso y el bien pasa a ser del centro. No se
-- borra ni se copia nada: es la MISMA fila, y su historia (de quién fue,
-- desde cuándo, cuánto valía) queda en la auditoría y en v_bien_historia.
-- La base solo deja pasar de 'docente' a 'centro', y solo con fecha de
-- reembolso o marcado como donado al centro.
create table if not exists metas.bienes (
  like metas._fila including all,
  aula_id          uuid,                                   -- opcional
  centro           text not null check (length(centro) between 1 and 160),
  fecha_desde      date not null,                          -- desde cuándo está en el aula
  cantidad         numeric(10,2) not null default 1 check (cantidad > 0),
  descripcion      text not null check (length(descripcion) between 1 and 200),
  tipo             text check (length(tipo) <= 60),        -- mobiliario, libros, equipo, material…
  nota             text check (length(nota) <= 300),
  tiene_recibo     boolean not null default false,
  valor            numeric(12,2) check (valor >= 0),       -- valor total del renglón
  propietario      text not null check (propietario in ('docente', 'centro')),
  origen           text check (origen in ('compra_docente', 'del_centro', 'donacion')),
  donante          text check (length(donante) <= 120),
  -- paso de docente → centro:
  reembolso_fecha  date,
  reembolso_monto  numeric(12,2) check (reembolso_monto >= 0),
  donado_al_centro boolean not null default false,
  pasa_al_centro_at date,                                  -- cuándo pasó a ser del centro (si fue del docente)
  gasto_docente_id uuid,                                   -- opcional: el gasto con que el docente lo compró
  foreign key (gasto_docente_id, owner) references metas.gastos_docente (id, owner),
  check (propietario = 'docente' or pasa_al_centro_at is null
         or reembolso_fecha is not null or donado_al_centro),
  foreign key (aula_id, owner) references metas.aulas (id, owner)
);
create index if not exists bienes_centro on metas.bienes (owner, metas.norm_nombre(centro)) where deleted_at is null;

create or replace function metas.t_bien_propietario()
returns trigger language plpgsql set search_path = metas, pg_temp as $$
begin
  if tg_op = 'UPDATE' and new.propietario is distinct from old.propietario then
    if not (old.propietario = 'docente' and new.propietario = 'centro') then
      raise exception 'metas: un bien solo pasa de docente a centro' using errcode = 'MT030';
    end if;
    if new.reembolso_fecha is null and not new.donado_al_centro then
      raise exception 'metas: falta la fecha de reembolso (o marcarlo como donado)' using errcode = 'MT030';
    end if;
    new.pasa_al_centro_at := coalesce(new.reembolso_fecha, current_date);
  end if;
  return new;
end $$;

-- Actas de inventario: versiones FECHADAS. La primera, al empezar; las
-- siguientes, cada 3 meses (v_proxima_acta dice cuándo toca). Un acta es un
-- documento: fija lo que había ese día y no se edita. Si tenía un error, se
-- anula (con motivo) y se hace otra que la reemplaza. La crea SOLO la función
-- metas.acta_inventario_crear, que toma la foto de los bienes en el servidor
-- (el aparato no puede inventar su contenido).
create table if not exists metas.actas_inventario (
  like metas._fila including all,
  centro           text not null,
  numero           integer not null check (numero >= 1),   -- 1 = primera acta
  fecha            date not null,
  periodo_desde    date,                                   -- fecha del acta anterior (null en la primera)
  entrega          text check (length(entrega) <= 120),
  recibe           text check (length(recibe) <= 120),
  contenido        jsonb not null check (jsonb_typeof(contenido) = 'array'),  -- bienes activos ese día
  totales          jsonb not null check (jsonb_typeof(totales) = 'object'),   -- fijados en el acta (es un documento)
  reemplaza_a      uuid unique references metas.actas_inventario (id),
  anulado_motivo   text check (length(anulado_motivo) <= 200),
  check (deleted_at is null or anulado_motivo is not null)
);
create unique index if not exists actas_inventario_numero on metas.actas_inventario
  (owner, metas.norm_nombre(centro), numero) where deleted_at is null;

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
-- Dinero cobrado en una convocatoria: MISMO trato que metas.pagos (abonos,
-- recibo numerado por la base, monto inmutable, corregir = anular + nuevo,
-- solo por funciones del servidor). Sus funciones se escriben en el corte
-- de convocatorias; mientras tanto la tabla no tiene permiso de escritura.
create table if not exists metas.convocatoria_pagos (
  like metas._fila including all,
  convocatoria_id uuid not null,
  huella          text not null,       -- nombre|grado|sección normalizados
  monto           numeric(12,2) not null check (monto > 0),
  fecha           date not null,
  abordo          smallint check (abordo >= 0),
  recibo          text not null default '',
  recibo_anterior text check (recibo_anterior ~ '^RC-[0-9A-Z]{2,8}-[0-9]{1,4}$'),
  reemplaza_a     uuid unique references metas.convocatoria_pagos (id),
  anulado_motivo  text check (length(anulado_motivo) <= 200),
  foreign key (convocatoria_id, owner) references metas.convocatorias (id, owner)
);
create index if not exists convocatoria_pagos_huella on metas.convocatoria_pagos
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
-- 5. Aplicar RLS (dueño + solo docentes), sello, padres activos, sin-DELETE,
--    auditoría y Realtime
-- ════════════════════════════════════════════════════════════════════════════
-- Argumentos: tabla, columnas inmutables, pares (columna, tabla padre),
-- escritura ('directa' | 'solo_editar' | 'funciones').
select metas._preparar('aulas',            '{}');
select metas._preparar('periodos',         '{aula_id}',                 '{aula_id,aulas}');
select metas._preparar('asignaturas',      '{aula_id}',                 '{aula_id,aulas}');
select metas._preparar('alumnos',          '{aula_id}',                 '{aula_id,aulas}', 'solo_editar');
select metas._preparar('familias',         '{aula_id,alumno_id,clave,clave_origen}', '{alumno_id,alumnos}');
select metas._preparar('colectas',         '{aula_id}',                 '{aula_id,aulas}');
select metas._preparar('colecta_exenciones','{aula_id,colecta_id,alumno_id}', '{colecta_id,colectas,alumno_id,alumnos}');
select metas._preparar('pagos',            '{aula_id,colecta_id,alumno_id,monto,fecha,recibo,reemplaza_a,reemplaza_recibo}',
                                           '{colecta_id,colectas,alumno_id,alumnos}', 'funciones');
select metas._preparar('gastos',           '{aula_id,colecta_id}',      '{aula_id,aulas,colecta_id,colectas}', 'funciones');
select metas._preparar('gastos_docente',   '{}',                        '{aula_id,aulas}', 'funciones');
select metas._preparar('reembolsos',       '{gasto_id,monto,fecha,reemplaza_a}', '{gasto_id,gastos_docente}', 'funciones');
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
select metas._preparar('bienes',           '{}',                        '{aula_id,aulas,gasto_docente_id,gastos_docente}');
select metas._preparar('actas_inventario', '{centro,numero,fecha,periodo_desde,entrega,recibe,contenido,totales,reemplaza_a}',
                                           '{}', 'funciones');
select metas._preparar('convocatorias',    '{}');
select metas._preparar('convocatoria_inscritos','{convocatoria_id}',    '{convocatoria_id,convocatorias}');
select metas._preparar('convocatoria_pagos','{convocatoria_id,huella,monto,recibo,reemplaza_a}',
                                           '{convocatoria_id,convocatorias}', 'funciones');
select metas._preparar('campeonatos',      '{}');
select metas._preparar('elecciones',       '{}');
select metas._preparar('eleccion_votos',   '{eleccion_id,codigo_usado}', '{eleccion_id,elecciones}');
select metas._preparar('ajustes_docente',  '{clave}');

-- Disparadores propios de algunas tablas (después del sello: «_10_» < «_25_» < «_30_»)
create trigger aulas_25_protegido    before update on metas.aulas
  for each row execute function metas.t_borrado_protegido();
create trigger alumnos_25_protegido  before update on metas.alumnos
  for each row execute function metas.t_borrado_protegido();
create trigger colectas_25_protegido before update on metas.colectas
  for each row execute function metas.t_borrado_protegido();
create trigger familias_30_clave     before insert or update on metas.familias
  for each row execute function metas.t_clave_familia();
create trigger bienes_30_propietario before update on metas.bienes
  for each row execute function metas.t_bien_propietario();

revoke all on function metas._preparar(text, text[], text[], text) from public, anon, authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 5b. Números de recibo: únicos, inmutables, puestos por el servidor
-- ════════════════════════════════════════════════════════════════════════════
-- Formato: RC-<año 2 cifras>-<serie del docente 4 símbolos>-<correlativo 4 cifras>
--   ej. RC-27-K7QM-0001   (el viejo era RC-03EX-12: tres partes, no cuatro)
-- · La serie (32^4 ≈ 1 millón de combinaciones) es única por CUENTA REAL de
--   docente; se crea sola con el primer pago, con un máximo de 20 intentos.
-- · El correlativo es por docente y año, sin huecos: el contador se sube en la
--   misma transacción que crea el pago; si el pago se rechaza, vuelve atrás.
-- · Sin señal, el pago se ve con «recibo pendiente» hasta que llega.
create table if not exists metas.recibo_series (
  owner      uuid primary key,
  prefijo    text not null unique check (prefijo ~ '^[A-HJ-NP-Z2-9]{4}$'),
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
create policy recibo_series_mia on metas.recibo_series for select to authenticated
  using (owner = (select auth.uid()));
create policy recibo_series_solo_docentes on metas.recibo_series as restrictive
  for all to authenticated using ((select metas.es_docente())) with check ((select metas.es_docente()));
create policy recibo_contadores_solo_docentes on metas.recibo_contadores as restrictive
  for all to authenticated using ((select metas.es_docente())) with check ((select metas.es_docente()));
revoke all on metas.recibo_series, metas.recibo_contadores from public, anon, authenticated;
grant select on metas.recibo_series to authenticated;

create or replace function metas.t_numerar_recibo()
returns trigger language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_pre    text;
  v_anio   smallint := (extract(year from now() at time zone 'America/Tegucigalpa')::int % 100);
  v_n      integer;
  v_intento int := 0;
begin
  -- Solo cuentas reales de docente (el sello ya lo exigió; se repite porque
  -- esta función escribe en tablas sin RLS de por medio).
  if not exists (select 1 from metas.cuentas where auth_uid = new.owner) then
    raise exception 'metas: solo una cuenta de docente numera recibos' using errcode = '42501';
  end if;
  select prefijo into v_pre from metas.recibo_series where owner = new.owner;
  while v_pre is null loop
    v_intento := v_intento + 1;
    if v_intento > 20 then
      raise exception 'metas: no se pudo crear la serie de recibos' using errcode = 'MT021';
    end if;
    insert into metas.recibo_series (owner, prefijo) values (new.owner, metas.letras_azar(4))
    on conflict do nothing;
    select prefijo into v_pre from metas.recibo_series where owner = new.owner;
  end loop;
  insert into metas.recibo_contadores as c (owner, anio, ultimo) values (new.owner, v_anio, 1)
  on conflict (owner, anio) do update set ultimo = c.ultimo + 1
  returning ultimo into v_n;
  new.recibo := format('RC-%s-%s-%s', lpad(v_anio::text, 2, '0'), v_pre, lpad(v_n::text, 4, '0'));
  return new;
end $$;
create trigger pagos_30_recibo before insert on metas.pagos
  for each row execute function metas.t_numerar_recibo();
create trigger convocatoria_pagos_30_recibo before insert on metas.convocatoria_pagos
  for each row execute function metas.t_numerar_recibo();

-- ════════════════════════════════════════════════════════════════════════════
-- 6. Dinero: SOLO por funciones del servidor
-- ════════════════════════════════════════════════════════════════════════════
-- Reglas comunes:
--   · Los montos llegan como TEXTO canónico ("150.50") y salen como TEXTO.
--     Nunca pasan por un número de coma flotante en JSON.
--   · Cada función es idempotente: reenviar la misma operación (p_op) no
--     repite nada.
--   · Cuando otro aparato tocó el mismo dinero, la función NO decide: devuelve
--     {ok:false, pregunta:…} con los dos valores, y el aparato le pregunta al
--     docente con dos botones (ver 03, sección 3.5).

create or replace function metas._monto(p text)
returns numeric language plpgsql immutable as $$
begin
  if p is null or p !~ '^[0-9]{1,10}(\.[0-9]{1,2})?$' then
    raise exception 'metas: monto no válido: %', p using errcode = 'MT004';
  end if;
  return p::numeric(12,2);
end $$;

create or replace function metas._pago_json(p metas.pagos)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'id', p.id, 'colecta_id', p.colecta_id, 'alumno_id', p.alumno_id,
    'monto', p.monto::text, 'fecha', p.fecha, 'nota', p.nota,
    'recibo', p.recibo, 'recibo_anterior', p.recibo_anterior,
    'reemplaza_a', p.reemplaza_a, 'reemplaza_recibo', p.reemplaza_recibo,
    'version', p.version, 'device_id', p.device_id,
    'created_at', p.created_at, 'deleted_at', p.deleted_at, 'anulado_motivo', p.anulado_motivo)
$$;

create or replace function metas._gasto_json(g metas.gastos)
returns jsonb language sql immutable as $$
  select (to_jsonb(g) - 'monto') || jsonb_build_object('monto', g.monto::text)
$$;

-- ── Crear un pago (o un abono) ─────────────────────────────────────────────
-- p_conocidos: pagos activos de ESE alumno en ESA colecta que el aparato
-- tenía a la vista cuando el docente anotó este. Si en la base hay otro que
-- el aparato no conocía (anotado en otro aparato, quizá sin señal), se
-- pregunta: «¿es el mismo dinero o son dos pagos?». Con p_son_distintos =
-- true (el docente ya respondió «son dos pagos»), se guarda.
create or replace function metas.pago_crear(
  p_id uuid, p_op uuid, p_colecta uuid, p_alumno uuid, p_monto text, p_fecha date,
  p_nota text default null, p_recibo_anterior text default null,
  p_conocidos uuid[] default '{}', p_son_distintos boolean default false
) returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_uid   uuid := auth.uid();
  v_monto numeric := metas._monto(p_monto);
  v_ya    metas.pagos;
  v_col   metas.colectas;
  v_otros jsonb;
  r       metas.pagos;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  select * into v_ya from metas.pagos where id = p_id;
  if found then
    if v_ya.owner = v_uid and v_ya.op_creacion = p_op then
      return jsonb_build_object('ok', true, 'ya_estaba', true, 'pago', metas._pago_json(v_ya));
    end if;
    return jsonb_build_object('ok', false, 'motivo', 'id_ocupado');
  end if;
  select * into v_col from metas.colectas
   where id = p_colecta and owner = v_uid and deleted_at is null for share;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'colecta'); end if;
  if v_col.estado = 'cerrada' then return jsonb_build_object('ok', false, 'motivo', 'colecta_cerrada'); end if;
  perform 1 from metas.aulas where id = v_col.aula_id and deleted_at is null for share;   -- el aula no se borra mientras tanto
  if not found then return jsonb_build_object('ok', false, 'motivo', 'aula'); end if;
  perform 1 from metas.alumnos
   where id = p_alumno and owner = v_uid and aula_id = v_col.aula_id and deleted_at is null for share;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'alumno'); end if;

  -- Una sola alta a la vez por alumno y colecta (dos aparatos al mismo tiempo).
  perform pg_advisory_xact_lock(hashtextextended(p_colecta::text || p_alumno::text, 0));

  if not p_son_distintos then
    select coalesce(jsonb_agg(metas._pago_json(p) order by p.created_at), '[]'::jsonb) into v_otros
      from metas.pagos p
     where p.colecta_id = p_colecta and p.alumno_id = p_alumno and p.deleted_at is null
       and not (p.id = any (coalesce(p_conocidos, '{}')));
    if jsonb_array_length(v_otros) > 0 then
      return jsonb_build_object('ok', false, 'pregunta', 'otro_pago_sin_ver', 'otros', v_otros,
                                'este', jsonb_build_object('monto', v_monto::text, 'fecha', p_fecha));
    end if;
  end if;

  insert into metas.pagos (id, op_creacion, aula_id, colecta_id, alumno_id, monto, fecha, nota, recibo_anterior)
  values (p_id, p_op, v_col.aula_id, p_colecta, p_alumno, v_monto, p_fecha, p_nota,
          nullif(trim(p_recibo_anterior), ''))
  returning * into r;
  return jsonb_build_object('ok', true, 'pago', metas._pago_json(r));
end $$;

-- ── Corregir monto o fecha: anular + nuevo, en una transacción ────────────
-- p_base = {"monto":"50.00","fecha":"2027-03-03"}: lo que el aparato veía.
-- Solo se PREGUNTA si otro aparato cambió lo que importa: el monto, la fecha
-- o si el pago sigue vivo (anulado o ya reemplazado). Un cambio en la nota o
-- en el recibo anterior NO es motivo para preguntar.
create or replace function metas.pago_corregir(
  p_pago uuid, p_base jsonb, p_nuevo_id uuid, p_op uuid,
  p_monto text, p_fecha date, p_motivo text default 'corrección'
) returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_uid uuid := auth.uid();
  v_monto numeric := metas._monto(p_monto);
  v metas.pagos; w metas.pagos; r metas.pagos;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  select * into r from metas.pagos where id = p_nuevo_id;
  if found then
    if r.owner = v_uid and r.op_creacion = p_op then
      return jsonb_build_object('ok', true, 'ya_estaba', true, 'pago', metas._pago_json(r));
    end if;
    return jsonb_build_object('ok', false, 'motivo', 'id_ocupado');
  end if;
  select * into v from metas.pagos where id = p_pago and owner = v_uid for update;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'no_existe'); end if;
  if v.deleted_at is not null
     or v.monto is distinct from metas._monto(p_base ->> 'monto')
     or v.fecha is distinct from (p_base ->> 'fecha')::date then
    select * into w from metas.pagos where reemplaza_a = p_pago;
    return jsonb_build_object('ok', false, 'pregunta', 'pago_cambiado_en_otro_aparato',
      'actual', metas._pago_json(v),
      'reemplazo', case when w.id is not null then metas._pago_json(w) end,
      'este', jsonb_build_object('monto', v_monto::text, 'fecha', p_fecha));
  end if;
  if v_monto = v.monto and coalesce(p_fecha, v.fecha) = v.fecha then
    return jsonb_build_object('ok', true, 'sin_cambios', true, 'pago', metas._pago_json(v));
  end if;
  update metas.pagos set deleted_at = now(), anulado_motivo = left(coalesce(p_motivo, 'corrección'), 200)
   where id = p_pago;
  insert into metas.pagos (id, op_creacion, aula_id, colecta_id, alumno_id, monto, fecha, nota,
                           recibo_anterior, reemplaza_a, reemplaza_recibo)
  values (p_nuevo_id, p_op, v.aula_id, v.colecta_id, v.alumno_id, v_monto, coalesce(p_fecha, v.fecha), v.nota,
          v.recibo_anterior, v.id, v.recibo)
  returning * into r;
  return jsonb_build_object('ok', true, 'anulado', v.recibo, 'pago', metas._pago_json(r));
end $$;

-- ── Anular un pago (el dinero se devolvió o se anotó por error) ────────────
create or replace function metas.pago_anular(p_pago uuid, p_motivo text, p_op uuid)
returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v metas.pagos; w metas.pagos;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  if coalesce(trim(p_motivo), '') = '' then
    return jsonb_build_object('ok', false, 'motivo', 'falta_motivo');
  end if;
  select * into v from metas.pagos where id = p_pago and owner = auth.uid() for update;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'no_existe'); end if;
  if v.deleted_at is not null then
    select * into w from metas.pagos where reemplaza_a = p_pago;
    if w.id is not null and w.deleted_at is null then
      -- Otro aparato lo CORRIGIÓ: anular «el viejo» ya no dice nada del nuevo.
      return jsonb_build_object('ok', false, 'pregunta', 'pago_corregido_en_otro_aparato',
                                'actual', metas._pago_json(w));
    end if;
    return jsonb_build_object('ok', true, 'ya_estaba', true);
  end if;
  update metas.pagos set deleted_at = now(), anulado_motivo = left(p_motivo, 200)
   where id = p_pago returning * into v;
  return jsonb_build_object('ok', true, 'pago', metas._pago_json(v));
end $$;

-- ── Editar nota o recibo anterior ─────────────────────────────────────────
-- El monto y la fecha de un pago numerado NO se editan (pago_corregir). Lo
-- que queda no es dinero: se aplica sin preguntar.
create or replace function metas.pago_editar(p_pago uuid, p_cambios jsonb, p_op uuid)
returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v metas.pagos;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  if exists (select 1 from jsonb_object_keys(p_cambios) k where k not in ('nota', 'recibo_anterior')) then
    return jsonb_build_object('ok', false, 'motivo', 'campo_no_editable');   -- monto y fecha: pago_corregir
  end if;
  select * into v from metas.pagos where id = p_pago and owner = auth.uid() for update;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'no_existe'); end if;
  if v.deleted_at is not null then return jsonb_build_object('ok', false, 'motivo', 'anulado'); end if;
  if (not p_cambios ? 'nota' or (p_cambios ->> 'nota') is not distinct from v.nota)
     and (not p_cambios ? 'recibo_anterior' or nullif(trim(p_cambios ->> 'recibo_anterior'), '') is not distinct from v.recibo_anterior) then
    return jsonb_build_object('ok', true, 'ya_estaba', true, 'pago', metas._pago_json(v));
  end if;
  update metas.pagos set
    nota            = case when p_cambios ? 'nota' then p_cambios ->> 'nota' else nota end,
    recibo_anterior = case when p_cambios ? 'recibo_anterior' then nullif(trim(p_cambios ->> 'recibo_anterior'), '') else recibo_anterior end
  where id = p_pago returning * into v;
  return jsonb_build_object('ok', true, 'pago', metas._pago_json(v));
end $$;

-- ── Gastos de una colecta ──────────────────────────────────────────────────
-- Crear: si hay otro gasto de la misma colecta el MISMO día, con el mismo
-- monto o el mismo concepto, que el aparato no conocía, se pregunta «¿es el
-- mismo gasto?».
create or replace function metas.gasto_crear(
  p_id uuid, p_op uuid, p_colecta uuid, p_fecha date,
  p_concepto text, p_monto text, p_campos jsonb default '{}'::jsonb,
  p_conocidos uuid[] default '{}', p_son_distintos boolean default false
) returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_uid uuid := auth.uid();
  v_monto numeric := metas._monto(p_monto);
  v_col metas.colectas; v_ya metas.gastos; v_otros jsonb; r metas.gastos;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  select * into v_ya from metas.gastos where id = p_id;
  if found then
    if v_ya.owner = v_uid and v_ya.op_creacion = p_op then
      return jsonb_build_object('ok', true, 'ya_estaba', true, 'gasto', metas._gasto_json(v_ya));
    end if;
    return jsonb_build_object('ok', false, 'motivo', 'id_ocupado');
  end if;
  select * into v_col from metas.colectas where id = p_colecta and owner = v_uid and deleted_at is null for share;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'colecta'); end if;
  perform pg_advisory_xact_lock(hashtextextended(p_colecta::text || 'gastos', 0));
  if not p_son_distintos then
    select coalesce(jsonb_agg(metas._gasto_json(g) order by g.created_at), '[]'::jsonb) into v_otros
      from metas.gastos g
     where g.colecta_id = p_colecta and g.deleted_at is null and g.fecha = p_fecha
       and (g.monto = v_monto or metas.norm_nombre(g.concepto) = metas.norm_nombre(p_concepto))
       and not (g.id = any (coalesce(p_conocidos, '{}')));
    if jsonb_array_length(v_otros) > 0 then
      return jsonb_build_object('ok', false, 'pregunta', 'otro_gasto_sin_ver', 'otros', v_otros,
                                'este', jsonb_build_object('monto', v_monto::text, 'fecha', p_fecha, 'concepto', p_concepto));
    end if;
  end if;
  insert into metas.gastos (id, op_creacion, aula_id, colecta_id, fecha, concepto, monto, categoria, tiene_factura)
  values (p_id, p_op, v_col.aula_id, p_colecta, p_fecha, p_concepto, v_monto,
          p_campos ->> 'categoria', coalesce((p_campos ->> 'tiene_factura')::boolean, false))
  returning * into r;
  return jsonb_build_object('ok', true, 'gasto', metas._gasto_json(r));
end $$;

-- Editar: si otro aparato cambió el MONTO o la FECHA que este aparato quiere
-- cambiar, se pregunta con los dos valores. Concepto, categoría y factura se
-- aplican campo por campo.
create or replace function metas.gasto_editar(p_gasto uuid, p_base jsonb, p_cambios jsonb, p_op uuid)
returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v metas.gastos;
  v_monto numeric;
  v_fecha date;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  if exists (select 1 from jsonb_object_keys(p_cambios) k
              where k not in ('monto', 'fecha', 'concepto', 'categoria', 'tiene_factura')) then
    return jsonb_build_object('ok', false, 'motivo', 'campo_no_editable');
  end if;
  select * into v from metas.gastos where id = p_gasto and owner = auth.uid() for update;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'no_existe'); end if;
  if v.deleted_at is not null then return jsonb_build_object('ok', false, 'motivo', 'anulado'); end if;
  if p_cambios ? 'monto' then v_monto := metas._monto(p_cambios ->> 'monto'); end if;
  if p_cambios ? 'fecha' then v_fecha := (p_cambios ->> 'fecha')::date; end if;
  if (p_cambios ? 'monto' and v.monto is distinct from metas._monto(p_base ->> 'monto') and v.monto is distinct from v_monto)
     or (p_cambios ? 'fecha' and v.fecha is distinct from (p_base ->> 'fecha')::date and v.fecha is distinct from v_fecha) then
    return jsonb_build_object('ok', false, 'pregunta', 'gasto_cambiado_en_otro_aparato',
      'actual', metas._gasto_json(v),
      'este', jsonb_build_object('monto', coalesce(v_monto, v.monto)::text, 'fecha', coalesce(v_fecha, v.fecha)));
  end if;
  update metas.gastos set
    monto         = coalesce(v_monto, monto),
    fecha         = coalesce(v_fecha, fecha),
    concepto      = case when p_cambios ? 'concepto'      then p_cambios ->> 'concepto'      else concepto end,
    categoria     = case when p_cambios ? 'categoria'     then p_cambios ->> 'categoria'     else categoria end,
    tiene_factura = case when p_cambios ? 'tiene_factura' then (p_cambios ->> 'tiene_factura')::boolean else tiene_factura end
  where id = p_gasto returning * into v;
  return jsonb_build_object('ok', true, 'gasto', metas._gasto_json(v));
end $$;

create or replace function metas.gasto_anular(p_gasto uuid, p_motivo text, p_op uuid)
returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare v metas.gastos;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  select * into v from metas.gastos where id = p_gasto and owner = auth.uid() for update;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'no_existe'); end if;
  if v.deleted_at is not null then return jsonb_build_object('ok', true, 'ya_estaba', true); end if;
  update metas.gastos set deleted_at = now(), anulado_motivo = left(coalesce(nullif(trim(p_motivo), ''), 'anulado'), 200)
   where id = p_gasto returning * into v;
  return jsonb_build_object('ok', true, 'gasto', metas._gasto_json(v));
end $$;

-- ── Gastos del docente (reembolsables) ─────────────────────────────────────
create or replace function metas._gasto_docente_json(g metas.gastos_docente)
returns jsonb language sql immutable as $$
  select (to_jsonb(g) - 'monto') || jsonb_build_object('monto', g.monto::text)
$$;
create or replace function metas._reembolso_json(r metas.reembolsos)
returns jsonb language sql immutable as $$
  select (to_jsonb(r) - 'monto') || jsonb_build_object('monto', r.monto::text)
$$;

-- Crear: mismo criterio que gasto_crear («¿es el mismo gasto?» si otro
-- aparato anotó ese día uno con el mismo monto o concepto).
create or replace function metas.gasto_docente_crear(
  p_id uuid, p_op uuid, p_fecha date, p_tipo text, p_concepto text, p_cobrar_a text,
  p_monto text, p_campos jsonb default '{}'::jsonb,
  p_conocidos uuid[] default '{}', p_son_distintos boolean default false
) returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_uid uuid := auth.uid();
  v_monto numeric := metas._monto(p_monto);
  v_ya metas.gastos_docente; v_otros jsonb; r metas.gastos_docente;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  select * into v_ya from metas.gastos_docente where id = p_id;
  if found then
    if v_ya.owner = v_uid and v_ya.op_creacion = p_op then
      return jsonb_build_object('ok', true, 'ya_estaba', true, 'gasto', metas._gasto_docente_json(v_ya));
    end if;
    return jsonb_build_object('ok', false, 'motivo', 'id_ocupado');
  end if;
  if p_campos ? 'aula_id' and nullif(p_campos ->> 'aula_id', '') is not null then
    perform 1 from metas.aulas where id = (p_campos ->> 'aula_id')::uuid and owner = v_uid
                                 and deleted_at is null for share;
    if not found then return jsonb_build_object('ok', false, 'motivo', 'aula'); end if;
  end if;
  perform pg_advisory_xact_lock(hashtextextended(v_uid::text || 'gastos_docente', 0));
  if not p_son_distintos then
    select coalesce(jsonb_agg(metas._gasto_docente_json(g) order by g.created_at), '[]'::jsonb) into v_otros
      from metas.gastos_docente g
     where g.owner = v_uid and g.deleted_at is null and g.fecha = p_fecha
       and (g.monto = v_monto or metas.norm_nombre(g.concepto) = metas.norm_nombre(p_concepto))
       and not (g.id = any (coalesce(p_conocidos, '{}')));
    if jsonb_array_length(v_otros) > 0 then
      return jsonb_build_object('ok', false, 'pregunta', 'otro_gasto_sin_ver', 'otros', v_otros,
                                'este', jsonb_build_object('monto', v_monto::text, 'fecha', p_fecha, 'concepto', p_concepto));
    end if;
  end if;
  insert into metas.gastos_docente (id, op_creacion, aula_id, fecha, tipo, concepto, cobrar_a, tiene_recibo, monto, escuela)
  values (p_id, p_op, nullif(p_campos ->> 'aula_id', '')::uuid, p_fecha, p_tipo, p_concepto, p_cobrar_a,
          coalesce((p_campos ->> 'tiene_recibo')::boolean, false), v_monto, p_campos ->> 'escuela')
  returning * into r;
  return jsonb_build_object('ok', true, 'gasto', metas._gasto_docente_json(r));
end $$;

-- Editar: monto y fecha con pregunta si otro aparato los cambió; lo demás
-- campo por campo. El monto de un gasto del docente SÍ se puede corregir (no
-- tiene recibo numerado; los reembolsos sí son inmutables).
create or replace function metas.gasto_docente_editar(p_gasto uuid, p_base jsonb, p_cambios jsonb, p_op uuid,
                                                      p_confirmado boolean default false)
returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v metas.gastos_docente;
  v_monto numeric;
  v_fecha date;
  v_reemb numeric;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  if exists (select 1 from jsonb_object_keys(p_cambios) k
              where k not in ('monto', 'fecha', 'tipo', 'concepto', 'cobrar_a', 'tiene_recibo',
                              'escuela', 'no_se_cobrara')) then
    return jsonb_build_object('ok', false, 'motivo', 'campo_no_editable');
  end if;
  select * into v from metas.gastos_docente where id = p_gasto and owner = auth.uid() for update;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'no_existe'); end if;
  if v.deleted_at is not null then return jsonb_build_object('ok', false, 'motivo', 'anulado'); end if;
  if p_cambios ? 'monto' then v_monto := metas._monto(p_cambios ->> 'monto'); end if;
  if p_cambios ? 'fecha' then v_fecha := (p_cambios ->> 'fecha')::date; end if;
  if (p_cambios ? 'monto' and v.monto is distinct from metas._monto(p_base ->> 'monto') and v.monto is distinct from v_monto)
     or (p_cambios ? 'fecha' and v.fecha is distinct from (p_base ->> 'fecha')::date and v.fecha is distinct from v_fecha) then
    return jsonb_build_object('ok', false, 'pregunta', 'gasto_cambiado_en_otro_aparato',
      'actual', metas._gasto_docente_json(v),
      'este', jsonb_build_object('monto', coalesce(v_monto, v.monto)::text, 'fecha', coalesce(v_fecha, v.fecha)));
  end if;
  -- Bajar el monto por debajo de lo que ya le devolvieron deja un reembolso
  -- «de más»: se pregunta, con las dos cifras, antes de guardarlo.
  if v_monto is not null and not p_confirmado then
    select coalesce(sum(monto), 0) into v_reemb from metas.reembolsos
     where gasto_id = p_gasto and deleted_at is null;
    if v_monto < v_reemb then
      return jsonb_build_object('ok', false, 'pregunta', 'monto_menor_que_reembolsado',
        'reembolsado', v_reemb::text, 'este', jsonb_build_object('monto', v_monto::text));
    end if;
  end if;
  update metas.gastos_docente set
    monto         = coalesce(v_monto, monto),
    fecha         = coalesce(v_fecha, fecha),
    tipo          = case when p_cambios ? 'tipo'          then p_cambios ->> 'tipo'          else tipo end,
    concepto      = case when p_cambios ? 'concepto'      then p_cambios ->> 'concepto'      else concepto end,
    cobrar_a      = case when p_cambios ? 'cobrar_a'      then p_cambios ->> 'cobrar_a'      else cobrar_a end,
    tiene_recibo  = case when p_cambios ? 'tiene_recibo'  then (p_cambios ->> 'tiene_recibo')::boolean else tiene_recibo end,
    escuela       = case when p_cambios ? 'escuela'       then p_cambios ->> 'escuela'       else escuela end,
    no_se_cobrara = case when p_cambios ? 'no_se_cobrara' then (p_cambios ->> 'no_se_cobrara')::boolean else no_se_cobrara end
  where id = p_gasto returning * into v;
  return jsonb_build_object('ok', true, 'gasto', metas._gasto_docente_json(v));
end $$;

-- Anular un gasto del docente: solo si no tiene reembolsos activos (si ya le
-- devolvieron dinero, primero se anulan esos reembolsos, con su motivo).
create or replace function metas.gasto_docente_anular(p_gasto uuid, p_motivo text, p_op uuid)
returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare v metas.gastos_docente;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  select * into v from metas.gastos_docente where id = p_gasto and owner = auth.uid() for update;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'no_existe'); end if;
  if v.deleted_at is not null then return jsonb_build_object('ok', true, 'ya_estaba', true); end if;
  if exists (select 1 from metas.reembolsos where gasto_id = p_gasto and deleted_at is null) then
    return jsonb_build_object('ok', false, 'motivo', 'tiene_reembolsos');
  end if;
  update metas.gastos_docente set deleted_at = now(), anulado_motivo = left(coalesce(nullif(trim(p_motivo), ''), 'anulado'), 200)
   where id = p_gasto returning * into v;
  return jsonb_build_object('ok', true, 'gasto', metas._gasto_docente_json(v));
end $$;

-- Reembolsos: mismo trato que los pagos (crear con «¿es el mismo dinero?»,
-- monto inmutable, corregir = anular + nuevo, anular con motivo).
create or replace function metas.reembolso_crear(
  p_id uuid, p_op uuid, p_gasto uuid, p_monto text, p_fecha date,
  p_quien_pago text default null, p_nota text default null,
  p_conocidos uuid[] default '{}', p_son_distintos boolean default false
) returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_uid uuid := auth.uid();
  v_monto numeric := metas._monto(p_monto);
  v_ya metas.reembolsos; v_otros jsonb; r metas.reembolsos;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  select * into v_ya from metas.reembolsos where id = p_id;
  if found then
    if v_ya.owner = v_uid and v_ya.op_creacion = p_op then
      return jsonb_build_object('ok', true, 'ya_estaba', true, 'reembolso', metas._reembolso_json(v_ya));
    end if;
    return jsonb_build_object('ok', false, 'motivo', 'id_ocupado');
  end if;
  perform 1 from metas.gastos_docente where id = p_gasto and owner = v_uid and deleted_at is null for share;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'gasto'); end if;
  perform pg_advisory_xact_lock(hashtextextended(p_gasto::text || 'reembolsos', 0));
  if not p_son_distintos then
    select coalesce(jsonb_agg(metas._reembolso_json(x) order by x.created_at), '[]'::jsonb) into v_otros
      from metas.reembolsos x
     where x.gasto_id = p_gasto and x.deleted_at is null
       and not (x.id = any (coalesce(p_conocidos, '{}')));
    if jsonb_array_length(v_otros) > 0 then
      return jsonb_build_object('ok', false, 'pregunta', 'otro_reembolso_sin_ver', 'otros', v_otros,
                                'este', jsonb_build_object('monto', v_monto::text, 'fecha', p_fecha));
    end if;
  end if;
  insert into metas.reembolsos (id, op_creacion, gasto_id, fecha, monto, quien_pago, nota)
  values (p_id, p_op, p_gasto, p_fecha, v_monto, p_quien_pago, p_nota)
  returning * into r;
  return jsonb_build_object('ok', true, 'reembolso', metas._reembolso_json(r));
end $$;

create or replace function metas.reembolso_corregir(
  p_reembolso uuid, p_base_version int, p_nuevo_id uuid, p_op uuid,
  p_monto text, p_fecha date, p_motivo text default 'corrección'
) returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_uid uuid := auth.uid();
  v_monto numeric := metas._monto(p_monto);
  v metas.reembolsos; w metas.reembolsos; r metas.reembolsos;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  select * into r from metas.reembolsos where id = p_nuevo_id;
  if found then
    if r.owner = v_uid and r.op_creacion = p_op then
      return jsonb_build_object('ok', true, 'ya_estaba', true, 'reembolso', metas._reembolso_json(r));
    end if;
    return jsonb_build_object('ok', false, 'motivo', 'id_ocupado');
  end if;
  select * into v from metas.reembolsos where id = p_reembolso and owner = v_uid for update;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'no_existe'); end if;
  if v.deleted_at is not null or v.version <> p_base_version then
    select * into w from metas.reembolsos where reemplaza_a = p_reembolso;
    return jsonb_build_object('ok', false, 'pregunta', 'reembolso_cambiado_en_otro_aparato',
      'actual', metas._reembolso_json(v),
      'reemplazo', case when w.id is not null then metas._reembolso_json(w) end,
      'este', jsonb_build_object('monto', v_monto::text, 'fecha', p_fecha));
  end if;
  update metas.reembolsos set deleted_at = now(), anulado_motivo = left(coalesce(p_motivo, 'corrección'), 200)
   where id = p_reembolso;
  insert into metas.reembolsos (id, op_creacion, gasto_id, fecha, monto, quien_pago, nota, reemplaza_a)
  values (p_nuevo_id, p_op, v.gasto_id, coalesce(p_fecha, v.fecha), v_monto, v.quien_pago, v.nota, v.id)
  returning * into r;
  return jsonb_build_object('ok', true, 'reembolso', metas._reembolso_json(r));
end $$;

create or replace function metas.reembolso_anular(p_reembolso uuid, p_motivo text, p_op uuid)
returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare v metas.reembolsos; w metas.reembolsos;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  if coalesce(trim(p_motivo), '') = '' then
    return jsonb_build_object('ok', false, 'motivo', 'falta_motivo');
  end if;
  select * into v from metas.reembolsos where id = p_reembolso and owner = auth.uid() for update;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'no_existe'); end if;
  if v.deleted_at is not null then
    select * into w from metas.reembolsos where reemplaza_a = p_reembolso;
    if w.id is not null and w.deleted_at is null then
      return jsonb_build_object('ok', false, 'pregunta', 'reembolso_corregido_en_otro_aparato',
                                'actual', metas._reembolso_json(w));
    end if;
    return jsonb_build_object('ok', true, 'ya_estaba', true);
  end if;
  update metas.reembolsos set deleted_at = now(), anulado_motivo = left(p_motivo, 200)
   where id = p_reembolso returning * into v;
  return jsonb_build_object('ok', true, 'reembolso', metas._reembolso_json(v));
end $$;

-- ── Acta de inventario: la foto la toma el servidor ────────────────────────
-- Numera sola (siguiente número del centro), fija la lista de bienes activos
-- de ese centro y sus totales por propietario, y la guarda como documento.
-- p_reemplaza: si el acta corrige a otra (que queda anulada con motivo).
create or replace function metas.acta_inventario_crear(
  p_id uuid, p_op uuid, p_centro text, p_fecha date, p_entrega text, p_recibe text,
  p_reemplaza uuid default null, p_motivo text default null, p_misma_fecha_ok boolean default false
) returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_uid uuid := auth.uid();
  v_ya metas.actas_inventario; v_ant metas.actas_inventario; r metas.actas_inventario;
  v_num int; v_contenido jsonb; v_totales jsonb;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  select * into v_ya from metas.actas_inventario where id = p_id;
  if found then
    if v_ya.owner = v_uid and v_ya.op_creacion = p_op then
      return jsonb_build_object('ok', true, 'ya_estaba', true, 'acta', to_jsonb(v_ya));
    end if;
    return jsonb_build_object('ok', false, 'motivo', 'id_ocupado');
  end if;
  if p_fecha is null or p_fecha > (now() at time zone 'America/Tegucigalpa')::date then
    return jsonb_build_object('ok', false, 'motivo', 'fecha_futura');   -- un acta fija lo que YA hay
  end if;
  perform pg_advisory_xact_lock(hashtextextended(v_uid::text || metas.norm_nombre(p_centro), 0));
  -- Dos aparatos que hacen el acta a la vez reciben números seguidos (2 y 3).
  -- Solo se pregunta si ya hay un acta ACTIVA de ese centro con la MISMA fecha.
  if p_reemplaza is null and not p_misma_fecha_ok then
    select * into v_ant from metas.actas_inventario
     where owner = v_uid and metas.norm_nombre(centro) = metas.norm_nombre(p_centro)
       and fecha = p_fecha and deleted_at is null
     order by numero desc limit 1;
    if found then
      return jsonb_build_object('ok', false, 'pregunta', 'acta_misma_fecha',
                                'existente', jsonb_build_object('numero', v_ant.numero, 'fecha', v_ant.fecha));
    end if;
  end if;
  if p_reemplaza is not null then
    select * into v_ant from metas.actas_inventario
     where id = p_reemplaza and owner = v_uid and deleted_at is null for update;
    if not found then return jsonb_build_object('ok', false, 'motivo', 'acta_anterior'); end if;
    update metas.actas_inventario set deleted_at = now(),
           anulado_motivo = left(coalesce(nullif(trim(p_motivo), ''), 'corregida'), 200)
     where id = p_reemplaza;
    v_num := v_ant.numero;                         -- la corrección conserva el número
  else
    select coalesce(max(numero), 0) + 1 into v_num from metas.actas_inventario
     where owner = v_uid and metas.norm_nombre(centro) = metas.norm_nombre(p_centro) and deleted_at is null;
  end if;
  select coalesce(jsonb_agg(jsonb_build_object(
           'bien_id', b.id, 'descripcion', b.descripcion, 'cantidad', b.cantidad::text, 'tipo', b.tipo,
           'propietario', b.propietario, 'valor', b.valor::text, 'tiene_recibo', b.tiene_recibo,
           'fecha_desde', b.fecha_desde, 'reembolso_fecha', b.reembolso_fecha, 'nota', b.nota)
           order by b.propietario, b.descripcion), '[]'::jsonb),
         jsonb_build_object(
           'bienes', count(*),
           'valor_docente', coalesce(sum(b.valor) filter (where b.propietario = 'docente'), 0)::text,
           'valor_centro',  coalesce(sum(b.valor) filter (where b.propietario = 'centro'), 0)::text)
    into v_contenido, v_totales
    from metas.bienes b
   where b.owner = v_uid and b.deleted_at is null
     and metas.norm_nombre(b.centro) = metas.norm_nombre(p_centro)
     and b.fecha_desde <= p_fecha;
  insert into metas.actas_inventario (id, op_creacion, centro, numero, fecha, periodo_desde, entrega, recibe,
                                      contenido, totales, reemplaza_a)
  values (p_id, p_op, trim(p_centro), v_num, p_fecha,
          (select max(a.fecha) from metas.actas_inventario a
            where a.owner = v_uid and metas.norm_nombre(a.centro) = metas.norm_nombre(p_centro)
              and a.deleted_at is null and a.numero < v_num),
          p_entrega, p_recibe, v_contenido, v_totales, p_reemplaza)
  returning * into r;
  return jsonb_build_object('ok', true, 'acta', to_jsonb(r));
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- 7. Alta de alumnos: la identidad une sola; el nombre pregunta
-- ════════════════════════════════════════════════════════════════════════════
-- · Misma identidad (país + documento) en el aula → es el MISMO alumno: se
--   devuelve el existente y el aparato cambia su id local por ese (03, 3.5).
-- · Mismo nombre y a uno de los dos le falta identidad → se PREGUNTA «¿es la
--   misma persona?». Si el docente dice que no, se reenvía con p_no_es.
-- · Mismo nombre y las dos identidades distintas → se crea (homónimos) y se
--   devuelve un aviso discreto.
create or replace function metas.alumno_crear(
  p_id uuid, p_op uuid, p_aula uuid, p_campos jsonb, p_no_es uuid[] default '{}'
) returns jsonb language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_uid   uuid := auth.uid();
  v_ident text := metas.norm_documento(p_campos ->> 'identidad');
  v_pais  text := upper(coalesce(nullif(p_campos ->> 'documento_pais', ''), 'HN'));
  v_nom   text := metas.norm_nombre(p_campos ->> 'nombre_completo');
  v_ya    metas.alumnos;
  v_cand  jsonb;
  r       metas.alumnos;
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  select * into v_ya from metas.alumnos where id = p_id;
  if found then
    if v_ya.owner = v_uid and v_ya.op_creacion = p_op then
      return jsonb_build_object('ok', true, 'ya_estaba', true, 'alumno', to_jsonb(v_ya));
    end if;
    return jsonb_build_object('ok', false, 'motivo', 'id_ocupado');
  end if;
  perform 1 from metas.aulas where id = p_aula and owner = v_uid and deleted_at is null for share;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'aula'); end if;
  perform pg_advisory_xact_lock(hashtextextended(p_aula::text || 'alumnos', 0));

  if v_ident is not null then
    select * into v_ya from metas.alumnos
     where aula_id = p_aula and documento_pais = v_pais and identidad = v_ident and deleted_at is null;
    if found then
      return jsonb_build_object('ok', false, 'misma_identidad', true, 'alumno', to_jsonb(v_ya));
    end if;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'nombre_completo', a.nombre_completo,
                                               'num_lista', a.num_lista, 'identidad', a.identidad)), '[]'::jsonb)
    into v_cand
    from metas.alumnos a
   where a.aula_id = p_aula and a.deleted_at is null and a.nombre_norm = v_nom
     and (a.identidad is null or v_ident is null)
     and not (a.id = any (coalesce(p_no_es, '{}')));
  if jsonb_array_length(v_cand) > 0 then
    return jsonb_build_object('ok', false, 'pregunta', 'misma_persona', 'candidatos', v_cand);
  end if;

  insert into metas.alumnos (id, op_creacion, aula_id, nombre_completo, identidad, documento_pais, documento_tipo,
                             num_lista, sexo, fecha_nacimiento, estado, estado_fecha, en_sace, sace_num, edad_sace)
  values (p_id, p_op, p_aula, trim(p_campos ->> 'nombre_completo'), v_ident, v_pais,
          coalesce(nullif(p_campos ->> 'documento_tipo', ''), 'identidad'),
          (p_campos ->> 'num_lista')::smallint, p_campos ->> 'sexo', (p_campos ->> 'fecha_nacimiento')::date,
          coalesce(nullif(p_campos ->> 'estado', ''), 'activo'), (p_campos ->> 'estado_fecha')::date,
          coalesce((p_campos ->> 'en_sace')::boolean, false), (p_campos ->> 'sace_num')::smallint,
          (p_campos ->> 'edad_sace')::smallint)
  returning * into r;
  return jsonb_build_object('ok', true, 'alumno', to_jsonb(r),
    'homonimo', exists (select 1 from metas.alumnos a where a.aula_id = p_aula and a.deleted_at is null
                          and a.nombre_norm = v_nom and a.id <> r.id));
end $$;

-- Para avisar ANTES de guardar («Ya tienes a Ana María López Cruz, n.º 12»).
-- Corre con la RLS de quien llama.
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

grant execute on function
  metas.alumno_choques(uuid, text, text, text),
  metas.pago_crear(uuid, uuid, uuid, uuid, text, date, text, text, uuid[], boolean),
  metas.pago_corregir(uuid, jsonb, uuid, uuid, text, date, text),
  metas.pago_anular(uuid, text, uuid),
  metas.pago_editar(uuid, jsonb, uuid),
  metas.gasto_crear(uuid, uuid, uuid, date, text, text, jsonb, uuid[], boolean),
  metas.gasto_editar(uuid, jsonb, jsonb, uuid),
  metas.gasto_anular(uuid, text, uuid),
  metas.gasto_docente_crear(uuid, uuid, date, text, text, text, text, jsonb, uuid[], boolean),
  metas.gasto_docente_editar(uuid, jsonb, jsonb, uuid, boolean),
  metas.gasto_docente_anular(uuid, text, uuid),
  metas.reembolso_crear(uuid, uuid, uuid, text, date, text, text, uuid[], boolean),
  metas.reembolso_corregir(uuid, int, uuid, uuid, text, date, text),
  metas.reembolso_anular(uuid, text, uuid),
  metas.acta_inventario_crear(uuid, uuid, text, date, text, text, uuid, text, boolean),
  metas.alumno_crear(uuid, uuid, uuid, jsonb, uuid[])
to authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 8. Vistas: TODO total se calcula aquí, nunca se guarda
-- ════════════════════════════════════════════════════════════════════════════
-- security_invoker = true → respetan la RLS (y la restrictiva) de quien
-- consulta. El aparato las lee con los montos convertidos a texto
-- (select=recaudado::text,…), nunca como número de JSON.

-- Por alumno y colecta.
--   aplicable  = lo que le corresponde: el sugerido; 0 si está exento; el
--                monto_aplicable si la exención es parcial; 0 si ya no está
--                (retirado, trasladado, desertor).
--   pagado     = suma de sus pagos activos (abonos incluidos).
--   falta      = lo que le falta: nunca negativo; 0 si está exento.
--   pago_de_mas= lo que dio por encima de lo aplicable (solo si sigue en el aula).
create or replace view metas.v_colecta_alumnos with (security_invoker = true) as
select x.*,
       greatest(x.aplicable - x.pagado, 0)                                       as falta,
       case when x.sigue then greatest(x.pagado - x.aplicable, 0) else 0 end     as pago_de_mas,
       case
         when not x.sigue                                    then 'ya_no_esta'
         when x.aplicable = 0 and x.pagado = 0               then 'no_corresponde'
         when x.pagado = 0                                   then 'debe'
         when x.pagado < x.aplicable                         then 'abono'
         when x.pagado = x.aplicable                         then 'pagado'
         else 'pago_de_mas'
       end                                                                       as situacion
  from (
    select c.id as colecta_id, c.aula_id, a.id as alumno_id, a.num_lista, a.nombre_completo, a.estado,
           (a.estado in ('activo', 'ingreso'))                 as sigue,
           (e.id is not null)                                  as exento,
           e.monto_aplicable,
           case when a.estado not in ('activo', 'ingreso') then 0
                when e.id is null then c.monto_sugerido
                else coalesce(e.monto_aplicable, 0) end        as aplicable,
           coalesce(p.pagado, 0)                               as pagado,
           coalesce(p.cuantos, 0)                              as pagos,
           p.ultima_fecha
      from metas.colectas c
      join metas.alumnos  a on a.aula_id = c.aula_id and a.deleted_at is null
      left join metas.colecta_exenciones e on e.colecta_id = c.id and e.alumno_id = a.id and e.deleted_at is null
      left join lateral (
        select sum(pg.monto) as pagado, count(*) as cuantos, max(pg.fecha) as ultima_fecha
          from metas.pagos pg
         where pg.colecta_id = c.id and pg.alumno_id = a.id and pg.deleted_at is null) p on true
     where c.deleted_at is null
  ) x;

create or replace view metas.v_colectas_resumen with (security_invoker = true) as
select c.id as colecta_id, c.aula_id, c.concepto, c.fecha, c.estado, c.monto_sugerido,
       coalesce(t.esperados, 0)                                 as esperados,
       coalesce(t.meta, 0)                                      as meta,
       coalesce(r.recaudado, 0)                                 as recaudado,      -- TODO pago activo, aunque el alumno ya no esté
       coalesce(t.falta_total, 0)                               as falta_total,    -- suma de lo que falta de los que siguen y no están exentos
       coalesce(t.pago_de_mas_total, 0)                         as pago_de_mas_total,
       coalesce(g.gastado, 0)                                   as gastado,
       coalesce(r.recaudado, 0) - coalesce(g.gastado, 0)        as saldo,
       coalesce(t.pagaron, 0)                                   as pagaron
  from metas.colectas c
  left join lateral (
    select count(*) filter (where v.sigue and v.aplicable > 0)   as esperados,
           sum(v.aplicable) filter (where v.sigue)               as meta,
           sum(v.falta) filter (where v.sigue)                   as falta_total,
           sum(v.pago_de_mas)                                    as pago_de_mas_total,
           count(*) filter (where v.pagado > 0)                  as pagaron
      from metas.v_colecta_alumnos v where v.colecta_id = c.id) t on true
  left join lateral (
    select sum(p.monto) as recaudado from metas.pagos p
     where p.colecta_id = c.id and p.deleted_at is null) r on true
  left join lateral (
    select sum(gs.monto) as gastado from metas.gastos gs
     where gs.colecta_id = c.id and gs.deleted_at is null) g on true
 where c.deleted_at is null;

-- Gastos del docente: lo reembolsado, lo que falta, el ESTADO y los DÍAS DE
-- ESPERA, todo calculado de los reembolsos.
--   estado: 'por_cobrar' (nada reembolsado), 'reembolsado_parcial',
--           'reembolsado_total', o 'no_se_cobrara' si el docente lo dio por
--           perdido (lo decide él; el cálculo no lo inventa).
--   dias_espera: mientras falte algo, desde la fecha del gasto hasta hoy;
--           cuando ya está todo, hasta la fecha del último reembolso.
create or replace view metas.v_gastos_docente with (security_invoker = true) as
select g.id as gasto_id, g.aula_id, g.fecha, g.tipo, g.concepto, g.cobrar_a, g.tiene_recibo, g.escuela,
       g.monto,
       coalesce(r.reembolsado, 0)                                 as reembolsado,
       greatest(g.monto - coalesce(r.reembolsado, 0), 0)          as falta,
       r.reembolsos, r.ultimo_reembolso,
       case when g.no_se_cobrara and coalesce(r.reembolsado, 0) < g.monto then 'no_se_cobrara'
            when coalesce(r.reembolsado, 0) = 0 then 'por_cobrar'
            when r.reembolsado < g.monto then 'reembolsado_parcial'
            else 'reembolsado_total' end                          as estado,
       case when coalesce(r.reembolsado, 0) >= g.monto then r.ultimo_reembolso - g.fecha
            else current_date - g.fecha end                       as dias_espera
  from metas.gastos_docente g
  left join lateral (
    select sum(x.monto) as reembolsado, count(*) as reembolsos, max(x.fecha) as ultimo_reembolso
      from metas.reembolsos x where x.gasto_id = g.id and x.deleted_at is null) r on true
 where g.deleted_at is null;

create or replace view metas.v_gastos_docente_resumen with (security_invoker = true) as
select cobrar_a,
       count(*)                                                    as gastos,
       sum(monto)                                                  as gastado,
       sum(reembolsado)                                            as reembolsado,
       sum(falta) filter (where estado <> 'no_se_cobrara')         as por_cobrar,
       max(dias_espera) filter (where estado in ('por_cobrar', 'reembolsado_parcial')) as espera_mas_larga_dias,
       round(avg(dias_espera) filter (where estado = 'reembolsado_total'), 0)         as espera_promedio_dias
  from metas.v_gastos_docente
 group by cobrar_a;

-- Inventario: totales por centro y propietario (calculados).
create or replace view metas.v_inventario_resumen with (security_invoker = true) as
select centro, propietario, count(*) as renglones, sum(cantidad) as unidades, sum(valor) as valor
  from metas.bienes where deleted_at is null
 group by centro, propietario;

-- Cuándo toca la próxima acta de cada centro: la primera en cuanto hay bienes;
-- las siguientes, 3 meses después de la última.
create or replace view metas.v_proxima_acta with (security_invoker = true) as
select c.centro,
       a.numero                                                    as ultima_acta,
       a.fecha                                                     as ultima_fecha,
       case when a.fecha is null then current_date
            else (a.fecha + interval '3 months')::date end         as toca_el,
       (a.fecha is null or a.fecha + interval '3 months' <= current_date) as toca_ya
  from (select distinct on (metas.norm_nombre(centro)) centro
          from metas.bienes where deleted_at is null) c
  left join lateral (
    select numero, fecha from metas.actas_inventario x
     where metas.norm_nombre(x.centro) = metas.norm_nombre(c.centro) and x.deleted_at is null
     order by numero desc limit 1) a on true;

-- Historia de un bien, leída de la auditoría (que el docente puede leer):
-- de quién fue, desde cuándo, cuándo pasó al centro, cuánto valía.
create or replace view metas.v_bien_historia with (security_invoker = true) as
select fila_id as bien_id, ocurrido_at, accion, campos,
       antes ->> 'propietario' as propietario_antes, despues ->> 'propietario' as propietario_despues,
       antes ->> 'valor'       as valor_antes,       despues ->> 'valor'       as valor_despues,
       despues ->> 'reembolso_fecha' as reembolso_fecha
  from metas.auditoria
 where tabla = 'bienes';

create or replace view metas.v_inasistencias_periodo with (security_invoker = true) as
select a.id as alumno_id, a.aula_id, pe.periodo,
       count(s.id) filter (where s.estado = 'ausente') as ausencias,
       count(s.id) filter (where s.estado = 'excusa')  as excusas,
       count(s.id) filter (where s.estado = 'tarde')   as tardanzas,
       o.dias                                          as oficial,
       coalesce(o.dias, count(s.id) filter (where s.estado in ('ausente', 'excusa'))) as para_sace
  from metas.alumnos a
  join metas.periodos pe on pe.aula_id = a.aula_id and pe.deleted_at is null
  left join metas.asistencia s on s.alumno_id = a.id and s.deleted_at is null
                              and s.fecha between pe.desde and pe.hasta
  left join metas.inasistencias_oficiales o on o.alumno_id = a.id and o.periodo = pe.periodo
                                           and o.deleted_at is null
 where a.deleted_at is null
 group by a.id, a.aula_id, pe.periodo, o.dias;

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

create or replace view metas.v_eleccion_conteo with (security_invoker = true) as
select eleccion_id, planilla, count(*) as votos
  from metas.eleccion_votos where deleted_at is null
 group by eleccion_id, planilla;

create or replace view metas.v_alumnos_sin_identidad with (security_invoker = true) as
select id as alumno_id, aula_id, num_lista, nombre_completo
  from metas.alumnos where deleted_at is null and identidad is null;

-- Nombres repetidos dentro del aula: solo un aviso discreto, nunca un bloqueo.
create or replace view metas.v_alumnos_homonimos with (security_invoker = true) as
select aula_id, nombre_norm, array_agg(id order by num_lista) as alumnos, count(*) as cuantos
  from metas.alumnos where deleted_at is null
 group by aula_id, nombre_norm having count(*) > 1;

grant select on metas.v_colecta_alumnos, metas.v_colectas_resumen,
                metas.v_gastos_docente, metas.v_gastos_docente_resumen,
                metas.v_inventario_resumen, metas.v_proxima_acta, metas.v_bien_historia,
                metas.v_inasistencias_periodo, metas.v_notas_alumno, metas.v_evaluacion_resultado,
                metas.v_eleccion_conteo, metas.v_alumnos_sin_identidad, metas.v_alumnos_homonimos
  to authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 9. Freno de intentos
-- ════════════════════════════════════════════════════════════════════════════
-- metas.frenos y metas.freno_ok se crean en SUPABASE-V2-VINCULACION.sql, que
-- va antes que este archivo: metas-entrar ya los necesita para el freno por
-- IP. La IP nunca se lee aquí de cabeceras que el cliente pueda escribir.

-- La lectura de las familias (padres.html, asistente) va en
-- SUPABASE-V2-FAMILIAS.sql.

-- ════════════════════════════════════════════════════════════════════════════
-- 10. Storage (logos e imágenes de planillas): bucket privado por dueño
-- ════════════════════════════════════════════════════════════════════════════
-- insert into storage.buckets (id, name, public) values ('metas-imagenes', 'metas-imagenes', false);
-- create policy "imagenes propias" on storage.objects for all to authenticated
--   using  (bucket_id = 'metas-imagenes' and (storage.foldername(name))[1] = (select auth.uid())::text
--           and (select metas.es_docente()))
--   with check (bucket_id = 'metas-imagenes' and (storage.foldername(name))[1] = (select auth.uid())::text
--           and (select metas.es_docente()));

-- ════════════════════════════════════════════════════════════════════════════
-- 11. Comprobaciones después de correrlo (fase de implementación)
-- ════════════════════════════════════════════════════════════════════════════
-- a) Ninguna tabla de metas sin RLS (solo debe salir _fila, sin permisos):
--    select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
--     where n.nspname = 'metas' and c.relkind = 'r' and not c.relrowsecurity;
-- b) Toda tabla con datos tiene su política restrictiva:
--    select tablename from pg_tables t where schemaname = 'metas' and tablename not like '\_%'
--       and tablename not in ('frenos','recibo_contadores','cuentas','familia_accesos','avisos_vistos')
--       and not exists (select 1 from pg_policies p where p.schemaname = 'metas'
--                         and p.tablename = t.tablename and p.permissive = 'RESTRICTIVE');   → 0 filas
-- c) Sin INSERT ni UPDATE directos sobre el dinero:
--    select table_name, privilege_type from information_schema.role_table_grants
--     where table_schema = 'metas' and grantee = 'authenticated'
--       and table_name in ('pagos','gastos','gastos_docente','reembolsos','convocatoria_pagos','actas_inventario')
--       and privilege_type in ('INSERT','UPDATE');                                       → 0 filas
-- d) Ningún DELETE/TRUNCATE para anon o authenticated; anon sin ningún permiso.
-- e) Ninguna función de metas ejecutable por PUBLIC:
--    select p.oid::regprocedure from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--     where n.nspname = 'metas' and has_function_privilege('public', p.oid, 'execute');   → 0 filas
-- ── Cierre de permisos ──────────────────────────────────────────────────────
-- «alter default privileges … in schema metas revoke … from public» NO quita
-- el EXECUTE que PostgreSQL da a PUBLIC (un permiso global no se quita por
-- esquema; lo comprobó la capa A). Por eso, al final de cada archivo, se
-- quita a mano de TODAS las funciones de metas. Las que la app necesita ya
-- tienen su GRANT explícito a authenticated, service_role o al rol lector,
-- que no depende de PUBLIC.
revoke execute on all functions in schema metas from public;

-- ============================================================================
