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
      
      setFormData({ building_id: '', unit_number: '', floor: '', description: '', price: 0, status: 'available' })
      onSuccess()
    } catch (error) {
      console.error('Error saving unit:', error)
      alert('Error al guardar el departamento')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-slate-900 rounded-2xl border border-slate-800">
      <div className="space-y-2">
        <label htmlFor="building_id" className="text-sm font-medium text-slate-300">
          Edificio
        </label>
        <select
          id="building_id"
          name="building_id"
          required
          value={formData.building_id}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none"
        >
          <option value="">Seleccionar Edificio...</option>
          {buildings.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="unit_number" className="text-sm font-medium text-slate-300">
            Número de Depto
          </label>
          <input
            id="unit_number"
            name="unit_number"
            type="text"
            required
            value={formData.unit_number}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="Ej: 201-A"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="floor" className="text-sm font-medium text-slate-300">
            Piso
          </label>
          <input
            id="floor"
            name="floor"
            type="text"
            value={formData.floor}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="Ej: 2do"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="price" className="text-sm font-medium text-slate-300">
          Precio de Alquiler (Gs.)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          required
          value={formData.price}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          placeholder="2500000"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        disabled={loading || buildings.length === 0}
      >
        {loading ? 'Guardando...' : 'Guardar Departamento'}
      </Button>
      {buildings.length === 0 && (
        <p className="text-[10px] text-orange-500 text-center italic">
          * Debes crear un edificio primero antes de registrar departamentos.
        </p>
      )}
    </form>
  )
}
