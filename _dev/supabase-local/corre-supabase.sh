#!/usr/bin/env bash
# ============================================================================
# Capa A y capa A+ contra un Supabase LOCAL de verdad (`supabase start`)
# ----------------------------------------------------------------------------
#   bash _dev/supabase-local/corre-supabase.sh             # capa A + capa A+
#   bash _dev/supabase-local/corre-supabase.sh --solo-sql  # solo la capa A
#   bash _dev/supabase-local/corre-supabase.sh --capa-b    # + capa B (cola y conflictos)
#   bash _dev/supabase-local/corre-supabase.sh --capa-c    # + capa C (navegador)
#   bash _dev/supabase-local/corre-supabase.sh --todo      # A, A+, B y C
# Las capas B y C se escribieron ANTES del código del corte 1. La B corre
# desde la revisión 8 (js/datos/ existe); la C dice «pendiente» y no falla
# mientras la pantalla nueva no exista.
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

# Después de «db reset» y de cargar los .sql, la API tarda en volver a leer
# el esquema: responde 503, o «no existe esa función», un rato. Si se seguía
# de una vez, la capa A+ fallaba a veces con 503 (rev. 9). Se espera a que
# responda 200 la raíz, Auth y, cuando ya está cargado, una función de metas
# de solo lectura (cuenta_de), después de pedirle que relea el esquema.
esperar_api() {
  local c="" a="" f="-"
  [ "${1:-}" = metas ] && psql "$DB" -X -q -c "notify pgrst, 'reload schema'" >/dev/null 2>&1 || true
  for _ in $(seq 1 90); do
    c="$(curl -s -o /dev/null -w '%{http_code}' -H "apikey: $PUBLICA" -H "Authorization: Bearer $PUBLICA" "$API/rest/v1/" || true)"
    a="$(curl -s -o /dev/null -w '%{http_code}' -H "apikey: $PUBLICA" "$API/auth/v1/health" || true)"
    if [ "${1:-}" = metas ]; then
      f="$(curl -s -o /dev/null -w '%{http_code}' -X POST -H "apikey: $SERVICIO" -H "Authorization: Bearer $SERVICIO" \
             -H 'content-type: application/json' -H 'content-profile: metas' -d '{"p_codigo":"-"}' "$API/rest/v1/rpc/cuenta_de" || true)"
      [ "$c" = 200 ] && [ "$a" = 200 ] && [ "$f" = 200 ] && return 0
    else
      [ "$c" = 200 ] && [ "$a" = 200 ] && return 0
    fi
    sleep 1
  done
  falla "la API local no respondió 200 (rest: $c, auth: $a, metas: $f)"
}
esperar_api

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
# pg_cron: el paso 4 programa con él el cierre de canales (FAMILIAS 5).
q -c "create extension if not exists pg_cron with schema pg_catalog"
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
# La carrera B4 abre dos sesiones con dblink DESDE la base: corre dentro de su
# contenedor, donde 127.0.0.1:54322 no es nadie. Desde ahí, la base es
# supabase_db_<project_id>:5432 (la red de Docker de la CLI).
PROYECTO="$(sed -n 's/^project_id *= *"\(.*\)"/\1/p' "$AQUI/supabase/config.toml")"
q -v "conninfo=host=supabase_db_$PROYECTO port=5432 user=postgres password=postgres dbname=postgres" \
  -f "$PRUEBAS/10-pruebas.sql"

[ "$SOLO_SQL" = 1 ] && exit 0
# La capa A cambia el esquema (funciones, vistas): la API lo vuelve a leer.
esperar_api metas

# ── 4. Capa A+: las funciones de borde y la API, de verdad ─────────────────
echo "▶ Funciones de borde (supabase functions serve)"
# Un solo contenedor de funciones: si quedó uno (de una corrida anterior o de
# un `supabase start` con edge_runtime encendido), se borra antes; si no, la
# espera de abajo podía recibir respuesta del viejo mientras moría.
docker rm -f "supabase_edge_runtime_$PROYECTO" >/dev/null 2>&1 || true
REG="$(mktemp)"
(cd "$AQUI" && npx --yes "supabase@$VERSION" functions serve --env-file supabase/functions/.env.local >"$REG" 2>&1) &
SERVE=$!
terminar() { kill "$SERVE" 2>/dev/null || true; pkill -f "supabase@$VERSION functions serve" 2>/dev/null || true; rm -f "$REG"; }
trap terminar EXIT
# Listo de verdad cuando el NUEVO dice que sirve, y además responde.
c=""
for _ in $(seq 1 90); do
  if grep -q "Serving functions on" "$REG"; then
    c="$(curl -s -o /dev/null -w '%{http_code}' -X OPTIONS "$API/functions/v1/metas-entrar" || true)"
    [ "$c" = 200 ] && break
  fi
  kill -0 "$SERVE" 2>/dev/null || { cat "$REG"; falla "functions serve se cerró al arrancar"; }
  sleep 2
done
[ "$c" = 200 ] || { cat "$REG"; falla "las funciones de borde no arrancaron"; }

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
  # Si ya hay un Playwright (con su navegador), se usa ese: otra versión
  # bajada aquí no encuentra el navegador que ya está instalado (rev. 9).
  (cd "$AQUI" && node -e "require.resolve('playwright')" >/dev/null 2>&1) \
    || npm install --no-save --silent --prefix "$AQUI" playwright >/dev/null
  (cd "$RAIZ" && node _dev/servidor-estatico.js >/dev/null 2>&1) &
  SITIO_PID=$!
  trap 'terminar; kill "$SITIO_PID" 2>/dev/null || true' EXIT
  sleep 1
  corre_capa "capa C" node "$DISENO/pruebas-capa-c/capa-c.mjs"
fi
