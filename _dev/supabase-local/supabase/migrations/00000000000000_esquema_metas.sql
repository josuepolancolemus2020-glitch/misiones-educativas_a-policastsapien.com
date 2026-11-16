-- Solo para `supabase start` en local: config.toml expone el esquema metas a
-- la API, y la API no arranca si ese esquema no existe. Se crea vacío; lo
-- llenan los .sql del diseño (corre-supabase.sh). Nada más va en migraciones.
create schema if not exists metas;
