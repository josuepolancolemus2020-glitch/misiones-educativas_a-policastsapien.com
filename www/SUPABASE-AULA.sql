-- ============================================================
-- M.E.T.A.S — CÓDIGO DE AULA (blindaje: los datos llegan SOLO al maestro dueño)
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- ⚠️ Requiere haber corrido antes SUPABASE-DOCENTES-V2.sql y SUPABASE-PAUTA.sql
--    (usa public.docentes, public._metas_docente_ok, public.resultados y
--     redefine public.metas_guardar).
--
-- PROBLEMA que resuelve:
--   Hoy el alumno escribe el NOMBRE del maestro y el emparejamiento es por
--   nombre. Si el alumno teclea mal el nombre (o hay maestros con nombres
--   parecidos), sus datos podrían no llegar o cruzarse. A escala de miles,
--   es frágil.
--
-- SOLUCIÓN:
--   Cada maestro tiene un CÓDIGO DE AULA corto y ÚNICO (ej. K2M9P). Lo
--   escribe en la pizarra; sus alumnos lo teclean UNA vez. Cuando un
--   resultado sube con ese código, el servidor lo resuelve al NOMBRE EXACTO
--   del maestro dueño (que ya es único) → imposible que se cruce. Si no
--   viene código, se sigue usando el nombre (compatibilidad total con lo ya
--   guardado y con las 28 misiones).
-- ============================================================

-- 1) Un código de aula por maestro, guardado en su ficha
alter table public.docentes add column if not exists codigo_aula text;

do $$
begin
  if not exists (select 1 from pg_indexes
                 where schemaname = 'public' and indexname = 'docentes_codigo_aula_unico') then
    begin
      create unique index docentes_codigo_aula_unico
        on public.docentes (codigo_aula)
        where codigo_aula is not null and codigo_aula <> '';
    exception when others then
      raise notice 'No se pudo crear docentes_codigo_aula_unico (¿códigos repetidos?).';
    end;
  end if;
end $$;

-- 2) Devuelve el código de aula del maestro; si no tiene, genera uno único.
--    Alfabeto sin caracteres confusos (sin O, 0, 1, I, L). 5 chars ≈ 17M.
create or replace function public.metas_aula_mi_codigo(p_codigo text, p_clave text)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_cod   text := upper(trim(coalesce(p_codigo,'')));
  v_alfa  text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_act   text;
  v_try   text;
  i int; intento int;
begin
  if not public._metas_docente_ok(v_cod, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select codigo_aula into v_act from public.docentes where codigo = v_cod;
  if v_act is not null and v_act <> '' then
    return jsonb_build_object('ok', true, 'codigo_aula', v_act);
  end if;
  for intento in 1..25 loop
    v_try := '';
    for i in 1..5 loop
      v_try := v_try || substr(v_alfa, 1 + floor(random() * length(v_alfa))::int, 1);
    end loop;
    begin
      update public.docentes set codigo_aula = v_try where codigo = v_cod;
      return jsonb_build_object('ok', true, 'codigo_aula', v_try);
    exception when unique_violation then
      -- colisión rarísima: reintenta con otro
      null;
    end;
  end loop;
  return jsonb_build_object('ok', false, 'motivo', 'reintenta');
end
$$;
revoke all on function public.metas_aula_mi_codigo(text,text) from public;
grant execute on function public.metas_aula_mi_codigo(text,text) to anon, authenticated;

-- 3) El alumno teclea un código → confirma el NOMBRE del maestro dueño.
--    (Solo devuelve el nombre, que es justo lo que el alumno escribiría;
--     no expone nada sensible.)
create or replace function public.metas_aula_resolver(p_codigo_aula text)
returns jsonb
language plpgsql security definer stable set search_path = public
as $$
declare
  v_a text := upper(trim(coalesce(p_codigo_aula,'')));
  v_nombre text;
begin
  if v_a = '' then return jsonb_build_object('ok', false); end if;
  select d.nombre into v_nombre from public.docentes d where d.codigo_aula = v_a;
  if v_nombre is null or v_nombre = '' then return jsonb_build_object('ok', false); end if;
  return jsonb_build_object('ok', true, 'nombre', v_nombre);
end
$$;
revoke all on function public.metas_aula_resolver(text) from public;
grant execute on function public.metas_aula_resolver(text) to anon, authenticated;

-- 4) metas_guardar: si la fila trae codigo_aula, el docente se RESUELVE al
--    nombre exacto del maestro dueño. Si no, se usa el nombre enviado
--    (compatibilidad total). Todo lo demás queda idéntico.
create or replace function public.metas_guardar(filas jsonb)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare n int;
begin
  if filas is null or jsonb_typeof(filas) <> 'array' or jsonb_array_length(filas) > 500 then
    return 0;
  end if;
  insert into public.resultados
    (evento_id, tipo, mision, forma, nota, base, alumno, codigo_lista,
     grado, docente, escuela, dispositivo, xp, fecha)
  select f.evento_id, f.tipo, f.mision, f.forma, f.nota, f.base, f.alumno, f.codigo_lista,
         f.grado,
         coalesce(d.nombre, f.docente),          -- ← código de aula → nombre EXACTO
         f.escuela, f.dispositivo, f.xp, f.fecha
  from jsonb_to_recordset(filas) as f(
    evento_id text, tipo text, mision text, forma int, nota int, base int,
    alumno text, codigo_lista text, grado text, docente text, escuela text,
    dispositivo text, xp int, fecha timestamptz, codigo_aula text)
  left join public.docentes d
    on d.codigo_aula = upper(nullif(trim(f.codigo_aula), ''))
  where f.evento_id is not null
    and f.tipo in ('evaluacion','prueba_operativa','pauta_vista')
  on conflict (evento_id) do nothing;
  get diagnostics n = row_count;
  return n;
end;
$$;
revoke all on function public.metas_guardar(jsonb) from public;
grant execute on function public.metas_guardar(jsonb) to anon, authenticated;
