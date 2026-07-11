# ☁️ Supabase — Fase 1: Resultados en la nube

Guía de la integración de M.E.T.A.S con Supabase (proyecto `metas-misiones`,
plan Free, región East US). **Fase 1**: cada evaluación calificada
(conceptual u operativa) en cualquier dispositivo sube automáticamente a una
tabla `resultados` en la nube, y el maestro las consulta reunidas en
`consulta-nube.html`.

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

-- 3) Consulta del maestro (exige la clave del punto 1)
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
