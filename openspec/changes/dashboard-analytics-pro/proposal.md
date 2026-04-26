# Proposal: Dashboard Analytics Pro

## Intent
El dashboard actual es puramente informativo y estático. Necesitamos proporcionar al administrador una visión temporal de sus ingresos y una comparativa de rendimiento entre edificios para facilitar la toma de decisiones estratégicas (ej: qué edificio necesita más marketing o dónde hay mayor morosidad).

## Scope

### In Scope
- Instalación de `recharts`.
- Gráfico de **Evolución de Recaudación**: Histórico de los últimos 6 meses (Ingresos realizados).
- Gráfico de **Ocupación por Edificio**: Comparativa visual de unidades ocupadas vs disponibles.
- **Métricas de Proyección**: Estimado de recaudación para el mes en curso basado en contratos activos.
- Refactor de `Dashboard.tsx` para soportar carga de datos asíncrona de analíticas.

### Out of Scope
- Reportes exportables en Excel/CSV (para fase futura).
- Analíticas por inquilino individual.
- Integración con el módulo de Gastos (se hará cuando el módulo exista).

## Capabilities

### New Capabilities
- `dashboard-analytics`: Manejo de lógica de agregación y visualización de métricas temporales y de ocupación.

### Modified Capabilities
- `core-system`: Actualización de requerimientos para incluir visualización avanzada en el Dashboard.

## Approach
Implementaremos un componente de analíticas que use `Recharts`. Las agregaciones se realizarán en el cliente inicialmente (JS) para mantener la simplicidad, filtrando los `payments` por rango de fecha desde Supabase. Usaremos un layout responsivo que mantenga las tarjetas de resumen actuales arriba y los gráficos debajo.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Add `recharts` dependency. |
| `src/features/dashboard/Dashboard.tsx` | Modified | New UI components and data fetching logic. |
| `src/types/index.ts` | Modified | Add interfaces for chart data. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Performance de queries | Low | Filtrar pagos por fecha en la DB (últimos 6 meses). |
| Estética inconsistente | Low | Usar la paleta de colores de Tailwind v4 ya definida en el proyecto. |

## Rollback Plan
Revertir los cambios en `Dashboard.tsx` y desinstalar `recharts`. El esquema de la DB no cambia, por lo que no hay riesgo de pérdida de datos.

## Dependencies
- `recharts` package.

## Success Criteria
- [ ] El dashboard carga gráficos de línea y torta sin errores.
- [ ] Los datos mostrados coinciden con la suma de pagos registrados.
- [ ] La interfaz se mantiene responsiva en móviles.
