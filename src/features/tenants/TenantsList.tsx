import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Tenant } from "@/types"

interface TenantsListProps {
  onEdit: (tenant: Tenant) => void
}

export default function TenantsList({ onEdit }: TenantsListProps) {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTenants() {
      try {
        const { data, error } = await supabase
          .from("tenants")
          .select("*")
          .order("full_name", { ascending: true })

        if (error) throw error
        setTenants(data || [])
      } catch (error) {
        console.error("Error fetching tenants:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTenants()
  }, [])

  if (loading) return <div className="p-4 text-slate-400 font-bold animate-pulse">Cargando inquilinos...</div>

  if (tenants.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800"> 
        <p className="text-slate-500 font-bold italic">No hay inquilinos registrados en el sistema.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {tenants.map((tenant) => (
        <div
          key={tenant.id} 
          className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all shadow-xl group"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors uppercase">
                {tenant.full_name}
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1.5 rounded-lg w-fit">
                <span>🆔 CI:</span>
                <span>{tenant.ci}</span>
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                {tenant.phone && (
                  <p className="text-xs text-slate-500 font-bold flex items-center gap-2">
                    <span>📞</span> {tenant.phone}
                  </p>
                )}
                {tenant.email && (
                  <p className="text-xs text-slate-500 font-bold flex items-center gap-2">
                    <span>📧</span> {tenant.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <button
                onClick={() => onEdit(tenant)}
                className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-700 hover:border-emerald-500 shadow-lg"
                title="Editar Datos del Inquilino"
              >
                ✏️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
