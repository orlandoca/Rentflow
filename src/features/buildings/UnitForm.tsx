import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Building } from '@/types'

interface UnitFormProps {
  onSuccess: () => void
}

export default function UnitForm({ onSuccess }: UnitFormProps) {
  const [loading, setLoading] = useState(false)
  const [buildings, setBuildings] = useState<Pick<Building, 'id' | 'name'>[]>([])
  const [formData, setFormData] = useState({
    building_id: '',
    unit_number: '',
    floor: '',
    description: '',
    price: 0,
    bedrooms: 1,
    bathrooms: 1,
    has_balcony: false,
    sq_meters: 0,
    status: 'available' as const
  })

  useEffect(() => {
    async function fetchBuildings() {
      const { data } = await supabase.from('buildings').select('id, name').order('name')
      if (data) setBuildings(data)
    }
    fetchBuildings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.building_id || !formData.unit_number) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('units')
        .insert(formData)

      if (error) throw error
      
      setFormData({ 
        building_id: '', 
        unit_number: '', 
        floor: '', 
        description: '', 
        price: 0, 
        bedrooms: 1,
        bathrooms: 1,
        has_balcony: false,
        sq_meters: 0,
        status: 'available' 
      })
      onSuccess()
    } catch (error) {
      console.error('Error saving unit:', error)
      alert('Error al guardar el departamento')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                       type === 'number' ? Number(value) : value
    setFormData({ ...formData, [name]: finalValue })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="space-y-2">
        <label htmlFor="building_id" className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Edificio
        </label>
        <select
          id="building_id"
          name="building_id"
          required
          value={formData.building_id}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none"
        >
          <option value="">Seleccionar Edificio...</option>
          {buildings.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="unit_number" className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Número de Depto
          </label>
          <input
            id="unit_number"
            name="unit_number"
            type="text"
            required
            value={formData.unit_number}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none"
            placeholder="Ej: 201-A"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="floor" className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Piso
          </label>
          <input
            id="floor"
            name="floor"
            type="text"
            value={formData.floor}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none"
            placeholder="Ej: 2do"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
        <div className="space-y-2">
          <label htmlFor="bedrooms" className="text-[10px] font-bold text-slate-500 uppercase">Habit.</label>
          <input name="bedrooms" type="number" min="1" value={formData.bedrooms} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-center outline-none" />
        </div>
        <div className="space-y-2">
          <label htmlFor="bathrooms" className="text-[10px] font-bold text-slate-500 uppercase">Baños</label>
          <input name="bathrooms" type="number" min="1" value={formData.bathrooms} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-center outline-none" />
        </div>
        <div className="space-y-2">
          <label htmlFor="sq_meters" className="text-[10px] font-bold text-slate-500 uppercase">M2</label>
          <input name="sq_meters" type="number" value={formData.sq_meters} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-center outline-none" />
        </div>
        <div className="flex flex-col items-center justify-center space-y-2">
          <label htmlFor="has_balcony" className="text-[10px] font-bold text-slate-500 uppercase">Balcón</label>
          <input name="has_balcony" type="checkbox" checked={formData.has_balcony} onChange={handleChange} className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="price" className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Precio de Alquiler (Gs.)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          required
          value={formData.price}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 text-emerald-400 font-black outline-none"
          placeholder="2500000"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black h-14 rounded-xl shadow-lg transition-all"
        disabled={loading || buildings.length === 0}
      >
        {loading ? 'Guardando...' : 'Guardar Departamento'}
      </Button>
    </form>
  )
}
