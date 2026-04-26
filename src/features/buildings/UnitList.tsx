import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Unit } from "@/types"

export default function UnitList() {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUnits()
  }, [])

  async function fetchUnits() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("units")
        .select("*, building:buildings(name)")
        .order("unit_number")

      if (error) throw error
      if (data) setUnits(data as any)
    } catch (error) {
      console.error("Error fetching units:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => new Intl.NumberFormat("es-PY").format(price)

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold animate-pulse uppercase tracking-widest">Cargando inventario...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {units.length === 0 ? (
        <div className="col-span-full p-12 bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl text-center">
          <p className="text-slate-500 font-bold">No hay departamentos registrados.</p>
        </div>
      ) : (
        units.map((unit) => (
          <div key={unit.id} className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] space-y-4 hover:border-blue-500/50 transition-all group shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-2xl font-black text-white tracking-tight">Depto {unit.unit_number}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{unit.building?.name} · Piso {unit.floor || '-'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                unit.status === 'available' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                unit.status === 'rented' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' :
                'bg-orange-500/10 text-orange-500 border-orange-500/30'
              }`}>
                {unit.status === 'available' ? 'Disponible' : unit.status === 'rented' ? 'Alquilado' : 'Mantenimiento'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50 flex items-center gap-3">
                <span className="text-lg">🛏️</span>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Habit.</p>
                  <p className="text-xs font-black text-white">{unit.bedrooms || 1}</p>
                </div>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50 flex items-center gap-3">
                <span className="text-lg">🚿</span>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Baños</p>
                  <p className="text-xs font-black text-white">{unit.bathrooms || 1}</p>
                </div>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50 flex items-center gap-3">
                <span className="text-lg">📏</span>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Área</p>
                  <p className="text-xs font-black text-white">{unit.sq_meters || '-'} m²</p>
                </div>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50 flex items-center gap-3">
                <span className="text-lg">{unit.has_balcony ? '🌅' : '🚫'}</span>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Balcón</p>
                  <p className="text-xs font-black text-white">{unit.has_balcony ? 'Sí' : 'No'}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Alquiler Sugerido</p>
                <p className="text-emerald-400 font-black text-lg tracking-tighter">Gs. {formatPrice(unit.price)}</p>
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors cursor-pointer">
                →
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
