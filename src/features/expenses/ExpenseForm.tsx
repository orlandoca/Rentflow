import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Building, Unit, ExpenseCategory } from "@/types"

interface ExpenseFormProps {
  onSuccess: () => void
}

export default function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const [loading, setLoading] = useState(false)
  const [buildings, setBuildings] = useState<Building[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  
  const [formData, setFormData] = useState({
    building_id: "",
    unit_id: "",
    amount: 0,
    category: "" as ExpenseCategory,
    description: "",
    expense_date: new Date().toISOString().split("T")[0]
  })

  useEffect(() => {
    async function fetchBuildings() {
      const { data } = await supabase.from("buildings").select("*").order("name")
      if (data) setBuildings(data as any)
    }
    fetchBuildings()
  }, [])

  useEffect(() => {
    async function fetchUnits() {
      if (!formData.building_id) {
        setUnits([])
        return
      }
      const { data } = await supabase.from("units").select("*").eq("building_id", formData.building_id).order("unit_number")
      if (data) setUnits(data as any)
    }
    fetchUnits()
  }, [formData.building_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.building_id || !formData.category || formData.amount <= 0) return
    
    setLoading(true)
    try {
      const { error } = await supabase.from("expenses").insert({
        building_id: formData.building_id,
        unit_id: formData.unit_id || null,
        amount: formData.amount,
        category: formData.category,
        description: formData.description,
        expense_date: formData.expense_date
      })

      if (error) throw error
      onSuccess()
    } catch (error) {
      console.error("Error saving expense:", error)
      alert("Error al guardar el gasto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="building_id" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Edificio</label>
          <select 
            id="building_id" 
            required 
            value={formData.building_id} 
            onChange={(e) => setFormData(prev => ({...prev, building_id: e.target.value, unit_id: ""}))} 
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Seleccionar Edificio...</option>
            {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="unit_id" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Unidad (Opcional)</label>
          <select 
            id="unit_id" 
            value={formData.unit_id} 
            onChange={(e) => setFormData(prev => ({...prev, unit_id: e.target.value}))} 
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Todo el Edificio</option>
            {units.map(u => <option key={u.id} value={u.id}>Unidad {u.unit_number}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Categoría</label>
          <select 
            id="category" 
            required 
            value={formData.category} 
            onChange={(e) => setFormData(prev => ({...prev, category: e.target.value as ExpenseCategory}))} 
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Seleccionar Categoría...</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="impuestos">Impuestos</option>
            <option value="servicios">Servicios</option>
            <option value="reparacion">Reparación</option>
            <option value="otros">Otros</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Monto (Gs.)</label>
          <input 
            id="amount" 
            type="number" 
            required 
            min="1"
            value={formData.amount} 
            onChange={(e) => setFormData(prev => ({...prev, amount: Number(e.target.value)}))} 
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-red-400 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="expense_date" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Fecha del Gasto</label>
        <input 
          id="expense_date" 
          type="date" 
          required 
          value={formData.expense_date} 
          onChange={(e) => setFormData(prev => ({...prev, expense_date: e.target.value}))} 
          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Descripción / Notas</label>
        <textarea 
          id="description" 
          rows={3}
          value={formData.description} 
          onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))} 
          placeholder="Ej: Pago de ANDE, Arreglo de pintura fachada..."
          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-900/20" 
        disabled={loading}
      >
        {loading ? "Guardando..." : "Registrar Gasto"}
      </Button>
    </form>
  )
}
