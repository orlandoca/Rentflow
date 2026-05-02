INSERT INTO public.profiles (id, full_name, status)
VALUES ('a7e77dd3-6809-49aa-8a4c-be33282dd834', 'Admin Local', 'trialing')
ON CONFLICT (id) DO NOTHING;
