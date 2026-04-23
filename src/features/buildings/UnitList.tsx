import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Unit } from '@/types'

export default function UnitList() {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUnits() {
      try {
        // Traemos las unidades y hacemos join con buildings para el nombre
        const { data, error } = await supabase
          .from('units')
          .select('*, building:buildings(name)')
          .order('unit_number', { ascending: true })

        if (error) throw error
        setUnits(data || [])
      } catch (error) {
        console.error('Error fetching units:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUnits()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY').format(price)
  }

  if (loading) return <div className="p-4 text-slate-400">Cargando departamentos...</div>

  if (units.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
        <p className="text-slate-500">No hay departamentos registrados.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {units.map((unit) => (
        <div 
          key={unit.id} 
          className="p-4 bg-slate-950 border border-slate-900 rounded-xl hover:border-slate-800 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg">Depto {unit.unit_number}</h3>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase tracking-tighter">
                  Piso {unit.floor || '-'}
                </span>
              </div>
              <p className="text-sm text-blue-400 font-medium">{unit.building?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-400 font-black">Gs. {formatPrice(unit.price)}</p>
              <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-black ${
                unit.status === 'available' ? 'bg-emerald-500/10 text-emerald-500' :
                unit.status === 'rented' ? 'bg-blue-500/10 text-blue-500' :
                'bg-orange-500/10 text-orange-500'
              }`}>
                {unit.status === 'available' ? 'Libre' : 
                 unit.status === 'rented' ? 'Ocupado' : 'Mantenimiento'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
