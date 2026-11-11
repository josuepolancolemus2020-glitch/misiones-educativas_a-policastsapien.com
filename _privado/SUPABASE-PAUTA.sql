-- ============================================================
-- M.E.T.A.S — Anti-trampa: la nube acepta el evento «pauta_vista»
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- Cuando un estudiante abre la pauta (respuestas) de la evaluación
-- en su dispositivo, la misión lo registra. Este SQL permite que ese
-- evento suba a la tabla resultados para que el maestro vea el ⚠️
-- también en la consulta en la nube.
-- ============================================================

-- 1) El check de tipos acepta el nuevo evento
alter table public.resultados drop constraint if exists resultados_tipo_check;
alter table public.resultados add constraint resultados_tipo_check
  check (tipo in ('evaluacion','prueba_operativa','pauta_vista'));

-- 2) La función de guardado también lo acepta
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
         f.grado, f.docente, f.escuela, f.dispositivo, f.xp, f.fecha
  from jsonb_to_recordset(filas) as f(
    evento_id text, tipo text, mision text, forma int, nota int, base int,
    alumno text, codigo_lista text, grado text, docente text, escuela text,
    dispositivo text, xp int, fecha timestamptz)
  where f.evento_id is not null
    and f.tipo in ('evaluacion','prueba_operativa','pauta_vista')
  on conflict (evento_id) do nothing;
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.metas_guardar(jsonb) from public;
grant execute on function public.metas_guardar(jsonb) to anon, authenticated;
