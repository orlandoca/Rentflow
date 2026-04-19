import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Tenant } from '@/types'

export default function TenantsList() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTenants() {
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .order('full_name', { ascending: true })

        if (error) throw error
        setTenants(data || [])
      } catch (error) {
        console.error('Error fetching tenants:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTenants()
  }, [])

  if (loading) return <div className="p-4 text-slate-400">Cargando inquilinos...</div>

  if (tenants.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
        <p className="text-slate-500">No hay inquilinos registrados.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {tenants.map((tenant) => (
        <div 
          key={tenant.id} 
          className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white">{tenant.full_name}</h3>
              <p className="text-sm text-slate-500">CI: {tenant.ci}</p>
            </div>
            {tenant.phone && (
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">
                {tenant.phone}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
