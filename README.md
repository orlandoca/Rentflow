# Rentflow 🌊 — Inmuebles & Finanzas

**Rentflow** es una plataforma integral de gestión inmobiliaria diseñada específicamente para el mercado paraguayo. A diferencia de los gestores genéricos, Rentflow automatiza el ciclo legal y financiero crítico: desde la generación de pagarés multipágina hasta el cálculo de utilidad neta en tiempo real.

[![Tech Stack](https://img.shields.io/badge/Stack-React%2019%20%2B%20Vite%208-blue)](https://react.dev/)
[![Database](https://img.shields.io/badge/Backend-Supabase%20(Postgres)-emerald)](https://supabase.com/)
[![Styles](https://img.shields.io/badge/Styles-Tailwind%20CSS%20v4-38bdf8)](https://tailwindcss.com/)
[![Standards](https://img.shields.io/badge/Standard-Strict%20TDD-red)](https://vitest.dev/)

---

## 🚀 Valor Agregado (The "Pro" Edge)

Este proyecto fue desarrollado bajo una mentalidad de **Senior Architect**, priorizando la escalabilidad y la resolución de problemas reales del sector inmobiliario:

*   **Lógica Legal Automatizada**: Generación dinámica de Contratos y Pagarés (unificados en PDF multipágina) usando `jsPDF`.
*   **Gestión Financiera Pro**: Seguimiento de ingresos (Recaudación Bruta) vs. egresos (Gastos de Mantenimiento/Impuestos) con cálculo automático de **Utilidad Neta**.
*   **Localización Avanzada**: Manejo de moneda Guaraníes (Gs.), formatos de Cédula de Identidad (CI) y numeración secuencial de recibos auditables (`001-1000001`).
*   **Inventario Detallado**: Control técnico de unidades (m², habitaciones, baños, balcones) que transforma la app en un inventario de activos real.

---

## 🛠️ Stack Tecnológico & Arquitectura

*   **Frontend**: React 19 (Hooks, Context API) + Vite 8.
*   **Tipado**: TypeScript 6 (Strict Mode) para asegurar la integridad de las interfaces de datos.
*   **Estilos**: Tailwind CSS v4 con una estética *Glassmorphism* y Dark Mode nativo.
*   **Backend-as-a-Service**: Supabase (Postgres, Auth, Storage, RLS).
*   **Testing**: Vitest + React Testing Library siguiendo la metodología **Strict TDD**.
*   **Metodología**: Spec-Driven Development (SDD) para el planeamiento de features complejas.

---

## 🏗️ Estructura del Proyecto (Screaming Architecture)

```text
src/
├── features/          # Dominio de negocio (encapsulado por funcionalidad)
│   ├── auth/          # Seguridad y Sesión
│   ├── buildings/     # Lógica de Edificios y Unidades
│   ├── contracts/     # Motor legal y documentos
│   ├── dashboard/     # Inteligencia de negocios y analíticas
│   └── expenses/      # Control de egresos y rentabilidad
├── lib/               # Clientes (Supabase, PDF Generators, Auth)
├── types/             # Contratos de datos (TypeScript Interfaces)
└── components/ui/     # Componentes atómicos de diseño
```

---

## 🚦 Guía de Inicio Rápido

### Requisitos
- Node.js >= 20
- Cuenta de Supabase con el esquema de tablas configurado.

### Instalación
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno en un archivo `.env`:
   ```env
   VITE_SUPABASE_URL=tu_url
   VITE_SUPABASE_ANON_KEY=tu_key
   ```
4. Levantar servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Ejecutar Tests
Para validar la integridad del sistema y el cumplimiento de las reglas de negocio:
```bash
npm test
```

---

## 📈 Próximos Pasos (Roadmap)
- [ ] **Dashboard Analytics Pro**: Gráficos de tendencia histórica con Recharts.
- [ ] **Multi-Tenancy**: Aislamiento de datos mediante Row Level Security (RLS) para múltiples administradores independientes.
- [ ] **WhatsApp Bot**: Notificaciones automáticas de vencimiento y envío de recibos digitales.

---
*Desarrollado con ❤️ para transformar la administración inmobiliaria en Paraguay.*
