# ☁️ Supabase — Fase 1: Resultados en la nube

Guía de la integración de M.E.T.A.S con Supabase (proyecto `metas-misiones`,
plan Free, región East US). **Fase 1**: cada evaluación calificada
(conceptual u operativa) en cualquier dispositivo sube automáticamente a una
tabla `resultados` en la nube, y el maestro las consulta reunidas en
`consulta-nube.html`.

> 📌 **Nota (jul 2026):** este documento describe la Fase 1 histórica, cuando
> se consultaba con una "clave del docente" suelta. Hoy el maestro entra a
> `consulta-nube.html` con el **correo y la contraseña de su cuenta de
> maestro**, y sus alumnos lo identifican escribiendo **su nombre** en el
> campo «Docente». El código interno de docente lo genera el servidor y ya no
> se muestra en la interfaz. Lo de abajo se conserva como referencia técnica.

## Cómo funciona (offline-first, innegociable)

1. Las misiones siguen guardando TODO en el dispositivo (localStorage),
   igual que siempre. Sin internet nada se bloquea ni se pierde.
2. `js/metas-registro.js` avisa a `js/metas-supabase.js` de cada evaluación
   calificada; esta se copia a una cola local (`METAS_SB_OUTBOX_V1`).
3. Cuando hay internet, la cola se envía a la tabla `resultados` y se vacía.
   Los reintentos tras un corte de luz **no duplican** filas (deduplicación
   por `evento_id` en el servidor).
4. La app usa la clave **pública** (`sb_publishable_...`), que por las
   políticas RLS **solo puede insertar**: ningún estudiante puede leer datos
   de otros. El maestro consulta con su **clave del docente** en
   `consulta-nube.html` (también enlazada desde `registro.html`).
5. La primera vez que un dispositivo carga la capa nube, sube también su
   historial previo de evaluaciones (backfill automático).

## Piezas

| Pieza | Dónde |
|---|---|
| Cola y envío a la nube | `js/metas-supabase.js` (lo carga solo `metas-registro.js`; las misiones no se tocan) |
| Número de lista del alumno (`codigo_lista`) | campo nuevo opcional en el modal de identificación |
| Consulta del maestro | `consulta-nube.html` (clave del docente + filtros + CSV) |
| Tabla y seguridad | script SQL de abajo, pegado en el SQL Editor de Supabase |

Claves de localStorage: `METAS_SB_OUTBOX_V1` (cola), `METAS_SB_BACKFILL_V1`
(historial ya copiado), `METAS_SB_CLAVE` (clave del docente en su equipo),
`METAS_SB_URL` / `METAS_SB_KEY` (otro maestro puede apuntar a su propio
proyecto Supabase sin tocar el código).

## Script SQL (pegar en Supabase → SQL Editor → Run)

> ⚠️ Antes de ejecutarlo, cambia `CAMBIA-ESTA-CLAVE` por una clave secreta
> propia (es la que usarás en consulta-nube.html). Para cambiarla después,
> vuelve a ejecutar solo el bloque del `insert ... on conflict`.

```sql
-- ============================================================
-- M.E.T.A.S — Supabase Fase 1: resultados en la nube
-- ============================================================

-- 1) Clave del docente (guardada en una tabla que la API no expone)
create table if not exists public.metas_config (
  id int primary key default 1 check (id = 1),
  clave_docente text not null
);
alter table public.metas_config enable row level security;
-- sin políticas: nadie puede leerla ni modificarla desde la app

insert into public.metas_config (id, clave_docente)
values (1, 'CAMBIA-ESTA-CLAVE')
on conflict (id) do update set clave_docente = excluded.clave_docente;

-- 2) Tabla de resultados
create table if not exists public.resultados (
  id bigint generated always as identity primary key,
  evento_id text not null unique,
  tipo text not null check (tipo in ('evaluacion','prueba_operativa')),
  mision text,
  forma int,
  nota int,
  base int,
  alumno text,
  codigo_lista text,
  grado text,
  docente text,
  escuela text,
  dispositivo text,
  xp int,
  detalle jsonb,
  fecha timestamptz,
  creado_en timestamptz not null default now()
);
alter table public.resultados enable row level security;

-- La app (clave pública) SOLO puede insertar; nadie puede leer directo
drop policy if exists resultados_insertar on public.resultados;
create policy resultados_insertar on public.resultados
  for insert to anon, authenticated
  with check (true);

create index if not exists resultados_mision_idx on public.resultados (mision);
create index if not exists resultados_fecha_idx on public.resultados (fecha desc);

-- 3) Guardado con deduplicación (la app llama esta función, no la tabla).
--    Necesaria porque RLS de solo-insertar no permite usar on_conflict
--    del API REST (requiere leer la fila existente).
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
    and f.tipo in ('evaluacion','prueba_operativa')
  on conflict (evento_id) do nothing;
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.metas_guardar(jsonb) from public;
grant execute on function public.metas_guardar(jsonb) to anon, authenticated;

-- 4) Consulta del maestro (exige la clave del punto 1)
create or replace function public.metas_consultar(p_clave text)
returns setof public.resultados
language sql
security definer
set search_path = public
stable
as $$
  select r.*
  from public.resultados r
  where exists (select 1 from public.metas_config c where c.clave_docente = p_clave)
  order by r.fecha desc nulls last
  limit 5000;
$$;

revoke all on function public.metas_consultar(text) from public;
grant execute on function public.metas_consultar(text) to anon, authenticated;
```

## ☁️ Fase 2: espejo de progreso (XP, insignias, diagnósticos)

Además de los resultados (Fase 1), cada dispositivo sube una **foto del
avance** del alumno actual: XP del index (`meta_v2`), secciones completadas,
mejor nota por misión, misiones dominadas (≥70), minutos activos,
diagnósticos de rutas (`METAS_DIAG_V1`) e insignias del Campeonísimo
(`METAS_CAMP_V1`). Es un **upsert** (una fila por dispositivo+alumno que se
actualiza, no se acumula) y solo se envía cuando el resumen cambió desde el
último envío exitoso (`METAS_SB_PROG_V1` guarda el último enviado).
El maestro lo ve en `consulta-nube.html`, sección "🎖️ Progreso por alumno".

### Script SQL de la Fase 2 (pegar en SQL Editor → Run)

```sql
-- ============================================================
-- M.E.T.A.S — Supabase Fase 2: espejo de progreso
-- ============================================================

create table if not exists public.progreso (
  id bigint generated always as identity primary key,
  dispositivo text not null,
  alumno text not null default '',
  codigo_lista text,
  grado text,
  docente text,
  escuela text,
  resumen jsonb,
  actualizado_en timestamptz not null default now(),
  unique (dispositivo, alumno)
);
alter table public.progreso enable row level security;
-- sin políticas: todo pasa por las funciones de abajo

-- Guardado (upsert por dispositivo+alumno)
create or replace function public.metas_guardar_progreso(fila jsonb)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if fila is null or jsonb_typeof(fila) <> 'object' then return false; end if;
  if coalesce(fila->>'dispositivo','') = '' then return false; end if;
  if pg_column_size(fila) > 100000 then return false; end if;
  insert into public.progreso
    (dispositivo, alumno, codigo_lista, grado, docente, escuela, resumen, actualizado_en)
  values (
    fila->>'dispositivo',
    coalesce(fila->>'alumno',''),
    fila->>'codigo_lista',
    fila->>'grado',
    fila->>'docente',
    fila->>'escuela',
    fila->'resumen',
    now()
  )
  on conflict (dispositivo, alumno) do update
    set codigo_lista  = excluded.codigo_lista,
        grado         = excluded.grado,
        docente       = excluded.docente,
        escuela       = excluded.escuela,
        resumen       = excluded.resumen,
        actualizado_en = now();
  return true;
end;
$$;

revoke all on function public.metas_guardar_progreso(jsonb) from public;
grant execute on function public.metas_guardar_progreso(jsonb) to anon, authenticated;

-- Consulta del maestro (exige la clave del docente)
create or replace function public.metas_consultar_progreso(p_clave text)
returns setof public.progreso
language sql
security definer
set search_path = public
stable
as $$
  select p.*
  from public.progreso p
  where exists (select 1 from public.metas_config c where c.clave_docente = p_clave)
  order by p.actualizado_en desc
  limit 2000;
$$;

revoke all on function public.metas_consultar_progreso(text) from public;
grant execute on function public.metas_consultar_progreso(text) to anon, authenticated;
```

## 🔐 Fase 3: panel docente con login de maestros

`panel-docente.html`: los maestros entran con **correo y contraseña** y la
base de datos les entrega solo las filas de **su alcance** (RLS por
escuela/grados/docente). Los estudiantes siguen sin cuentas.

- Las cuentas las crea el administrador en el dashboard (Authentication →
  Users → **Add user** → email + password + ✅ Auto Confirm). No hay
  auto-registro útil: una cuenta sin fila en `maestros` no ve nada.
- Recomendado: Authentication → Sign In / Providers → desactivar
  **Allow new users to sign up**.
- La tabla `maestros` define el alcance de cada cuenta. Filtros en NULL =
  ve todo el proyecto (administrador). `escuela`/`docente` comparan por
  "contiene" (ilike) porque los alumnos los escriben a mano; `grados` es
  lista exacta.
- Autorizar a un maestro (después de crear su cuenta):
  ```sql
  insert into public.maestros (id, nombre)
  select id, 'Prof. Josué' from auth.users where email = 'CORREO@DEL.MAESTRO';
  ```
  Con alcance limitado:
  ```sql
  insert into public.maestros (id, nombre, escuela, grados)
  select id, 'Prof. Ana', 'Francisco Morazán', array['6to A','6to B']
  from auth.users where email = 'ana@ejemplo.com';
  ```
- Sesión del panel en `METAS_PANEL_SESION_V1` (token + refresh automático).

### Script SQL de la Fase 3 (pegar en SQL Editor → Run)

```sql
-- ============================================================
-- M.E.T.A.S — Supabase Fase 3: maestros con login y RLS por alcance
-- ============================================================

create table if not exists public.maestros (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default '',
  escuela text,      -- NULL = sin filtro (ve todas las escuelas)
  grados text[],     -- NULL = sin filtro; ej: array['6to A','6to B']
  docente text,      -- NULL = sin filtro; compara "contiene" con el campo docente
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);
alter table public.maestros enable row level security;

-- cada maestro puede ver SOLO su propia fila (para saber su alcance)
drop policy if exists maestros_propio on public.maestros;
create policy maestros_propio on public.maestros
  for select to authenticated
  using (id = auth.uid());

-- lectura de resultados para maestros activos, limitada a su alcance
drop policy if exists resultados_maestros_leen on public.resultados;
create policy resultados_maestros_leen on public.resultados
  for select to authenticated
  using (
    exists (
      select 1 from public.maestros m
      where m.id = auth.uid() and m.activo
        and (m.escuela is null or resultados.escuela ilike '%' || m.escuela || '%')
        and (m.grados  is null or resultados.grado = any (m.grados))
        and (m.docente is null or resultados.docente ilike '%' || m.docente || '%')
    )
  );

-- lo mismo para el espejo de progreso
drop policy if exists progreso_maestros_leen on public.progreso;
create policy progreso_maestros_leen on public.progreso
  for select to authenticated
  using (
    exists (
      select 1 from public.maestros m
      where m.id = auth.uid() and m.activo
        and (m.escuela is null or progreso.escuela ilike '%' || m.escuela || '%')
        and (m.grados  is null or progreso.grado = any (m.grados))
        and (m.docente is null or progreso.docente ilike '%' || m.docente || '%')
    )
  );
```

## Advertencias vigentes

- **Plan Free**: Supabase pausa el proyecto tras ~1 semana sin uso (típico en
  vacaciones). Se reactiva con un clic en supabase.com → el proyecto →
  "Restore". Los datos no se pierden.
- **Datos de menores**: RLS estricto desde el día 1 + minimización — se
  recomienda usar número de lista o código en lugar del nombre completo.
- La clave `service_role` (Secret) **nunca** va en el código ni en el chat.
- La telemetría existente (WhatsApp, Google Sheets vía `METAS_SYNC_URL`)
  sigue intacta; Supabase la complementa, no la reemplaza.

## Fases siguientes acordadas

2. Espejo de progreso `METAS_*` (XP, insignias, diagnósticos de rutas).
3. Panel docente con login solo para maestros (RLS por grado/centro).
4. Realtime (Campeonísimo entre dispositivos) + chatbot de padres vía
   `codigo_lista`.
