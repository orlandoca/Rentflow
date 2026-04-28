import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TenantForm from './TenantForm'
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

describe('TenantForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe enviar los datos del nuevo inquilino a Supabase', async () => {
    const onSuccess = vi.fn()
    render(<TenantForm onSuccess={onSuccess} />)

    // Llenar los campos
    fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Carlos Ruiz' } })
    fireEvent.change(screen.getByLabelText(/Cédula de Identidad/i), { target: { value: '5.678.901' } })
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '0985987654' } })

    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /Registrar Inquilino/i }))

    await waitFor(() => {
      // Verificar que se llamó a Supabase con los datos correctos
      expect(supabase.from).toHaveBeenCalledWith('tenants')
      const mockFrom = vi.mocked(supabase.from('tenants'))
      expect(mockFrom.insert).toHaveBeenCalledWith({
        full_name: 'Carlos Ruiz',
        ci: '5.678.901',
        phone: '0985987654',
        email: '',
        address: ''
      })
      // Verificar que se llamó al callback de éxito
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('no debe enviar datos si faltan campos obligatorios (simulado por no llamar a supabase)', async () => {
    render(<TenantForm onSuccess={() => {}} />)

    const button = screen.getByRole('button', { name: /Registrar Inquilino/i })
    const form = button.closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    expect(supabase.from).not.toHaveBeenCalled()
  })
})
