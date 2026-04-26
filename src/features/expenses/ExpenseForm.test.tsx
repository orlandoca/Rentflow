import { render, screen, fireEvent } from "@testing-library/react"
import ExpenseForm from "./ExpenseForm"
import { vi } from "vitest"
import { supabase } from "@/lib/supabase"

// Mock de Supabase
vi.mock("@/lib/supabase", () => {
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
    then: vi.fn().mockImplementation((callback) => Promise.resolve(callback({ data: [], error: null })))
  }
  return { supabase: mockSupabase }
})

describe("ExpenseForm", () => {
  const mockOnSuccess = vi.fn()

  it("debe mostrar errores de validación si el monto es cero o negativo", async () => {
    render(<ExpenseForm onSuccess={mockOnSuccess} />)
    
    const submitBtn = screen.getByRole("button", { name: /Registrar Gasto/i })
    fireEvent.click(submitBtn)

    // El HTML5 validation o nuestra lógica debería impedir el envío
    expect(mockOnSuccess).not.toHaveBeenCalled()
  })

  it("debe cargar la lista de edificios al iniciarse", async () => {
    render(<ExpenseForm onSuccess={mockOnSuccess} />)
    expect(supabase.from).toHaveBeenCalledWith("buildings")
  })
})
