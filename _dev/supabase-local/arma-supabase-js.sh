#!/usr/bin/env bash
# ============================================================================
# Arma js/vendor/supabase.min.js: la parte de REALTIME de supabase-js FIJO
# (realtime-js 2.10.2, la que trae supabase-js 2.45.4), alojada en el sitio
# (sin CDN, 03, 3.10), como script clásico con un solo global, «supabase».
# ----------------------------------------------------------------------------
#   bash _dev/supabase-local/arma-supabase-js.sh
#
# Por qué solo Realtime: lo demás de supabase-js no lo usa js/datos/ (se
# entra por metas-entrar, y la API se llama con fetch en nube.js), y su
# módulo de Auth, solo con CARGARSE, escribe una llave al azar en
# localStorage hecha con Math.random (prohibido en js/datos, regla 16; la
# capa B lo convierte en error). Lo que no se carga no puede hacer eso.
#
# Por qué no se copia el archivo dist/umd que trae el paquete: ese lo arma
# webpack con «publicPath automático», que al cargar busca las etiquetas
# <script> del documento para saber de dónde bajar sus pedazos. Fuera de un
# navegador completo (la capa B carga js/datos/ en un contexto aislado) eso
# revienta, y además no hace falta: el único pedazo aparte es el reemplazo de
# WebSocket para Node, que en un navegador no se usa. esbuild lo arma en un
# solo archivo, sin pedazos.
#
# Las versiones van FIJAS; el resultado es siempre el mismo archivo (la
# sonda verifica-datos-reglas comprueba su versión). Nada se guarda en el
# repositorio salvo el archivo final.
# ============================================================================
set -euo pipefail
SUPABASE_JS=2.45.4
REALTIME_JS=2.10.2   # la que trae supabase-js 2.45.4
ESBUILD=0.24.0
RAIZ="$(cd "$(dirname "$0")/../.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cd "$TMP"
npm init -y >/dev/null
npm install --silent --no-audit --no-fund "@supabase/supabase-js@$SUPABASE_JS" "esbuild@$ESBUILD" >/dev/null
grep -q "\"version\": \"$REALTIME_JS\"" node_modules/@supabase/realtime-js/package.json \
  || { echo "✘ supabase-js $SUPABASE_JS ya no trae realtime-js $REALTIME_JS" >&2; exit 1; }
echo "export { RealtimeClient, REALTIME_SUBSCRIBE_STATES } from '@supabase/realtime-js';" > entrada.js
./node_modules/.bin/esbuild entrada.js --bundle --format=iife --global-name=supabase --platform=browser \
  --target=es2018 --minify --legal-comments=none \
  "--banner:js=/* realtime-js $REALTIME_JS de supabase-js $SUPABASE_JS (MIT, ver supabase-LICENSE.txt), armado con esbuild $ESBUILD por _dev/supabase-local/arma-supabase-js.sh */" \
  --outfile="$RAIZ/js/vendor/supabase.min.js"
cp node_modules/@supabase/realtime-js/LICENSE.md "$RAIZ/js/vendor/supabase-LICENSE.txt" 2>/dev/null \
  || cp node_modules/@supabase/supabase-js/LICENSE "$RAIZ/js/vendor/supabase-LICENSE.txt"
sha256sum "$RAIZ/js/vendor/supabase.min.js"
