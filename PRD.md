# PRD - Rentflow (Gestión de Alquileres)

## 1. Visión General
**Rentflow** es una plataforma integral diseñada para administradores de propiedades en Paraguay. El objetivo es centralizar la gestión de edificios, departamentos, inquilinos y contratos, automatizando la generación de documentos legales (PDF) y el seguimiento de rentabilidad neta.

---

## 2. Objetivos del Producto
*   **Centralización**: Eliminar el uso de planillas sueltas para el control de cobros.
*   **Automatización**: Generar contratos y recibos de dinero en segundos.
*   **Rentabilidad**: Calcular la utilidad neta (Ingresos - Gastos) de forma automática.
*   **Profesionalismo**: Documentación legal impecable y auditable.

---

## 4. Requerimientos Funcionales (Estado Actual)

### 4.1. Autenticación y Seguridad
*   **Login**: Acceso seguro mediante email y contraseña (Supabase Auth). ✅
*   **Persistencia**: Manejo de sesión mediante React Context API. ✅

### 4.2. Gestión de Propiedades
*   **Edificios (Torres)**: Registro de nombre, dirección y datos del titular (nombre/CI). ✅
*   **Unidades (Departamentos)**: Inventario detallado con número de unidad, piso, precio, **habitaciones, baños, balcón y metros cuadrados (m²)**. ✅

### 4.3. Gestión de Inquilinos
*   **Registro**: Datos personales, contacto y validación de Cédula de Identidad (CI). ✅

### 4.4. Contratos de Alquiler
*   **Creación**: Vínculo entre inquilino y unidad con parámetros de fechas y montos. ✅
*   **Documentación**: Generación de PDF del contrato y subida del documento firmado a la nube. ✅
*   **Pagarés**: Generación automática de pagarés en un **único archivo PDF unificado**. ✅

### 4.5. Control Financiero (Ingresos y Egresos)
*   **Pagos**: Registro de mensualidades cobradas con **numeración secuencial oficial** (001-1000001). ✅
*   **Gastos**: Registro categorizado de egresos (Mantenimiento, Impuestos, Reparaciones) por edificio o unidad. ✅
*   **Dashboard Pro**: Panel inteligente con Recaudación Bruta, Gastos Mensuales, **Utilidad Neta** y % de Ocupación. ✅

---

## 6. Arquitectura de Datos (Entidades)
*   **Tenants**: `id, full_name, email, phone, ci, address`.
*   **Buildings**: `id, name, address, owner_name, owner_ci, status`.
*   **Units**: `id, building_id, unit_number, floor, price, status, bedrooms, bathrooms, has_balcony, sq_meters`.
*   **Contracts**: `id, tenant_id, unit_id, start_date, end_date, monthly_amount, deposit_amount, status, contract_url`.
*   **Payments**: `id, contract_id, amount, receipt_number (secuencial), payment_date, month_covered`.
*   **Expenses**: `id, building_id, unit_id (opt), amount, category, description, expense_date`.
*   **Promissory_notes**: `id, contract_id, quota_number, due_date, status`.

---

## 7. Roadmap Próximas Etapas
1.  **Dashboard Analytics Pro**: Gráficos de tendencia histórica (Recharts).
2.  **Notificaciones**: Alertas vía WhatsApp para vencimientos de contratos.
3.  **Multi-Tenancy**: Aislamiento de datos para múltiples administradores independientes.
