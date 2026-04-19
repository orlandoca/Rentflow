import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Tenant, Unit } from '@/types'
import { generateContractPDF } from '@/lib/contractGenerator'

interface ContractFormProps {
  onSuccess: () => void
}

export default function ContractForm({ onSuccess }: ContractFormProps) {
  const [loading, setLoading] = useState(false)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [file, setFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    tenant_id: '',
    unit_id: '',
    start_date: '',
    end_date: '',
    monthly_amount: 0,
    deposit_amount: 0,
    status: 'active' as const
  })

  useEffect(() => {
    async function fetchData() {
      const [tenantsRes, unitsRes] = await Promise.all([
        supabase.from('tenants').select('id, full_name').order('full_name'),
        supabase.from('units').select('id, unit_number, price, building:buildings(name)').eq('status', 'available')
      ])
      if (tenantsRes.data) setTenants(tenantsRes.data as any)
      if (unitsRes.data) setUnits(unitsRes.data as any)
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.tenant_id || !formData.unit_id || !formData.start_date || !formData.end_date) return

    setLoading(true)
    try {
      let contract_url = ''

      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${formData.tenant_id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('contracts')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('contracts')
          .getPublicUrl(filePath)
        
        contract_url = publicUrl
      }

      const { error: contractError } = await supabase
        .from('contracts')
        .insert({ ...formData, contract_url })

      if (contractError) throw contractError

      await supabase
        .from('units')
        .update({ status: 'rented' })
        .eq('id', formData.unit_id)

      onSuccess()
    } catch (error) {
      console.error('Error saving contract:', error)
      alert('Error al guardar el contrato')
    } finally {
      setLoading(false)
    }
  }

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const unitId = e.target.value
    const selectedUnit = units.find(u => u.id === unitId)
    setFormData({ 
      ...formData, 
      unit_id: unitId, 
      monthly_amount: selectedUnit?.price || 0 
    })
  }

  const handlePreview = () => {
    const tenant = tenants.find(t => t.id === formData.tenant_id)
    const unit = units.find(u => u.id === formData.unit_id)
    
    if (!tenant || !unit || !formData.start_date || !formData.end_date) {
      alert('Por favor completa los datos básicos para la previsualización')
      return
    }

    generateContractPDF({
      tenant,
      unit,
      building: (unit as any).building,
      startDate: formData.start_date,
      endDate: formData.end_date,
      monthlyAmount: formData.monthly_amount,
      depositAmount: formData.deposit_amount
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-slate-900 rounded-2xl border border-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="tenant_id" className="text-sm font-medium text-slate-300">Inquilino</label>
          <select
            id="tenant_id"
            name="tenant_id"
            required
            value={formData.tenant_id}
            onChange={(e) => setFormData({...formData, tenant_id: e.target.value})}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white appearance-none"
          >
            <option value="">Seleccionar Inquilino...</option>
            {tenants.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="unit_id" className="text-sm font-medium text-slate-300">Departamento (Disponibles)</label>
          <select
            id="unit_id"
            name="unit_id"
            required
            value={formData.unit_id}
            onChange={handleUnitChange}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white appearance-none"
          >
            <option value="">Seleccionar Depto...</option>
            {units.map(u => (
              <option key={u.id} value={u.id}>
                {u.building?.name} - {u.unit_number}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="start_date" className="text-sm font-medium text-slate-300">Fecha de Inicio</label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            required
            value={formData.start_date}
            onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="end_date" className="text-sm font-medium text-slate-300">Fecha de Fin</label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            required
            value={formData.end_date}
            onChange={(e) => setFormData({...formData, end_date: e.target.value})}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="monthly_amount" className="text-sm font-medium text-slate-300">Monto Mensual (Gs.)</label>
          <input
            id="monthly_amount"
            name="monthly_amount"
            type="number"
            required
            value={formData.monthly_amount}
            onChange={(e) => setFormData({...formData, monthly_amount: Number(e.target.value)})}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="deposit_amount" className="text-sm font-medium text-slate-300">Garantía / Depósito (Gs.)</label>
          <input
            id="deposit_amount"
            name="deposit_amount"
            type="number"
            value={formData.deposit_amount}
            onChange={(e) => setFormData({...formData, deposit_amount: Number(e.target.value)})}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="contract_file" className="text-sm font-medium text-slate-300">Contrato Escaneado (PDF/Imagen)</label>
        <input
          id="contract_file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
      </div>

      <div className="flex gap-4">
        <Button 
          type="button"
          onClick={handlePreview}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
        >
          Previsualizar PDF
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Guardar Contrato'}
        </Button>
      </div>
    </form>
  )
}
