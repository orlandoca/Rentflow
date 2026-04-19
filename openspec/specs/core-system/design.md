# Diseño Técnico de Rentflow

## Arquitectura
- **Frontend**: React 19 + Vite.
- **Estilos**: Tailwind CSS v4.
- **Backend-as-a-Service**: Supabase.
- **Autenticación**: Supabase Auth con Context API para persistencia de sesión.
- **PDF Engine**: jsPDF.

## Esquema de Base de Datos (PostgreSQL)
- `tenants`: Perfil del inquilino (CI única).
- `buildings`: Agrupador de torres (sin precio base).
- `units`: Unidades funcionales con `building_id` y `status`.
- `contracts`: `tenant_id`, `unit_id`, `monthly_amount`, `contract_url` (link a storage).
- `payments`: `contract_id`, `month_covered` (date), `amount`.

## Decisiones Clave
- **Hybrid PDF**: Se generan borradores automáticos pero se permite subir el firmado oficial a Storage.
- **Meses Pendientes**: Se calculan en el cliente comparando el `start_date` del contrato vs registros en `payments`.
- **Precios**: Todo en Guaraníes (Gs.) usando `Intl.NumberFormat('es-PY')`.
