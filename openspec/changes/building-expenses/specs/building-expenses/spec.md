# Building Expenses Specification

## Purpose
Este módulo permite el registro, categorización y seguimiento de los egresos vinculados a la administración de propiedades, permitiendo calcular la rentabilidad real de cada activo.

## Requirements

### Requirement: Registro de Gastos por Edificio

El sistema DEBE permitir registrar un gasto vinculándolo obligatoriamente a un edificio.

#### Scenario: Registro exitoso de gasto de edificio
- GIVEN un administrador autenticado y un edificio registrado ("Torre A")
- WHEN el administrador registra un gasto de "Gs. 500.000" con categoría "Mantenimiento" para la "Torre A"
- THEN el sistema DEBE persistir el gasto con la fecha actual por defecto
- AND el gasto DEBE aparecer en el historial del edificio

### Requirement: Gastos Específicos por Unidad

El sistema DEBE permitir vincular un gasto a una unidad específica de un edificio de forma opcional.

#### Scenario: Registro de reparación en un departamento
- GIVEN un departamento ("Depto 3B") en la "Torre A"
- WHEN el administrador registra un gasto de "Reparación Eléctrica" vinculando la unidad "3B"
- THEN el sistema DEBE permitir identificar que ese gasto pertenece exclusivamente a esa unidad para el cálculo de rentabilidad del departamento

### Requirement: Categorización Obligatoria

Todo gasto DEBE pertenecer a una de las categorías predefinidas: Impuestos, Mantenimiento, Reparación, Servicios, Otros.

#### Scenario: Intento de registro sin categoría
- GIVEN el formulario de nuevo gasto
- WHEN el administrador intenta guardar sin seleccionar una categoría
- THEN el sistema DEBE impedir el guardado y mostrar un error de validación
