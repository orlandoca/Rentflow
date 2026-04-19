import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BuildingForm from './BuildingForm'
import { supabase } from '@/lib/supabase'

// Mock de Supabase
vi.mock('@/lib/supabase', () => {
  const mockInsert = vi.fn(() => Promise.resolve({ error: null }))
  const mockFrom = vi.fn(() => ({
    insert: mockInsert
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

  it('debe enviar los datos del nuevo edificio a Supabase', async () => {
    const onSuccess = vi.fn()
    render(<BuildingForm onSuccess={onSuccess} />)

    // Llenar los campos
    fireEvent.change(screen.getByLabelText(/Nombre del Edificio/i), { target: { value: 'Edificio Plaza' } })

    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /Guardar Edificio/i }))

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('buildings')
      const mockFrom = vi.mocked(supabase.from('buildings'))
      expect(mockFrom.insert).toHaveBeenCalledWith({
        name: 'Edificio Plaza',
        address: '',
        description: '',
        status: 'available'
      })
      expect(onSuccess).toHaveBeenCalled()
    })
  })
})
