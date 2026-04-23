import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TenantsList from './TenantsList'
import { supabase } from '@/lib/supabase'

// Mock de Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: [
            { id: '1', full_name: 'Juan Pérez', ci: '1.234.567', phone: '0981123456' },
            { id: '2', full_name: 'María García', ci: '2.345.678', phone: '0971234567' }
          ],
          error: null
        }))
      }))
    }))
  }
}))

describe('TenantsList', () => {
  it('debe mostrar la lista de inquilinos', async () => {
    render(<TenantsList />)
    
    // Debería mostrar los nombres de los inquilinos mockeados
    await waitFor(() => {
      expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument()
      expect(screen.getByText(/María García/i)).toBeInTheDocument()
    })
    
    // Debería mostrar las CIs
    expect(screen.getByText(/1.234.567/i)).toBeInTheDocument()
    expect(screen.getByText(/2.345.678/i)).toBeInTheDocument()
  })

  it('debe mostrar un mensaje cuando no hay inquilinos', async () => {
    // Re-mock para este test específico (lista vacía)
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    } as any)

    render(<TenantsList />)
    
    await waitFor(() => {
      expect(screen.getByText(/No hay inquilinos registrados/i)).toBeInTheDocument()
    })
  })
})
