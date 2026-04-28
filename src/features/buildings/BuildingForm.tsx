import { useState } from "react"
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
    name: building?.name || "",
    owner_name: building?.owner_name || "ANA GOREJKO",
    owner_ci: building?.owner_ci || "2.362.226",
    address: building?.address || "",
    description: building?.description || "",
    status: building?.status || "available",
    property_type: (building?.property_type || "building") as "building" | "house",
    price: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return

    setLoading(true)
    try {
      const buildingPayload = {
        name: formData.name,
        owner_name: formData.owner_name,
        owner_ci: formData.owner_ci,
        address: formData.address,
        description: formData.description,
        status: formData.status,
        property_type: formData.property_type
      }

      let buildingId = building?.id

      if (building) {
        const { error } = await supabase.from("buildings").update(buildingPayload).eq("id", building.id)
        if (error) throw new Error(`Error al actualizar: ${error.message}`)
      } else {
        // Insertamos sin .single() para evitar errores de RLS si el SELECT falla
        const { data, error } = await supabase
          .from("buildings")
          .insert(buildingPayload)
          .select('id')
        
        if (error) throw new Error(`Error al crear inmueble: ${error.message}`)
        if (!data || data.length === 0) throw new Error("No se pudo obtener el ID del nuevo inmueble (RLS?)")
        
        buildingId = data[0].id

        // Si es casa, creamos la unidad
        if (formData.property_type === "house" && buildingId) {
          const { error: unitError } = await supabase.from("units").insert({
            building_id: buildingId,
            unit_number: "Casa Única",
            price: formData.price,
            status: formData.status,
            bedrooms: 1,
            bathrooms: 1,
            has_balcony: false,
            sq_meters: 0,
            floor: "PB"
          })
          
          if (unitError) throw new Error(`Inmueble creado, pero falló la unidad: ${unitError.message}`)
        }
      }
      onSuccess()
    } catch (error) {
      console.error("DEBUG:", error)
      const message = error instanceof Error ? error.message : "Error desconocido al guardar"
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const finalValue = type === "number" ? Number(value) : value
    setFormData({ ...formData, [name]: finalValue })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
      <div className="flex gap-4 p-1 bg-slate-950 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, property_type: "building" }))}
          className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
            formData.property_type === "building" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          🏢 Edificio
        </button>
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, property_type: "house" }))}
          className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
            formData.property_type === "house" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          🏠 Casa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Nombre del Inmueble</label>
          <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder={formData.property_type === "house" ? "Casa Quinta..." : "Torre Plaza..."} />
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

      {formData.property_type === "house" && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
          <label htmlFor="price" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Precio de Alquiler (Gs.)</label>
          <input id="price" name="price" type="number" required value={formData.price} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-black outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="owner_name" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Titular / Dueño</label>
          <input id="owner_name" name="owner_name" type="text" required value={formData.owner_name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold outline-none" placeholder="Nombre completo" />
        </div>
        <div className="space-y-2">
          <label htmlFor="owner_ci" className="text-sm font-bold text-slate-400 uppercase tracking-wider">CI del Titular</label>
          <input id="owner_ci" name="owner_ci" type="text" required value={formData.owner_ci} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold outline-none" placeholder="1.234.567" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Dirección</label>
        <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" placeholder="Ubicación exacta" />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-lg transition-all" disabled={loading}>
          {loading ? "Procesando..." : (building ? "Actualizar Inmueble" : "Registrar Inmueble")}
        </Button>
      </div>
    </form>
  )
}
