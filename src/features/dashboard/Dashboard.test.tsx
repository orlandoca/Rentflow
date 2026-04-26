import { render, screen, waitFor } from "@testing-library/react"
import Dashboard from "./Dashboard"
import { vi } from "vitest"
import { supabase } from "@/lib/supabase"

// Mock de Supabase
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((callback) => {
        // Simulamos diferentes respuestas según la tabla
        return Promise.resolve(callback({ data: [], count: 0, error: null }))
      })
    }))
  }
}))

describe("Dashboard", () => {
  it("debe mostrar las tarjetas de Gastos Totales y Utilidad Neta", async () => {
    render(<Dashboard />)
    
    // Esperamos que aparezcan los títulos de las nuevas métricas
    await waitFor(() => {
      expect(screen.getByText(/Gastos Mensuales/i)).toBeInTheDocument()
      expect(screen.getByText(/Utilidad Neta/i)).toBeInTheDocument()
    })
  })
})
