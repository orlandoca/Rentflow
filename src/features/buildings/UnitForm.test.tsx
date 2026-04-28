import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import UnitForm from './UnitForm'
import { supabase } from '@/lib/supabase'

// Mock de Supabase
vi.mock('@/lib/supabase', () => {
  const mockInsert = vi.fn(() => Promise.resolve({ error: null }))
  const mockFrom = vi.fn((table) => ({
    select: vi.fn(() => ({
      order: vi.fn(() => Promise.resolve({
        data: table === 'buildings' ? [{ id: 'b1', name: 'Edificio Plaza' }] : [],
        error: null
      }))
    })),
    insert: mockInsert
  }))
  
  return {
    supabase: {
      from: mockFrom
    }
  }
})

describe('UnitForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe enviar los datos del nuevo departamento ligado a un edificio', async () => {
    const onSuccess = vi.fn()
    render(<UnitForm onSuccess={onSuccess} />)

    // Esperar a que carguen los edificios
    await waitFor(() => {
      expect(screen.getByLabelText(/Edificio/i)).toBeInTheDocument()
    })

    // Llenar los campos
    fireEvent.change(screen.getByLabelText(/Edificio/i), { target: { value: 'b1' } })
    fireEvent.change(screen.getByLabelText(/Número de Depto/i), { target: { value: '201-A' } })
    fireEvent.change(screen.getByLabelText(/Precio de Alquiler/i), { target: { value: '2800000' } })

    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /Guardar Departamento/i }))

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('units')
      const mockFrom = vi.mocked(supabase.from('units'))
      expect(mockFrom.insert).toHaveBeenCalledWith({
        building_id: 'b1',
        unit_number: '201-A',
        price: 2800000,
        floor: '',
        description: '',
        status: 'available',
        bedrooms: 1,
        bathrooms: 1,
        has_balcony: false,
        sq_meters: 0
      })
      expect(onSuccess).toHaveBeenCalled()
    })
  })
})
