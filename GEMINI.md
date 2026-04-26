# Mandatos del Proyecto: Rentflow

Este archivo define las reglas de convivencia, arquitectura y estándares técnicos para el desarrollo de Rentflow. Son de cumplimiento obligatorio para cualquier agente o desarrollador.

## 1. Contexto del Producto
- **Nombre**: Rentflow
- **Mercado**: Administración de propiedades en Paraguay.
- **Contexto Regional**: 
  - **Moneda**: Guaraníes (Gs.), formateados sin decimales (ej: 3.500.000 Gs.).
  - **Identidad**: Cédula de Identidad (CI), formato numérico estándar.
  - **Cálculos**: Utilidad Neta = (Ingresos Brutos - Gastos Totales).

## 2. Stack Tecnológico
- **Frontend**: React 19, TypeScript 6.0+, Vite 8.
- **Styling**: Tailwind CSS v4 + Shadcn/ui.
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions).
- **Testing**: Vitest con React Testing Library.
- **Documentación**: PDF autogenerados (generadores en `src/lib/pdfGenerators.ts`).

## 3. Mandatos de Ingeniería

### 3.1. Strict TDD Mode (MANDATORIO)
- **Regla**: Prohibido escribir código de implementación sin antes tener un test fallando que justifique su existencia.
- **Flujo**: 1. Escribir test -> 2. Verificar fallo -> 3. Implementar código mínimo -> 4. Refactorizar.
- **Ubicación**: Los tests deben vivir junto al componente o en `src/test/`.

### 3.2. Arquitectura "Screaming Features"
- Toda la lógica de negocio debe estar dentro de `src/features/{feature_name}/`.
- Estructura interna de feature:
  - `components/`: UI específica de la feature.
  - `hooks/`: Lógica de estado y datos.
  - `services/`: Llamadas a Supabase/API.
  - `types/`: Definiciones de TS propias.
  - `[FeatureName].tsx`: Punto de entrada principal.
  - `[FeatureName].test.tsx`: Suite de tests.

### 3.3. Manejo de Base de Datos
- Las tablas y esquemas se gestionan mediante migraciones de Supabase.
- No realizar cambios directos vía SQL sin documentar el cambio en `openspec/` si es parte de una feature nueva.
- Utilizar `public` como esquema por defecto.

### 3.4. Estándares de Código
- **Tipado**: Strict TypeScript. Evitar `any` a toda costa.
- **Componentes**: Funcionales con hooks. Preferir composición sobre herencia.
- **UI**: Mantener la estética profesional y limpia definida en `components.json`.

### 3.5. Seguridad y Commits (GGA AI Philosophy)
- **Regla**: Todo commit debe ser validado antes de ser persistido.
- **Filtros**: No se permiten secretos en el código (.env, llaves).
- **Calidad**: No se permiten commits si los tests o el linter fallan.
- **Mensajes**: Seguir la convención de 'Conventional Commits'.

## 4. Flujo de Trabajo (Spec-Driven Development)
- Para cambios significativos, seguir el ciclo:
  1. `proposal.md`: Qué y por qué.
  2. `specs/`: Reglas de negocio detalladas.
  3. `design.md`: Arquitectura técnica y esquema de DB.
  4. `tasks.md`: Breakdown de implementación.
- Los artefactos viven en `openspec/changes/{change-name}/`.

## 5. Glosario Técnico Regional
- **Edificio/Torre**: Estructura principal.
- **Unidad**: Departamento o local individual.
- **Inquilino**: Persona que alquila.
- **Pagaré**: Documento de compromiso de pago mensual.
- **Recibo**: Comprobante oficial de cobro con numeración secuencial.
