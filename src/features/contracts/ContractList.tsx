import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Contract } from "@/types"

interface ContractListProps {
  onViewDetails: (id: string) => void
}

export default function ContractList({ onViewDetails }: ContractListProps) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContracts() {
      try {
        const { data, error } = await supabase
          .from("contracts")
          .select("*, tenant:tenants(*), unit:units(*, building:buildings(*))")
          .order("created_at", { ascending: false })

        if (error) throw error
        setContracts(data as any || [])
      } catch (error) {
        console.error("Error fetching contracts:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchContracts()
  }, [])

  if (loading) return <div className="p-4 text-slate-400 font-bold animate-pulse">Cargando contratos...</div>

  if (contracts.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800"> 
        <p className="text-slate-500 font-bold italic">No hay contratos registrados.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {contracts.map((contract) => (
        <div
          key={contract.id}
          onClick={() => onViewDetails(contract.id)}
          className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all shadow-xl group cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors uppercase">
                    {contract.tenant?.full_name}
                  </h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Contrato #{contract.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                  <span>🏢</span>
                  {contract.unit?.building?.name} - {contract.unit?.unit_number}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg">
                  <span>💰</span>
                  Gs. {contract.monthly_amount.toLocaleString("es-PY")}
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2">
              <span className={`text-[10px] uppercase px-3 py-1.5 rounded-full font-black tracking-tighter border ${
                contract.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                contract.status === "finished" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                "bg-orange-500/10 text-orange-500 border-orange-500/20"
              }`}>
                {contract.status === "active" ? "Vigente" :
                 contract.status === "finished" ? "Finalizado" : "Cancelado"}
              </span>
              <p className="text-[10px] text-slate-600 font-bold uppercase">
                Vence: {new Date(contract.end_date).toLocaleDateString("es-PY")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

