# Rentflow: System Design

## 1. Visión General
Rentflow es una plataforma de gestión de propiedades diseñada específicamente para el mercado paraguayo. Su arquitectura busca simplicidad, robustez y una experiencia de usuario rápida (Real-time).

## 2. Stack Tecnológico
- **Frontend**: React 19 + TypeScript 6.
- **Styling**: Tailwind CSS v4 (Engine moderno) + Shadcn/ui.
- **Backend-as-a-Service**: Supabase (Postgres, Auth, Storage).
- **Testing**: Vitest + React Testing Library (Strict TDD).

## 3. Patrones Arquitectónicos

### 3.1. Screaming Features
La estructura de archivos refleja la lógica de negocio, no la técnica:
```text
src/features/
  ├── auth/         # Login y Gestión de sesión
  ├── buildings/    # Edificios y Unidades
  ├── contracts/    # Contratos de alquiler
  ├── expenses/     # Gestión de egresos (Mantenimiento, impuestos)
  └── payments/     # Cobranzas y Recibos
```
Cada feature debe ser "autosuficiente", conteniendo sus propios `components`, `hooks` y `types` específicos.

### 3.2. Data Flow
1. **View**: El componente React despacha una acción a un Hook.
2. **Hook**: Gestiona el estado de carga y llama al `Service`.
3. **Service (Supabase)**: Realiza la consulta a la base de datos con tipos generados.
4. **Cache/Sync**: Se utiliza el cache nativo de la conexión de Supabase para mantener la UI sincronizada.

## 4. Diseño de Base de Datos (Esquema Public)

### Entidades Principales
- **tenants**: (id, full_name, ci, phone, email)
- **buildings**: (id, name, address, owner_name, owner_ci)
- **units**: (id, building_id, unit_number, price, status)
- **contracts**: (id, tenant_id, unit_id, monthly_amount, deposit, status)
- **payments**: (id, contract_id, amount, receipt_number, month_covered)
- **expenses**: (id, building_id, unit_id, amount, category, date)

## 5. Estándares Regionales (Paraguay)
- **Formateo de Moneda**: `Gs. 3.500.000` (Entero, sin decimales).
- **Formatos de Fecha**: ISO para DB, `DD/MM/YYYY` para UI.
- **Documentos Legales**: Generación dinámica de Pagarés y Recibos en PDF siguiendo normativas locales.

## 6. Estrategia de Calidad
- **Strict TDD**: Ninguna lógica de negocio se implementa sin un test unitario/integración previo.
- **CI/CD**: Git Hooks (Husky) bloquean commits que no pasen el linter o los tests.
- **Build Guard**: El tipado estricto es obligatorio (`noImplicitAny: true`).

## 7. Escalabilidad Futura
- **Edge Functions**: Para procesamiento pesado (ej: cierre de mes masivo).
- **Realtime**: Suscripciones para notificaciones de pagos vencidos.
- **Analytics**: Integración de Recharts para visualización de ROI por edificio.
