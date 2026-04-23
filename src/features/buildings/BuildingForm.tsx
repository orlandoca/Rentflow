import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Building } from "@/types"

interface BuildingFormProps {
  onSuccess: () => void
  building?: Building
}

export default function BuildingForm({ onSuccess, building }: BuildingFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    owner_name: "ANA GOREJKO",
    owner_ci: "2.362.226",
    address: "",
    description: "",
    status: "available", // No usar 'as const' aquí para permitir todos los estados de Building.status
  })

  useEffect(() => {
    if (building) {
      setFormData({
        name: building.name,
        owner_name: building.owner_name || "ANA GOREJKO",
        owner_ci: building.owner_ci || "2.362.226",
        address: building.address || "",
        description: building.description || "",
        status: building.status
      })
    }
  }, [building])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return

    setLoading(true)
    try {
      if (building) {
        const { error } = await supabase.from("buildings").update(formData).eq("id", building.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("buildings").insert(formData)
        if (error) throw error
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving building:", error)
      alert("Error al guardar el edificio")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Nombre Edificio</label>
          <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Torre Plaza" />
        </div>
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Estado</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none">
            <option value="available">Disponible</option>
            <option value="rented">Alquilado</option>
            <option value="maintenance">Mantenimiento</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="owner_name" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Titular / DueÃ±o</label>
          <input id="owner_name" name="owner_name" type="text" required value={formData.owner_name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold outline-none" placeholder="Nombre completo" />
        </div>
        <div className="space-y-2">
          <label htmlFor="owner_ci" className="text-sm font-bold text-slate-400 uppercase tracking-wider">CI del Titular</label>
          <input id="owner_ci" name="owner_ci" type="text" required value={formData.owner_ci} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold outline-none" placeholder="1.234.567" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-bold text-slate-400 uppercase tracking-wider">DirecciÃ³n</label>
        <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" placeholder="UbicaciÃ³n exacta" />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-lg transition-all" disabled={loading}>
          {loading ? "Procesando..." : (building ? "Actualizar Edificio" : "Registrar Edificio")}
        </Button>
      </div>
    </form>
  )
}

