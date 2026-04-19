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
          .order('end_date', { ascending: true })

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

  const getExpirationStatus = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { label: 'Vencido', color: 'bg-red-500/20 text-red-500 border-red-500/50', icon: '🚨' }
    if (diffDays <= 30) return { label: `Vence en ${diffDays} días`, color: 'bg-orange-500/20 text-orange-500 border-orange-500/50', icon: '⚠️' }
    return { label: 'Vigente', color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50', icon: '✅' }
  }

  if (loading) return <div className="p-4 text-slate-400">Cargando contratos...</div>

  if (contracts.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
        <p className="text-slate-500">No hay contratos registrados.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {contracts.map((contract) => {
        const status = getExpirationStatus(contract.end_date)
        return (
          <div 
            key={contract.id} 
            className={`p-4 bg-slate-900 border rounded-2xl transition-all duration-300 hover:scale-[1.01] ${status.color.split(' ')[2]}`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-tighter ${status.color}`}>
                    {status.icon} {status.label}
                  </span>
                </div>
                <h3 className="font-black text-white text-lg">{contract.tenant?.full_name}</h3>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">
                  {contract.unit?.building?.name} · Depto {contract.unit?.unit_number}
                </p>
                <div className="flex gap-4 text-[10px] text-slate-500 font-medium">
                  <span>INICIO: {new Date(contract.start_date).toLocaleDateString('es-PY')}</span>
                  <span>FIN: {new Date(contract.end_date).toLocaleDateString('es-PY')}</span>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end gap-3">
                <p className="text-xl text-emerald-400 font-black tracking-tight">
                  Gs. {formatPrice(contract.monthly_amount)}
                </p>
                {contract.contract_url && (
                  <a 
                    href={contract.contract_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[10px] bg-slate-800 hover:bg-blue-600 text-blue-300 hover:text-white px-3 py-1.5 rounded-lg transition-all font-bold"
                  >
                    📄 VER CONTRATO
                  </a>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
