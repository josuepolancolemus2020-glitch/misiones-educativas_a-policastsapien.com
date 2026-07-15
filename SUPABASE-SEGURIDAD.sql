-- ============================================================
-- M.E.T.A.S — BLINDAJE DE SEGURIDAD (auditoría 14 jul 2026)
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run.
-- Es IDEMPOTENTE: se puede correr varias veces sin dañar nada.
--
-- ⚠️ ORDEN DE DESPLIEGUE (importante):
--   1) Corre PRIMERO este archivo en Supabase.
--   2) DESPUÉS publica la nueva versión de la app (git push).
--   Las funciones de guardado cambian de firma (ahora exigen la cuenta
--   del maestro): una app vieja que aún mande el cuerpo viejo recibirá
--   error hasta refrescar. Para un piloto pequeño, refrescar la app basta.
--
-- Qué endurece:
--   A1) metas_cerrar_familias  → exige la cuenta del maestro (PROF +
--       contraseña) antes de borrar; el borrado deja de depender solo
--       de conocer la clave de familia.
--   A2) metas_rate_ok  → identifica al cliente por cf-connecting-ip
--       (Cloudflare la fija, no es falsificable) en vez de una cabecera
--       que el cliente controla.
--   A3) metas_guardar_avisos/admin/plan  → exigen PROF + contraseña
--       (validados con _metas_docente_ok): solo el maestro publica en la
--       nube del chatbot.
--   RLS) Panel docente  → igualdad de nombre normalizada exacta en vez de
--       coincidencia por substring. La rama admin (docente IS NULL = ver
--       todo) se conserva.
--
-- Requiere que ya estén corridos: SUPABASE-DOCENTES-V2.sql (define
-- _metas_docente_ok y metas_norm) y SUPABASE-FASE3.sql (define
-- metas_intentos / metas_rate_ok / las tablas del chatbot).
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- A2) CANDADO DE VELOCIDAD con IP no falsificable
--     Cloudflare (frente de Supabase) fija cf-connecting-ip con la IP
--     REAL del cliente y sobreescribe cualquier valor que el cliente
--     mande. Preferimos esa cabecera para contar por IP de forma fiable;
--     x-forwarded-for queda solo como último recurso.
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_rate_ok()
returns boolean
language plpgsql security definer set search_path = public
as $$
declare
  v_hdrs json;
  v_ip text := 'desconocida';
  v_ventana timestamptz := date_trunc('hour', now());
  v_n integer;
begin
  begin
    v_hdrs := current_setting('request.headers', true)::json;
    v_ip := coalesce(
      nullif(trim(v_hdrs->>'cf-connecting-ip'), ''),         -- Cloudflare: no falsificable
      nullif(trim(v_hdrs->>'true-client-ip'), ''),           -- respaldo (Enterprise)
      nullif(trim(split_part(v_hdrs->>'x-forwarded-for', ',', 1)), ''),  -- último recurso
      'desconocida');
  exception when others then
    v_ip := 'desconocida';
  end;
  insert into public.metas_intentos as t (ip, ventana, n) values (v_ip, v_ventana, 1)
  on conflict (ip, ventana) do update set n = t.n + 1
  returning t.n into v_n;
  if v_n = 1 then
    delete from public.metas_intentos where ventana < now() - interval '3 hours';
  end if;
  return v_n <= 300;
end
$$;
revoke all on function public.metas_rate_ok() from public;
-- Verifica cuál cabecera trae tu proyecto (por si no está tras Cloudflare):
--   select current_setting('request.headers', true)::json;
-- desde una Edge Function o revisando los logs; si cf-connecting-ip llega
-- vacía en tu plan, el candado sigue funcionando por x-forwarded-for.


-- ────────────────────────────────────────────────────────────
-- A3) metas_guardar_admin  — ahora exige cuenta docente.
--     (Base: versión de SUPABASE-FASE3.sql, con anio_lectivo.)
--     Devuelve -1 si la contraseña del maestro es incorrecta.
-- ────────────────────────────────────────────────────────────
drop function if exists public.metas_guardar_admin(jsonb);
create or replace function public.metas_guardar_admin(p_prof text, p_clave text, filas jsonb)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  n integer := 0;
  f jsonb;
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
      insert into public.registro_admin
        (evento_id, codigo, tipo, fecha, estado, parcial, materia, nota,
         concepto, monto, grado, seccion, docente, anio_lectivo)
      values (
        f->>'evento_id',
        upper(regexp_replace(coalesce(f->>'codigo',''), '\s', '', 'g')),
        f->>'tipo',
        nullif(f->>'fecha','')::date,
        f->>'estado', f->>'parcial', f->>'materia',
        nullif(f->>'nota','')::numeric,
        f->>'concepto',
        nullif(f->>'monto','')::numeric,
        f->>'grado', f->>'seccion', f->>'docente', f->>'anio_lectivo'
      )
      on conflict (evento_id) do update set
        codigo = excluded.codigo,
        fecha = excluded.fecha, estado = excluded.estado,
        parcial = excluded.parcial, materia = excluded.materia,
        nota = excluded.nota, concepto = excluded.concepto,
        monto = excluded.monto,
        grado = excluded.grado, seccion = excluded.seccion,
        docente = excluded.docente, anio_lectivo = excluded.anio_lectivo,
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
-- A3) metas_guardar_avisos — ahora exige cuenta docente.
-- ────────────────────────────────────────────────────────────
drop function if exists public.metas_guardar_avisos(jsonb);
create or replace function public.metas_guardar_avisos(p_prof text, p_clave text, filas jsonb)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  n integer := 0;
  f jsonb;
begin
  if not public._metas_docente_ok(p_prof, p_clave) then return -1; end if;
  if jsonb_typeof(filas) <> 'array' or jsonb_array_length(filas) > 300 then
    return 0;
  end if;
  for f in select * from jsonb_array_elements(filas) loop
    begin
      if coalesce(f->>'evento_id','') = '' or coalesce(f->>'codigo','') = ''
         or coalesce(f->>'subtipo','') = '' or coalesce(f->>'vigente_hasta','') = '' then
        continue;
      end if;
      insert into public.mensajes_docente
        (evento_id, codigo, subtipo, prioridad, titulo, texto, pregunta,
         claves, fecha_evento, vigente_hasta, grado, seccion, docente, anio_lectivo)
      values (
        f->>'evento_id',
        upper(regexp_replace(coalesce(f->>'codigo',''), '\s', '', 'g')),
        f->>'subtipo',
        f->>'prioridad',
        left(coalesce(f->>'titulo',''), 120),
        left(coalesce(f->>'texto',''), 1200),
        left(coalesce(f->>'pregunta',''), 200),
        left(coalesce(f->>'claves',''), 200),
        nullif(f->>'fecha_evento','')::date,
        (f->>'vigente_hasta')::date,
        f->>'grado', f->>'seccion', f->>'docente', f->>'anio_lectivo'
      )
      on conflict (evento_id) do update set
        codigo = excluded.codigo,
        subtipo = excluded.subtipo, prioridad = excluded.prioridad,
        titulo = excluded.titulo, texto = excluded.texto,
        pregunta = excluded.pregunta, claves = excluded.claves,
        fecha_evento = excluded.fecha_evento,
        vigente_hasta = excluded.vigente_hasta,
        grado = excluded.grado, seccion = excluded.seccion,
        docente = excluded.docente, anio_lectivo = excluded.anio_lectivo,
        actualizado_en = now();
      n := n + 1;
    exception when others then
      null;
    end;
  end loop;
  return n;
end
$$;
revoke all on function public.metas_guardar_avisos(text,text,jsonb) from public;
grant execute on function public.metas_guardar_avisos(text,text,jsonb) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- A3) metas_guardar_plan — ahora exige cuenta docente.
-- ────────────────────────────────────────────────────────────
drop function if exists public.metas_guardar_plan(jsonb);
create or replace function public.metas_guardar_plan(p_prof text, p_clave text, filas jsonb)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  n integer := 0;
  f jsonb;
begin
  if not public._metas_docente_ok(p_prof, p_clave) then return -1; end if;
  if jsonb_typeof(filas) <> 'array' or jsonb_array_length(filas) > 300 then
    return 0;
  end if;
  for f in select * from jsonb_array_elements(filas) loop
    begin
      if coalesce(f->>'evento_id','') = '' or coalesce(f->>'codigo','') = '' then
        continue;
      end if;
      insert into public.plan_accion
        (evento_id, codigo, num, alumno, grado, seccion, docente,
         evaluacion, mision, forma, tipo, nota, base, nsp,
         categoria, mensaje, fecha_analisis)
      values (
        f->>'evento_id',
        upper(regexp_replace(coalesce(f->>'codigo',''), '\s', '', 'g')),
        f->>'num', f->>'alumno', f->>'grado', f->>'seccion', f->>'docente',
        f->>'evaluacion', f->>'mision', f->>'forma', f->>'tipo',
        nullif(f->>'nota','')::numeric,
        coalesce(nullif(f->>'base','')::numeric, 100),
        coalesce((f->>'nsp')::boolean, false),
        f->>'categoria', f->>'mensaje',
        nullif(f->>'fecha_analisis','')::timestamptz
      )
      on conflict (evento_id) do update set
        codigo = excluded.codigo,
        alumno = excluded.alumno,
        grado = excluded.grado, seccion = excluded.seccion, docente = excluded.docente,
        evaluacion = excluded.evaluacion, mision = excluded.mision,
        forma = excluded.forma, tipo = excluded.tipo,
        nota = excluded.nota, base = excluded.base, nsp = excluded.nsp,
        categoria = excluded.categoria, mensaje = excluded.mensaje,
        fecha_analisis = excluded.fecha_analisis;
      n := n + 1;
    exception when others then
      null;
    end;
  end loop;
  return n;
end
$$;
revoke all on function public.metas_guardar_plan(text,text,jsonb) from public;
grant execute on function public.metas_guardar_plan(text,text,jsonb) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- A1) metas_cerrar_familias — ahora exige cuenta docente.
--     (El cliente ya pedía la contraseña; ahora el servidor la exige.)
--     Devuelve -1 si la contraseña del maestro es incorrecta.
-- ────────────────────────────────────────────────────────────
drop function if exists public.metas_cerrar_familias(jsonb);
create or replace function public.metas_cerrar_familias(p_prof text, p_clave text, p_codigos jsonb)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  cods text[];
  total integer := 0;
  k integer;
begin
  if not public._metas_docente_ok(p_prof, p_clave) then return -1; end if;
  if jsonb_typeof(p_codigos) <> 'array' or jsonb_array_length(p_codigos) > 100 then
    return 0;
  end if;
  select array_agg(distinct upper(regexp_replace(v, '\s', '', 'g')))
    into cods
  from jsonb_array_elements_text(p_codigos) v
  where length(regexp_replace(v, '\s', '', 'g')) >= 2;
  if cods is null or array_length(cods, 1) = 0 then return 0; end if;

  delete from public.plan_accion where codigo = any(cods);
  get diagnostics k = row_count; total := total + k;
  delete from public.registro_admin where codigo = any(cods);
  get diagnostics k = row_count; total := total + k;
  delete from public.mensajes_docente where codigo = any(cods);
  get diagnostics k = row_count; total := total + k;
  delete from public.mensajes_padre where codigo = any(cods);
  get diagnostics k = row_count; total := total + k;
  delete from public.aviso_visto where codigo = any(cods);
  get diagnostics k = row_count; total := total + k;
  return total;
end
$$;
revoke all on function public.metas_cerrar_familias(text,text,jsonb) from public;
grant execute on function public.metas_cerrar_familias(text,text,jsonb) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- RLS) Panel docente: substring ilike '%…%' → igualdad normalizada.
--     Un nombre contenido en otro («Ana» ⊂ «Mariana») ya no filtra
--     datos. La rama admin (docente IS NULL = ve todo) se conserva.
-- ────────────────────────────────────────────────────────────
drop policy if exists plan_maestros_leen on public.plan_accion;
create policy plan_maestros_leen on public.plan_accion
  for select to authenticated
  using (
    exists (
      select 1 from public.maestros m
      where m.id = auth.uid()
        and ( m.docente is null
           or public.metas_norm(public.plan_accion.docente) = public.metas_norm(m.docente) )
    )
  );

drop policy if exists admin_maestros_leen on public.registro_admin;
create policy admin_maestros_leen on public.registro_admin
  for select to authenticated
  using (
    exists (
      select 1 from public.maestros m
      where m.id = auth.uid()
        and ( m.docente is null
           or public.metas_norm(public.registro_admin.docente) = public.metas_norm(m.docente) )
    )
  );

drop policy if exists avisos_maestros_leen on public.mensajes_docente;
create policy avisos_maestros_leen on public.mensajes_docente
  for select to authenticated
  using (
    exists (
      select 1 from public.maestros m
      where m.id = auth.uid()
        and ( m.docente is null
           or public.metas_norm(public.mensajes_docente.docente) = public.metas_norm(m.docente) )
    )
  );


-- ── Verificación rápida tras correr (opcional) ──────────────
-- 1) Guardar sin cuenta debe devolver -1 (rechazado):
--    select public.metas_guardar_plan('PROF-NADA','malo','[]'::jsonb);   -- espera -1
-- 2) Borrar sin cuenta debe devolver -1:
--    select public.metas_cerrar_familias('PROF-NADA','malo','["X"]'::jsonb); -- espera -1
-- 3) Con tu PROF + contraseña reales debe devolver 0 o el número de filas.
