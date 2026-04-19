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
    owner_name: 'ANA GOREJKO', // Default para mantener compatibilidad
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

      setFormData({ name: '', owner_name: 'ANA GOREJKO', address: '', description: '', status: 'available' })
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
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Nombre del Edificio / Complejo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all"
          placeholder="Ej: Torre Plaza"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="owner_name" className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Titular / Propietario Legal
        </label>
        <input
          id="owner_name"
          name="owner_name"
          type="text"
          required
          value={formData.owner_name}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-emerald-400 font-bold transition-all"
          placeholder="Nombre o Empresa"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          DirecciÃ³n
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all"
          placeholder="UbicaciÃ³n del inmueble"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Estado Inicial
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none transition-all"
        >
          <option value="available">Disponible</option>
          <option value="rented">Alquilado</option>
          <option value="maintenance">Mantenimiento</option>
        </select>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-900/20 transition-all"
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Registrar Edificio'}
        </Button>
      </div>
    </form>
  )
}
