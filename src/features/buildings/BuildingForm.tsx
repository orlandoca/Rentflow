import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

interface BuildingFormProps {
  onSuccess: () => void
}

export default function BuildingForm({ onSuccess }: BuildingFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    status: 'available' as const
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('buildings')
        .insert(formData)

      if (error) throw error
      
      setFormData({ name: '', address: '', description: '', status: 'available' })
      onSuccess()
    } catch (error) {
      console.error('Error saving building:', error)
      alert('Error al guardar el edificio')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-slate-900 rounded-2xl border border-slate-800">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-slate-300">
          Nombre del Edificio / Depto
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          placeholder="Ej: Edificio Plaza - Depto 201"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium text-slate-300">
          Dirección
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          placeholder="Calle 123 entre..."
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium text-slate-300">
          Estado Inicial
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none"
        >
          <option value="available">Disponible</option>
          <option value="rented">Alquilado</option>
          <option value="maintenance">Mantenimiento</option>
        </select>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        disabled={loading}
      >
        {loading ? 'Guardando...' : 'Guardar Edificio'}
      </Button>
    </form>
  )
}
