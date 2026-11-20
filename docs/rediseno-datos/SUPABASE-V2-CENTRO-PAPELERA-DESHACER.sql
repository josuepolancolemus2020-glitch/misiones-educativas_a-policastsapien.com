-- ============================================================================
-- M.E.T.A.S · Deshacer SUPABASE-V2-CENTRO-PAPELERA.sql
-- ----------------------------------------------------------------------------
-- Quita las tres funciones del chip (archivar, volver y borrar) y deja los
-- disparadores como estaban antes de ese archivo. No borra centros, grupos,
-- alumnos, pagos, notas ni ningún otro dato.
--
-- Se puede pegar dos veces. Va en una transacción: o se quita todo, o no
-- se toca nada.
--
-- Después de esto, la pantalla avisa que la base todavía no puede. Para
-- volver a tener la papelera, se pega otra vez SUPABASE-V2-CENTRO-PAPELERA.sql.
-- ============================================================================
begin;

drop function if exists metas.centro_borrar(uuid);
drop function if exists metas.centro_volver(uuid);
drop function if exists metas.centro_archivar(uuid);

-- Como en SUPABASE-V2-RECUPERAR-CENTRO.sql: solo un centro puede volver
-- de archivado. Grupos y alumnos no.
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
    new.deleted_at   := null;
    new.op_creacion  := coalesce(new.op_creacion, metas.op_actual());
    return new;
  end if;

  if old.deleted_at is not null then
    if not (tg_table_name = 'centros' and new.deleted_at is null) then
      raise exception 'metas: la fila % está borrada', old.id using errcode = 'MT001';
    end if;
  end if;
  if new.id is distinct from old.id
     or new.owner is distinct from old.owner
     or new.created_at is distinct from old.created_at
     or new.op_creacion is distinct from old.op_creacion then
    raise exception 'metas: id, dueño, creación y operación de creación no se cambian' using errcode = 'MT002';
  end if;
  if tg_nargs > 0 then
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
    new.deleted_at := now();
  end if;
  return new;
end $$;

-- Como en el esquema: nadie borra filas a mano. Se marca deleted_at.
create or replace function metas.t_sin_delete()
returns trigger language plpgsql as $$
begin
  raise exception 'metas: no se borran filas; se marca deleted_at' using errcode = 'MT005';
end $$;

create or replace function metas.t_auditoria_inmutable()
returns trigger language plpgsql as $$
begin
  raise exception 'metas: la auditoría es de solo inserción' using errcode = 'MT006';
end $$;

revoke execute on all functions in schema metas from public;

commit;
