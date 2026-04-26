# Tasks: Building Expenses Management

## Phase 1: Infrastructure & Foundation
- [ ] 1.1 SQL: Crear tabla `expenses` en Supabase con campos `building_id`, `unit_id`, `amount`, `category`, `description`, `expense_date`.
- [ ] 1.2 SQL: Habilitar RLS en la tabla `expenses` y agregar índices para `building_id` y `expense_date`.
- [ ] 1.3 Types: Agregar interfaces `Expense` y `ExpenseCategory` en `src/types/index.ts`.

## Phase 2: Core Components
- [ ] 2.1 Feature: Crear `src/features/expenses/ExpenseForm.tsx` con validaciones de monto y selección de edificio/unidad.
- [ ] 2.2 Feature: Crear `src/features/expenses/ExpenseList.tsx` con filtros por edificio y categoría.
- [ ] 2.3 Wiring: Agregar la pestaña "Gastos" en la navegación principal de `src/App.tsx`.

## Phase 3: Integration & Dashboard
- [ ] 3.1 Dashboard: Actualizar `src/features/dashboard/Dashboard.tsx` para obtener el total de gastos del mes actual.
- [ ] 3.2 Dashboard: Implementar cálculo de "Utilidad Neta" (Ingresos - Gastos) y mostrar nueva tarjeta.
- [ ] 3.3 Building View: (Opcional) Mostrar historial de gastos filtrado en la vista de detalles de edificio.

## Phase 4: Testing & Validation
- [ ] 4.1 Unit: Testear `ExpenseForm` para asegurar que el monto no sea negativo.
- [ ] 4.2 Integration: Verificar que al guardar un gasto aparezca inmediatamente en la lista global.
- [ ] 4.3 Validation: Confirmar que el Dashboard descuenta correctamente los gastos de la recaudación.
