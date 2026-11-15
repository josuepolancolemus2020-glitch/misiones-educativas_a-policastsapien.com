-- ============================================================================
-- Capa A · A se vincula ANTES del paso 1 (como lo haría metas-entrar).
-- B se vinculará DESPUÉS del paso 1, dentro de las pruebas.
-- ============================================================================
set role service_role;
select metas.cuenta_registrar('00000000-0000-0000-0000-00000000000a', 'PROF-AAAA000001',
                              'prof-aaaa000001@cuentas.metas.policastsapien.com');
reset role;
-- Antes del paso 1 no se toma ninguna copia de claves al vincularse.
do $$ begin
  if exists (select 1 from metas.claves_archivo) then
    raise exception 'no debía haber copia de claves antes del paso 1';
  end if;
end $$;
