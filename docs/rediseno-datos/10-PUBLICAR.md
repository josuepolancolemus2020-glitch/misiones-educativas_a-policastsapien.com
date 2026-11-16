# 10. El día de publicar el corte 1

Revisión 11. Pasos en orden. Cada paso dice qué se hace, cómo se comprueba
que salió bien y cómo se vuelve atrás. Si una comprobación no da lo que dice
aquí, **se para** y no se sigue al paso siguiente.

Lo que ya está hecho en el Supabase real (dicho por Josué): migraciones
`metas_v2_01`, `metas_v2_02` y `metas_v2_03` (la base nueva), las funciones
de borde `metas-entrar`, `metas-salir-todos` y `familia-vincular`, y el
esquema `metas` expuesto en la Data API. **Falta**: `SUPABASE-V2-CONGELAR.sql`
(paso 1), que es lo que este día cambia para la app vieja.

## 0. Antes del día (se decide con calma)

| qué | cómo se comprueba |
|---|---|
| Todas las capas en verde contra `supabase start` | `bash _dev/supabase-local/corre-supabase.sh --todo` termina sin ✘: capa A (291 + 13 de DESCONGELAR + 10 de volver a CONGELAR), A+ (26), B (13), C (18) |
| Las sondas | `npm test` termina en «✅ Las 78 sondas en verde» |
| **No es en pleno cierre de año** (08, 8.1) | «Cerrar el año escolar» todavía es el de antes. O se publica antes de que los docentes empiecen a cerrar, o cuando ya cerraron. En noviembre, preguntar primero |
| Aviso a los docentes, dos semanas antes (8.6) | el mensaje salió y la página «Actualiza la app de M.E.T.A.S» está lista |
| La APK nueva armada y probada encima de la v480 | `11-APK-ANDROID.md`, 11.3, pasos 1 a 6 |
| Quién está de guardia ese día | alguien con acceso al SQL Editor y a GitHub, con señal, durante las 2 horas siguientes |

Volver atrás: no hay nada que deshacer; solo se mueve la fecha.

## 1. Mirar el Supabase real (sin cambiar nada)

En el SQL Editor, de una en una:

```sql
select nombre, at from metas.hitos order by at;
```

Sin la fila `paso1` (CONGELAR todavía no corrió). Si ya está, saltar al paso 3
y solo hacer sus comprobaciones.

```sql
select count(*) as cuentas_vinculadas from metas.cuentas;
```

Anotar el número: sirve para comparar después.

```sql
select to_regprocedure('metas.blob_guardar(jsonb,boolean)') is null as falta_blob_por_sesion;
```

`true` (el blob por sesión lo crea CONGELAR).

Y desde cualquier computadora:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X OPTIONS https://uljjgrikyigdrkbikcxo.supabase.co/functions/v1/metas-entrar
```

`200`. En el panel de Supabase: Authentication → sesiones anónimas
encendidas con **Turnstile obligatorio**, alta por correo apagada; Edge
Functions → Secrets: `TURNSTILE_SECRET` (si el portal de familias nuevo sale
este día, ver 7).

Volver atrás: no cambia nada.

## 2. Copia del modelo viejo (por si acaso)

En el SQL Editor (pon la fecha del día en el nombre):

```sql
create table public._respaldo_20270201_docente_estado as select * from public.docente_estado;
create table public._respaldo_20270201_registro_admin as select * from public.registro_admin;
create table public._respaldo_20270201_mensajes_docente as select * from public.mensajes_docente;
alter table public._respaldo_20270201_docente_estado enable row level security;
alter table public._respaldo_20270201_registro_admin enable row level security;
alter table public._respaldo_20270201_mensajes_docente enable row level security;
revoke all on public._respaldo_20270201_docente_estado, public._respaldo_20270201_registro_admin,
              public._respaldo_20270201_mensajes_docente from anon, authenticated;
```

Comprobar: los tres `select count(*)` de cada respaldo son iguales a los de su
tabla. RLS y el `revoke` van porque en `public` nace todo con permisos para
anon (la llave pública podría leerlos).

Volver atrás: `drop table` de los tres respaldos, cuando el corte lleve un
mes sin problemas.

## 3. CONGELAR, paso 1

Pegar **entero** `docs/rediseno-datos/SUPABASE-V2-CONGELAR.sql` en el SQL
Editor y correrlo. Se puede correr dos veces sin efecto nuevo (la capa A lo
hace). Lo que cambia para la app vieja: no puede subir al blob nada del corte
1 de un docente vinculado (responde `-2` y lo deja pendiente en su aparato),
ni publicar recibos ni avisos de un docente vinculado, ni restaurar copias.
Los docentes sin vincular siguen como hoy hasta que entren con la app nueva.

Comprobar, de una en una:

```sql
select count(*) = 1 as hito_paso1 from metas.hitos where nombre = 'paso1';
```

```sql
select count(*) as claves_copiadas from metas.claves_archivo;
```

(mayor que cero: la copia de las claves viejas de todos)

```sql
select count(*) = 6 as candados from pg_trigger
 where tgname in ('docente_estado_candado', 'mensajes_docente_candado', 'registro_admin_congelada',
                  'registro_admin_congelada_truncate', 'registro_admin_historial_congelada',
                  'registro_admin_historial_congelada_truncate');
```

```sql
select has_function_privilege('authenticated', 'metas.blob_guardar(jsonb,boolean)', 'execute') as blob_por_sesion,
       not has_function_privilege('anon', 'public.metas_guardar_admin(text,text,jsonb)', 'execute') as guardar_admin_cerrada,
       has_function_privilege('anon', 'public.metas_cerrar_familias(text,text,jsonb)', 'execute') as cierre_de_anio_abierto,
       has_function_privilege('anon', 'public.metas_docente_estado_guardar(text,text,jsonb,boolean)', 'execute') as app_vieja_responde;
```

Las cuatro en `true`.

**Volver atrás**: pegar entero `docs/rediseno-datos/SUPABASE-V2-DESCONGELAR.sql`.
Va en una transacción (o se deshace todo o nada) y termina con una tabla
donde cada fila dice ✓. Devuelve sus nombres a las cuatro funciones
envueltas, quita los seis candados y el blob por sesión, reabre las
funciones con contraseña que usa la app de main y borra el hito `paso1`. No
toca la base nueva ni lo que los docentes anotaron en ella. Probado de ida y
vuelta (capa A, 20 y 21): después de DESCONGELAR el catálogo es el de antes
del paso 1, y volver a congelar lo deja igual que la primera vez. Lo que
DESCONGELAR deja cerrado a propósito: las firmas sin contraseña
(`metas_guardar_admin(jsonb)`, `metas_consultar_progreso`) y
`metas_restaurar_codigos` para anon.

## 4. Publicar la web

1. Pull request de `rediseño-datos` a `main`, revisado, y fusionarlo.
2. Confirmar la publicación (CLAUDE.md): en
   `https://api.github.com/repos/josuepolancolemus2020-glitch/misiones-educativas_a-policastsapien.com/actions/runs?per_page=20`
   buscar el `head_sha` del commit de la fusión en `completed / success` (no
   mirar la primera fila). Si no hay construcción, empujar un commit nuevo con
   algo real.
3. Comprobar lo servido:

   ```bash
   curl -s https://metas.policastsapien.com/sw.js | grep CACHE_NAME
   ```

   (`meta-app-v552` o el sello que tenga la fusión)

4. Probar con la cuenta de prueba de Josué (no con la de un docente), en un
   teléfono y en una PC: Zona Docente → entrar → Mi aula → una colecta (un
   toque, y quitarlo) → Equipos (armar y volver) → Gastos de mi bolsillo
   (anotar uno y quitarlo) → en el otro aparato se ve lo mismo. Y en la base:

   ```sql
   select k, version, actualizado_en from public.docente_estado
    where codigo = 'PROF-DE-LA-CUENTA-DE-PRUEBA' order by actualizado_en desc;
   ```

   (`METAS_ADMIN_V1` recién actualizado: el blob por sesión funciona)

   ```sql
   select count(*) from metas.blob_rechazos where ocurrido_at > now() - interval '1 hour';
   ```

   (solo intentos de apps viejas; ninguno de la cuenta de prueba)

**Volver atrás**: `git revert -m 1 <sha de la fusión>` en `main`, empujar y
confirmar su construcción igual que en 2. Si además hay que devolverle el blob
a la app vieja, DESCONGELAR (paso 3). Ojo: lo que los docentes anotaron en la
base nueva mientras tanto no aparece en la app vieja (sigue en la base nueva y
vuelve a verse cuando se publique otra vez).

## 5. La APK

Repartir la APK de `11-APK-ANDROID.md` por el enlace de siempre.

Volver atrás: Android no deja bajar de versión; si hiciera falta, otra APK con
`versionCode 5`. Con `server.url` casi todo se arregla publicando la web.

## 6. La primera semana

Una vez al día, en el SQL Editor:

```sql
select codigo, k, motivo, count(*) as intentos, max(ocurrido_at) as ultimo
  from metas.blob_rechazos group by 1, 2, 3 order by ultimo desc;
```

(quién sigue con una app o una pestaña vieja: escribirle directamente)

```sql
select motivo, count(*) from metas.rechazos where ocurrido_at > now() - interval '1 day' group by 1 order by 2 desc;
```

(lo que la app nueva no pudo anotar, por qué; con la razón del aula ya se le
mostró al docente)

```sql
select count(*) as cuentas_vinculadas from metas.cuentas;
```

(sube a medida que entran con la app nueva)

Y los cuatro contadores de `06-PRUEBAS.md`, 6.1 (inventados, revividos,
duplicados, perdidos) en cero.

## 7. Lo que NO sale este día (y por qué)

- **El portal nuevo de las familias**: `padres.html` tiene
  `TURNSTILE_SITEKEY = ''`, así que en el sitio publicado el portal sigue
  como hoy. Para encenderlo: la llave del sitio en `padres.html`, el secreto
  `TURNSTILE_SECRET` en las funciones de borde y Turnstile obligatorio en
  Auth. Es un cambio aparte, con su prueba.
- **La contraseña guardada en `METAS_DOCENTE_V1`**: ninguna herramienta del
  aula la usa ya (el blob viaja por sesión). Queda solo para lo de la cuenta
  que todavía pide código y contraseña en cada llamada: el código de aula
  (`metas_aula_mi_codigo`), el perfil (`metas_perfil_leer`,
  `metas_perfil_editar`), lo de Dirección y administración en Ajustes
  (`metas_rol_*`, `metas_permiso*`, `metas_sugerencia*`), «Resultados de mis
  alumnos» y «Ver la práctica» de Estadísticas (`metas_consultar_docente`,
  `metas_consultar_progreso_docente`). Quitarla del todo pide versiones por sesión de esas
  funciones (SQL nuevo); es la decisión pendiente de Josué.
- **`panel-docente.html`, «Restaurar claves de familia»**: después de
  CONGELAR, `metas_restaurar_codigos` queda cerrada y ese botón ya no hace
  nada. Se quita del panel (09, 9.5).
- **«Cerrar el año escolar»** para la base nueva (08, 8.1).
- **pg_cron**: solo hace falta antes de fijar la fecha del paso 4.
