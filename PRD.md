# PRD - Rentflow (Gestión de Alquileres)

## 1. Visión General
**Rentflow** es una plataforma integral diseñada para administradores de propiedades en Paraguay. El objetivo es centralizar la gestión de edificios, departamentos, inquilinos y contratos, automatizando la generación de documentos legales (PDF) y el seguimiento de pagos.

---

## 2. Objetivos del Producto
*   **Centralización**: Eliminar el uso de planillas sueltas para el control de cobros.
*   **Automatización**: Generar contratos y recibos de dinero en segundos.
*   **Transparencia**: Tener un estado de cuenta claro por cada inquilino y unidad.
*   **Accesibilidad**: Plataforma web responsiva accesible desde cualquier dispositivo.

---

## 3. Público Objetivo
*   Administradores de edificios y complejos de departamentos.
*   Propietarios independientes con múltiples unidades en alquiler.

---

## 4. Requerimientos Funcionales (Estado Actual)

### 4.1. Autenticación y Seguridad
*   **Login**: Acceso seguro mediante email y contraseña (Supabase Auth). ✅
*   **Persistencia**: Manejo de sesión mediante React Context API. ✅

### 4.2. Gestión de Propiedades
*   **Edificios (Torres)**: Registro de nombre, dirección y datos del titular (nombre/CI). ✅
*   **Unidades (Departamentos)**: Registro vinculado a un edificio, con número de unidad, piso, precio de alquiler y estado (Disponible, Alquilado, Mantenimiento). ✅

### 4.3. Gestión de Inquilinos
*   **Registro**: Datos personales, contacto y validación de Cédula de Identidad (CI). ✅

### 4.4. Contratos de Alquiler
*   **Creación**: Vínculo entre inquilino y unidad con parámetros de fechas y montos. ✅
*   **Documentación**: Generación de PDF del contrato (borrador) y posibilidad de subir el contrato firmado a Supabase Storage (desde la creación o desde detalles). ✅
*   **Pagarés**: Generación automática de pagarés en un **único archivo PDF unificado** para facilitar la impresión masiva. ✅

### 4.5. Control de Pagos
*   **Registro**: Carga de mensualidades cobradas con cálculo dinámico de meses pendientes. ✅
*   **Recibos**: Generación automática de comprobante de pago en PDF con **numeración secuencial oficial** (ej: 001-1000001). ✅
*   **Dashboard**: Vista rápida de ocupación, recaudación total y alertas de vencimientos. ✅

---

## 5. Requerimientos No Funcionales
*   **Stack Tecnológico**: React 19, Vite 8, Tailwind CSS v4, Supabase, TypeScript 6. ✅
*   **Testing**: Cobertura de tests unitarios y de integración con Vitest. ✅
*   **Localización**: Formato de moneda Guaraníes (Gs.), zona horaria de Paraguay y español con codificación UTF-8 correcta. ✅

---

## 6. Arquitectura de Datos (Entidades)
*   **Tenants**: `id, full_name, email, phone, ci, address`.
*   **Buildings**: `id, name, address, owner_name, owner_ci, status`.
*   **Units**: `id, building_id, unit_number, floor, price, status`.
*   **Contracts**: `id, tenant_id, unit_id, start_date, end_date, monthly_amount, deposit_amount, status, contract_url`.
*   **Payments**: `id, contract_id, amount, receipt_number (secuencial), payment_date, month_covered`.
*   **Promissory_notes**: `id, contract_id, quota_number, due_date, status`.

---

## 7. Roadmap Próximas Etapas
1.  **Dashboard Analytics Pro**: Gráficos de ingresos mensuales (tendencia) y comparativa de ocupación por edificio usando `recharts`.
2.  **Módulo de Gastos**: Registro de egresos por edificio (mantenimiento, servicios) para cálculo de rentabilidad neta.
3.  **Notificaciones**: Alertas vía WhatsApp para vencimientos de contratos y cobros pendientes.
