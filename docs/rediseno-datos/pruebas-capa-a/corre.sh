#!/usr/bin/env bash
# ============================================================================
# Capa A · corre los .sql del rediseño y sus pruebas en un Postgres LOCAL
# desechable. Nunca se conecta al proyecto real de Supabase.
#
#   bash docs/rediseno-datos/pruebas-capa-a/corre.sh
#
# Necesita los binarios de PostgreSQL 16 (initdb, pg_ctl, psql) y el usuario
# del sistema «postgres». Crea la base en una carpeta temporal, la usa y la
# borra al terminar. Sale con error si alguna prueba falla.
# ============================================================================
set -euo pipefail

AQUI="$(cd "$(dirname "$0")" && pwd)"
DISENO="$(cd "$AQUI/.." && pwd)"
BIN="${PG_BIN:-/usr/lib/postgresql/16/bin}"
PUERTO="${PG_PUERTO:-54329}"
TMP="$(mktemp -d)"
chown postgres "$TMP"
DATOS="$TMP/datos"

como_pg() { su postgres -s /bin/bash -c "$*"; }
psql_pg() { como_pg "psql -X -q -h '$TMP' -p $PUERTO -U postgres -d metas_prueba -v ON_ERROR_STOP=1 $*"; }

terminar() {
  como_pg "'$BIN/pg_ctl' -D '$DATOS' -m immediate stop" >/dev/null 2>&1 || true
  rm -rf "$TMP"
}
trap terminar EXIT

como_pg "'$BIN/initdb' -D '$DATOS' -U postgres -A trust --locale=C.UTF-8 -E UTF8" >/dev/null
como_pg "'$BIN/pg_ctl' -D '$DATOS' -l '$TMP/log' -o \"-k '$TMP' -p $PUERTO -c listen_addresses=''\" -w start" >/dev/null
como_pg "'$BIN/createdb' -h '$TMP' -p $PUERTO -U postgres metas_prueba"

# Copias legibles por el usuario postgres.
cp "$AQUI"/*.sql "$DISENO"/SUPABASE-V2-*.sql "$TMP"/
chown postgres "$TMP"/*.sql

echo "▶ Supabase simulado y archivo viejo"
psql_pg -f "'$TMP/00-supabase-simulado.sql'"
psql_pg -f "'$TMP/01-datos-viejos.sql'"
echo "▶ SUPABASE-V2-VINCULACION.sql"
psql_pg -f "'$TMP/SUPABASE-V2-VINCULACION.sql'"
psql_pg -f "'$TMP/02-vincular-antes-del-paso1.sql'"
echo "▶ SUPABASE-V2-ESQUEMA.sql"
psql_pg -f "'$TMP/SUPABASE-V2-ESQUEMA.sql'"
echo "▶ SUPABASE-V2-FAMILIAS.sql"
psql_pg -f "'$TMP/SUPABASE-V2-FAMILIAS.sql'"
echo "▶ SUPABASE-V2-CONGELAR.sql (paso 1)"
psql_pg -f "'$TMP/SUPABASE-V2-CONGELAR.sql'"
# Una segunda vez, como si alguien lo pegara de nuevo en el SQL Editor: no
# debe fallar ni cambiar nada (las pruebas C5 lo comprueban).
echo "▶ SUPABASE-V2-CONGELAR.sql otra vez (debe aguantar)"
psql_pg -f "'$TMP/SUPABASE-V2-CONGELAR.sql'" >/dev/null 2>&1 \
  || { echo "✘ CONGELAR falló la segunda vez"; psql_pg -f "'$TMP/SUPABASE-V2-CONGELAR.sql'"; exit 1; }
echo "▶ Pruebas"
psql_pg -v "conninfo='host=$TMP port=$PUERTO user=postgres dbname=metas_prueba'" -f "'$TMP/10-pruebas.sql'"
