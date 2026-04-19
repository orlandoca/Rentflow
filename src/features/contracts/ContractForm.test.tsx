import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ContractForm from './ContractForm'
import { supabase } from '@/lib/supabase'

// Mock de Supabase
vi.mock('@/lib/supabase', () => {
  const mockInsert = vi.fn(() => Promise.resolve({ error: null }))
  const mockFrom = vi.fn((table) => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: table === 'tenants' ? [{ id: 't1', full_name: 'Juan Pérez' }] : 
                table === 'units' ? [{ id: 'u1', unit_number: '201', building: { name: 'Edificio Plaza' }, price: 2500000 }] : [],
          error: null
        }))
      })),
      order: vi.fn(() => Promise.resolve({
        data: table === 'tenants' ? [{ id: 't1', full_name: 'Juan Pérez' }] : [],
        error: null
      }))
    })),
    insert: mockInsert
  }))
  
  return {
    supabase: {
      from: mockFrom,
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn(() => Promise.resolve({ data: { path: 'path/to/file.pdf' }, error: null })),
          getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'http://supabase.com/file.pdf' } }))
        }))
      }
    }
  }
})

describe('ContractForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe enviar los datos del contrato y subir el archivo', async () => {
    const onSuccess = vi.fn()
    render(<ContractForm onSuccess={onSuccess} />)

    // Esperar carga de datos
    await waitFor(() => {
      expect(screen.getByLabelText(/Inquilino/i)).toBeInTheDocument()
    })

    // Llenar datos
    fireEvent.change(screen.getByLabelText(/Inquilino/i), { target: { value: 't1' } })
    fireEvent.change(screen.getByLabelText(/Departamento/i), { target: { value: 'u1' } })
    fireEvent.change(screen.getByLabelText(/Monto Mensual/i), { target: { value: '2500000' } })
    fireEvent.change(screen.getByLabelText(/Fecha de Inicio/i), { target: { value: '2026-05-01' } })
    fireEvent.change(screen.getByLabelText(/Fecha de Fin/i), { target: { value: '2027-05-01' } })

    // Simular subida de archivo
    const file = new File(['contrato'], 'contrato.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/Contrato Escaneado/i) as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })

    // Enviar
    fireEvent.click(screen.getByRole('button', { name: /Guardar Contrato/i }))

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('contracts')
      expect(onSuccess).toHaveBeenCalled()
    })
  })
})
