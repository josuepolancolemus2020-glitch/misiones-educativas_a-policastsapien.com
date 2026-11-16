#!/usr/bin/env bash
# ============================================================================
# Capa A y capa A+ contra un Supabase LOCAL de verdad (`supabase start`)
# ----------------------------------------------------------------------------
#   bash _dev/supabase-local/corre-supabase.sh             # capa A + capa A+
#   bash _dev/supabase-local/corre-supabase.sh --solo-sql  # solo la capa A
#   bash _dev/supabase-local/corre-supabase.sh --capa-b    # + capa B (cola y conflictos)
#   bash _dev/supabase-local/corre-supabase.sh --capa-c    # + capa C (navegador)
#   bash _dev/supabase-local/corre-supabase.sh --todo      # A, A+, B y C
# Las capas B y C están escritas ANTES del código del corte 1: mientras
# js/datos/ y la pantalla nueva no existan, dicen «pendiente» y no fallan.
#
# Necesita: Docker corriendo, Node 22 o más nuevo (npx), y psql.
# La CLI de Supabase va FIJA (version-cli.txt) y se baja con npx.
#
# Solo cuentas y datos ficticios. Se niega a correr si la base o la API no
# están en esta computadora (127.0.0.1 / localhost) o si alguien hizo
# `supabase link` en esta carpeta. Cada corrida empieza con `db reset`: la
# base local queda vacía y se arma de nuevo; nada de lo de antes se conserva.
# ============================================================================
set -euo pipefail

AQUI="$(cd "$(dirname "$0")" && pwd)"
RAIZ="$(cd "$AQUI/../.." && pwd)"
DISENO="$RAIZ/docs/rediseno-datos"
PRUEBAS="$DISENO/pruebas-capa-a"
VERSION="$(tr -d ' \r\n' < "$AQUI/version-cli.txt")"
SOLO_SQL=0; CAPA_B=0; CAPA_C=0
for a in "$@"; do
  case "$a" in
    --solo-sql) SOLO_SQL=1 ;;
    --capa-b)   CAPA_B=1 ;;
    --capa-c)   CAPA_C=1 ;;
    --todo)     CAPA_B=1; CAPA_C=1 ;;
    *) echo "opción desconocida: $a" >&2; exit 1 ;;
  esac
done

falla() { echo "✘ $*" >&2; exit 1; }
sb() { (cd "$AQUI" && npx --yes "supabase@$VERSION" "$@"); }

# ── 0. Candados: nunca contra un proyecto remoto ───────────────────────────
[ -e "$AQUI/supabase/.temp/project-ref" ] \
  && falla "esta carpeta está vinculada a un proyecto remoto (supabase link). Borra supabase/.temp/ y vuelve a correr."
command -v docker >/dev/null || falla "falta Docker"
docker info >/dev/null 2>&1   || falla "Docker no está corriendo"
command -v psql   >/dev/null || falla "falta psql"
command -v node   >/dev/null || falla "falta Node"

echo "▶ Supabase local (CLI $VERSION)"
sb status >/dev/null 2>&1 || sb start
sb db reset >/dev/null

# Las variables de `supabase status -o env`, con prefijo para no pisar nada.
eval "$(sb status -o env | grep -E '^[A-Z_]+=' | sed 's/^/SB_/')"
DB="${SB_DB_URL:-}"
API="${SB_API_URL:-}"
SERVICIO="${SB_SERVICE_ROLE_KEY:-${SB_SECRET_KEY:-}}"
PUBLICA="${SB_ANON_KEY:-${SB_PUBLISHABLE_KEY:-}}"
[[ "$DB"  =~ @(127\.0\.0\.1|localhost):[0-9]+/ ]]      || falla "la base no es local: $DB"
[[ "$API" =~ ^http://(127\.0\.0\.1|localhost):[0-9]+$ ]] || falla "la API no es local: $API"
[ -n "$SERVICIO" ] && [ -n "$PUBLICA" ]                  || falla "no salieron las llaves locales de 'supabase status'"

q() { psql "$DB" -X -q -v ON_ERROR_STOP=1 "$@"; }

# Cuenta FICTICIA de Auth con un id fijo (los que usan las pruebas), creada
# por la API de administración y no escribiendo en auth.users.
crear_usuario() {
  local id="$1" correo="$2" r
  r="$(curl -sS -X POST "$API/auth/v1/admin/users" \
        -H "apikey: $SERVICIO" -H "Authorization: Bearer $SERVICIO" -H 'content-type: application/json' \
        -d "{\"id\":\"$id\",\"email\":\"$correo\",\"password\":\"$(openssl rand -hex 24)\",\"email_confirm\":true}")"
  echo "$r" | grep -q "\"id\":\"$id\"" || falla "Auth no creó $correo con el id $id: $r"
}

# ── 1. Modelo viejo, datos ficticios y cuentas de Auth ─────────────────────
echo "▶ Modelo viejo y datos ficticios"
q -c "create extension if not exists dblink with schema extensions"
q -f "$PRUEBAS/00-modelo-viejo.sql"
q -f "$PRUEBAS/01-datos-viejos.sql"
echo "▶ Cuentas ficticias por la API de Auth"
crear_usuario 00000000-0000-0000-0000-00000000000a prof-aaaa000001@cuentas.metas.policastsapien.com
crear_usuario 00000000-0000-0000-0000-00000000000b prof-bbbb000002@cuentas.metas.policastsapien.com
crear_usuario 00000000-0000-0000-0000-0000000000c0 panel@ejemplo.invalid

# ── 2. Los cuatro archivos, en el orden real; CONGELAR dos veces ───────────
echo "▶ SUPABASE-V2-VINCULACION.sql"
q -f "$DISENO/SUPABASE-V2-VINCULACION.sql"
q -f "$PRUEBAS/02-vincular-antes-del-paso1.sql"
echo "▶ SUPABASE-V2-ESQUEMA.sql"
q -f "$DISENO/SUPABASE-V2-ESQUEMA.sql"
echo "▶ SUPABASE-V2-FAMILIAS.sql"
q -f "$DISENO/SUPABASE-V2-FAMILIAS.sql"
echo "▶ SUPABASE-V2-CONGELAR.sql (dos veces)"
q -f "$DISENO/SUPABASE-V2-CONGELAR.sql" >/dev/null
q -f "$DISENO/SUPABASE-V2-CONGELAR.sql" >/dev/null || falla "CONGELAR falló la segunda vez"

# ── 3. Capa A ──────────────────────────────────────────────────────────────
echo "▶ Capa A"
q -v "conninfo=$DB" -f "$PRUEBAS/10-pruebas.sql"

[ "$SOLO_SQL" = 1 ] && exit 0

# ── 4. Capa A+: las funciones de borde y la API, de verdad ─────────────────
echo "▶ Funciones de borde (supabase functions serve)"
REG="$(mktemp)"
(cd "$AQUI" && npx --yes "supabase@$VERSION" functions serve --env-file supabase/functions/.env.local >"$REG" 2>&1) &
SERVE=$!
terminar() { kill "$SERVE" 2>/dev/null || true; pkill -f "supabase@$VERSION functions serve" 2>/dev/null || true; rm -f "$REG"; }
trap terminar EXIT
for _ in $(seq 1 60); do
  c="$(curl -s -o /dev/null -w '%{http_code}' -X OPTIONS "$API/functions/v1/metas-entrar" || true)"
  [ "$c" = 200 ] && break
  sleep 2
done
[ "${c:-}" = 200 ] || { cat "$REG"; falla "las funciones de borde no arrancaron"; }

echo "▶ supabase-js fijo, sin guardarlo en el repositorio"
npm install --no-save --silent --prefix "$AQUI" @supabase/supabase-js@2.45.4 >/dev/null

echo "▶ Capa A+"
export METAS_API="$API" METAS_PUBLICA="$PUBLICA" METAS_SERVICIO="$SERVICIO" METAS_DB="$DB"
node "$AQUI/capa-a-mas.mjs"

# Código 2 = «escrita antes del código, todavía no puede correr»: se avisa y
# se sigue; cualquier otro distinto de 0 es una falla de verdad.
corre_capa() {
  local nombre="$1"; shift
  set +e; "$@"; local r=$?; set -e
  if [ "$r" = 2 ]; then echo "… $nombre: pendiente del corte 1"; elif [ "$r" != 0 ]; then falla "$nombre falló"; fi
}
if [ "$CAPA_B" = 1 ]; then
  echo "▶ Capa B"
  npm install --no-save --silent --prefix "$AQUI" fake-indexeddb@6.0.0 @supabase/supabase-js@2.45.4 >/dev/null
  corre_capa "capa B" node "$DISENO/pruebas-capa-b/escenarios.mjs"
fi
if [ "$CAPA_C" = 1 ]; then
  echo "▶ Capa C"
  npm install --no-save --silent --prefix "$AQUI" playwright >/dev/null
  (cd "$RAIZ" && node _dev/servidor-estatico.js >/dev/null 2>&1) &
  SITIO_PID=$!
  trap 'terminar; kill "$SITIO_PID" 2>/dev/null || true' EXIT
  sleep 1
  corre_capa "capa C" node "$DISENO/pruebas-capa-c/capa-c.mjs"
fi
