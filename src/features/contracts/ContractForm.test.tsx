import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ContractForm from './ContractForm'
import { supabase } from '@/lib/supabase'

// Mock de Supabase mÃ¡s flexible
vi.mock('@/lib/supabase', () => {
  const mockInsert = vi.fn().mockReturnValue({ error: null })
  const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ error: null }) })
  
  const mockFrom = vi.fn((table) => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockImplementation(() => {
        if (table === 'tenants') return Promise.resolve({ data: [{ id: 't1', full_name: 'Juan PÃ©rez' }], error: null })
        if (table === 'units') return Promise.resolve({ data: [{ id: 'u1', unit_number: '201', building: { name: 'Edificio Plaza' }, price: 2500000 }], error: null })
        return Promise.resolve({ data: [], error: null })
      }),
      eq: vi.fn().mockImplementation(() => {
        if (table === 'units') return Promise.resolve({ data: [{ id: 'u1', unit_number: '201', building: { name: 'Edificio Plaza' }, price: 2500000 }], error: null })
        return { eq: vi.fn().mockResolvedValue({ error: null }) }
      }),
      insert: mockInsert,
      update: mockUpdate
    }
    return chain
  })

  return {
    supabase: {
      from: mockFrom,
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ data: { path: 'path' }, error: null }),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'http://url.com' } })
        })
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

    // Esperar a que los selects se llenen con los datos de tenants/units
    await waitFor(() => {
      expect(screen.getByText('Juan PÃ©rez')).toBeInTheDocument()
    })

    // Llenar datos
    fireEvent.change(screen.getByLabelText(/Inquilino/i), { target: { value: 't1' } })
    fireEvent.change(screen.getByLabelText(/Departamento/i), { target: { value: 'u1' } })
    fireEvent.change(screen.getByLabelText(/Monto Mensual/i), { target: { value: '2500000' } })
    
    // Seleccionar fechas
    const startDate = screen.getByLabelText(/Fecha de Inicio/i)
    fireEvent.change(startDate, { target: { value: '2026-05-01' } })
    const endDate = screen.getByLabelText(/Fecha de Fin/i)
    fireEvent.change(endDate, { target: { value: '2027-05-01' } })

    // Simular archivo
    const file = new File(['test'], 'contrato.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/Contrato Escaneado/i)
    fireEvent.change(input, { target: { files: [file] } })

    // Enviar
    const submitBtn = screen.getByRole('button', { name: /Guardar Contrato/i })
    fireEvent.click(submitBtn)

    // Verificar que se llamÃ³ a insert en la tabla contracts
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('contracts')
      expect(onSuccess).toHaveBeenCalled()
    }, { timeout: 3000 })
  })
})
