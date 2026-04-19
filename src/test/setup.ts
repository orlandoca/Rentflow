import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock de variables de entorno para que el cliente de Supabase no falle al inicializarse en tests
vi.stubEnv('VITE_SUPABASE_URL', 'https://mock-url.supabase.co')
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'mock-anon-key')
