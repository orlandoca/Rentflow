import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Building } from "@/types"

interface BuildingListProps {
  onEdit: (building: Building) => void // FunciÃ³n para avisar quÃ© edificio editar
}

export default function BuildingList({ onEdit }: BuildingListProps) {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBuildings() {
      try {
        const { data, error } = await supabase
          .from("buildings")
          .select("*")
          .order("name", { ascending: true })

        if (error) throw error
        setBuildings(data || [])
      } catch (error) {
        console.error("Error fetching buildings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBuildings()
  }, [])

  if (loading) return <div className="p-4 text-slate-400 font-bold animate-pulse">Cargando edificios...</div>

  if (buildings.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800"> 
        <p className="text-slate-500 font-bold italic">No hay edificios registrados en el sistema.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {buildings.map((building) => (
        <div
          key={building.id}
          className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all shadow-xl group"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                  {building.name}
                </h3>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter border ${
                  building.property_type === 'house' 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                    : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                }`}>
                  {building.property_type === 'house' ? '🏠 Casa' : '🏢 Edificio'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit">
                <span>👤</span>
                <span>Titular: {building.owner_name || "No definido"}</span>
              </div>
              
              <p className="text-sm text-slate-500 font-bold pt-1 flex items-center gap-2">
                <span>📍</span>
                {building.address || "Sin dirección registrada"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <span className={`text-[10px] uppercase px-3 py-1.5 rounded-full font-black tracking-tighter border ${
                building.status === "available" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                building.status === "rented" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                "bg-orange-500/10 text-orange-500 border-orange-500/20"
              }`}>
                {building.status === "available" ? "Disponible" :
                 building.status === "rented" ? "Alquilado" : "Mantenimiento"}
              </span>

              {/* BOTÃ“N DE EDITAR */}
              <button
                onClick={() => onEdit(building)}
                className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700 hover:border-blue-500 shadow-lg"
                title="Editar Datos del Edificio"
              >
                ✏️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
