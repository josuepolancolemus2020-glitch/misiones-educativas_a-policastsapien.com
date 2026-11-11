-- ============================================================
-- M.E.T.A.S — Supabase: CERRAR TABLAS SIN CANDADO (RLS)
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- ¿Por qué? Supabase avisó por correo: «Table publicly accessible —
-- Row-Level Security is not enabled» (rls_disabled_in_public).
-- Significa que alguna tabla del proyecto quedó SIN el candado RLS:
-- cualquiera con la URL del proyecto podría leerla o borrarla.
--
-- En M.E.T.A.S la regla de la casa es: TODAS las tablas con RLS
-- activado y sin políticas anónimas — la app nunca toca las tablas
-- directamente, todo pasa por funciones (RPC security definer).
-- Por eso activar el candado aquí NO rompe nada: las funciones
-- siguen funcionando igual (corren con permisos del servidor).
--
-- Este script:
--   1) Te muestra qué tablas están sin candado (para el registro).
--   2) Les activa RLS a todas de un solo golpe.
--   3) Vuelve a comprobar: la lista final debe salir VACÍA.
-- Es seguro correrlo las veces que quieras (idempotente).
-- ============================================================

-- 1) ¿Qué tablas están sin candado? (apunta los nombres que salgan)
select tablename as tabla_sin_candado
from pg_tables
where schemaname = 'public' and rowsecurity = false
order by tablename;

-- 2) Activar el candado RLS en TODAS las tablas de public que no lo tengan
do $$
declare
  t record;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public' and rowsecurity = false
  loop
    execute format('alter table public.%I enable row level security', t.tablename);
    raise notice 'Candado RLS activado en: %', t.tablename;
  end loop;
end $$;

-- 3) Comprobación final: esta lista debe salir VACÍA (0 filas)
select tablename as todavia_sin_candado
from pg_tables
where schemaname = 'public' and rowsecurity = false;

-- ============================================================
-- DESPUÉS DE CORRERLO, prueba 2 minutos que todo sigue vivo:
--   · una misión que suba una evaluación (resultados),
--   · consulta-nube.html con tu cuenta de maestro,
--   · el chatbot de padres con una clave de familia,
--   · el buzón de excusas en Mi aula → Asistencia.
-- Si algo dejara de responder, la tabla afectada necesitaba una
-- política de lectura que nunca tuvo: avísale a Claude qué tabla
-- salió en la lista del paso 1 y se le escribe su política.
--
-- Nota: el aviso de Supabase también se apaga solo en unas horas
-- en Database → Advisors, cuando vuelve a escanear el proyecto.
-- ============================================================
