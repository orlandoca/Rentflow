import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Expense } from "@/types"

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpenses()
  }, [])

  async function fetchExpenses() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("expenses")
        .select("*, building:buildings(name), unit:units(unit_number)")
        .order("expense_date", { ascending: false })

      if (error) throw error
      if (data) setExpenses(data as any)
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => new Intl.NumberFormat("es-PY").format(price)

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold animate-pulse uppercase tracking-widest">Cargando egresos...</div>

  return (
    <div className="space-y-4">
      {expenses.length === 0 ? (
        <div className="p-12 bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl text-center">
          <p className="text-slate-500 font-bold">No hay gastos registrados en el sistema.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center group hover:bg-slate-900/80 transition-all border-l-4 border-l-red-500">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 text-xl font-bold">
                  {expense.category === 'impuestos' ? '🏛️' : 
                   expense.category === 'mantenimiento' ? '🛠️' : 
                   expense.category === 'reparacion' ? '🩹' : 
                   expense.category === 'servicios' ? '⚡' : '💰'}
                </div>
                <div>
                  <h5 className="font-black text-white capitalize text-lg tracking-tight">
                    {expense.description || expense.category}
                  </h5>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {expense.building?.name} {expense.unit?.unit_number ? `· Unidad ${expense.unit.unit_number}` : ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-red-400 text-lg tracking-tighter">- Gs. {formatPrice(expense.amount)}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {new Date(expense.expense_date + 'T00:00:00').toLocaleDateString('es-PY')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
