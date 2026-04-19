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

## 4. Requerimientos Funcionales (MVP)

### 4.1. Autenticación y Seguridad
*   **Login**: Acceso seguro mediante email y contraseña (Supabase Auth).
*   **Persistencia**: Manejo de sesión mediante React Context API.

### 4.2. Gestión de Propiedades
*   **Edificios (Torres)**: Registro de nombre y dirección.
*   **Unidades (Departamentos)**: Registro vinculado a un edificio, con número de unidad, piso, precio de alquiler y estado (Disponible, Alquilado, Mantenimiento).

### 4.3. Gestión de Inquilinos
*   **Registro**: Datos personales, contacto y validación de Cédula de Identidad (CI).

### 4.4. Contratos de Alquiler
*   **Creación**: Vínculo entre inquilino y unidad.
*   **Parámetros**: Fecha de inicio/fin, monto mensual y depósito de garantía.
*   **Documentación**: Generación de PDF del contrato (borrador) y posibilidad de subir el contrato firmado a Supabase Storage.
*   **Pagarés**: Generación automática de pagarés por cada cuota, con persistencia y acceso para impresión desde el detalle del contrato.

### 4.5. Control de Pagos
*   **Registro**: Carga de mensualidades cobradas.
*   **Recibos**: Generación automática de comprobante de pago en PDF (formato apaisado).
*   **Dashboard**: Vista rápida de ocupación y alertas de pagos pendientes.

---

## 5. Requerimientos No Funcionales
*   **Stack Tecnológico**: React 19, Vite, Tailwind CSS v4, Supabase.
*   **Testing**: Cobertura de tests unitarios y de integración con Vitest y React Testing Library.
*   **Hosting**: Deploy automático en Vercel (CI/CD).
*   **Localización**: Formato de moneda Guaraníes (Gs.) y zona horaria de Paraguay.

---

## 6. Arquitectura de Datos (Entidades)
*   **Tenants**: `id, full_name, email, phone, ci, address`.
*   **Buildings**: `id, name, address, description, status`.
*   **Units**: `id, building_id, unit_number, floor, price, status`.
*   **Contracts**: `id, tenant_id, unit_id, start_date, end_date, monthly_amount, deposit_amount, status, contract_url`.
*   **Payments**: `id, contract_id, amount, payment_date, month_covered, payment_method, notes`.
*   **Promissory_notes**: `id, contract_id, quota_number, due_date, status`.

---

## 7. Roadmap Próximas Etapas
1.  **Dashboard Analytics**: Gráficos de ingresos mensuales.
2.  **Notificaciones**: Alertas vía WhatsApp/Email para vencimientos de contratos.
3.  **Gastos**: Módulo para registrar gastos de mantenimiento por edificio.
