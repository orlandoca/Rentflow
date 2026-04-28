import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BuildingForm from './BuildingForm'
import { supabase } from '@/lib/supabase'

// Mock de Supabase
vi.mock('@/lib/supabase', () => {
  const mockFrom = vi.fn(() => ({
    insert: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [{ id: 'b1' }], error: null })),
      single: vi.fn(() => Promise.resolve({ data: { id: 'b1' }, error: null }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null }))
    }))
  }))
  
  return {
    supabase: {
      from: mockFrom
    }
  }
})

describe('BuildingForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe enviar los datos del nuevo inmueble a Supabase', async () => {
    const onSuccess = vi.fn()
    render(<BuildingForm onSuccess={onSuccess} />)

    // Llenar los campos
    fireEvent.change(screen.getByLabelText(/Nombre del Inmueble/i), { target: { value: 'Edificio Plaza' } })

    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /Registrar Inmueble/i }))

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('buildings')
      expect(onSuccess).toHaveBeenCalled()
    })
  })
})
