-- Recuperar un centro archivado.
--
-- metas.t_sellar rechazaba cualquier UPDATE de una fila con deleted_at
-- (MT001). Archivar un centro es ese borrado suave, y recuperarlo es
-- volver a dejar deleted_at vacío. Solo en centros: el resto de las
-- tablas sigue sin poder resucitar una fila.
--
-- Pegar este archivo entero en el SQL Editor y ejecutarlo una vez.
-- No hace falta volver a correr el esquema. Comprobar:
--   update metas.centros set deleted_at = null
--    where id = '<un centro archivado>' and owner = auth.uid();
-- tiene que subir la versión y dejar deleted_at vacío. Si ya hay otro
-- centro vivo con el mismo nombre y año, la base responde 23505
-- (centros_unico) y el centro sigue archivado.

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
