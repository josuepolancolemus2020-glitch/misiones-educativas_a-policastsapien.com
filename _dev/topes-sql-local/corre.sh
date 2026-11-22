#!/usr/bin/env bash
# ============================================================================
# Prueba _privado/SUPABASE-TOPES-Y-PAGINAS.sql en un PostgreSQL 16 LOCAL y
# desechable. Nunca se conecta al proyecto real de Supabase.
#
#   bash _dev/topes-sql-local/corre.sh
#
# Arma la base con los .sql REALES de _privado/ (las mismas funciones que
# viven en la nube: metas_guardar de PUERTA-ANONIMA, el alta v2, el espejo
# del maestro, las dos consultas), pega el archivo de topes DOS veces (como
# si alguien lo volviera a pegar) y corre pruebas.sql. Sale con error si
# alguna prueba falla.
#
# No va en `npm test`: necesita los binarios de Postgres y el usuario del
# sistema «postgres», que la máquina del CI no tiene.
# ============================================================================
set -euo pipefail

AQUI="$(cd "$(dirname "$0")" && pwd)"
RAIZ="$(cd "$AQUI/../.." && pwd)"
PRIV="$RAIZ/_privado"
BIN="${PG_BIN:-/usr/lib/postgresql/16/bin}"
PUERTO="${PG_PUERTO:-54331}"
TMP="$(mktemp -d)"
chown postgres "$TMP"
DATOS="$TMP/datos"

como_pg() { su postgres -s /bin/bash -c "$*"; }
psql_pg() { como_pg "psql -X -q -h '$TMP' -p $PUERTO -U postgres -d metas_topes -v ON_ERROR_STOP=1 $*"; }

terminar() {
  como_pg "'$BIN/pg_ctl' -D '$DATOS' -m immediate stop" >/dev/null 2>&1 || true
  rm -rf "$TMP"
}
trap terminar EXIT

como_pg "'$BIN/initdb' -D '$DATOS' -U postgres -A trust --locale=C.UTF-8 -E UTF8" >/dev/null
como_pg "'$BIN/pg_ctl' -D '$DATOS' -l '$TMP/log' -o \"-k '$TMP' -p $PUERTO -c listen_addresses=''\" -w start" >/dev/null
como_pg "'$BIN/createdb' -h '$TMP' -p $PUERTO -U postgres metas_topes"

# Las dos partes de SUPABASE-FASE1.md que crean resultados y progreso (van
# dentro de bloques ```sql del documento).
awk '/^```sql$/{n++; dentro=(n==1||n==2); next} /^```$/{dentro=0; next} dentro' \
  "$PRIV/SUPABASE-FASE1.md" > "$TMP/fase1-2.sql"
# El freno por hora de SUPABASE-FASE3.sql (solo su tabla y su función: el
# resto del archivo pide tablas que esta prueba no necesita).
sed -n '/^-- ── 2) CANDADO DE VELOCIDAD/,/^revoke all on function public.metas_rate_ok() from public;/p' \
  "$PRIV/SUPABASE-FASE3.sql" > "$TMP/freno.sql"

cp "$AQUI"/*.sql "$TMP"/
for f in SUPABASE-DOCENTES.sql SUPABASE-DOCENTES-V2.sql SUPABASE-DOCENTE-ESTADO.sql \
         SUPABASE-DOCENTE-HISTORIAL.sql SUPABASE-PUERTA-ANONIMA.sql SUPABASE-TOPES-Y-PAGINAS.sql; do
  cp "$PRIV/$f" "$TMP/$f"
done
chown postgres "$TMP"/*.sql

echo "▶ Supabase simulado y la nube como está hoy"
psql_pg -f "'$TMP/00-plataforma.sql'"
psql_pg -f "'$TMP/fase1-2.sql'" >/dev/null
psql_pg -f "'$TMP/SUPABASE-DOCENTES.sql'" >/dev/null
psql_pg -f "'$TMP/SUPABASE-DOCENTES-V2.sql'" >/dev/null
psql_pg -f "'$TMP/freno.sql'" >/dev/null
psql_pg -f "'$TMP/SUPABASE-DOCENTE-ESTADO.sql'" >/dev/null
psql_pg -f "'$TMP/SUPABASE-DOCENTE-HISTORIAL.sql'" >/dev/null
psql_pg -f "'$TMP/SUPABASE-PUERTA-ANONIMA.sql'" >/dev/null
psql_pg -f "'$TMP/01-nube-simulada.sql'"
echo "▶ SUPABASE-TOPES-Y-PAGINAS.sql"
psql_pg -f "'$TMP/SUPABASE-TOPES-Y-PAGINAS.sql'"
echo "▶ SUPABASE-TOPES-Y-PAGINAS.sql otra vez (debe aguantar)"
psql_pg -f "'$TMP/SUPABASE-TOPES-Y-PAGINAS.sql'"
echo "▶ Pruebas"
psql_pg -o /dev/null -f "'$TMP/pruebas.sql'" 2>&1 | sed -E 's/^psql:[^ ]+ NOTICE:  //'
echo "✔ Topes y páginas: todo en verde"
