import { render, screen } from "@testing-library/react"
import ExpenseList from "./ExpenseList"
import { vi } from "vitest"
import { supabase } from "@/lib/supabase"

// Mock de Supabase
vi.mock("@/lib/supabase", () => {
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    then: vi.fn().mockImplementation((callback) => 
      Promise.resolve(callback({ 
        data: [
          { 
            id: 'e1', 
            amount: 500000, 
            category: 'mantenimiento', 
            description: 'Arreglo cañería',
            expense_date: '2026-04-25',
            building: { name: 'Edificio Plaza' }
          }
        ], 
        error: null 
      }))
    )
  }
  return { supabase: mockSupabase }
})

describe("ExpenseList", () => {
  it("debe mostrar la lista de gastos con sus montos y descripciones", async () => {
    render(<ExpenseList />)
    
    // Verificamos que se llame a la tabla correcta
    expect(supabase.from).toHaveBeenCalledWith("expenses")
    
    // Verificamos que el contenido aparezca en pantalla
    const expenseItem = await screen.findByText(/Arreglo cañería/i)
    expect(expenseItem).toBeInTheDocument()
    expect(screen.getByText(/500.000/i)).toBeInTheDocument()
  })

  it("debe mostrar un mensaje si no hay gastos registrados", async () => {
    // Sobreescribimos el mock para devolver vacío
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((callback) => 
        Promise.resolve(callback({ data: [], error: null }))
      )
    } as any)

    render(<ExpenseList />)
    const emptyMsg = await screen.findByText(/No hay gastos registrados/i)
    expect(emptyMsg).toBeInTheDocument()
  })
})
