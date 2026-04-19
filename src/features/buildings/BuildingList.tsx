import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Building } from '@/types'

export default function BuildingList() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBuildings() {
      try {
        const { data, error } = await supabase
          .from('buildings')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error
        setBuildings(data || [])
      } catch (error) {
        console.error('Error fetching buildings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBuildings()
  }, [])

  if (loading) return <div className="p-4 text-slate-400">Cargando edificios...</div>

  if (buildings.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
        <p className="text-slate-500">No hay edificios registrados.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {buildings.map((building) => (
        <div 
          key={building.id} 
          className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white">{building.name}</h3>
              <p className="text-sm text-slate-500">{building.address || 'Sin dirección'}</p>
            </div>
            <div className="text-right">
              <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-bold ${
                building.status === 'available' ? 'bg-emerald-500/10 text-emerald-500' :
                building.status === 'rented' ? 'bg-blue-500/10 text-blue-500' :
                'bg-orange-500/10 text-orange-500'
              }`}>
                {building.status === 'available' ? 'Disponible' : 
                 building.status === 'rented' ? 'Alquilado' : 'Mantenimiento'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
