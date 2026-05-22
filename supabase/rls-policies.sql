-- =============================================================================
-- rls-policies.sql — Row Level Security para FotoGestión
-- =============================================================================
-- Propósito: Proteger los datos de la app de acceso no autenticado.
--
-- Modelo de seguridad:
--   - Usuarios autenticados (login) → acceso total a todas las tablas de la app.
--   - Usuarios anónimos (sin sesión) → sin acceso (la app no tiene páginas públicas).
--   - Tabla perfiles → cada usuario solo puede leer y editar su propio perfil.
--
-- Cómo funciona en Supabase:
--   - El frontend siempre usa el `anon key` (expuesto en .env.local).
--   - Cuando el usuario está logueado, Supabase inyecta su JWT en cada request.
--   - RLS evalúa auth.role(): 'authenticated' si hay JWT válido, 'anon' si no.
--   - Por eso NO se necesita cambiar código JS: el JWT se maneja automáticamente.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- =============================================================================

SET search_path TO fotogestion;


-- =============================================================================
-- PASO 1 — Habilitar RLS en todas las tablas de la app
-- =============================================================================

ALTER TABLE paquetes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE instituciones  ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyectos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumnos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos          ENABLE ROW LEVEL SECURITY;

-- perfiles: habilitar RLS
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- PASO 2 — Políticas para la tabla perfiles
-- =============================================================================
-- Cada usuario puede leer y actualizar SOLO su propio perfil (filtro por id = auth.uid()).
-- Esto evita que un usuario "admin" pueda cambiar el rol de otro usuario desde el cliente.
-- Administrar roles debe hacerse desde el SQL Editor del dashboard de Supabase.

-- Eliminar políticas anteriores si existen (para re-ejecutar el script con seguridad)
DROP POLICY IF EXISTS "perfiles_select_own" ON perfiles;
DROP POLICY IF EXISTS "perfiles_update_own" ON perfiles;

CREATE POLICY "perfiles_select_own" ON perfiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "perfiles_update_own" ON perfiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- =============================================================================
-- PASO 3 — Políticas para las tablas de la aplicación
-- =============================================================================
-- Política única "FOR ALL": cubre SELECT, INSERT, UPDATE y DELETE.
-- USING(true)      → condición de fila al leer/actualizar/borrar (siempre verdadero).
-- WITH CHECK(true) → condición al escribir (siempre verdadero).
-- TO authenticated → solo se aplica a usuarios con sesión activa.

DROP POLICY IF EXISTS "foto_auth_all" ON paquetes;
DROP POLICY IF EXISTS "foto_auth_all" ON instituciones;
DROP POLICY IF EXISTS "foto_auth_all" ON proyectos;
DROP POLICY IF EXISTS "foto_auth_all" ON grupos;
DROP POLICY IF EXISTS "foto_auth_all" ON alumnos;
DROP POLICY IF EXISTS "foto_auth_all" ON pagos;

CREATE POLICY "foto_auth_all" ON paquetes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "foto_auth_all" ON instituciones
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "foto_auth_all" ON proyectos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "foto_auth_all" ON grupos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "foto_auth_all" ON alumnos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "foto_auth_all" ON pagos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- =============================================================================
-- PASO 3b — Limpiar políticas sobrantes de RifaGestion en tabla grupos
-- =============================================================================
-- La tabla grupos es compartida con RifaGestion en la misma BD.
-- "rifas_anon_read" permite lectura sin autenticación → debe eliminarse.
-- "rifas_auth_all"  es redundante con "foto_auth_all" → también se elimina.

DROP POLICY IF EXISTS "rifas_anon_read" ON grupos;
DROP POLICY IF EXISTS "rifas_auth_all"  ON grupos;


-- =============================================================================
-- PASO 4 — Vista vista_saldo_alumnos
-- =============================================================================
-- Las vistas en Supabase funcionan con SECURITY INVOKER por defecto:
-- ejecutan la consulta con los permisos del usuario que llama.
-- Esto significa que la RLS de las tablas subyacentes (alumnos, pagos, paquetes)
-- se aplica automáticamente al consultar la vista.
-- No se necesita ninguna política adicional sobre la vista.

-- Verificación opcional: la vista debería ser SECURITY INVOKER (es el default).
-- SELECT relname, relrowsecurity, reloptions
--   FROM pg_class WHERE relname = 'vista_saldo_alumnos';


-- =============================================================================
-- PASO 5 — Verificación: confirmar que RLS está activo en todas las tablas
-- =============================================================================
SELECT
  tablename,
  rowsecurity AS rls_activo
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('paquetes','instituciones','proyectos','grupos','alumnos','pagos','perfiles')
ORDER BY tablename;


-- =============================================================================
-- PASO 6 — Verificación: listar políticas creadas
-- =============================================================================
SELECT
  tablename,
  policyname,
  roles,
  cmd,
  qual AS condicion_using
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('paquetes','instituciones','proyectos','grupos','alumnos','pagos','perfiles')
ORDER BY tablename, policyname;
