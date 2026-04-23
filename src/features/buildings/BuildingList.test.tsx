import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BuildingList from './BuildingList'

// Mock de Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: [
            { id: '1', name: 'Edificio Plaza', status: 'available' },
            { id: '2', name: 'Edificio Sol', status: 'rented' }
          ],
          error: null
        }))
      }))
    }))
  }
}))

describe('BuildingList', () => {
  it('debe mostrar la lista de edificios', async () => {
    const mockOnEdit = vi.fn()
    render(<BuildingList onEdit={mockOnEdit} />)
    
    await waitFor(() => {
      expect(screen.getByText(/Edificio Plaza/i)).toBeInTheDocument()
      expect(screen.getByText(/Edificio Sol/i)).toBeInTheDocument()
    })
  })
})
