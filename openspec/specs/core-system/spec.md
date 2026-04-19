# Especificación de Rentflow 2026

## Objetivo
Sistema integral de gestión de alquileres para el mercado paraguayo, enfocado en edificios y departamentos.

## Entidades Principales
- **Inquilinos**: Registro con Cédula de Identidad (CI) paraguaya.
- **Edificios (Torres)**: Agrupadores físicos de unidades.
- **Departamentos (Unidades)**: Unidades funcionales con precio y estado.
- **Contratos**: Vínculo legal entre inquilino y unidad con montos, fechas y respaldo físico (PDF).
- **Pagos**: Registro de mensualidades cobradas con generación de recibos.
- **Autenticación**: Acceso restringido mediante Supabase Auth (Email/Password) para administradores.

## Reglas de Negocio Implementadas
- **TDD**: Cobertura de tests para componentes críticos.
- **Jerarquía**: Los departamentos pertenecen a un edificio.
- **Disponibilidad**: Solo departamentos "disponibles" pueden ser asignados a nuevos contratos.
- **Estado de Cuenta**: Cálculo dinámico de meses pendientes basado en la fecha de inicio del contrato y pagos realizados.
- **PDF**: Generación en tiempo real de contratos (borrador) y recibos de dinero (formato apaisado).

## Integraciones
- **Supabase Auth/DB/Storage**: Persistencia de datos y archivos.
- **Tailwind v4**: Estética moderna con glassmorphism.
- **jsPDF**: Motor de generación de documentos.
