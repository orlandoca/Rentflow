# Proposal: Building Expenses Management

## Intent
Actualmente Rentflow solo registra ingresos. Para ser un sistema profesional (SaaS), el administrador necesita registrar egresos para calcular la rentabilidad neta por edificio. Esto permite saber cuánto dinero queda realmente después de pagar mantenimientos, impuestos y reparaciones.

## Scope

### In Scope
- Creación de la tabla `expenses` en Supabase.
- Interfaz para **Listar Gastos** (global y filtrado por edificio).
- Formulario para **Registrar Gasto** con categorías (Impuestos, Mantenimiento, Reparación, Servicios, Otros).
- Posibilidad de asignar un gasto a un Edificio completo o a una Unidad específica.
- Integración básica en el Dashboard (restar gastos de la recaudación total).

### Out of Scope
- Gestión de facturas de proveedores (OCR/Escaneo).
- Pagos programados o recurrentes (ej: sueldos fijos).
- Exportación de balances contables complejos.

## Capabilities

### New Capabilities
- `building-expenses`: Registro y visualización de egresos vinculados a propiedades.

### Modified Capabilities
- `dashboard-analytics`: Se actualiza para incluir la métrica de Gastos y Utilidad Neta.

## Approach
Crearemos un nuevo feature `expenses` con su lista y formulario. Usaremos una tabla `expenses` en Postgres vinculada a `buildings` y `units`. La UI seguirá el estilo de Rentflow (diseño oscuro, bordes redondeados, tipografía bold).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/types/index.ts` | Modified | Agregar interfaz `Expense`. |
| `src/features/expenses` | New | Nueva carpeta para componentes de gastos. |
| `src/App.tsx` | Modified | Nueva pestaña de navegación "Gastos". |
| `Supabase DB` | New | Nueva tabla `expenses`. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Complejidad en el Dashboard | Low | Mantener cálculos simples en el cliente inicialmente. |
| Error en integridad de datos | Low | Usar claves foráneas (FK) robustas en la DB. |

## Rollback Plan
Eliminar la tabla `expenses` y revertir cambios en `App.tsx` y `Dashboard.tsx`. No afecta los datos de contratos ni pagos existentes.

## Dependencies
- Supabase (DDL para la nueva tabla).

## Success Criteria
- [ ] El administrador puede registrar un gasto de 500.000 Gs de "Plomería" para un edificio.
- [ ] El gasto aparece correctamente en la lista global.
- [ ] El total de recaudación del Dashboard refleja el descuento de los gastos.
