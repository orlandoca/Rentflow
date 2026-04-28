import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ContractForm from './ContractForm'
import { supabase } from '@/lib/supabase'

// Mock de Supabase ultra-robusto para Vitest
vi.mock('@/lib/supabase', () => {
  const mockResult = (data: unknown) => Promise.resolve({ data, error: null })

  const createMockChain = (data: unknown) => {
    const chain = {
      select: vi.fn(() => chain),
      order: vi.fn(() => mockResult(data)),
      eq: vi.fn(() => chain),
      single: vi.fn(() => Promise.resolve({ data: Array.isArray(data) ? data[0] : data, error: null })),
      insert: vi.fn(() => chain),
      update: vi.fn(() => chain),
      // Para que el thenable funcione si se usa await directamente
      then: (resolve: (val: unknown) => void) => resolve({ data, error: null })
    }
    // Especial para el caso de eq() que debe retornar el resultado final en algunos casos
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(chain.eq as any).mockImplementation(() => {
      return {
        ...chain,
        then: (resolve: (val: unknown) => void) => resolve({ data, error: null }),
        single: vi.fn(() => Promise.resolve({ data: Array.isArray(data) ? data[0] : data, error: null }))
      }
    })
    return chain
  }

  const mockFrom = vi.fn((table: string) => {
    if (table === 'tenants') return createMockChain([{ id: 't1', full_name: 'Juan Pérez' }])
    if (table === 'units') return createMockChain([{ id: 'u1', unit_number: '201', building: { name: 'Edificio Plaza' }, price: 2500000 }])
    if (table === 'contracts') return createMockChain({ id: 'c1' })
    return createMockChain([])
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

    // Esperar a que los selects se llenen
    await waitFor(() => {
      expect(screen.queryByText('Juan Pérez')).toBeInTheDocument()
      expect(screen.queryByText(/201/i)).toBeInTheDocument()
    }, { timeout: 5000 })

    // Llenar datos
    fireEvent.change(screen.getByLabelText(/Inquilino/i), { target: { value: 't1' } })
    fireEvent.change(screen.getByLabelText(/Departamento/i), { target: { value: 'u1' } })
    fireEvent.change(screen.getByLabelText(/Monto Mensual/i), { target: { value: '2500000' } })
    
    // Seleccionar fechas
    fireEvent.change(screen.getByLabelText(/Fecha de Inicio/i), { target: { value: '2026-05-01' } })
    fireEvent.change(screen.getByLabelText(/Fecha de Fin/i), { target: { value: '2027-05-01' } })

    // Simular archivo
    const file = new File(['test'], 'contrato.pdf', { type: 'application/pdf' })
    fireEvent.change(screen.getByLabelText(/Contrato Escaneado/i), { target: { files: [file] } })

    // Enviar
    fireEvent.click(screen.getByRole('button', { name: /Guardar Contrato/i }))

    // Verificar que se llamó a insert en la tabla contracts
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('contracts')
      expect(onSuccess).toHaveBeenCalled()
    }, { timeout: 5000 })
  })
})
