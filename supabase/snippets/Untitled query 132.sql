-- 1. Asegurar que estamos en el esquema público
SET search_path TO public;

-- 2. Forzar activación de RLS en todas las tablas
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Borrar políticas viejas por si quedaron mal
DROP POLICY IF EXISTS "Permitir todo local" ON public.buildings;
DROP POLICY IF EXISTS "Permitir todo local" ON public.tenants;
DROP POLICY IF EXISTS "Permitir todo local" ON public.units;
DROP POLICY IF EXISTS "Permitir todo local" ON public.contracts;
DROP POLICY IF EXISTS "Permitir todo local" ON public.payments;
DROP POLICY IF EXISTS "Permitir todo local" ON public.expenses;
DROP POLICY IF EXISTS "Permitir todo local" ON public.profiles;

-- 4. Crear políticas de "Acceso Total" para desarrollo local
-- Esto permite que cualquier usuario logueado haga de todo (Solo para LOCAL)
CREATE POLICY "Permitir todo local" ON public.buildings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo local" ON public.tenants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo local" ON public.units FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo local" ON public.contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo local" ON public.payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo local" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo local" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- 5. TRIGGER MÁGICO: Esto crea el perfil automáticamente al registrarte
-- Evita el error de "No profile found"
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, status)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'trialing');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
