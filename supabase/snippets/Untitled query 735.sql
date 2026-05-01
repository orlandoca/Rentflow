-- 1. Insertar Edificios de ejemplo
INSERT INTO public.buildings (name, address, owner_name, owner_ci)
VALUES 
('Torre Aviadores', 'Aviadores del Chaco 123', 'Juan Pérez', '1.234.567'),
('Edificio Plaza', 'Mcal. López e/ Kubitschek', 'María González', '2.345.678');

-- 2. Insertar Unidades para Torre Aviadores
INSERT INTO public.units (building_id, unit_number, floor, price, bedrooms, bathrooms, has_balcony, sq_meters)
SELECT id, '101', '1', 3500000, 2, 1, true, 65 FROM public.buildings WHERE name = 'Torre Aviadores';

INSERT INTO public.units (building_id, unit_number, floor, price, bedrooms, bathrooms, has_balcony, sq_meters)
SELECT id, '202', '2', 4500000, 3, 2, true, 85 FROM public.buildings WHERE name = 'Torre Aviadores';

-- 3. Insertar un Inquilino de prueba
INSERT INTO public.tenants (full_name, email, phone, ci, address)
VALUES ('Carlos Alquiler', 'carlos@example.com', '0981-123456', '3.456.789', 'San Lorenzo');
