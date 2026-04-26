import { Expense, ExpenseCategory } from "@/types"

describe('Types: Expense', () => {
  it('debe tener la estructura correcta definida en el diseño', () => {
    const mockExpense: Expense = {
      id: 'exp-123',
      building_id: 'b-123',
      unit_id: null,
      amount: 500000,
      category: 'mantenimiento',
      description: 'Reparación de cañería',
      expense_date: '2026-04-26',
      created_at: '2026-04-26T10:00:00Z'
    }

    expect(mockExpense.amount).toBe(500000)
    expect(mockExpense.category).toBe('mantenimiento' as ExpenseCategory)
  })
})
