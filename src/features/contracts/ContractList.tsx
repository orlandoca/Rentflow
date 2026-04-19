import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Contract } from '@/types'

export default function ContractList() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContracts() {
      try {
        const { data, error } = await supabase
          .from('contracts')
          .select('*, tenant:tenants(full_name), unit:units(unit_number, building:buildings(name))')
          .order('created_at', { ascending: false })

        if (error) throw error
        setContracts(data || [])
      } catch (error) {
        console.error('Error fetching contracts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY').format(price)
  }

  if (loading) return <div className="p-4 text-slate-400">Cargando contratos...</div>

  if (contracts.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
        <p className="text-slate-500">No hay contratos activos.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {contracts.map((contract) => (
        <div 
          key={contract.id} 
          className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/30 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-bold text-white">{contract.tenant?.full_name}</h3>
              <p className="text-xs text-blue-400 font-medium">
                {contract.unit?.building?.name} - Depto {contract.unit?.unit_number}
              </p>
              <p className="text-[10px] text-slate-500">
                Desde: {new Date(contract.start_date).toLocaleDateString()} · Hasta: {new Date(contract.end_date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <p className="text-emerald-400 font-black">Gs. {formatPrice(contract.monthly_amount)}</p>
              {contract.contract_url && (
                <a 
                  href={contract.contract_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-blue-300 px-2 py-1 rounded transition-colors"
                >
                  Ver PDF Firmado
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
