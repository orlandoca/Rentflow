# Design: Building Expenses Management

## Technical Approach
Implementaremos un módulo de gastos basado en una tabla centralizada en Supabase (`expenses`). La UI se dividirá en un componente de gestión global (pestaña "Gastos") y una integración en el Dashboard para el cálculo de Utilidad Neta. Seguiremos el patrón de componentes funcionales de React con Hooks para el manejo de estado local y Supabase para la persistencia.

## Architecture Decisions

| Componente | Decisión | Razón |
|------------|----------|-------|
| **Base de Datos** | Tabla `expenses` vinculada a `buildings` y `units` (opcional). | Permite trazabilidad tanto a nivel de propiedad general como de departamento específico. |
| **Categorías** | Enum fijo: `mantenimiento`, `impuestos`, `servicios`, `reparacion`, `otros`. | Facilita el agrupamiento y análisis en gráficos futuros. |
| **Navegación** | Nueva pestaña en el menú principal (`App.tsx`). | Los gastos son una entidad de primer nivel para administradores profesionales. |
| **Cálculo Dashboard** | Agregación en el cliente (JS). | Para el volumen actual de datos, es más rápido que crear una vista o RPC en Supabase. |

## Data Flow
```
[User Input (ExpenseForm)] ──→ [Supabase (Table: expenses)]
                                      │
                                      ▼
[ExpenseList (Global/Filtered)] ←── [Supabase SDK]
                                      │
                                      ▼
[Dashboard (Stats Logic)] ──────→ [Visualización Utilidad Neta]
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/types/index.ts` | Modify | Add `Expense` and `ExpenseCategory` interfaces. |
| `src/features/expenses/ExpenseList.tsx` | Create | List of all expenses with building filters. |
| `src/features/expenses/ExpenseForm.tsx` | Create | Form to record new building or unit expenses. |
| `src/App.tsx` | Modify | Add "Expenses" tab and route logic. |
| `src/features/dashboard/Dashboard.tsx` | Modify | Fetch expenses and update financial cards. |

## Interfaces / Contracts

```typescript
export type ExpenseCategory = 'mantenimiento' | 'impuestos' | 'servicios' | 'reparacion' | 'otros';

export interface Expense {
  id: string;
  building_id: string;
  unit_id: string | null;
  amount: number;
  category: ExpenseCategory;
  description: string | null;
  expense_date: string;
  created_at: string;
  // Joins
  building?: Building;
  unit?: Unit;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Form validation | Verificar que el monto sea > 0 y la categoría sea obligatoria. |
| Integration | List filtering | Comprobar que al filtrar por Edificio A solo se vean sus gastos. |
| Integration | Dashboard Math | Validar que `Total Recaudado - Total Gastos = Utilidad Neta`. |

## Migration / Rollout
Se requiere ejecutar un DDL en Supabase para crear la tabla `expenses` con RLS habilitado (aunque por ahora sea para un solo administrador). No se requieren migraciones de datos existentes.

## Open Questions
- [x] ¿Debemos permitir adjuntar fotos del ticket de gasto? *Decisión: Queda para una fase futura.*
