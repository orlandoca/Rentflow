# Delta for Core System (Expenses)

## MODIFIED Requirements

### Requirement: Dashboard con Indicadores de Negocio

El sistema DEBE mostrar un resumen dinámico de la situación del negocio, incluyendo recaudación, ocupación, alertas de vencimiento y ahora TAMBIÉN el total de gastos y la utilidad neta.
(Anteriormente: Solo mostraba recaudación y ocupación).

#### Scenario: Visualización de Utilidad Neta
- GIVEN que existen contratos activos con recaudación total de "Gs. 10.000.000"
- AND existen gastos registrados por "Gs. 2.000.000"
- WHEN el administrador carga el Dashboard
- THEN el sistema DEBE mostrar una tarjeta de "Gastos Totales" por "Gs. 2.000.000"
- AND DEBE mostrar una tarjeta de "Utilidad Neta" (Recaudación - Gastos) por "Gs. 8.000.000"
