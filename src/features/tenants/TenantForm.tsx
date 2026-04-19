import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

interface TenantFormProps {
  onSuccess: () => void
}

export default function TenantForm({ onSuccess }: TenantFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    ci: '',
    email: '',
    phone: '',
    address: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.full_name || !formData.ci) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('tenants')
        .insert(formData)

      if (error) throw error
      
      setFormData({ full_name: '', ci: '', email: '', phone: '', address: '' })
      onSuccess()
    } catch (error) {
      console.error('Error saving tenant:', error)
      alert('Error al guardar el inquilino')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-slate-900 rounded-2xl border border-slate-800">
      <div className="space-y-2">
        <label htmlFor="full_name" className="text-sm font-medium text-slate-300">
          Nombre Completo
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          value={formData.full_name}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          placeholder="Ej: Juan Pérez"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="ci" className="text-sm font-medium text-slate-300">
          CI
        </label>
        <input
          id="ci"
          name="ci"
          type="text"
          required
          value={formData.ci}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          placeholder="Ej: 1.234.567"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="juan@email.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-slate-300">
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="09xx xxx xxx"
          />
        </div>
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
          placeholder="Calle 123, Asunción"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        disabled={loading}
      >
        {loading ? 'Guardando...' : 'Guardar Inquilino'}
      </Button>
    </form>
  )
}
